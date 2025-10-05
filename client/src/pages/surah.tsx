import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookMarked, Printer } from "lucide-react";
import BottomNavigation from "@/components/bottom-navigation";
import { surahs, Surah } from "@/data/surahs";

export default function SurahPage() {
  const [selectedSurah, setSelectedSurah] = useState<Surah>(surahs[0]);

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
                <h1 className="text-xl font-bold text-amber-400">সূরা সমূহ</h1>
                <p className="text-xs text-emerald-100">আরবি • বাংলা উচ্চারণ • বাংলা অর্থ</p>
              </div>
            </div>

            <Card className="bg-gradient-to-b from-emerald-900/40 to-emerald-950/40 border-2 border-amber-400/20 shadow-2xl overflow-hidden" data-testid="surah-card">
              <div className="p-5 space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-emerald-950" data-testid="surah-number">
                      {selectedSurah.number}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-amber-400 mb-1" style={{ fontFamily: "'Noto Naskh Arabic', serif" }} data-testid="surah-name-arabic">
                    {selectedSurah.nameArabic}
                  </h2>
                  <h3 className="text-lg font-semibold text-emerald-100 mb-1" data-testid="surah-name-bengali">
                    {selectedSurah.nameBengali}
                  </h3>
                  <p className="text-xs text-emerald-200 mb-2" data-testid="surah-name-english">
                    {selectedSurah.nameEnglish}
                  </p>
                  <div className="flex justify-center gap-4 text-xs text-emerald-200">
                    <span data-testid="surah-type">{selectedSurah.revelationType}</span>
                    <span>•</span>
                    <span data-testid="surah-ayahs">{selectedSurah.numberOfAyahs} আয়াত</span>
                  </div>
                </div>

                <div 
                  className="text-center p-4 rounded-lg bg-emerald-950/30 shadow-inner whitespace-pre-line"
                  style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif" }}
                  data-testid="surah-arabic"
                >
                  <p className="text-xl leading-loose text-emerald-50">
                    {selectedSurah.fullText}
                  </p>
                </div>

                {selectedSurah.transliteration && (
                  <div className="p-4 rounded-lg bg-gradient-to-b from-amber-400/10 to-amber-400/5" data-testid="surah-transliteration">
                    <p className="font-bold text-sm text-amber-400 mb-2">বাংলা উচ্চারণ:</p>
                    <p className="text-base text-white leading-relaxed font-semibold">
                      {selectedSurah.transliteration}
                    </p>
                  </div>
                )}

                {selectedSurah.translation && (
                  <div className="p-4 rounded-lg bg-emerald-950/20" data-testid="surah-translation">
                    <p className="font-bold text-sm text-amber-400 mb-2">বাংলা অর্থ:</p>
                    <p className="text-sm text-emerald-100 leading-relaxed">
                      {selectedSurah.translation}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button 
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold"
                    onClick={handlePrint}
                    data-testid="button-print"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    প্রিন্ট / Save as PDF
                  </Button>
                </div>

                <p className="text-xs text-emerald-200/70 text-center">
                  মুঠোফোনে পোর্টেট মোডে দেখুন
                </p>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              {surahs.map(surah => (
                <Card
                  key={surah.id}
                  className={`p-3 cursor-pointer transition-all ${
                    selectedSurah.id === surah.id
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
                      <p className="text-sm font-semibold text-amber-400 truncate">
                        {surah.nameBengali}
                      </p>
                      <p className="text-xs text-emerald-200 truncate">
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
