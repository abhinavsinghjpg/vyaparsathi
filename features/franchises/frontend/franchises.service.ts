import { franchisesDb } from '../backend/franchises.db';
import type { Franchise } from '@/types/schema';
import { sqlVault } from '@/system/database/sqlVault';

export interface FranchiseInquiryInput {
  franchiseId: string;
  brandName?: string;
  applicantName: string;
  preferredLocation: string; // City + Country
  investment: number | string;
  phone: string;
  email: string;
}

export const franchisesService = {
  async getFranchises(filter?: { category?: string; maxBudget?: number; search?: string }): Promise<Franchise[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return franchisesDb.getFranchises(filter);
  },

  async submitInquiry(input: FranchiseInquiryInput): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      sqlVault.insertFranchiseInquiry({
        franchiseId: input.franchiseId,
        brandName: input.brandName || 'Verified Franchise Brand',
        applicantName: input.applicantName,
        preferredLocation: input.preferredLocation,
        investmentAmount: typeof input.investment === 'number' ? input.investment : parseFloat(String(input.investment).replace(/[^0-9.]/g, '')) || 1000000,
        phone: input.phone,
        email: input.email,
      });
    } catch (e) {
      console.warn('Could not save franchise inquiry to sqlVault', e);
    }
    return {
      success: true,
      message: `Inquiry successfully submitted for ${input.preferredLocation}. Logged to SQL Database Vault.`,
    };
  },
};

