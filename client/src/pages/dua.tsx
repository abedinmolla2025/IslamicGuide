import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Printer } from "lucide-react";
import BottomNavigation from "@/components/bottom-navigation";
import { duas, Dua } from "@/data/duas";

export default function DuaPage() {
  const [selectedDua, setSelectedDua] = useState<Dua>(duas[0]);

  const handlePrint = () => {
    window.print();
  };

  const categories = Array.from(new Set(duas.map(d => d.category)));

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-emerald-950 to-emerald-900">
      <div className="flex-1 overflow-hidden pb-16">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-emerald-950" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-amber-400" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>দোয়া সমূহ</h1>
                <p className="text-sm text-emerald-100 font-semibold" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>আরবি • বাংলা উচ্চারণ • বাংলা অর্থ</p>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap mb-4">
              {categories.map(category => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  className="text-sm bg-emerald-800/30 border-amber-400/20 text-emerald-100 hover:bg-amber-400/20 hover:text-amber-400 font-bold"
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                  onClick={() => setSelectedDua(duas.find(d => d.category === category) || duas[0])}
                  data-testid={`category-${category}`}
                >
                  {category}
                </Button>
              ))}
            </div>

            <Card className="bg-[#0E3B1A] border border-[#1D5E2D] shadow-[0_10px_30px_rgba(0,0,0,0.35)] rounded-3xl overflow-hidden max-w-[420px] mx-auto" data-testid="dua-card">
              <div className="bg-gradient-to-b from-[#125022] to-[#0E3B1A] p-6 space-y-5">
                <div className="text-center relative">
                  <p className="text-white text-xl font-bold mb-4" style={{ fontFamily: "'Noto Sans Bengali', sans-serif", letterSpacing: '0.02em' }}>
                    বিসমিল্লাহির রহমানির রহীম
                  </p>
                  <div className="w-[72px] h-[72px] mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                    <span className="text-3xl font-black text-emerald-950">
                      {duas.findIndex(d => d.id === selectedDua.id) + 1}
                    </span>
                  </div>
                  <h2 className="text-[28px] font-black text-amber-400 mb-2 leading-tight" style={{ fontFamily: "'Noto Sans Bengali', sans-serif", textShadow: '0 2px 8px rgba(251,191,36,0.3)', letterSpacing: '-0.01em' }} data-testid="dua-title-bengali">
                    {selectedDua.titleBengali}
                  </h2>
                  <p className="text-sm text-emerald-100 uppercase tracking-wide font-semibold" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }} data-testid="dua-title-english">
                    আরবি • বাংলা উচ্চারণ • বাংলা অর্থ
                  </p>
                </div>

                <div 
                  className="text-center p-6 rounded-2xl bg-[#0E3B1A] shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]"
                  style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif", fontFeatureSettings: "'liga' 1" }}
                  data-testid="dua-arabic"
                >
                  <p className="text-[30px] leading-[1.6] text-white font-normal antialiased">
                    {selectedDua.arabic}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F9B234]" data-testid="dua-transliteration">
                  <p className="font-black text-base text-emerald-950 mb-3" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>বাংলা উচ্চারণ:</p>
                  <p className="text-lg text-emerald-950 leading-relaxed font-bold" style={{ fontFamily: "'Noto Sans Bengali', sans-serif", letterSpacing: '0.01em' }}>
                    {selectedDua.transliteration}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0F4220]" data-testid="dua-meaning">
                  <p className="font-black text-base text-amber-400 mb-3" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>অর্থ:</p>
                  <p className="text-base text-[#F5FAD7] leading-relaxed font-semibold" style={{ fontFamily: "'Noto Sans Bengali', sans-serif", letterSpacing: '0.01em' }}>
                    {selectedDua.meaningBengali}
                  </p>
                </div>

                <div className="pt-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-emerald-950 font-black text-base py-6 shadow-lg"
                    onClick={handlePrint}
                    data-testid="button-print"
                    style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                  >
                    <Printer className="w-5 h-5 mr-3" />
                    প্রিন্ট / Save as PDF
                  </Button>
                </div>

                <p className="text-xs text-emerald-200/80 text-center italic font-semibold" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  মুঠোফোনে পোর্টেট মোডে দেখুন
                </p>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              {duas.map(dua => (
                <Card
                  key={dua.id}
                  className={`p-3 cursor-pointer transition-all ${
                    selectedDua.id === dua.id
                      ? 'bg-amber-400/20 border-2 border-amber-400'
                      : 'bg-emerald-900/30 border border-amber-400/10 hover:border-amber-400/30'
                  }`}
                  onClick={() => setSelectedDua(dua)}
                  data-testid={`dua-item-${dua.id}`}
                >
                  <p className="text-sm font-bold text-amber-400 mb-1" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                    {dua.titleBengali}
                  </p>
                  <p className="text-xs text-emerald-200 font-semibold" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                    {dua.category}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      <BottomNavigation currentPage="dua" />
    </div>
  );
}
