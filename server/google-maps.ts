export interface Mosque {
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

export async function searchNearbyMosques(
  latitude: number,
  longitude: number,
  radius: number = 5000
): Promise<Mosque[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY is not configured");
  }

  try {
    const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours,places.internationalPhoneNumber,places.websiteUri'
      },
      body: JSON.stringify({
        includedTypes: ['mosque'],
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: {
              latitude,
              longitude
            },
            radius
          }
        },
        rankPreference: 'DISTANCE'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Maps API error:', errorText);
      throw new Error(`Google Maps API returned ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.places || data.places.length === 0) {
      return [];
    }

    const mosques: Mosque[] = data.places.map((place: any) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        place.location.latitude,
        place.location.longitude
      );

      return {
        id: place.id,
        name: place.displayName?.text || 'Unknown Mosque',
        address: place.formattedAddress || '',
        location: {
          latitude: place.location.latitude,
          longitude: place.location.longitude
        },
        rating: place.rating,
        userRatingsTotal: place.userRatingCount,
        distance: Math.round(distance * 10) / 10,
        openNow: place.currentOpeningHours?.openNow,
        phoneNumber: place.internationalPhoneNumber,
        website: place.websiteUri
      };
    });

    return mosques.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  } catch (error) {
    console.error('Error searching nearby mosques:', error);
    throw error;
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}
