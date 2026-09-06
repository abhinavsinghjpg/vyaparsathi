import { sqlVault, type VyaparLoanApplication } from '@/system/database/sqlVault';

export const loansDb = {
  getApplications(): VyaparLoanApplication[] {
    return sqlVault.getLoanApplications();
  },

  createApplication(data: Omit<VyaparLoanApplication, 'id' | 'status' | 'submittedAt'>): VyaparLoanApplication {
    return sqlVault.insertLoanApplication(data);
  },
};
