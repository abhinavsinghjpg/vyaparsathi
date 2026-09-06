import {
  businessFinderDb,
  type ExtendedBusinessOpportunity,
} from '../backend/businessFinder.db';
import {
  M_BUSINESS_CATALOG,
  filterMicroBusinesses,
  type MicroBusiness,
} from '../backend/m_business';

export interface BusinessFinderInput {
  budget: number;
  isMarginMoney?: boolean;
  city: string;
  sectorId?: string; // 16 sectors from m_business
  subCategory?: string; // specific micro-activity
  skillset?: string; // backward compatibility
  query?: string;
}

export interface BusinessFinderOutput extends ExtendedBusinessOpportunity {
  affordable: boolean;
  matchScore: number; // 0 - 100 percentage
  sourceBadge?: string;
  applyUrl?: string;
  isOfficial?: boolean;
  sectorName?: string;
  subCategory?: string;
  schemes?: string[];
  agglomerationIndex?: number;
  tenPercentMargin?: number;
}

const CITY_FACTORS: Record<
  string,
  {
    costFactor: number;
    revFactor: number;
    primeAreas: string[];
    specialtyBonus: Record<string, number>;
  }
> = {
  'Sanganer Tehsil, Jaipur': {
    costFactor: 0.70,
    revFactor: 0.90,
    primeAreas: ['Amber & Sanganer Footwear Cluster', 'Sanganer Town Gate', 'Mahapura Road'],
    specialtyBonus: { leather_footwear: 25, textiles_apparel: 24, repair_services: 18, agro_food: 15 },
  },
  'Chomu Block, Jaipur Rural': {
    costFactor: 0.65,
    revFactor: 0.85,
    primeAreas: ['Chomu Krishi Upaj Mandi', 'Morija Gram Panchayat', 'Govindgarh Link Rd'],
    specialtyBonus: { agro_food: 26, repair_services: 22, retail_trade: 20, handicrafts_artisan: 18 },
  },
  'Bassi Tehsil, Jaipur Rural': {
    costFactor: 0.60,
    revFactor: 0.80,
    primeAreas: ['Bassi Woodcraft Belt', 'Bassi Riico Link', 'Toonga Village Center'],
    specialtyBonus: { handicrafts_artisan: 25, livestock_dairy: 22, construction_fabrication: 19 },
  },
  'Amer Tehsil, Jaipur': {
    costFactor: 0.75,
    revFactor: 0.95,
    primeAreas: ['Amer Pottery Enclave', 'Amer Ghati Artisan Bazaar', 'Kukas Industrial'],
    specialtyBonus: { handicrafts_artisan: 24, leather_footwear: 22, fnb_dining: 18 },
  },
  'Raja Park, Jaipur': {
    costFactor: 0.90,
    revFactor: 1.05,
    primeAreas: ['Raja Park Commercial St', 'LBS College Road', 'Fashion Street'],
    specialtyBonus: { leather_footwear: 18, repair_services: 20, retail_trade: 18, fnb_dining: 16 },
  },
  'Jaipur': {
    costFactor: 0.85,
    revFactor: 0.95,
    primeAreas: ['C-Scheme Subhash Marg', 'Raja Park Commercial St', 'Sanganer Main Market'],
    specialtyBonus: { leather_footwear: 20, textiles_apparel: 18, food: 16, tech: 14 },
  },
  'Bengaluru': {
    costFactor: 1.15,
    revFactor: 1.25,
    primeAreas: ['Koramangala 5th Block', 'Indiranagar 100ft Rd', 'HSR Layout Sector 1'],
    specialtyBonus: { tech: 18, repair_services: 18, food: 14, education: 12 },
  },
  'Delhi': {
    costFactor: 1.25,
    revFactor: 1.35,
    primeAreas: ['Connaught Place Inner Circle', 'Lajpat Nagar Central Market', 'Karol Bagh'],
    specialtyBonus: { food: 16, retail: 15, repair_services: 14, tech: 12 },
  },
  'Mumbai': {
    costFactor: 1.35,
    revFactor: 1.45,
    primeAreas: ['Bandra West Linking Road', 'Andheri West Lokhandwala', 'Lower Parel'],
    specialtyBonus: { food: 16, fitness: 15, retail: 14, tech: 12 },
  },
  'Pune': {
    costFactor: 1.0,
    revFactor: 1.1,
    primeAreas: ['FC Road Deccan', 'Koregaon Park North Main Rd', 'Viman Nagar'],
    specialtyBonus: { tech: 16, education: 14, repair_services: 14, food: 12 },
  },
  'Chennai': {
    costFactor: 0.95,
    revFactor: 1.05,
    primeAreas: ['T. Nagar Pondy Bazaar', 'Anna Nagar 2nd Avenue', 'Adyar'],
    specialtyBonus: { tech: 14, education: 15, repair_services: 14, food: 12 },
  },
};

