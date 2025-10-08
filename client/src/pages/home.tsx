import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PrayerTimes from "@/components/prayer-times";
import QiblaCompass from "@/components/qibla-compass";
import DhikrCounter from "@/components/dhikr-counter";
import IslamicCalendar from "@/components/islamic-calendar";
import QuranVerse from "@/components/quran-verse";
import DailyHadith from "@/components/daily-hadith";
import DailyQuiz from "@/components/daily-quiz";
import AsmaUlHusna from "@/components/asma-ul-husna";
import BottomNavigation from "@/components/bottom-navigation";
import TopBar from "@/components/top-bar";
import { getHijriDate } from "@/lib/islamic-calendar";

export default function HomePage() {
  const [location, setLocation] = useState<{ city: string; latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            city: "Current Location",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => {
          // Default to New York if geolocation fails
          setLocation({
            city: "New York, NY",
            latitude: 40.7128,
            longitude: -74.0060
          });
        }
      );
    } else {
      setLocation({
        city: "New York, NY",
        latitude: 40.7128,
        longitude: -74.0060
      });
    }
  }, []);

  const hijriDate = getHijriDate(new Date());

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-emerald-950 to-emerald-900 overflow-hidden">
      <TopBar subtitle={location?.city || "Loading..."} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 scrollbar-thin scrollbar-thumb-emerald-700 scrollbar-track-transparent">
        <div className="max-w-2xl mx-auto">
          {location && (
            <>
              <PrayerTimes latitude={location.latitude} longitude={location.longitude} />
              <QiblaCompass latitude={location.latitude} longitude={location.longitude} />
            </>
          )}
          
          <section className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <DhikrCounter />
              <IslamicCalendar />
            </div>
          </section>

          <QuranVerse />
          <DailyHadith />
          <DailyQuiz />
          <AsmaUlHusna />
        </div>
      </main>

      <BottomNavigation currentPage="home" />
    </div>
  );
}
