import { db, type Franchise } from '@/database';

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
    await new Promise(resolve => setTimeout(resolve, 300));
    return db.getFranchises(filter);
  },

  async submitInquiry(input: FranchiseInquiryInput): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      const existingRaw = localStorage.getItem('vyapar_franchise_inquiries');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const record = {
        ...input,
        id: `inquiry-${Date.now()}`,
        submittedAt: new Date().toISOString(),
      };
      localStorage.setItem('vyapar_franchise_inquiries', JSON.stringify([record, ...existing]));
    } catch (e) {
      console.warn('Could not save franchise inquiry to storage', e);
    }
    return {
      success: true,
      message: `Inquiry successfully submitted for ${input.preferredLocation}. The franchise expansion desk will review your application.`,
    };
  },
};

