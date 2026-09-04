import { useState, useMemo } from 'react';
import { Slider } from '@/components/Slider';
import { formatCurrency } from '@/components/utils';
import { analyticsService } from './analytics.service';
import { TrendingUp, AlertTriangle, CheckCircle2, Calculator } from 'lucide-react';
import { Badge } from '@/components/Badge';

interface RevenueCalculatorProps {
  city?: string;
  category?: string;
}

export function RevenueCalculator({ city = 'Jaipur, Rajasthan', category = 'Cafe / Coffee Shop' }: RevenueCalculatorProps) {
  const [dailyCustomers, setDailyCustomers] = useState(135);
  const [avgTicket, setAvgTicket] = useState(220);
  const [grossMarginPct, setGrossMarginPct] = useState(65);
  const [monthlyRent, setMonthlyRent] = useState(48000);
  const [monthlyStaffSalaries, setMonthlyStaffSalaries] = useState(38000);

  const marketInsight = useMemo(() => {
    return analyticsService.getCityMarketInsight(city, category);
  }, [city, category]);

  // Adjust defaults when city changes
  useMemo(() => {
    const isMetro = city.toLowerCase().includes('mumbai') || city.toLowerCase().includes('delhi');
    const isSouth = city.toLowerCase().includes('bengaluru');
    if (isMetro) {
      setDailyCustomers(180);
      setAvgTicket(320);
      setMonthlyRent(95000);
      setMonthlyStaffSalaries(55000);
    } else if (isSouth) {
      setDailyCustomers(160);
      setAvgTicket(280);
      setMonthlyRent(75000);
      setMonthlyStaffSalaries(48000);
    } else {
      setDailyCustomers(135);
      setAvgTicket(220);
      setMonthlyRent(48000);
      setMonthlyStaffSalaries(38000);
    }
  }, [city, category]);

  const projection = useMemo(() => {
    return analyticsService.calculateProjections({
      dailyCustomers,
      avgTicket,
      grossMarginPct,
      monthlyRent,
      monthlyStaffSalaries,
    });
  }, [dailyCustomers, avgTicket, grossMarginPct, monthlyRent, monthlyStaffSalaries]);

  // Dynamic localized calculations
  const breakEvenDays = useMemo(() => {
    const dailyGross = dailyCustomers * avgTicket * (grossMarginPct / 100);
    if (dailyGross <= 0) return 30;
    return Math.min(30, Math.ceil(projection.monthlyOperatingCosts / dailyGross));
  }, [dailyCustomers, avgTicket, grossMarginPct, projection.monthlyOperatingCosts]);

  const maxSafeRent = useMemo(() => {
    return Math.round(projection.monthlyGrossRevenue * 0.18);
  }, [projection.monthlyGrossRevenue]);

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-card shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border/70 gap-3">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Calculator size={18} className="text-gold-400" /> Rent-to-Revenue Stress Test Calculator
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Localized for <span className="font-semibold text-foreground">{category}</span> in <span className="font-semibold text-gold-400">{city}</span>.
          </p>
        </div>
        <Badge variant={projection.isHealthyRent ? 'green' : 'orange'}>
          Rent Load: {projection.rentToRevenuePct}%
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Sliders */}
        <div className="lg:col-span-7 space-y-5">
          <Slider
            label="Daily Customers Served"
            min={20}
            max={500}
            step={10}
            unit="patrons / day"
            value={dailyCustomers}
            onChange={setDailyCustomers}
          />

          <Slider
            label="Average Ticket / Order Size (₹)"
            min={50}
            max={1500}
            step={25}
            unit="₹"
            value={avgTicket}
            onChange={setAvgTicket}
          />

          <Slider
            label="Gross Product Margin"
            min={20}
            max={85}
            step={5}
            unit="%"
            value={grossMarginPct}
            onChange={setGrossMarginPct}
          />

          <Slider
            label="Target Monthly Lease / Rent (₹)"
            min={15000}
            max={300000}
            step={5000}
            unit="₹"
            value={monthlyRent}
            onChange={setMonthlyRent}
          />

          <Slider
            label="Staff Salaries & Overhead (₹)"
            min={15000}
            max={200000}
            step={5000}
            unit="₹"
            value={monthlyStaffSalaries}
            onChange={setMonthlyStaffSalaries}
          />
        </div>

        {/* Live Calculation Output Card */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-border/80 bg-muted/40 space-y-5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Financial Projections
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-muted-foreground">Est. Monthly Revenue</span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground mt-0.5">
                {formatCurrency(projection.monthlyGrossRevenue)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-card border border-border/60">
                <span className="text-[10px] text-muted-foreground font-mono uppercase">Net Profit / mo</span>
                <div className={`text-lg font-bold font-mono mt-0.5 ${projection.monthlyNetProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatCurrency(projection.monthlyNetProfit)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border/60">
                <span className="text-[10px] text-muted-foreground font-mono uppercase">Net Margin</span>
                <div className="text-lg font-bold font-mono text-gold-400 mt-0.5">
                  {projection.netMarginPct}%
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/60">
              <span className="text-[10px] text-muted-foreground font-mono uppercase">Annualized Net Income</span>
              <div className="text-xl font-bold font-mono text-blue-400 mt-0.5">
                {formatCurrency(projection.annualNetProfit)}
              </div>
            </div>
          </div>

          <div className="pt-2 text-xs leading-relaxed">
            {projection.isHealthyRent ? (
              <div className="flex items-start gap-2 text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <span>
                  <strong>Disciplined Rent Load:</strong> Lease overhead is {projection.rentToRevenuePct}% of sales (under the 20% danger ceiling).
                </span>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>
                  <strong>High Rent Burden:</strong> Lease takes {projection.rentToRevenuePct}% of sales. Consider smaller square footage or negotiate rent concessions.
                </span>
              </div>
            )}
          </div>

          {/* Localized City & Category Benchmark Highlights */}
          <div className="pt-3 border-t border-border/60 space-y-2.5 text-xs">
            <div className="text-[10px] font-mono uppercase tracking-wider text-gold-400 font-bold flex items-center justify-between">
              <span>{marketInsight.city} Market Intelligence</span>
              <span>{marketInsight.marketDensity}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-card/60 border border-border/50">
                <span className="text-muted-foreground text-[10px] block">Break-even Speed</span>
                <span className="font-bold text-foreground">{breakEvenDays} Days / mo</span>
              </div>
              <div className="p-2 rounded-lg bg-card/60 border border-border/50">
                <span className="text-muted-foreground text-[10px] block">Safe Rent Ceiling</span>
                <span className="font-bold text-emerald-400">{formatCurrency(maxSafeRent)} / mo</span>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground leading-snug">
              <strong className="text-foreground">Prime Corridors:</strong> {marketInsight.recommendedCorridors.slice(0, 3).join(', ')}
            </div>

            <p className="text-[11px] text-muted-foreground/90 italic bg-card/40 p-2.5 rounded-lg border border-border/40">
              &quot;{marketInsight.localVerdict}&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

