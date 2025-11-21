import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLocation } from "wouter";
import { Settings } from "lucide-react";

interface TopBarProps {
  title?: string;
  subtitle?: string;
}

export default function TopBar({ title = "Islamic Companion", subtitle }: TopBarProps) {
  const [, setLocation] = useLocation();

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
          <SheetContent side="left" className="bg-gradient-to-b from-emerald-950 to-emerald-900 text-white border-emerald-700">
            <SheetHeader>
              <SheetTitle className="text-amber-400 text-xl">Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-2">
              <Button
                variant="ghost"
                className="justify-start text-white hover:bg-emerald-800 hover:text-amber-400 gap-3"
                onClick={() => setLocation("/settings")}
                data-testid="link-settings"
              >
                <Settings className="h-5 w-5" />
                <span className="text-base">Settings</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-xl shrink-0">
          <div className="text-white text-3xl font-bold">
            ☪
          </div>
        </div>
        
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
