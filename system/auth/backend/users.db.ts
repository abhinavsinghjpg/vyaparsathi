import { sqlVault } from '@/system/database/sqlVault';

export interface UserBusiness {
  businessName: string;
  businessType: string;
  location: string;
  city: string;
  ownerName: string;
  businessEmail: string;
  businessPhone: string;
  landAreaSqft?: number;
  avgDailyFootfall?: number;
  isVerified: boolean;
  registeredMode: 'existing' | 'new'; // 5a = existing, 5b = new
  registeredAt?: string;
}

export interface RegisteredUser {
  id: string; // 6-digit formatted user ID e.g. '000001'
  name: string;
  phone: string;
  email: string;
  password?: string;
  otpDelivery: 'SMS' | 'Email';
  defaultOtp: string;
  business?: UserBusiness;
  createdAt: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface WalkInSeries {
  hours24: { label: string; patrons: number }[];
  days7: { label: string; patrons: number }[];
  days30: { label: string; patrons: number }[];
}

export interface StoreDashboardData {
  storageKey: string;
  isVerified: boolean;
  businessName: string;
  businessType: string;
  location: string;
  city: string;
  ownerName: string;
  businessEmail: string;
  businessPhone: string;
  landAreaSqft: number;
  monthlyRevenue: number;
  monthlyRent: number;
  dailyFootfall: number;
  conversionRate: number;
  rentToRevenueRatio: number;
  walkInTrends: WalkInSeries;
  reviews: CustomerReview[];
  predictiveInsights: string[];
  nearbyCompetitors: {
    name: string;
    distanceMeters: number;
    footfallShare: number;
  }[];
}

// ---------------------------------------------------------------------------
// Pre-populated Demo User: Abhinav Choudhary (ID: 000001)
// ---------------------------------------------------------------------------
export const DEMO_ABHINAV: RegisteredUser = {
  id: '000001',
  name: 'Abhinav Choudhary',
  phone: '9999999999',
  email: 'Abhinav@gmail.com',
  password: 'Abhinav@123',
  otpDelivery: 'Email',
  defaultOtp: '111111',
  createdAt: '2026-01-15T10:00:00.000Z',
  business: {
    businessName: 'Atrix',
    businessType: 'Cafe',
    location: 'C-scheme, Jaipur, Raj',
    city: 'Jaipur',
    ownerName: 'Abhinav Choudhary',
    businessEmail: 'business@atrixcafe.in',
    businessPhone: '9999999999',
    landAreaSqft: 650,
    avgDailyFootfall: 520,
    isVerified: true,
    registeredMode: 'existing',
    registeredAt: '2026-01-16T12:00:00.000Z',
  },
};

// ---------------------------------------------------------------------------
// 6a: Verified Data for 000001_Abhinav (Atrix Cafe in C-scheme, Jaipur)
// ---------------------------------------------------------------------------
export const DEMO_ABHINAV_DASHBOARD: StoreDashboardData = {
  storageKey: '000001_Abhinav',
  isVerified: true,
  businessName: 'Atrix',
  businessType: 'Cafe',
  location: 'C-scheme, Jaipur, Raj',
  city: 'Jaipur',
  ownerName: 'Abhinav Choudhary',
  businessEmail: 'business@atrixcafe.in',
  businessPhone: '9999999999',
  landAreaSqft: 650,
  monthlyRevenue: 485000,
  monthlyRent: 62000,
  dailyFootfall: 520,
  conversionRate: 38.5,
  rentToRevenueRatio: 12.8,
  walkInTrends: {
    hours24: [
      { label: '8 AM', patrons: 28 },
      { label: '10 AM', patrons: 74 },
      { label: '12 PM', patrons: 96 },
      { label: '2 PM', patrons: 65 },
      { label: '4 PM', patrons: 88 },
      { label: '6 PM', patrons: 142 },
      { label: '8 PM', patrons: 168 },
      { label: '10 PM', patrons: 82 },
    ],
    days7: [
      { label: 'Mon', patrons: 460 },
      { label: 'Tue', patrons: 485 },
      { label: 'Wed', patrons: 510 },
      { label: 'Thu', patrons: 495 },
      { label: 'Fri', patrons: 610 },
      { label: 'Sat', patrons: 720 },
      { label: 'Sun', patrons: 680 },
    ],
    days30: [
      { label: 'Week 1', patrons: 3450 },
      { label: 'Week 2', patrons: 3620 },
      { label: 'Week 3', patrons: 3810 },
      { label: 'Week 4', patrons: 4120 },
    ],
  },
  reviews: [
    {
      id: 'rev-1',
      author: 'Rohit Khandelwal',
      rating: 5,
      date: 'Yesterday',
      comment: 'Top tier cold brew and artisanal sourdough toast. Ambiance in C-scheme is unmatched!',
      sentiment: 'positive',
    },
    {
      id: 'rev-2',
      author: 'Pooja Sharma',
      rating: 5,
      date: '3 days ago',
      comment: 'Vibrant crowd on weekend evenings. Great WiFi speed for remote working patrons.',
      sentiment: 'positive',
    },
    {
      id: 'rev-3',
      author: 'Ananya Rathore',
      rating: 4,
      date: '1 week ago',
      comment: 'Excellent matcha latte. Outdoor garden seating gets packed after 6 PM.',
      sentiment: 'positive',
    },
    {
      id: 'rev-4',
      author: 'Vikash Jain',
      rating: 4,
      date: '2 weeks ago',
      comment: 'Solid coffee bar experience. Valet parking on Ashok Marg was smooth.',
      sentiment: 'neutral',
    },
  ],
  predictiveInsights: [
    'Peak surge window shifted from 6 PM to 8:30 PM due to seasonal evening footfall in C-scheme.',
    'Conversion rate rose +2.1% following introduction of takeaway artisanal bakery items.',
    'Customer repeat visitation index stands at 42%, outperforming regional category benchmark by 11%.',
  ],
  nearbyCompetitors: [
    { name: 'Curious Life Coffee Roasters (250m)', distanceMeters: 250, footfallShare: 31 },
    { name: 'Town Coffee C-Scheme (400m)', distanceMeters: 400, footfallShare: 26 },
    { name: 'Roastery Coffee House (650m)', distanceMeters: 650, footfallShare: 24 },
    { name: 'Local Chai Tapri Hub (120m)', distanceMeters: 120, footfallShare: 19 },
  ],
};

// ---------------------------------------------------------------------------
// LocalStorage Persistence Helpers
// ---------------------------------------------------------------------------
const USERS_STORAGE_KEY = 'vyapar_registered_users';

export function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === 'undefined') return [DEMO_ABHINAV];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEMO_ABHINAV]));
      if (!localStorage.getItem('000001_Abhinav')) {
        localStorage.setItem('000001_Abhinav', JSON.stringify(DEMO_ABHINAV_DASHBOARD));
      }
      return [DEMO_ABHINAV];
    }
    const users: RegisteredUser[] = JSON.parse(raw);
    if (!users.some(u => u.id === '000001')) {
      users.unshift(DEMO_ABHINAV);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
    if (!localStorage.getItem('000001_Abhinav')) {
      localStorage.setItem('000001_Abhinav', JSON.stringify(DEMO_ABHINAV_DASHBOARD));
    }
    return users;
  } catch (err) {
    console.error('Failed to load registered users:', err);
    return [DEMO_ABHINAV];
  }
}

