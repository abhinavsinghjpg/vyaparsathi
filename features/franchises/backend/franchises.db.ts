/**
 * Dedicated Database for Franchises
 * Features verified national and global brand franchises with direct acquisition links,
 * priority layering (official brands first), and mock fallback toggles.
 */

import type { Franchise } from '@/types/schema';

export const FRANCHISES_FLAGS = {
  USE_MOCK_FALLBACK: true,
  PRIORITIZE_ACTUAL: true,
};

export const ACTUAL_OFFICIAL_FRANCHISES: Franchise[] = [
// --- GLOBAL FRANCHISES ---
  {
    id: 'fran-global-1',
    brand: "McDonald's",
    logoColor: '#DA291C',
    category: 'Food & Beverage',
    investment: 60000000, // ₹6 Crore
    franchiseFee: 3000000,
    royaltyPercent: 5,
    roiMonths: 36,
    outlets: 40000,
    description: "The world's foremost fast-food hamburger restaurant chain with unmatched supply chain precision and drive-thru retail volume.",
    preferredLocations: ['High Street Hubs', 'Major Transit Corridors', 'Prime Commercial Malls'],
    minAreaSqft: 2500,
    isOfficial: true,
  },
  {
    id: 'fran-global-2',
    brand: 'Pizza Hut',
    logoColor: '#EE3124',
    category: 'Food & Beverage',
    investment: 18000000, // ₹1.8 Crore
    franchiseFee: 1500000,
    royaltyPercent: 6,
    roiMonths: 28,
    outlets: 19000,
    description: 'Yum! Brands flagship casual dining and delivery pizza empire with dominant international and Indian urban reach.',
    preferredLocations: ['Shopping Malls', 'High Footfall Markets', 'Commercial High Streets'],
    minAreaSqft: 1000,
    isOfficial: true,
    applyUrl: 'https://franchise.pizzahut.com/',
  },
  {
    id: 'fran-global-3',
    brand: 'Toni & Guy',
    logoColor: '#1A1A1A',
    category: 'Salon & Grooming',
    investment: 6500000, // ₹65 Lakhs
    franchiseFee: 800000,
    royaltyPercent: 8,
    roiMonths: 22,
    outlets: 500,
    description: 'Iconic British hairdressing and luxury salon brand catering to high-ticket fashion and premium grooming patrons.',
    preferredLocations: ['Affluent Residential Pockets', 'Luxury Malls', 'Metro High Streets'],
    minAreaSqft: 1200,
    isOfficial: true,
    applyUrl: 'https://toniandguy.com/uk/franchise',
  },
  {
    id: 'fran-global-4',
    brand: 'Subway',
    logoColor: '#008C15',
    category: 'Food & Beverage',
    investment: 4500000, // ₹45 Lakhs
    franchiseFee: 650000,
    royaltyPercent: 8,
    roiMonths: 20,
    outlets: 37000,
    description: 'World-renowned submarine sandwich franchise featuring no-oil, no-fry operations and lean commercial kitchen footprints.',
    preferredLocations: ['Tech Parks', 'Metro Stations', 'University Corridors', 'High Streets'],
    minAreaSqft: 400,
    isOfficial: true,
    applyUrl: 'https://www.subwayfranchise.com/en-us',
  },
  {
    id: 'fran-global-5',
    brand: 'KFC',
    logoColor: '#A3080C',
    category: 'Food & Beverage',
    investment: 25000000, // ₹2.5 Crore
    franchiseFee: 2000000,
    royaltyPercent: 6,
    roiMonths: 32,
    outlets: 25000,
    description: 'Global fried chicken QSR juggernaut with massive brand loyalty, proprietary seasonings, and strong online delivery throughput.',
    preferredLocations: ['High Traffic Intersections', 'Anchor Mall Spaces', 'Urban Metro Corridors'],
    minAreaSqft: 1500,
    isOfficial: true,
  },
  {
    id: 'fran-global-6',
    brand: 'Starbucks Coffee',
    logoColor: '#00704A',
    category: 'Beverages & Cafe',
    investment: 35000000, // ₹3.5 Crore (Licensed Store Partner)
    franchiseFee: 2500000,
    royaltyPercent: 7,
    roiMonths: 30,
    outlets: 38000,
    description: 'Premier global coffeehouse chain delivering third-place experiential spaces with elite average ticket sizes and loyal subscriber retention.',
    preferredLocations: ['Premium IT Corridors', 'Upscale High Streets', 'Luxury Retail Malls'],
    minAreaSqft: 1400,
    isOfficial: true,
  },
  {
    id: 'fran-global-7',
    brand: "Domino's Pizza",
    logoColor: '#006491',
    category: 'Food & Beverage',
    investment: 20000000, // ₹2 Crore (Jubilant Partnered)
    franchiseFee: 1200000,
    royaltyPercent: 5.5,
    roiMonths: 24,
    outlets: 20500,
    description: 'The undisputed market leader in fast delivery pizza with industry-leading digital ordering penetration and centralized commissaries.',
    preferredLocations: ['Dense Residential Catchments', 'Delivery Hub Corridors', 'High Street Corners'],
    minAreaSqft: 800,
    isOfficial: true,
    applyUrl: 'https://biz.dominos.com/about-us/franchising/',
  },
  {
    id: 'fran-global-8',
    brand: 'Burger King',
    logoColor: '#D62300',
    category: 'Food & Beverage',
    investment: 22000000, // ₹2.2 Crore
    franchiseFee: 1800000,
    royaltyPercent: 5,
    roiMonths: 28,
    outlets: 19000,
    description: 'Fast-growing flame-grilled burger brand with aggressive marketing, young demographic pull, and value combos.',
    preferredLocations: ['Mall Food Courts', 'Highway Plazas', 'Transit Hubs'],
    minAreaSqft: 1100,
    isOfficial: true,
    applyUrl: 'https://www.bk.com/franchising',
  },
  {
    id: 'fran-global-9',
    brand: 'Baskin Robbins',
    logoColor: '#DA1884',
    category: 'Desserts & Ice Cream',
    investment: 1600000, // ₹16 Lakhs
    franchiseFee: 400000,
    royaltyPercent: 4,
    roiMonths: 14,
    outlets: 8000,
    description: "The world's largest chain of ice cream specialty shops offering 31 signature flavors and premium ice cream cakes with small square-footage needs.",
    preferredLocations: ['High Street Walkways', 'Near Theatres/Parks', 'Neighborhood Markets'],
    minAreaSqft: 200,
    isOfficial: true,
    applyUrl: 'https://baskinrobbinsindia.com/pages/franchise-enquiry',
  },

  // --- INDIAN FRANCHISES ---
  {
    id: 'fran-india-1',
    brand: 'Dip & Bite',
    logoColor: '#E65100',
    category: 'Fast Food & Snacks',
    investment: 1400000, // ₹14 Lakhs
    franchiseFee: 250000,
    royaltyPercent: 5,
    roiMonths: 12,
    outlets: 65,
    description: 'Popular Jaipur-origin fast-food and cafe franchise famous for loaded burgers, dips, fries, and shakes with high student and youth footfall.',
    preferredLocations: ['Jaipur High Streets (Malviya Nagar, Mansarovar)', 'College Campuses', 'Market Centers'],
    minAreaSqft: 250,
    isOfficial: true,
  },
  {
    id: 'fran-india-2',
    brand: 'Chai Point',
    logoColor: '#C25900',
    category: 'Beverages & Cafe',
    investment: 2400000, // ₹24 Lakhs
    franchiseFee: 350000,
    royaltyPercent: 6,
    roiMonths: 16,
    outlets: 320,
    description: 'Organized Indian chai retail pioneer utilizing IoT-enabled brewing dispensers and high-margin corporate catering contracts.',
    preferredLocations: ['IT Parks', 'Commercial Office Lobbies', 'Airport Terminals'],
    minAreaSqft: 250,
    isOfficial: true,
  },
  {
    id: 'fran-india-3',
    brand: 'Chaayos',
    logoColor: '#00838F',
    category: 'Beverages & Cafe',
    investment: 3000000, // ₹30 Lakhs
    franchiseFee: 450000,
    royaltyPercent: 6.5,
    roiMonths: 18,
    outlets: 240,
    description: 'Meri Wali Chai personalized tea cafe brand with automated Chai Monk robots and strong consumer packaged goods (CPG) revenue streams.',
    preferredLocations: ['Premium Metro High Streets', 'Corporate Hubs', 'High-End Malls'],
    minAreaSqft: 450,
    isOfficial: true,
  },
  {
    id: 'fran-india-4',
    brand: 'Wow! Momo',
    logoColor: '#FF6B35',
    category: 'Food & Beverage',
    investment: 1500000, // ₹15 Lakhs
    franchiseFee: 300000,
    royaltyPercent: 6,
    roiMonths: 14,
    outlets: 650,
    description: "India's homegrown QSR unicorn turning street snacks into organized, hygienic multi-format kiosks, dine-in, and cloud kitchens.",
    preferredLocations: ['Mall Food Courts', 'Metro Stations', 'Commercial High Streets'],
    minAreaSqft: 200,
    isOfficial: true,
    applyUrl: 'https://www.wowmomo.com/franchise-form/',
  },
  {
    id: 'fran-india-5',
    brand: 'Lenskart',
    logoColor: '#2563EB',
    category: 'Retail Eyewear',
    investment: 3200000, // ₹32 Lakhs
    franchiseFee: 400000,
    royaltyPercent: 0, // FOCO Model (Franchise Owned Company Operated)
    roiMonths: 20,
    outlets: 2200,
    description: 'Dominant omnichannel eyewear retailer offering zero stock risk for franchisees with centralized robotic lens edging and 3D try-on.',
    preferredLocations: ['Tier 1 & Tier 2 High Streets', 'Residential Market Squares', 'Shopping Malls'],
    minAreaSqft: 350,
    isOfficial: true,
    applyUrl: 'https://partners.lenskart.com/',
  },
  {
    id: 'fran-india-6',
    brand: 'Lakmé Salon',
    logoColor: '#D81B60',
    category: 'Salon & Grooming',
    investment: 5000000, // ₹50 Lakhs
    franchiseFee: 600000,
    royaltyPercent: 7,
    roiMonths: 24,
    outlets: 480,
    description: "Hindustan Unilever's prestigious beauty and salon network. Enjoys top-of-mind bridal booking trust and certified beauty academy staff.",
    preferredLocations: ['Affluent Residential Markets', 'Commercial Corners', 'Shopping Malls'],
    minAreaSqft: 900,
    isOfficial: true,
    applyUrl: 'https://www.lakmesalon.in/pages/join-us',
  },
  {
    id: 'fran-india-7',
    brand: 'Naturals Salon & Spa',
    logoColor: '#388E3C',
    category: 'Salon & Grooming',
    investment: 3500000, // ₹35 Lakhs
    franchiseFee: 500000,
    royaltyPercent: 6,
    roiMonths: 18,
    outlets: 700,
    description: "South India's number one beauty salon chain with standardized service SOPs, celebrity brand ambassadors, and strong repeat patronage.",
    preferredLocations: ['Prime Residential Corridors', 'Commercial Centers', 'High Streets'],
    minAreaSqft: 800,
    isOfficial: true,
    applyUrl: 'https://naturals.in/FRANCHISE/index.html',
  },
  {
    id: 'fran-india-8',
    brand: 'Haldiram’s',
    logoColor: '#C62828',
    category: 'Food & Beverage',
    investment: 40000000, // ₹4 Crore
    franchiseFee: 2500000,
    royaltyPercent: 5,
    roiMonths: 30,
    outlets: 180,
    description: 'Iconic traditional Indian sweets, snacks, and pure vegetarian casual dining brand with unmatched family footfall and festive surges.',
    preferredLocations: ['Highway Corridors', 'City Center Commercial Plazas', 'Mega Malls'],
    minAreaSqft: 3000,
    isOfficial: true,
    applyUrl: 'https://www.haldiram.com/distributorship',
  },
  {
    id: 'fran-india-9',
    brand: 'The Belgian Waffle Co',
    logoColor: '#8D6E63',
    category: 'Desserts & Waffles',
    investment: 1500000, // ₹15 Lakhs
    franchiseFee: 250000,
    royaltyPercent: 7,
    roiMonths: 12,
    outlets: 450,
    description: 'Pioneering quick-service on-the-go waffle brand in India with compact kiosk formats, simple preparation, and high profit margins.',
    preferredLocations: ['Near Cafes/Colleges', 'High Streets', 'Mall Entrances'],
    minAreaSqft: 120,
    isOfficial: true,
    applyUrl: 'https://thebelgianwaffle.co/franchise',
  },
  {
    id: 'fran-india-10',
    brand: 'Barbeque Nation',
    logoColor: '#BF360C',
    category: 'Food & Beverage',
    investment: 50000000, // ₹5 Crore
    franchiseFee: 3500000,
    royaltyPercent: 6,
    roiMonths: 32,
    outlets: 210,
    description: 'Pioneers of live on-the-table grill and unlimited buffet dining in India with exceptionally high party and corporate booking volumes.',
    preferredLocations: ['Commercial Office Corridors', 'Prime City Centers', 'Large Mall Anchors'],
    minAreaSqft: 4000,
    isOfficial: true,
  },
  {
    id: 'fran-india-11',
    brand: 'Ferns N Petals',
    logoColor: '#43A047',
    category: 'Gifting & Florals',
    investment: 1200000, // ₹12 Lakhs
    franchiseFee: 200000,
    royaltyPercent: 5,
    roiMonths: 10,
    outlets: 400,
    description: "India's largest flower, cake, and personalized gifting chain with omnichannel website pickup and guaranteed cold-chain logistics support.",
    preferredLocations: ['High Street Corners', 'Main Road Markets', 'Upscale Neighborhoods'],
    minAreaSqft: 200,
    isOfficial: true,
    applyUrl: 'https://www.fnp.com/info/franchise-programme',
  },
];

