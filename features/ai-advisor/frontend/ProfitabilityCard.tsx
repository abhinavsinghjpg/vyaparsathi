import { TrendingUp, AlertTriangle, CheckCircle2, DollarSign, Clock, ShieldCheck, Target, ChevronRight } from 'lucide-react';
import type { BusinessFinancialProjection } from './geminiAdvisor.service';
import { Badge } from '@/components/Badge';

interface ProfitabilityCardProps {
  financials: BusinessFinancialProjection;
  shopType: string;
  location: string;
  googleMapsUrl?: string;
}

export function ProfitabilityCard({ financials, shopType, location, googleMapsUrl }: ProfitabilityCardProps) {
  const isProfitable = financials.isProfitable;

  const verdictBadge =
    financials.verdict === 'HIGHLY_PROFITABLE' ? (
      <Badge variant="green" className="font-mono text-xs px-2.5 py-1">
        <CheckCircle2 size={13} className="mr-1 inline" /> Highly Profitable
      </Badge>
    ) : financials.verdict === 'PROFITABLE' ? (
      <Badge variant="green" className="font-mono text-xs px-2.5 py-1">
        <CheckCircle2 size={13} className="mr-1 inline" /> Economically Profitable
      </Badge>
    ) : financials.verdict === 'MARGINAL' ? (
      <Badge variant="gold" className="font-mono text-xs px-2.5 py-1">
        <AlertTriangle size={13} className="mr-1 inline" /> Marginal Profitability
      </Badge>
    ) : (
      <Badge variant="orange" className="font-mono text-xs px-2.5 py-1">
        <AlertTriangle size={13} className="mr-1 inline" /> High Financial Risk
      </Badge>
    );

  return (
    <div className="rounded-2xl border border-border/90 bg-card p-6 sm:p-7 shadow-xl space-y-6">
      {/* 1. Header & Profitability Verdict */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {verdictBadge}
            <span className="text-[11px] font-mono text-muted-foreground">
              Powered by {financials.engineUsed}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
            {financials.verdictTitle}
          </h3>
        </div>

        {googleMapsUrl && (
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-muted/30 hover:bg-muted/70 text-xs font-semibold text-foreground transition-all shrink-0"
          >
            <span>Scan on Google Maps</span>
            <ChevronRight size={14} />
          </a>
        )}
      </div>

      {/* 2. Verdict Summary */}
      <p className="text-sm text-foreground/90 leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/50">
        {financials.verdictSummary}
      </p>

      {/* 3. Core Financial Projection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Monthly Net Profit */}
        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-sm space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <DollarSign size={13} className={isProfitable ? 'text-emerald-400' : 'text-orange-400'} /> Est. Net Profit / mo
          </span>
          <div className={`text-2xl font-bold font-mono ${isProfitable ? 'text-emerald-400' : 'text-orange-400'}`}>
            ₹{financials.monthlyNetProfitEst.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">
            {financials.netMarginPercent}% Net Margin
          </span>
        </div>

        {/* Monthly Gross Revenue */}
        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-sm space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <TrendingUp size={13} className="text-blue-400" /> Est. Gross Revenue
          </span>
          <div className="text-2xl font-bold font-mono text-foreground">
            ₹{financials.monthlyRevenueEst.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">
            ~{financials.expectedDailyOrders} Orders/day @ ₹{financials.averageTicketSize} AOV
          </span>
        </div>

        {/* Break-even Orders */}
        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-sm space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Target size={13} className="text-gold-400" /> Break-Even Volume
          </span>
          <div className="text-2xl font-bold font-mono text-gold-400">
            {financials.breakevenOrdersPerDay} <span className="text-xs font-normal text-muted-foreground">orders/day</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">
            Needed to cover all monthly overheads
          </span>
        </div>

        {/* Payback Horizon */}
        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-sm space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Clock size={13} className="text-purple-400" /> Payback Period
          </span>
          <div className="text-2xl font-bold font-mono text-foreground">
            {financials.paybackPeriodMonths < 90 ? `${financials.paybackPeriodMonths} Mo` : 'N/A'}
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">
            Capital Outlay: ₹{financials.totalSetupCapex.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* 4. Operating Expenses Breakdown */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
          Monthly Operating Cost Breakdown
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
            <span className="text-muted-foreground block text-[10px]">Rent</span>
            <span className="font-bold text-foreground">₹{financials.monthlyOperatingExpenses.rent.toLocaleString('en-IN')}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
            <span className="text-muted-foreground block text-[10px]">Salaries</span>
            <span className="font-bold text-foreground">₹{financials.monthlyOperatingExpenses.salaries.toLocaleString('en-IN')}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
            <span className="text-muted-foreground block text-[10px]">Power & Utilities</span>
            <span className="font-bold text-foreground">₹{financials.monthlyOperatingExpenses.utilitiesAndPower.toLocaleString('en-IN')}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
            <span className="text-muted-foreground block text-[10px]">COGS / Stock</span>
            <span className="font-bold text-foreground">₹{financials.monthlyOperatingExpenses.rawMaterialsCogs.toLocaleString('en-IN')}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
            <span className="text-muted-foreground block text-[10px]">Total OPEX</span>
            <span className="font-bold text-gold-400">₹{financials.monthlyOperatingExpenses.total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* 5. Strategic Action Plan */}
      {financials.strategicActionPlan && financials.strategicActionPlan.length > 0 && (
        <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/20 space-y-2">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
            <ShieldCheck size={14} /> Founder Action Plan for {location}
          </h4>
          <ul className="space-y-1.5 text-xs text-foreground/90">
            {financials.strategicActionPlan.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-gold-400 font-bold font-mono">0{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

