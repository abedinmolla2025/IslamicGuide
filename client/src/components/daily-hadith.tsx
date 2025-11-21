import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { BookText, Share, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import type { Hadith } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

export default function DailyHadith() {
  const [, setLocation] = useLocation();
  
  const getMillisecondsUntilMidnight = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime() - now.getTime();
  };
  
  const { data: hadith, isLoading } = useQuery<Hadith>({
    queryKey: ["/api/hadith/daily"],
    staleTime: getMillisecondsUntilMidnight(),
  });

  const shareHadith = () => {
    if (hadith && navigator.share) {
      navigator.share({
        title: `Hadith - ${hadith.bookName}`,
        text: `${hadith.arabic}\n\n"${hadith.translation}"\n\n- ${hadith.bookName} (${hadith.reference})\nNarrated by ${hadith.narrator}`,
      });
    }
  };

  const browseHadith = () => {
    setLocation("/hadith", { replace: false });
  };

  const refreshHadith = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/hadith/daily"] });
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

  if (!hadith) {
    return (
      <section className="p-4">
        <div className="text-center text-emerald-300">
          Unable to load hadith
        </div>
      </section>
    );
  }

  return (
    <section className="p-4" data-testid="section-daily-hadith">
      <h2 className="text-xl font-black mb-4 flex items-center justify-between text-amber-400">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg mr-3">
            <BookText className="text-emerald-950 w-5 h-5" />
          </div>
          Hadith of the Day
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshHadith}
          className="text-amber-400 hover:text-amber-300 hover:bg-emerald-800/30"
          data-testid="button-refresh-hadith"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </h2>
      
      <div className="bg-gradient-to-br from-[#0E3B1A] to-[#0A2E14] rounded-2xl p-6 border border-amber-400/20 shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_32px_rgba(251,191,36,0.15)] transition-all duration-300 mb-4">
        <div className="bg-gradient-to-b from-amber-400/5 to-transparent rounded-xl p-6 mb-6 border border-amber-400/10">
          <div 
            className="text-center text-4xl font-bold leading-loose text-white mb-6" 
            style={{ 
              fontFamily: "'Noto Naskh Arabic', serif", 
              direction: 'rtl',
              lineHeight: '2.2',
              textShadow: '0 2px 12px rgba(251,191,36,0.2)'
            }}
            data-testid="text-hadith-arabic"
          >
            {hadith.arabic}
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent my-6"></div>
          
          {hadith.translationBengali && hadith.translationBengali !== hadith.translation && (
            <div 
              className="text-xl text-amber-100 text-center leading-loose font-bold mb-4 px-4 py-3" 
              style={{ 
                fontFamily: "'Noto Sans Bengali', 'Nikosh', 'Kalpurush', sans-serif",
                lineHeight: '2',
                letterSpacing: '0.02em'
              }} 
              data-testid="text-hadith-translation-bengali"
            >
              {hadith.translationBengali}
            </div>
          )}
        </div>
        
        <div className="text-base text-emerald-100 text-center leading-relaxed italic px-2" data-testid="text-hadith-translation">
          "{hadith.translation}"
        </div>
        
        {hadith.aiInsightBengali && (
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-400/10 to-amber-400/5 rounded-xl border border-amber-400/20">
            <p className="text-sm text-amber-300 font-bold mb-3 flex items-center gap-2" style={{ fontFamily: "'Noto Sans Bengali', 'Nikosh', 'Kalpurush', sans-serif" }}>
              <span className="w-1 h-4 bg-amber-400 rounded-full"></span>
              আজকের প্রতিফলন
            </p>
            <p className="text-base text-emerald-100 leading-relaxed" style={{ fontFamily: "'Noto Sans Bengali', 'Nikosh', 'Kalpurush', sans-serif", lineHeight: '1.8' }} data-testid="text-hadith-insight-bengali">
              {hadith.aiInsightBengali}
            </p>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-3 border-t border-amber-400/20">
          <span className="text-sm font-semibold" data-testid="text-hadith-reference">
            <span className="text-amber-400">{hadith.bookNameBengali || hadith.bookName}</span>
            <span className="text-emerald-300 mx-1">•</span>
            <span className="text-emerald-300">{hadith.reference}</span>
          </span>
          <Button 
            variant="ghost"
            size="sm"
            onClick={shareHadith}
            className="text-emerald-300 hover:text-amber-400 transition-colors duration-300"
            data-testid="button-share-hadith"
          >
            <Share className="mr-1 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      
      <Button 
        className="w-full bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white py-3 rounded-xl font-black shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        onClick={browseHadith}
        data-testid="button-browse-hadith"
      >
        <BookText className="mr-2 h-5 w-5" />
        Browse Hadith
      </Button>
    </section>
  );
}
