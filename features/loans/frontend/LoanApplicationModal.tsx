import { useState } from 'react';
import { CheckCircle2, Landmark, Wallet, Percent, Calendar, Send, ShieldCheck, MapPin } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { formatCurrency } from '@/components/utils';
import { loansService, type LoanStructuringOutput } from './loans.service';

interface LoanApplicationModalProps {
  structure: LoanStructuringOutput | null;
  isOpen: boolean;
  onClose: () => void;
}

const RURAL_CATEGORIES = [
  'Dairy & Cattle Farming',
  'Agro-Processing & Flour/Dal Mill',
  'Handloom, Khadi & Rural Textiles',
  'Poultry & Livestock Rearing',
  'Rural Kirana & FMCG Retail Store',
  'Two-Wheeler & Agricultural Machinery Repair',
  'Pottery, Terracotta & Handicrafts',
  'Solar Irrigation & Pump Maintenance',
  'Rural Bakery & Sweet Making Unit',
  'Catering & Mobile Food Van',
];

export function LoanApplicationModal({ structure, isOpen, onClose }: LoanApplicationModalProps) {
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [villageBlock, setVillageBlock] = useState('Chomu Block, Gram Panchayat Morija');
  const [businessCategory, setBusinessCategory] = useState(RURAL_CATEGORIES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  if (!structure) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 450));

    try {
      const record = loansService.submitApplication({
        applicantName,
        phone,
        email,
        villageOrBlock: villageBlock,
        businessCategory,
        marginAmount: structure.availableMargin,
        projectCost: structure.totalProjectCost,
        loanAmount: structure.eligibleLoanAmount,
        schemeTier: structure.scheme.code,
        interestRate: structure.scheme.interestRatePerAnnum,
        tenureYears: structure.scheme.tenureYears,
        moratoriumMonths: structure.scheme.moratoriumMonths,
        quarterlyInstallment: structure.quarterlyInstallment,
        fundingAgency: structure.scheme.primaryAgency,
      });
      setApplicationId(record.id);
    } catch (err) {
      console.error('[LoanApplicationModal] Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setApplicationId(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={applicationId ? 'Application Registered' : `Concessional Loan Onboarding (MoSJE)`}
      description={
        applicationId
          ? 'Beneficiary pre-qualification record synchronized to relational database.'
          : `${structure.scheme.title} (${structure.scheme.hindiTitle}) — 10% Margin Money Track`
      }
      size="lg"
    >
      {applicationId ? (
        <div className="py-6 text-center space-y-4 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 size={32} />
          </div>

          <div className="space-y-1.5">
            <h4 className="text-base font-bold text-foreground">
              Pre-Qualification Docket Generated
            </h4>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              Application Docket ID:{' '}
              <strong className="text-gold-400 font-mono font-bold">{applicationId}</strong>. 
              The application has been logged to the <strong className="text-foreground">vyapar_loan_applications</strong> table in our live SQL Database Vault.
            </p>
          </div>

          {/* Dossier Card */}
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 text-xs max-w-md mx-auto space-y-2 text-left font-mono">
            <div className="flex justify-between border-b border-border/60 pb-1.5">
              <span className="text-muted-foreground">Beneficiary Name:</span>
              <span className="text-foreground font-sans font-bold">{applicantName}</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-1.5">
              <span className="text-muted-foreground">Gram Panchayat / Block:</span>
              <span className="text-foreground font-sans">{villageBlock}</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-1.5">
              <span className="text-muted-foreground">10% Margin Contribution:</span>
              <span className="text-blue-400 font-bold">{formatCurrency(structure.availableMargin)}</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-1.5">
              <span className="text-muted-foreground">Sanctioned 90% Loan:</span>
              <span className="text-emerald-400 font-bold">{formatCurrency(structure.eligibleLoanAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Concessional Rate & Tenure:</span>
              <span className="text-gold-400 font-bold">{structure.scheme.interestRatePerAnnum}% p.a. / {structure.scheme.tenureYears} Yrs</span>
            </div>
          </div>

          <Button variant="gold" size="md" onClick={handleClose} className="mt-3 font-bold">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1 text-xs">
          {/* Credit Structure Overview */}
          <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1.5 text-sm">
                <Landmark size={15} className="text-gold-400" />
                <span>{structure.scheme.title}</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gold-500/20 text-gold-300 border border-gold-500/30">
                {structure.scheme.interestRatePerAnnum}% p.a.
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-background/60 border border-border/60">
                <div className="text-[9px] text-muted-foreground uppercase">10% Margin</div>
                <div className="font-bold text-blue-400 mt-0.5">{formatCurrency(structure.availableMargin)}</div>
              </div>
              <div className="p-2 rounded-lg bg-background/60 border border-border/60">
                <div className="text-[9px] text-muted-foreground uppercase">Project Cost</div>
                <div className="font-bold text-foreground mt-0.5">{formatCurrency(structure.totalProjectCost)}</div>
              </div>
              <div className="p-2 rounded-lg bg-background/60 border border-border/60">
                <div className="text-[9px] text-muted-foreground uppercase">90% Loan Assistance</div>
                <div className="font-bold text-emerald-400 mt-0.5">{formatCurrency(structure.eligibleLoanAmount)}</div>
              </div>
            </div>
          </div>

          {/* Beneficiary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">Beneficiary / Founder Name *</label>
              <Input
                required
                placeholder="e.g. Sunita Devi Meghwal"
                value={applicantName}
                onChange={e => setApplicantName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">Mobile Phone Number *</label>
              <Input
                required
                type="tel"
                placeholder="e.g. 9414056789"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">Email Address (Optional)</label>
              <Input
                type="email"
                placeholder="e.g. sunita@gramin.org"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">Village / Gram Panchayat / Block *</label>
              <Input
                required
                placeholder="e.g. Morija, Chomu Block, Jaipur"
                value={villageBlock}
                onChange={e => setVillageBlock(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground">Proposed Rural Business Activity *</label>
            <select
              value={businessCategory}
              onChange={e => setBusinessCategory(e.target.value)}
              className="w-full p-2 text-xs rounded-xl bg-background border border-border/80 text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400 font-medium"
            >
              {RURAL_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Moratorium & Agency Info Notice */}
          <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 text-[11px] text-muted-foreground space-y-1">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Moratorium Protection & Repayment Frequency</span>
            </div>
            <div>
              Includes a <strong className="text-gold-400">{structure.scheme.moratoriumMonths}-Month Grace Moratorium</strong> during which no principal installment is levied. Subsequent repayment is billed quarterly ({structure.scheme.repaymentFrequency}) over {structure.scheme.tenureYears} years.
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/60">
            <Button variant="ghost" size="sm" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="gold" size="sm" type="submit" disabled={submitting} className="gap-1.5 font-bold">
              <Send size={13} />
              <span>{submitting ? 'Processing Application...' : 'Apply on VyaparMap'}</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
