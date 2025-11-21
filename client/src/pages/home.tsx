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
import Footer from "@/components/footer";
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
        <div className="max-w-2xl mx-auto pb-24">
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
          
          {/* কুরআন বাংলা Section */}
          <section className="p-4">
            <a 
              href="/quran" 
              className="block bg-gradient-to-br from-emerald-800/60 to-emerald-900/60 border-2 border-emerald-400/40 rounded-xl p-6 hover:from-emerald-800/80 hover:to-emerald-900/80 transition-all shadow-lg hover:shadow-emerald-500/20"
              data-testid="link-quran-bangla"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/30 flex items-center justify-center">
                    <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-emerald-200 font-bold text-xl mb-1">📖 কুরআন বাংলা</h3>
                    <p className="text-emerald-300 text-sm">সম্পূর্ণ ১১৪টি সূরা • বাংলা অনুবাদ সহ</p>
                  </div>
                </div>
                <svg className="w-7 h-7 text-emerald-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          </section>

          {/* Beautiful Islamic Names Section */}
          <section className="p-4">
            <a 
              href="https://quranbangla.in/names" 
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-br from-purple-800/60 to-purple-900/60 border-2 border-purple-400/40 rounded-xl p-6 hover:from-purple-800/80 hover:to-purple-900/80 transition-all shadow-lg hover:shadow-purple-500/20"
              data-testid="link-islamic-names"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-purple-500/30 flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-purple-200 font-bold text-xl mb-1">✨ Beautiful Islamic Names</h3>
                    <p className="text-purple-300 text-sm">সুন্দর ইসলামিক নাম • অর্থ সহ</p>
                  </div>
                </div>
                <svg className="w-7 h-7 text-purple-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
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
          
          {/* <DailyQuiz /> */}
          <AsmaUlHusna />
          
          {/* Footer Section - Only on Home Page */}
          <Footer />
        </div>
      </main>

      <BottomNavigation currentPage="home" />
    </div>
  );
}
