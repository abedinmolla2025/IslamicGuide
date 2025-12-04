import { useState, useEffect } from "react";
import QiblaCompass from "@/components/qibla-compass";
import TopBar from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import { MapPin, AlertCircle, Navigation2, Smartphone } from "lucide-react";
import { updatePageTitle, PAGE_SEO } from "@/lib/seo";

export default function QiblaPage() {
  useEffect(() => {
    updatePageTitle(PAGE_SEO.qibla.title, PAGE_SEO.qibla.description);
  }, []);
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
    <div className="flex flex-col h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950">
      <TopBar 
        title="কিবলা দিক" 
        subtitle="মক্কার কাবা শরীফের দিক" 
      />

      <main className="flex-1 p-4 pb-24 flex items-center justify-center overflow-hidden">
        {loading && !error && (
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-amber-500 border-t-transparent mx-auto"></div>
              <Navigation2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-amber-500" />
            </div>
            <div className="space-y-2">
              <p className="text-white text-lg font-medium">আপনার অবস্থান খুঁজছি...</p>
              <p className="text-amber-200/70 text-sm">অনুগ্রহ করে অপেক্ষা করুন</p>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center space-y-5 max-w-md px-4">
            <div className="bg-amber-500/10 rounded-full p-6 w-fit mx-auto">
              <AlertCircle className="h-16 w-16 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">Location প্রয়োজন</h3>
            <p className="text-amber-100">{error}</p>
            
            <div className="bg-emerald-900/50 p-5 rounded-xl border border-amber-500/30 space-y-4 text-left">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <Smartphone className="h-5 w-5" />
                  <span>ফোনের Location চালু করুন:</span>
                </div>
                <ol className="text-sm text-amber-100 space-y-2 list-decimal list-inside ml-2">
                  <li>ফোনের <span className="font-bold text-white">Settings</span> খুলুন</li>
                  <li><span className="font-bold text-white">Location</span> অথবা <span className="font-bold text-white">স্থান</span> এ যান</li>
                  <li>Location service <span className="font-bold text-green-400">চালু (ON)</span> করুন</li>
                  <li>এই পেজে ফিরে আসুন</li>
                </ol>
              </div>
              <div className="border-t border-amber-500/20 pt-3">
                <p className="text-sm text-amber-100">
                  <span className="text-amber-400 font-semibold">Browser Permission:</span> নিচের বাটন ক্লিক করলে permission চাইবে। <span className="font-bold text-green-400">"Allow"</span> দিন।
                </p>
              </div>
            </div>

            <Button 
              onClick={requestLocation}
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 text-white w-full py-6 text-lg"
              data-testid="button-request-location"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Location চালু করুন
            </Button>
          </div>
        )}

        {location && !error && !loading && (
          <QiblaCompass latitude={location.latitude} longitude={location.longitude} standalone />
        )}
      </main>
    </div>
  );
}