export const MOCK_EMERGING_FRANCHISES: Franchise[] = [
{
    id: 'fran-add-1',
    brand: 'Chai Sutta Bar',
    logoColor: '#E63946',
    category: 'Beverages & Snacks',
    investment: 850000,
    franchiseFee: 150000,
    royaltyPercent: 5,
    roiMonths: 12,
    outlets: 520,
    description: 'Youth-centric chai cafe chain served in traditional kulhads with immense viral brand recall and student footfall.',
    preferredLocations: ['Near Colleges', 'Transit Hubs', 'High Street'],
    minAreaSqft: 150,
    isOfficial: true,
    applyUrl: 'https://www.chaisuttabarindia.com/enquire-franchise/',
  },
  {
    id: 'fran-add-2',
    brand: 'Jawed Habib',
    logoColor: '#7C3AED',
    category: 'Salon & Grooming',
    investment: 1600000,
    franchiseFee: 250000,
    royaltyPercent: 6,
    roiMonths: 18,
    outlets: 1150,
    description: 'Premier Indian salon & wellness network. Certified stylists and trained staff provided directly by their academy.',
    preferredLocations: ['Residential Townships', 'Malls', 'Main Markets'],
    minAreaSqft: 300,
    isOfficial: true,
    applyUrl: 'https://jawedhabib.com/franchise/',
  },
  {
    id: 'fran-add-3',
    brand: 'DTDC Express',
    logoColor: '#059669',
    category: 'Logistics & Courier',
    investment: 250000,
    franchiseFee: 50000,
    royaltyPercent: 4,
    roiMonths: 8,
    outlets: 12500,
    description: 'Low-capital express courier and parcel logistics franchise with steady daily commercial B2B bookings.',
    preferredLocations: ['Commercial Markets', 'Industrial Areas', 'Residential Hubs'],
    minAreaSqft: 100,
    isOfficial: true,
  },
  {
    id: 'fran-add-4',
    brand: 'Amul Scooping Parlour',
    logoColor: '#0284C7',
    category: 'Ice Cream & Dairy',
    investment: 600000,
    franchiseFee: 50000,
    royaltyPercent: 0,
    roiMonths: 10,
    outlets: 8500,
    description: 'Zero royalty ice cream parlor model backed by trusted national brand equity and dairy cooperative distribution.',
    preferredLocations: ['High Street Corners', 'Near Schools/Parks', 'Market Squares'],
    minAreaSqft: 150,
    isOfficial: true,
  },
  {
    id: 'fran-add-5',
    brand: 'MBA Chai Wala',
    logoColor: '#D97706',
    category: 'Beverages & Snacks',
    investment: 1000000,
    franchiseFee: 200000,
    royaltyPercent: 5,
    roiMonths: 14,
    outlets: 150,
    description: 'High-energy tea cafe format with snack pairings, street-style ambiance, and loyal collegiate following.',
    preferredLocations: ['University Hubs', 'Food Streets', 'Commercial High Streets'],
    minAreaSqft: 200,
    isOfficial: true,
  },
  {
    id: 'fran-add-6',
    brand: "Giani's Ice Cream",
    logoColor: '#BE185D',
    category: 'Desserts & Ice Cream',
    investment: 1400000,
    franchiseFee: 200000,
    royaltyPercent: 5,
    roiMonths: 14,
    outlets: 250,
    description: 'Heritage Indian dessert parlour legendary for rabri faluda, sundaes, stone sundaes, and gourmet ice cream.',
    preferredLocations: ['High Footfall Markets', 'Night Food Squares', 'Residential Corridors'],
    minAreaSqft: 250,
    isOfficial: true,
  },
];

