import { Button } from "@/components/ui/button";
import { Home, Compass, BookOpen, Calendar, Settings, Baby, Book, BookMarked } from "lucide-react";
import { useLocation } from "wouter";

interface BottomNavigationProps {
  currentPage: "home" | "qibla" | "quran" | "calendar" | "names" | "settings" | "dua" | "surah";
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
    { id: "settings", icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="bg-card border-t border-border p-2" data-testid="bottom-navigation">
      <div className="flex justify-around">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center p-2 ${
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setLocation(item.path)}
              data-testid={`nav-${item.id}`}
            >
              <IconComponent className="text-lg mb-1 h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
