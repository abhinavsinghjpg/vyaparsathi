import { useState, useMemo, useEffect } from 'react';
import { Slider } from '@/components/Slider';
import { formatCurrency } from '@/components/utils';
import { analyticsService } from './analytics.service';
import { TrendingUp, AlertTriangle, CheckCircle2, Calculator } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { M_BUSINESS_CATALOG } from '@/features/business-finder/backend/m_business';

interface RevenueCalculatorProps {
  city?: string;
  category?: string;
}

export function RevenueCalculator({ city = 'Jaipur, Rajasthan', category = 'Cafe / Coffee Shop' }: RevenueCalculatorProps) {
  const matchedBiz = useMemo(() => {
    const raw = (category || '').toLowerCase();
    return M_BUSINESS_CATALOG.find(
      b =>
        b.name.toLowerCase() === raw ||
        raw.includes(b.name.toLowerCase()) ||
        b.name.toLowerCase().includes(raw) ||
        b.subCategory.toLowerCase().includes(raw)
    );
  }, [category]);

  const sliderConfig = useMemo(() => {
    const isHighCap = matchedBiz
      ? matchedBiz.marketTier === 'metro_luxury' || matchedBiz.typicalBudget >= 20000000
      : category.toLowerCase().includes('mall') || category.toLowerCase().includes('arcade');
    const isTech = matchedBiz
      ? matchedBiz.sectorId === 'tech_gaming_electronics'
      : category.toLowerCase().includes('laptop') || category.toLowerCase().includes('pc');
    const isRural = matchedBiz
      ? matchedBiz.isRuralFocus || matchedBiz.typicalBudget <= 400000
      : category.toLowerCase().includes('shoe') ||
        category.toLowerCase().includes('mojari') ||
        category.toLowerCase().includes('potter') ||
        category.toLowerCase().includes('kirana');

    if (isHighCap) {
      return {
        cust: { min: 50, max: 2500, step: 25, default: 450, unit: 'patrons / day' },
        ticket: { min: 200, max: 25000, step: 100, default: 2200, unit: '₹' },
        margin: { min: 15, max: 80, step: 5, default: 35, unit: '%' },
        rent: { min: 50000, max: 1500000, step: 25000, default: 220000, unit: '₹' },
        staff: { min: 30000, max: 800000, step: 10000, default: 140000, unit: '₹' },
      };
    } else if (isTech) {
      return {
        cust: { min: 5, max: 100, step: 2, default: 18, unit: 'buyers / day' },
        ticket: { min: 500, max: 60000, step: 500, default: 28000, unit: '₹' },
        margin: { min: 10, max: 50, step: 2, default: 18, unit: '%' },
        rent: { min: 15000, max: 200000, step: 5000, default: 55000, unit: '₹' },
        staff: { min: 15000, max: 120000, step: 5000, default: 45000, unit: '₹' },
      };
    } else if (isRural) {
      return {
        cust: { min: 5, max: 250, step: 5, default: 45, unit: 'buyers / day' },
        ticket: { min: 20, max: 2500, step: 20, default: 280, unit: '₹' },
        margin: { min: 15, max: 85, step: 5, default: matchedBiz?.targetMarginPercent || 45, unit: '%' },
        rent: { min: 1000, max: 30000, step: 500, default: 4500, unit: '₹' },
        staff: { min: 0, max: 25000, step: 500, default: 5000, unit: '₹' },
      };
    } else {
      return {
        cust: { min: 15, max: 500, step: 10, default: 135, unit: 'patrons / day' },
        ticket: { min: 50, max: 3000, step: 25, default: 240, unit: '₹' },
        margin: { min: 20, max: 85, step: 5, default: 60, unit: '%' },
        rent: { min: 10000, max: 250000, step: 5000, default: 48000, unit: '₹' },
        staff: { min: 10000, max: 150000, step: 5000, default: 38000, unit: '₹' },
      };
    }
  }, [category, matchedBiz]);

  const [dailyCustomers, setDailyCustomers] = useState(sliderConfig.cust.default);
  const [avgTicket, setAvgTicket] = useState(sliderConfig.ticket.default);
  const [grossMarginPct, setGrossMarginPct] = useState(sliderConfig.margin.default);
  const [monthlyRent, setMonthlyRent] = useState(sliderConfig.rent.default);
  const [monthlyStaffSalaries, setMonthlyStaffSalaries] = useState(sliderConfig.staff.default);

  const marketInsight = useMemo(() => {
    return analyticsService.getCityMarketInsight(city, category);
  }, [city, category]);

  // Adjust defaults when city or category changes
  useEffect(() => {
    const isMetro = city.toLowerCase().includes('mumbai') || city.toLowerCase().includes('delhi');
    const isSouth = city.toLowerCase().includes('bengaluru');
    
    let rentAdjusted = sliderConfig.rent.default;
    let salAdjusted = sliderConfig.staff.default;
    let ticketAdjusted = sliderConfig.ticket.default;
    let custAdjusted = sliderConfig.cust.default;

    if (isMetro) {
      rentAdjusted = Math.min(sliderConfig.rent.max, Math.round(rentAdjusted * 1.5));
      salAdjusted = Math.min(sliderConfig.staff.max, Math.round(salAdjusted * 1.3));
      ticketAdjusted = Math.min(sliderConfig.ticket.max, Math.round(ticketAdjusted * 1.25));
    } else if (isSouth) {
      rentAdjusted = Math.min(sliderConfig.rent.max, Math.round(rentAdjusted * 1.25));
      salAdjusted = Math.min(sliderConfig.staff.max, Math.round(salAdjusted * 1.15));
    }

    setDailyCustomers(custAdjusted);
    setAvgTicket(ticketAdjusted);
    setGrossMarginPct(sliderConfig.margin.default);
    setMonthlyRent(rentAdjusted);
    setMonthlyStaffSalaries(salAdjusted);
  }, [city, category, sliderConfig]);

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
            min={sliderConfig.cust.min}
            max={sliderConfig.cust.max}
            step={sliderConfig.cust.step}
            unit={sliderConfig.cust.unit}
            value={dailyCustomers}
            onChange={setDailyCustomers}
          />

          <Slider
            label="Average Ticket / Order Size (₹)"
            min={sliderConfig.ticket.min}
            max={sliderConfig.ticket.max}
            step={sliderConfig.ticket.step}
            unit="₹"
            value={avgTicket}
            onChange={setAvgTicket}
          />

          <Slider
            label="Gross Product Margin"
            min={sliderConfig.margin.min}
            max={sliderConfig.margin.max}
            step={sliderConfig.margin.step}
            unit="%"
            value={grossMarginPct}
            onChange={setGrossMarginPct}
          />

          <Slider
            label="Target Monthly Lease / Rent (₹)"
            min={sliderConfig.rent.min}
            max={sliderConfig.rent.max}
            step={sliderConfig.rent.step}
            unit="₹"
            value={monthlyRent}
            onChange={setMonthlyRent}
          />

          <Slider
            label="Staff Salaries & Overhead (₹)"
            min={sliderConfig.staff.min}
            max={sliderConfig.staff.max}
            step={sliderConfig.staff.step}
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

