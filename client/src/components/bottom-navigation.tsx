import { Button } from "@/components/ui/button";
import { Home, Compass, BookOpen, Calendar, User, BookMarked, ScrollText, Library, Building2 } from "lucide-react";
import { useLocation } from "wouter";

interface BottomNavigationProps {
  currentPage: "home" | "qibla" | "quran" | "calendar" | "names" | "dua" | "surah" | "mosque" | "hadith";
}

export default function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const [, setLocation] = useLocation();

  const navigationItems = [
    { id: "home", icon: Home, label: "Home", path: "/" },
    { id: "dua", icon: BookMarked, label: "Dua", path: "/dua" },
    { id: "hadith", icon: ScrollText, label: "Hadith", path: "/hadith" },
    { id: "surah", icon: Library, label: "Surah", path: "/surah" },
    { id: "mosque", icon: Building2, label: "Mosque", path: "/mosque" },
    { id: "qibla", icon: Compass, label: "Qibla", path: "/qibla" },
    { id: "quran", icon: BookOpen, label: "Quran", path: "/quran" },
    { id: "names", icon: User, label: "Names", path: "/names" },
    { id: "calendar", icon: Calendar, label: "Calendar", path: "/calendar" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-950 via-emerald-900 to-emerald-900/95 backdrop-blur-xl border-t border-emerald-700/50 shadow-2xl z-50" data-testid="bottom-navigation">
      <div className="w-full overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex gap-2 items-center px-3 py-3 min-w-max">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${
                  isActive 
                    ? "text-amber-400" 
                    : "text-emerald-200 hover:text-amber-300"
                }`}
                onClick={() => setLocation(item.path)}
                data-testid={`nav-${item.id}`}
              >
                <IconComponent 
                  className={`h-5 w-5 transition-all duration-300 ${
                    isActive 
                      ? 'stroke-[2.5]' 
                      : 'stroke-[2]'
                  }`} 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <span className={`text-[9px] font-semibold ${isActive ? 'text-amber-400' : 'text-emerald-200'}`}>
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
