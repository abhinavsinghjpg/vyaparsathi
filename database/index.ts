/**
 * VyaparMap Central Database Entry Point
 * Prepares the application for actual live data while cleanly preserving
 * mock presentation data in m_index, m_data, and m_schema.
 */

export * from './m_schema';
export * from './m_data';
export * from './m_index';
export * from './franchises';
export * from './actualDataStore';
export * from './r_users';
export * from './m_business';

import { mockDb } from './m_index';
import { FRANCHISES } from './franchises';
import { ADDITIONAL_FRANCHISES } from './m_franchises';
import { actualDataStore } from './actualDataStore';

/**
 * Actual Live Data Gateway (wired for future FastAPI / PostgreSQL / live ingestion).
 * Combines real collected records, verified databases, and expansion brand networks.
 */
export const actualDb = {
  isLive: true,
  ...mockDb,
  getFranchises: (filter?: { category?: string; search?: string }) => {
    let list = [...FRANCHISES, ...ADDITIONAL_FRANCHISES];
    if (filter?.category && filter.category !== 'All') {
      list = list.filter(f => f.category.toLowerCase().includes(filter.category!.toLowerCase()));
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(f => f.brand.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
    }
    return list;
  },
  getLocations: () => actualDataStore.getLayeredLocations(),
  getCompetitors: (city?: string) => actualDataStore.getLayeredCompetitors(city),
};

export const db = actualDb;
export default db;
