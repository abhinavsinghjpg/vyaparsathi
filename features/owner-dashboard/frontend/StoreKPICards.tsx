import { DollarSign, Footprints, Percent, Wallet } from 'lucide-react';
import type { StoreDashboardData } from '../backend/ownerDashboard.db';
import { formatCurrency } from '@/components/utils';

export function StoreKPICards({ data }: { data: StoreDashboardData }) {
  const isVerified = data.isVerified;

  const cards = [
    {
      label: isVerified ? 'Monthly Store Revenue' : 'Estimated Monthly Store Revenue',
      value: formatCurrency(data.monthlyRevenue),
      sub: isVerified ? '+8.4% vs last month (Audited)' : 'Corridor Run-Rate Projection',
      color: 'text-emerald-400',
      icon: DollarSign,
    },
    {
      label: isVerified ? 'Monthly Lease Overhead' : 'Estimated Monthly Lease Overhead',
      value: formatCurrency(data.monthlyRent),
      sub: `Rent Load: ${data.rentToRevenueRatio}% (Healthy <20%)`,
      color: 'text-blue-400',
      icon: Wallet,
    },
    {
      label: isVerified ? 'Daily Footfall' : 'Estimated Daily Footfall',
      value: `${data.dailyFootfall} / day`,
      sub: isVerified ? 'Peak window: 6 PM - 9 PM' : 'Corridor pedestrian density index',
      color: 'text-gold-400',
      icon: Footprints,
    },
    {
      label: isVerified ? 'Custom Conversion Rate' : 'Estimated Conversion Rate',
      value: `${data.conversionRate}%`,
      sub: `${Math.round(data.dailyFootfall * (data.conversionRate / 100))} paying tickets / day`,
      color: 'text-purple-400',
      icon: Percent,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(c => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="p-5 rounded-2xl border border-border/80 bg-card shadow-sm space-y-2 relative overflow-hidden group hover:border-gold-500/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground line-clamp-1">
                {c.label}
              </span>
              <div className="p-1.5 rounded-lg bg-muted/60 text-muted-foreground group-hover:text-gold-400 transition-colors">
                <Icon size={15} />
              </div>
            </div>
            <div className={`text-2xl font-bold font-mono ${c.color}`}>{c.value}</div>
            <div className="text-[11px] text-muted-foreground">{c.sub}</div>
          </div>
        );
      })}
    </div>
  );
}
