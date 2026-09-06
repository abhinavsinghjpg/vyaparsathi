import { MOSJE_SCHEMES, type SchemeTierConfig } from '../backend/loans.config';
import { loansDb } from '../backend/loans.db';
import type { VyaparLoanApplication } from '@/system/database/sqlVault';

export interface LoanStructuringOutput {
  availableMargin: number;
  totalProjectCost: number;
  eligibleLoanAmount: number;
  scheme: SchemeTierConfig;
  monthlyEmiPostMoratorium: number;
  quarterlyInstallment: number;
  totalInterestPayable: number;
  totalRepaymentAmount: number;
  workingCapitalAllocation: number; // 40%
  capexEquipmentAllocation: number; // 60%
  moratoriumDetails: {
    months: number;
    description: string;
    moratoriumInterestOnlyQuarterly: number;
  };
  repaymentQuarters: {
    quarterNumber: number;
    quarterLabel: string;
    isMoratorium: boolean;
    principalPayment: number;
    interestPayment: number;
    totalInstallment: number;
    remainingBalance: number;
  }[];
}

export const loansService = {
  calculateStructure(marginInput: number): LoanStructuringOutput {
    // 10% Margin Money -> Total Project Cost = Margin / 0.10
    const margin = Math.max(1000, Number(marginInput) || 10000);
    const totalProjectCost = Math.round(margin / 0.10);

    // Auto-select Scheme Tier based on Project Cost
    // Logic A: <= 1.40 Lakh -> Micro Finance Scheme (6.5%, 3-yr, 3-mo moratorium)
    // Logic B: > 1.40 Lakh and <= 50 Lakh -> Term Loan Scheme (8%, 7-yr, 6-mo moratorium)
    // Logic C: > 50 Lakh and <= 2 Crore -> VyaparMap Institutional Bank Syndicate (8.75%, 7-yr, 6-mo moratorium)
    let scheme: SchemeTierConfig;
    if (totalProjectCost <= MOSJE_SCHEMES.MICRO_FINANCE.maxProjectCost) {
      scheme = MOSJE_SCHEMES.MICRO_FINANCE;
    } else if (totalProjectCost <= MOSJE_SCHEMES.TERM_LOAN.maxProjectCost) {
      scheme = MOSJE_SCHEMES.TERM_LOAN;
    } else {
      scheme = MOSJE_SCHEMES.VYAPAR_BANK_SYNDICATE;
    }

    // Up to 90% concessional loan capped by scheme maximum
    const rawLoan = totalProjectCost * 0.90;
    const eligibleLoanAmount = Math.min(rawLoan, scheme.maxLoanAmount);

    // Capital vs Working capital split (60% Capex / Plant & Machinery, 40% Working Capital / Raw Materials)
    const capexEquipmentAllocation = Math.round(totalProjectCost * 0.60);
    const workingCapitalAllocation = Math.round(totalProjectCost * 0.40);

    // Moratorium and Repayment Math
    // Micro Finance: 3 years total (12 quarters), 3 months (1 quarter) moratorium -> 11 repayment quarters
    // Term Loan: 7 years total (28 quarters), 6 months (2 quarters) moratorium -> 26 repayment quarters
    const totalQuarters = scheme.tenureYears * 4;
    const moratoriumQuarters = scheme.moratoriumMonths / 3;
    const repaymentQuartersCount = totalQuarters - moratoriumQuarters;

    const annualRate = scheme.interestRatePerAnnum / 100;
    const quarterlyRate = annualRate / 4;

    // Standard reducing balance quarterly installment formula:
    // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    const quarterlyInstallment = Math.round(
      (eligibleLoanAmount * quarterlyRate * Math.pow(1 + quarterlyRate, repaymentQuartersCount)) /
        (Math.pow(1 + quarterlyRate, repaymentQuartersCount) - 1)
    );

    const monthlyEmiPostMoratorium = Math.round(quarterlyInstallment / 3);

    // Generate schedule
    let remaining = eligibleLoanAmount;
    let totalInterest = 0;
    const schedule: LoanStructuringOutput['repaymentQuarters'] = [];

    // Moratorium interest
    const moratoriumInterestOnlyQuarterly = Math.round(eligibleLoanAmount * quarterlyRate);

    for (let q = 1; q <= totalQuarters; q++) {
      const isMoratorium = q <= moratoriumQuarters;
      if (isMoratorium) {
        // Moratorium grace period: only simple interest or grace
        const interest = Math.round(remaining * quarterlyRate);
        totalInterest += interest;
        schedule.push({
          quarterNumber: q,
          quarterLabel: `Q${q} (Moratorium Grace Period)`,
          isMoratorium: true,
          principalPayment: 0,
          interestPayment: interest,
          totalInstallment: interest,
          remainingBalance: remaining,
        });
      } else {
        const interest = Math.round(remaining * quarterlyRate);
        const principal = Math.min(remaining, quarterlyInstallment - interest);
        remaining = Math.max(0, remaining - principal);
        totalInterest += interest;
        schedule.push({
          quarterNumber: q,
          quarterLabel: `Q${q} (Active Amortization)`,
          isMoratorium: false,
          principalPayment: principal,
          interestPayment: interest,
          totalInstallment: principal + interest,
          remainingBalance: remaining,
        });
      }
    }

    return {
      availableMargin: margin,
      totalProjectCost,
      eligibleLoanAmount,
      scheme,
      monthlyEmiPostMoratorium,
      quarterlyInstallment,
      totalInterestPayable: totalInterest,
      totalRepaymentAmount: eligibleLoanAmount + totalInterest,
      workingCapitalAllocation,
      capexEquipmentAllocation,
      moratoriumDetails: {
        months: scheme.moratoriumMonths,
        description: `${scheme.moratoriumMonths} Months Grace Period during setup & commercial stabilization. Principal repayment starts from Quarter ${moratoriumQuarters + 1}.`,
        moratoriumInterestOnlyQuarterly,
      },
      repaymentQuarters: schedule,
    };
  },

  submitApplication(data: {
    applicantName: string;
    phone: string;
    email: string;
    villageOrBlock: string;
    businessCategory: string;
    marginAmount: number;
    projectCost: number;
    loanAmount: number;
    schemeTier: 'MICRO_FINANCE' | 'TERM_LOAN' | 'VYAPAR_BANK_SYNDICATE';
    interestRate: number;
    tenureYears: number;
    moratoriumMonths: number;
    quarterlyInstallment: number;
    fundingAgency: string;
  }): VyaparLoanApplication {
    return loansDb.createApplication(data);
  },
};
