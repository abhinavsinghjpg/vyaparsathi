import { useState, useEffect } from 'react';
import { analyticsService } from './analytics.service';
import { Select } from '@/components/Select';
import { Badge } from '@/components/Badge';
import { Star } from 'lucide-react';

const CITIES = [
  { value: 'All', label: 'All Metros' },
  { value: 'Jaipur', label: 'Jaipur' },
  { value: 'Bengaluru', label: 'Bengaluru' },
  { value: 'Delhi', label: 'Delhi NCR' },
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'Pune', label: 'Pune' },
  { value: 'Hyderabad', label: 'Hyderabad' },
  { value: 'Gurugram', label: 'Gurugram' },
];

export function CompetitorTable({ cityFilter }: { cityFilter?: string }) {
  const [city, setCity] = useState(cityFilter || 'All');

  useEffect(() => {
    if (cityFilter) {
      setCity(cityFilter);
    }
  }, [cityFilter]);

  const competitors = analyticsService.getCompetitors(city);

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-card shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Competitor Pricing Benchmark</h3>
          <p className="text-xs text-muted-foreground">
            Price levels and average customer tickets across major competing outlets.
          </p>
        </div>

        <div className="w-44">
          <Select value={city} onChange={e => setCity(e.target.value)} options={CITIES} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/70 text-muted-foreground font-mono uppercase tracking-wider">
              <th className="pb-3 font-semibold">Brand / Store</th>
              <th className="pb-3 font-semibold">Category</th>
              <th className="pb-3 font-semibold">Micro-Market</th>
              <th className="pb-3 font-semibold">Price Tier</th>
              <th className="pb-3 font-semibold">Avg Order</th>
              <th className="pb-3 font-semibold">Daily Footfall</th>
              <th className="pb-3 font-semibold text-right">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {competitors.map(c => (
              <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-3 font-bold text-foreground">{c.name}</td>
                <td className="py-3 text-muted-foreground">{c.category}</td>
                <td className="py-3 text-muted-foreground">{c.area || c.locality || 'Commercial Corridor'}, {c.city}</td>
                <td className="py-3">
                  <Badge
                    variant={
                      c.priceLevel === 'Premium' || c.priceLevel === '₹₹₹' || c.priceLevel === '₹₹₹₹'
                        ? 'purple'
                        : c.priceLevel === 'Mid' || c.priceLevel === '₹₹'
                        ? 'blue'
                        : 'green'
                    }
                    className="text-[10px]"
                  >
                    {c.priceLevel}
                  </Badge>
                </td>
                <td className="py-3 font-mono font-semibold text-foreground">
                  ₹{c.avgTicket ?? Math.round(c.estimatedMonthlyRevenue / ((c.dailyCustomers ?? c.avgDailyCustomers ?? 100) * 30))}
                </td>
                <td className="py-3 font-mono text-muted-foreground">{c.dailyCustomers ?? c.avgDailyCustomers ?? 180} visits</td>
                <td className="py-3 text-right">
                  <span className="inline-flex items-center gap-1 font-mono font-bold text-gold-400">
                    <Star size={11} className="fill-gold-400" /> {c.rating}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

