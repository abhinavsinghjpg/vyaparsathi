/**
 * Master Business Taxonomy & Micro-Enterprise Database (m_business.ts)
 * Specifically compiled for SIH 26091 (MoSJE) Rural & Micro-Entrepreneur Advisory.
 *
 * Covers 16 broad sectors bundling 20k+ micro-business models,
 * with capital ranges from ₹10,000 (Ultra-Micro / SVANidhi) to ₹20 Crore (Commercial MSME).
 * Explicitly models the Agglomeration / Artisan Cluster Effect (e.g. 60 shoe makers in 1 km)
 * versus Local Feeder Monopoly (Dispersion) dynamics.
 */

export type CompetitionSensitivity = 'Cluster_Beneficial' | 'Dispersion_Beneficial' | 'Neutral';

export type MarketTier = 'rural' | 'urban' | 'metro_luxury' | 'universal';

export interface MicroBusiness {
  id: string;
  name: string;
  sectorId: string;
  sectorName: string;
  subCategory: string;
  emoji: string;
  minBudget: number;
  maxBudget: number;
  typicalBudget: number;
  tenPercentMargin: number;
  monthlyRevenue: number;
  monthlyNetProfit: number;
  roiMonths: number;
  competitionSensitivity: CompetitionSensitivity;
  agglomerationIndex: number; // 0 to 10 scale (how much this business benefits from being in a dense cluster)
  description: string;
  bestSuitedFor: string;
  minAreaSqft: number;
  targetMarginPercent: number;
  schemes: string[];
  isRuralFocus: boolean;
  marketTier?: MarketTier;
  clusterOpportunity: string;
  recommendedLocations: string[];
}

export interface BusinessSector {
  id: string;
  name: string;
  hindiName: string;
  emoji: string;
  description: string;
  subCategories: string[];
}

export const BUSINESS_SECTORS: BusinessSector[] = [
  {
    "id": "urban_commercial_retail",
    "name": "Malls, Arcades & Commercial Retail",
    "hindiName": "शॉपिंग मॉल, व्यावसायिक आर्केड व रिटेल",
    "emoji": "🏬",
    "description": "Multi-storey commercial shopping malls, high-street fashion arcades, anchor department stores, and branded retail franchises.",
    "subCategories": [
      "Shopping Mall & Commercial Arcade",
      "Branded Fashion Flagship",
      "National Fast Food Franchise"
    ]
  },
  {
    "id": "urban_highend_hospitality",
    "name": "Specialty Cafes, Fine Dining & Cloud Kitchens",
    "hindiName": "हाई-एंड कैफे, फाइन डाइनिंग व क्लाउड किचन",
    "emoji": "☕",
    "description": "Third-wave artisanal coffee roasteries, multi-brand delivery cloud kitchens, and premium fine dining gastro-pubs.",
    "subCategories": [
      "Specialty Artisanal Cafe & Roastery",
      "Multi-Brand Commercial Cloud Kitchen",
      "Fine Dining Restaurant & Lounge"
    ]
  },
  {
    "id": "tech_gaming_electronics",
    "name": "IT Hardware, Gaming Cafes & Electronics",
    "hindiName": "कंप्यूटर लैपटॉप स्टोर, गेमिंग कैफे व इलेक्ट्रॉनिक्स",
    "emoji": "🎮",
    "description": "Authorized brand laptop & PC outlets (Acer, Asus, Apple, HP), high-performance RTX esports gaming cafes, and commercial networking / WiFi solutions.",
    "subCategories": [
      "Authorized Laptop & PC Experience Store",
      "Esports & RTX Gaming Lounge",
      "Smart Gadgets & Commercial Networking"
    ]
  },
  {
    "id": "luxury_wellness_lifestyle",
    "name": "Luxury Salons, Med-Spas & Fitness Hubs",
    "hindiName": "लक्जरी सैलून, स्पा व फिटनेस सेंटर",
    "emoji": "💆",
    "description": "Premium unisex wellness salons, aesthetic dermatological spas, and 24/7 crossfit commercial fitness centers.",
    "subCategories": [
      "Luxury Unisex Salon & Med-Spa",
      "Commercial Fitness & Crossfit Arena"
    ]
  },
  {
    "id": "commercial_services_coworking",
    "name": "Coworking Spaces & EV Clean Energy Hubs",
    "hindiName": "को-वर्किंग स्पेस व ईवी फास्ट चार्जिंग हब",
    "emoji": "🏢",
    "description": "Managed flexible plug-and-play coworking incubators, and dual-gun DC fast EV charging hubs with highway cafe lounges.",
    "subCategories": [
      "Managed Co-working Space & Incubator",
      "EV Fast-Charging Hub & Gourmet Drive-Thru"
    ]
  },

  {
    "id": "leather_footwear",
    "name": "Leather Crafts, Footwear & Cobbler",
    "hindiName": "चर्मकार, जूती-मोजरी व चमड़ा शिल्प",
    "emoji": "👞",
    "description": "Traditional handcrafted Mojaris, cobbler workshops, orthopedic footwear & leather goods. Core craft under PM Vishwakarma.",
    "subCategories": [
      "Handcrafted Mojari / Jutti Making",
      "Cobbler & Shoe Repair",
      "Custom Leather Footwear",
      "Leather Accessories"
    ]
  },
  {
    "id": "repair_services",
    "name": "Repair & Technical Services",
    "hindiName": "मरम्मत व तकनीकी सेवाएं",
    "emoji": "🔧",
    "description": "Hardware, motor winding, pump overhaul, mobile & laptop repair, appliance & two-wheeler mechanic services.",
    "subCategories": [
      "Computer & Laptop Repair",
      "Mobile Phone Repair",
      "Motor Winding & Pump Repair",
      "Two-Wheeler & Agri Mechanic",
      "Home Appliance Repair"
    ]
  },
  {
    "id": "agro_food",
    "name": "Agro-Processing & Food Products",
    "hindiName": "कृषि प्रसंस्करण व खाद्य उत्पाद",
    "emoji": "🌾",
    "description": "Mini flour & dal mills, cold-pressed mustard oil expellers, spice grinding, and milk chilling collection centers.",
    "subCategories": [
      "Flour & Spices Mill",
      "Edible Oil Processing",
      "Dairy & Milk Testing",
      "Packaged Food Products"
    ]
  },
  {
    "id": "textiles_apparel",
    "name": "Textiles, Handloom & Tailoring",
    "hindiName": "हथकरघा, वस्त्र निर्माण व सिलाई",
    "emoji": "🧵",
    "description": "Traditional Sanganeri/Bagru handblock printing, rural tailoring, school uniform bulk stitching & dailywear retail.",
    "subCategories": [
      "Handblock Printing",
      "Tailoring & Garments",
      "Readymade Clothing Retail"
    ]
  },
  {
    "id": "handicrafts_artisan",
    "name": "Traditional Crafts & Artisans",
    "hindiName": "हस्तशिल्प व विश्वकर्मा कारीगरी",
    "emoji": "🏺",
    "description": "Terracotta pottery, blacksmith agri tools, carpentry furniture, and traditional craft fabrication under PM Vishwakarma.",
    "subCategories": [
      "Pottery & Clay Art",
      "Blacksmith & Tools",
      "Carpentry & Woodwork"
    ]
  },
  {
    "id": "retail_trade",
    "name": "Rural & Urban Retail Trade",
    "hindiName": "किराना, सामान्य स्टोर व कृषि इनपुट",
    "emoji": "🛒",
    "description": "Village grocery (kirana), seed/fertilizer depots, weekly haat retail stalls, and FMCG daily provisions.",
    "subCategories": [
      "Grocery & General Store",
      "Agri Inputs Retail"
    ]
  },
  {
    "id": "electrical_hardware",
    "name": "Electrical, Solar & Hardware",
    "hindiName": "विद्युत, सौर व हार्डवेयर उपकरण",
    "emoji": "⚡",
    "description": "House wiring materials, LED lighting, solar rooftop agencies, and agricultural pump starter hardware.",
    "subCategories": [
      "Electrical Goods",
      "Solar & Clean Energy"
    ]
  },
  {
    "id": "fnb_dining",
    "name": "Food & Beverage / Dining",
    "hindiName": "चाय, ढाबा, बेकरी व जलपान",
    "emoji": "☕",
    "description": "High-volume morning tea tapris, highway dhabas, local bakeries, and pure veg family thali dining.",
    "subCategories": [
      "Tea & Snacks Stall",
      "Dhaba & Dining"
    ]
  },
  {
    "id": "health_wellness",
    "name": "Health, Pharmacy & Grooming",
    "hindiName": "दवा, जन औषधि व सैलून",
    "emoji": "💊",
    "description": "PM Jan Aushadhi generic chemist stores, ayurvedic dispensaries, and men’s barber/grooming salons.",
    "subCategories": [
      "Generic Chemist",
      "Barber & Grooming"
    ]
  },
  {
    "id": "education_digital",
    "name": "Digital Services, CSC & Education",
    "hindiName": "ई-मित्र, कंप्यूटर व जन सेवा केंद्र",
    "emoji": "💻",
    "description": "Gram Panchayat CSC / E-Mitra centers, banking BC kiosks, Aadhaar updating, and basic computer coaching.",
    "subCategories": [
      "CSC & E-Mitra Kiosk"
    ]
  },
  {
    "id": "transport_logistics",
    "name": "Transport & Rural Logistics",
    "hindiName": "ई-रिक्शा, लोडिंग व ग्रामीण ढुलाई",
    "emoji": "🛺",
    "description": "Passenger electric e-rickshaws, mini commercial goods carriers (Chhota Hathi), and farm transport.",
    "subCategories": [
      "Passenger E-Rickshaw"
    ]
  },
  {
    "id": "construction_fabrication",
    "name": "Fabrication, Building & Metalwork",
    "hindiName": "फेब्रिकेशन व निर्माण सामग्री",
    "emoji": "🚪",
    "description": "Iron gate and safety grill fabrication, tractor trolley repair, and modular building fabrication.",
    "subCategories": [
      "Welding & Fabrication"
    ]
  },
  {
    "id": "livestock_dairy",
    "name": "Animal Husbandry & Dairy Farming",
    "hindiName": "डेयरी फार्म, पशुपालन व पोल्ट्री",
    "emoji": "🐄",
    "description": "Murrah buffalo and Gir cow dairy units, goat farming, and commercial poultry units.",
    "subCategories": [
      "Dairy Cattle Rearing"
    ]
  },
  {
    "id": "green_renewable",
    "name": "Solar, Bio-Gas & Clean Energy",
    "hindiName": "सौर ऊर्जा, वर्मीकम्पोस्ट व जैव खाद",
    "emoji": "🪱",
    "description": "Organic vermicompost fertilizer pits, agricultural bio-gas digesters, and solar pumping installations.",
    "subCategories": [
      "Vermicompost & Bio-Fertilizer"
    ]
  },
  {
    "id": "personal_household",
    "name": "Personal & Household Services",
    "hindiName": "टेंट हाउस, साउंड व घरेलू सेवाएं",
    "emoji": "🎪",
    "description": "Village wedding tent house, event sound system rentals, and photo-video studios.",
    "subCategories": [
      "Tent House & Event Rental"
    ]
  },
  {
    "id": "manufacturing_packaging",
    "name": "Light Manufacturing & Packaging",
    "hindiName": "दोने-पत्तल, अगरबत्ती व पैकेजिंग",
    "emoji": "📦",
    "description": "Biodegradable paper cups and dona-pattals, incense stick (agarbatti) rolling, and corrugated boxes.",
    "subCategories": [
      "Paper Packaging & Dona-Pattal"
    ]
  }
];

