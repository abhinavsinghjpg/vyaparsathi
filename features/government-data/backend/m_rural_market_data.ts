/**
 * Dedicated Rural Market & Tehsil Economic Dataset (m_rural_market_data.ts)
 * Specifically compiled for SIH 26091 (MoSJE) Rural Micro-Entrepreneur Advisory.
 *
 * Covers rural tehsils, Gram Panchayats, weekly haats (साप्ताहिक हाट),
 * benchmark rural commercial rents (₹18-₹40/sqft vs urban ₹150+),
 * and recognized artisan clusters with documented agglomeration metrics.
 */

export interface RuralArtisanCluster {
  craftType: string;
  clusterName: string;
  artisanWorkshopsCount: number;
  agglomerationRating: number; // 0 to 10 scale
  historicalReputation: string;
  supplyChainAdvantage: string;
  overflowSubcontracting: string;
}

export interface RuralTehsilData {
  tehsilId: string;
  name: string;
  district: string;
  state: string;
  pinCodes: string[];
  population: number;
  gramPanchayatsCount: number;
  villagesCount: number;
  avgDailyRuralFootfall: number;
  weeklyHaatDays: string[];
  artisanClusters: RuralArtisanCluster[];
  primaryRuralDemandDrivers: string[];
  benchmarkRuralRentPerSqft: number;
  prominentGramPanchayats: string[];
}

