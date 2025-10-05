import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Hand, RotateCcw } from "lucide-react";

export default function DhikrCounter() {
  const [count, setCount] = useState(0);

  const incrementCount = () => {
    setCount(prev => prev + 1);
  };

  const resetCount = () => {
    setCount(0);
  };

  return (
    <div className="bg-gradient-to-br from-[#0E3B1A] to-[#0A2E14] rounded-2xl p-5 text-center border border-amber-400/20 shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_32px_rgba(251,191,36,0.15)] transition-all duration-300" data-testid="dhikr-counter">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
        <Hand className="text-xl text-emerald-950" />
      </div>
      <h3 className="font-black text-amber-400 mb-3 text-base" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif" }}>Dhikr Counter</h3>
      <div className="text-5xl font-black text-amber-400 mb-4 tracking-tight drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]" data-testid="text-dhikr-count">
        {count}
      </div>
      <Button 
        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-emerald-950 py-3 rounded-xl font-black shadow-lg hover:shadow-xl transition-all duration-300 mb-2 hover:scale-105"
        onClick={incrementCount}
        data-testid="button-increment-dhikr"
      >
        Tap to Count
      </Button>
      <Button 
        variant="ghost"
        size="sm"
        className="w-full text-xs text-emerald-300 hover:text-amber-400 transition-colors duration-300"
        onClick={resetCount}
        data-testid="button-reset-dhikr"
      >
        <RotateCcw className="mr-1 h-3 w-3" />
        Reset
      </Button>
    </div>
  );
}