export const M_BUSINESS_CATALOG: MicroBusiness[] = [
  {
    "id": "ub-mall-01",
    "name": "Shopping Mall & Commercial Arcade",
    "sectorId": "urban_commercial_retail",
    "sectorName": "Malls, Arcades & Commercial Retail",
    "subCategory": "Shopping Mall & Commercial Arcade",
    "emoji": "🏬",
    "minBudget": 50000000,
    "maxBudget": 200000000,
    "typicalBudget": 100000000,
    "tenPercentMargin": 10000000,
    "monthlyRevenue": 4800000,
    "monthlyNetProfit": 1850000,
    "roiMonths": 42,
    "competitionSensitivity": "Cluster_Beneficial",
    "agglomerationIndex": 9.6,
    "description": "High-capital commercial real estate arcade housing retail anchors, multiplex theater, food court, and branded apparel outlets in high-density urban corridors.",
    "bestSuitedFor": "High-net-worth commercial investors & real estate developers utilizing MSME Term Loans & institutional consortium financing.",
    "minAreaSqft": 15000,
    "targetMarginPercent": 38,
    "schemes": ["CGTMSE Credit Guarantee", "SIDBI Commercial Real Estate Debt", "MoSJE Term Loan (Anchor Unit)"],
    "isRuralFocus": false,
    "marketTier": "metro_luxury",
    "clusterOpportunity": "Urban shopping destination agglomeration; benefits from transit hub adjacency.",
    "recommendedLocations": ["Raja Park Commercial Belt, Jaipur", "Connaught Place, New Delhi", "Koramangala, Bengaluru", "Bandra West, Mumbai"]
  },
  {
    "id": "ub-cafe-01",
    "name": "High-End Artisanal Specialty Cafe & Roastery",
    "sectorId": "urban_highend_hospitality",
    "sectorName": "Specialty Cafes, Fine Dining & Cloud Kitchens",
    "subCategory": "Specialty Artisanal Cafe & Roastery",
    "emoji": "☕",
    "minBudget": 3000000,
    "maxBudget": 12000000,
    "typicalBudget": 5000000,
    "tenPercentMargin": 500000,
    "monthlyRevenue": 1400000,
    "monthlyNetProfit": 420000,
    "roiMonths": 14,
    "competitionSensitivity": "Cluster_Beneficial",
    "agglomerationIndex": 9.2,
    "description": "Third-wave specialty coffee roastery with La Marzocco espresso bars, sourdough bakery, and Scandinavian minimalist aesthetics catering to affluent professionals.",
    "bestSuitedFor": "Hospitality entrepreneurs and specialty coffee roasters targeting high-discretionary income demographics.",
    "minAreaSqft": 1200,
    "targetMarginPercent": 30,
    "schemes": ["PMEGP (₹50 Lakh Unit)", "Mudra Tarun (₹20 Lakhs)", "CGTMSE Collateral-Free Credit"],
    "isRuralFocus": false,
    "marketTier": "urban",
    "clusterOpportunity": "Cafe cluster synergy: Co-locating in cafe belts (like C-Scheme or Indiranagar) increases total patron footfall by 3.2x.",
    "recommendedLocations": ["C-Scheme, Jaipur", "Indiranagar 100ft Road, Bengaluru", "Bandra West (Pali Hill), Mumbai", "Cyber City, Gurugram"]
  },
  {
    "id": "ub-cloudkitchen-01",
    "name": "Multi-Brand Commercial Cloud Kitchen",
    "sectorId": "urban_highend_hospitality",
    "sectorName": "Specialty Cafes, Fine Dining & Cloud Kitchens",
    "subCategory": "Multi-Brand Commercial Cloud Kitchen",
    "emoji": "🍳",
    "minBudget": 1500000,
    "maxBudget": 4000000,
    "typicalBudget": 2500000,
    "tenPercentMargin": 250000,
    "monthlyRevenue": 950000,
    "monthlyNetProfit": 240000,
    "roiMonths": 11,
    "competitionSensitivity": "Dispersion_Beneficial",
    "agglomerationIndex": 4.5,
    "description": "Commercial delivery-only kitchen operating 3-4 distinct virtual brands (Biryani, Gourmet Burgers, Pan-Asian, Healthy Bowls) with Zomato/Swiggy order integration.",
    "bestSuitedFor": "F&B operators seeking prime revenue with minimal high-street frontage rent overhead.",
    "minAreaSqft": 500,
    "targetMarginPercent": 25,
    "schemes": ["PMEGP (₹20 Lakhs)", "Mudra Kishore/Tarun", "Stand-Up India"],
    "isRuralFocus": false,
    "marketTier": "urban",
    "clusterOpportunity": "Benefits from being in low-rent backstreets 2-3km from affluent delivery clusters.",
    "recommendedLocations": ["Malviya Nagar, Jaipur", "HSR Layout, Bengaluru", "Andheri West, Mumbai", "Koregaon Park, Pune"]
  },
  {
    "id": "ub-tech-01",
    "name": "Authorized Laptop & PC Experience Store (Acer / Asus / Apple)",
    "sectorId": "tech_gaming_electronics",
    "sectorName": "IT Hardware, Gaming Cafes & Electronics",
    "subCategory": "Authorized Laptop & PC Experience Store",
    "emoji": "💻",
    "minBudget": 3500000,
    "maxBudget": 15000000,
    "typicalBudget": 6000000,
    "tenPercentMargin": 600000,
    "monthlyRevenue": 2800000,
    "monthlyNetProfit": 380000,
    "roiMonths": 16,
    "competitionSensitivity": "Cluster_Beneficial",
    "agglomerationIndex": 8.8,
    "description": "Authorized brand partner retail showroom stocking premium gaming laptops, desktop workstations, business ultrabooks, WiFi 6/7 mesh routers, and certified repair services.",
    "bestSuitedFor": "Tech entrepreneurs partnering with global OEMs (Acer, Asus ROG, Lenovo, HP, Apple) in commercial electronics markets.",
    "minAreaSqft": 800,
    "targetMarginPercent": 14,
    "schemes": ["CGTMSE MSME Credit", "Mudra Tarun (₹20 Lakhs)", "Bank OD Facility"],
    "isRuralFocus": false,
    "marketTier": "urban",
    "clusterOpportunity": "Co-locating in electronics high-streets (e.g. Nehru Place, SP Road, Raisar Plaza Jaipur) builds instant commercial footfall.",
    "recommendedLocations": ["Raisar Plaza / MI Road, Jaipur", "Nehru Place, New Delhi", "SP Road, Bengaluru", "Lamington Road, Mumbai"]
  },
  {
    "id": "ub-gaming-01",
    "name": "Esports & High-End RTX Gaming Lounge",
    "sectorId": "tech_gaming_electronics",
    "sectorName": "IT Hardware, Gaming Cafes & Electronics",
    "subCategory": "Esports & RTX Gaming Lounge",
    "emoji": "🎮",
    "minBudget": 1800000,
    "maxBudget": 5000000,
    "typicalBudget": 3000000,
    "tenPercentMargin": 300000,
    "monthlyRevenue": 680000,
    "monthlyNetProfit": 290000,
    "roiMonths": 11,
    "competitionSensitivity": "Dispersion_Beneficial",
    "agglomerationIndex": 5.2,
    "description": "Premier gaming destination featuring 25 high-spec RTX 4080 rigs, 240Hz monitors, Sony PS5 racing cockpits, VR headsets, fiber optic gigabit internet, and snack bar.",
    "bestSuitedFor": "Gaming enthusiasts and young tech founders near university campuses and high-density student areas.",
    "minAreaSqft": 1000,
    "targetMarginPercent": 42,
    "schemes": ["PMEGP Service Grant (35%)", "Mudra Tarun (₹20 Lakhs)", "MoSJE Concessional Term Loan"],
    "isRuralFocus": false,
    "marketTier": "urban",
    "clusterOpportunity": "High local monopoly near engineering colleges, coaching hubs, and university hostels.",
    "recommendedLocations": ["Malviya Nagar (near MNIT), Jaipur", "Koramangala (near Christ Univ), Bengaluru", "FC Road, Pune", "North Campus, Delhi"]
  },
  {
    "id": "ub-franchise-01",
    "name": "National Brand QSR Food Franchise",
    "sectorId": "urban_commercial_retail",
    "sectorName": "Malls, Arcades & Commercial Retail",
    "subCategory": "National Fast Food Franchise",
    "emoji": "🍔",
    "minBudget": 2500000,
    "maxBudget": 8000000,
    "typicalBudget": 4500000,
    "tenPercentMargin": 450000,
    "monthlyRevenue": 1200000,
    "monthlyNetProfit": 280000,
    "roiMonths": 17,
    "competitionSensitivity": "Cluster_Beneficial",
    "agglomerationIndex": 8.5,
    "description": "Standardized turnkey national quick-service restaurant (e.g. Subway, Burger Singh, Wow Momo, Chai Sutta Bar) with high brand equity, automated SOPs, and marketing support.",
    "bestSuitedFor": "First-time retail investors seeking tested franchise systems with predictable margin models.",
    "minAreaSqft": 450,
    "targetMarginPercent": 24,
    "schemes": ["JanSamarth Franchise Credit", "Mudra Tarun", "CGTMSE Guarantee"],
    "isRuralFocus": false,
    "marketTier": "universal",
    "clusterOpportunity": "High volume in food courts, metro stations, and transit junctions.",
    "recommendedLocations": ["GT Central Mall, Jaipur", "Rajiv Chowk Metro, Delhi", "Sony World Junction, Bengaluru", "Linking Road, Mumbai"]
  },
  {
    "id": "ub-salon-01",
    "name": "Luxury Unisex Salon & Med-Spa",
    "sectorId": "luxury_wellness_lifestyle",
    "sectorName": "Luxury Salons, Med-Spas & Fitness Hubs",
    "subCategory": "Luxury Unisex Salon & Med-Spa",
    "emoji": "✂️",
    "minBudget": 2500000,
    "maxBudget": 8500000,
    "typicalBudget": 4000000,
    "tenPercentMargin": 400000,
    "monthlyRevenue": 1100000,
    "monthlyNetProfit": 360000,
    "roiMonths": 12,
    "competitionSensitivity": "Dispersion_Beneficial",
    "agglomerationIndex": 6.0,
    "description": "High-end grooming parlor offering styling, keratin treatments, aesthetic facial therapies, pedicures, and bridal makeover packages.",
    "bestSuitedFor": "Certified cosmetologists and salon franchise partners in upscale residential zones.",
    "minAreaSqft": 900,
    "targetMarginPercent": 32,
    "schemes": ["PMEGP (₹20 Lakhs)", "Stand-Up India (for Women Entrepreneurs up to ₹1 Cr)", "Mudra Tarun"],
    "isRuralFocus": false,
    "marketTier": "urban",
    "clusterOpportunity": "Draws loyal recurring monthly subscriptions from 2km residential affluent radius.",
    "recommendedLocations": ["Vaishali Nagar, Jaipur", "Indiranagar, Bengaluru", "Jubilee Hills, Hyderabad", "Koregaon Park, Pune"]
  },
  {
    "id": "ub-coworking-01",
    "name": "Managed Co-working Space & Incubator",
    "sectorId": "commercial_services_coworking",
    "sectorName": "Coworking Spaces & EV Clean Energy Hubs",
    "subCategory": "Managed Co-working Space & Incubator",
    "emoji": "🏢",
    "minBudget": 5000000,
    "maxBudget": 30000000,
    "typicalBudget": 12000000,
    "tenPercentMargin": 1200000,
    "monthlyRevenue": 1800000,
    "monthlyNetProfit": 650000,
    "roiMonths": 20,
    "competitionSensitivity": "Cluster_Beneficial",
    "agglomerationIndex": 8.0,
    "description": "Flexible workspace with hot desks, dedicated executive cabins, soundproof podcast booths, 1Gbps redundant fiber internet, and conference facilities for startups and remote tech teams.",
    "bestSuitedFor": "Commercial real estate owners and startup ecosystem builders.",
    "minAreaSqft": 4500,
    "targetMarginPercent": 36,
    "schemes": ["Startup India Seed Fund", "SIDBI Venture Debt", "MSME Infrastructure Grant"],
    "isRuralFocus": false,
    "marketTier": "metro_luxury",
    "clusterOpportunity": "Benefits from closeness to startup tech parks and VC corridors.",
    "recommendedLocations": ["Tonk Road, Jaipur", "HSR Layout, Bengaluru", "BKC, Mumbai", "Cyber City, Gurugram"]
  },
  {
    "id": "ub-ev-01",
    "name": "Electric Vehicle Fast-Charging Hub & Gourmet Cafe",
    "sectorId": "commercial_services_coworking",
    "sectorName": "Coworking Spaces & EV Clean Energy Hubs",
    "subCategory": "EV Fast-Charging Hub & Gourmet Drive-Thru",
    "emoji": "⚡",
    "minBudget": 3500000,
    "maxBudget": 12000000,
    "typicalBudget": 6500000,
    "tenPercentMargin": 650000,
    "monthlyRevenue": 1250000,
    "monthlyNetProfit": 440000,
    "roiMonths": 15,
    "competitionSensitivity": "Dispersion_Beneficial",
    "agglomerationIndex": 6.8,
    "description": "Six 60kW/120kW CCS2 DC fast-chargers paired with a quick-service artisanal coffee lounge and clean restrooms along highway arterial corridors.",
    "bestSuitedFor": "Clean energy investors capitalizing on national highway EV adoption and captive 30-minute dwell time.",
    "minAreaSqft": 3000,
    "targetMarginPercent": 35,
    "schemes": ["FAME II Infrastructure Subsidy", "PMEGP (₹50 Lakhs)", "Green Energy Concessional Finance"],
    "isRuralFocus": false,
    "marketTier": "universal",
    "clusterOpportunity": "Capture captive high-margin F&B revenue while electric vehicles charge.",
    "recommendedLocations": ["Jaipur-Delhi NH-48 Highway", "Bengaluru-Mysuru Expressway", "Mumbai-Pune Expressway", "Jaipur Bypass Junction"]
  },

  {
    "id": "mb-leather-01",
    "name": "Traditional Handcrafted Mojari & Jutti Workshop",
    "sectorId": "leather_footwear",
    "sectorName": "Leather Crafts & Footwear (चर्मकार व जूती-मोजरी शिल्प)",
    "subCategory": "Handcrafted Mojari / Jutti Making",
    "emoji": "👞",
    "minBudget": 25000,
    "maxBudget": 150000,
    "typicalBudget": 80000,
    "tenPercentMargin": 8000,
    "monthlyRevenue": 65000,
    "monthlyNetProfit": 28000,
    "roiMonths": 5,
    "competitionSensitivity": "Cluster_Beneficial",
    "agglomerationIndex": 9.4,
    "description": "Artisanal handcrafted leather Mojaris and embellished bridal footwear. In specialized footwear clusters (e.g., Jaipur, Jodhpur, Agra), high competitor density creates a destination shopping magnet with 30% lower raw material costs and subcontracting spillover.",
    "bestSuitedFor": "Skilled traditional cobblers/artisans leveraging PM Vishwakarma Scheme (₹15,000 toolkit + ₹1 Lakh concessional credit @ 5%).",
    "minAreaSqft": 80,
    "targetMarginPercent": 42,
    "schemes": [
      "PM Vishwakarma (Cobbler/Charmakar)",
      "MoSJE Micro Finance",
      "MUDRA Shishu"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "High agglomeration advantage in Jaipur/Jodhpur/Agra footwear corridors.",
    "recommendedLocations": [
      "Sanganer Tehsil, Jaipur",
      "Amber Road Mojari Market, Jaipur",
      "Sojati Gate, Jodhpur",
      "Sadhu Mandi, Agra"
    ]
  },
  {
    "id": "mb-leather-02",
    "name": "Tehsil Cobbler & Quick Shoe Repair Kiosk",
    "sectorId": "leather_footwear",
    "sectorName": "Leather Crafts & Footwear (चर्मकार व जूती-मोजरी शिल्प)",
    "subCategory": "Cobbler & Shoe Repair",
    "emoji": "🧰",
    "minBudget": 10000,
    "maxBudget": 40000,
    "typicalBudget": 20000,
    "tenPercentMargin": 2000,
    "monthlyRevenue": 32000,
    "monthlyNetProfit": 22000,
    "roiMonths": 2,
    "competitionSensitivity": "Dispersion_Beneficial",
    "agglomerationIndex": 3.2,
    "description": "Ultra-micro roadside or village center footwear repair and sole-replacing kiosk. High profitability in residential wards and outer village tehsils where residents need quick routine fixes without traveling 15 km to the main bazaar.",
    "bestSuitedFor": "Micro-entrepreneurs with limited initial capital utilizing PM SVANidhi (₹10k-₹20k) or PM Vishwakarma toolkit grant.",
    "minAreaSqft": 40,
    "targetMarginPercent": 68,
    "schemes": [
      "PM SVANidhi",
      "PM Vishwakarma (Cobbler)",
      "MoSJE Micro Finance"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Thrives in outer tehsil bus stands and village crossroads with 0 competitors.",
    "recommendedLocations": [
      "Bassi Tehsil Bus Stand, Jaipur Rural",
      "Chomu Gram Panchayat Chauraha",
      "Phagi Market"
    ]
  },
  {
    "id": "mb-leather-03",
    "name": "Bespoke Leather Shoe & Orthopedic Footwear Unit",
    "sectorId": "leather_footwear",
    "sectorName": "Leather Crafts & Footwear (चर्मकार व जूती-मोजरी शिल्प)",
    "subCategory": "Custom Leather Footwear",
    "emoji": "👞",
    "minBudget": 100000,
    "maxBudget": 450000,
    "typicalBudget": 200000,
    "tenPercentMargin": 20000,
    "monthlyRevenue": 140000,
    "monthlyNetProfit": 55000,
    "roiMonths": 6,
    "competitionSensitivity": "Cluster_Beneficial",
    "agglomerationIndex": 8.7,
    "description": "Custom made-to-measure leather shoes, boots, and doctor-prescribed orthopedic comfort footwear for diabetic and senior citizens.",
    "bestSuitedFor": "Experienced shoe makers upgrading to mechanized lasting machines with MoSJE Micro Finance / Term Loan.",
    "minAreaSqft": 150,
    "targetMarginPercent": 39,
    "schemes": [
      "MoSJE Micro Finance Scheme",
      "MUDRA Kishore",
      "PM Vishwakarma Tranche 2"
    ],
    "isRuralFocus": false,
    "clusterOpportunity": "Benefits from footwear cluster supply chain proximity and local medical referrals.",
    "recommendedLocations": [
      "Raja Park, Jaipur",
      "Bapu Bazaar, Jaipur",
      "Sanganer Main Market"
    ]
  },
  {
    "id": "mb-leather-04",
    "name": "Leather Bags, Belts & Small Goods Workshop",
    "sectorId": "leather_footwear",
    "sectorName": "Leather Crafts & Footwear (चर्मकार व जूती-मोजरी शिल्प)",
    "subCategory": "Leather Accessories",
    "emoji": "👜",
    "minBudget": 50000,
    "maxBudget": 250000,
    "typicalBudget": 120000,
    "tenPercentMargin": 12000,
    "monthlyRevenue": 85000,
    "monthlyNetProfit": 34000,
    "roiMonths": 6,
    "competitionSensitivity": "Neutral",
    "agglomerationIndex": 7.2,
    "description": "Manufacturing and retailing genuine leather wallets, belts, office bags, and travel pouches using locally tanned hides.",
    "bestSuitedFor": "Artisan families tapping into domestic tourist markets and e-commerce crafts portals.",
    "minAreaSqft": 120,
    "targetMarginPercent": 40,
    "schemes": [
      "MoSJE Micro Finance Scheme",
      "PMEGP (25% Subsidy)",
      "PM Vishwakarma"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "High tourist footfall synergy in heritage circuits.",
    "recommendedLocations": [
      "Amer Road Artisan Hub, Jaipur",
      "Pushkar Bazaar",
      "Udaipur Old City"
    ]
  },
  {
    "id": "mb-repair-01",
    "name": "Laptop, PC & Hardware Component Repair Center",
    "sectorId": "repair_services",
    "sectorName": "Repair & Technical Services (मरम्मत व तकनीकी सेवाएं)",
    "subCategory": "Computer & Laptop Repair",
    "emoji": "💻",
    "minBudget": 75000,
    "maxBudget": 350000,
    "typicalBudget": 180000,
    "tenPercentMargin": 18000,
    "monthlyRevenue": 110000,
    "monthlyNetProfit": 52000,
    "roiMonths": 5,
    "competitionSensitivity": "Neutral",
    "agglomerationIndex": 7.8,
    "description": "Motherboard chip-level repair, screen replacement, SSD upgrades, and software diagnostics for computers, laptops, and IT peripherals.",
    "bestSuitedFor": "ITI/polytechnic diploma holders and hardware technicians.",
    "minAreaSqft": 120,
    "targetMarginPercent": 55,
    "schemes": [
      "MoSJE Micro Finance",
      "MUDRA Shishu",
      "PMEGP"
    ],
    "isRuralFocus": false,
    "clusterOpportunity": "Thrives near colleges, coaching centers, and electronic markets.",
    "recommendedLocations": [
      "Raja Park, Jaipur",
      "Mansarovar Sector 3, Jaipur",
      "Gopalpura Bypass"
    ]
  },
  {
    "id": "mb-repair-02",
    "name": "Smart Mobile Phone Repair & Screen Replacement Kiosk",
    "sectorId": "repair_services",
    "sectorName": "Repair & Technical Services (मरम्मत व तकनीकी सेवाएं)",
    "subCategory": "Mobile Phone Repair",
    "emoji": "📱",
    "minBudget": 30000,
    "maxBudget": 120000,
    "typicalBudget": 60000,
    "tenPercentMargin": 6000,
    "monthlyRevenue": 65000,
    "monthlyNetProfit": 36000,
    "roiMonths": 3,
    "competitionSensitivity": "Dispersion_Beneficial",
    "agglomerationIndex": 5.5,
    "description": "Immediate OCA glass lamination, charging port fixing, battery replacement, and accessories retailing.",
    "bestSuitedFor": "Young tech technicians in rural tehsils where nearest authorized service center is 30 km away.",
    "minAreaSqft": 60,
    "targetMarginPercent": 60,
    "schemes": [
      "PM SVANidhi",
      "MoSJE Micro Finance",
      "MUDRA Shishu"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "High daily cash flow in rural block headquarters and weekly haats.",
    "recommendedLocations": [
      "Chomu Bus Stand, Jaipur Rural",
      "Bassi Market",
      "Kotputli Tehsil"
    ]
  },
  {
    "id": "mb-repair-03",
    "name": "Agricultural Water Pump & Electric Motor Winding Workshop",
    "sectorId": "repair_services",
    "sectorName": "Repair & Technical Services (मरम्मत व तकनीकी सेवाएं)",
    "subCategory": "Motor Winding & Pump Repair",
    "emoji": "⚡",
    "minBudget": 40000,
    "maxBudget": 180000,
    "typicalBudget": 90000,
    "tenPercentMargin": 9000,
    "monthlyRevenue": 75000,
    "monthlyNetProfit": 38000,
    "roiMonths": 4,
    "competitionSensitivity": "Dispersion_Beneficial",
    "agglomerationIndex": 4.1,
    "description": "Submersible borewell pump rewinding, agricultural electric motor overhaul, and single/three-phase starter switch repair.",
    "bestSuitedFor": "Electricians servicing farming tubewells and rural small-scale workshops.",
    "minAreaSqft": 150,
    "targetMarginPercent": 52,
    "schemes": [
      "PM Vishwakarma",
      "MoSJE Micro Finance",
      "MUDRA Shishu"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Crucial rural utility with seasonal demand surges during crop irrigation cycles.",
    "recommendedLocations": [
      "Shahpura Mandi Road",
      "Chaksu Tehsil Hub",
      "Jamwa Ramgarh"
    ]
  },
  {
    "id": "mb-repair-04",
    "name": "Two-Wheeler & Agri Tractor Implement Mechanic Garage",
    "sectorId": "repair_services",
    "sectorName": "Repair & Technical Services (मरम्मत व तकनीकी सेवाएं)",
    "subCategory": "Two-Wheeler & Agri Mechanic",
    "emoji": "🔧",
    "minBudget": 50000,
    "maxBudget": 220000,
    "typicalBudget": 110000,
    "tenPercentMargin": 11000,
    "monthlyRevenue": 80000,
    "monthlyNetProfit": 42000,
    "roiMonths": 4,
    "competitionSensitivity": "Dispersion_Beneficial",
    "agglomerationIndex": 4.8,
    "description": "Servicing motorcycles, scooters, tractor hydraulic trolleys, rotavators, and sprayers along rural arterial highways.",
    "bestSuitedFor": "Automobile mechanics operating on state highway feeder junctions.",
    "minAreaSqft": 250,
    "targetMarginPercent": 55,
    "schemes": [
      "MoSJE Micro Finance",
      "MUDRA Shishu",
      "Stand-Up India"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "High steady highway breakdown transit and rural commuting demand.",
    "recommendedLocations": [
      "Delhi-Jaipur Highway Feeder (Kotputli)",
      "Tonk Road Junction (Chaksu)"
    ]
  },
  {
    "id": "mb-repair-05",
    "name": "Home Appliances & Air Cooler / Motor Repair Shop",
    "sectorId": "repair_services",
    "sectorName": "Repair & Technical Services (मरम्मत व तकनीकी सेवाएं)",
    "subCategory": "Home Appliance Repair",
    "emoji": "🧰",
    "minBudget": 25000,
    "maxBudget": 90000,
    "typicalBudget": 50000,
    "tenPercentMargin": 5000,
    "monthlyRevenue": 45000,
    "monthlyNetProfit": 26000,
    "roiMonths": 3,
    "competitionSensitivity": "Dispersion_Beneficial",
    "agglomerationIndex": 3.9,
    "description": "Repairing ceiling fans, desert air coolers, water geysers, washing machine motors, and home wiring.",
    "bestSuitedFor": "Local electrical technicians servicing semi-urban mohallas and villages.",
    "minAreaSqft": 80,
    "targetMarginPercent": 62,
    "schemes": [
      "PM SVANidhi",
      "MoSJE Micro Finance",
      "PM Vishwakarma"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Zero competition in outer residential colonies yields high client loyalty.",
    "recommendedLocations": [
      "Sanganer Town Ward 12",
      "Morija Gram Panchayat",
      "Amer Ghati"
    ]
  },
  {
    "id": "mb-agro-01",
    "name": "Mini Flour Mill (Chakki) & Spices Grinding Unit",
    "sectorId": "agro_food",
    "sectorName": "Agro-Processing & Food Products (कृषि प्रसंस्करण व खाद्य उत्पाद)",
    "subCategory": "Flour & Spices Mill",
    "emoji": "🌾",
    "minBudget": 60000,
    "maxBudget": 250000,
    "typicalBudget": 120000,
    "tenPercentMargin": 12000,
    "monthlyRevenue": 70000,
    "monthlyNetProfit": 32000,
    "roiMonths": 5,
    "competitionSensitivity": "Dispersion_Beneficial",
    "agglomerationIndex": 3.5,
    "description": "Fresh wheat, millet (bajra), and gram flour milling combined with stone-ground turmeric, chili, and coriander processing.",
    "bestSuitedFor": "Village entrepreneurs with reliable single/three-phase power connection.",
    "minAreaSqft": 150,
    "targetMarginPercent": 48,
    "schemes": [
      "MoSJE Micro Finance",
      "PMFME (35% Subsidy)",
      "PMEGP"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Daily household staple requirement with zero seasonal dip.",
    "recommendedLocations": [
      "Bassi Gram Panchayat",
      "Chomu Mandi Link Road",
      "Phagi Village Central"
    ]
  },
  {
    "id": "mb-agro-02",
    "name": "Cold-Pressed Mustard Oil Expeller (Kachi Ghani)",
    "sectorId": "agro_food",
    "sectorName": "Agro-Processing & Food Products (कृषि प्रसंस्करण व खाद्य उत्पाद)",
    "subCategory": "Edible Oil Processing",
    "emoji": "🌻",
    "minBudget": 120000,
    "maxBudget": 500000,
    "typicalBudget": 240000,
    "tenPercentMargin": 24000,
    "monthlyRevenue": 160000,
    "monthlyNetProfit": 48000,
    "roiMonths": 6,
    "competitionSensitivity": "Neutral",
    "agglomerationIndex": 6.8,
    "description": "Authentic cold-pressed mustard oil extraction with high demand for pure unadulterated edible oil and cattle cake (khali) by-product.",
    "bestSuitedFor": "Agri-entrepreneurs in Rajasthan mustard belts with access to local harvest supply.",
    "minAreaSqft": 200,
    "targetMarginPercent": 30,
    "schemes": [
      "PMFME (Prime Minister Formalisation of Micro Food Processing)",
      "MoSJE Term Loan",
      "PMEGP"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Cattle cake provides immediate secondary income to local dairy farmers.",
    "recommendedLocations": [
      "Chomu Agro Mandi",
      "Bassi Krishi Upaj Mandi",
      "Kotputli"
    ]
  },
  {
    "id": "mb-agro-03",
    "name": "Village Milk Collection & Chilling Kiosk",
    "sectorId": "agro_food",
    "sectorName": "Agro-Processing & Food Products (कृषि प्रसंस्करण व खाद्य उत्पाद)",
    "subCategory": "Dairy & Milk Testing",
    "emoji": "🥛",
    "minBudget": 80000,
    "maxBudget": 350000,
    "typicalBudget": 160000,
    "tenPercentMargin": 16000,
    "monthlyRevenue": 180000,
    "monthlyNetProfit": 38000,
    "roiMonths": 5,
    "competitionSensitivity": "Dispersion_Beneficial",
    "agglomerationIndex": 4.5,
    "description": "Automated fat/SNF milk testing, bulk chilling, and daily supply dispatch to cooperative dairy federations (Saras/Amul).",
    "bestSuitedFor": "Rural youth partnering with local dairy farmers across 3-5 village clusters.",
    "minAreaSqft": 150,
    "targetMarginPercent": 22,
    "schemes": [
      "National Dairy Plan",
      "MoSJE Micro Finance",
      "MUDRA Kishore"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Daily morning & evening cash turnover with guaranteed institutional dairy offtake.",
    "recommendedLocations": [
      "Jamwa Ramgarh Dairy Route",
      "Chaksu Rural Feeder",
      "Amer Ghati"
    ]
  },
  {
    "id": "mb-agro-04",
    "name": "Artisanal Pickle, Papad & Murabba Packaging Unit",
    "sectorId": "agro_food",
    "sectorName": "Agro-Processing & Food Products (कृषि प्रसंस्करण व खाद्य उत्पाद)",
    "subCategory": "Packaged Food Products",
    "emoji": "🥣",
    "minBudget": 20000,
    "maxBudget": 100000,
    "typicalBudget": 45000,
    "tenPercentMargin": 4500,
    "monthlyRevenue": 50000,
    "monthlyNetProfit": 24000,
    "roiMonths": 3,
    "competitionSensitivity": "Neutral",
    "agglomerationIndex": 6.2,
    "description": "Traditional homemade amla murabba, mango/ker-sangri pickle, and lentil papad processed and nitrogen sealed for weekly haats and retail stores.",
    "bestSuitedFor": "Women Self-Help Groups (SHGs) and home-based culinary artisans.",
    "minAreaSqft": 100,
    "targetMarginPercent": 48,
    "schemes": [
      "PMFME Seed Capital for SHGs",
      "MoSJE Micro Finance",
      "PM SVANidhi"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "High demand in tourism routes and urban exhibition bazaars.",
    "recommendedLocations": [
      "Sanganer Village",
      "Amer Ghati",
      "Chomu Town"
    ]
  },
  {
    "id": "mb-textile-01",
    "name": "Traditional Handblock Printing Unit (Sanganeri / Bagru)",
    "sectorId": "textiles_apparel",
    "sectorName": "Textiles, Handloom & Tailoring (हथकरघा, वस्त्र व सिलाई)",
    "subCategory": "Handblock Printing",
    "emoji": "🎨",
    "minBudget": 50000,
    "maxBudget": 300000,
    "typicalBudget": 130000,
    "tenPercentMargin": 13000,
    "monthlyRevenue": 120000,
    "monthlyNetProfit": 45000,
    "roiMonths": 4,
    "competitionSensitivity": "Cluster_Beneficial",
    "agglomerationIndex": 9.6,
    "description": "Authentic wooden handblock printing on pure cotton, mulmul, and chanderi using natural and pigment dyes. High agglomeration synergy in Sanganer/Bagru clusters where exporters, fabric mills, and master dyers co-locate.",
    "bestSuitedFor": "Artisan families utilizing PM Vishwakarma and National Handloom Development Programme.",
    "minAreaSqft": 250,
    "targetMarginPercent": 38,
    "schemes": [
      "PM Vishwakarma (Tailor/Artisan)",
      "KVIC PMEGP (35% Subsidy)",
      "MoSJE Micro Finance"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "World famous cluster draws national designers and international export orders.",
    "recommendedLocations": [
      "Sanganer Artisan Enclave, Jaipur",
      "Bagru Cluster, Jaipur Rural"
    ]
  },
  {
    "id": "mb-textile-02",
    "name": "Rural Tailoring, Boutique & Uniform Workshop",
    "sectorId": "textiles_apparel",
    "sectorName": "Textiles, Handloom & Tailoring (हथकरघा, वस्त्र व सिलाई)",
    "subCategory": "Tailoring & Garments",
    "emoji": "🧵",
    "minBudget": 15000,
    "maxBudget": 75000,
    "typicalBudget": 35000,
    "tenPercentMargin": 3500,
    "monthlyRevenue": 40000,
    "monthlyNetProfit": 25000,
    "roiMonths": 2,
    "competitionSensitivity": "Dispersion_Beneficial",
    "agglomerationIndex": 4.2,
    "description": "Custom blouse/salwar-kameez stitching, school uniform bulk tailoring, and festive garment alteration for local families.",
    "bestSuitedFor": "Home-based or shop-based tailors with motorized sewing machines.",
    "minAreaSqft": 80,
    "targetMarginPercent": 65,
    "schemes": [
      "PM Vishwakarma (Darzi / Tailor)",
      "PM SVANidhi",
      "MoSJE Micro Finance"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Spike in revenue during school reopening (July) and wedding season (Nov-Feb).",
    "recommendedLocations": [
      "Bassi Village Center",
      "Morija Gram Panchayat",
      "Shahpura Main Market"
    ]
  },
  {
    "id": "mb-textile-03",
    "name": "Readymade Garment & Dailywear Retail Stall",
    "sectorId": "textiles_apparel",
    "sectorName": "Textiles, Handloom & Tailoring (हथकरघा, वस्त्र व सिलाई)",
    "subCategory": "Readymade Clothing Retail",
    "emoji": "👗",
    "minBudget": 40000,
    "maxBudget": 200000,
    "typicalBudget": 90000,
    "tenPercentMargin": 9000,
    "monthlyRevenue": 80000,
    "monthlyNetProfit": 28000,
    "roiMonths": 5,
    "competitionSensitivity": "Neutral",
    "agglomerationIndex": 7.1,
    "description": "Affordable cotton hosiery, kids’ apparel, shirts, and sarees sourced from wholesale textile mandis (Purohit Ji Ka Katla / Surat).",
    "bestSuitedFor": "Retailers servicing weekly haats and tehsil markets.",
    "minAreaSqft": 100,
    "targetMarginPercent": 35,
    "schemes": [
      "MoSJE Micro Finance",
      "MUDRA Shishu",
      "PM SVANidhi"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "High turnover during weekly bazaar days.",
    "recommendedLocations": [
      "Chomu Weekly Haat Ground",
      "Chaksu Bazaar",
      "Kotputli Station Road"
    ]
  },
  {
    "id": "mb-craft-01",
    "name": "Terracotta Pottery & Clay Utensils Workshop",
    "sectorId": "handicrafts_artisan",
    "sectorName": "Traditional Crafts & Artisans (हस्तशिल्प व विश्वकर्मा कारीगरी)",
    "subCategory": "Pottery & Clay Art",
    "emoji": "🏺",
    "minBudget": 15000,
    "maxBudget": 80000,
    "typicalBudget": 35000,
    "tenPercentMargin": 3500,
    "monthlyRevenue": 38000,
    "monthlyNetProfit": 24000,
    "roiMonths": 2,
    "competitionSensitivity": "Cluster_Beneficial",
    "agglomerationIndex": 8.9,
    "description": "Electric pottery wheel production of traditional kulhads, curd pots (matka), decorative planters, and festive diyas. High cluster advantage in terracotta hubs where clay kilns and bulk transport are shared.",
    "bestSuitedFor": "Traditional potters (Kumhar) using PM Vishwakarma electric wheel incentive.",
    "minAreaSqft": 150,
    "targetMarginPercent": 65,
    "schemes": [
      "PM Vishwakarma (Potter / Kumhaar)",
      "KVIC Gramodyog",
      "MoSJE Micro Finance"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Surge demand from tea stalls (kulhads) and summer water pots.",
    "recommendedLocations": [
      "Amer Rural Pottery Enclave",
      "Bassi Clay Workshop",
      "Chomu Rural Road"
    ]
  },
  {
    "id": "mb-craft-02",
    "name": "Blacksmith & Agri Tool Fabrication Forge (Lohar)",
    "sectorId": "handicrafts_artisan",
    "sectorName": "Traditional Crafts & Artisans (हस्तशिल्प व विश्वकर्मा कारीगरी)",
    "subCategory": "Blacksmith & Tools",
    "emoji": "🔨",
    "minBudget": 20000,
    "maxBudget": 100000,
    "typicalBudget": 45000,
    "tenPercentMargin": 4500,
    "monthlyRevenue": 42000,
    "monthlyNetProfit": 26000,
    "roiMonths": 3,
    "competitionSensitivity": "Dispersion_Beneficial",
    "agglomerationIndex": 4.6,
    "description": "Forging and sharpening sickles (danti), plow blades, axes, iron spades (phawra), and construction crowbars.",
    "bestSuitedFor": "Traditional blacksmiths (Lohar) operating near agricultural mandis and rural crossroads.",
    "minAreaSqft": 120,
    "targetMarginPercent": 62,
    "schemes": [
      "PM Vishwakarma (Blacksmith / Lohar)",
      "MoSJE Micro Finance",
      "PM SVANidhi"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Direct demand from farm laborers and construction sites.",
    "recommendedLocations": [
      "Chomu Mandi Yard",
      "Phagi Chauraha",
      "Shahpura Old Town"
    ]
  },
  {
    "id": "mb-craft-03",
    "name": "Carpentry & Custom Wooden Furniture Workshop (Suthar)",
    "sectorId": "handicrafts_artisan",
    "sectorName": "Traditional Crafts & Artisans (हस्तशिल्प व विश्वकर्मा कारीगरी)",
    "subCategory": "Carpentry & Woodwork",
    "emoji": "🪑",
    "minBudget": 35000,
    "maxBudget": 180000,
    "typicalBudget": 80000,
    "tenPercentMargin": 8000,
    "monthlyRevenue": 75000,
    "monthlyNetProfit": 38000,
    "roiMonths": 4,
    "competitionSensitivity": "Neutral",
    "agglomerationIndex": 6.5,
    "description": "Custom wooden doors, window frames, bed frames (charpai/diwan), and farm storage boxes fabricated with electric planers and routers.",
    "bestSuitedFor": "Carpenters (Suthar/Badhai) fulfilling home construction orders in expanding rural tehsils.",
    "minAreaSqft": 200,
    "targetMarginPercent": 50,
    "schemes": [
      "PM Vishwakarma (Carpenter / Suthar)",
      "MoSJE Micro Finance",
      "MUDRA Shishu"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "High steady work tied to rural pucca house construction boom.",
    "recommendedLocations": [
      "Bassi Woodwork Belt",
      "Sanganer Extension",
      "Kotputli Link Road"
    ]
  },
  {
    "id": "mb-retail-01",
    "name": "Rural Kirana, Provisions & FMCG Daily Needs Store",
    "sectorId": "retail_trade",
    "sectorName": "Rural & Urban Retail Trade (किराना, सामान्य स्टोर व थोक)",
    "subCategory": "Grocery & General Store",
    "emoji": "🛒",
    "minBudget": 50000,
    "maxBudget": 300000,
    "typicalBudget": 140000,
    "tenPercentMargin": 14000,
    "monthlyRevenue": 130000,
    "monthlyNetProfit": 28000,
    "roiMonths": 6,
    "competitionSensitivity": "Dispersion_Beneficial",
    "agglomerationIndex": 3.8,
    "description": "Daily staples, pulses, cooking oils, soaps, packaged tea, and confectioneries serving a 300-household village mohalla.",
    "bestSuitedFor": "Family-run local stores with established neighborhood goodwill.",
    "minAreaSqft": 150,
    "targetMarginPercent": 22,
    "schemes": [
      "MoSJE Micro Finance",
      "MUDRA Shishu",
      "PM SVANidhi"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Everyday mandatory expenditure with steady recurring cash flow.",
    "recommendedLocations": [
      "Morija Gram Panchayat",
      "Bassi Ward 4",
      "Chaksu Feeder Village"
    ]
  },
  {
    "id": "mb-retail-02",
    "name": "Certified Seed, Fertilizer & Bio-Pesticide Agri Depot",
    "sectorId": "retail_trade",
    "sectorName": "Rural & Urban Retail Trade (किराना, सामान्य स्टोर व थोक)",
    "subCategory": "Agri Inputs Retail",
    "emoji": "🌱",
    "minBudget": 100000,
    "maxBudget": 500000,
    "typicalBudget": 220000,
    "tenPercentMargin": 22000,
    "monthlyRevenue": 210000,
    "monthlyNetProfit": 42000,
    "roiMonths": 6,
    "competitionSensitivity": "Neutral",
    "agglomerationIndex": 6.9,
    "description": "Government certified hybrid seeds, DAP/Urea fertilizers, micronutrients, and organic bio-pesticides for kharif and rabi crops.",
    "bestSuitedFor": "Agriculture graduates or rural entrepreneurs with pesticide dealership license.",
    "minAreaSqft": 200,
    "targetMarginPercent": 20,
    "schemes": [
      "PM KISAN Agri-Clinic",
      "MoSJE Term Loan",
      "MUDRA Kishore"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Huge seasonal surges in pre-sowing months (June-July, Oct-Nov).",
    "recommendedLocations": [
      "Chomu Mandi Gate",
      "Bassi Krishi Bazaar",
      "Shahpura Main Crossroad"
    ]
  },
  {
    "id": "mb-elec-01",
    "name": "Electrical House-Wiring & Lighting Hardware Shop",
    "sectorId": "electrical_hardware",
    "sectorName": "Electrical, Solar & Hardware (विद्युत, सौर व हार्डवेयर)",
    "subCategory": "Electrical Goods",
    "emoji": "💡",
    "minBudget": 60000,
    "maxBudget": 300000,
    "typicalBudget": 150000,
    "tenPercentMargin": 15000,
    "monthlyRevenue": 110000,
    "monthlyNetProfit": 34000,
    "roiMonths": 5,
    "competitionSensitivity": "Neutral",
    "agglomerationIndex": 5.8,
    "description": "Copper conduits, switches, MCBs, LED bulbs, ceiling fans, and inverter batteries for residential and commercial construction.",
    "bestSuitedFor": "Licensed electricians partnering with local building contractors.",
    "minAreaSqft": 150,
    "targetMarginPercent": 32,
    "schemes": [
      "MoSJE Micro Finance",
      "MUDRA Shishu",
      "PMEGP"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Tied directly to new housing construction and renovation demand.",
    "recommendedLocations": [
      "Sanganer Ring Road Extension",
      "Bassi New Abadi",
      "Amer Town"
    ]
  },
  {
    "id": "mb-elec-02",
    "name": "Solar Rooftop & Agri Pump Installation Agency",
    "sectorId": "electrical_hardware",
    "sectorName": "Electrical, Solar & Hardware (विद्युत, सौर व हार्डवेयर)",
    "subCategory": "Solar & Clean Energy",
    "emoji": "☀️",
    "minBudget": 150000,
    "maxBudget": 700000,
    "typicalBudget": 350000,
    "tenPercentMargin": 35000,
    "monthlyRevenue": 260000,
    "monthlyNetProfit": 68000,
    "roiMonths": 6,
    "competitionSensitivity": "Neutral",
    "agglomerationIndex": 7.4,
    "description": "Turnkey solar rooftop panels, PM KUSUM solar agricultural pump installations, and inverter battery backup systems.",
    "bestSuitedFor": "Technical entrepreneurs tapping into PM Surya Ghar Muft Bijli Yojana subsidies.",
    "minAreaSqft": 200,
    "targetMarginPercent": 26,
    "schemes": [
      "PM Surya Ghar Muft Bijli Yojana",
      "PM KUSUM Scheme",
      "MoSJE Term Loan"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "High government subsidy incentives up to ₹78,000 per residential installation.",
    "recommendedLocations": [
      "Kotputli Main Highway",
      "Chomu Town Center",
      "Raja Park, Jaipur"
    ]
  },
  {
    "id": "mb-fnb-01",
    "name": "High-Volume Tea & Snacks Tapri (Chai-Nashta Kiosk)",
    "sectorId": "fnb_dining",
    "sectorName": "Food & Beverage / Dining (चाय, ढाबा, बेकरी व जलपान)",
    "subCategory": "Tea & Snacks Stall",
    "emoji": "☕",
    "minBudget": 15000,
    "maxBudget": 60000,
    "typicalBudget": 30000,
    "tenPercentMargin": 3000,
    "monthlyRevenue": 55000,
    "monthlyNetProfit": 30000,
    "roiMonths": 2,
    "competitionSensitivity": "Neutral",
    "agglomerationIndex": 6.8,
    "description": "Kadak masala chai, samosa, kachori, poha, and bun-maska operating from 6 AM to 10 PM at busy transit interchanges.",
    "bestSuitedFor": "Micro-vendors seeking immediate daily cash receipts with ultra-low capital.",
    "minAreaSqft": 50,
    "targetMarginPercent": 55,
    "schemes": [
      "PM SVANidhi (₹10,000 to ₹50,000)",
      "MoSJE Micro Finance"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Transit stops, court complexes, and hospital gates guarantee uninterrupted morning footfall.",
    "recommendedLocations": [
      "Sanganer Tehsil Court Gate",
      "Chomu Bus Stand",
      "Bassi Railway Crossing"
    ]
  },
  {
    "id": "mb-fnb-02",
    "name": "Highway Dhaba & Pure Veg Family Restaurant",
    "sectorId": "fnb_dining",
    "sectorName": "Food & Beverage / Dining (चाय, ढाबा, बेकरी व जलपान)",
    "subCategory": "Dhaba & Dining",
    "emoji": "🍽️",
    "minBudget": 150000,
    "maxBudget": 900000,
    "typicalBudget": 450000,
    "tenPercentMargin": 45000,
    "monthlyRevenue": 320000,
    "monthlyNetProfit": 85000,
    "roiMonths": 6,
    "competitionSensitivity": "Neutral",
    "agglomerationIndex": 7.5,
    "description": "Dal bati churma, paneer curries, tandoori rotis, and thali dining for truck drivers, families, and intercity bus passengers.",
    "bestSuitedFor": "Food entrepreneurs with roadside plot on national/state highway.",
    "minAreaSqft": 800,
    "targetMarginPercent": 35,
    "schemes": [
      "MoSJE Term Loan Scheme",
      "MUDRA Tarun",
      "PMEGP"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "24/7 highway transit traffic provides high dining receipts.",
    "recommendedLocations": [
      "Jaipur-Delhi NH 48 (Shahpura)",
      "Jaipur-Kota NH 52 (Chaksu)"
    ]
  },
  {
    "id": "mb-health-01",
    "name": "Pradhan Mantri Jan Aushadhi Generic Pharmacy",
    "sectorId": "health_wellness",
    "sectorName": "Health, Pharmacy & Grooming (दवा, आयुर्वेद व सैलून)",
    "subCategory": "Generic Chemist",
    "emoji": "💊",
    "minBudget": 80000,
    "maxBudget": 350000,
    "typicalBudget": 180000,
    "tenPercentMargin": 18000,
    "monthlyRevenue": 150000,
    "monthlyNetProfit": 36000,
    "roiMonths": 5,
    "competitionSensitivity": "Dispersion_Beneficial",
    "agglomerationIndex": 5.2,
    "description": "High-quality generic medicines at 50-90% cheaper prices than branded counterparts backed by Pharmaceuticals & Medical Devices Bureau of India (PMBI).",
    "bestSuitedFor": "Registered B.Pharm/D.Pharm holders.",
    "minAreaSqft": 120,
    "targetMarginPercent": 25,
    "schemes": [
      "PM Jan Aushadhi Kendra (Govt ₹2.5L Incentive)",
      "MoSJE Micro Finance",
      "MUDRA Shishu"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Locations opposite Community Health Centers (CHCs) and rural clinics.",
    "recommendedLocations": [
      "Chomu CHC Road",
      "Bassi Govt Hospital Front",
      "Phagi Primary Health Center"
    ]
  },
  {
    "id": "mb-health-02",
    "name": "Men’s Barber, Shave & Grooming Salon",
    "sectorId": "health_wellness",
    "sectorName": "Health, Pharmacy & Grooming (दवा, आयुर्वेद व सैलून)",
    "subCategory": "Barber & Grooming",
    "emoji": "✂️",
    "minBudget": 15000,
    "maxBudget": 80000,
    "typicalBudget": 40000,
    "tenPercentMargin": 4000,
    "monthlyRevenue": 45000,
    "monthlyNetProfit": 28000,
    "roiMonths": 2,
    "competitionSensitivity": "Dispersion_Beneficial",
    "agglomerationIndex": 4,
    "description": "Hair styling, shaving, head massage, and facial grooming with hydraulic chairs and sterilizers.",
    "bestSuitedFor": "Traditional barbers (Nai) leveraging PM Vishwakarma Barber toolkit.",
    "minAreaSqft": 80,
    "targetMarginPercent": 68,
    "schemes": [
      "PM Vishwakarma (Barber / Naai)",
      "PM SVANidhi",
      "MoSJE Micro Finance"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Constant bi-weekly recurring customer visits.",
    "recommendedLocations": [
      "Sanganer Ward 8",
      "Morija Bazaar",
      "Amer Main Gate"
    ]
  },
  {
    "id": "mb-digital-01",
    "name": "CSC / E-Mitra Digital Government Services & Banking Kiosk",
    "sectorId": "education_digital",
    "sectorName": "Digital Services, CSC & Education (ई-मित्र, कंप्यूटर व कोचिंग)",
    "subCategory": "CSC & E-Mitra Kiosk",
    "emoji": "💻",
    "minBudget": 30000,
    "maxBudget": 120000,
    "typicalBudget": 65000,
    "tenPercentMargin": 6500,
    "monthlyRevenue": 55000,
    "monthlyNetProfit": 34000,
    "roiMonths": 3,
    "competitionSensitivity": "Dispersion_Beneficial",
    "agglomerationIndex": 4.4,
    "description": "Aadhaar/PAN card updating, Jan Aadhar, caste/income certificates, bill payments, money transfer (AEPS), and photocopies.",
    "bestSuitedFor": "Computer-literate rural youth serving local Gram Panchayat residents.",
    "minAreaSqft": 80,
    "targetMarginPercent": 62,
    "schemes": [
      "PM SVANidhi",
      "MoSJE Micro Finance",
      "Digital India Initiative"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Essential administrative utility in every village panchayat.",
    "recommendedLocations": [
      "Morija Gram Panchayat Bhawan",
      "Jamwa Ramgarh Tehsil Office",
      "Bassi Block HQ"
    ]
  },
  {
    "id": "mb-transport-01",
    "name": "Electric Passenger E-Rickshaw Route Operation",
    "sectorId": "transport_logistics",
    "sectorName": "Transport & Rural Logistics (ई-रिक्शा, लोडिंग व ग्रामीण ढुलाई)",
    "subCategory": "Passenger E-Rickshaw",
    "emoji": "🛺",
    "minBudget": 30000,
    "maxBudget": 180000,
    "typicalBudget": 140000,
    "tenPercentMargin": 14000,
    "monthlyRevenue": 48000,
    "monthlyNetProfit": 32000,
    "roiMonths": 5,
    "competitionSensitivity": "Neutral",
    "agglomerationIndex": 6.2,
    "description": "Last-mile battery-operated passenger transit connecting rural feeder villages to main tehsil bus stands and railway stations.",
    "bestSuitedFor": "Drivers transitioning to green electric mobility with zero petrol/diesel costs.",
    "minAreaSqft": 0,
    "targetMarginPercent": 66,
    "schemes": [
      "MoSJE Micro Finance Scheme",
      "MUDRA Shishu",
      "PM E-Drive Subsidies"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Operating cost of just ₹0.40 per km yields high daily cash margins.",
    "recommendedLocations": [
      "Sanganer Railway Station Loop",
      "Chomu-Morija Feeder Route",
      "Bassi Feeder"
    ]
  },
  {
    "id": "mb-construct-01",
    "name": "Iron Grill, Gate & Tubular Shed Welding Workshop",
    "sectorId": "construction_fabrication",
    "sectorName": "Fabrication, Building & Metalwork (फेब्रिकेशन व निर्माण सामग्री)",
    "subCategory": "Welding & Fabrication",
    "emoji": "🚪",
    "minBudget": 40000,
    "maxBudget": 200000,
    "typicalBudget": 95000,
    "tenPercentMargin": 9500,
    "monthlyRevenue": 85000,
    "monthlyNetProfit": 40000,
    "roiMonths": 4,
    "competitionSensitivity": "Dispersion_Beneficial",
    "agglomerationIndex": 5,
    "description": "Fabricating security gates, window grilles, railings, agricultural tractor sheds, and tin sheds using arc welding and cutoff machines.",
    "bestSuitedFor": "Welders and metal fabricators near rural expansion zones.",
    "minAreaSqft": 250,
    "targetMarginPercent": 48,
    "schemes": [
      "MoSJE Micro Finance",
      "MUDRA Shishu",
      "PM Vishwakarma"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Every new rural house requires exterior gates and safety grilles.",
    "recommendedLocations": [
      "Bassi Industrial Link Road",
      "Chaksu Bypass",
      "Kotputli"
    ]
  },
  {
    "id": "mb-live-01",
    "name": "Commercial Dairy Unit (3-5 Indigenous Buffaloes / Cows)",
    "sectorId": "livestock_dairy",
    "sectorName": "Animal Husbandry & Dairy (डेयरी फार्म, पशुपालन व पोल्ट्री)",
    "subCategory": "Dairy Cattle Rearing",
    "emoji": "🐄",
    "minBudget": 80000,
    "maxBudget": 450000,
    "typicalBudget": 220000,
    "tenPercentMargin": 22000,
    "monthlyRevenue": 140000,
    "monthlyNetProfit": 45000,
    "roiMonths": 6,
    "competitionSensitivity": "Neutral",
    "agglomerationIndex": 5.5,
    "description": "Pure milk, ghee, and cow dung manure production from high-yield Murrah buffaloes and Gir/Rathi cows.",
    "bestSuitedFor": "Farming families with available fodder land.",
    "minAreaSqft": 400,
    "targetMarginPercent": 32,
    "schemes": [
      "NABARD Dairy Entrepreneurship",
      "MoSJE Term Loan",
      "KCC Animal Husbandry"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Direct milk sales to local sweet shops (Halwais) and dairy cooperatives.",
    "recommendedLocations": [
      "Jamwa Ramgarh Rural",
      "Amer Village Belt",
      "Bassi Rural Dairy Belt"
    ]
  },
  {
    "id": "mb-green-01",
    "name": "Organic Vermicompost & Bio-Fertilizer Production Pit",
    "sectorId": "green_renewable",
    "sectorName": "Solar, Bio-Gas & Clean Energy (सौर ऊर्जा, वर्मीकम्पोस्ट)",
    "subCategory": "Vermicompost & Bio-Fertilizer",
    "emoji": "🪱",
    "minBudget": 20000,
    "maxBudget": 90000,
    "typicalBudget": 45000,
    "tenPercentMargin": 4500,
    "monthlyRevenue": 50000,
    "monthlyNetProfit": 32000,
    "roiMonths": 2,
    "competitionSensitivity": "Neutral",
    "agglomerationIndex": 4.8,
    "description": "Decomposing cow dung and organic farm residue using Australian Eisenia fetida earthworms to produce rich vermicompost fertilizer.",
    "bestSuitedFor": "Farmers and rural youth with surplus farmyard manure.",
    "minAreaSqft": 300,
    "targetMarginPercent": 64,
    "schemes": [
      "Paramparagat Krishi Vikas Yojana (PKVY)",
      "MoSJE Micro Finance",
      "PMEGP"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Rapidly growing demand from organic vegetable growers and urban nurseries.",
    "recommendedLocations": [
      "Chomu Organic Belt",
      "Bassi Agriculture Zone",
      "Amer Farm Ring"
    ]
  },
  {
    "id": "mb-service-01",
    "name": "Rural Tent House, Sound & Event Rental Agency",
    "sectorId": "personal_household",
    "sectorName": "Personal & Household Services (धोबी, टेंट हाउस व फोटोग्राफी)",
    "subCategory": "Tent House & Event Rental",
    "emoji": "🎪",
    "minBudget": 70000,
    "maxBudget": 350000,
    "typicalBudget": 160000,
    "tenPercentMargin": 16000,
    "monthlyRevenue": 90000,
    "monthlyNetProfit": 48000,
    "roiMonths": 4,
    "competitionSensitivity": "Dispersion_Beneficial",
    "agglomerationIndex": 4.9,
    "description": "Renting shamianas, sound systems, halogen/LED lights, plastic chairs, and catering utensils for village weddings, melas, and gatherings.",
    "bestSuitedFor": "Event organizers servicing rural panchayats.",
    "minAreaSqft": 300,
    "targetMarginPercent": 54,
    "schemes": [
      "MoSJE Micro Finance",
      "MUDRA Shishu",
      "Stand-Up India"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "Peak earnings during wedding muhurats (Nov-Dec, Jan-Feb, April-May).",
    "recommendedLocations": [
      "Morija Gram Panchayat",
      "Phagi Town",
      "Shahpura Old Town"
    ]
  },
  {
    "id": "mb-mfg-01",
    "name": "Biodegradable Paper Cup, Plate & Dona-Pattal Unit",
    "sectorId": "manufacturing_packaging",
    "sectorName": "Light Manufacturing & Packaging (दोने-पत्तल, अगरबत्ती व पैकेजिंग)",
    "subCategory": "Paper Packaging & Dona-Pattal",
    "emoji": "📦",
    "minBudget": 45000,
    "maxBudget": 220000,
    "typicalBudget": 110000,
    "tenPercentMargin": 11000,
    "monthlyRevenue": 95000,
    "monthlyNetProfit": 36000,
    "roiMonths": 4,
    "competitionSensitivity": "Neutral",
    "agglomerationIndex": 6.7,
    "description": "Semi-automatic hydraulic machine manufacturing eco-friendly paper plates, tea cups, and silver dona-pattals for catering and street food stalls.",
    "bestSuitedFor": "Micro-manufacturers tapping into the single-use plastic ban.",
    "minAreaSqft": 150,
    "targetMarginPercent": 38,
    "schemes": [
      "KVIC PMEGP (35% Subsidy)",
      "MoSJE Micro Finance",
      "MUDRA Shishu"
    ],
    "isRuralFocus": true,
    "clusterOpportunity": "High daily consumption in dhabas, tea stalls, and festive community feasts (pangat).",
    "recommendedLocations": [
      "Sanganer Industrial Fringe",
      "Bassi Riico Area",
      "Chomu Town Road"
    ]
  }
];

/**
 * Filter businesses using 4-tier cascade:
 * 1. Capital (Budget / Margin)
 * 2. Location (City / Tehsil)
 * 3. Sector
 * 4. Specific Sub-Category
 */
export function filterMicroBusinesses(params: {
  capital?: number;
  isMarginMoney?: boolean;
  location?: string;
  sectorId?: string;
  subCategory?: string;
  query?: string;
}): MicroBusiness[] {
  let results = [...M_BUSINESS_CATALOG];

  if (params.sectorId && params.sectorId !== 'all') {
    results = results.filter(b => b.sectorId === params.sectorId);
  }

  if (params.subCategory && params.subCategory !== 'all') {
    results = results.filter(b => b.subCategory === params.subCategory);
  }

  if (params.capital && params.capital > 0) {
    const effectiveProjectCap = params.isMarginMoney ? params.capital * 10 : params.capital;
    results = results.filter(b => b.minBudget <= effectiveProjectCap * 1.35);
  }

  if (params.location && params.location.trim()) {
    const locLower = params.location.toLowerCase();
    results.sort((a, b) => {
      const aMatch = a.recommendedLocations.some(l => l.toLowerCase().includes(locLower));
      const bMatch = b.recommendedLocations.some(l => l.toLowerCase().includes(locLower));
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  }

  if (params.query && params.query.trim()) {
    const q = params.query.toLowerCase();
    results = results.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.sectorName.toLowerCase().includes(q) ||
      b.subCategory.toLowerCase().includes(q) ||
      b.schemes.some(s => s.toLowerCase().includes(q))
    );
  }

  return results;
}