export function saveRegisteredUsers(users: RegisteredUser[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save registered users:', err);
  }
}

export function findUserByIdentifier(identifier: string): RegisteredUser | undefined {
  const clean = identifier.trim().toLowerCase();
  const users = getRegisteredUsers();
  return users.find(
    u =>
      u.email.toLowerCase() === clean ||
      u.phone === clean ||
      u.id === clean
  );
}

export function generateNextUserId(): string {
  const users = getRegisteredUsers();
  let maxId = 1;
  users.forEach(u => {
    const num = parseInt(u.id, 10);
    if (!isNaN(num) && num >= maxId) {
      maxId = num + 1;
    }
  });
  return String(maxId).padStart(6, '0');
}

export function saveUser(user: RegisteredUser): RegisteredUser {
  const users = getRegisteredUsers();
  const index = users.findIndex(u => u.id === user.id);
  const isNew = index < 0;
  if (!isNew) {
    users[index] = user;
  } else {
    users.push(user);
    try {
      sqlVault.recordUserRegistration(user);
    } catch (e) {
      console.warn('[SQL Vault] User registration record error:', e);
    }
  }
  if (user.business) {
    try {
      sqlVault.recordBusinessRegistration({
        userId: user.id,
        businessName: user.business.businessName,
        businessType: user.business.businessType,
        location: user.business.location,
        city: user.business.city,
        ownerName: user.business.ownerName,
        businessEmail: user.business.businessEmail,
        businessPhone: user.business.businessPhone,
        landAreaSqft: user.business.landAreaSqft,
        registeredMode: user.business.registeredMode,
      } as any);
    } catch (e) {
      console.warn('[SQL Vault] Business registration record error:', e);
    }
  }
  saveRegisteredUsers(users);
  return user;
}

// ---------------------------------------------------------------------------
// Dashboard Storage Generator (6a vs 6b)
// ---------------------------------------------------------------------------

export function getDashboardStorageKey(user: RegisteredUser, isVerified: boolean): string {
  if (isVerified) {
    const firstName = user.name.trim().split(/\s+/)[0] || 'User';
    return `${user.id}_${firstName}`;
  }
  return `${user.id}_dashboard`;
}

