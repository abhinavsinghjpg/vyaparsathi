/**
 * VyaparMap Database Schema & Contract Types
 * These TypeScript interfaces represent future PostgreSQL/PostGIS database tables.
 */

export interface GeoLocation {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  marketTier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  avgRentSqft: number;
  footfallDensity: 'Low' | 'Medium' | 'High' | 'Very High';
  opportunityScore: number; // out of 10
}

export type PropertyType = 'Shop' | 'Office' | 'Kiosk' | 'Commercial Land';

export interface CommercialProperty {
  id: string;
  title: string;
  type: PropertyType;
  city: string;
  area: string;
  sizeSqft: number;
  rentPerSqft: number;
  monthlyRent: number;
  salePrice?: number;
  footfallRating: number; // out of 10
  nearbyBusinesses: number;
  highlights: string[];
  contact: string;
  available: boolean;
  lat: number;
  lng: number;
}

export interface Franchise {
  id: string;
  brand: string;
  logoColor: string;
  category: string;
  investment: number;
  franchiseFee: number;
  royaltyPercent: number;
  roiMonths: number;
  outlets: number;
  description: string;
  preferredLocations: string[];
  minAreaSqft: number;
  isOfficial?: boolean;
  applyUrl?: string;
}

export interface BusinessOpportunity {
  id: string;
  name: string;
  emoji: string;
  startupCost: number;
  monthlyRevenue: number;
  roiMonths: number;
  competition: 'Low' | 'Medium' | 'High';
  competitionScore: number; // out of 10
  description: string;
  bestSuitedFor: string;
}

export interface CompetitorItem {
  id: string;
  name: string;
  category: string;
  area: string;
  city: string;
  priceLevel: 'Budget' | 'Mid' | 'Premium';
  avgTicket: number;
  dailyCustomers: number;
  rating: number;
}

export interface StoreTelemetry {
  storeId: string;
  storeName: string;
  ownerName: string;
  category: string;
  city: string;
  locality: string;
  sizeSqft: number;
  monthlyRent: number;
  monthlyRevenue: number;
  dailyFootfall: number;
  conversionRate: number;
  rentToRevenueRatio: number; // percentage
  hourlyTraffic: {
    hour: string;
    weekday: number;
    weekend: number;
  }[];
  nearbyCompetitors: {
    name: string;
    distanceMeters: number;
    footfallShare: number;
  }[];
}

export interface MarketKPI {
  key: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  description: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'visitor' | 'business_owner';
  phone?: string;
  businessName?: string;
  businessType?: string;
  city?: string;
  isVerified?: boolean;
}

