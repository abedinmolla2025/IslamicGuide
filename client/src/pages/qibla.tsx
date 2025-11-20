import { useState, useEffect } from "react";
import QiblaCompass from "@/components/qibla-compass";
import BottomNavigation from "@/components/bottom-navigation";
import TopBar from "@/components/top-bar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { MapPin, AlertCircle } from "lucide-react";

export default function QiblaPage() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const requestLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("আপনার browser location সাপোর্ট করে না");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setError(null);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        if (err.code === 1) {
          setError("Browser location permission BLOCK করে দিয়েছে। নিচের নির্দেশনা দেখুন।");
        } else if (err.code === 2) {
          setError("Location পাওয়া যাচ্ছে না। GPS/Location service চালু করুন।");
        } else {
          setError("Location access করতে সমস্যা হচ্ছে।");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-emerald-950 to-emerald-900">
      <TopBar title="Qibla Direction" subtitle="Find the direction to Kaaba" />

      <main className="flex-1 p-4 pb-20 flex items-center justify-center">
        {loading && !error && (
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="text-white">Location খুঁজছি...</p>
          </div>
        )}

        {error && (
          <div className="text-center space-y-4 max-w-md px-4">
            <AlertCircle className="h-16 w-16 text-amber-500 mx-auto" />
            <h3 className="text-xl font-bold text-white">Location Access করুন</h3>
            <p className="text-amber-100">{error}</p>
            
            <div className="bg-amber-900/30 p-4 rounded-lg border border-amber-500/30 space-y-3 text-left">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-amber-400">📱 ফোনের Location চালু করুন:</p>
                <ol className="text-xs text-amber-100 space-y-1 list-decimal list-inside">
                  <li>ফোনের <span className="font-bold text-white">Settings</span> খুলুন</li>
                  <li><span className="font-bold text-white">Location</span> অথবা <span className="font-bold text-white">স্থান</span> option এ যান</li>
                  <li>Location service <span className="font-bold text-green-400">চালু (ON)</span> করুন</li>
                  <li>এই app এ ফিরে আসুন এবং নিচের button click করুন</li>
                </ol>
              </div>
              <div className="border-t border-amber-500/20 pt-2 space-y-1">
                <p className="text-xs font-semibold text-amber-400">🌐 Browser Permission:</p>
                <p className="text-xs text-amber-100">Button click করলে ডিভাইস থেকে permission চাইবে। <span className="font-bold text-green-400">"Allow"</span> দিন।</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-amber-200">
                Qibla direction দেখতে আপনার location প্রয়োজন। 
                Browser থেকে location permission দিন।
              </p>
              <Button 
                onClick={requestLocation}
                className="bg-amber-600 hover:bg-amber-700 text-white"
                data-testid="button-request-location"
              >
                <MapPin className="mr-2 h-4 w-4" />
                আবার চেষ্টা করুন
              </Button>
            </div>
          </div>
        )}

        {location && !error && !loading && (
          <QiblaCompass latitude={location.latitude} longitude={location.longitude} standalone />
        )}
        
        <Footer />
      </main>

      <BottomNavigation currentPage="qibla" />
    </div>
  );
}
