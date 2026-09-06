/**
 * Universal Location Search Service (locationSearch.service.ts)
 * Resolves any Indian city, town, rural tehsil, locality, mall, or street query.
 * Strategy:
 * 1. Checks instant local corridor & tehsil cache
 * 2. If Google Maps API key is configured, queries Google Places/Geocode with 2.5s timeout
 * 3. Automatically falls back to OpenStreetMap Nominatim API (CORS-friendly, covers all of India)
 */

export interface LocationSearchResult {
  label: string;
  formattedAddress: string;
  locality: string;
  city: string;
  state: string;
  pincode?: string;
  lat: number;
  lng: number;
  source: 'Google Maps' | 'OpenStreetMap' | 'Cached Corridor';
  type: string;
}

const CURATED_CORRIDORS: LocationSearchResult[] = [
  {
    label: 'Sanganer Tehsil & Artisan Cluster, Jaipur',
    formattedAddress: 'Sanganer Tehsil, Sanganeri Handblock & Mojari Cluster, Jaipur, Rajasthan 302029',
    locality: 'Sanganer',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302029',
    lat: 26.8188,
    lng: 75.7683,
    source: 'Cached Corridor',
    type: 'Artisan Craft & Rural Mandi Hub'
  },
  {
    label: 'Chomu Block & Krishi Mandi, Jaipur Rural',
    formattedAddress: 'Chomu Mandi, Morija Road, Chomu, Jaipur Rural, Rajasthan 303702',
    locality: 'Chomu',
    city: 'Jaipur Rural',
    state: 'Rajasthan',
    pincode: '303702',
    lat: 27.1685,
    lng: 75.7238,
    source: 'Cached Corridor',
    type: 'Agro-Processing & Mandi Belt'
  },
  {
    label: 'Bassi Tehsil, Jaipur Rural',
    formattedAddress: 'Bassi Main Market, Bassi Tehsil, Jaipur Rural, Rajasthan 303301',
    locality: 'Bassi',
    city: 'Jaipur Rural',
    state: 'Rajasthan',
    pincode: '303301',
    lat: 26.8344,
    lng: 76.0461,
    source: 'Cached Corridor',
    type: 'Woodcraft & Dairy Corridor'
  },
  {
    label: 'Amer Tehsil & Ghati Bazaar, Jaipur',
    formattedAddress: 'Amer Ghati Craft Bazaar, Amer, Jaipur, Rajasthan 302028',
    locality: 'Amer',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302028',
    lat: 26.9855,
    lng: 75.8513,
    source: 'Cached Corridor',
    type: 'Terracotta Pottery & Leather Heritage'
  },
  {
    label: 'Chaksu Tehsil, Jaipur Rural',
    formattedAddress: 'Chaksu Main Bazar, Chaksu, Jaipur Rural, Rajasthan 303901',
    locality: 'Chaksu',
    city: 'Jaipur Rural',
    state: 'Rajasthan',
    pincode: '303901',
    lat: 26.6025,
    lng: 75.9525,
    source: 'Cached Corridor',
    type: 'Rural Handloom & Agri Trade'
  },
  {
    label: 'Raja Park Commercial High-Street, Jaipur',
    formattedAddress: 'Raja Park Main Market, Jaipur, Rajasthan 302004',
    locality: 'Raja Park',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302004',
    lat: 26.8968,
    lng: 75.8276,
    source: 'Cached Corridor',
    type: 'Urban Retail & Fashion Belt'
  },
  {
    label: 'C-Scheme (Subhash Marg / Ahinsa Circle), Jaipur',
    formattedAddress: 'C-Scheme, Ashok Nagar, Jaipur, Rajasthan 302001',
    locality: 'C-Scheme',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302001',
    lat: 26.9095,
    lng: 75.8058,
    source: 'Cached Corridor',
    type: 'Specialty Cafe & Corporate Hub'
  },
  {
    label: 'Malviya Nagar (GT Central Mall Belt), Jaipur',
    formattedAddress: 'Jawahar Lal Nehru Marg, Malviya Nagar, Jaipur, Rajasthan 302017',
    locality: 'Malviya Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302017',
    lat: 26.8528,
    lng: 75.8085,
    source: 'Cached Corridor',
    type: 'Mall Arcade & Gaming Hub'
  },
  {
    label: 'Vaishali Nagar Amrapali Circle, Jaipur',
    formattedAddress: 'Amrapali Circle, Vaishali Nagar, Jaipur, Rajasthan 302021',
    locality: 'Vaishali Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302021',
    lat: 26.9038,
    lng: 75.7432,
    source: 'Cached Corridor',
    type: 'Affluent High-Street Commercial'
  },
  {
    label: 'Koramangala 4th & 5th Block, Bengaluru',
    formattedAddress: '80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
    locality: 'Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    lat: 12.9348,
    lng: 77.6255,
    source: 'Cached Corridor',
    type: 'Tech Coworking & Dining Hub'
  },
  {
    label: 'Indiranagar 100ft Road, Bengaluru',
    formattedAddress: '100 Feet Rd, Defence Colony, Indiranagar, Bengaluru, Karnataka 560038',
    locality: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    lat: 12.9782,
    lng: 77.6412,
    source: 'Cached Corridor',
    type: 'High-End Retail & Lifestyle'
  },
  {
    label: 'Connaught Place Inner & Outer Circle, New Delhi',
    formattedAddress: 'Connaught Place, New Delhi, Delhi 110001',
    locality: 'Connaught Place',
    city: 'Delhi',
    state: 'Delhi NCR',
    pincode: '110001',
    lat: 28.6315,
    lng: 77.2167,
    source: 'Cached Corridor',
    type: 'National Commercial CBD'
  },
  {
    label: 'Bandra West (Linking Road & Pali Hill), Mumbai',
    formattedAddress: 'Linking Road, Bandra West, Mumbai, Maharashtra 400050',
    locality: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    lat: 19.0596,
    lng: 72.8295,
    source: 'Cached Corridor',
    type: 'Luxury Boutique & Food Lounge'
  },
  {
    label: 'FC Road (Fergusson College Rd), Pune',
    formattedAddress: 'FC Road, Deccan Gymkhana, Shivajinagar, Pune, Maharashtra 411004',
    locality: 'FC Road',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411004',
    lat: 18.5210,
    lng: 73.8415,
    source: 'Cached Corridor',
    type: 'Student & Youth Retail'
  },
  {
    label: 'Banjara Hills Road No. 12, Hyderabad',
    formattedAddress: 'Road No. 12, Banjara Hills, Hyderabad, Telangana 500034',
    locality: 'Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    lat: 17.4162,
    lng: 78.4360,
    source: 'Cached Corridor',
    type: 'Luxury Commercial Hub'
  }
];

