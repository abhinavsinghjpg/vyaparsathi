/**
 * Map Explorer - Dedicated API Keys & Endpoints Configuration
 */

export const MAP_EXPLORER_CONFIG = {
  // 1. OpenStreetMap Live Overpass POI API (Completely free, no key required)
  overpass: {
    endpoint: 'https://overpass-api.de/api/interpreter',
    alternativeEndpoint: 'https://lz4.overpass-api.de/api/interpreter',
    timeoutSeconds: 25,
  },

  // 2. OpenStreetMap Nominatim Geocoding API
  nominatim: {
    searchEndpoint: 'https://nominatim.openstreetmap.org/search',
    reverseEndpoint: 'https://nominatim.openstreetmap.org/reverse',
    userAgent: 'VyaparMap-Retail-Intelligence/2.0',
  },

  // 3. Tile Layer Providers
  tiles: {
    osmStandard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmHumanitarian: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    googleHybrid: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    googleRoadmap: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
  },

  // 4. India Post Postal Zone API
  indiaPost: {
    pincodeEndpoint: 'https://api.postalpincode.in/pincode',
    postOfficeEndpoint: 'https://api.postalpincode.in/postoffice',
  },
};

