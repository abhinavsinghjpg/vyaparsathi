import { MapPin, Phone, Calendar, Users, Check } from 'lucide-react';
import type { CommercialProperty } from '@/database';
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
    property.type === 'Shop'
      ? 'blue'
      : property.type === 'Office'
      ? 'purple'
      : property.type === 'Kiosk'
      ? 'orange'
      : 'green';

  return (
    <div className="flex flex-col justify-between p-6 rounded-2xl border border-border/80 bg-card hover:border-gold-500/40 transition-all duration-200 shadow-sm space-y-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={typeBadgeVariant} className="text-[10px]">
                {property.type}
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">{property.city}</span>
            </div>
            <h3 className="text-base font-bold text-foreground leading-tight">
              {property.title}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin size={12} className="text-gold-400" /> {property.area}
            </p>
          </div>

          <div className="text-right">
            <div className="text-base font-bold font-mono text-emerald-400">
              {property.monthlyRent > 0
                ? `${formatCurrency(property.monthlyRent)}/mo`
                : property.salePrice
                ? formatCurrency(property.salePrice)
                : 'Contact'}
            </div>
            {property.rentPerSqft > 0 && (
              <div className="text-[10px] text-muted-foreground font-mono">
                ₹{property.rentPerSqft}/sqft
              </div>
            )}
          </div>
        </div>

        {/* Footfall & Size Metrics */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/40 border border-border/50 text-xs">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase font-mono">Shop Area</div>
            <div className="font-bold font-mono text-foreground mt-0.5">
              {property.sizeSqft.toLocaleString('en-IN')} sq ft
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase font-mono">Footfall Index</div>
            <div className="font-bold font-mono text-gold-400 mt-0.5">
              {property.footfallRating} / 10
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {property.highlights.map((hl, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md"
            >
              <Check size={11} className="text-emerald-400" /> {hl}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/60">
        <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
          <Phone size={13} className="text-muted-foreground" />
          <span>{property.contact}</span>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() => onBookTour(property)}
          className="gap-1.5 text-xs font-bold"
        >
          <Calendar size={13} /> Schedule Tour
        </Button>
      </div>
    </div>
  );
}