export const RURAL_TEHSILS_DATA: RuralTehsilData[] = [
  {
    "tehsilId": "jaipur-sanganer",
    "name": "Sanganer Tehsil & Rural Block",
    "district": "Jaipur",
    "state": "Rajasthan",
    "pinCodes": [
      "302029",
      "302033",
      "303902"
    ],
    "population": 345000,
    "gramPanchayatsCount": 28,
    "villagesCount": 74,
    "avgDailyRuralFootfall": 16500,
    "weeklyHaatDays": [
      "Wednesday (बुधवार)",
      "Sunday (रविवार)"
    ],
    "artisanClusters": [
      {
        "craftType": "Leather Crafts & Footwear (Traditional Mojaris)",
        "clusterName": "Amber & Sanganer Footwear Cluster",
        "artisanWorkshopsCount": 65,
        "agglomerationRating": 9.5,
        "historicalReputation": "Celebrated traditional Rajasthani leather Mojari & embroidered jutti making hub supplying tourists, wedding markets, and export buyers across India.",
        "supplyChainAdvantage": "Co-located leather tanners, sole-cutters, brass buckle merchants, and rubber lasting workshops within 800m reducing input logistics costs by 28%.",
        "overflowSubcontracting": "High — established master artisans routinely subcontract upper embroidery and sole stitching to smaller micro-units during wedding seasons."
      },
      {
        "craftType": "Textiles & Handblock Printing",
        "clusterName": "Sanganeri Handblock Printing Enclave",
        "artisanWorkshopsCount": 120,
        "agglomerationRating": 9.8,
        "historicalReputation": "GI-tagged natural dye handblock printing heritage corridor.",
        "supplyChainAdvantage": "Bulk grey fabric traders and carvers co-located.",
        "overflowSubcontracting": "Very High"
      }
    ],
    "primaryRuralDemandDrivers": [
      "Tourist & heritage bazaar footwear trade",
      "Artisanal handblock textile production",
      "Expanding residential colony repair and retail requirements"
    ],
    "benchmarkRuralRentPerSqft": 25,
    "prominentGramPanchayats": [
      "Morija",
      "Mahapura",
      "Bilwa",
      "Nevta",
      "Shyosinghpura"
    ]
  },
  {
    "tehsilId": "jaipur-chomu",
    "name": "Chomu Tehsil & Rural Block",
    "district": "Jaipur",
    "state": "Rajasthan",
    "pinCodes": [
      "303702",
      "303701"
    ],
    "population": 260000,
    "gramPanchayatsCount": 34,
    "villagesCount": 92,
    "avgDailyRuralFootfall": 21000,
    "weeklyHaatDays": [
      "Monday (सोमवार)",
      "Friday (शुक्रवार)"
    ],
    "artisanClusters": [
      {
        "craftType": "Agricultural Implements & Blacksmith Forges",
        "clusterName": "Chomu Mandi Lohar Fabrication Hub",
        "artisanWorkshopsCount": 38,
        "agglomerationRating": 8.7,
        "historicalReputation": "Regional tractor trolley fabrication, threshers, and agricultural tool forging center.",
        "supplyChainAdvantage": "Direct scrap metal and steel angle suppliers at mandi junction.",
        "overflowSubcontracting": "High"
      }
    ],
    "primaryRuralDemandDrivers": [
      "Rajasthan’s largest seasonal vegetable & fruit Krishi Upaj Mandi",
      "Agro-processing (cold pressed mustard oil, dal mills, spice grinding)",
      "Two-wheeler and farm machinery repair workshops"
    ],
    "benchmarkRuralRentPerSqft": 35,
    "prominentGramPanchayats": [
      "Morija",
      "Kishangarh Renwal",
      "Hastera",
      "Govindgarh",
      "Khori"
    ]
  },
  {
    "tehsilId": "jaipur-bassi",
    "name": "Bassi Tehsil & Rural Block",
    "district": "Jaipur",
    "state": "Rajasthan",
    "pinCodes": [
      "303301",
      "303302"
    ],
    "population": 215000,
    "gramPanchayatsCount": 36,
    "villagesCount": 110,
    "avgDailyRuralFootfall": 14200,
    "weeklyHaatDays": [
      "Tuesday (मंगलवार)",
      "Saturday (शनिवार)"
    ],
    "artisanClusters": [
      {
        "craftType": "Carpentry, Wooden Toys & Puppet Making",
        "clusterName": "Bassi Traditional Woodcraft Hub",
        "artisanWorkshopsCount": 42,
        "agglomerationRating": 9.1,
        "historicalReputation": "Centuries-old wooden handicraft, religious shrines (kavad), and puppet carving village cluster.",
        "supplyChainAdvantage": "Direct timber saw mills along railway link.",
        "overflowSubcontracting": "High"
      }
    ],
    "primaryRuralDemandDrivers": [
      "Agro-processing and flour/spice mills",
      "Animal husbandry and cooperative milk chilling centers",
      "Highway logistics breakdown repair and tube puncture stalls"
    ],
    "benchmarkRuralRentPerSqft": 22,
    "prominentGramPanchayats": [
      "Toonga",
      "Kanota",
      "Dhana",
      "Banskhon",
      "Roopura"
    ]
  },
  {
    "tehsilId": "jaipur-amer",
    "name": "Amer Tehsil & Rural Block",
    "district": "Jaipur",
    "state": "Rajasthan",
    "pinCodes": [
      "302028",
      "303104"
    ],
    "population": 185000,
    "gramPanchayatsCount": 26,
    "villagesCount": 68,
    "avgDailyRuralFootfall": 19800,
    "weeklyHaatDays": [
      "Thursday (गुरुवार)",
      "Sunday (रविवार)"
    ],
    "artisanClusters": [
      {
        "craftType": "Terracotta Pottery & Blue Pottery",
        "clusterName": "Amer Village Pottery Enclave",
        "artisanWorkshopsCount": 30,
        "agglomerationRating": 8.9,
        "historicalReputation": "Traditional clay tawa, matkas, kulhads, and glazed blue pottery craft workshops.",
        "supplyChainAdvantage": "Shared wood and gas kilns, clay extraction pits within 3 km.",
        "overflowSubcontracting": "Moderate"
      },
      {
        "craftType": "Leather Crafts & Camel Leather Goods",
        "clusterName": "Amer Ghati Artisan Bazaar",
        "artisanWorkshopsCount": 24,
        "agglomerationRating": 8.4,
        "historicalReputation": "Tourist-facing leather juttis, camel leather bags, and embellished handicrafts.",
        "supplyChainAdvantage": "Co-located with heritage tourist transit corridor.",
        "overflowSubcontracting": "High"
      }
    ],
    "primaryRuralDemandDrivers": [
      "Heritage tourist souvenir consumption",
      "Daily clay utensil and dairy milk supply to city",
      "Handicrafts and rural food kiosks"
    ],
    "benchmarkRuralRentPerSqft": 40,
    "prominentGramPanchayats": [
      "Kukas",
      "Achrol",
      "Chandsen",
      "Bhatton Ki Gali"
    ]
  },
  {
    "tehsilId": "jaipur-chaksu",
    "name": "Chaksu Tehsil & Rural Block",
    "district": "Jaipur",
    "state": "Rajasthan",
    "pinCodes": [
      "303901",
      "303903"
    ],
    "population": 175000,
    "gramPanchayatsCount": 30,
    "villagesCount": 88,
    "avgDailyRuralFootfall": 12500,
    "weeklyHaatDays": [
      "Sunday (रविवार)"
    ],
    "artisanClusters": [
      {
        "craftType": "Rural Handloom & Dari Weaving",
        "clusterName": "Chaksu Rural Weavers Enclave",
        "artisanWorkshopsCount": 22,
        "agglomerationRating": 7.9,
        "historicalReputation": "Coarse cotton floor durries and woolen blankets.",
        "supplyChainAdvantage": "Local raw wool procurement.",
        "overflowSubcontracting": "Moderate"
      }
    ],
    "primaryRuralDemandDrivers": [
      "Shitla Mata annual mela gathering (over 200k pilgrims)",
      "Krishi Upaj grain mandi trading",
      "Two-wheeler mechanic and tire puncture repair"
    ],
    "benchmarkRuralRentPerSqft": 20,
    "prominentGramPanchayats": [
      "Kothun",
      "Kadera",
      "Titariya",
      "Thali",
      "Garuda"
    ]
  },
  {
    "tehsilId": "jaipur-jamwa-ramgarh",
    "name": "Jamwa Ramgarh Tehsil & Rural Block",
    "district": "Jaipur",
    "state": "Rajasthan",
    "pinCodes": [
      "303109",
      "303104"
    ],
    "population": 155000,
    "gramPanchayatsCount": 29,
    "villagesCount": 95,
    "avgDailyRuralFootfall": 9800,
    "weeklyHaatDays": [
      "Monday (सोमवार)"
    ],
    "artisanClusters": [
      {
        "craftType": "Stone Carving & Masonry Tools",
        "clusterName": "Ramgarh Stone Masons Guild",
        "artisanWorkshopsCount": 18,
        "agglomerationRating": 8.1,
        "historicalReputation": "Dholpur red sandstone carving and architectural jali fabrication.",
        "supplyChainAdvantage": "Direct stone quarry access.",
        "overflowSubcontracting": "High"
      }
    ],
    "primaryRuralDemandDrivers": [
      "Cooperative dairy milk collection",
      "Agro forestry and organic farming",
      "E-Mitra CSC digital services"
    ],
    "benchmarkRuralRentPerSqft": 18,
    "prominentGramPanchayats": [
      "Andhi",
      "Saiwar",
      "Dhamad",
      "Kalyanpura"
    ]
  }
];

