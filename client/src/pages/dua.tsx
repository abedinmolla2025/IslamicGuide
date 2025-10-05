import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Printer, Download } from "lucide-react";
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
                <h1 className="text-xl font-bold text-amber-400">দোয়া সমূহ</h1>
                <p className="text-xs text-emerald-100">আরবি • বাংলা উচ্চারণ • বাংলা অর্থ</p>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap mb-4">
              {categories.map(category => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  className="text-xs bg-emerald-800/30 border-amber-400/20 text-emerald-100 hover:bg-amber-400/20 hover:text-amber-400"
                  onClick={() => setSelectedDua(duas.find(d => d.category === category) || duas[0])}
                  data-testid={`category-${category}`}
                >
                  {category}
                </Button>
              ))}
            </div>

            <Card className="bg-gradient-to-b from-emerald-900/40 to-emerald-950/40 border-2 border-amber-400/20 shadow-2xl overflow-hidden" data-testid="dua-card">
              <div className="p-5 space-y-4">
                <div className="text-center">
                  <h2 className="text-lg font-bold text-amber-400 mb-1" data-testid="dua-title-bengali">
                    {selectedDua.titleBengali}
                  </h2>
                  <p className="text-xs text-emerald-200" data-testid="dua-title-english">
                    {selectedDua.titleEnglish}
                  </p>
                </div>

                <div 
                  className="text-center p-4 rounded-lg bg-emerald-950/30 shadow-inner"
                  style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif" }}
                  data-testid="dua-arabic"
                >
                  <p className="text-xl leading-loose text-emerald-50">
                    {selectedDua.arabic}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-b from-amber-400/10 to-amber-400/5" data-testid="dua-transliteration">
                  <p className="font-bold text-sm text-amber-400 mb-2">বাংলা উচ্চারণ:</p>
                  <p className="text-base text-white leading-relaxed font-semibold">
                    {selectedDua.transliteration}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-emerald-950/20" data-testid="dua-meaning">
                  <p className="font-bold text-sm text-amber-400 mb-2">অর্থ:</p>
                  <p className="text-sm text-emerald-100 leading-relaxed">
                    {selectedDua.meaningBengali}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold"
                    onClick={handlePrint}
                    data-testid="button-print"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    প্রিন্ট
                  </Button>
                </div>

                <p className="text-xs text-emerald-200/70 text-center">
                  মুঠোফোনে পোর্ট্রেট মোডে দেখুন
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
                  <p className="text-sm font-semibold text-amber-400 mb-1">
                    {dua.titleBengali}
                  </p>
                  <p className="text-xs text-emerald-200">
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
