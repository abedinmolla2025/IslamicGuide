import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookMarked, Printer } from "lucide-react";
import BottomNavigation from "@/components/bottom-navigation";
import { surahs, Surah } from "@/data/surahs";

export default function SurahPage() {
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-emerald-950 to-emerald-900">
      <div className="flex-1 overflow-hidden pb-16">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                <BookMarked className="w-7 h-7 text-emerald-950" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-amber-400" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif" }}>সূরা সমূহ</h1>
                <p className="text-sm text-emerald-100 font-semibold" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif" }}>আরবি • বাংলা উচ্চারণ • বাংলা অর্থ</p>
              </div>
            </div>

            {selectedSurah && (
              <Card className="bg-[#0E3B1A] border border-[#1D5E2D] shadow-[0_10px_30px_rgba(0,0,0,0.35)] rounded-3xl overflow-hidden max-w-[420px] mx-auto" data-testid="surah-card">
              <div className="bg-gradient-to-b from-[#125022] to-[#0E3B1A] p-6 space-y-5">
                <div className="text-center">
                  <p className="text-white text-xl font-bold mb-4" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif", letterSpacing: '0.02em' }}>
                    বিসমিল্লাহির রহমানির রহীম
                  </p>
                  <div className="w-[72px] h-[72px] mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                    <span className="text-3xl font-black text-emerald-950" data-testid="surah-number">
                      {selectedSurah.number}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-amber-400 mb-2" style={{ fontFamily: "'Noto Naskh Arabic', serif", textShadow: '0 2px 8px rgba(251,191,36,0.3)' }} data-testid="surah-name-arabic">
                    {selectedSurah.nameArabic}
                  </h2>
                  <h3 className="text-[28px] font-black text-emerald-100 mb-2 leading-tight" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif", letterSpacing: '-0.01em' }} data-testid="surah-name-bengali">
                    {selectedSurah.nameBengali}
                  </h3>
                  <p className="text-sm text-emerald-200 mb-3 uppercase tracking-wide font-semibold" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif" }} data-testid="surah-name-english">
                    {selectedSurah.nameEnglish}
                  </p>
                  <div className="flex justify-center gap-4 text-sm text-emerald-200 font-semibold" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif" }}>
                    <span data-testid="surah-type">{selectedSurah.revelationType}</span>
                    <span>•</span>
                    <span data-testid="surah-ayahs">{selectedSurah.numberOfAyahs} আয়াত</span>
                  </div>
                </div>

                <div 
                  className="text-center p-6 rounded-2xl bg-[#0E3B1A] shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] whitespace-pre-line"
                  style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif", fontFeatureSettings: "'liga' 1" }}
                  data-testid="surah-arabic"
                >
                  <p className="text-[30px] leading-[1.6] text-white font-normal antialiased">
                    {selectedSurah.fullText}
                  </p>
                </div>

                {selectedSurah.transliteration && (
                  <div className="p-7 rounded-2xl bg-[#0E3B1A] shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]" data-testid="surah-transliteration">
                    <p className="text-2xl font-bold text-white mb-5 text-center" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif", letterSpacing: '0.02em' }}>বিসমিল্লাহির রহমানির রহীম</p>
                    <div className="my-5"></div>
                    <p className="font-black text-lg text-amber-400 mb-5 border-b border-amber-400/30 pb-3 text-center" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif" }}>বাংলা উচ্চারণ:</p>
                    <p className="text-xl text-white leading-loose font-bold text-center" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif", letterSpacing: '0.02em', lineHeight: '2.2' }}>
                      {selectedSurah.transliteration}
                    </p>
                  </div>
                )}

                {selectedSurah.translation && (
                  <div className="p-7 rounded-2xl bg-[#0F4220]" data-testid="surah-translation">
                    <p className="font-black text-lg text-amber-400 mb-5 border-b border-amber-400/30 pb-3 text-center" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif" }}>বাংলা অর্থ:</p>
                    <p className="text-lg text-[#F5FAD7] leading-loose font-semibold text-center" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif", letterSpacing: '0.02em', lineHeight: '2' }}>
                      {selectedSurah.translation}
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-emerald-950 font-black text-base py-6 shadow-lg"
                    onClick={handlePrint}
                    data-testid="button-print"
                    style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif" }}
                  >
                    <Printer className="w-5 h-5 mr-3" />
                    প্রিন্ট / Save as PDF
                  </Button>
                </div>

                <p className="text-xs text-emerald-200/80 text-center italic font-semibold" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif" }}>
                  মুঠোফোনে পোর্টেট মোডে দেখুন
                </p>
              </div>
            </Card>
            )}

            <div className="grid grid-cols-2 gap-3">
              {surahs.map(surah => (
                <Card
                  key={surah.id}
                  className={`p-3 cursor-pointer transition-all ${
                    selectedSurah?.id === surah.id
                      ? 'bg-amber-400/20 border-2 border-amber-400'
                      : 'bg-emerald-900/30 border border-amber-400/10 hover:border-amber-400/30'
                  }`}
                  onClick={() => setSelectedSurah(surah)}
                  data-testid={`surah-item-${surah.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-400 font-bold text-sm">{surah.number}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-amber-400 truncate" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif" }}>
                        {surah.nameBengali}
                      </p>
                      <p className="text-xs text-emerald-200 truncate font-semibold" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif" }}>
                        {surah.nameEnglish}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      <BottomNavigation currentPage="surah" />
    </div>
  );
}
