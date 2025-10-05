import { Button } from "@/components/ui/button";
import { Home, Compass, BookOpen, Calendar, Baby, Book, BookMarked } from "lucide-react";
import { useLocation } from "wouter";

interface BottomNavigationProps {
  currentPage: "home" | "qibla" | "quran" | "calendar" | "names" | "dua" | "surah";
}

export default function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const [, setLocation] = useLocation();

  const navigationItems = [
    { id: "home", icon: Home, label: "Home", path: "/" },
    { id: "dua", icon: Book, label: "Dua", path: "/dua" },
    { id: "surah", icon: BookMarked, label: "Surah", path: "/surah" },
    { id: "qibla", icon: Compass, label: "Qibla", path: "/qibla" },
    { id: "quran", icon: BookOpen, label: "Quran", path: "/quran" },
    { id: "names", icon: Baby, label: "Names", path: "/names" },
    { id: "calendar", icon: Calendar, label: "Calendar", path: "/calendar" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-950 via-emerald-900 to-emerald-900/95 backdrop-blur-xl border-t border-emerald-700/50 shadow-2xl z-50" data-testid="bottom-navigation">
      <div className="max-w-2xl mx-auto px-2 py-1.5">
        <div className="flex justify-around items-center">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 p-2 min-w-[60px] transition-all duration-300 ${
                  isActive 
                    ? "text-amber-400 scale-110" 
                    : "text-emerald-300 hover:text-amber-300 hover:scale-105"
                }`}
                onClick={() => setLocation(item.path)}
                data-testid={`nav-${item.id}`}
              >
                <div className={`relative ${isActive ? 'animate-pulse' : ''}`}>
                  <IconComponent className={`h-6 w-6 transition-transform duration-300 ${isActive ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : ''}`} />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full"></div>
                  )}
                </div>
                <span className={`text-[10px] font-semibold ${isActive ? 'text-amber-400' : 'text-emerald-200'}`}>{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
