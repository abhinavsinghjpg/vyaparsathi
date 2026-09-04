import { Wallet, ShieldCheck, AlertCircle } from 'lucide-react';
import type { StoreTelemetry } from '@/types/schema';
import { formatCurrency } from '@/components/utils';

export function RevenueMatrix({ telemetry }: { telemetry: StoreTelemetry }) {
  const dailyBreakEvenSales = Math.round((telemetry.monthlyRent + 45000) / 30);
  const currentDailySales = Math.round(telemetry.monthlyRevenue / 30);
  const safetyBuffer = Math.round(((currentDailySales - dailyBreakEvenSales) / currentDailySales) * 100);

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-card shadow-sm space-y-5">
      <div>
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Wallet size={18} className="text-emerald-400" /> Rent-to-Revenue Stress Matrix
        </h3>
        <p className="text-xs text-muted-foreground">
          Calculates operating margins and breakeven buffer for current lease.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
          <span className="text-[10px] uppercase font-mono text-muted-foreground">Daily Breakeven</span>
          <div className="text-xl font-bold font-mono text-foreground mt-1">
            {formatCurrency(dailyBreakEvenSales)} / day
          </div>
          <span className="text-[11px] text-muted-foreground">Minimum sales to cover rent & base staff</span>
        </div>

        <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
          <span className="text-[10px] uppercase font-mono text-muted-foreground">Actual Daily Sales</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {formatCurrency(currentDailySales)} / day
          </div>
          <span className="text-[11px] text-muted-foreground">Current average store run-rate</span>
        </div>

        <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
          <span className="text-[10px] uppercase font-mono text-muted-foreground">Operating Buffer</span>
          <div className="text-xl font-bold font-mono text-gold-400 mt-1">
            +{safetyBuffer}% Buffer
          </div>
          <span className="text-[11px] text-muted-foreground">Margin cushion against demand slumps</span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2.5">
        <ShieldCheck size={18} className="shrink-0" />
        <span>
          <strong>Healthy Commercial Position:</strong> Your store is generating an operating buffer of {safetyBuffer}% above the lease breakeven threshold.
        </span>
      </div>
    </div>
  );
}

