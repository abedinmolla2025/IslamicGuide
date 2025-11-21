import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface AyahAudioPlayerProps {
  surahNumber: number;
  ayahNumber: number;
  reciter?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
}

export default function AyahAudioPlayer({
  surahNumber,
  ayahNumber,
  reciter = "ar.alafasy", // Default: Mishary Alafasy
  autoPlay = false,
  onEnded,
}: AyahAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(70);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch audio URL from AlQuran Cloud API
  useEffect(() => {
    const fetchAudioUrl = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/${reciter}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.code !== 200) {
          throw new Error(`API error! code: ${data.code}`);
        }
        
        // Priority: use high quality audio (128kbps) from main audio field
        let selectedUrl = null;
        
        if (data.data.audio) {
          selectedUrl = data.data.audio;
        } else if (data.data.audioSecondary && data.data.audioSecondary.length > 0) {
          // Fallback to secondary audio (64kbps)
          selectedUrl = data.data.audioSecondary[0];
        }
        
        if (!selectedUrl) {
          throw new Error('No audio URL available');
        }
        
        // Ensure HTTPS
        selectedUrl = selectedUrl.replace('http://', 'https://');
        
        console.log(`Loading audio for ${surahNumber}:${ayahNumber} from:`, selectedUrl);
        setAudioUrl(selectedUrl);
      } catch (err) {
        console.error(`Failed to fetch audio URL for ${surahNumber}:${ayahNumber}:`, err);
        setError("অডিও পাওয়া যায়নি");
        setIsLoading(false);
      }
    };

    fetchAudioUrl();
  }, [surahNumber, ayahNumber, reciter]);

  // Initialize audio element and set up event listeners
  useEffect(() => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "metadata";
      audioRef.current.crossOrigin = "anonymous"; // Enable CORS
    }

    const audio = audioRef.current;
    audio.src = audioUrl;

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null); // Clear any previous errors
    };
    
    const handleError = (e: Event) => {
      const audioElement = e.target as HTMLAudioElement;
      const errorCode = audioElement.error?.code;
      const errorMessage = audioElement.error?.message;
      
      console.error(`Audio error for ${surahNumber}:${ayahNumber}:`, {
        code: errorCode,
        message: errorMessage,
        src: audioUrl
      });
      
      let userMessage = "অডিও চালু হচ্ছে না";
      
      if (errorCode === 4) {
        userMessage = "অডিও ফাইল পাওয়া যায়নি";
      } else if (errorCode === 3) {
        userMessage = "অডিও লোড ব্যর্থ হয়েছে";
      } else if (errorCode === 2) {
        userMessage = "নেটওয়ার্ক সমস্যা";
      }
      
      setError(userMessage);
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.pause();
    };
  }, [audioUrl, onEnded, surahNumber, ayahNumber]);

  // Handle volume changes separately to avoid restarting audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Handle auto-play
  useEffect(() => {
    if (autoPlay && audioRef.current && audioUrl && !isPlaying) {
      handlePlay();
    }
  }, [autoPlay, audioUrl]);

  const handlePlay = async () => {
    if (!audioRef.current) return;

    try {
      setError(null);
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Audio play error:", err);
      setError("অডিও চালু করতে ব্যর্থ হয়েছে");
      setIsPlaying(false);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  return (
    <div className="flex items-center gap-3 py-2">
      {/* Play/Pause Button */}
      <Button
        size="icon"
        variant="ghost"
        onClick={isPlaying ? handlePause : handlePlay}
        disabled={isLoading}
        className="bg-emerald-700 hover:bg-emerald-600 text-white"
        data-testid={`button-audio-${surahNumber}-${ayahNumber}`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 ml-0.5" />
        )}
      </Button>

      {/* Volume Control */}
      <div className="flex items-center gap-2 flex-1">
        <Volume2 className="w-4 h-4 text-emerald-300" />
        <Slider
          value={[volume]}
          onValueChange={handleVolumeChange}
          max={100}
          step={1}
          className="w-20"
          data-testid={`slider-volume-${surahNumber}-${ayahNumber}`}
        />
      </div>

      {/* Error Message */}
      {error && (
        <span className="text-xs text-red-400">{error}</span>
      )}
    </div>
  );
}
