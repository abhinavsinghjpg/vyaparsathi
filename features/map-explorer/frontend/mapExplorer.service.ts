import { mapExplorerDb } from '../backend/mapExplorer.db';
import { propertiesDb } from '@/features/properties/backend/properties.db';
import type { GeoLocation, CommercialProperty } from '@/types/schema';

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
    const locations = mapExplorerDb.getLocations();
    const properties = propertiesDb.getProperties();

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
      footfallDensity: p.footfallRating === 'Very High' || p.footfallRating === 'Premium High Street' ? 'Very High' : p.footfallRating,
      avgRentSqft: p.rentPerSqFt || p.rentPerSqft || 120,
      opportunityScore: p.footfallRating === 'Premium High Street' ? 9.6 : p.footfallRating === 'Very High' ? 8.9 : p.footfallRating === 'High' ? 8.1 : 7.2,
    }));

    const competitors = mapExplorerDb.getCompetitors();
    const compPOIs: MapPOIItem[] = competitors.map(c => ({
      id: c.id,
      name: c.name,
      category: 'Shop',
      city: c.city,
      lat: c.lat,
      lng: c.lng,
      footfallDensity: (c.avgDailyCustomers || 0) > 300 ? 'Very High' : 'High',
      avgRentSqft: Math.round((c.estimatedMonthlyRevenue || 300000) / 1400),
      opportunityScore: Number(Math.min(9.9, ((c.rating || 4.2) * 2.1)).toFixed(1)),
    }));

    const combined = [...locPOIs, ...compPOIs, ...propPOIs];
    if (category === 'All') return combined;
    return combined.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
  },
};

