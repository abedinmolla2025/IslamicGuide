import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { asmaUlHusna } from "../data/asma-ul-husna";

export default function AsmaUlHusna() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentName = asmaUlHusna[currentIndex];

  const previousName = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : asmaUlHusna.length - 1);
  };

  const nextName = () => {
    setCurrentIndex(prev => prev < asmaUlHusna.length - 1 ? prev + 1 : 0);
  };

  const viewAllNames = () => {
    // For now, we'll just cycle through names
    // In a full implementation, this would navigate to a dedicated page
    nextName();
  };

  return (
    <section className="p-4 pb-6" data-testid="section-asma-ul-husna">
      <h2 className="text-xl font-black mb-4 flex items-center text-amber-400">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg mr-3">
          <Star className="text-emerald-950 w-5 h-5" />
        </div>
        Asma ul Husna
      </h2>
      
      <div className="bg-gradient-to-br from-[#0E3B1A] to-[#0A2E14] rounded-2xl p-7 text-center border border-amber-400/20 shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_32px_rgba(251,191,36,0.15)] transition-all duration-300">
        <div 
          className="text-5xl font-bold mb-4 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]" 
          style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
          data-testid="text-name-arabic"
        >
          {currentName.arabic}
        </div>
        <div className="text-2xl font-bold mb-3 text-white" data-testid="text-name-transliteration">
          {currentName.transliteration}
        </div>
        <div className="text-base text-emerald-200 mb-6 font-semibold" data-testid="text-name-meaning">
          {currentName.meaning}
        </div>
        
        <div className="flex justify-center items-center gap-4 mb-6">
          <Button 
            variant="ghost"
            size="sm"
            className="w-12 h-12 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-400 hover:scale-110 transition-all duration-300"
            onClick={previousName}
            data-testid="button-previous-name"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <span className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full text-sm font-black text-emerald-950 shadow-lg" data-testid="text-name-number">
            {currentIndex + 1} / {asmaUlHusna.length}
          </span>
          <Button 
            variant="ghost"
            size="sm"
            className="w-12 h-12 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-400 hover:scale-110 transition-all duration-300"
            onClick={nextName}
            data-testid="button-next-name"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl font-black shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          onClick={viewAllNames}
          data-testid="button-view-all-names"
        >
          View All 99 Names
        </Button>
      </div>
    </section>
  );
}
