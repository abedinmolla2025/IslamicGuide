import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PrayerTimes from "@/components/prayer-times";
import QiblaCompass from "@/components/qibla-compass";
import DhikrCounter from "@/components/dhikr-counter";
import IslamicCalendar from "@/components/islamic-calendar";
import QuranVerse from "@/components/quran-verse";
import AsmaUlHusna from "@/components/asma-ul-husna";
import BottomNavigation from "@/components/bottom-navigation";
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
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
              <span className="text-2xl">☪</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif" }} data-testid="app-title">Islamic Companion</h1>
              <p className="text-sm text-emerald-100 font-semibold flex items-center gap-1" data-testid="location-text">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
                {location?.city || "Loading..."}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-emerald-200 font-semibold uppercase tracking-wider">Today</p>
            <p className="text-lg font-black text-amber-400" style={{ fontFamily: "'Nikosh', 'Kalpurush', sans-serif" }} data-testid="hijri-date">{hijriDate}</p>
          </div>
        </div>
      </header>

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
          <AsmaUlHusna />
        </div>
      </main>

      <BottomNavigation currentPage="home" />
    </div>
  );
}
