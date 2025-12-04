import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  MosqueIcon,
  DuaHandsIcon,
  HadithScrollIcon,
  QuranBookIcon,
  SurahListIcon,
  QiblaCompassIcon,
  HijriCalendarIcon,
  NamesIcon,
  HomeIcon,
} from "./islamic-icons";

interface BottomNavigationProps {
  currentPage: "home" | "qibla" | "quran" | "calendar" | "dua" | "surah" | "mosque" | "hadith" | "names";
}

export default function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const [, setLocation] = useLocation();

  const navigationItems = [
    { id: "home", icon: HomeIcon, label: "হোম", path: "/" },
    { id: "dua", icon: DuaHandsIcon, label: "দোয়া", path: "/dua" },
    { id: "hadith", icon: HadithScrollIcon, label: "হাদিস", path: "/hadith" },
    { id: "surah", icon: SurahListIcon, label: "সূরা", path: "/surah" },
    { id: "mosque", icon: MosqueIcon, label: "মসজিদ", path: "/mosque" },
    { id: "qibla", icon: QiblaCompassIcon, label: "কিবলা", path: "/qibla" },
    { id: "quran", icon: QuranBookIcon, label: "কুরআন", path: "/quran" },
    { id: "names", icon: NamesIcon, label: "নাম", path: "/names" },
    { id: "calendar", icon: HijriCalendarIcon, label: "ক্যালেন্ডার", path: "/calendar" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-950 via-emerald-900 to-emerald-900/95 backdrop-blur-xl border-t border-emerald-700/50 shadow-2xl z-50" data-testid="bottom-navigation">
      <div className="w-full overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex gap-1 items-center px-2 py-2 min-w-max">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-0.5 px-3 py-2 min-w-[52px] transition-all duration-300 ${
                  isActive 
                    ? "text-amber-400 bg-amber-500/10" 
                    : "text-emerald-200 hover:text-amber-300 hover:bg-emerald-800/50"
                }`}
                onClick={() => setLocation(item.path, { replace: false })}
                data-testid={`nav-${item.id}`}
              >
                <IconComponent 
                  size={22}
                  className={`transition-all duration-300 ${
                    isActive 
                      ? 'text-amber-400' 
                      : 'text-emerald-200'
                  }`}
                />
                <span className={`text-[9px] font-medium leading-tight ${isActive ? 'text-amber-400' : 'text-emerald-200'}`}>
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
