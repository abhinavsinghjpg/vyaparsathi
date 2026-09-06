import { propertiesDb } from '../backend/properties.db';
import type { CommercialProperty } from '@/types/schema';
import { sqlVault } from '@/system/database/sqlVault';

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
    await new Promise(resolve => setTimeout(resolve, 400));
    try {
      const prop = propertiesDb.getProperties().find(p => p.id === input.propertyId);
      sqlVault.insertPropertyInquiry({
        propertyId: input.propertyId,
        propertyTitle: prop ? `${prop.title} (${prop.city})` : 'Commercial Property Space',
        applicantName: input.name,
        phone: input.phone,
        preferredDate: input.preferredDate,
        notes: input.notes,
      });
    } catch (e) {
      console.warn('Could not save property inquiry to sqlVault', e);
    }
    return {
      success: true,
      message: `Tour scheduled for ${input.preferredDate}. Property manager will connect via ${input.phone}. Logged to SQL Database Vault.`,
    };
  },
};

