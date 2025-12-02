import { Menu, Home, BookMarked, ScrollText, Library, Building2, Compass, BookOpen, Calendar, Settings, User, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useLocation } from "wouter";

interface TopBarProps {
  title?: string;
  subtitle?: string;
}

const menuItems = [
  { id: "home", icon: Home, label: "Home", labelBn: "হোম", path: "/" },
  { id: "dua", icon: BookMarked, label: "Dua", labelBn: "দোয়া", path: "/dua" },
  { id: "hadith", icon: ScrollText, label: "Hadith", labelBn: "হাদিস", path: "/hadith" },
  { id: "surah", icon: Library, label: "Surah", labelBn: "সূরা", path: "/surah" },
  { id: "mosque", icon: Building2, label: "Mosque", labelBn: "মসজিদ", path: "/mosque" },
  { id: "qibla", icon: Compass, label: "Qibla", labelBn: "ক্বিবলা", path: "/qibla" },
  { id: "quran", icon: BookOpen, label: "Quran", labelBn: "কুরআন", path: "/quran" },
  { id: "names", icon: User, label: "Names", labelBn: "নামসমূহ", path: "/names" },
  { id: "calendar", icon: Calendar, label: "Calendar", labelBn: "ক্যালেন্ডার", path: "/calendar" },
  { id: "download", icon: Download, label: "Download", labelBn: "ডাউনলোড", path: "/download" },
  { id: "settings", icon: Settings, label: "Settings", labelBn: "সেটিংস", path: "/settings" },
];

export default function TopBar({ title = "Islamic Companion", subtitle }: TopBarProps) {
  const [location, setLocation] = useLocation();

  return (
    <header className="bg-emerald-800 text-white p-4 shadow-lg">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-emerald-700 shrink-0"
              data-testid="button-menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-gradient-to-b from-emerald-950 to-emerald-900 text-white border-emerald-700 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-amber-400 text-xl flex items-center gap-2">
                <img 
                  src="/icon-192.png" 
                  alt="Islamic Companion" 
                  className="w-8 h-8 rounded-lg"
                />
                Menu
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-1">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location === item.path || (item.path === "/" && location === "");
                
                return (
                  <SheetClose asChild key={item.id}>
                    <Button
                      variant="ghost"
                      className={`justify-start gap-3 py-6 ${
                        isActive 
                          ? "bg-emerald-800 text-amber-400 border-l-4 border-amber-400" 
                          : "text-white hover:bg-emerald-800 hover:text-amber-400"
                      }`}
                      onClick={() => setLocation(item.path, { replace: false })}
                      data-testid={`menu-${item.id}`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <div className="flex flex-col items-start">
                        <span className="text-base font-semibold">{item.labelBn}</span>
                        <span className="text-xs text-emerald-300">{item.label}</span>
                      </div>
                    </Button>
                  </SheetClose>
                );
              })}
            </div>
            
            <div className="mt-8 pt-4 border-t border-emerald-700">
              <p className="text-emerald-400 text-xs text-center">
                Developed by <span className="text-amber-400 font-bold">ABEDIN MOLLA</span>
              </p>
            </div>
          </SheetContent>
        </Sheet>
        
        <img 
          src="/icon-192.png" 
          alt="Islamic Companion" 
          className="w-16 h-16 rounded-lg shadow-xl shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight truncate" data-testid="app-title">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-emerald-100 flex items-center gap-1 truncate" data-testid="location-text">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse shrink-0"></span>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
