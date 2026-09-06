import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Store, Building2, MapPin, User, Mail, Phone, Maximize2, Footprints, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/system/auth/frontend/AuthContext';
import type { UserBusiness } from '../backend/ownerDashboard.db';
import { franchisesDb } from '@/features/franchises/backend/franchises.db';

interface BusinessRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function BusinessRegistrationModal({ isOpen, onClose, onComplete }: BusinessRegistrationModalProps) {
  const { user, registerBusiness } = useAuth();
  const [mode, setMode] = useState<'existing' | 'new'>('existing');

  // Form Fields
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Cafe');
  const [location, setLocation] = useState('C-scheme, Jaipur, Raj');
  const [ownerName, setOwnerName] = useState(user.name || '');
  const [businessEmail, setBusinessEmail] = useState(user.email || '');
  const [businessPhone, setBusinessPhone] = useState(user.phone || '9999999999');
  const [landAreaSqft, setLandAreaSqft] = useState<string>('650');
  const [avgDailyFootfall, setAvgDailyFootfall] = useState<string>('520');

  // Offer as Franchise States (Requirement 9)
  const [offerAsFranchise, setOfferAsFranchise] = useState(false);
  const [franchiseInvestment, setFranchiseInvestment] = useState('1500000');
  const [franchiseFee, setFranchiseFee] = useState('200000');
  const [royaltyPercent, setRoyaltyPercent] = useState('5');
  const [roiMonths, setRoiMonths] = useState('14');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isAbhinav = user.id === '000001' || user.name.toLowerCase().includes('abhinav');