export const businessFinderService = {
  async findBusinesses(input: BusinessFinderInput): Promise<BusinessFinderOutput[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const selectedCity = input.city || 'Sanganer Tehsil, Jaipur';
    const effectiveBudget = input.isMarginMoney ? (input.budget || 10000) * 10 : (input.budget || 100000);
    const sectorId = input.sectorId && input.sectorId !== 'all' ? input.sectorId : undefined;
    const subCategory = input.subCategory && input.subCategory !== 'all' ? input.subCategory : undefined;

    const cityInfo = CITY_FACTORS[selectedCity] || CITY_FACTORS['Jaipur'] || {
      costFactor: 1.0,
      revFactor: 1.0,
      primeAreas: [`${selectedCity} Main Market`, `${selectedCity} Commercial Corridor`],
      specialtyBonus: {},
    };

    // 1. Fetch filtered micro-businesses from m_business catalog
    const microList = filterMicroBusinesses({
      capital: effectiveBudget,
      isMarginMoney: false,
      location: selectedCity,
      sectorId,
      subCategory,
      query: input.query,
    });

    // Map micro-businesses to BusinessFinderOutput schema
    const microOutputs: BusinessFinderOutput[] = microList.map((mb, idx) => {
      const adjustedCost = Math.round(mb.typicalBudget * cityInfo.costFactor);
      const adjustedRev = Math.round(mb.monthlyRevenue * cityInfo.revFactor);
      const affordable = effectiveBudget >= mb.minBudget;

      // Score calculation
      let score = 55;

      // Agglomeration advantage bonus
      if (mb.competitionSensitivity === 'Cluster_Beneficial') {
        score += 18;
      }
      if (mb.agglomerationIndex >= 8.0) {
        score += 10;
      }

      // Location match bonus
      if (mb.recommendedLocations.some(l => l.toLowerCase().includes(selectedCity.toLowerCase().split(' ')[0]))) {
        score += 14;
      }

      // Affordability bonus
      if (affordable) {
        score += 12;
      } else {
        score -= 10;
      }

      // Sector bonus
      const secBonus = (cityInfo.specialtyBonus as any)[mb.sectorId] || 8;
      score += secBonus;

      const primeArea = cityInfo.primeAreas[idx % cityInfo.primeAreas.length];

      return {
        id: mb.id,
        name: mb.name,
        category: (mb.sectorId === 'leather_footwear' || mb.sectorId === 'textiles_apparel' ? 'retail' : 'tech') as any,
        emoji: mb.emoji,
        startupCost: adjustedCost,
        monthlyRevenue: adjustedRev,
        roiMonths: mb.roiMonths,
        competition: mb.competitionSensitivity === 'Cluster_Beneficial' ? 'High' : 'Low',
        competitionScore: mb.agglomerationIndex,
        description: `${mb.description} Recommended cluster: ${primeArea}.`,
        bestSuitedFor: mb.bestSuitedFor,
        minAreaSqft: mb.minAreaSqft,
        targetMarginPercent: mb.targetMarginPercent,
        recommendedCities: [selectedCity],
        cityViabilityScores: { [selectedCity]: mb.agglomerationIndex },
        isActualData: true,
        isOfficial: true,
        sourceBadge: mb.schemes[0] || 'MoSJE Micro-Finance Ready',
        applyUrl: 'https://www.jansamarth.in/',
        affordable,
        matchScore: Math.max(45, Math.min(99, Math.round(score))),
        sectorName: mb.sectorName,
        subCategory: mb.subCategory,
        schemes: mb.schemes,
        agglomerationIndex: mb.agglomerationIndex,
        tenPercentMargin: mb.tenPercentMargin,
      };
    });

    // 2. Also fetch from legacy database if not strictly micro-filtered
    let legacyOutputs: BusinessFinderOutput[] = [];
    if (!sectorId || sectorId === 'all') {
      const candidateLegacy = businessFinderDb.getAllOpportunities();
      legacyOutputs = candidateLegacy.slice(0, 8).map((biz, index) => {
        const adjustedCost = Math.round(biz.startupCost * cityInfo.costFactor);
        const adjustedRev = Math.round(biz.monthlyRevenue * cityInfo.revFactor);
        const affordable = effectiveBudget >= adjustedCost;
        return {
          ...biz,
          startupCost: adjustedCost,
          monthlyRevenue: adjustedRev,
          affordable,
          matchScore: affordable ? 82 : 68,
        };
      });
    }

    // Combine and sort strictly by matchScore (descending)
    const combined = [...microOutputs, ...legacyOutputs].sort((a, b) => {
      if (a.affordable && !b.affordable) return -1;
      if (!a.affordable && b.affordable) return 1;
      return b.matchScore - a.matchScore;
    });

    return combined;
  },
};
