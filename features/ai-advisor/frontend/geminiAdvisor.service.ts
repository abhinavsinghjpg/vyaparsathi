/**
 * Google Gemini & Multi-Provider AI Feasibility Engine
 * Supports Google Gemini, Groq (Llama 3.3 70B), Perplexity (Sonar), and OpenAI
 * alongside our deterministic actuarial retail econometric model.
 *
 * Fully integrated with SIH 26091 (MoSJE) Agglomeration Cluster Economics,
 * rural tehsil intelligence, and capital scaling from ₹10,000 to ₹20 Crore.
 */

import { CatchmentScanResult } from '@/features/map-explorer/frontend/googleMaps.service';
import { getRuralTehsilIntelligence, type RuralArtisanCluster } from '@/features/government-data/backend/m_rural_market_data';
import { M_BUSINESS_CATALOG } from '@/features/business-finder/backend/m_business';

export interface AgglomerationClusterAnalysis {
  isSpecializedCluster: boolean;
  clusterName: string;
  agglomerationIndex: number; // 0 to 10
  competitorsInZone: number;
  rawMaterialSavingsPercent: number;
  destinationFootfallMultiplier: number;
  subcontractingPotential: 'Very High' | 'High' | 'Moderate' | 'Low';
  dualStrategyVerdict: {
    clusterStrategy: {
      title: string;
      verdict: string;
      operationalTactics: string[];
      marginTarget: string;
    };
    dispersionStrategy: {
      title: string;
      verdict: string;
      operationalTactics: string[];
      marginTarget: string;
    };
    recommendedPath: 'JOIN_CLUSTER_WITH_SPECIALIZATION' | 'SERVE_OUTER_TEHSIL_MONOPOLY';
  };
}

export interface SihFeasibilityReport {
  marketReach: {
    radiusKm: number;
    estimatedConsumerBase: number;
    primaryChannels: string[];
    catchmentDescription: string;
  };
  opportunityAnalysis: {
    underservedNiches: string[];
    localDemandDrivers: string[];
    valueAdditionPotential: string;
  };
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  threatsIdentification: {
    supplyChainBottlenecks: string[];
    seasonalFluctuations: string[];
    singleBuyerDependency: string[];
    mitigationRoadmap: string[];
  };
  competitorMapping: {
    blockBusinessDensityPer10k: number;
    informalCompetitorsEstimate: number;
    organizedCompetitors: string[];
    marketSaturationVerdict: 'Under-penetrated' | 'Balanced' | 'High Saturation' | 'Specialized Artisan Cluster';
  };
  productMarketValue: {
    recommendedPricing: string;
    regionalPurchasingPowerVerdict: string;
    priceElasticity: 'Inelastic (Essential)' | 'Moderate' | 'Elastic';
    marginRealizationTarget: string;
  };
  agglomerationAnalysis: AgglomerationClusterAnalysis;
}

export interface BusinessFinancialProjection {
  overallFeasibilityScore: number;
  isProfitable: boolean;
  verdict: 'HIGHLY_PROFITABLE' | 'PROFITABLE' | 'MARGINAL' | 'HIGH_RISK';
  verdictTitle: string;
  verdictSummary: string;
  monthlyRevenueEst: number;
  monthlyNetProfitEst: number;
  netMarginPercent: number;
  breakevenOrdersPerDay: number;
  expectedDailyOrders: number;
  averageTicketSize: number;
  monthlyOperatingExpenses: {
    rent: number;
    salaries: number;
    utilitiesAndPower: number;
    rawMaterialsCogs: number;
    marketingAndMisc: number;
    total: number;
  };
  totalSetupCapex: number;
  paybackPeriodMonths: number;
  capitalSufficiency: 'Optimal' | 'Adequate' | 'Deficit';
  dataGroundedPros: string[];
  dataGroundedRisks: string[];
  strategicActionPlan: string[];
  engineUsed: string;
  sihFeasibility?: SihFeasibilityReport;
  agglomerationAnalysis?: AgglomerationClusterAnalysis;
}

