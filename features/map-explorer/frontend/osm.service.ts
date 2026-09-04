/**
 * OpenStreetMap Client Service (Frontend)
 * Mirrors features/map-explorer/backend/osm_service.py for direct client-side
 * live OpenStreetMap queries via public Overpass and Nominatim APIs.
 */

export interface OSMGeocodeResult {
  latitude: number;
  longitude: number;
  displayName: string;
  type: string;
}

export interface OSMMarketTelemetry {
  source: string;
  isLiveOsm: boolean;
  center: { lat: number; lon: number };
  radiusM: number;
  competitorCount: number;
  competitorDensityPerSqkm: number;
  marketSaturation: 'Low' | 'Medium' | 'High';
  transitHubsCount: number;
  commercialAnchorsCount: number;
  footfallDensity: 'Very High' | 'High' | 'Medium' | 'Low';
  competitors: string[];
}

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];

export const osmClientService = {
  /**
   * Geocode a place query using free OSM Nominatim API
   */
  async geocode(query: string): Promise<OSMGeocodeResult | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
        q: query,
        format: 'json',
        limit: '1',
      })}`;

      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!res.ok) return null;
      const data = await res.json();
      if (!data || data.length === 0) return null;

      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        displayName: data[0].display_name,
        type: data[0].type || 'location',
      };
    } catch (err) {
      console.warn('[OSM Client] Geocode failed, falling back to local coordinates', err);
      return null;
    }
  },

  /**
   * Fetch live competitor and footfall telemetry from OSM Overpass API
   */
  async getMarketTelemetry(
    lat: number,
    lon: number,
    shopType: string = 'cafe',
    radiusM: number = 1000
  ): Promise<OSMMarketTelemetry | null> {
    const isFood = /cafe|coffee|restaurant|food|dining|bakery/i.test(shopType);
    const amenityFilter = isFood ? 'cafe|restaurant|fast_food' : 'shop';

    const overpassQl = `
      [out:json][timeout:15];
      (
        node["amenity"~"${amenityFilter}"](around:${radiusM},${lat},${lon});
        node["highway"="bus_stop"](around:${radiusM},${lat},${lon});
        node["railway"~"station|subway_entrance"](around:${radiusM},${lat},${lon});
        node["amenity"~"bank|college|university"](around:${radiusM},${lat},${lon});
        node["shop"~"mall|supermarket"](around:${radiusM},${lat},${lon});
      );
      out body center 100;
    `;

    for (const endpoint of OVERPASS_ENDPOINTS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `data=${encodeURIComponent(overpassQl)}`,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) continue;
        const data = await res.json();
        const elements: any[] = data.elements || [];

        const namedCompetitors: string[] = [];
        let transitCount = 0;
        let anchorCount = 0;
        let competitorCount = 0;

        for (const el of elements) {
          const tags = el.tags || {};
          const name = tags.name || tags.brand;

          if (tags.highway === 'bus_stop' || tags.railway) {
            transitCount++;
          } else if (tags.shop === 'mall' || tags.shop === 'supermarket' || /bank|college|university/.test(tags.amenity)) {
            anchorCount++;
          } else {
            competitorCount++;
            if (name && !namedCompetitors.includes(name)) {
              namedCompetitors.push(name);
            }
          }
        }

        const areaSqKm = Math.PI * Math.pow(radiusM / 1000, 2);
        const density = competitorCount / Math.max(0.1, areaSqKm);
        const saturation: 'Low' | 'Medium' | 'High' =
          density > 5 ? 'High' : density >= 2 ? 'Medium' : 'Low';

        const transitScore = transitCount * 2 + anchorCount * 3;
        const footfallDensity: 'Very High' | 'High' | 'Medium' | 'Low' =
          transitScore >= 25 ? 'Very High' : transitScore >= 12 ? 'High' : transitScore >= 5 ? 'Medium' : 'Low';

        return {
          source: 'OpenStreetMap Live API',
          isLiveOsm: true,
          center: { lat, lon },
          radiusM,
          competitorCount,
          competitorDensityPerSqkm: Math.round(density * 100) / 100,
          marketSaturation: saturation,
          transitHubsCount: transitCount,
          commercialAnchorsCount: anchorCount,
          footfallDensity,
          competitors: namedCompetitors.slice(0, 8),
        };
      } catch (e) {
        continue;
      }
    }

    return null;
  },
};

