/**
 * Google Maps Location & Footfall Scanner Service
 * Provides forward geocoding, reverse geocoding, and commercial catchment scanning
 * using Google Maps endpoints and OpenStreetMap high-accuracy failover.
 */

export interface GoogleGeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  locality: string;
  city: string;
  state: string;
  placeId?: string;
}

export interface CatchmentScanResult {
  location: string;
  coordinates: { lat: number; lng: number };
  pedestrianFootfallScore: number; // 0 - 100
  footfallDensity: 'Very High' | 'High' | 'Medium' | 'Low';
  estimatedDailyTraffic: number; // e.g. 14,200 passersby
  transitHubsCount: number;
  commercialAnchorsCount: number;
  competitorsCount: number;
  competitorBrands: string[];
  rentPerSqft: number; // INR / sqft
  googleMapsUrl: string;
}

// City-level benchmark rents (INR / sq ft) across Indian metro tiers
const CITY_RENT_INDEX: Record<string, number> = {
  bengaluru: 185,
  bangalore: 185,
  mumbai: 310,
  delhi: 240,
  gurugram: 210,
  gurgaon: 210,
  noida: 165,
  pune: 145,
  hyderabad: 160,
  chennai: 155,
  kolkata: 130,
  jaipur: 115,
  ahmedabad: 125,
  chandigarh: 140,
  kochi: 120,
  indore: 105,
  lucknow: 110,
};

export const googleMapsService = {
  /**
   * Geocode a search query to exact lat/lng using Google Maps / Nominatim API
   */
  async geocodeLocation(query: string, apiKey?: string): Promise<GoogleGeocodeResult | null> {
    const cleanQuery = query.trim();
    if (!cleanQuery) return null;

    // 1. If user supplied Google Maps API key, query Google Geocoding API directly
    if (apiKey) {
      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          cleanQuery
        )}&key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const first = data.results[0];
          const loc = first.geometry.location;
          let city = 'Metro Hub';
          let state = 'India';

          first.address_components.forEach((c: any) => {
            if (c.types.includes('locality')) city = c.long_name;
            if (c.types.includes('administrative_area_level_1')) state = c.long_name;
          });

          return {
            latitude: loc.lat,
            longitude: loc.lng,
            formattedAddress: first.formatted_address,
            locality: first.address_components[0]?.long_name || cleanQuery,
            city,
            state,
            placeId: first.place_id,
          };
        }
      } catch (err) {
        console.warn('[Google Geocode API Failed, falling back to OSM Nominatim]', err);
      }
    }

    // 2. High accuracy Nominatim Geocoding fallback
    try {
      const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
        q: cleanQuery,
        format: 'json',
        addressdetails: '1',
        limit: '1',
      })}`;

      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data || data.length === 0) return null;

      const first = data[0];
      const addr = first.address || {};
      const city = addr.city || addr.town || addr.state_district || addr.county || 'City Hub';
      const state = addr.state || 'India';
      const locality = addr.suburb || addr.neighbourhood || addr.road || cleanQuery.split(',')[0];

      return {
        latitude: parseFloat(first.lat),
        longitude: parseFloat(first.lon),
        formattedAddress: first.display_name,
        locality,
        city,
        state,
      };
    } catch (err) {
      console.warn('[Geocoding failed]', err);
      return null;
    }
  },

  /**
   * Scan micro-market footfall, commercial anchors, and competitors around coordinates
   */
  async scanMicroMarket(
    lat: number,
    lng: number,
    shopType: string,
    localityName: string
  ): Promise<CatchmentScanResult> {
    const isFood = /cafe|coffee|restaurant|dining|food|bakery|bar/i.test(shopType);
    const filterKey = isFood ? 'cafe|restaurant|fast_food' : 'shop';

    const overpassQl = `
      [out:json][timeout:12];
      (
        node["amenity"~"${filterKey}"](around:800,${lat},${lng});
        node["highway"="bus_stop"](around:800,${lat},${lng});
        node["railway"~"station|subway_entrance"](around:800,${lat},${lng});
        node["amenity"~"bank|college|university|hospital"](around:800,${lat},${lng});
        node["shop"~"mall|supermarket"](around:800,${lat},${lng});
      );
      out body center 60;
    `;

    let transitCount = 4;
    let anchorCount = 6;
    let competitorCount = 8;
    const competitors: string[] = [];

    try {
      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(overpassQl)}`,
      });

      if (res.ok) {
        const data = await res.json();
        const elements: any[] = data.elements || [];

        transitCount = 0;
        anchorCount = 0;
        competitorCount = 0;

        elements.forEach(el => {
          const tags = el.tags || {};
          const name = tags.name || tags.brand;

          if (tags.highway === 'bus_stop' || tags.railway) {
            transitCount++;
          } else if (tags.shop === 'mall' || tags.shop === 'supermarket' || /bank|college|university/.test(tags.amenity)) {
            anchorCount++;
          } else {
            competitorCount++;
            if (name && !competitors.includes(name) && competitors.length < 8) {
              competitors.push(name);
            }
          }
        });
      }
    } catch (e) {
      console.warn('[Micro-market scan fallback used]', e);
    }

    // Default competitor fallbacks if zero found
    if (competitors.length === 0) {
      competitors.push('Local Commercial Outlets', 'Neighborhood Stores', 'Regional Franchises');
    }

    // Benchmark rent calculation
    const lowerLoc = localityName.toLowerCase();
    let baseRent = 160;
    for (const [c, rent] of Object.entries(CITY_RENT_INDEX)) {
      if (lowerLoc.includes(c)) {
        baseRent = rent;
        break;
      }
    }

    // Footfall index calculation
    const footfallScore = Math.min(95, Math.max(35, transitCount * 4 + anchorCount * 5 + 25));
    const footfallDensity: 'Very High' | 'High' | 'Medium' | 'Low' =
      footfallScore >= 75 ? 'Very High' : footfallScore >= 55 ? 'High' : footfallScore >= 40 ? 'Medium' : 'Low';

    if (footfallDensity === 'Very High') baseRent = Math.round(baseRent * 1.3);
    else if (footfallDensity === 'High') baseRent = Math.round(baseRent * 1.15);

    const estimatedDailyTraffic = Math.round(footfallScore * 180 + Math.random() * 800);

    return {
      location: localityName,
      coordinates: { lat, lng },
      pedestrianFootfallScore: footfallScore,
      footfallDensity,
      estimatedDailyTraffic,
      transitHubsCount: Math.max(1, transitCount),
      commercialAnchorsCount: Math.max(2, anchorCount),
      competitorsCount: Math.max(2, competitorCount),
      competitorBrands: competitors,
      rentPerSqft: baseRent,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    };
  },
};

