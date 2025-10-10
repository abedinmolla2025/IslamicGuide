import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import InstallPrompt from "@/components/install-prompt";
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="h-full max-w-md mx-auto bg-card shadow-xl islamic-pattern">
          <Toaster />
          <InstallPrompt />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
