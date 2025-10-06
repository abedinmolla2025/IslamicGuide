import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { BookOpen, Share, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import type { QuranVerse as QuranVerseType } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

export default function QuranVerse() {
  const [, setLocation] = useLocation();
  
  const getMillisecondsUntilMidnight = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime() - now.getTime();
  };
  
  const { data: verse, isLoading } = useQuery<QuranVerseType>({
    queryKey: ["/api/quran/random"],
    staleTime: getMillisecondsUntilMidnight(),
  });

  const shareVerse = () => {
    if (verse && navigator.share) {
      navigator.share({
        title: `Quran ${verse.surahName} ${verse.surahNumber}:${verse.verseNumber}`,
        text: `${verse.arabic}\n\n"${verse.translation}"\n\n- Quran ${verse.surahNumber}:${verse.verseNumber}`,
      });
    }
  };

  const browseQuran = () => {
    setLocation("/quran");
  };

  const refreshVerse = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/quran/random"] });
  };

  if (isLoading) {
    return (
      <section className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-emerald-800/30 rounded w-1/3"></div>
          <div className="h-32 bg-emerald-800/30 rounded-2xl"></div>
        </div>
      </section>
    );
  }

  if (!verse) {
    return (
      <section className="p-4">
        <div className="text-center text-emerald-300">
          Unable to load verse
        </div>
      </section>
    );
  }

  return (
    <section className="p-4" data-testid="section-quran-verse">
      <h2 className="text-xl font-black mb-4 flex items-center justify-between text-amber-400">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg mr-3">
            <BookOpen className="text-emerald-950 w-5 h-5" />
          </div>
          Verse of the Day
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshVerse}
          className="text-amber-400 hover:text-amber-300 hover:bg-emerald-800/30"
          data-testid="button-refresh-verse"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </h2>
      
      <div className="bg-gradient-to-br from-[#0E3B1A] to-[#0A2E14] rounded-2xl p-6 border border-amber-400/20 shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_32px_rgba(251,191,36,0.15)] transition-all duration-300 mb-4 space-y-4">
        <div 
          className="text-center mb-5 text-3xl font-semibold leading-relaxed text-white" 
          style={{ fontFamily: "'Noto Naskh Arabic', serif", direction: 'rtl' }}
          data-testid="text-verse-arabic"
        >
          {verse.arabic}
        </div>
        
        {verse.translationBengali && (
          <div className="text-base text-amber-100 text-center leading-relaxed font-bold px-3 py-2 rounded-lg bg-emerald-900/30" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif" }} data-testid="text-verse-translation-bengali">
            {verse.translationBengali}
          </div>
        )}
        
        <div className="text-base text-emerald-100 text-center leading-relaxed italic" data-testid="text-verse-translation">
          "{verse.translation}"
        </div>
        
        {verse.aiInsightBengali && (
          <div className="mt-4 p-4 bg-amber-400/10 rounded-lg border-l-4 border-amber-400">
            <p className="text-sm text-amber-300 font-semibold mb-2" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif" }}>আজকের প্রতিফলন:</p>
            <p className="text-sm text-emerald-100 leading-relaxed" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif" }} data-testid="text-verse-insight-bengali">
              {verse.aiInsightBengali}
            </p>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-3 border-t border-amber-400/20">
          <span className="text-sm font-semibold" data-testid="text-verse-reference">
            <span className="text-amber-400">{verse.surahNameBengali || verse.surahName}</span>
            <span className="text-emerald-300 mx-1">•</span>
            <span className="text-emerald-300">{verse.surahNumber}:{verse.verseNumber}</span>
          </span>
          <Button 
            variant="ghost"
            size="sm"
            onClick={shareVerse}
            className="text-emerald-300 hover:text-amber-400 transition-colors duration-300"
            data-testid="button-share-verse"
          >
            <Share className="mr-1 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      
      <Button 
        className="w-full bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white py-3 rounded-xl font-black shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        onClick={browseQuran}
        data-testid="button-browse-quran"
      >
        <BookOpen className="mr-2 h-5 w-5" />
        Browse Quran
      </Button>
    </section>
  );
}
