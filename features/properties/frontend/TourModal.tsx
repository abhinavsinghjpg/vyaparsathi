import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { CheckCircle2, Calendar, Phone, User } from 'lucide-react';
import type { CommercialProperty } from '@/types/schema';
import { propertiesService } from './properties.service';

interface TourModalProps {
  property: CommercialProperty | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TourModal({ property, isOpen, onClose }: TourModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('2026-09-10');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    setSubmitting(true);
    await propertiesService.bookTour({
      propertyId: property.id,
      name,
      phone,
      preferredDate: date,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  if (!property) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={submitted ? 'Tour Confirmed' : `Schedule Site Visit`}
      description={
        submitted
          ? 'Your demo tour schedule has been logged.'
          : `${property.title} (${property.sizeSqft} sq ft in ${property.city}).`
      }
    >
      {submitted ? (
        <div className="py-6 text-center space-y-4 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-foreground">
              Tour Scheduled for {date}
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Our site coordinator will connect with {phone} to facilitate your on-site walkthrough.
            </p>
          </div>
          <Button variant="gold" size="md" onClick={handleResetAndClose} className="mt-2">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Founder / Representative</label>
            <Input
              required
              placeholder="e.g. Abhinav Choudhary"
              value={name}
              onChange={e => setName(e.target.value)}
              leftIcon={<User size={14} />}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Contact Phone</label>
            <Input
              required
              type="tel"
              placeholder="+91 98100 00000"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              leftIcon={<Phone size={14} />}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Preferred Visit Date</label>
            <Input
              required
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              leftIcon={<Calendar size={14} />}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/70">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="gold" size="md" type="submit" isLoading={submitting}>
              Confirm Schedule
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

