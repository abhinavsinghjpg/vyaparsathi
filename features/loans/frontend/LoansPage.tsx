import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Landmark,
  Wallet,
  Percent,
  Calendar,
  ShieldCheck,
  ExternalLink,
  Send,
  HelpCircle,
  Clock,
  Coins,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { formatCurrency } from '@/components/utils';
import { loansService } from './loans.service';
import { LoanApplicationModal } from './LoanApplicationModal';

const PRESET_MARGINS_MICRO = [
  { label: '₹1,000 (₹10k Micro Unit)', value: 1000 },
  { label: '₹5,000 (PM SVANidhi Cobbler)', value: 5000 },
  { label: '₹10,000 (PM Vishwakarma Artisan)', value: 10000 },
  { label: '₹14,000 (Track A Cap ₹1.40L)', value: 14000 },
];

const PRESET_MARGINS_TERM = [
  { label: '₹25,000 (₹2.5L Workshop Unit)', value: 25000 },
  { label: '₹50,000 (₹5L Dairy / Agro Unit)', value: 50000 },
  { label: '₹1,00,000 (₹10L Commercial Setup)', value: 100000 },
  { label: '₹2,50,000 (₹25L Agro Processing)', value: 250000 },
  { label: '₹5,00,000 (Track B MoSJE Cap ₹50L)', value: 500000 },
];

const PRESET_MARGINS_SYNDICATE = [
  { label: '₹7,50,000 (₹75L Bank Facility)', value: 750000 },
  { label: '₹10,00,000 (₹1 Cr Partner Bank)', value: 1000000 },
  { label: '₹15,00,000 (₹1.5 Cr Retail Mall)', value: 1500000 },
  { label: '₹20,00,000 (₹2 Cr Max CGTMSE)', value: 2000000 },
];

// Helper functions for smooth, continuous 0-1000 slider across all 3 capital tiers
function sliderToMargin(val: number): number {
  const s = Math.max(0, Math.min(1000, Number(val) || 0));
  if (s <= 0) return 1000;
  if (s <= 350) {
    const f = s / 350;
    const raw = 1000 + f * (14000 - 1000);
    return Math.round(raw / 500) * 500;
  }
  if (s <= 700) {
    const f = (s - 350) / 350;
    const raw = 14000 + f * (500000 - 14000);
    return Math.round(raw / 5000) * 5000;
  }
  const f = (s - 700) / 300;
  const raw = 500000 + f * (2000000 - 500000);
  return Math.round(raw / 25000) * 25000;
}

function marginToSlider(margin: number): number {
  const m = Math.max(1000, Math.min(2000000, Number(margin) || 1000));
  if (m <= 14000) {
    return Math.round(((m - 1000) / (14000 - 1000)) * 350);
  }
  if (m <= 500000) {
    return Math.round(350 + ((m - 14000) / (500000 - 14000)) * 350);
  }
  return Math.round(700 + ((m - 500000) / (2000000 - 500000)) * 300);
}

