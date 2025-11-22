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
  const [hasInitialized, setHasInitialized] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch audio URL from AlQuran Cloud API - ONLY when needed
  const fetchAudioUrl = async (): Promise<boolean> => {
    if (audioUrl) return true; // Already fetched
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🎵 Fetching audio for Surah ${surahNumber}, Ayah ${ayahNumber}`);
      
      const response = await fetch(
        `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/${reciter}`
      );
      
      if (!response.ok) {
        console.error(`❌ HTTP Error ${response.status} for ${surahNumber}:${ayahNumber}`);
        throw new Error('Failed to fetch audio URL');
      }
      
      const data = await response.json();
      
      console.log(`📦 API Response for ${surahNumber}:${ayahNumber}:`, {
        code: data.code,
        hasAudio: !!data.data?.audio,
        hasAudioSecondary: !!data.data?.audioSecondary
      });
      
      if (data.code === 200 && data.data.audioSecondary && data.data.audioSecondary.length > 0) {
        // Use the first CDN URL from audioSecondary array
        const url = data.data.audioSecondary[0];
        console.log(`✅ Using audioSecondary for ${surahNumber}:${ayahNumber}: ${url}`);
        setAudioUrl(url);
        setHasInitialized(true);
        return true;
      } else if (data.data.audio) {
        // Fallback to main audio URL
        const url = data.data.audio;
        console.log(`✅ Using main audio for ${surahNumber}:${ayahNumber}: ${url}`);
        setAudioUrl(url);
        setHasInitialized(true);
        return true;
      } else {
        console.error(`❌ No audio URL found in API response for ${surahNumber}:${ayahNumber}`);
        throw new Error('No audio URL found');
      }
    } catch (err) {
      console.error(`❌ Error fetching audio for ${surahNumber}:${ayahNumber}:`, err);
      setError("অডিও URL লোড করতে ব্যর্থ হয়েছে");
      setIsLoading(false);
      return false;
    }
  };

  // Initialize audio element and set up event listeners
  useEffect(() => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "metadata";
    }

    const audio = audioRef.current;
    audio.src = audioUrl;

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setError("অডিও লোড করতে ব্যর্থ হয়েছে");
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
  }, [audioUrl, onEnded]);

  // Handle volume changes separately to avoid restarting audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Handle auto-play
  useEffect(() => {
    if (autoPlay && !hasInitialized) {
      // Auto-play requested, fetch and play
      fetchAudioUrl();
    }
  }, [autoPlay]);

  useEffect(() => {
    if (autoPlay && audioRef.current && audioUrl && !isPlaying) {
      handlePlay();
    }
  }, [autoPlay, audioUrl]);

  const handlePlay = async () => {
    // If not initialized, fetch audio first
    if (!hasInitialized) {
      const success = await fetchAudioUrl();
      if (!success) return;
      // Wait a bit for audio element to be ready
      await new Promise(resolve => setTimeout(resolve, 100));
    }

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
