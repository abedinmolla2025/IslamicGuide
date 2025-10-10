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
  const [locationError, setLocationError] = useState<string | null>(null);

  const requestLocation = () => {
    setLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            city: "আপনার অবস্থান",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          // Handle different error types
          let errorMessage = "Location permission denied";
          
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = "Location permission denied. Using default location.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = "Location unavailable. Using default location.";
          } else if (error.code === error.TIMEOUT) {
            errorMessage = "Location request timed out. Using default location.";
          }
          
          setLocationError(errorMessage);
          
          // Default to Dhaka if geolocation fails
          setLocation({
            city: "Dhaka, Bangladesh",
            latitude: 23.8103,
            longitude: 90.4125
          });
        }
      );
    } else {
      setLocationError("Geolocation not supported");
      setLocation({
        city: "Dhaka, Bangladesh",
        latitude: 23.8103,
        longitude: 90.4125
      });
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const hijriDate = getHijriDate(new Date());

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-emerald-950 to-emerald-900 overflow-hidden">
      <TopBar subtitle={location?.city || "Loading..."} />
      
      {/* Location Error Banner */}
      {locationError && (
        <div className="bg-amber-900/50 border-b border-amber-700 px-4 py-2 flex items-center justify-between">
          <p className="text-amber-200 text-sm flex-1">{locationError}</p>
          <button
            onClick={requestLocation}
            data-testid="button-retry-location"
            className="text-amber-400 hover:text-amber-300 text-sm font-semibold underline ml-2"
          >
            Retry
          </button>
        </div>
      )}

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
          
          {/* Bukhari Button */}
          <section className="p-4">
            <a 
              href="/bukhari" 
              className="block bg-gradient-to-br from-amber-900/50 to-amber-950/50 border border-amber-400/30 rounded-lg p-4 hover:from-amber-900/70 hover:to-amber-950/70 transition-all"
              data-testid="link-bukhari"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-amber-400 font-semibold text-lg">সহীহ বুখারী</h3>
                  <p className="text-emerald-200 text-sm mt-1">Sahih al-Bukhari - 7277 Hadiths</p>
                </div>
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          </section>

          {/* Download APK Button */}
          <section className="p-4">
            <a 
              href="/download" 
              className="block bg-gradient-to-br from-blue-900/50 to-blue-950/50 border border-blue-400/30 rounded-lg p-4 hover:from-blue-900/70 hover:to-blue-950/70 transition-all"
              data-testid="link-download"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-blue-400 font-semibold text-lg">📱 Android অ্যাপ ডাউনলোড করুন</h3>
                  <p className="text-emerald-200 text-sm mt-1">APK ডাউনলোড করুন - অফলাইনে ব্যবহার করুন</p>
                </div>
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
            </a>
          </section>
          
          <DailyQuiz />
          <AsmaUlHusna />
        </div>
      </main>

      <BottomNavigation currentPage="home" />
    </div>
  );
}
