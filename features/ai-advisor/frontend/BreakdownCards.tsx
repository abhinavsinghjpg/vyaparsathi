import { MapPin, Users, TrendingUp, Store, Wallet } from 'lucide-react';
import type { AdvisorAnalysisResult } from './aiAdvisor.service';
import { formatCurrency } from '@/components/utils';

export function BreakdownCards({ result }: { result: AdvisorAnalysisResult }) {
  const cards = [
    {
      icon: MapPin,
      label: 'Avg Rent / sqft',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      value: `₹${result.averageRentSqft} / sqft`,
      sub: `Monthly: ${formatCurrency(result.monthlyRent)}`,
      pct: Math.min(100, Math.round((result.averageRentSqft / 250) * 100)),
      barColor: 'bg-orange-500',
    },
    {
      icon: Users,
      label: 'Footfall Density',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      value: result.footfallLevel,
      sub: 'Verified pedestrian density level',
      pct: result.footfallLevel === 'Very High' ? 95 : result.footfallLevel === 'High' ? 75 : 50,
      barColor: 'bg-blue-500',
    },
    {
      icon: TrendingUp,
      label: '5-Year Growth',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      value: `+${result.footfallGrowth5Yr}%`,
      sub: 'Expected footfall growth trajectory',
      pct: Math.min(100, result.footfallGrowth5Yr * 1.5),
      barColor: 'bg-emerald-500',
    },
    {
      icon: Store,
      label: 'Competitors Nearby',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      value: `${result.competitorCount} Outlets (${(result.competitorCount / 3.14).toFixed(1)}/km²)`,
      sub: `~${Math.round(1000 / Math.max(1, Math.sqrt(result.competitorCount)))}m avg spacing • ${result.marketSaturation} saturation`,
      pct: Math.min(100, (result.competitorCount / 30) * 100),
      barColor: result.marketSaturation === 'High' ? 'bg-red-500' : 'bg-purple-500',
    },
    {
      icon: Wallet,
      label: 'Budget Fit',
      color: 'text-gold-400',
      bgColor: 'bg-gold-500/10',
      value: result.budgetFit,
      sub: `Setup cost est. ${formatCurrency(result.setupCostEst)}`,
      pct: result.budgetFit === 'Excellent' ? 95 : result.budgetFit === 'Good' ? 75 : 45,
      barColor: 'bg-gold-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map(c => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="p-4 rounded-xl border border-border/80 bg-card/80 space-y-2.5 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${c.bgColor} ${c.color}`}>
                <Icon size={14} />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{c.label}</span>
            </div>

            <div className={`text-xl font-bold font-mono ${c.color}`}>{c.value}</div>
            <div className="text-[11px] text-muted-foreground truncate">{c.sub}</div>

            {/* Mini Progress Bar */}
            <div className="w-full h-1.5 bg-muted/60 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${c.barColor}`} style={{ width: `${c.pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

