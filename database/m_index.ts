export * from './m_schema';
export * from './m_data';
export * from './m_business';

import {
  PRESENTATION_LOCATIONS,
  PRESENTATION_PROPERTIES,
  PRESENTATION_FRANCHISES,
  PRESENTATION_BUSINESS_OPPORTUNITIES,
  PRESENTATION_COMPETITORS,
  PRESENTATION_STORE_TELEMETRY,
  PRESENTATION_KPIS,
  DEMO_USERS,
} from './m_data';

import { EXTENDED_BUSINESS_OPPORTUNITIES } from './m_business';

import type {
  GeoLocation,
  CommercialProperty,
  Franchise,
  BusinessOpportunity,
  CompetitorItem,
  StoreTelemetry,
  MarketKPI,
  UserSession,
} from './m_schema';

/**
 * Clean presentation/mock data access methods.
 */
export const mockDb = {
  getLocations(): GeoLocation[] {
    return PRESENTATION_LOCATIONS;
  },

  getLocationById(id: string): GeoLocation | undefined {
    return PRESENTATION_LOCATIONS.find(l => l.id === id);
  },

  getProperties(filter?: { city?: string; type?: string; maxRent?: number }): CommercialProperty[] {
    return PRESENTATION_PROPERTIES.filter(p => {
      if (filter?.city && filter.city !== 'All' && p.city.toLowerCase() !== filter.city.toLowerCase()) {
        return false;
      }
      if (filter?.type && filter.type !== 'All' && p.type !== filter.type) {
        return false;
      }
      if (filter?.maxRent && p.monthlyRent > filter.maxRent) {
        return false;
      }
      return true;
    });
  },

  getFranchises(filter?: { category?: string; maxBudget?: number; search?: string }): Franchise[] {
    return PRESENTATION_FRANCHISES.filter(f => {
      if (filter?.category && filter.category !== 'All' && f.category !== filter.category) {
        return false;
      }
      if (filter?.maxBudget && f.investment > filter.maxBudget) {
        return false;
      }
      if (filter?.search) {
        const q = filter.search.toLowerCase();
        return f.brand.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
      }
      return true;
    });
  },

  getBusinessOpportunities(filter?: { maxBudget?: number; category?: string }): BusinessOpportunity[] {
    return EXTENDED_BUSINESS_OPPORTUNITIES.filter(b => {
      if (filter?.category && filter.category !== 'all' && b.category !== filter.category) {
        return false;
      }
      if (filter?.maxBudget && b.startupCost > filter.maxBudget) {
        return false;
      }
      return true;
    });
  },

  getCompetitors(city?: string): CompetitorItem[] {
    if (!city || city === 'All') return PRESENTATION_COMPETITORS;
    return PRESENTATION_COMPETITORS.filter(c => c.city.toLowerCase() === city.toLowerCase());
  },

  getStoreTelemetry(): StoreTelemetry {
    return PRESENTATION_STORE_TELEMETRY;
  },

  getMarketKPIs(): MarketKPI[] {
    return PRESENTATION_KPIS;
  },

  getUser(role: 'visitor' | 'business_owner'): UserSession {
    return DEMO_USERS[role];
  },
};

export const db = mockDb;
export default mockDb;


