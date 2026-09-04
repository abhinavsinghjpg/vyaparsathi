import { Store, Clock, Award, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import type { Franchise } from '@/types/schema';
import { formatCurrency } from '@/components/utils';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';

export function FranchiseCard({
  franchise,
  onApply,
}: {
  franchise: Franchise;
  onApply: (f: Franchise) => void;
}) {
  return (
    <div className="flex flex-col justify-between p-6 rounded-2xl border border-border/80 bg-card hover:border-gold-500/40 transition-all duration-200 shadow-sm space-y-4">
      {/* Brand Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold font-serif text-lg shadow-sm"
              style={{
                backgroundColor: `${franchise.logoColor}15`,
                color: franchise.logoColor,
                border: `1px solid ${franchise.logoColor}35`,
              }}
            >
              {franchise.brand.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base font-bold text-foreground">{franchise.brand}</h3>
                {franchise.isOfficial && (
                  <span title="Verified Official Brand" className="inline-flex">
                    <ShieldCheck size={14} className="text-emerald-400" />
                  </span>
                )}
              </div>
              <Badge variant="outline" className="text-[10px] mt-0.5">
                {franchise.category}
              </Badge>
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm font-bold font-mono text-foreground">
              {(franchise.outlets ?? franchise.outletsPanIndia ?? 0).toLocaleString('en-IN')}+
            </span>
            <div className="text-[10px] text-muted-foreground uppercase font-mono">Outlets</div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          {franchise.description}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/50 text-xs">
          <div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase">Investment</div>
            <div className="font-bold font-mono text-blue-400 mt-0.5">
              {formatCurrency(franchise.investment ?? franchise.minInvestment ?? 0)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase">Franchise Fee</div>
            <div className="font-bold font-mono text-purple-400 mt-0.5">
              {(franchise.franchiseFee ?? 0) === 0 ? 'Free' : formatCurrency(franchise.franchiseFee ?? 0)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase">Payback ROI</div>
            <div className="font-bold font-mono text-emerald-400 mt-0.5">
              {franchise.roiMonths} Mo
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase">Royalty</div>
            <div className="font-bold font-mono text-gold-400 mt-0.5">
              {franchise.royaltyPercent}%
            </div>
          </div>
        </div>

        {/* Action Button & Area Row */}
        <div className="pt-2 border-t border-border/60 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground">
              Min Area: <strong className="text-foreground">{franchise.minAreaSqft} sq ft</strong>
            </span>
            {franchise.applyUrl ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">
                ● Direct Portal
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-full border border-gold-500/25">
                ● In-App Application
              </span>
            )}
          </div>

          {franchise.applyUrl ? (
            <div className="space-y-1.5">
              <a
                href={franchise.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-brand-dark font-bold text-xs shadow-md transition-all active:scale-[0.98] select-none"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink size={14} />
              </a>
              <button
                type="button"
                onClick={() => onApply(franchise)}
                className="w-full text-center text-[11px] text-muted-foreground hover:text-gold-400 font-medium py-0.5 transition-colors cursor-pointer"
              >
                Or submit inquiry in app
              </button>
            </div>
          ) : (
            <Button
              variant="gold"
              size="md"
              onClick={() => onApply(franchise)}
              className="w-full text-xs font-bold gap-1.5"
            >
              <span>Apply for Franchise</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