    setTimeout(() => {
      const biz: Omit<UserBusiness, 'isVerified'> & { isVerified?: boolean } = {
        businessName: businessName.trim(),
        businessType: businessType.trim(),
        location: location.trim(),
        city: location.split(',')[1]?.trim() || location.split(',')[0]?.trim() || 'Jaipur',
        ownerName: ownerName.trim(),
        businessEmail: businessEmail.trim(),
        businessPhone: businessPhone.trim(),
        landAreaSqft: landAreaSqft ? parseInt(landAreaSqft, 10) : undefined,
        avgDailyFootfall: mode === 'existing' && avgDailyFootfall ? parseInt(avgDailyFootfall, 10) : undefined,
        registeredMode: mode,
        isVerified: isAbhinav,
      };

      registerBusiness(biz);

      if (offerAsFranchise) {
        franchisesDb.addCustomFranchise({
          id: `user-biz-${Date.now()}`,
          brand: businessName.trim(),
          logoColor: '#c59b27',
          category: businessType.toLowerCase().includes('cafe') || businessType.toLowerCase().includes('bakery') || businessType.toLowerCase().includes('food')
            ? 'Food & Beverage'
            : 'Retail',
          investment: parseInt(franchiseInvestment, 10) || 1500000,
          franchiseFee: parseInt(franchiseFee, 10) || 200000,
          royaltyPercent: parseInt(royaltyPercent, 10) || 5,
          roiMonths: parseInt(roiMonths, 10) || 14,
          outlets: 1,
          description: `Commercial franchise opportunity founded by ${ownerName.trim()}. Active store operational in ${location.trim()}.`,
          preferredLocations: [location.trim(), 'High Street Hubs', 'Major Transit Corridors'],
          minAreaSqft: landAreaSqft ? parseInt(landAreaSqft, 10) : 350,
          isOfficial: true,
          applyUrl: `mailto:${businessEmail.trim()}?subject=VyaparMap Franchise Inquiry for ${encodeURIComponent(businessName.trim())}`,
        });
      }

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        if (onComplete) onComplete();
        onClose();
      }, 1000);
    }, 450);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register Store Profile"
      description="Connect your commercial retail setup or planned establishment to unlock private telemetry & footfall tracking."
    >
      {success ? (
        <div className="py-8 text-center space-y-3 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-foreground">
              {businessName} Successfully Registered!
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Your store telemetry dataset has been provisioned. Launching your customized dashboard...
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Mode Selector (5a: Already Owns vs 5b: Open New) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Select Registration Track:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('existing')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === 'existing'
                    ? 'border-gold-500/60 bg-gold-500/10 text-gold-300 ring-1 ring-gold-500/30'
                    : 'border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                  <Store size={15} className={mode === 'existing' ? 'text-gold-400' : 'text-muted-foreground'} />
                  <span>Already Own a Store</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Active business with operational walk-ins and physical leased address.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode('new')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === 'new'
                    ? 'border-gold-500/60 bg-gold-500/10 text-gold-300 ring-1 ring-gold-500/30'
                    : 'border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                  <Building2 size={15} className={mode === 'new' ? 'text-gold-400' : 'text-muted-foreground'} />
                  <span>Open New Business</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Planned or upcoming outlet seeking viability & expansion telemetry.
                </p>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                {mode === 'existing' ? 'Business / Shop Name *' : 'Proposed Business Name *'}
              </label>
              <Input
                required
                placeholder="e.g. Atrix"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                leftIcon={<Store size={14} />}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Type of Business *</label>
              <Input
                required
                placeholder="e.g. Cafe / Bakery / Electronics"
                value={businessType}
                onChange={e => setBusinessType(e.target.value)}
                leftIcon={<Sparkles size={14} />}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                {mode === 'existing' ? 'Store Location (Address / Locality) *' : 'Target Location / Corridor *'}
              </label>
              <Input
                required
                placeholder="e.g. C-scheme, Jaipur, Raj"
                value={location}
                onChange={e => setLocation(e.target.value)}
                leftIcon={<MapPin size={14} />}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Owner Name (Re-verification) *
              </label>
              <Input
                required
                placeholder="e.g. Abhinav Choudhary"
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                leftIcon={<User size={14} />}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Business Email (For Customer Inquiries) *
              </label>
              <Input
                required
                type="email"
                placeholder="business@atrixcafe.in"
                value={businessEmail}
                onChange={e => setBusinessEmail(e.target.value)}
                leftIcon={<Mail size={14} />}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Business Phone (p.no) *
              </label>
              <Input
                required
                type="tel"
                placeholder="9999999999"
                value={businessPhone}
                onChange={e => setBusinessPhone(e.target.value)}
                leftIcon={<Phone size={14} />}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Land Area in sq ft <span className="text-[10px] text-muted-foreground/70 font-normal">(Optional)</span>
              </label>
              <Input
                type="number"
                placeholder="e.g. 650"
                value={landAreaSqft}
                onChange={e => setLandAreaSqft(e.target.value)}
                leftIcon={<Maximize2 size={14} />}
              />
            </div>

            {mode === 'existing' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Estimated Daily Footfall / Walk-ins <span className="text-[10px] text-muted-foreground/70 font-normal">(Optional)</span>
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 520"
                  value={avgDailyFootfall}
                  onChange={e => setAvgDailyFootfall(e.target.value)}
                  leftIcon={<Footprints size={14} />}
                />
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex items-center text-[11px] text-muted-foreground">
                <span>Predictive algorithms will project expected footfall based on your target corridor.</span>
              </div>
            )}
          </div>

          {/* Offer as Franchise Opportunity Toggle (Requirement 9) */}
          <div className="rounded-xl border border-gold-500/40 bg-gold-500/10 p-3.5 space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={offerAsFranchise}
                onChange={e => setOfferAsFranchise(e.target.checked)}
                className="rounded border-gold-500 text-gold-500 focus:ring-gold-500 h-4 w-4"
              />
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span>🌟 Offer this business as an available Franchise Opportunity on VyaparMap</span>
              </span>
            </label>
            <p className="text-[11px] text-muted-foreground">
              Feature your business on the Franchises network for prospective entrepreneurs to explore and apply.
            </p>

            {offerAsFranchise && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 animate-fade-in text-xs">
                <div>
                  <label className="text-[10px] uppercase font-mono text-muted-foreground">Est. Investment (₹)</label>
                  <Input
                    type="number"
                    value={franchiseInvestment}
                    onChange={e => setFranchiseInvestment(e.target.value)}
                    placeholder="1500000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-mono text-muted-foreground">Franchise Fee (₹)</label>
                  <Input
                    type="number"
                    value={franchiseFee}
                    onChange={e => setFranchiseFee(e.target.value)}
                    placeholder="200000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-mono text-muted-foreground">Royalty (%)</label>
                  <Input
                    type="number"
                    value={royaltyPercent}
                    onChange={e => setRoyaltyPercent(e.target.value)}
                    placeholder="5"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-mono text-muted-foreground">Payback (Months)</label>
                  <Input
                    type="number"
                    value={roiMonths}
                    onChange={e => setRoiMonths(e.target.value)}
                    placeholder="14"
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/70">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="gold" size="md" type="submit" isLoading={loading}>
              {mode === 'existing' ? 'Register Store & Open Telemetry' : 'Register Planned Venture'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
