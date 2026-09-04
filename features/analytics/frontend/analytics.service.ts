import { db, type CompetitorItem, type MarketKPI } from '@/database';

export interface FinancialCalculationInput {
  dailyCustomers: number;
  avgTicket: number;
  grossMarginPct: number;
  monthlyRent: number;
  monthlyStaffSalaries: number;
}

export interface FinancialProjectionOutput {
  monthlyGrossRevenue: number;
  monthlyGrossProfit: number;
  monthlyOperatingCosts: number;
  monthlyNetProfit: number;
  netMarginPct: number;
  annualNetProfit: number;
  rentToRevenuePct: number;
  isHealthyRent: boolean;
}

export interface CityMarketInsight {
  city: string;
  category: string;
  recommendedCorridors: string[];
  medianPatronsDaily: string;
  avgTicketBenchmark: number;
  benchmarkRentPerSqft: number;
  marketDensity: string;
  localVerdict: string;
}

const CITY_INSIGHTS: Record<string, {
  corridors: string[];
  rentSqft: number;
  density: string;
  notes: string;
}> = {
  Jaipur: {
    corridors: ['C-Scheme (Subhash Marg)', 'Malviya Nagar (GT Central)', 'Raja Park', 'Vaishali Nagar'],
    rentSqft: 110,
    density: '2.1 outlets/km²',
    notes: 'Premium high-street absorption in C-Scheme; strong youth and domestic tourist weekend surge.',
  },
  Bengaluru: {
    corridors: ['Koramangala 5th Block', 'Indiranagar 100ft Rd', 'HSR Sector 1', 'JP Nagar 24th Main'],
    rentSqft: 185,
    density: '4.8 outlets/km²',
    notes: 'Intense specialty coffee competition; high weekday tech-worker density and high average order ticket.',
  },
  Delhi: {
    corridors: ['Connaught Place Outer Circle', 'Lajpat Nagar 2', 'Karol Bagh', 'Hauz Khas Village'],
    rentSqft: 220,
    density: '5.2 outlets/km²',
    notes: 'High footfall volumes with heavy transit interchange catchment; strict rent threshold required.',
  },
  Mumbai: {
    corridors: ['Bandra West (Pali Hill)', 'Andheri West (Lokhandwala)', 'Lower Parel', 'Juhu Tara Rd'],
    rentSqft: 260,
    density: '6.1 outlets/km²',
    notes: 'High rental loads require maximum table turnover speed and delivery packaging integration.',
  },
  Pune: {
    corridors: ['FC Road Deccan', 'Koregaon Park North Main', 'Viman Nagar', 'Baner High St'],
    rentSqft: 135,
    density: '3.0 outlets/km²',
    notes: 'Student-led and tech-worker footfall with high affinity for youth cafes and casual hangouts.',
  },
  Hyderabad: {
    corridors: ['Banjara Hills Rd No. 12', 'Jubilee Hills Rd No. 36', 'Gachibowli High Street', 'Madhapur'],
    rentSqft: 145,
    density: '3.2 outlets/km²',
    notes: 'IT corridor expansion and luxury retail pockets driving high evening basket sizes.',
  },
};

export const analyticsService = {
  getCityMarketInsight(city: string, category: string): CityMarketInsight {
    const rawCity = city.split(',')[0].trim();
    const matched = Object.keys(CITY_INSIGHTS).find(k => k.toLowerCase() === rawCity.toLowerCase()) || 'Jaipur';
    const data = CITY_INSIGHTS[matched] || CITY_INSIGHTS['Jaipur'];

    const isFnb = category.toLowerCase().includes('cafe') || category.toLowerCase().includes('food') || category.toLowerCase().includes('dining');
    const avgTicket = isFnb ? (matched === 'Mumbai' || matched === 'Delhi' ? 320 : matched === 'Bengaluru' ? 280 : 210) : 650;
    const patrons = isFnb ? (matched === 'Mumbai' || matched === 'Delhi' ? '160 - 240 visits' : '110 - 180 visits') : '40 - 90 visits';

    return {
      city: matched,
      category,
      recommendedCorridors: data.corridors,
      medianPatronsDaily: patrons,
      avgTicketBenchmark: avgTicket,
      benchmarkRentPerSqft: data.rentSqft,
      marketDensity: data.density,
      localVerdict: data.notes,
    };
  },

  calculateProjections(input: FinancialCalculationInput): FinancialProjectionOutput {
    const monthlyGrossRevenue = input.dailyCustomers * input.avgTicket * 30;
    const monthlyGrossProfit = monthlyGrossRevenue * (input.grossMarginPct / 100);
    const monthlyOperatingCosts = input.monthlyRent + input.monthlyStaffSalaries + (monthlyGrossRevenue * 0.08); // Utilities + miscellany
    const monthlyNetProfit = monthlyGrossProfit - monthlyOperatingCosts;
    const netMarginPct = monthlyGrossRevenue > 0 ? (monthlyNetProfit / monthlyGrossRevenue) * 100 : 0;
    const rentToRevenuePct = monthlyGrossRevenue > 0 ? (input.monthlyRent / monthlyGrossRevenue) * 100 : 0;

    return {
      monthlyGrossRevenue,
      monthlyGrossProfit,
      monthlyOperatingCosts,
      monthlyNetProfit,
      netMarginPct: Number(netMarginPct.toFixed(1)),
      annualNetProfit: monthlyNetProfit * 12,
      rentToRevenuePct: Number(rentToRevenuePct.toFixed(1)),
      isHealthyRent: rentToRevenuePct <= 20,
    };
  },

  getCompetitors(city?: string): CompetitorItem[] {
    return db.getCompetitors(city);
  },

  getMarketKPIs(): MarketKPI[] {
    return db.getMarketKPIs();
  },
};

