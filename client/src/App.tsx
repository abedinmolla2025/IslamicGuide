import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import InstallPrompt from "@/components/install-prompt";
import BottomNavigation from "@/components/bottom-navigation";
import SplashScreen from "@/components/splash-screen";
import HomePage from "@/pages/home";
import DuaPage from "@/pages/dua";
import HadithPage from "@/pages/hadith";
import BukhariPage from "@/pages/bukhari";
import BukhariQuizPage from "@/pages/bukhari-quiz";
import SurahPage from "@/pages/surah";
import QiblaPage from "@/pages/qibla";
import QuranPage from "@/pages/quran";
import NamesPage from "@/pages/names";
import CalendarPage from "@/pages/calendar";
import MosquePage from "@/pages/mosque";
import SettingsPage from "@/pages/settings";
import DownloadPage from "@/pages/DownloadPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/dua" component={DuaPage} />
      <Route path="/hadith" component={HadithPage} />
      <Route path="/bukhari" component={BukhariPage} />
      <Route path="/bukhari-quiz/:type" component={BukhariQuizPage} />
      <Route path="/surah" component={SurahPage} />
      <Route path="/qibla" component={QiblaPage} />
      <Route path="/quran" component={QuranPage} />
      <Route path="/names" component={NamesPage} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/mosque" component={MosquePage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/download" component={DownloadPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const getActivePage = () => {
    if (location === "/") return "home";
    if (location === "/dua") return "dua";
    if (location === "/hadith") return "hadith";
    if (location === "/surah") return "surah";
    if (location === "/mosque") return "mosque";
    if (location === "/qibla") return "qibla";
    if (location === "/quran") return "quran";
    if (location === "/names") return "names";
    if (location === "/calendar") return "calendar";
    return "home";
  };

  const hideNavPages = ["/settings", "/download", "/bukhari", "/bukhari-quiz"];
  const shouldShowNav = !hideNavPages.some(page => location.startsWith(page));

  return (
    <div className="h-full max-w-md mx-auto bg-card shadow-xl islamic-pattern relative">
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen key="splash" onFinish={() => setShowSplash(false)} />
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.5, delay: showSplash ? 0 : 0.2 }}
      >
        <Toaster />
        <InstallPrompt />
        <Router />
        {shouldShowNav && (
          <BottomNavigation currentPage={getActivePage() as any} />
        )}
      </motion.div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
