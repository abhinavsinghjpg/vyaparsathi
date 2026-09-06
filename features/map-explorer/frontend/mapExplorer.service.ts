import { mapExplorerDb } from '../backend/mapExplorer.db';
import { propertiesDb } from '@/features/properties/backend/properties.db';
import { sqlVault, type VyaparHarvestedPlace } from '@/system/database/sqlVault';
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
  address?: string;
  specificType?: string;
  rating?: number;
  isVaultSaved?: boolean;
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
      address: `${l.name}, ${l.city}`,
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
      address: p.address,
    }));

    const competitors = mapExplorerDb.getCompetitors();
    const compPOIs: MapPOIItem[] = competitors.map(c => ({
      id: c.id,
      name: c.name,
      category: c.category.includes('Cafe') ? 'Cafes & Dining' : c.category.includes('Electronics') ? 'IT & Gaming' : 'Malls & Retail',
      city: c.city,
      lat: c.lat,
      lng: c.lng,
      footfallDensity: (c.avgDailyCustomers || 0) > 300 ? 'Very High' : 'High',
      avgRentSqft: Math.round((c.estimatedMonthlyRevenue || 300000) / 1400),
      opportunityScore: Number(Math.min(9.9, ((c.rating || 4.2) * 2.1)).toFixed(1)),
      address: c.address,
      rating: c.rating,
    }));

    // Harvested Real Places saved in SQL DB Vault
    const vaultPlaces = sqlVault.getHarvestedPlaces();
    const vaultPOIs: MapPOIItem[] = vaultPlaces.map(v => ({
      id: v.id,
      name: v.name,
      category: v.category,
      city: v.city,
      lat: v.lat,
      lng: v.lng,
      footfallDensity: v.footfallEstimate > 300 ? 'Very High' : 'High',
      avgRentSqft: 180,
      opportunityScore: Number((v.rating * 2).toFixed(1)),
      address: v.address,
      specificType: v.specificType,
      rating: v.rating,
      isVaultSaved: true,
    }));

    const combined = [...locPOIs, ...vaultPOIs, ...compPOIs, ...propPOIs];
    if (!category || category === 'All') return combined;

    const catLower = category.toLowerCase();
    return combined.filter(p => {
      const pCat = p.category.toLowerCase();
      const pType = (p.specificType || '').toLowerCase();
      const pName = p.name.toLowerCase();

      if (catLower.includes('cafe') || catLower.includes('dining')) {
        return pCat.includes('cafe') || pCat.includes('dining') || pCat.includes('food') || pCat.includes('restaurant') || pType.includes('cafe') || pName.includes('cafe') || pName.includes('coffee');
      }
      if (catLower.includes('mall') || catLower.includes('retail')) {
        return pCat.includes('mall') || pCat.includes('retail') || pCat.includes('shop') || pCat.includes('bazaar') || pType.includes('mall') || pName.includes('mall') || pName.includes('mart');
      }
      if (catLower.includes('it') || catLower.includes('gaming') || catLower.includes('electronics')) {
        return pCat.includes('it') || pCat.includes('gaming') || pCat.includes('electronics') || pType.includes('computer') || pType.includes('electronics') || pName.includes('laptop') || pName.includes('acer') || pName.includes('asus') || pName.includes('rog') || pName.includes('game');
      }
      if (catLower.includes('footwear') || catLower.includes('leather')) {
        return pCat.includes('footwear') || pCat.includes('leather') || pCat.includes('craft') || pType.includes('shoe') || pName.includes('mojari') || pName.includes('jutti') || pName.includes('shoe');
      }
      if (catLower.includes('health') || catLower.includes('clinic')) {
        return pCat.includes('health') || pCat.includes('pharmacy') || pType.includes('pharmacy') || pType.includes('clinic') || pName.includes('pharmacy') || pName.includes('med');
      }
      if (catLower.includes('office') || catLower.includes('commercial')) {
        return pCat.includes('office') || pCat.includes('commercial') || pCat.includes('coworking') || pType.includes('office') || pName.includes('cowork') || pName.includes('bank');
      }
      return pCat.includes(catLower);
    });
  },
};