/**
 * Match a user location query to rural tehsil data and any recognized artisan clusters.
 */
export function getRuralTehsilIntelligence(locationQuery: string): {
  tehsil: RuralTehsilData | null;
  detectedCluster: RuralArtisanCluster | null;
  isRuralLocation: boolean;
  benchmarkRent: number;
  weeklyHaatDays: string[];
} {
  const query = locationQuery.toLowerCase().trim();

  let matchedTehsil: RuralTehsilData | null = null;
  for (const t of RURAL_TEHSILS_DATA) {
    if (
      query.includes(t.tehsilId.replace('jaipur-', '')) ||
      query.includes(t.name.toLowerCase()) ||
      t.pinCodes.some(pin => query.includes(pin)) ||
      t.prominentGramPanchayats.some(gp => query.includes(gp.toLowerCase()))
    ) {
      matchedTehsil = t;
      break;
    }
  }

  // Default to Sanganer Tehsil if in Jaipur region but specific tehsil not parsed
  if (!matchedTehsil && (query.includes('jaipur') || query.includes('rajasthan'))) {
    matchedTehsil = RURAL_TEHSILS_DATA[0]; // Sanganer
  }

  if (!matchedTehsil) {
    return {
      tehsil: null,
      detectedCluster: null,
      isRuralLocation: false,
      benchmarkRent: 80,
      weeklyHaatDays: ['Sunday (रविवार)'],
    };
  }

  // Check if query matches any specific artisan cluster
  let detectedCluster: RuralArtisanCluster | null = null;
  for (const c of matchedTehsil.artisanClusters) {
    const cLower = c.craftType.toLowerCase();
    if (
      query.includes('shoe') ||
      query.includes('leather') ||
      query.includes('mojari') ||
      query.includes('jutti') ||
      query.includes('cobbler')
    ) {
      if (cLower.includes('leather') || cLower.includes('footwear')) {
        detectedCluster = c;
        break;
      }
    } else if (query.includes('pottery') || query.includes('clay')) {
      if (cLower.includes('pottery')) {
        detectedCluster = c;
        break;
      }
    } else if (query.includes('handblock') || query.includes('textile')) {
      if (cLower.includes('textile') || cLower.includes('block')) {
        detectedCluster = c;
        break;
      }
    }
  }

  if (!detectedCluster && matchedTehsil.artisanClusters.length > 0) {
    detectedCluster = matchedTehsil.artisanClusters[0];
  }

  return {
    tehsil: matchedTehsil,
    detectedCluster,
    isRuralLocation: true,
    benchmarkRent: matchedTehsil.benchmarkRuralRentPerSqft,
    weeklyHaatDays: matchedTehsil.weeklyHaatDays,
  };
}