export function calculate5PillarFeasibilityScore(params: {
  effectiveBudget: number;
  minReqCapital: number;
  typicalCapital: number;
  isSpecializedCluster: boolean;
  competitorsCount: number;
  rentToRevenueRatio: number;
  footfallDensity: string;
  dailyTraffic: number;
  monthlyNetProfit: number;
  netMarginPercent: number;
  paybackMonths: number;
}): {
  score: number;
  capitalScore: number;
  competitionScore: number;
  rentScore: number;
  footfallScore: number;
  profitScore: number;
  verdict: 'HIGHLY_PROFITABLE' | 'PROFITABLE' | 'MARGINAL' | 'HIGH_RISK';
} {
  const {
    effectiveBudget,
    minReqCapital,
    typicalCapital,
    isSpecializedCluster,
    competitorsCount,
    rentToRevenueRatio,
    footfallDensity,
    dailyTraffic,
    monthlyNetProfit,
    netMarginPercent,
    paybackMonths,
  } = params;

  // Pillar 1: Capital Adequacy (Max 1.30 pts)
  const capRatio = effectiveBudget / Math.max(1000, minReqCapital);
  let capitalScore = 0.95;
  if (capRatio < 0.25) capitalScore = 0.15;
  else if (capRatio < 0.50) capitalScore = 0.35;
  else if (capRatio < 0.75) capitalScore = 0.65;
  else if (capRatio < 1.00) capitalScore = 0.90;
  else if (effectiveBudget >= typicalCapital * 0.9) capitalScore = 1.30;
  else capitalScore = 1.15;

  // Pillar 2: Competition Saturation vs Cluster Agglomeration (Max 1.10 pts)
  let competitionScore = 0.75;
  if (isSpecializedCluster) {
    if (capRatio >= 0.75) {
      competitionScore = 1.10; // Full cluster agglomeration synergy
    } else {
      competitionScore = 0.75; // Partial cluster synergy hampered by capital shortage
    }
  } else {
    if (competitorsCount <= 2) competitionScore = 1.10; // Monopoly / under-penetrated
    else if (competitorsCount <= 5) competitionScore = 0.85; // Healthy competitive tension
    else if (competitorsCount <= 9) competitionScore = 0.60; // Moderate competition
    else if (competitorsCount <= 14) competitionScore = 0.30; // High saturation
    else competitionScore = 0.10; // Severe oversaturation, price wars
  }

  // Pillar 3: Rent Burden & Fixed Overhead Stress (Max 0.90 pts)
  let rentScore = 0.65;
  if (rentToRevenueRatio > 0.40) rentScore = 0.10; // Severe rental distress
  else if (rentToRevenueRatio > 0.28) rentScore = 0.30; // Heavy rental burden
  else if (rentToRevenueRatio > 0.18) rentScore = 0.60; // Standard commercial rent
  else rentScore = 0.90; // Low overhead, safe margin

  // Pillar 4: Footfall & Catchment Traffic (Max 0.90 pts)
  let footfallScore = 0.65;
  if (footfallDensity === 'Very High' || dailyTraffic >= 18000) footfallScore = 0.90;
  else if (footfallDensity === 'High' || dailyTraffic >= 9000) footfallScore = 0.75;
  else if (footfallDensity === 'Medium' || dailyTraffic >= 3500) footfallScore = 0.55;
  else footfallScore = 0.25;

  // Pillar 5: Net Profitability & Payback (Max 0.80 pts, or negative deduction during deficit)
  const isLossMaking = monthlyNetProfit <= 0 || netMarginPercent < 0;
  let profitScore = 0.50;

  if (isLossMaking) {
    if (netMarginPercent <= -20 || monthlyNetProfit <= -30000) profitScore = -0.80;
    else if (netMarginPercent <= -10 || monthlyNetProfit <= -15000) profitScore = -0.50;
    else profitScore = -0.25;
  } else if (netMarginPercent < 4 || paybackMonths > 40) {
    profitScore = 0.15;
  } else if (netMarginPercent < 8 || paybackMonths > 28) {
    profitScore = 0.30;
  } else if (netMarginPercent < 18 || paybackMonths > 18) {
    profitScore = 0.55;
  } else if (netMarginPercent < 30 || paybackMonths > 9) {
    profitScore = 0.72;
  } else {
    profitScore = 0.80;
  }

  let rawScore = capitalScore + competitionScore + rentScore + footfallScore + profitScore;

  // STRICT FEASIBILITY CEILING:
  // If net margin is negative (business loses money every month / cash burn),
  // commercial feasibility CANNOT exceed 2.4 / 5.0 under ANY circumstance.
  if (isLossMaking) {
    if (netMarginPercent <= -20 || monthlyNetProfit <= -30000) {
      rawScore = Math.min(1.6, rawScore);
    } else if (netMarginPercent <= -10 || monthlyNetProfit <= -15000) {
      rawScore = Math.min(2.0, rawScore);
    } else {
      rawScore = Math.min(2.4, rawScore);
    }
  } else if (netMarginPercent < 5) {
    // Fragile / razor-thin margin (< 5%) cannot be rated 'Profitable' (capped at 2.8)
    rawScore = Math.min(2.8, rawScore);
  }

  const score = Number(Math.min(4.9, Math.max(1.2, rawScore)).toFixed(1));

  let verdict: 'HIGHLY_PROFITABLE' | 'PROFITABLE' | 'MARGINAL' | 'HIGH_RISK';
  if (isLossMaking) {
    verdict = 'HIGH_RISK';
  } else if (score >= 4.2 && netMarginPercent >= 18) {
    verdict = 'HIGHLY_PROFITABLE';
  } else if (score >= 3.5 && netMarginPercent >= 8) {
    verdict = 'PROFITABLE';
  } else if (score >= 2.6) {
    verdict = 'MARGINAL';
  } else {
    verdict = 'HIGH_RISK';
  }

  return {
    score,
    capitalScore,
    competitionScore,
    rentScore,
    footfallScore,
    profitScore,
    verdict,
  };
}

