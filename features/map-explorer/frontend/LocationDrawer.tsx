import { useNavigate } from 'react-router-dom';
import { X, MapPin, TrendingUp, Users, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import type { MapPOIItem } from './mapExplorer.service';

interface LocationDrawerProps {
  item: MapPOIItem | null;
  onClose: () => void;
}

export function LocationDrawer({ item, onClose }: LocationDrawerProps) {
  const navigate = useNavigate();

  if (!item) return null;

  return (
    <div className="absolute top-16 right-4 sm:top-18 sm:right-4 z-[2500] w-80 sm:w-96 rounded-2xl border border-border bg-card/95 p-5 shadow-2xl backdrop-blur-md animate-fade-in space-y-4">
      <div className="flex items-start justify-between gap-3 pb-2 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="gold" className="text-[10px]">
              {item.category}
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">{item.city}</span>
          </div>
          <h3 className="text-base font-bold text-foreground mt-1 leading-tight">{item.name}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
          <div className="text-[10px] uppercase font-mono text-muted-foreground flex items-center gap-1">
            <Users size={12} /> Footfall Density
          </div>
          <div className="text-sm font-bold font-mono text-blue-400 mt-1">
            {item.footfallDensity}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
          <div className="text-[10px] uppercase font-mono text-muted-foreground flex items-center gap-1">
            <TrendingUp size={12} /> Opportunity Index
          </div>
          <div className="text-sm font-bold font-mono text-gold-400 mt-1">
            {item.opportunityScore} / 10
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Est. Micro-Market Rent:</span>
        <span className="font-bold font-mono text-foreground">₹{item.avgRentSqft} / sqft</span>
      </div>

      <div className="space-y-2 pt-1">
        <Button
          variant="gold"
          size="sm"
          onClick={() => navigate('/ai-advisor')}
          className="w-full gap-2 text-xs font-bold"
        >
          <Sparkles size={14} /> Analyze in AI Advisor
        </Button>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/70 border border-border/60 transition-colors"
        >
          <ExternalLink size={13} /> View on Google Maps
        </a>
      </div>
    </div>
  );
}

