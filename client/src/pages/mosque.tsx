import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import BottomNavigation from "@/components/bottom-navigation";
import TopBar from "@/components/top-bar";
import { MapPin, Navigation, Phone, Globe, Star, Loader2, AlertCircle } from "lucide-react";

interface Mosque {
  id: string;
  name: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  userRatingsTotal?: number;
  distance?: number;
  openNow?: boolean;
  phoneNumber?: string;
  website?: string;
}

export default function MosquePage() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [radius, setRadius] = useState(5000);
  const [requestingLocation, setRequestingLocation] = useState(false);

  const requestLocation = () => {
    if (navigator.geolocation) {
      setRequestingLocation(true);
      setLocationError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setRequestingLocation(false);
        },
        (error) => {
          setLocationError("Location permission denied. Please enable location to find nearby mosques.");
          console.error("Geolocation error:", error);
          setRequestingLocation(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const queryKey = userLocation 
    ? `/api/mosques/nearby?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&radius=${radius}`
    : null;

  const { data: mosques, isLoading, error } = useQuery<Mosque[]>({
    queryKey: [queryKey],
    enabled: !!userLocation && !!queryKey,
  });

  const openInMaps = (mosque: Mosque) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${mosque.location.latitude},${mosque.location.longitude}`;
    window.open(url, '_blank');
  };

  const openDirections = (mosque: Mosque) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${mosque.location.latitude},${mosque.location.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-emerald-950 to-emerald-900">
      <TopBar title="মসজিদ খুঁজুন" subtitle="আশেপাশের মসজিদসমূহ" />

      <main className="flex-1 overflow-hidden pb-16">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {/* Search radius selector */}
            <Card className="bg-emerald-900/30 border border-amber-400/20">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-amber-400">অনুসন্ধান ব্যাসার্ধ</label>
                  <div className="flex gap-2">
                    {[1000, 2000, 5000, 10000].map((r) => (
                      <Button
                        key={r}
                        variant={radius === r ? "default" : "outline"}
                        size="sm"
                        onClick={() => setRadius(r)}
                        className={radius === r ? "bg-amber-500 hover:bg-amber-600" : ""}
                        data-testid={`button-radius-${r}`}
                      >
                        {r >= 1000 ? `${r / 1000}km` : `${r}m`}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {locationError && (
              <Card className="bg-red-900/20 border border-red-500/30">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-400">লোকেশন অ্যাক্সেস প্রয়োজন</p>
                      <p className="text-sm text-red-200">{locationError}</p>
                    </div>
                  </div>
                  <Button
                    onClick={requestLocation}
                    disabled={requestingLocation}
                    className="w-full bg-amber-500 hover:bg-amber-600"
                    data-testid="button-request-location"
                  >
                    {requestingLocation ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        অনুরোধ করা হচ্ছে...
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 mr-2" />
                        লোকেশন অনুমতি দিন
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
                <p className="text-emerald-200 font-semibold">আশেপাশের মসজিদ খুঁজছি...</p>
              </div>
            )}

            {error && (
              <Card className="bg-red-900/20 border border-red-500/30">
                <CardContent className="p-4">
                  <p className="text-sm text-red-200">Failed to load nearby mosques. Please try again.</p>
                </CardContent>
              </Card>
            )}

            {mosques && mosques.length === 0 && (
              <Card className="bg-emerald-900/30 border border-amber-400/20">
                <CardContent className="p-8 text-center">
                  <MapPin className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                  <p className="text-emerald-200 font-semibold">No mosques found in this area</p>
                  <p className="text-sm text-emerald-300 mt-2">Try increasing the search radius</p>
                </CardContent>
              </Card>
            )}

            {mosques && mosques.length > 0 && (
              <>
                <div className="text-center py-2">
                  <p className="text-amber-400 font-bold text-lg">
                    {mosques.length} টি মসজিদ পাওয়া গেছে
                  </p>
                </div>

                <div className="space-y-3">
                  {mosques.map((mosque, index) => (
                    <Card 
                      key={mosque.id} 
                      className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border border-amber-400/20 hover:border-amber-400/40 transition-all"
                      data-testid={`card-mosque-${index}`}
                    >
                      <CardContent className="p-4 space-y-3">
                        {/* Mosque name and distance */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 
                              className="font-bold text-lg text-amber-400 leading-tight"
                              data-testid={`text-mosque-name-${index}`}
                            >
                              {mosque.name}
                            </h3>
                            {mosque.distance !== undefined && (
                              <Badge className="bg-emerald-700 text-white mt-2" data-testid={`badge-distance-${index}`}>
                                <MapPin className="h-3 w-3 mr-1" />
                                {mosque.distance} km
                              </Badge>
                            )}
                          </div>
                          {mosque.openNow !== undefined && (
                            <Badge 
                              className={mosque.openNow ? "bg-green-600" : "bg-red-600"}
                              data-testid={`badge-open-${index}`}
                            >
                              {mosque.openNow ? "Open" : "Closed"}
                            </Badge>
                          )}
                        </div>

                        {/* Address */}
                        <p className="text-sm text-emerald-200 flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span data-testid={`text-address-${index}`}>{mosque.address}</span>
                        </p>

                        {/* Rating */}
                        {mosque.rating && (
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm text-amber-400 font-semibold" data-testid={`text-rating-${index}`}>
                              {mosque.rating.toFixed(1)}
                            </span>
                            {mosque.userRatingsTotal && (
                              <span className="text-xs text-emerald-300">
                                ({mosque.userRatingsTotal} reviews)
                              </span>
                            )}
                          </div>
                        )}

                        {/* Contact info */}
                        <div className="flex flex-wrap gap-2">
                          {mosque.phoneNumber && (
                            <a 
                              href={`tel:${mosque.phoneNumber}`}
                              className="text-xs text-emerald-200 hover:text-amber-400 flex items-center gap-1"
                              data-testid={`link-phone-${index}`}
                            >
                              <Phone className="h-3 w-3" />
                              {mosque.phoneNumber}
                            </a>
                          )}
                          {mosque.website && (
                            <a 
                              href={mosque.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-emerald-200 hover:text-amber-400 flex items-center gap-1"
                              data-testid={`link-website-${index}`}
                            >
                              <Globe className="h-3 w-3" />
                              Website
                            </a>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => openInMaps(mosque)}
                            variant="outline"
                            size="sm"
                            className="flex-1 border-amber-400/30 text-amber-400 hover:bg-amber-400/10"
                            data-testid={`button-view-map-${index}`}
                          >
                            <MapPin className="h-4 w-4 mr-1" />
                            মানচিত্রে দেখুন
                          </Button>
                          <Button
                            onClick={() => openDirections(mosque)}
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                            data-testid={`button-directions-${index}`}
                          >
                            <Navigation className="h-4 w-4 mr-1" />
                            দিকনির্দেশনা
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </main>

      <BottomNavigation currentPage="mosque" />
    </div>
  );
}
