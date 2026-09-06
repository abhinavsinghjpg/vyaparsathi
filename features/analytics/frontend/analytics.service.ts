import { analyticsDb } from '../backend/analytics.db';
import type { CompetitorItem, MarketKPI } from '@/types/schema';

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
  Sanganer: {
    corridors: ['Sanganer Bazar (Footwear Belt)', 'Handblock Craft Enclave', 'Bilwa Industrial Corridor', 'Mahapura Road'],
    rentSqft: 35,
    density: 'Artisan Hub (High Cluster Synergy)',
    notes: 'Dense mojari and textile artisan cluster; high footfall from wholesale craft buyers and export merchants.',
  },
  Chomu: {
    corridors: ['Krishi Upaj Mandi Road', 'Chomu Main Bazaar', 'Morija Road Corridor', 'Station Road Commercial'],
    rentSqft: 28,
    density: 'Agro-Mandi Hub (Heavy Rural Transit)',
    notes: 'Agricultural commodity trading hub with high morning and post-harvest liquidity; excellent for feeder retail.',
  },
  Varanasi: {
    corridors: ['Chowk Handloom Corridor', 'Godowlia Market', 'Sigra Commercial Belt', 'Bhelupur'],
    rentSqft: 85,
    density: 'Heritage Craft & Tourism Hub',
    notes: 'Global textile pilgrim footfall; strong demand for authentic GI craft and high-street tourism retail.',
  },
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
    notes: 'Intense specialty coffee and tech retail competition; high weekday tech-worker density and high basket size.',
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
    notes: 'Student-led and tech-worker footfall with high affinity for youth cafes, gaming lounges, and casual hangouts.',
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
    const rawCity = (city || '').toLowerCase();
    const matchedKey = Object.keys(CITY_INSIGHTS).find(k => rawCity.includes(k.toLowerCase())) || 'Jaipur';
    const data = CITY_INSIGHTS[matchedKey] || CITY_INSIGHTS['Jaipur'];

    const catLower = (category || '').toLowerCase();
    
    // Benchmark ticket sizes and daily footfall based on business model
    let avgTicket = 220;
    let patrons = '60 - 120 visits';

    if (catLower.includes('mall') || catLower.includes('arcade')) {
      avgTicket = 2200;
      patrons = '450 - 1,200 visits';
    } else if (catLower.includes('laptop') || catLower.includes('pc') || catLower.includes('computer')) {
      avgTicket = 32000;
      patrons = '12 - 25 customers';
    } else if (catLower.includes('gaming') || catLower.includes('esports')) {
      avgTicket = 280;
      patrons = '70 - 140 visits';
    } else if (catLower.includes('shoe') || catLower.includes('mojari') || catLower.includes('footwear')) {
      avgTicket = 420;
      patrons = '25 - 55 buyers';
    } else if (catLower.includes('pottery') || catLower.includes('terracotta') || catLower.includes('artisan')) {
      avgTicket = 180;
      patrons = '20 - 45 buyers';
    } else if (catLower.includes('kirana') || catLower.includes('grocery') || catLower.includes('general store')) {
      avgTicket = 240;
      patrons = '100 - 220 visits';
    } else if (catLower.includes('cafe') || catLower.includes('dining') || catLower.includes('restaurant')) {
      const isMetro = rawCity.includes('mumbai') || rawCity.includes('delhi');
      avgTicket = isMetro ? 340 : rawCity.includes('bengaluru') ? 290 : 220;
      patrons = isMetro ? '150 - 240 visits' : '110 - 180 visits';
    } else if (catLower.includes('gym') || catLower.includes('fitness')) {
      avgTicket = 1500;
      patrons = '40 - 90 members';
    } else if (catLower.includes('salon') || catLower.includes('spa') || catLower.includes('grooming')) {
      avgTicket = 350;
      patrons = '25 - 50 clients';
    }

    return {
      city: matchedKey,
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
    return analyticsDb.getCompetitors(city);
  },

  getMarketKPIs(city?: string): MarketKPI[] {
    return analyticsDb.getMarketKPIs(city);
  },
};