export const locationSearchService = {
  /**
   * Search any Indian locality or street
   */
  async searchLocations(
    query: string,
    googleApiKey?: string
  ): Promise<LocationSearchResult[]> {
    const cleanQuery = (query || '').trim().toLowerCase();

    // 1. Instant Curated Matches
    const matchedCurated = cleanQuery
      ? CURATED_CORRIDORS.filter(c =>
          c.label.toLowerCase().includes(cleanQuery) ||
          c.formattedAddress.toLowerCase().includes(cleanQuery) ||
          c.locality.toLowerCase().includes(cleanQuery) ||
          c.city.toLowerCase().includes(cleanQuery)
        )
      : CURATED_CORRIDORS.slice(0, 8);

    if (!cleanQuery || cleanQuery.length < 2) {
      return CURATED_CORRIDORS.slice(0, 8);
    }

    // 2. Query Google Maps Geocoding API if key provided with 2.5s timeout
    if (googleApiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          encodeURIComponent(cleanQuery) + '&region=in&key=' + googleApiKey;
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        const data = await res.json();
        if (data.status === 'OK' && Array.isArray(data.results) && data.results.length > 0) {
          const googleResults: LocationSearchResult[] = data.results.slice(0, 5).map((r: any) => {
            let city = 'City';
            let state = 'India';
            let locality = r.address_components[0]?.long_name || cleanQuery;
            let pincode: string | undefined;

            r.address_components.forEach((c: any) => {
              if (c.types.includes('locality')) city = c.long_name;
              if (c.types.includes('administrative_area_level_1')) state = c.long_name;
              if (c.types.includes('postal_code')) pincode = c.long_name;
              if (c.types.includes('sublocality') || c.types.includes('neighborhood')) locality = c.long_name;
            });

            return {
              label: locality + ', ' + city,
              formattedAddress: r.formatted_address,
              locality,
              city,
              state,
              pincode,
              lat: r.geometry.location.lat,
              lng: r.geometry.location.lng,
              source: 'Google Maps',
              type: 'Geocoded Commercial Location'
            };
          });

          return [...googleResults, ...matchedCurated].filter(
            (v, i, a) => a.findIndex(t => t.label.toLowerCase() === v.label.toLowerCase()) === i
          );
        }
      } catch (e) {
        console.warn('[Google Geocode failed or timed out, falling back to OpenStreetMap Nominatim]', e);
      }
    }

    // 3. Fallback: OpenStreetMap Nominatim Search (Open Government Data / Open Source GIS)
    try {
      const osmUrl = 'https://nominatim.openstreetmap.org/search?' + new URLSearchParams({
        q: cleanQuery,
        format: 'json',
        addressdetails: '1',
        countrycodes: 'in',
        limit: '6'
      }).toString();

      const res = await fetch(osmUrl, {
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        const osmList = await res.json();
        if (Array.isArray(osmList) && osmList.length > 0) {
          const osmResults: LocationSearchResult[] = osmList.map((item: any) => {
            const addr = item.address || {};
            const locality =
              addr.suburb ||
              addr.neighbourhood ||
              addr.village ||
              addr.town ||
              addr.road ||
              cleanQuery;
            const city =
              addr.city ||
              addr.town ||
              addr.state_district ||
              addr.county ||
              'Regional Tehsil';
            const state = addr.state || 'India';
            const pincode = addr.postcode;

            return {
              label: locality + ', ' + city,
              formattedAddress: item.display_name,
              locality,
              city,
              state,
              pincode,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              source: 'OpenStreetMap',
              type: item.type ? 'OSM ' + item.type : 'Catchment Point'
            };
          });

          const combined = [...osmResults, ...matchedCurated];
          return combined.filter(
            (v, i, a) => a.findIndex(t => t.label.toLowerCase() === v.label.toLowerCase()) === i
          );
        }
      }
    } catch (err) {
      console.warn('[OpenStreetMap Nominatim search error]', err);
    }

    // 4. Return curated matches if any
    if (matchedCurated.length > 0) {
      return matchedCurated;
    }

    return [
      {
        label: query.trim() + ', India',
        formattedAddress: query.trim() + ', Commercial Zone, India',
        locality: query.trim().split(',')[0],
        city: query.trim().split(',')[1]?.trim() || 'Jaipur',
        state: 'India',
        lat: 26.9124,
        lng: 75.7873,
        source: 'Cached Corridor',
        type: 'General Catchment'
      }
    ];
  },

  getCuratedCorridors(): LocationSearchResult[] {
    return CURATED_CORRIDORS;
  }
};
