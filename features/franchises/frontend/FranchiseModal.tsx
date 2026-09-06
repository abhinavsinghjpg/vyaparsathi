import { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { CheckCircle2, Building, Mail, Phone, MapPin, Wallet } from 'lucide-react';
import type { Franchise } from '@/types/schema';
import { franchisesService } from './franchises.service';
import { formatCurrency } from '@/components/utils';

interface FranchiseModalProps {
  franchise: Franchise | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FranchiseModal({ franchise, isOpen, onClose }: FranchiseModalProps) {
  const [name, setName] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('Jaipur, India');
  const [investment, setInvestment] = useState<number | string>(1500000);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (franchise) {
      setInvestment(franchise.investment || 1500000);
    }
  }, [franchise]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!franchise) return;
    setSubmitting(true);
    await franchisesService.submitInquiry({
      franchiseId: franchise.id,
      brandName: franchise.brand,
      applicantName: name,
      preferredLocation,
      investment,
      phone,
      email,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  if (!franchise) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={submitted ? 'Inquiry Submitted' : `Franchise Application: ${franchise.brand}`}
      description={
        submitted
          ? 'Your franchise application was successfully recorded.'
          : `Submit an expansion inquiry for ${franchise.category} (${franchise.outlets}+ outlets).`
      }
    >
      {submitted ? (
        <div className="py-6 text-center space-y-4 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-base font-bold text-foreground">
              Application Dispatched for {franchise.brand}
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Our partner desk has recorded your inquiry for <strong className="text-foreground">{preferredLocation}</strong> with a capital commitment of <strong className="text-gold-400">{typeof investment === 'number' ? formatCurrency(investment) : `₹${investment}`}</strong>.
            </p>
          </div>
          <Button variant="gold" size="md" onClick={handleResetAndClose} className="mt-2">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
            <Input
              required
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Preferred Location (City + Country) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Preferred Location (City + Country)
            </label>
            <Input
              required
              placeholder="e.g. Jaipur, India or Dubai, UAE"
              value={preferredLocation}
              onChange={e => setPreferredLocation(e.target.value)}
              leftIcon={<MapPin size={14} />}
            />
          </div>

          {/* Investment Budget */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Investment Capital Available (₹)
            </label>
            <Input
              required
              type="number"
              min={100000}
              step={50000}
              placeholder="e.g. 1500000"
              value={investment}
              onChange={e => setInvestment(Number(e.target.value))}
              leftIcon={<Wallet size={14} />}
            />
          </div>

          {/* Phone Number & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Phone Number (P. Number)
              </label>
              <Input
                required
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                leftIcon={<Phone size={14} />}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
              <Input
                required
                type="email"
                placeholder="rahul@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                leftIcon={<Mail size={14} />}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/70">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="gold" size="md" type="submit" isLoading={submitting}>
              Submit Application
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

