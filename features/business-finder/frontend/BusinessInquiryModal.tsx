import { useState } from 'react';
import { CheckCircle2, Building2, Wallet, Landmark, Phone, Mail, MapPin, Send, ArrowRight } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { sqlVault } from '@/system/database/sqlVault';
import { formatCurrency } from '@/components/utils';
import type { BusinessFinderOutput } from './businessFinder.service';

interface BusinessInquiryModalProps {
  biz: BusinessFinderOutput | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BusinessInquiryModal({ biz, isOpen, onClose }: BusinessInquiryModalProps) {
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('Chomu Block, Jaipur Rural');
  const [marginMoney, setMarginMoney] = useState<number>(() => (biz ? Math.round(biz.startupCost * 0.10) : 25000));
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  if (!biz) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 400));

    try {
      const record = sqlVault.insertBusinessInquiry({
        businessName: biz.name,
        category: biz.category || 'Retail & Micro-Enterprise',
        applicantName,
        phone,
        email,
        targetLocation: location,
        availableMargin: marginMoney,
        estimatedProjectCost: biz.startupCost,
        schemePreference: biz.sourceBadge || 'MoSJE Concessional Credit & PMEGP',
        notes,
      });
      setSubmittedId(record.id);
    } catch (err) {
      console.error('[BusinessInquiryModal] submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmittedId(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={submittedId ? 'Application Dispatched' : `Apply & Onboard: ${biz.name}`}
      description={
        submittedId
          ? 'Your micro-enterprise onboarding dossier is registered in VyaparMap SQL Vault.'
          : 'Submit your venture onboarding details for local feasibility review & MoSJE scheme structuring.'
      }
      size="lg"
    >
      {submittedId ? (
        <div className="py-6 text-center space-y-4 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 size={32} />
          </div>

          <div className="space-y-1.5">
            <h4 className="text-base font-bold text-foreground">
              Venture Onboarding Logged: {biz.name}
            </h4>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              Your inquiry has been recorded with Reference ID{' '}
              <strong className="text-gold-400 font-mono font-bold">{submittedId}</strong> for{' '}
              <strong className="text-foreground">{location}</strong>. 
              The entry has been synchronized to the relational SQL Database Vault.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/80 text-xs font-mono max-w-sm mx-auto text-left space-y-1">
            <div className="flex justify-between text-muted-foreground">
              <span>Proposed Project Cost:</span>
              <span className="text-foreground font-bold">{formatCurrency(biz.startupCost)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Committed Margin (10%):</span>
              <span className="text-blue-400 font-bold">{formatCurrency(marginMoney)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Eligible 90% Credit:</span>
              <span className="text-emerald-400 font-bold">{formatCurrency(Math.round(biz.startupCost * 0.9))}</span>
            </div>
          </div>

          <Button variant="gold" size="md" onClick={handleClose} className="mt-3">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1 text-xs">
          {/* Business Summary Banner */}
          <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/25 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-1.5 rounded-lg bg-background/80">{biz.emoji}</span>
              <div>
                <div className="font-bold text-foreground text-sm">{biz.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  Startup: <strong className="text-blue-400 font-mono">{formatCurrency(biz.startupCost)}</strong> | Payback:{' '}
                  <strong className="text-purple-400 font-mono">{biz.roiMonths} Mo</strong>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                10% Margin: {formatCurrency(Math.round(biz.startupCost * 0.1))}
              </span>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">Applicant Full Name *</label>
              <Input
                required
                placeholder="e.g. Ramesh Chandra Verma"
                value={applicantName}
                onChange={e => setApplicantName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">Mobile Phone (WhatsApp) *</label>
              <Input
                required
                type="tel"
                placeholder="e.g. 9829012345"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">Email Address *</label>
              <Input
                required
                type="email"
                placeholder="e.g. ramesh@gramin.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">Village / Gram Panchayat / Block *</label>
              <Input
                required
                placeholder="e.g. Morija, Chomu Block, Jaipur"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">
                Available 10% Margin Money (₹) *
              </label>
              <Input
                required
                type="number"
                min={5000}
                max={5000000}
                value={marginMoney}
                onChange={e => setMarginMoney(Number(e.target.value))}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">Target Scheme Track</label>
              <div className="p-2 rounded-xl bg-muted/30 border border-border/80 text-[11px] font-mono text-gold-400 flex items-center justify-between">
                <span>{biz.startupCost <= 140000 ? 'Micro Finance Scheme (6.5%)' : 'Term Loan Scheme (8.0%)'}</span>
                <Landmark size={13} className="text-gold-400" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground">Specific Requirements / Notes (Optional)</label>
            <textarea
              rows={2}
              placeholder="e.g. Already possess 400 sqft shop on highway; seeking raw material supplier connections..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-2 text-xs rounded-xl bg-background border border-border/80 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-gold-400"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/60">
            <Button variant="ghost" size="sm" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="gold" size="sm" type="submit" disabled={submitting} className="gap-1.5 font-bold">
              <Send size={13} />
              <span>{submitting ? 'Registering...' : 'Register on VyaparMap'}</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
