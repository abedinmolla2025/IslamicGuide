import { useState, useEffect } from "react";
import QiblaCompass from "@/components/qibla-compass";
import BottomNavigation from "@/components/bottom-navigation";
import TopBar from "@/components/top-bar";

export default function QiblaPage() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => {
          setLocation({
            latitude: 40.7128,
            longitude: -74.0060
          });
        }
      );
    } else {
      setLocation({
        latitude: 40.7128,
        longitude: -74.0060
      });
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-emerald-950 to-emerald-900">
      <TopBar title="Qibla Direction" subtitle="Find the direction to Kaaba" />

      <main className="flex-1 p-4 pb-20 flex items-center justify-center">
        {location ? (
          <QiblaCompass latitude={location.latitude} longitude={location.longitude} standalone />
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">Loading location...</p>
          </div>
        )}
      </main>

      <BottomNavigation currentPage="qibla" />
    </div>
  );
}
