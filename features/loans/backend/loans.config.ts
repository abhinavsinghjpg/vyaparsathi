/**
 * Official Scheme Rules & Concessional Credit Parameters
 * SIH Problem Statement 26091 - MoSJE
 * Ministry of Social Justice and Empowerment (MoSJE)
 */

export interface SchemeTierConfig {
  code: 'MICRO_FINANCE' | 'TERM_LOAN' | 'VYAPAR_BANK_SYNDICATE';
  title: string;
  hindiTitle: string;
  maxProjectCost: number;
  maxLoanAmount: number;
  marginPercent: number; // 10%
  interestRatePerAnnum: number; // 6.5%, 8.0%, or 8.75%
  tenureYears: number; // 3 or 7
  tenureMonths: number; // 36 or 84
  moratoriumMonths: number; // 3 or 6
  repaymentFrequency: 'Quarterly' | 'Monthly';
  primaryAgency: string;
  description: string;
  targetBeneficiaries: string;
  portalUrl: string;
}

export const MOSJE_SCHEMES: Record<'MICRO_FINANCE' | 'TERM_LOAN' | 'VYAPAR_BANK_SYNDICATE', SchemeTierConfig> = {
  MICRO_FINANCE: {
    code: 'MICRO_FINANCE',
    title: 'MoSJE Micro Finance Scheme',
    hindiTitle: 'लघु वित्त योजना (माइक्रो फाइनेंस)',
    maxProjectCost: 140000,
    maxLoanAmount: 125000,
    marginPercent: 10,
    interestRatePerAnnum: 6.5,
    tenureYears: 3,
    tenureMonths: 36,
    moratoriumMonths: 3,
    repaymentFrequency: 'Quarterly',
    primaryAgency: 'State Channelizing Agencies (SCAs) / NSFDC / NBCFDC',
    description: 'Concessional credit assistance for small income-generating units, cottage crafts, rural retail, and livestock.',
    targetBeneficiaries: 'Marginalized rural micro-entrepreneurs, artisans, Self-Help Groups (SHGs), and youth.',
    portalUrl: 'https://www.jansamarth.in/',
  },
  TERM_LOAN: {
    code: 'TERM_LOAN',
    title: 'MoSJE Concessional Term Loan Scheme',
    hindiTitle: 'सावधि ऋण योजना (टर्म लोन)',
    maxProjectCost: 5000000,
    maxLoanAmount: 4500000,
    marginPercent: 10,
    interestRatePerAnnum: 8.0,
    tenureYears: 7,
    tenureMonths: 84,
    moratoriumMonths: 6,
    repaymentFrequency: 'Quarterly',
    primaryAgency: 'MoSJE / State Channelizing Agencies / NSKFDC',
    description: 'Long-term low-interest capital structuring for processing plants, transport equipment, small manufacturing, and commercial shops.',
    targetBeneficiaries: 'Rural & semi-urban entrepreneurs with scalable business models requiring capital equipment.',
    portalUrl: 'https://www.jansamarth.in/',
  },
  VYAPAR_BANK_SYNDICATE: {
    code: 'VYAPAR_BANK_SYNDICATE',
    title: 'VyaparMap Banking Consortium & Co-Lending Syndicate',
    hindiTitle: 'व्यापारमैप सह-उधार एवं संस्थागत बैंक सिंडिकेट',
    maxProjectCost: 20000000, // ₹2.00 Crore
    maxLoanAmount: 18000000, // 90% (₹1.80 Crore)
    marginPercent: 10,
    interestRatePerAnnum: 8.75, // Institutional partner bank rate
    tenureYears: 7,
    tenureMonths: 84,
    moratoriumMonths: 6,
    repaymentFrequency: 'Quarterly',
    primaryAgency: 'VyaparMap Consortium · Partner Banks (SBI / PNB / BoB) + CGTMSE SME Guarantee',
    description: 'Special co-lending facility for scalable enterprises exceeding ₹50 Lakh up to ₹2 Crore, facilitated directly through VyaparMap banking integration and CGTMSE guarantee cover.',
    targetBeneficiaries: 'High-growth commercial retail, tech outlets, regional food chains, gaming hubs, and agro-processing factories.',
    portalUrl: 'https://www.jansamarth.in/',
  },
};

export const PM_VISHWAKARMA_CONFIG = {
  code: 'PM_VISHWAKARMA',
  title: 'PM Vishwakarma Scheme (Cobbler / Artisan Special)',
  hindiTitle: 'पीएम विश्वकर्मा योजना (चर्मकार व पारंपरिक शिल्पकार)',
  toolkitGrant: 15000,
  tranche1Loan: 100000,
  tranche2Loan: 200000,
  interestRatePerAnnum: 5.0, // Subsidized from 13% with 8% Govt Subvention
  tenureMonthsTranche1: 18,
  tenureMonthsTranche2: 30,
  targetTrades: [
    'Cobbler (चर्मकार) / Footwear Maker',
    'Blacksmith (लोहार) / Agri Tools',
    'Potter (कुम्हार) / Terracotta',
    'Carpenter (बढ़ई/सुथार) / Woodcraft',
    'Tailor (दर्जी) / Garments',
    'Barber (नाई) / Hair Grooming',
  ],
  benefits: [
    '₹15,000 direct e-voucher toolkit grant for modern equipment and hand tools',
    '₹1,00,000 collateral-free loan at just 5.0% concessional interest rate (Tranche 1)',
    'Up to ₹2,00,000 additional capital at 5.0% upon timely repayment of Tranche 1',
    'Basic & advanced skill training with ₹500/day stipend during training',
  ],
  portalUrl: 'https://pmvishwakarma.gov.in/',
};

