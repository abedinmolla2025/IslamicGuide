import { Button } from "@/components/ui/button";
import { Home, Compass, BookOpen, Calendar, Smile, Book, BookText, MapPin, Layers } from "lucide-react";
import { useLocation } from "wouter";

interface BottomNavigationProps {
  currentPage: "home" | "qibla" | "quran" | "calendar" | "names" | "dua" | "surah" | "mosque" | "hadith";
}

export default function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const [, setLocation] = useLocation();

  const navigationItems = [
    { id: "home", icon: Home, label: "Home", path: "/" },
    { id: "dua", icon: Book, label: "Dua", path: "/dua" },
    { id: "hadith", icon: BookText, label: "Hadith", path: "/hadith" },
    { id: "surah", icon: Layers, label: "Surah", path: "/surah" },
    { id: "mosque", icon: MapPin, label: "Mosque", path: "/mosque" },
    { id: "qibla", icon: Compass, label: "Qibla", path: "/qibla" },
    { id: "quran", icon: BookOpen, label: "Quran", path: "/quran" },
    { id: "names", icon: Smile, label: "Names", path: "/names" },
    { id: "calendar", icon: Calendar, label: "Calendar", path: "/calendar" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-950 via-emerald-900 to-emerald-900/95 backdrop-blur-xl border-t border-emerald-700/30 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] z-50" data-testid="bottom-navigation">
      <div className="w-full overflow-x-auto scrollbar-hide pb-safe" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex items-stretch justify-start md:justify-center px-2 py-2.5 min-w-max gap-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setLocation(item.path)}
                data-testid={`nav-${item.id}`}
                className={`
                  relative flex flex-col items-center justify-center gap-1 
                  min-w-[68px] px-3 py-2 rounded-xl
                  transition-all duration-300 ease-out
                  touch-manipulation active:scale-95
                  ${isActive 
                    ? "bg-amber-500/15" 
                    : "hover:bg-emerald-800/40 active:bg-emerald-800/60"
                  }
                `}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-400 rounded-full" />
                )}
                
                {/* Icon */}
                <div className={`
                  transition-all duration-300
                  ${isActive ? 'scale-110' : 'scale-100'}
                `}>
                  <IconComponent 
                    className={`
                      h-5 w-5 transition-all duration-300
                      ${isActive 
                        ? 'text-amber-400 stroke-[2.5]' 
                        : 'text-emerald-200 stroke-[2] group-hover:text-amber-300'
                      }
                    `}
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </div>
                
                {/* Label */}
                <span className={`
                  text-[10px] font-semibold leading-tight text-center
                  transition-all duration-300
                  ${isActive 
                    ? 'text-amber-400' 
                    : 'text-emerald-200'
                  }
                `}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
