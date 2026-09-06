import { MapPin, Phone, Calendar, ShieldCheck, Check, Landmark } from 'lucide-react';
import type { CommercialProperty } from '@/types/schema';
import { formatCurrency } from '@/components/utils';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';

export function PropertyCard({
  property,
  onBookTour,
}: {
  property: CommercialProperty;
  onBookTour: (p: CommercialProperty) => void;
}) {
  const typeBadgeVariant =
    property.type === 'retail_shop'
      ? 'blue'
      : property.type === 'restaurant_space'
      ? 'purple'
      : property.type === 'showroom'
      ? 'orange'
      : 'green';

  const typeLabel =
    property.type === 'retail_shop'
      ? 'Retail Shop'
      : property.type === 'restaurant_space'
      ? 'Restaurant / F&B'
      : property.type === 'showroom'
      ? 'Showroom'
      : 'Commercial';

  return (
    <div className="flex flex-col justify-between p-6 rounded-2xl border border-border/80 bg-card hover:border-gold-500/40 transition-all duration-200 shadow-sm space-y-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={typeBadgeVariant} className="text-[10px]">
                {typeLabel}
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">{property.city}</span>
              {property.isVerifiedOwner && (
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck size={10} /> Verified Listing
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-foreground leading-tight">
              {property.title}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin size={12} className="text-gold-400 shrink-0" /> {property.locality}, {property.city}
            </p>
          </div>

          <div className="text-right">
            <div className="text-base font-bold font-mono text-emerald-400">
              {property.monthlyRent > 0
                ? `${formatCurrency(property.monthlyRent)}/mo`
                : 'Contact'}
            </div>
            {(property.rentPerSqFt || property.rentPerSqft || 0) > 0 && (
              <div className="text-[10px] text-muted-foreground font-mono">
                ₹{property.rentPerSqFt || property.rentPerSqft}/sqft
              </div>
            )}
          </div>
        </div>

        {/* Official Government Circle Rate vs Market Asking Rate */}
        <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/25 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 font-bold flex items-center gap-1">
              <Landmark size={12} /> Govt Circle Rate (DLC)
            </span>
            <Badge variant="gold" className="text-[10px] font-mono">
              {property.valuationStatus}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground">
              Official Circle Rate: <strong className="text-foreground">₹{property.govCircleRatePerSqft}/sqft</strong>
            </span>
            <span className="text-muted-foreground">
              Market Asking: <strong className="text-emerald-400">₹{property.rentPerSqFt || property.rentPerSqft}/sqft</strong>
            </span>
          </div>
        </div>

        {/* Property Specs */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/40 border border-border/50 text-xs">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase font-mono">Carpet Area</div>
            <div className="font-bold font-mono text-foreground mt-0.5">
              {property.carpetAreaSqFt.toLocaleString('en-IN')} sq ft
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase font-mono">Footfall Rating</div>
            <div className="font-bold font-mono text-gold-400 mt-0.5">
              {property.footfallRating}
            </div>
          </div>
        </div>

        {/* Ideal Businesses */}
        {property.idealForBusinesses && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {property.idealForBusinesses.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md"
              >
                <Check size={11} className="text-emerald-400" /> {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Verified Contact & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/60">
        <div className="space-y-0.5">
          <div className="text-[10px] font-mono uppercase text-muted-foreground">
            Contact Owner / Broker
          </div>
          <div className="text-xs font-bold text-foreground">
            {property.ownerName}
          </div>
          <a
            href={`tel:${property.contactNumber}`}
            className="text-xs font-mono text-gold-400 hover:text-gold-300 flex items-center gap-1"
          >
            <Phone size={11} /> {property.contactNumber}
          </a>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() => onBookTour(property)}
          className="gap-1.5 text-xs font-bold shrink-0 self-end sm:self-auto"
        >
          <Calendar size={13} /> Schedule Tour
        </Button>
      </div>
    </div>
  );
}
