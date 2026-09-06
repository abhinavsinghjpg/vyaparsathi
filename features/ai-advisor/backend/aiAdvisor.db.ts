/**
 * Dedicated Database & Data Store for AI Location Advisor
 * Maintains real-time scanned location records, live catchment telemetry,
 * and fallback benchmarks with explicit mock on/off flags.
 */

export interface CachedCatchmentScan {
  query: string;
  location: string;
  coordinates: { lat: number; lng: number };
  pedestrianFootfallScore: number;
  footfallDensity: 'Low' | 'Medium' | 'High' | 'Very High';
  estimatedDailyTraffic: number;
  transitHubsCount: number;
  commercialAnchorsCount: number;
  competitorsCount: number;
  competitorBrands: string[];
  rentPerSqft: number;
  googleMapsUrl: string;
  scannedAt: string;
  isActualData: boolean;
}

// In-memory actual data cache for live scans
const actualScansStore = new Map<string, CachedCatchmentScan>();

/**
 * Dynamic Mock Fallback Configuration
 * When live APIs (Google Maps, India Post, Overpass) respond, USE_MOCK_FALLBACK is automatically toggled false.
 */
export const AI_ADVISOR_FLAGS = {
  USE_MOCK_FALLBACK: true, // Auto-disables when live API succeeds
  PRIORITIZE_ACTUAL: true,
};

export const MOCK_ADVISOR_BENCHMARKS: Record<string, {
  rentSqft: number;
  dailyTraffic: number;
  footfallLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  anchors: string[];
  competitors: string[];
}> = {
  jaipur: {
    rentSqft: 110,
    dailyTraffic: 9400,
    footfallLevel: 'High',
    anchors: ['GT Central Mall', 'World Trade Park', 'Birla Auditorium', 'Central Park'],
    competitors: ['Anokhi Cafe', 'Curious Life Coffee', 'Tapri Central', 'Town Coffee'],
  },
  bengaluru: {
    rentSqft: 185,
    dailyTraffic: 14800,
    footfallLevel: 'Very High',
    anchors: ['Nexus Koramangala', 'Sony World Junction', '100ft Road High-Street'],
    competitors: ['Third Wave Coffee', 'Blue Tokai', 'Starbucks', 'DYU Art Cafe'],
  },
  delhi: {
    rentSqft: 220,
    dailyTraffic: 18500,
    footfallLevel: 'Very High',
    anchors: ['Palika Bazaar', 'Rajiv Chowk Metro Interchange', 'Inner Circle Commercials'],
    competitors: ['Chaayos', 'Cafe Coffee Day', 'United Coffee House', 'Wenger’s'],
  },
  mumbai: {
    rentSqft: 260,
    dailyTraffic: 21000,
    footfallLevel: 'Very High',
    anchors: ['Linking Road High-Street', 'Bandra Railway Station', 'Pali Market'],
    competitors: ['Subko Specialty Coffee', 'Koinonia Coffee Roasters', 'Blue Tokai', 'Candies'],
  },
  pune: {
    rentSqft: 135,
    dailyTraffic: 11200,
    footfallLevel: 'High',
    anchors: ['Fergusson College Campus', 'Deccan Gymkhana', 'FC Road Promenade'],
    competitors: ['FC Road Social', 'Cafe Goodluck', 'Irani Cafe', 'Starbucks'],
  },
  chennai: {
    rentSqft: 125,
    dailyTraffic: 10500,
    footfallLevel: 'High',
    anchors: ['Express Avenue', 'Spencer Plaza', 'Thousand Lights Metro'],
    competitors: ['Writer’s Cafe', 'Amethyst Cafe', 'Madras Coffee House', 'Chai Galli'],
  },
};

const ADVISOR_VAULT_KEY = 'vyapar_advisor_scans';

function getVaultScans(): CachedCatchmentScan[] {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ADVISOR_VAULT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function persistToVault(scan: CachedCatchmentScan): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    const existing = getVaultScans().filter(s => s.query.toLowerCase() !== scan.query.toLowerCase());
    const updated = [scan, ...existing].slice(0, 50);
    localStorage.setItem(ADVISOR_VAULT_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('[AI Advisor Vault] Failed to persist scan offline:', e);
  }
}

export const aiAdvisorDb = {
  /**
   * Saves an actual live scan retrieved from API into the primary store and local storage vault
   */
  saveActualScan(scan: CachedCatchmentScan): void {
    const enriched: CachedCatchmentScan = {
      ...scan,
      isActualData: true,
      scannedAt: new Date().toISOString(),
    };
    actualScansStore.set(scan.query.toLowerCase(), enriched);
    persistToVault(enriched);
    AI_ADVISOR_FLAGS.USE_MOCK_FALLBACK = false;
  },

  /**
   * Retrieves scan data with actual data prioritized first from memory or persistent vault
   */
  getScan(query: string): CachedCatchmentScan | null {
    const key = query.toLowerCase().trim();
    if (actualScansStore.has(key)) {
      return actualScansStore.get(key)!;
    }
    const fromVault = getVaultScans().find(s => s.query.toLowerCase() === key || s.location.toLowerCase().includes(key));
    if (fromVault) {
      actualScansStore.set(key, fromVault);
      return fromVault;
    }
    return null;
  },

  /**
   * Returns all persisted scan logs saved offline
   */
  getSavedScans(): CachedCatchmentScan[] {
    return getVaultScans();
  },

  /**
   * Returns benchmark data (fallback)
   */
  getFallbackBenchmark(city: string) {
    const raw = city.toLowerCase();
    for (const k of Object.keys(MOCK_ADVISOR_BENCHMARKS)) {
      if (raw.includes(k)) {
        return MOCK_ADVISOR_BENCHMARKS[k];
      }
    }
    return MOCK_ADVISOR_BENCHMARKS.jaipur;
  },

  setMockFallbackEnabled(enabled: boolean): void {
    AI_ADVISOR_FLAGS.USE_MOCK_FALLBACK = enabled;
  },
};

