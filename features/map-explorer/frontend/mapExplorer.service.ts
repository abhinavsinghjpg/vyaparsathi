import { db, type GeoLocation, type CommercialProperty } from '@/database';

export interface MapPOIItem {
  id: string;
  name: string;
  category: string;
  city: string;
  lat: number;
  lng: number;
  footfallDensity: string;
  avgRentSqft: number;
  opportunityScore: number;
}

export const mapExplorerService = {
  async getPOIs(category = 'All'): Promise<MapPOIItem[]> {
    const locations = db.getLocations();
    const properties = db.getProperties();

    const locPOIs: MapPOIItem[] = locations.map(l => ({
      id: l.id,
      name: l.name,
      category: 'Corridor Hub',
      city: l.city,
      lat: l.lat,
      lng: l.lng,
      footfallDensity: l.footfallDensity,
      avgRentSqft: l.avgRentSqft,
      opportunityScore: l.opportunityScore,
    }));

    const propPOIs: MapPOIItem[] = properties.map(p => ({
      id: p.id,
      name: p.title,
      category: p.type,
      city: p.city,
      lat: p.lat,
      lng: p.lng,
      footfallDensity: p.footfallRating >= 9 ? 'Very High' : 'High',
      avgRentSqft: p.rentPerSqft,
      opportunityScore: p.footfallRating,
    }));

    const combined = [...locPOIs, ...propPOIs];
    if (category === 'All') return combined;
    return combined.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
  },
};