export function LoansPage() {
  // Default to Micro Finance (₹10,000 margin -> ₹1.00 Lakh project cost @ 6.5% interest)
  const [marginMoney, setMarginMoney] = useState<number>(10000);
  const [showSchedule, setShowSchedule] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Compute live structure
  const structure = useMemo(() => {
    return loansService.calculateStructure(marginMoney);
  }, [marginMoney]);

  const isMicroFinance = structure.totalProjectCost <= 140000;
  const isTermLoan = structure.totalProjectCost > 140000 && structure.totalProjectCost <= 5000000;
  const isBankSyndicate = structure.totalProjectCost > 5000000;

  // Native non-passive wheel listener for smooth desktop/trackpad wheel scrolling over slider container
  useEffect(() => {
    const el = sliderContainerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const direction = e.deltaY < 0 ? 1 : -1;
      setMarginMoney(prev => {
        const curPos = marginToSlider(prev);
        const nextPos = Math.max(0, Math.min(1000, curPos + direction * 15));
        return sliderToMargin(nextPos);
      });
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleSelectTier = (tier: 'MICRO' | 'TERM') => {
    if (tier === 'MICRO') {
      setMarginMoney(10000); // ₹1.00L project -> 6.5%, 3-yr, 3-mo moratorium
    } else {
      setMarginMoney(100000); // ₹10.00L project -> 8.0%, 7-yr, 6-mo moratorium
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Top Banner / Problem Statement Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="gold" className="text-[10px] font-mono uppercase font-bold">
            SIH Problem Statement 26091
          </Badge>
          <span className="text-xs font-mono text-muted-foreground">
            Ministry of Social Justice and Empowerment (MoSJE)
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            10% Margin → 90% Concessional Credit
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
          Smart Financial Calculator & Scheme Router
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
          Democratizing concessional institutional credit for rural & micro-entrepreneurs. Auto-routes between the 
          <strong className="text-foreground"> Micro Finance Scheme (6.5% interest, 3-year tenure, 3-month moratorium)</strong>, the 
          <strong className="text-foreground"> Concessional Term Loan Scheme (8.0% interest, 7-year tenure, 6-month moratorium)</strong>, and 
          <strong className="text-foreground"> VyaparMap Co-Lending Bank Consortium (up to ₹2.00 Crore @ 8.75%)</strong> 
          based on your calculated project cost.
        </p>
      </div>

      {/* 2-Tier Scheme Switcher Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tier A Tab */}
        <div
          onClick={() => handleSelectTier('MICRO')}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
            isMicroFinance
              ? 'border-emerald-500/80 bg-gradient-to-br from-emerald-500/15 via-card to-card shadow-lg ring-2 ring-emerald-500/20'
              : 'border-border/70 bg-card/60 hover:border-border hover:bg-card opacity-75'
          }`}
        >
          {isMicroFinance && (
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-brand-dark font-mono font-bold text-[9px] uppercase tracking-wider">
              ● Active Scheme Tier
            </span>
          )}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Track A: Project Cost ≤ ₹1.40 Lakh</span>
            </div>
            <h3 className="text-lg font-bold text-foreground">
              MoSJE Micro Finance Scheme
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Designed for petty retail, cobblers, artisan kiosks, and cottage micro-units.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-xs font-mono">
              <div>
                <span className="text-[10px] text-muted-foreground block">Interest Rate</span>
                <span className="font-bold text-emerald-400 text-sm">6.5% p.a.</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Repayment Tenure</span>
                <span className="font-bold text-foreground text-sm">3 Years (36 Mo)</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Moratorium</span>
                <span className="font-bold text-purple-400 text-sm">3 Months</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tier B Tab */}
        <div
          onClick={() => handleSelectTier('TERM')}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
            isTermLoan
              ? 'border-blue-500/80 bg-gradient-to-br from-blue-500/15 via-card to-card shadow-lg ring-2 ring-blue-500/20'
              : 'border-border/70 bg-card/60 hover:border-border hover:bg-card opacity-75'
          }`}
        >
          {isTermLoan && (
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-blue-500 text-white font-mono font-bold text-[9px] uppercase tracking-wider">
              ● Active Scheme Tier
            </span>
          )}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase">Track B: Project Cost &gt; ₹1.40L to ₹50.00L</span>
            </div>
            <h3 className="text-lg font-bold text-foreground">
              MoSJE Concessional Term Loan Scheme
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Designed for agro-processing mills, commercial workshops, transport, and manufacturing units.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-xs font-mono">
              <div>
                <span className="text-[10px] text-muted-foreground block">Interest Rate</span>
                <span className="font-bold text-blue-400 text-sm">8.0% p.a.</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Repayment Tenure</span>
                <span className="font-bold text-foreground text-sm">7 Years (84 Mo)</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Moratorium</span>
                <span className="font-bold text-purple-400 text-sm">6 Months</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Track C: VyaparMap Bank Syndicate Banner (For Projects > 50L up to 2Cr) */}
      {isBankSyndicate && (
        <div className="p-5 rounded-2xl border-2 border-amber-500/80 bg-gradient-to-br from-amber-500/15 via-card to-card space-y-2.5 animate-fade-in shadow-lg ring-2 ring-amber-500/20">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-brand-dark font-mono font-bold text-[10px] uppercase tracking-wider">
                ● No Government Scheme Applicable (&gt; ₹50.00 Lakh Cap)
              </span>
              <span className="text-xs font-mono text-amber-300 font-bold">
                Commercial Bank Co-Lending Facility (₹50.00 Lakh to ₹2.00 Crore)
              </span>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-background/80 border border-amber-500/40 text-muted-foreground">
              Credit History &amp; CIBIL Appraisal
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Official MoSJE and Jan Samarth concessional credit subsidies are strictly capped at <strong className="text-foreground">₹50.00 Lakh</strong>. For project costs exceeding ₹50.00 Lakh up to ₹2.00 Crore, <strong className="text-amber-400">no government subsidy applies</strong>. However, you can apply directly through <strong className="text-foreground">VyaparMap Partner Bank Syndicate (SBI, PNB, Bank of Baroda)</strong> based on your business credit history, CIBIL score (680+), verified GST returns, and project cashflow viability (backed by CGTMSE guarantee cover up to ₹2.00 Crore).
          </p>
        </div>
      )}

      {/* Margin Money Input Console & Continuous Scroll/Wheel Slider */}
      <div
        ref={sliderContainerRef}
        className="p-6 rounded-2xl border border-border/80 bg-card shadow-sm space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider font-bold text-foreground flex items-center gap-1.5">
              <Wallet size={15} className="text-gold-400" />
              <span>Available Beneficiary Margin Capital (10% Contribution)</span>
            </label>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Cash contribution required to unlock 90% loan assistance (MoSJE concessional up to ₹50L, or Partner Bank Syndicate up to ₹2 Cr).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">₹</span>
              <input
                type="number"
                min={1000}
                max={2000000}
                step={1000}
                value={marginMoney || ''}
                onChange={e => {
                  const val = Math.max(0, Math.min(2000000, Number(e.target.value) || 0));
                  setMarginMoney(val);
                }}
                className="w-36 pl-7 pr-2.5 py-1.5 rounded-xl border border-border/80 bg-background text-foreground font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-gold-400"
                placeholder="Enter Margin"
              />
            </div>
            <div className="text-right">
              <div className="text-sm sm:text-base font-mono font-bold text-gold-400">
                {formatCurrency(marginMoney)}
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">
                Project Cost: <strong className="text-foreground">{formatCurrency(structure.totalProjectCost)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Presets based on active tier */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase flex-wrap gap-1">
            <span>
              {isMicroFinance
                ? 'Track A Micro Finance Presets (≤ ₹1.40L Cost):'
                : isTermLoan
                ? 'Track B Term Loan Presets (₹1.40L – ₹50L Cost):'
                : 'Commercial Bank Syndicate Presets (> ₹50L to ₹2 Cr):'}
            </span>
            <span className="text-xs font-normal normal-case text-gold-400">
              {isMicroFinance
                ? '6.5% Interest · 3 Yrs · 3-Mo Moratorium'
                : isTermLoan
                ? '8.0% Interest · 7 Yrs · 6-Mo Moratorium'
                : '8.75% Institutional · 7 Yrs · Credit Appraisal'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(isMicroFinance
              ? PRESET_MARGINS_MICRO
              : isTermLoan
              ? PRESET_MARGINS_TERM
              : PRESET_MARGINS_SYNDICATE
            ).map(p => (
              <button
                key={p.value}
                onClick={() => setMarginMoney(p.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                  marginMoney === p.value
                    ? 'bg-gold-500 text-brand-dark font-bold border-gold-400 shadow-sm'
                    : 'bg-muted/40 hover:bg-muted/70 text-muted-foreground border-border/80'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Continuous 0-1000 Slider with Wheel Support & Visual Range Guides */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs flex-wrap gap-1">
            <span className="font-mono text-[11px] text-muted-foreground">
              Calibrate Outlay (drag slider or scroll mouse wheel anywhere inside this console):
            </span>
            <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
              isMicroFinance
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : isTermLoan
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {isMicroFinance
                ? '● Active: Track A (MoSJE Micro Finance ≤ ₹1.40L @ 6.5%)'
                : isTermLoan
                ? '● Active: Track B (MoSJE Term Loan ₹1.40L – ₹50L @ 8.0%)'
                : '● Active: Bank Syndicate (No Govt Scheme > ₹50L @ 8.75%)'}
            </span>
          </div>

          {/* 3-Tier Visual Accent Track */}
          <div className="grid grid-cols-10 h-1.5 rounded-full overflow-hidden bg-muted/70">
            <div className="col-span-3 sm:col-span-4 bg-emerald-500/70" title="Track A: Micro Finance (≤ ₹1.40L)" />
            <div className="col-span-4 sm:col-span-3 bg-blue-500/70" title="Track B: Term Loan (₹1.40L – ₹50L)" />
            <div className="col-span-3 bg-amber-500/70" title="Bank Syndicate (₹50L – ₹2 Cr)" />
          </div>

          <input
            type="range"
            min={0}
            max={1000}
            step={1}
            value={marginToSlider(marginMoney)}
            onChange={e => setMarginMoney(sliderToMargin(Number(e.target.value)))}
            className="w-full accent-gold-500 cursor-pointer h-2 bg-muted rounded-lg"
            title="Slide or scroll mouse wheel to change project capital"
          />

          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span className={isMicroFinance ? 'text-emerald-400 font-bold' : ''}>
              Min: ₹10k (Track A)
            </span>
            <span className={isMicroFinance ? 'text-emerald-400 font-bold' : ''}>
              ₹1.40L (Track A Cap)
            </span>
            <span className={isTermLoan ? 'text-blue-400 font-bold' : ''}>
              ₹50.00L (MoSJE Max Cap)
            </span>
            <span className={isBankSyndicate ? 'text-amber-400 font-bold' : ''}>
              ₹2.00 Cr (Bank Syndicate)
            </span>
          </div>
        </div>
      </div>

      {/* Module 2: Financial Structuring & KPI Output Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Project Cost */}
        <div className="p-4 rounded-2xl border border-border/80 bg-card/60 shadow-sm space-y-1">
          <div className="text-[10px] uppercase font-mono text-muted-foreground font-bold flex items-center justify-between">
            <span>Total Feasible Project Cost</span>
            <Coins size={14} className="text-foreground/70" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-foreground">
            {formatCurrency(structure.totalProjectCost)}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono">Margin Capital / 10%</div>
        </div>

        {/* Card 2: Eligible Loan */}
        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 shadow-sm space-y-1">
          <div className="text-[10px] uppercase font-mono text-emerald-400 font-bold flex items-center justify-between">
            <span>{isBankSyndicate ? '90% Bank Syndicate Loan' : '90% Concessional Loan'}</span>
            <Landmark size={14} className="text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">
            {formatCurrency(structure.eligibleLoanAmount)}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono">
            {isBankSyndicate ? 'VyaparMap Partner Bank Window (Credit Appraisal)' : 'SCA Concessional Credit Window'}
          </div>
        </div>

        {/* Card 3: Concessional Rate & Tenure */}
        <div className={`p-4 rounded-2xl border shadow-sm space-y-1 ${
          isMicroFinance
            ? 'border-emerald-500/30 bg-emerald-500/5'
            : isTermLoan
            ? 'border-blue-500/30 bg-blue-500/5'
            : 'border-amber-500/30 bg-amber-500/5'
        }`}>
          <div className="text-[10px] uppercase font-mono text-muted-foreground font-bold flex items-center justify-between">
            <span>{isBankSyndicate ? 'Commercial Bank Rate' : 'Subsidized Interest Rate'}</span>
            <Percent size={14} className={isMicroFinance ? "text-emerald-400" : isTermLoan ? "text-blue-400" : "text-amber-400"} />
          </div>
          <div className={`text-xl sm:text-2xl font-mono font-bold ${
            isMicroFinance ? 'text-emerald-400' : isTermLoan ? 'text-blue-400' : 'text-amber-400'
          }`}>
            {structure.scheme.interestRatePerAnnum}% <span className="text-xs font-normal">p.a.</span>
          </div>
          <div className="text-[10px] text-muted-foreground font-mono">
            {isBankSyndicate
              ? 'Institutional Rate · CIBIL 680+ Required'
              : `Tenure: ${structure.scheme.tenureYears} Years (${structure.scheme.tenureMonths} Mo)`}
          </div>
        </div>

        {/* Card 4: Moratorium Grace Period */}
        <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/5 shadow-sm space-y-1">
          <div className="text-[10px] uppercase font-mono text-purple-400 font-bold flex items-center justify-between">
            <span>Moratorium Grace Period</span>
            <Clock size={14} className="text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-purple-400">
            {structure.scheme.moratoriumMonths} Months
          </div>
          <div className="text-[10px] text-muted-foreground font-mono">Zero principal during setup phase</div>
        </div>
      </div>

      {/* Scheme Decision Card with Dual Action Buttons */}
      <div className="p-6 rounded-2xl border border-gold-500/30 bg-gradient-to-br from-gold-500/10 via-card to-card space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                isMicroFinance
                  ? 'bg-emerald-500 text-brand-dark'
                  : isTermLoan
                  ? 'bg-blue-600 text-white'
                  : 'bg-amber-500 text-brand-dark'
              }`}>
                {isMicroFinance
                  ? 'Track A: Micro Finance Auto-Selected'
                  : isTermLoan
                  ? 'Track B: Term Loan Auto-Selected'
                  : 'No Govt Scheme (> ₹50L) — Commercial Bank Syndicate'}
              </span>
              <span className="text-xs font-mono font-bold text-gold-400">
                Project Cost: {formatCurrency(structure.totalProjectCost)}
              </span>
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {structure.scheme.title} ({structure.scheme.hindiTitle})
            </h3>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              {structure.scheme.description}
            </p>
          </div>

          {/* Dual Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
            {isBankSyndicate ? (
              <div
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 font-semibold text-xs cursor-help"
                title="MoSJE government concessional subsidies are capped at ₹50.00 Lakh. Above ₹50L, partner bank co-lending is used."
              >
                <Info size={13} className="text-amber-400" />
                <span>Govt Scheme Capped at ₹50L</span>
              </div>
            ) : (
              <a
                href={structure.scheme.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted/70 text-foreground font-semibold text-xs shadow-sm transition-all"
                title="Apply on official government portal"
              >
                <span>Official Govt Portal</span>
                <ExternalLink size={12} className="text-muted-foreground" />
              </a>
            )}

            <Button
              variant="gold"
              size="md"
              onClick={() => setShowApplicationModal(true)}
              className="text-xs font-bold gap-1.5 shadow-sm"
              title={isBankSyndicate ? "Apply for partner bank credit evaluation and CGTMSE cover" : "Submit application directly to VyaparMap SQL Vault"}
            >
              <Send size={13} />
              <span>{isBankSyndicate ? 'Apply via Partner Banks' : 'Apply on VyaparMap'}</span>
            </Button>
          </div>
        </div>

        {/* Capital Allocation: 60% Capex vs 40% Opex Breakdown */}
        <div className="pt-4 border-t border-border/60">
          <h4 className="text-xs font-mono font-bold text-muted-foreground uppercase mb-3 flex items-center gap-1.5">
            <Coins size={14} className="text-gold-400" />
            <span>Recommended Capital Allocation Breakdown</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-background/80 border border-border/70 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-foreground">60% Capital Expenditure (Capex)</span>
                <span className="font-mono text-gold-400">{formatCurrency(structure.capexEquipmentAllocation)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Machinery, tooling, equipment & long-term asset creation.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-background/80 border border-border/70 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-foreground">40% Working Capital Buffer (Opex)</span>
                <span className="font-mono text-blue-400">{formatCurrency(structure.workingCapitalAllocation)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Raw material procurement, initial wages & cashflow cushion.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quarterly Amortization & Moratorium Schedule */}
      <div className="p-6 rounded-2xl border border-border/80 bg-card shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-gold-400" />
              <span>Quarterly Repayment Schedule & Moratorium Breakdown</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Quarterly reducing balance schedule factoring in the {structure.scheme.moratoriumMonths}-month zero-principal grace period.
            </p>
          </div>

          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="flex items-center gap-1 text-xs font-mono text-gold-400 hover:text-gold-300"
          >
            <span>{showSchedule ? 'Hide Table' : 'Show Full Schedule'}</span>
            {showSchedule ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Daily & Monthly Equivalent Load Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/60 text-xs font-mono">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">Daily Cashflow Load</div>
            <div className="font-bold text-foreground text-sm mt-0.5">
              ₹{Math.round(structure.monthlyEmiPostMoratorium / 30).toLocaleString('en-IN')}/day
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">Monthly Equivalent Load</div>
            <div className="font-bold text-foreground text-sm mt-0.5">
              ₹{structure.monthlyEmiPostMoratorium.toLocaleString('en-IN')}/mo
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">Post-Moratorium Quarterly EMI</div>
            <div className="font-bold text-emerald-400 text-sm mt-0.5">
              ₹{structure.quarterlyInstallment.toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">Commercial Bank Interest Saved</div>
            <div className="font-bold text-gold-400 text-sm mt-0.5">
              ₹{Math.round(structure.eligibleLoanAmount * (0.13 - structure.scheme.interestRatePerAnnum / 100) * structure.scheme.tenureYears).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        {showSchedule && (
          <div className="overflow-x-auto rounded-xl border border-border/70 max-h-80">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-[10px] uppercase font-mono text-muted-foreground sticky top-0">
                <tr>
                  <th className="px-3 py-2.5">Quarter</th>
                  <th className="px-3 py-2.5">Principal Paid</th>
                  <th className="px-3 py-2.5">Interest Paid</th>
                  <th className="px-3 py-2.5">Total Installment</th>
                  <th className="px-3 py-2.5">Remaining Balance</th>
                  <th className="px-3 py-2.5">Phase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono">
                {structure.repaymentQuarters.slice(0, 16).map(q => (
                  <tr key={q.quarterNumber} className={q.isMoratorium ? 'bg-purple-500/5' : 'hover:bg-muted/30'}>
                    <td className="px-3 py-2 font-bold">{q.quarterLabel}</td>
                    <td className="px-3 py-2 font-semibold text-emerald-400">₹{q.principalPayment.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 text-muted-foreground">₹{q.interestPayment.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 font-bold text-foreground">₹{q.totalInstallment.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2">₹{q.remainingBalance.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2">
                      {q.isMoratorium ? (
                        <span className="px-2 py-0.5 rounded text-[9px] bg-purple-500/20 text-purple-300 font-bold">
                          Moratorium (Grace)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-bold">
                          Amortization
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Modal */}
      <LoanApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        structure={structure}
      />
    </div>
  );
}