export function getStoreDashboardData(user: RegisteredUser): StoreDashboardData {
  const biz = user.business;
  const isVerified = Boolean(biz?.isVerified);
  const storageKey = getDashboardStorageKey(user, isVerified);

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read dashboard from storage:', e);
    }
  }

  if (user.id === '000001' && isVerified) {
    return DEMO_ABHINAV_DASHBOARD;
  }

  const businessName = biz?.businessName || 'My Store';
  const businessType = biz?.businessType || 'Retail Outlet';
  const location = biz?.location || 'Main High Street';
  const city = biz?.city || 'Jaipur';
  const ownerName = biz?.ownerName || user.name;
  const area = biz?.landAreaSqft || 450;
  const dailyFootfall = biz?.avgDailyFootfall || (isVerified ? 380 : 260);

  const avgSpend = 250;
  const convRate = isVerified ? 34.2 : 28.5;
  const estMonthlyRev = Math.round(dailyFootfall * (convRate / 100) * avgSpend * 30);
  const estMonthlyRent = Math.round(area * 95);

  const data: StoreDashboardData = {
    storageKey,
    isVerified,
    businessName,
    businessType,
    location,
    city,
    ownerName,
    businessEmail: biz?.businessEmail || user.email,
    businessPhone: biz?.businessPhone || user.phone,
    landAreaSqft: area,
    monthlyRevenue: estMonthlyRev,
    monthlyRent: estMonthlyRent,
    dailyFootfall,
    conversionRate: convRate,
    rentToRevenueRatio: Number(((estMonthlyRent / estMonthlyRev) * 100).toFixed(1)),
    walkInTrends: {
      hours24: [
        { label: '8 AM', patrons: Math.round(dailyFootfall * 0.05) },
        { label: '10 AM', patrons: Math.round(dailyFootfall * 0.12) },
        { label: '12 PM', patrons: Math.round(dailyFootfall * 0.18) },
        { label: '2 PM', patrons: Math.round(dailyFootfall * 0.14) },
        { label: '4 PM', patrons: Math.round(dailyFootfall * 0.16) },
        { label: '6 PM', patrons: Math.round(dailyFootfall * 0.22) },
        { label: '8 PM', patrons: Math.round(dailyFootfall * 0.26) },
        { label: '10 PM', patrons: Math.round(dailyFootfall * 0.10) },
      ],
      days7: [
        { label: 'Mon', patrons: Math.round(dailyFootfall * 0.88) },
        { label: 'Tue', patrons: Math.round(dailyFootfall * 0.92) },
        { label: 'Wed', patrons: Math.round(dailyFootfall * 0.96) },
        { label: 'Thu', patrons: Math.round(dailyFootfall * 0.94) },
        { label: 'Fri', patrons: Math.round(dailyFootfall * 1.15) },
        { label: 'Sat', patrons: Math.round(dailyFootfall * 1.35) },
        { label: 'Sun', patrons: Math.round(dailyFootfall * 1.25) },
      ],
      days30: [
        { label: 'Week 1', patrons: Math.round(dailyFootfall * 6.5) },
        { label: 'Week 2', patrons: Math.round(dailyFootfall * 6.8) },
        { label: 'Week 3', patrons: Math.round(dailyFootfall * 7.1) },
        { label: 'Week 4', patrons: Math.round(dailyFootfall * 7.4) },
      ],
    },
    reviews: isVerified
      ? [
          {
            id: 'rev-gen-1',
            author: 'Local Patron',
            rating: 5,
            date: '2 days ago',
            comment: 'Consistent quality and courteous staff. Highly recommended in this pocket.',
            sentiment: 'positive',
          },
          {
            id: 'rev-gen-2',
            author: 'Verified Customer',
            rating: 4,
            date: '1 week ago',
            comment: 'Good storefront visibility and fast service turnaround.',
            sentiment: 'positive',
          },
        ]
      : [
          {
            id: 'rev-unv-1',
            author: 'VyaparMap Scout',
            rating: 4,
            date: 'Recent Assessment',
            comment: 'Corridor audit: Promising pedestrian stream with high commercial conversion potential.',
            sentiment: 'positive',
          },
        ],
    predictiveInsights: isVerified
      ? [
          `Verified store telemetry active: sensor accuracy 98.4%.`,
          `Daily footfall of ${dailyFootfall} walk-ins is benchmarked in top 15% for ${location}.`,
          `Rent-to-revenue load is balanced and healthy.`,
        ]
      : [
          `Estimated metrics based on owner self-reported profile and corridor intelligence.`,
          `Projected potential revenue: up to ₹${estMonthlyRev.toLocaleString('en-IN')}/mo once verified.`,
          `Submit store electricity/GST invoice to unlock certified sensor verification.`,
        ],
    nearbyCompetitors: [
      { name: 'Market Competitor A', distanceMeters: 180, footfallShare: 30 },
      { name: 'Market Competitor B', distanceMeters: 320, footfallShare: 25 },
      { name: 'Independent Local Shop', distanceMeters: 90, footfallShare: 18 },
    ],
  };

  saveStoreDashboardData(storageKey, data);
  return data;
}

export function saveStoreDashboardData(storageKey: string, data: StoreDashboardData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save dashboard data to ${storageKey}:`, err);
  }
}
