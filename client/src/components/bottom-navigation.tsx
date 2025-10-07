import { Button } from "@/components/ui/button";
import { Home, Compass, BookOpen, Calendar, Smile, Book, BookText, MapPin } from "lucide-react";
import { useLocation } from "wouter";

interface BottomNavigationProps {
  currentPage: "home" | "qibla" | "quran" | "calendar" | "names" | "dua" | "surah" | "mosque";
}

export default function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const [, setLocation] = useLocation();

  const navigationItems = [
    { id: "home", icon: Home, label: "Home", path: "/" },
    { id: "dua", icon: Book, label: "Dua", path: "/dua" },
    { id: "mosque", icon: MapPin, label: "Mosque", path: "/mosque" },
    { id: "qibla", icon: Compass, label: "Qibla", path: "/qibla" },
    { id: "quran", icon: BookOpen, label: "Quran", path: "/quran" },
    { id: "names", icon: Smile, label: "Names", path: "/names" },
    { id: "calendar", icon: Calendar, label: "Calendar", path: "/calendar" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-950 via-emerald-900 to-emerald-900/95 backdrop-blur-xl border-t border-emerald-700/50 shadow-2xl z-50" data-testid="bottom-navigation">
      <div className="max-w-2xl mx-auto px-2 py-2.5">
        <div className="flex justify-around items-center">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1.5 p-2 min-w-[60px] transition-all duration-300 ${
                  isActive 
                    ? "text-amber-400" 
                    : "text-emerald-200 hover:text-amber-300 hover:scale-105"
                }`}
                onClick={() => setLocation(item.path)}
                data-testid={`nav-${item.id}`}
              >
                <div className={`relative transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
                  {isActive && (
                    <div className="absolute inset-0 bg-amber-400/20 rounded-xl blur-md"></div>
                  )}
                  <div className={`relative ${isActive ? 'bg-amber-400/10 rounded-xl p-2 border border-amber-400/30' : 'p-2'}`}>
                    <IconComponent 
                      className={`h-6 w-6 transition-all duration-300 ${
                        isActive 
                          ? 'stroke-[2.5] drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]' 
                          : 'stroke-[2]'
                      }`} 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
                  )}
                </div>
                <span className={`text-[10px] font-bold tracking-wide ${isActive ? 'text-amber-400' : 'text-emerald-200'}`}>
                  {item.label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
