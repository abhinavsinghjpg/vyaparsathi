/**
 * Central Shared Entity Contracts for VyaparMap
 */

export interface GeoLocation {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  footfallDensity: 'Low' | 'Medium' | 'High' | 'Very High';
  avgFootfallPerHour: number;
  peakHours: string[];
  medianHouseholdIncome: number;
  demographics: {
    age18to25: number;
    age26to35: number;
    age36to50: number;
    age50plus: number;
    studentsPct: number;
    workingProfessionalsPct: number;
    familiesPct: number;
  };
  commercialRentPerSqFt: {
    groundFloor: number;
    firstFloor: number;
    mallSpace: number;
    highStreet: number;
  };
  transportHubs: {
    type: 'metro' | 'bus_stop' | 'railway' | 'parking';
    name: string;
    distanceMeters: number;
  }[];
  anchorTenants: string[];
  competitorsCount: {
    cafe: number;
    restaurant: number;
    apparel: number;
    grocery: number;
    electronics: number;
    pharmacy: number;
    salon: number;
    gym: number;
  };
  growthScore5Yr: number;
  saturationIndex: number;
}

export interface CompetitorItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  city: string;
  locality: string;
  area?: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  reviewsCount: number;
  priceLevel: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹' | string;
  avgDailyCustomers: number;
  dailyCustomers?: number;
  avgTicket?: number;
  estimatedMonthlyRevenue: number;
  footfallSharePct: number;
  isNationalChain: boolean;
  distanceFromTargetMeters?: number;
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
  rentToRevenueRatio: number;
  hourlyTraffic: { hour: string; weekday: number; weekend: number }[];
  nearbyCompetitors: { name: string; distanceMeters: number; footfallShare: number }[];
}

export interface CommercialProperty {
  id: string;
  title: string;
  type: 'retail_shop' | 'showroom' | 'restaurant_space' | 'office' | 'warehouse';
  city: string;
  locality: string;
  address: string;
  lat: number;
  lng: number;
  carpetAreaSqFt: number;
  superAreaSqFt: number;
  monthlyRent: number;
  rentPerSqFt: number;
  securityDepositMonths: number;
  lockInPeriodMonths: number;
  floor: number;
  totalFloors: number;
  frontageFeet: number;
  powerBackupKva: number;
  waterSupply: boolean;
  parkingSpots: number;
  idealForBusinesses: string[];
  images: string[];
  isAvailable: boolean;
  footfallRating: 'High' | 'Very High' | 'Medium' | 'Premium High Street';
  nearbyMetroStation?: string;
  metroDistanceMeters?: number;
  
  sizeSqft?: number;
  rentPerSqft?: number;
  
  // Government Circle Rate & Official Valuation
  govCircleRatePerSqft: number; // Official State Revenue Dept / IGRS Circle Rate (DLC rate)
  marketRatePerSqft: number;
  valuationStatus: 'Fair Market' | 'Below Circle Rate' | 'Premium High-Street';
  
  // Contact & Inquiries
  ownerName: string;
  contactNumber: string;
  contactEmail: string;
  isVerifiedOwner: boolean;
}

export interface Franchise {
  id: string;
  brand: string;
  category: string;
  logoUrl?: string;
  logoColor?: string;
  tagline?: string;
  investment?: number;
  minInvestment?: number;
  maxInvestment?: number;
  spaceRequiredSqFt?: { min: number; max: number };
  minAreaSqft?: number;
  paybackPeriodMonths?: { min: number; max: number };
  roiMonths?: number;
  franchiseFee?: number;
  royaltyPct?: number;
  royaltyPercent?: number;
  outletsPanIndia?: number;
  outlets?: number;
  description: string;
  targetCities?: string[];
  preferredLocations?: string[];
  isFeatured?: boolean;
  isOfficial?: boolean;
  isMock?: boolean;
  applyUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface MarketKPI {
  key: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  description: string;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  phone?: string;
  city?: string;
  role: 'visitor' | 'business_owner';
  storeId?: string;
  businessName?: string;
  businessType?: string;
  isVerified?: boolean;
}

export interface GovMsmeScheme {
  id: string;
  code: string;
  name: string;
  ministry: string;
  maxAssistance: string;
  subsidyRate: string;
  promoterContribution: string;
  collateralRequirement: string;
  eligibility: string;
  benefitSummary: string;
  officialPortalUrl: string;
  keyFeatures: string[];
}

export interface DistrictMsmeStats {
  district: string;
  state: string;
  totalRegisteredMsmes: number;
  microCount: number;
  smallCount: number;
  mediumCount: number;
  topClusters: string[];
  urbanCpiInflationIndex: number;
  monthlyPerCapitaSpendingUrban: number;
  commercialElectricityRatePerUnit: number;
  priorityLendingInterestDiscount: string;
  yearlyGrowth?: Array<{ year: string; count: number; growthRatePct: number }>;
  sectorDistribution?: {
    retailTradePct: number;
    servicesPct: number;
    manufacturingPct: number;
    agroProcessingPct: number;
  };
  districtCategory?: string;
  estimatedEmployment?: number;
}

export interface PostalOfficeInfo {
  name: string;
  description: string | null;
  branchType: string;
  deliveryStatus: string;
  circle: string;
  district: string;
  division: string;
  region: string;
  state: string;
  country: string;
  pincode: string;
}

export interface PostalApiResponse {
  Message: string;
  Status: 'Success' | 'Error';
  PostOffice: PostalOfficeInfo[] | null;
}
