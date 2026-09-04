import {
  EXTENDED_BUSINESS_OPPORTUNITIES,
  type ExtendedBusinessOpportunity,
} from '@/database/m_business';
import { FRANCHISES } from '@/database/franchises';
import { actualDataStore } from '@/database/actualDataStore';

export interface BusinessFinderInput {
  budget: number;
  city: string;
  skillset: string; // 'all' | 'tech' | 'food' | 'fitness' | 'retail' | 'education'
}

export interface BusinessFinderOutput extends ExtendedBusinessOpportunity {
  affordable: boolean;
  matchScore: number; // 0 - 100 percentage
  sourceBadge?: string;
  applyUrl?: string;
  isOfficial?: boolean;
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
  Bengaluru: {
    costFactor: 1.15,
    revFactor: 1.25,
    primeAreas: ['Koramangala 5th Block', 'Indiranagar 100ft Rd', 'HSR Layout Sector 1', 'Whitefield IT Corridor'],
    specialtyBonus: { tech: 16, food: 10, education: 12, fitness: 8, retail: 7 },
  },
  Delhi: {
    costFactor: 1.25,
    revFactor: 1.35,
    primeAreas: ['Connaught Place Inner Circle', 'Lajpat Nagar Central Market', 'Karol Bagh Market', 'Hauz Khas Village'],
    specialtyBonus: { food: 15, retail: 14, fitness: 12, tech: 8, education: 7 },
  },
  Mumbai: {
    costFactor: 1.35,
    revFactor: 1.45,
    primeAreas: ['Bandra West Linking Road', 'Andheri West Lokhandwala', 'Lower Parel Phoenix Zone', 'Colaba Causeway'],
    specialtyBonus: { food: 14, fitness: 15, retail: 12, tech: 9, education: 6 },
  },
  Jaipur: {
    costFactor: 0.85,
    revFactor: 0.95,
    primeAreas: ['C-Scheme Subhash Marg', 'Raja Park Commercial St', 'Malviya Nagar GT Central', 'Vaishali Nagar Amrapali'],
    specialtyBonus: { retail: 18, food: 16, tech: 10, fitness: 10, education: 14 },
  },
  Pune: {
    costFactor: 1.0,
    revFactor: 1.1,
    primeAreas: ['FC Road Deccan', 'Koregaon Park North Main Rd', 'Viman Nagar Dutta Mandir Rd', 'Baner High Street'],
    specialtyBonus: { tech: 15, education: 14, food: 11, retail: 8, fitness: 8 },
  },
  Chennai: {
    costFactor: 0.95,
    revFactor: 1.05,
    primeAreas: ['T. Nagar Pondy Bazaar', 'Anna Nagar 2nd Avenue', 'Adyar Sardar Patel Rd', 'Velachery Main Rd'],
    specialtyBonus: { tech: 14, education: 15, food: 12, retail: 9, fitness: 8 },
  },
};

export const businessFinderService = {
  async findBusinesses(input: BusinessFinderInput): Promise<BusinessFinderOutput[]> {
    // Slight async delay for realistic UI responsiveness
    await new Promise(resolve => setTimeout(resolve, 250));

    const selectedCity = input.city || 'Bengaluru';
    const selectedSkillset = input.skillset || 'all';
    const userBudget = Math.max(50000, input.budget || 500000);

    const cityInfo = CITY_FACTORS[selectedCity] || {
      costFactor: 1.0,
      revFactor: 1.0,
      primeAreas: [`${selectedCity} High Street`, `${selectedCity} Market Hub`],
      specialtyBonus: { tech: 10, food: 10, fitness: 10, retail: 10, education: 10 },
    };

    // 1. Filter businesses based on skillset
    let candidateBusinesses = [...EXTENDED_BUSINESS_OPPORTUNITIES];
    if (selectedSkillset !== 'all') {
      candidateBusinesses = candidateBusinesses.filter(
        b => b.category.toLowerCase() === selectedSkillset.toLowerCase()
      );
    }

    // 2. Score and recalculate ranking for each business based on the chosen city and budget
    const scoredBusinesses: BusinessFinderOutput[] = candidateBusinesses.map((biz, index) => {
      // Localized capital & revenue adjustments
      const adjustedCost = Math.round(biz.startupCost * cityInfo.costFactor);
      const adjustedRev = Math.round(biz.monthlyRevenue * cityInfo.revFactor);
      const affordable = userBudget >= adjustedCost;

      // Base city viability index (0 to 10 scale converted to points)
      const baseCityViability = biz.cityViabilityScores[selectedCity] ?? 8.5;
      let score = baseCityViability * 5.5; // up to 55 points

      // Recommended city bonus
      if (biz.recommendedCities.includes(selectedCity)) {
        score += 12;
      }

      // City-specific industry specialization bonus
      const industryBonus = cityInfo.specialtyBonus[biz.category] || 8;
      score += industryBonus;

      // Affordability & Budget Allocation scoring
      if (affordable) {
        score += 16;
        const budgetRatio = adjustedCost / userBudget;
        // Optimal budget utilization: 40% to 95% of available funds
        if (budgetRatio >= 0.4 && budgetRatio <= 0.95) {
          score += 6;
        }
      } else {
        const overageRatio = adjustedCost / userBudget;
        if (overageRatio > 2.0) {
          score -= 28;
        } else if (overageRatio > 1.4) {
          score -= 18;
        } else {
          score -= 8;
        }
      }

      // Payback Speed (ROI) weighting
      if (biz.roiMonths <= 8) {
        score += 8;
      } else if (biz.roiMonths <= 12) {
        score += 5;
      } else if (biz.roiMonths > 18) {
        score -= 5;
      }

      // High Profit Margin bonus
      if (biz.targetMarginPercent >= 60) {
        score += 4;
      }

      // Select localized prime area for the description
      const primeArea = cityInfo.primeAreas[index % cityInfo.primeAreas.length];

      // Final bounded match score
      const finalMatchScore = Math.max(35, Math.min(99, Math.round(score)));

      return {
        ...biz,
        startupCost: adjustedCost,
        monthlyRevenue: adjustedRev,
        affordable,
        matchScore: finalMatchScore,
        description: `${biz.description} Top viability for ${primeArea}, ${selectedCity} (${biz.roiMonths}-mo projected payback).`,
        bestSuitedFor: `${biz.bestSuitedFor} (Target: ${selectedCity})`,
        sourceBadge: biz.isFranchise ? 'Verified Franchise' : 'Curated Business Model',
      };
    });

    // 3. Re-rank strictly descending by matchScore
    // Tie-breaker: prefer affordable models and lower roiMonths
    scoredBusinesses.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      if (a.affordable !== b.affordable) {
        return a.affordable ? -1 : 1;
      }
      return a.roiMonths - b.roiMonths;
    });

    return scoredBusinesses;
  },
};
