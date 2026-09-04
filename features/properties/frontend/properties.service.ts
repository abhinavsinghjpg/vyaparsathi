import { db, type CommercialProperty } from '@/database';

export interface TourBookingInput {
  propertyId: string;
  name: string;
  phone: string;
  preferredDate: string;
  notes?: string;
}

export const propertiesService = {
  async getProperties(filter?: { city?: string; type?: string; maxRent?: number }): Promise<CommercialProperty[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return db.getProperties(filter);
  },

  async bookTour(input: TourBookingInput): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      success: true,
      message: `Tour scheduled for ${input.preferredDate}. Property manager will connect via ${input.phone}.`,
    };
  },
};