const STORAGE_KEY_CUSTOM_FRANCHISES = 'vyapar_custom_franchises';

function getStoredCustomFranchises(): Franchise[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_FRANCHISES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveStoredCustomFranchises(list: Franchise[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_FRANCHISES, JSON.stringify(list));
  } catch (e) {
    console.warn('[Franchises] Failed to save custom franchise offline:', e);
  }
}

export const franchisesDb = {
  addCustomFranchise(franchise: Franchise): void {
    const existing = getStoredCustomFranchises().filter(f => f.id !== franchise.id);
    saveStoredCustomFranchises([franchise, ...existing]);
  },

  getCustomFranchises(): Franchise[] {
    return getStoredCustomFranchises();
  },

  getFranchises(filter?: { category?: string; search?: string }): Franchise[] {
    const custom = getStoredCustomFranchises();
    let list: Franchise[] = [];
    if (FRANCHISES_FLAGS.PRIORITIZE_ACTUAL) {
      list = FRANCHISES_FLAGS.USE_MOCK_FALLBACK
        ? [...custom, ...ACTUAL_OFFICIAL_FRANCHISES, ...MOCK_EMERGING_FRANCHISES]
        : [...custom, ...ACTUAL_OFFICIAL_FRANCHISES];
    } else {
      list = [...custom, ...ACTUAL_OFFICIAL_FRANCHISES, ...MOCK_EMERGING_FRANCHISES];
    }

    if (filter?.category && filter.category !== 'All') {
      list = list.filter(f => f.category.toLowerCase().includes(filter.category!.toLowerCase()));
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(f => f.brand.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
    }
    return list;
  },

  setMockFallbackEnabled(enabled: boolean): void {
    FRANCHISES_FLAGS.USE_MOCK_FALLBACK = enabled;
  }
};
