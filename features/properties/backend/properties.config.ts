/**
 * Commercial Properties - Dedicated API Keys & Endpoints Configuration
 * Contains official Government Circle Rates (DLC rates) portals and valuation APIs.
 */

export const PROPERTIES_CONFIG = {
  // 1. Official State Revenue & IGRS Circle Rate (DLC Rate) Portals
  igrsGovPortals: {
    rajasthanDlc: 'http://epanjiyan.nic.in/',
    karnatakaKaveri: 'https://kaverionline.karnataka.gov.in/',
    maharashtraIgr: 'https://igrmaharashtra.gov.in/',
    delhiRevenue: 'https://revenue.delhi.gov.in/',
  },

  // 2. India Post Pincode Verification API
  indiaPost: {
    pincodeEndpoint: 'https://api.postalpincode.in/pincode',
    postOfficeEndpoint: 'https://api.postalpincode.in/postoffice',
  },

  // 3. Official Commercial Stamp Duty & Registration Benchmarks
  stampDutyBenchmarks: {
    rajasthan: { stampDutyPct: 6.0, registrationPct: 1.0, commercialMultiplier: 1.25 },
    karnataka: { stampDutyPct: 5.0, registrationPct: 1.0, commercialMultiplier: 1.30 },
    delhi: { stampDutyPct: 6.0, registrationPct: 1.0, commercialMultiplier: 1.35 },
    maharashtra: { stampDutyPct: 6.0, registrationPct: 1.0, commercialMultiplier: 1.40 },
    pune: { stampDutyPct: 6.0, registrationPct: 1.0, commercialMultiplier: 1.25 },
    chennai: { stampDutyPct: 7.0, registrationPct: 2.0, commercialMultiplier: 1.20 },
  },
};

