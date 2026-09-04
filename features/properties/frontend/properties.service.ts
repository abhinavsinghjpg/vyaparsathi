import { propertiesDb } from '../backend/properties.db';
import type { CommercialProperty } from '@/types/schema';

export interface TourBookingInput {
  propertyId: string;
  name: string;
  phone: string;
  preferredDate: string;
  notes?: string;
}

export const propertiesService = {
  async getProperties(filter?: { city?: string; type?: string; maxRent?: number }): Promise<CommercialProperty[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    let list = propertiesDb.getProperties();
    if (filter?.city && filter.city.toLowerCase() !== 'all') {
      list = list.filter(p => p.city.toLowerCase().includes(filter.city!.toLowerCase()));
    }
    if (filter?.type && filter.type.toLowerCase() !== 'all') {
      list = list.filter(p => p.type.toLowerCase() === filter.type!.toLowerCase());
    }
    if (filter?.maxRent) {
      list = list.filter(p => p.monthlyRent <= filter.maxRent!);
    }
    return list;
  },

  async bookTour(input: TourBookingInput): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      success: true,
      message: `Tour scheduled for ${input.preferredDate}. Property manager will connect via ${input.phone}.`,
    };
  },
};

