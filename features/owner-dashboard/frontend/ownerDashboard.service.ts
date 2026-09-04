import {
  type StoreDashboardData,
  type RegisteredUser,
  getStoreDashboardData,
  saveStoreDashboardData,
  DEMO_ABHINAV,
} from '@/database/r_users';

export const ownerDashboardService = {
  getDashboardData(user?: RegisteredUser | null): StoreDashboardData {
    const targetUser = user || DEMO_ABHINAV;
    return getStoreDashboardData(targetUser);
  },
  saveDashboardData(key: string, data: StoreDashboardData): void {
    saveStoreDashboardData(key, data);
  },
};