export const geminiAdvisorService = {
  getStoredApiKey(): string {
    if (typeof localStorage === 'undefined') return '';
    return localStorage.getItem('vyapar_gemini_api_key') || '';
  },

  setStoredApiKey(key: string): void {
    if (typeof localStorage === 'undefined') return;
    if (key.trim()) {
      localStorage.setItem('vyapar_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('vyapar_gemini_api_key');
    }
  },

  async evaluateProfitability(
    location: string,
    shopType: string,
    shopSize: number,
    budget: number,
    catchment: CatchmentScanResult,
    customApiKey?: string,
    isMarginMoney?: boolean
  ): Promise<BusinessFinancialProjection> {
    const apiKey = (customApiKey || this.getStoredApiKey()).trim();
    const effectiveBudget = isMarginMoney ? budget * 10 : budget;

    const ruralIntel = getRuralTehsilIntelligence(location);
    if (ruralIntel.isRuralLocation && ruralIntel.benchmarkRent) {
      catchment = {
        ...catchment,
        rentPerSqft: ruralIntel.benchmarkRent,
      };
    }

    // 1. Try Live AI API if key provided (Gemini, Groq, Perplexity)
    if (apiKey) {
      try {
        const aiResult = await this._callMultiProviderAI(
          apiKey,
          location,
          shopType,
          shopSize,
          effectiveBudget,
          catchment,
          ruralIntel
        );
        if (aiResult) return aiResult;
      } catch (err) {
        console.warn('[AI API error, falling back to rigorous econometric engine]', err);
      }
    }

    // 2. High-Accuracy Deterministic Retail Unit Economics Engine
    return this._calculateDeterministicEconomics(
      location,
      shopType,
      shopSize,
      effectiveBudget,
      catchment,
      ruralIntel
    );
  },

  async _callMultiProviderAI(
    apiKey: string,
    location: string,
    shopType: string,
    shopSize: number,
    budget: number,
    catchment: CatchmentScanResult,
    ruralIntel: ReturnType<typeof getRuralTehsilIntelligence>
  ): Promise<BusinessFinancialProjection | null> {
    const prompt = `You are an expert commercial retail economist and business feasibility analyst in India.
Analyze whether it is financially profitable to open a "${shopType}" in "${location}".
Proposed Setup:
- Floor Space: ${shopSize} sq ft
- Available Capital: ₹${budget.toLocaleString('en-IN')}
- Pedestrian Daily Footfall: ${catchment.estimatedDailyTraffic} visitors/day
- Nearby Competitors: ${catchment.competitorsCount}
- Commercial Rent: ₹${catchment.rentPerSqft}/sq ft/month

ECONOMIC PRINCIPLES:
1. Capital Adequacy: If the capital is too low for the concept (e.g. attempting a shopping mall with ₹10 Lakhs, or a luxury specialty cafe with ₹50,000), declare it HIGH_RISK with a low feasibility verdict due to severe undercapitalization.
2. Competition vs Agglomeration:
   - For artisan/craft trades (Mojaris, handblock, pottery, brassware): high competitor count (15-60) is an Agglomeration Destination Cluster advantage.
   - For generic commoditized retail (groceries, mobile accessories, generic tea stall): 15+ competitors is severe saturation and margin erosion.
3. Realistic Financials: Return realistic monthly revenue, opex, net profit, and payback months.

Respond ONLY with valid JSON:
{
  "isProfitable": true,
  "verdict": "HIGHLY_PROFITABLE",
  "verdictTitle": "Short descriptive title",
  "verdictSummary": "2-3 sentence strategic verdict",
  "monthlyRevenueEst": 450000,
  "monthlyNetProfitEst": 125000,
  "netMarginPercent": 27.7,
  "expectedDailyOrders": 45,
  "averageTicketSize": 350,
  "totalSetupCapex": 1200000,
  "paybackPeriodMonths": 10.5,
  "capitalSufficiency": "Optimal",
  "pros": ["Pro 1", "Pro 2"],
  "risks": ["Risk 1", "Risk 2"],
  "actionPlan": ["Action 1", "Action 2"]
}`;

    // 1. Groq API
    if (apiKey.startsWith('gsk_')) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.3
          })
        });
        if (res.ok) {
          const data = await res.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          return this._synthesizeAIResponse(parsed, location, shopType, budget, catchment, ruralIntel, 'Groq Llama-3.3-70B AI Engine');
        }
      } catch (e) {
        console.warn('[Groq API Error]', e);
      }
    }

    // 2. Perplexity API
    if (apiKey.startsWith('pplx-')) {
      try {
        const res = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'sonar',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2
          })
        });
        if (res.ok) {
          const data = await res.json();
          const raw = data.choices[0].message.content;
          const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          return this._synthesizeAIResponse(parsed, location, shopType, budget, catchment, ruralIntel, 'Perplexity Sonar AI Engine');
        }
      } catch (e) {
        console.warn('[Perplexity API Error]', e);
      }
    }

    // 3. Google Gemini API
    return this._callGeminiAPI(apiKey, location, shopType, shopSize, budget, catchment, ruralIntel);
  },

  async _callGeminiAPI(
    apiKey: string,
    location: string,
    shopType: string,
    shopSize: number,
    budget: number,
    catchment: CatchmentScanResult,
    ruralIntel: ReturnType<typeof getRuralTehsilIntelligence>
  ): Promise<BusinessFinancialProjection | null> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const prompt = `Act as an expert retail economist in India. Analyze feasibility of opening ${shopType} in ${location} with ₹${budget} capital and ${shopSize} sqft. Nearby competitors: ${catchment.competitorsCount}. Rent: ₹${catchment.rentPerSqft}/sqft. Return JSON with isProfitable, verdict (HIGHLY_PROFITABLE|PROFITABLE|MARGINAL|HIGH_RISK), verdictTitle, verdictSummary, monthlyRevenueEst, monthlyNetProfitEst, netMarginPercent, expectedDailyOrders, averageTicketSize, totalSetupCapex, paybackPeriodMonths, capitalSufficiency, pros, risks, actionPlan.`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      if (!res.ok) return null;
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) return null;
      const parsed = JSON.parse(text);
      return this._synthesizeAIResponse(parsed, location, shopType, budget, catchment, ruralIntel, 'Google Gemini Pro Engine');
    } catch (e) {
      console.warn('[Gemini API Call Failed]', e);
      return null;
    }
  },

  _synthesizeAIResponse(
    parsed: any,
    location: string,
    shopType: string,
    budget: number,
    catchment: CatchmentScanResult,
    ruralIntel: ReturnType<typeof getRuralTehsilIntelligence>,
    engineName: string
  ): BusinessFinancialProjection {
    const agglomeration = this._buildAgglomerationAnalysis(location, shopType, catchment, ruralIntel);
    const monthlyRevenue = Number(parsed.monthlyRevenueEst) > 0 ? Number(parsed.monthlyRevenueEst) : 350000;
    const monthlyNetProfit = typeof parsed.monthlyNetProfitEst === 'number'
      ? parsed.monthlyNetProfitEst
      : !isNaN(Number(parsed.monthlyNetProfitEst))
      ? Number(parsed.monthlyNetProfitEst)
      : 65000;

    const netMarginPercent = typeof parsed.netMarginPercent === 'number'
      ? parsed.netMarginPercent
      : !isNaN(Number(parsed.netMarginPercent))
      ? Number(parsed.netMarginPercent)
      : Math.round(((monthlyNetProfit / Math.max(1, monthlyRevenue)) * 100) * 10) / 10;

    const lowerType = shopType.toLowerCase();
    const matchedModel = M_BUSINESS_CATALOG.find(b =>
      b.name.toLowerCase().includes(lowerType) ||
      lowerType.includes(b.name.toLowerCase()) ||
      b.subCategory.toLowerCase().includes(lowerType)
    );

    const isMall = /mall|arcade|multiplex/i.test(shopType);
    const isLuxuryCafe = /specialty cafe|roastery|bistro|fine dining/i.test(shopType);
    const isTechStore = /laptop|acer|asus|apple|computer|electronics|gaming/i.test(shopType);
    const isCloudKitchen = /cloud kitchen|dark kitchen/i.test(shopType);
    const isCraft = /shoe|leather|mojari|jutti|cobbler|pottery|clay|handblock|textile|handloom|carpentry|wood|blacksmith|lohar/i.test(shopType);

    const minReqCapital = matchedModel ? matchedModel.minBudget : (isMall ? 50000000 : isLuxuryCafe ? 3000000 : isTechStore ? 3500000 : isCloudKitchen ? 1500000 : isCraft ? 25000 : 100000);
    const typicalCapital = matchedModel ? matchedModel.typicalBudget : (isMall ? 100000000 : isLuxuryCafe ? 5000000 : isTechStore ? 6000000 : isCloudKitchen ? 2500000 : isCraft ? 80000 : 250000);

    const rentToRevenue = (catchment.rentPerSqft * 120) / Math.max(1, monthlyRevenue);

    const pillarResult = calculate5PillarFeasibilityScore({
      effectiveBudget: budget,
      minReqCapital,
      typicalCapital,
      isSpecializedCluster: agglomeration.isSpecializedCluster,
      competitorsCount: catchment.competitorsCount,
      rentToRevenueRatio: rentToRevenue,
      footfallDensity: catchment.footfallDensity,
      dailyTraffic: catchment.estimatedDailyTraffic,
      monthlyNetProfit,
      netMarginPercent,
      paybackMonths: Number(parsed.paybackPeriodMonths) || 14,
    });

    const isLossMaking = monthlyNetProfit <= 0 || netMarginPercent < 0;

    return {
      overallFeasibilityScore: pillarResult.score,
      isProfitable: !isLossMaking,
      verdict: isLossMaking ? 'HIGH_RISK' : pillarResult.verdict,
      verdictTitle: isLossMaking
        ? `Operating at Net Loss (${netMarginPercent}% Net Margin)`
        : parsed.verdictTitle || 'Business Feasibility Confirmed',
      verdictSummary: isLossMaking
        ? `Projected operational expenses exceed gross revenue by ₹${Math.abs(monthlyNetProfit).toLocaleString('en-IN')}/month (${netMarginPercent}% net margin). Under current cost parameters, this location is commercially unviable and will result in continuous monthly cash burn.`
        : parsed.verdictSummary || 'Viable commercial operation based on local footfall and margin dynamics.',
      monthlyRevenueEst: monthlyRevenue,
      monthlyNetProfitEst: monthlyNetProfit,
      netMarginPercent,
      breakevenOrdersPerDay: Math.ceil((parsed.totalSetupCapex || budget * 0.5) / Math.max(10, (monthlyRevenue / 30 * 0.4))),
      expectedDailyOrders: Number(parsed.expectedDailyOrders) || 35,
      averageTicketSize: Number(parsed.averageTicketSize) || 280,
      monthlyOperatingExpenses: {
        rent: catchment.rentPerSqft * 120,
        salaries: 24000,
        utilitiesAndPower: 6000,
        rawMaterialsCogs: Math.round(monthlyRevenue * 0.42),
        marketingAndMisc: 5000,
        total: Math.max(10000, monthlyRevenue - monthlyNetProfit),
      },
      totalSetupCapex: Number(parsed.totalSetupCapex) || budget,
      paybackPeriodMonths: Number(parsed.paybackPeriodMonths) || 14,
      capitalSufficiency: parsed.capitalSufficiency || (budget >= (parsed.totalSetupCapex || budget) * 0.8 ? 'Optimal' : 'Deficit'),
      dataGroundedPros: parsed.pros || ['Strong catchment walk-in demand', 'Positive operating margin profile'],
      dataGroundedRisks: isLossMaking
        ? [`Severe Operating Deficit: Business bleeds -₹${Math.abs(monthlyNetProfit).toLocaleString('en-IN')}/mo with a negative net margin of ${netMarginPercent}%.`, ...(parsed.risks || [])]
        : parsed.risks || ['Local competition requires distinct branding'],
      strategicActionPlan: parsed.actionPlan || ['Register for Udyam MSME scheme', 'Optimize inventory turnover'],
      engineUsed: engineName,
      agglomerationAnalysis: agglomeration,
      sihFeasibility: this._buildSihFeasibilityReport(
        location,
        shopType,
        budget,
        catchment,
        monthlyNetProfit > 0,
        ruralIntel,
        agglomeration
      ),
    };
  },

  _buildAgglomerationAnalysis(
    location: string,
    shopType: string,
    catchment: CatchmentScanResult,
    ruralIntel: ReturnType<typeof getRuralTehsilIntelligence>
  ): AgglomerationClusterAnalysis {
    const isArtisanCraft = /shoe|mojari|jutti|cobbler|leather craft|pottery|blue pottery|terracotta|handblock|sanganeri print|bagru print|handloom weaver|brassware/i.test(shopType);
    const competitorCount = Math.max(
      catchment.competitorsCount,
      ruralIntel.detectedCluster?.artisanWorkshopsCount || (isArtisanCraft ? 24 : 6)
    );

    const isSpecializedCluster = Boolean(ruralIntel.detectedCluster)
      ? isArtisanCraft || Boolean(ruralIntel.detectedCluster?.craftType.toLowerCase().includes(shopType.toLowerCase().split(' ')[0]))
      : isArtisanCraft && competitorCount >= 10;
    const clusterName = ruralIntel.detectedCluster
      ? ruralIntel.detectedCluster.clusterName
      : isSpecializedCluster
      ? `${location} Specialized ${shopType.split(' ')[0]} Cluster`
      : 'General Commercial Corridor';

    const agglomerationIndex = ruralIntel.detectedCluster
      ? ruralIntel.detectedCluster.agglomerationRating
      : isSpecializedCluster
      ? Math.min(9.6, Number((7.5 + competitorCount * 0.05).toFixed(1)))
      : 4.5;

    return {
      isSpecializedCluster,
      clusterName,
      agglomerationIndex,
      competitorsInZone: competitorCount,
      rawMaterialSavingsPercent: isSpecializedCluster ? 28 : 8,
      destinationFootfallMultiplier: isSpecializedCluster ? 2.2 : 1.0,
      subcontractingPotential: isSpecializedCluster ? 'Very High' : 'Low',
      dualStrategyVerdict: {
        clusterStrategy: {
          title: 'Path A: Specialized Cluster Member (संकुल कारीगर रणनीति)',
          verdict: 'Viable & Highly Synergistic: High destination footfall from buyers traveling specifically for this craft, 28% input raw material savings from co-located suppliers, and piece-rate overflow orders from master workshops.',
          operationalTactics: [
            'Specialize in high-margin custom craft (e.g. bespoke embellished bridal Mojaris, orthopedic insoles, custom sizing)',
            'Establish piece-rate sub-contracting relationships with senior master craftsmen for stitching & lasting overflow',
            'Leverage co-located raw leather and sole suppliers right across the street to eliminate delivery freight',
            'Adopt instant UPI payments and maintain a WhatsApp photo catalogue for visiting tourists and urban buyers'
          ],
          marginTarget: '38% – 48% Gross Margin on custom handcrafted orders'
        },
        dispersionStrategy: {
          title: 'Path B: Outer Tehsil Feeder Monopoly (ग्रामीण एकाधिकार रणनीति)',
          verdict: 'Viable as Local Essential Service: Zero competition in an outer residential ward or village crossroads, serving everyday school/work footwear needs and rapid local repairs without customer travel.',
          operationalTactics: [
            'Focus on quick sole replacement, heel pasting, school shoe repairs, and agricultural footwear maintenance',
            'Offer same-day turnaround for local farming families who cannot afford a 15 km trip to the tehsil mandi',
            'Operate with ultra-low overhead (₹1,500/month tehsil stall or home kiosk) securing 65%+ net margins'
          ],
          marginTarget: '60% – 70% Gross Margin on repair & local utility footwear'
        },
        recommendedPath: isSpecializedCluster ? 'JOIN_CLUSTER_WITH_SPECIALIZATION' : 'SERVE_OUTER_TEHSIL_MONOPOLY'
      }
    };
  },

  _buildSihFeasibilityReport(
    location: string,
    shopType: string,
    budget: number,
    catchment: CatchmentScanResult,
    isProfitable: boolean,
    ruralIntel: ReturnType<typeof getRuralTehsilIntelligence>,
    agglomeration: AgglomerationClusterAnalysis
  ): SihFeasibilityReport {
    const radiusKm = 8;
    const estimatedConsumerBase = Math.round(Math.max(16000, catchment.estimatedDailyTraffic * 2.2));
    const compDensity = Math.max(3, Math.min(15, Math.round(catchment.competitorsCount * 0.8)));
    const informalCount = Math.max(6, Math.round(catchment.competitorsCount * 1.5));

    return {
      marketReach: {
        radiusKm,
        estimatedConsumerBase,
        primaryChannels: [
          `Weekly Village Haats & Mandis (${ruralIntel.weeklyHaatDays.join(', ')})`,
          'Tehsil Main Crossroads & Bus Stand Feeder Nodes',
          'Cooperative Milk & Agro Society Collection Desks',
          'Local Self-Help Group (SHG) & Gramin Artisan Networks',
        ],
        catchmentDescription: `Feasibility analysis for ${location} establishes an immediate 5–10 km catchment servicing ~${estimatedConsumerBase.toLocaleString('en-IN')} rural/semi-urban patrons across weekly haats and panchayat clusters.`,
      },
      opportunityAnalysis: {
        underservedNiches: [
          agglomeration.isSpecializedCluster
            ? `High demand for specialized, bespoke craftsmanship inside ${agglomeration.clusterName}`
            : `Shortage of reliable, rapid ${shopType} services in ${location}`,
          '28% raw material savings by sourcing directly from co-located wholesale tanners/merchants',
          'High demand for localized same-day repair and direct artisan-to-consumer sales',
        ],
        localDemandDrivers: [
          'Steady daily utility expenditure from agricultural and rural commuting households',
          'Surge liquidity during post-harvest windows (Rabi & Kharif sales) and wedding seasons',
          'Regional festivals, weekly bazaar congregations, and tourist transit routes',
        ],
        valueAdditionPotential: 'Unlocks 35% to 50% gross margin through direct artisan manufacturing and eliminating middleman agent commissions.',
      },
      swotAnalysis: {
        strengths: [
          agglomeration.isSpecializedCluster
            ? 'Magnet Destination Demand: Customers travel specifically to this cluster seeking variety and craftsmanship'
            : `Low rental load (benchmark ₹${catchment.rentPerSqft}/sqft in rural tehsil)`,
          'Direct community familiarity, established artisan reputation, and zero digital ad spend',
          '25-30% input cost savings via immediate proximity to raw material wholesale merchants',
        ],
        weaknesses: [
          'Initial working capital buffer requires disciplined inventory turnover',
          'Vulnerability to localized single-phase power supply fluctuations',
          'Need to establish distinct design specialty to avoid generic price competition',
        ],
        opportunities: [
          'Pre-qualified for PM Vishwakarma Scheme (₹15,000 toolkit + ₹1 Lakh concessional credit @ 5%)',
          'Pre-qualified for MoSJE Concessional Credit Window (6.5% - 8.0% interest rate with moratorium)',
          'Expansion into 4 adjacent village clusters within 8 km radius via weekly haat pop-up stalls',
        ],
        threats: [
          'Seasonal liquidity dips during pre-harvest lean agricultural months',
          'Predatory lending competition from informal non-banking village moneylenders',
          'Monsoon logistics disruption on rural arterial connecting roads',
        ],
      },
      threatsIdentification: {
        supplyChainBottlenecks: [
          'Feeder road delays during heavy monsoon periods causing 24-48h replenishment lags',
          'Limited climate-controlled raw material storage in rural workshops',
        ],
        seasonalFluctuations: [
          'Strongest revenue realized during harvest months (April-May & Oct-Nov) and wedding seasons',
          '25-30% volume reduction during monsoon agricultural planting periods',
        ],
        singleBuyerDependency: [
          'Risk of delayed payments if relying exclusively on one bulk city trader',
          'Price suppression risk if output is monopolized by a single mandi merchant',
        ],
        mitigationRoadmap: [
          'Deploy the recommended 40% Working Capital reserve structured via MoSJE / Vishwakarma loan',
          'Maintain a minimum diversified roster of independent retail purchasers and direct clients',
          'Enforce instant digital UPI transactions and strict 14-day credit settlement ceilings',
        ],
      },
      competitorMapping: {
        blockBusinessDensityPer10k: compDensity,
        informalCompetitorsEstimate: informalCount,
        organizedCompetitors: catchment.competitorBrands.length > 0
          ? catchment.competitorBrands
          : ['Local Independent Workshops', 'Village Center Kiosks', 'Regional Master Artisans'],
        marketSaturationVerdict: agglomeration.isSpecializedCluster
          ? 'Specialized Artisan Cluster'
          : catchment.competitorsCount > 12
          ? 'High Saturation'
          : catchment.competitorsCount >= 5
          ? 'Balanced'
          : 'Under-penetrated',
      },
      productMarketValue: {
        recommendedPricing: agglomeration.isSpecializedCluster
          ? 'Maintain competitive baseline on standard items while capturing 35%+ premium on bespoke made-to-order craft.'
          : `Position unit price 12% to 18% below branded big-city MRPs to align with regional purchasing power.`,
        regionalPurchasingPowerVerdict: 'Consistent daily spend with average household transaction basket of ₹180 – ₹450.',
        priceElasticity: 'Inelastic (Essential)',
        marginRealizationTarget: '28% to 42% net operational surplus post-materials and power',
      },
      agglomerationAnalysis: agglomeration,
    };
  },

  _calculateDeterministicEconomics(
    location: string,
    shopType: string,
    shopSize: number,
    budget: number,
    catchment: CatchmentScanResult,
    ruralIntel: ReturnType<typeof getRuralTehsilIntelligence>
  ): BusinessFinancialProjection {
    const rentPerSqft = catchment.rentPerSqft;
    const monthlyRent = Math.max(1200, rentPerSqft * shopSize);

    const lowerType = shopType.toLowerCase();
    const matchedModel = M_BUSINESS_CATALOG.find(b =>
      b.name.toLowerCase().includes(lowerType) ||
      lowerType.includes(b.name.toLowerCase()) ||
      b.subCategory.toLowerCase().includes(lowerType)
    );

    const isMall = /mall|arcade|multiplex/i.test(shopType);
    const isLuxuryCafe = /specialty cafe|roastery|bistro|fine dining/i.test(shopType);
    const isTechStore = /laptop|acer|asus|apple|computer|electronics|gaming/i.test(shopType);
    const isCloudKitchen = /cloud kitchen|dark kitchen/i.test(shopType);
    const isCraft = /shoe|leather|mojari|jutti|cobbler|pottery|clay|handblock|textile|handloom|carpentry|wood|blacksmith|lohar|repair|pump|motor/i.test(shopType);

    const agglomeration = this._buildAgglomerationAnalysis(location, shopType, catchment, ruralIntel);

    let minReqCapital = matchedModel ? matchedModel.minBudget : (isMall ? 50000000 : isLuxuryCafe ? 3000000 : isTechStore ? 3500000 : isCloudKitchen ? 1500000 : isCraft ? 25000 : 100000);
    let typicalCapital = matchedModel ? matchedModel.typicalBudget : (isMall ? 100000000 : isLuxuryCafe ? 5000000 : isTechStore ? 6000000 : isCloudKitchen ? 2500000 : isCraft ? 80000 : 250000);

    // 1. Capital Sufficiency & Deficit Calculation
    let capitalSufficiency: 'Optimal' | 'Adequate' | 'Deficit' = 'Adequate';
    let capitalDeficitRatio = 1.0;

    if (budget >= typicalCapital * 0.8) {
      capitalSufficiency = 'Optimal';
      capitalDeficitRatio = 1.0;
    } else if (budget >= minReqCapital * 0.8) {
      capitalSufficiency = 'Adequate';
      capitalDeficitRatio = 0.9;
    } else {
      capitalSufficiency = 'Deficit';
      capitalDeficitRatio = Math.max(0.15, budget / Math.max(1, minReqCapital));
    }

    // 2. Competition Saturation Penalty for dispersion trades
    const isClusterBenefit = matchedModel ? matchedModel.competitionSensitivity === 'Cluster_Beneficial' : (agglomeration.isSpecializedCluster || isCraft);
    let competitionPenaltyFactor = 1.0;
    const compCount = catchment.competitorsCount;

    if (!isClusterBenefit && compCount >= 10) {
      competitionPenaltyFactor = Math.max(0.40, 1 - (compCount - 8) * 0.05);
    } else if (isClusterBenefit && compCount >= 10) {
      competitionPenaltyFactor = 1.15;
    }

    // 3. Benchmarking Revenue & Expenses
    let averageTicket = matchedModel ? Math.round(matchedModel.monthlyRevenue / 450) : 220;
    let cogsPercentage = matchedModel ? (1 - (matchedModel.targetMarginPercent / 100)) : 0.40;
    if (agglomeration.isSpecializedCluster) {
      cogsPercentage = Math.max(0.25, cogsPercentage - 0.10);
    }

    let staffCount = shopSize > 1000 ? 5 : shopSize > 400 ? 2 : shopSize > 150 ? 1 : 0;
    let avgSalary = 16000;
    if (isCraft && budget <= 150000) {
      staffCount = 0;
      avgSalary = 0;
    }

    const baseDailyTraffic = Math.max(1200, catchment.estimatedDailyTraffic);
    const effectiveTrafficShare = isClusterBenefit
      ? baseDailyTraffic
      : baseDailyTraffic / Math.max(1, 1 + compCount * 0.45);

    const baseConversion = (agglomeration.isSpecializedCluster ? 0.006 : 0.0028) *
      (catchment.footfallDensity === 'Very High' ? 1.3 : catchment.footfallDensity === 'High' ? 1.05 : 0.75);

    let expectedDailyCustomers = Math.max(2, Math.round(effectiveTrafficShare * baseConversion * competitionPenaltyFactor));

    if (capitalSufficiency === 'Deficit') {
      expectedDailyCustomers = Math.max(1, Math.round(expectedDailyCustomers * capitalDeficitRatio));
    }

    const monthlyRevenueEst = Math.round(expectedDailyCustomers * averageTicket * 30);
    const powerAndUtilities = Math.max(1200, Math.round(shopSize * 18 + 2000));
    const rawMaterialsCogs = Math.round(monthlyRevenueEst * cogsPercentage);
    const salaries = staffCount * avgSalary;
    const marketingAndMisc = Math.round(monthlyRevenueEst * 0.03 + 2000);

    const totalOpex = monthlyRent + salaries + powerAndUtilities + rawMaterialsCogs + marketingAndMisc;
    const monthlyNetProfitEst = monthlyRevenueEst - totalOpex;
    const netMarginPercent = Math.round((monthlyNetProfitEst / Math.max(1, monthlyRevenueEst)) * 1000) / 10;

    const rentToRevenueRatio = monthlyRent / Math.max(1, monthlyRevenueEst);

    const securityDeposit = monthlyRent * 3;
    const interiorFitout = isCraft && budget <= 150000 ? Math.min(12000, shopSize * 50) : Math.round(shopSize * 350);
    const initialEquipment = isCraft && budget <= 150000 ? Math.min(25000, shopSize * 100) : Math.round(shopSize * 400);
    const workingCapitalBuffer = Math.max(20000, monthlyRent * 2);
    const totalSetupCapex = Math.round(securityDeposit + interiorFitout + initialEquipment + workingCapitalBuffer);

    const breakevenOrdersPerDay = Math.ceil((totalOpex - rawMaterialsCogs) / (Math.max(10, averageTicket * (1 - cogsPercentage)) * 30));
    const paybackPeriodMonths = monthlyNetProfitEst > 0 ? Math.round((totalSetupCapex / monthlyNetProfitEst) * 10) / 10 : 99;

    const pillarResult = calculate5PillarFeasibilityScore({
      effectiveBudget: budget,
      minReqCapital,
      typicalCapital,
      isSpecializedCluster: agglomeration.isSpecializedCluster,
      competitorsCount: compCount,
      rentToRevenueRatio,
      footfallDensity: catchment.footfallDensity,
      dailyTraffic: baseDailyTraffic,
      monthlyNetProfit: monthlyNetProfitEst,
      netMarginPercent,
      paybackMonths: paybackPeriodMonths,
    });

    const isLossMaking = monthlyNetProfitEst <= 0 || netMarginPercent < 0;
    const verdict = isLossMaking ? 'HIGH_RISK' : pillarResult.verdict;
    let verdictTitle = 'Economically Viable Opportunity';
    let verdictSummary = '';

    if (isLossMaking) {
      verdictTitle = `Operating at Net Loss (${netMarginPercent}% Net Margin)`;
      verdictSummary = `Monthly operating expenses (₹${totalOpex.toLocaleString('en-IN')}) exceed gross revenue receipts (₹${monthlyRevenueEst.toLocaleString('en-IN')}), producing an operating deficit of -₹${Math.abs(monthlyNetProfitEst).toLocaleString('en-IN')}/month (${netMarginPercent}% net margin). Under current cost parameters and customer footfall, opening here is economically unviable and will rapidly deplete working capital.`;
    } else if (capitalSufficiency === 'Deficit' && budget < minReqCapital * 0.5) {
      verdictTitle = 'Severe Capital Under-Funding (High Risk)';
      verdictSummary = `Attempting to establish a ${shopType} with ₹${budget.toLocaleString('en-IN')} is financially unviable. Minimum required threshold is ₹${minReqCapital.toLocaleString('en-IN')}. Without sufficient working capital, inventory stockouts and lease default are imminent.`;
    } else if (!isClusterBenefit && compCount >= 14) {
      verdictTitle = 'Severe Market Saturation Risk';
      verdictSummary = `High competitor saturation (${compCount} direct competitors mapped in catchment). In this commoditized retail category, margin dilution and customer acquisition costs compress net profits to unsustainable levels.`;
    } else if (rentToRevenueRatio > 0.35) {
      verdictTitle = 'Severe Rent Distress Warning';
      verdictSummary = `Monthly commercial rent (₹${monthlyRent.toLocaleString('en-IN')}) consumes ${Math.round(rentToRevenueRatio * 100)}% of projected gross revenue (benchmark threshold is < 18%). High risk of lease distress.`;
    } else if (agglomeration.isSpecializedCluster) {
      verdictTitle = `Specialized Artisan Cluster (${agglomeration.clusterName})`;
      verdictSummary = `Opening here is viable because ${agglomeration.competitorsInZone} neighboring artisan workshops create a Destination Market where buyers congregate specifically for this craft, with 28% cheaper raw materials yielding ₹${monthlyNetProfitEst.toLocaleString('en-IN')}/month net profit.`;
    } else if (verdict === 'HIGHLY_PROFITABLE') {
      verdictTitle = 'High Commercial Profitability Confirmed';
      verdictSummary = `${location} delivers robust footfall supporting ${expectedDailyCustomers} daily customers, yielding healthy monthly profits of ₹${monthlyNetProfitEst.toLocaleString('en-IN')} (${netMarginPercent}% net margin).`;
    } else if (verdict === 'PROFITABLE') {
      verdictTitle = 'Solid Micro-Enterprise Viability';
      verdictSummary = `Opening a ${shopType} in ${location} is profitable with disciplined operations. You break even at ~${breakevenOrdersPerDay} orders/day against an expected ${expectedDailyCustomers} daily orders.`;
    } else if (verdict === 'MARGINAL') {
      verdictTitle = 'Marginal Profitability — Tight Cashflows';
      verdictSummary = `Estimated monthly profit is ₹${monthlyNetProfitEst.toLocaleString('en-IN')}. High fixed overheads or competitive pressure requires operational tightening.`;
    } else {
      verdictTitle = 'Operational Loss Risk';
      verdictSummary = `High risk of cash burn or unviable operations. Downsize space, increase capital buffer, or relocate to an unserved corridor.`;
    }

    const pros: string[] = [];
    if (!isLossMaking && agglomeration.isSpecializedCluster) {
      pros.push(`Destination Cluster Synergy: ${agglomeration.competitorsInZone} workshops act as a magnet for buyers from across the region.`);
      pros.push('Input Raw Material Savings: Co-located wholesale suppliers reduce input logistics costs by 28%.');
    } else if (!isLossMaking && expectedDailyCustomers >= 25) {
      pros.push(`Catchment footfall of ${baseDailyTraffic.toLocaleString()} daily commuters verifies active walk-in demand.`);
      pros.push(`Break-even requires ${breakevenOrdersPerDay} daily orders against expected ${expectedDailyCustomers} customers.`);
    }

    if (capitalSufficiency === 'Optimal') {
      pros.push(`Capital reserve (₹${budget.toLocaleString('en-IN')}) provides a healthy working capital runway of 6+ months.`);
    }

    const risks: string[] = [];
    if (isLossMaking) {
      risks.push(`Severe Operating Deficit: Monthly net deficit is -₹${Math.abs(monthlyNetProfitEst).toLocaleString('en-IN')}/mo with a negative net margin of ${netMarginPercent}%.`);
    }
    if (capitalSufficiency === 'Deficit') {
      risks.push(`Critical Capital Shortage: Allocated budget (₹${budget.toLocaleString('en-IN')}) is below required setup capex (₹${minReqCapital.toLocaleString('en-IN')}).`);
    }
    if (!isClusterBenefit && compCount >= 10) {
      risks.push(`High competitor density: ${compCount} nearby stores mapped in non-destination category.`);
    }
    if (rentToRevenueRatio > 0.22) {
      risks.push(`High rental burden: Commercial rent consumes ${Math.round(rentToRevenueRatio * 100)}% of gross monthly sales.`);
    }
    if (risks.length === 0) {
      risks.push('Seasonal agricultural or festival cycles may create mild quarterly revenue variations.');
    }

    const actionPlan: string[] = [
      isLossMaking
        ? `Restructure operational costs: Commercial lease (₹${monthlyRent.toLocaleString('en-IN')}/mo) or overheads must be reduced to turn net margins positive.`
        : agglomeration.isSpecializedCluster
        ? 'Adopt Path A: Join cluster with bespoke made-to-order craft and bridal embellishments.'
        : 'Adopt Path B: Serve outer residential corridors with zero competitors for essential daily needs.',
      capitalSufficiency === 'Deficit'
        ? 'Bridge the capital gap via MoSJE Micro Finance (6.5%) or Mudra Tarun loans before signing lease agreements.'
        : 'Register for Udyam MSME / PM Vishwakarma to access statutory interest rate concessions.',
      `Maintain strict working capital discipline keeping raw material procurement below ${Math.round(cogsPercentage * 100)}% of gross receipts.`,
    ];

    return {
      overallFeasibilityScore: pillarResult.score,
      isProfitable: !isLossMaking,
      verdict,
      verdictTitle,
      verdictSummary,
      monthlyRevenueEst,
      monthlyNetProfitEst,
      netMarginPercent,
      breakevenOrdersPerDay,
      expectedDailyOrders: expectedDailyCustomers,
      averageTicketSize: averageTicket,
      monthlyOperatingExpenses: {
        rent: monthlyRent,
        salaries,
        utilitiesAndPower: powerAndUtilities,
        rawMaterialsCogs,
        marketingAndMisc,
        total: totalOpex,
      },
      totalSetupCapex,
      paybackPeriodMonths,
      capitalSufficiency,
      dataGroundedPros: pros.length > 0 ? pros : ['Basic catchment commercial viability'],
      dataGroundedRisks: risks,
      strategicActionPlan: actionPlan,
      engineUsed: 'VyaparMap Actuarial Econometric Model',
      agglomerationAnalysis: agglomeration,
      sihFeasibility: this._buildSihFeasibilityReport(
        location,
        shopType,
        budget,
        catchment,
        monthlyNetProfitEst > 0,
        ruralIntel,
        agglomeration
      ),
    };
  }
};
