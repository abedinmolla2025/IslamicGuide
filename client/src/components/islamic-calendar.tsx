import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { getHijriDate } from "@/lib/islamic-calendar";
import { useLocation } from "wouter";

export default function IslamicCalendar() {
  const [, setLocation] = useLocation();
  const today = new Date();
  const hijriDate = getHijriDate(today);
  const [day, monthYear] = hijriDate.split(' ', 2);

  const viewCalendar = () => {
    setLocation("/calendar", { replace: false });
  };

  return (
    <div className="bg-gradient-to-br from-[#0E3B1A] to-[#0A2E14] rounded-2xl p-5 text-center border border-amber-400/20 shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_32px_rgba(251,191,36,0.15)] transition-all duration-300" data-testid="islamic-calendar">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
        <Calendar className="text-xl text-emerald-950" />
      </div>
      <h3 className="font-black text-amber-400 mb-3 text-base" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif" }}>Islamic Calendar</h3>
      <div className="text-5xl font-black text-amber-400 mb-2 tracking-tight drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]" data-testid="text-hijri-day">
        {day}
      </div>
      <div className="text-sm text-emerald-200 mb-4 font-semibold" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif" }} data-testid="text-hijri-month-year">
        {monthYear}
      </div>
      <Button 
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-black shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        onClick={viewCalendar}
        data-testid="button-view-calendar"
      >
        View Calendar
      </Button>
    </div>
  );
}
