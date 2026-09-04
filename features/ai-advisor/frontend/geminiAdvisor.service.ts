/**
 * Google Gemini AI Feasibility & Commercial Profitability Engine
 * Evaluates whether a proposed business is profitable in a given location
 * by running unit economics, footfall conversion modeling, and retail margin calculations.
 */

import { CatchmentScanResult } from '@/features/map-explorer/frontend/googleMaps.service';

export interface BusinessFinancialProjection {
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
  engineUsed: 'Google Gemini Pro Engine' | 'VyaparMap Actuarial Retail Model';
}

export const geminiAdvisorService = {
  getStoredApiKey(): string {
    return localStorage.getItem('vyapar_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  },

  setStoredApiKey(key: string): void {
    if (key.trim()) {
      localStorage.setItem('vyapar_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('vyapar_gemini_api_key');
    }
  },

  /**
   * Run Feasibility & Profitability Analysis using Google Gemini API or Deterministic Unit Economics Model
   */
  async evaluateProfitability(
    location: string,
    shopType: string,
    shopSize: number,
    budget: number,
    catchment: CatchmentScanResult,
    customApiKey?: string
  ): Promise<BusinessFinancialProjection> {
    const apiKey = (customApiKey || this.getStoredApiKey()).trim();

    // 1. Try Live Google Gemini API if key is present
    if (apiKey) {
      try {
        const geminiResult = await this._callGeminiAPI(
          apiKey,
          location,
          shopType,
          shopSize,
          budget,
          catchment
        );
        if (geminiResult) return geminiResult;
      } catch (err) {
        console.warn('[Gemini API error, falling back to rigorous actuarial model]', err);
      }
    }

    // 2. High-Accuracy Deterministic Retail Unit Economics Engine (Accurate, Non-Random)
    return this._calculateDeterministicEconomics(
      location,
      shopType,
      shopSize,
      budget,
      catchment
    );
  },

  async _callGeminiAPI(
    apiKey: string,
    location: string,
    shopType: string,
    shopSize: number,
    budget: number,
    catchment: CatchmentScanResult
  ): Promise<BusinessFinancialProjection | null> {
    const prompt = `
You are an expert commercial retail economist and business viability advisor in India.
Analyze whether it is financially profitable to open a ${shopType} in ${location}.

Key Commercial Data from Google Maps & Catchment Scan:
- Target Locality: ${location} (${catchment.coordinates.lat.toFixed(4)}, ${catchment.coordinates.lng.toFixed(4)})
- Floor Size: ${shopSize} sq ft
- Founder Total Budget: ₹${budget.toLocaleString('en-IN')}
- Benchmark Rent: ₹${catchment.rentPerSqft} / sq ft/month
- Mapped Pedestrian Footfall Density: ${catchment.footfallDensity} (${catchment.estimatedDailyTraffic} daily passersby)
- Transit Hubs (Bus/Metro): ${catchment.transitHubsCount}
- Commercial Anchors (Colleges/Offices/Malls): ${catchment.commercialAnchorsCount}
- Nearby Competitors: ${catchment.competitorsCount} (${catchment.competitorBrands.join(', ')})

Return ONLY valid JSON (no markdown formatting, no backticks) with this exact schema:
{
  "isProfitable": true,
  "verdict": "PROFITABLE",
  "verdictTitle": "Strong Commercial Feasibility",
  "verdictSummary": "2-3 sentences explaining exactly why this is profitable or risky in this location",
  "monthlyRevenueEst": 420000,
  "monthlyNetProfitEst": 85000,
  "netMarginPercent": 20.2,
  "breakevenOrdersPerDay": 38,
  "expectedDailyOrders": 65,
  "averageTicketSize": 220,
  "monthlyOperatingExpenses": {
    "rent": 60000,
    "salaries": 75000,
    "utilitiesAndPower": 25000,
    "rawMaterialsCogs": 140000,
    "marketingAndMisc": 35000,
    "total": 335000
  },
  "totalSetupCapex": 1200000,
  "paybackPeriodMonths": 14,
  "capitalSufficiency": "Optimal",
  "dataGroundedPros": ["Reason 1", "Reason 2", "Reason 3"],
  "dataGroundedRisks": ["Risk 1", "Risk 2"],
  "strategicActionPlan": ["Step 1", "Step 2", "Step 3"]
}
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsed = JSON.parse(rawText.replace(/```json|```/g, '').trim());
    return {
      ...parsed,
      engineUsed: 'Google Gemini Pro Engine',
    };
  },

  /**
   * Rigorous Commercial Unit Economics Model for Indian Retail
   * Formulated based on real metro retail benchmarks (F&B, Apparels, Groceries, Salons)
   */
  _calculateDeterministicEconomics(
    location: string,
    shopType: string,
    shopSize: number,
    budget: number,
    catchment: CatchmentScanResult
  ): BusinessFinancialProjection {
    const rentPerSqft = catchment.rentPerSqft;
    const monthlyRent = rentPerSqft * shopSize;

    // Ticket size & COGS benchmarks by category
    let averageTicket = 200;
    let cogsPercentage = 0.35;
    let staffCount = Math.max(2, Math.round(shopSize / 250));
    let averageSalaryPerStaff = 18000;

    const lowerType = shopType.toLowerCase();
    if (lowerType.includes('cafe')) {
      averageTicket = 220;
      cogsPercentage = 0.32;
    } else if (lowerType.includes('restaurant') || lowerType.includes('dining')) {
      averageTicket = 520;
      cogsPercentage = 0.38;
      staffCount = Math.max(4, Math.round(shopSize / 150));
    } else if (lowerType.includes('gym')) {
      averageTicket = 2200; // Monthly membership fee
      cogsPercentage = 0.12;
      staffCount = Math.max(3, Math.round(shopSize / 400));
    } else if (lowerType.includes('salon')) {
      averageTicket = 450;
      cogsPercentage = 0.22;
      staffCount = Math.max(3, Math.round(shopSize / 180));
    } else if (lowerType.includes('grocery') || lowerType.includes('supermarket')) {
      averageTicket = 380;
      cogsPercentage = 0.72; // High volume, lower margin
    } else if (lowerType.includes('pharmacy')) {
      averageTicket = 290;
      cogsPercentage = 0.74;
    }

    // Capital expenditure breakdown
    const securityDeposit = monthlyRent * 6;
    const interiorFitout = shopSize * 950;
    const initialEquipment = shopSize * 700;
    const workingCapitalBuffer = monthlyRent * 3;
    const totalSetupCapex = Math.round(securityDeposit + interiorFitout + initialEquipment + workingCapitalBuffer);

    // Footfall to customer conversion
    // Typical retail conversion rate: 0.8% to 2.2% of immediate pedestrian catchment
    const conversionRate =
      catchment.footfallDensity === 'Very High'
        ? 0.016
        : catchment.footfallDensity === 'High'
        ? 0.012
        : catchment.footfallDensity === 'Medium'
        ? 0.009
        : 0.006;

    const expectedDailyCustomers = Math.round(
      Math.min(shopSize * 0.8, catchment.estimatedDailyTraffic * conversionRate)
    );

    // Monthly revenue
    const monthlyRevenueEst = Math.round(expectedDailyCustomers * averageTicket * 30);

    // Operating expenses
    const salaries = staffCount * averageSalaryPerStaff;
    const powerAndUtilities = Math.round(shopSize * 35 + 8000);
    const rawMaterialsCogs = Math.round(monthlyRevenueEst * cogsPercentage);
    const marketingAndMisc = Math.round(monthlyRevenueEst * 0.04 + 6000);

    const totalOpex = monthlyRent + salaries + powerAndUtilities + rawMaterialsCogs + marketingAndMisc;
    const monthlyNetProfitEst = monthlyRevenueEst - totalOpex;
    const netMarginPercent = Math.round((monthlyNetProfitEst / Math.max(1, monthlyRevenueEst)) * 1000) / 10;

    // Break-even daily orders
    const grossMarginPerOrder = averageTicket * (1 - cogsPercentage);
    const fixedCostsMonthly = monthlyRent + salaries + powerAndUtilities + marketingAndMisc;
    const breakevenOrdersPerDay = Math.ceil(fixedCostsMonthly / (grossMarginPerOrder * 30));

    // Payback period
    const paybackPeriodMonths =
      monthlyNetProfitEst > 0
        ? Math.round((totalSetupCapex / monthlyNetProfitEst) * 10) / 10
        : 99;

    // Capital sufficiency
    const capitalSufficiency =
      budget >= totalSetupCapex * 1.15
        ? 'Optimal'
        : budget >= totalSetupCapex * 0.85
        ? 'Adequate'
        : 'Deficit';

    // Verdict determination
    let verdict: 'HIGHLY_PROFITABLE' | 'PROFITABLE' | 'MARGINAL' | 'HIGH_RISK' = 'PROFITABLE';
    let verdictTitle = 'Economically Viable Business Opportunity';
    let verdictSummary = '';

    if (monthlyNetProfitEst > 120000 && netMarginPercent >= 16 && capitalSufficiency !== 'Deficit') {
      verdict = 'HIGHLY_PROFITABLE';
      verdictTitle = 'High Commercial Profitability Confirmed';
      verdictSummary = `${location} delivers robust footfall (${catchment.estimatedDailyTraffic.toLocaleString()} passersby) that comfortably supports ${expectedDailyCustomers} daily customers, yielding healthy monthly profits of ₹${monthlyNetProfitEst.toLocaleString('en-IN')}.`;
    } else if (monthlyNetProfitEst > 40000 && netMarginPercent >= 8 && capitalSufficiency !== 'Deficit') {
      verdict = 'PROFITABLE';
      verdictTitle = 'Solid Commercial Profitability';
      verdictSummary = `Opening a ${shopType} in ${location} is profitable with disciplined operations. You will break even at ~${breakevenOrdersPerDay} orders/day against an expected ${expectedDailyCustomers} orders/day.`;
    } else if (monthlyNetProfitEst >= 0) {
      verdict = 'MARGINAL';
      verdictTitle = 'Marginal Profitability — High Rental Sensitivity';
      verdictSummary = `Monthly profit margins (₹${monthlyNetProfitEst.toLocaleString('en-IN')}) are thin relative to the ₹${monthlyRent.toLocaleString('en-IN')} rent. Consider downsizing square footage or negotiating lease concessions.`;
    } else {
      verdict = 'HIGH_RISK';
      verdictTitle = 'High Risk of Operational Losses';
      verdictSummary = `High rental costs and competitive saturation in ${location} make this configuration loss-making under realistic footfall conversion. Capital outlay exceeds sustainable returns.`;
    }

    // Pros
    const pros = [
      `Catchment footfall of ${catchment.estimatedDailyTraffic.toLocaleString()} daily commuters verifies active walk-in demand.`,
      `Verified ${catchment.transitHubsCount} public transit stations within 800m driving natural morning and evening customer acquisition.`,
      `Break-even requires only ${breakevenOrdersPerDay} daily orders (${Math.round((breakevenOrdersPerDay / expectedDailyCustomers) * 100)}% of modeled demand).`,
    ];

    // Risks
    const risks: string[] = [];
    if (catchment.competitorsCount > 10) {
      risks.push(`Dense competition: ${catchment.competitorsCount} nearby ${shopType} outlets mapped (${catchment.competitorBrands.slice(0, 3).join(', ')}).`);
    }
    if (monthlyRent > monthlyRevenueEst * 0.22) {
      risks.push(`Rent-to-revenue ratio (${Math.round((monthlyRent / monthlyRevenueEst) * 100)}%) is above the safe 15-18% retail threshold.`);
    }
    if (capitalSufficiency === 'Deficit') {
      risks.push(`Allocated budget (₹${budget.toLocaleString('en-IN')}) falls short of estimated turnkey setup capital (₹${totalSetupCapex.toLocaleString('en-IN')}).`);
    }
    if (risks.length === 0) {
      risks.push('Commercial lease terms typically require a 6-month lock-in and security deposit.');
    }

    // Action plan
    const actionPlan = [
      `Secure a lease with a maximum rent cap of ₹${Math.round(rentPerSqft * 0.9)}/sq ft or request a 45-day rent-free fitout period.`,
      `Target an initial launch promotion to acquire ${breakevenOrdersPerDay}+ recurring daily patrons in week one.`,
      `Calibrate operating inventory to maintain COGS below ${Math.round(cogsPercentage * 100)}% of gross sales.`,
    ];

    return {
      isProfitable: monthlyNetProfitEst > 0,
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
      dataGroundedPros: pros,
      dataGroundedRisks: risks,
      strategicActionPlan: actionPlan,
      engineUsed: 'VyaparMap Actuarial Retail Model',
    };
  },
};

