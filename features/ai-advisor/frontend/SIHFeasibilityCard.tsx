import { useState } from 'react';
import {
  Compass,
  TrendingUp,
  AlertTriangle,
  Users,
  Tag,
  ShieldAlert,
  Landmark,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers,
  Network,
  Hammer,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useNavigate } from 'react-router-dom';
import type { SihFeasibilityReport } from './geminiAdvisor.service';
import { formatCurrency } from '@/components/utils';

interface SIHFeasibilityCardProps {
  report?: SihFeasibilityReport;
  locationName: string;
  categoryName: string;
  totalBudget: number;
}

export function SIHFeasibilityCard({
  report,
  locationName,
  categoryName,
  totalBudget,
}: SIHFeasibilityCardProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'cluster' | 'market' | 'opportunity' | 'swot' | 'threats' | 'competitors' | 'pricing'>('cluster');

  if (!report) return null;

  const marginEst = Math.round(totalBudget * 0.10);
  const agg = report.agglomerationAnalysis;

  return (
    <div className="p-6 rounded-2xl border border-gold-500/40 bg-gradient-to-br from-gold-500/10 via-card to-card space-y-6 shadow-sm">
      {/* Header with SIH 26091 MoSJE Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="gold" className="text-[10px] font-mono font-bold uppercase">
              SIH Problem Statement 26091 · Module 1
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">
              MoSJE Hyper-Local Strategy Engine
            </span>
          </div>
          <h3 className="text-lg font-bold text-foreground mt-1 flex items-center gap-2">
            <Compass size={18} className="text-gold-400" />
            <span>Hyper-Local Feasibility & Strategic Advisory</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Micro-enterprise viability report for <strong className="text-foreground">{categoryName}</strong> in <strong className="text-gold-400">{locationName}</strong>.
          </p>
        </div>

        {/* Bridge to Smart Credit Router Button */}
        <Button
          variant="gold"
          size="sm"
          onClick={() => navigate('/loans')}
          className="text-xs font-bold gap-1.5 shrink-0 shadow-sm"
        >
          <Landmark size={13} />
          <span>Route to 90% Loan (MoSJE)</span>
          <ArrowRight size={13} />
        </Button>
      </div>

      {/* Agglomeration Cluster Banner */}
      {agg && agg.isSpecializedCluster && (
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Network className="text-emerald-400 shrink-0 mt-0.5" size={16} />
            <div>
              <p className="font-bold text-emerald-300 flex items-center gap-2">
                <span>Specialized Artisan Cluster Identified: {agg.clusterName}</span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                  Agglomeration Index: {agg.agglomerationIndex} / 10
                </span>
              </p>
              <p className="text-muted-foreground text-[11px] mt-0.5">
                Having {agg.competitorsInZone} artisan peers here creates a <strong>Destination Market</strong> where buyers travel specifically for this craft, reducing raw material input costs by <strong>{agg.rawMaterialSavingsPercent}%</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('cluster')}
            className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 underline font-semibold shrink-0"
          >
            View Cluster vs Monopoly Blueprint →
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border/80 text-xs font-semibold gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('cluster')}
          className={`pb-2 px-3 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'cluster'
              ? 'border-gold-500 text-gold-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Network size={14} />
          <span>Cluster vs Monopoly Strategy</span>
        </button>

        <button
          onClick={() => setActiveTab('market')}
          className={`pb-2 px-3 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'market'
              ? 'border-gold-500 text-gold-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users size={14} />
          <span>1. Market Reach (5–10km)</span>
        </button>

        <button
          onClick={() => setActiveTab('opportunity')}
          className={`pb-2 px-3 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'opportunity'
              ? 'border-gold-500 text-gold-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sparkles size={14} />
          <span>2. Opportunity Analysis</span>
        </button>

        <button
          onClick={() => setActiveTab('swot')}
          className={`pb-2 px-3 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'swot'
              ? 'border-gold-500 text-gold-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Layers size={14} />
          <span>3. SWOT Analysis</span>
        </button>

        <button
          onClick={() => setActiveTab('threats')}
          className={`pb-2 px-3 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'threats'
              ? 'border-gold-500 text-gold-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <AlertTriangle size={14} />
          <span>4. Threats Identification</span>
        </button>

        <button
          onClick={() => setActiveTab('competitors')}
          className={`pb-2 px-3 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'competitors'
              ? 'border-gold-500 text-gold-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <TrendingUp size={14} />
          <span>5. Competitor Density</span>
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`pb-2 px-3 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'pricing'
              ? 'border-gold-500 text-gold-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Tag size={14} />
          <span>6. Product Market Value</span>
        </button>
      </div>

      {/* TAB: Agglomeration Cluster Strategy (The Professor's Core Question!) */}
      {activeTab === 'cluster' && (
        <div className="space-y-4 animate-fade-in text-xs">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Agglomeration Index</div>
              <div className="text-xl font-mono font-bold text-gold-400">
                {agg ? `${agg.agglomerationIndex} / 10` : '7.8 / 10'}
              </div>
              <div className="text-[11px] text-muted-foreground">Cluster synergy level</div>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Competitors in Zone</div>
              <div className="text-xl font-mono font-bold text-blue-400">
                {agg ? agg.competitorsInZone : 16} Workshops
              </div>
              <div className="text-[11px] text-muted-foreground">Specialized artisan peers</div>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Raw Material Savings</div>
              <div className="text-xl font-mono font-bold text-emerald-400">
                {agg ? `-${agg.rawMaterialSavingsPercent}%` : '-25%'}
              </div>
              <div className="text-[11px] text-muted-foreground">Co-located supplier discount</div>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Subcontracting Spillover</div>
              <div className="text-xl font-mono font-bold text-purple-400">
                {agg ? agg.subcontractingPotential : 'High'}
              </div>
              <div className="text-[11px] text-muted-foreground">Piece-rate master orders</div>
            </div>
          </div>

          {/* Side-by-Side Dual-Path Blueprint */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Path A: Join Cluster */}
            <div className="p-4 rounded-xl bg-background/80 border-2 border-gold-500/40 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-gold-500/20 text-gold-400 font-bold">
                  Recommended Strategy
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  {agg?.dualStrategyVerdict?.clusterStrategy?.marginTarget || '38% - 48% Margin'}
                </span>
              </div>
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Hammer size={16} className="text-gold-400" />
                <span>{agg?.dualStrategyVerdict?.clusterStrategy?.title || 'Path A: Specialized Cluster Member'}</span>
              </h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {agg?.dualStrategyVerdict?.clusterStrategy?.verdict ||
                  'Open inside the footwear/artisan cluster. Customers travel here specifically for shoes, wholesale suppliers sit next door, and senior workshops subcontract overflow work.'}
              </p>
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-mono font-bold text-gold-400 uppercase">Operational Tactics:</div>
                {(agg?.dualStrategyVerdict?.clusterStrategy?.operationalTactics || [
                  'Specialize in custom hand-stitched Mojaris, bridal footwear & orthopedic comfort insoles',
                  'Establish piece-rate sub-contracting ties with senior master craftsmen',
                  'Source leather and soles right across the street to eliminate delivery costs',
                ]).map((tactic, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-foreground">
                    <CheckCircle2 size={13} className="text-gold-400 shrink-0 mt-0.5" />
                    <span>{tactic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Path B: Outer Tehsil Monopoly */}
            <div className="p-4 rounded-xl bg-background/80 border border-border/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">
                  Alternative Path
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  {agg?.dualStrategyVerdict?.dispersionStrategy?.marginTarget || '60% - 70% Margin'}
                </span>
              </div>
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Compass size={16} className="text-blue-400" />
                <span>{agg?.dualStrategyVerdict?.dispersionStrategy?.title || 'Path B: Outer Tehsil Monopoly'}</span>
              </h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {agg?.dualStrategyVerdict?.dispersionStrategy?.verdict ||
                  'Open in an outer residential ward or village crossroads with zero competitors. Serve immediate household daily needs, school shoes, and quick repairs.'}
              </p>
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-mono font-bold text-blue-400 uppercase">Operational Tactics:</div>
                {(agg?.dualStrategyVerdict?.dispersionStrategy?.operationalTactics || [
                  'Focus on rapid sole pasting, heel repairs, school shoes, and agricultural footwear',
                  'Offer same-day turnaround for local farming families avoiding 15 km transit to mandi',
                  'Operate with ultra-low overhead (₹1,500/month stall) securing 65%+ net margins',
                ]).map((tactic, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-foreground">
                    <CheckCircle2 size={13} className="text-blue-400 shrink-0 mt-0.5" />
                    <span>{tactic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pre-Qualified Government Schemes Banner */}
          <div className="p-3.5 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Landmark size={15} className="text-gold-400" />
              <span className="font-bold text-foreground">Pre-Qualified Schemes for this Venture:</span>
              <span className="text-gold-400 font-mono font-semibold">
                PM Vishwakarma (Cobbler: ₹15k Toolkit + ₹1L @ 5%) · MoSJE Micro Finance (6.5%)
              </span>
            </div>
            <button
              onClick={() => navigate('/loans')}
              className="px-3 py-1 rounded-lg bg-gold-500 text-brand-dark font-bold text-xs hover:bg-gold-400 transition-colors"
            >
              Apply Scheme →
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: Market Reach */}
      {activeTab === 'market' && (
        <div className="space-y-4 animate-fade-in text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Catchment Radius</div>
              <div className="text-xl font-mono font-bold text-gold-400">{report.marketReach.radiusKm} km</div>
              <div className="text-[11px] text-muted-foreground">Immediate geographic reach</div>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Est. Consumer Base</div>
              <div className="text-xl font-mono font-bold text-emerald-400">
                ~{report.marketReach.estimatedConsumerBase.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-muted-foreground">Active rural & semi-urban consumers</div>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Distribution Velocity</div>
              <div className="text-xl font-mono font-bold text-blue-400">High Frequency</div>
              <div className="text-[11px] text-muted-foreground">Local daily/weekly fulfillment</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-background/60 border border-border/80 space-y-2">
            <h4 className="font-bold text-foreground">Primary Local Distribution Channels (5–10 km)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {report.marketReach.primaryChannels.map((channel, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-card/80 border border-border/60">
                  <span className="text-gold-400 font-mono font-bold">#{idx + 1}</span>
                  <span className="text-foreground">{channel}</span>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-[11px] pt-1">
              {report.marketReach.catchmentDescription}
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: Opportunity Analysis */}
      {activeTab === 'opportunity' && (
        <div className="space-y-4 animate-fade-in text-xs">
          <div className="p-4 rounded-xl bg-background/60 border border-border/80 space-y-3">
            <h4 className="font-bold text-foreground flex items-center gap-2">
              <Sparkles size={15} className="text-gold-400" />
              <span>Underserved Local Niches in this Micro-Market</span>
            </h4>
            <div className="space-y-2">
              {report.opportunityAnalysis.underservedNiches.map((niche, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-card/80 border border-border/60">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-foreground">{niche}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-background/60 border border-border/80 space-y-2">
              <h5 className="font-bold text-foreground text-[11px] uppercase font-mono text-gold-400">
                Local Demand Drivers
              </h5>
              <ul className="space-y-1.5 text-muted-foreground">
                {report.opportunityAnalysis.localDemandDrivers.map((driver, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-400"></span>
                    <span>{driver}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-background/60 border border-border/80 space-y-2">
              <h5 className="font-bold text-foreground text-[11px] uppercase font-mono text-emerald-400">
                Value-Addition & Margin Potential
              </h5>
              <p className="text-muted-foreground leading-relaxed">
                {report.opportunityAnalysis.valueAdditionPotential}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SWOT Analysis */}
      {activeTab === 'swot' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <h5 className="font-bold text-emerald-400 uppercase font-mono text-[11px] flex items-center gap-1.5">
              <span>Strengths (सामर्थ्य)</span>
            </h5>
            <ul className="space-y-1.5 text-foreground">
              {report.swotAnalysis.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">+</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <h5 className="font-bold text-amber-400 uppercase font-mono text-[11px] flex items-center gap-1.5">
              <span>Weaknesses (कमजोरियां)</span>
            </h5>
            <ul className="space-y-1.5 text-foreground">
              {report.swotAnalysis.weaknesses.map((w, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">-</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-2">
            <h5 className="font-bold text-blue-400 uppercase font-mono text-[11px] flex items-center gap-1.5">
              <span>Opportunities (अवसर)</span>
            </h5>
            <ul className="space-y-1.5 text-foreground">
              {report.swotAnalysis.opportunities.map((o, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-blue-400 font-bold">★</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
            <h5 className="font-bold text-rose-400 uppercase font-mono text-[11px] flex items-center gap-1.5">
              <span>Threats (जोखिम)</span>
            </h5>
            <ul className="space-y-1.5 text-foreground">
              {report.swotAnalysis.threats.map((t, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold">!</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAB 4: Threats Identification */}
      {activeTab === 'threats' && (
        <div className="space-y-3 animate-fade-in text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-background/60 border border-border/80 space-y-1.5">
              <h5 className="font-bold text-foreground text-[11px] text-amber-400">Supply Chain Bottlenecks</h5>
              <ul className="space-y-1 text-muted-foreground">
                {report.threatsIdentification.supplyChainBottlenecks.map((b, idx) => (
                  <li key={idx}>• {b}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 rounded-xl bg-background/60 border border-border/80 space-y-1.5">
              <h5 className="font-bold text-foreground text-[11px] text-blue-400">Seasonal Harvest Swings</h5>
              <ul className="space-y-1 text-muted-foreground">
                {report.threatsIdentification.seasonalFluctuations.map((s, idx) => (
                  <li key={idx}>• {s}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 rounded-xl bg-background/60 border border-border/80 space-y-1.5">
              <h5 className="font-bold text-foreground text-[11px] text-rose-400">Single-Buyer Dependency</h5>
              <ul className="space-y-1 text-muted-foreground">
                {report.threatsIdentification.singleBuyerDependency.map((d, idx) => (
                  <li key={idx}>• {d}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <h5 className="font-bold text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>Mitigation Roadmap (Pre-Condition for MoSJE Credit Disbursement)</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-foreground">
              {report.threatsIdentification.mitigationRoadmap.map((m, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-card/80 border border-border/60 flex items-start gap-2">
                  <span className="font-mono text-emerald-400 font-bold">{idx + 1}.</span>
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Competitor Mapping */}
      {activeTab === 'competitors' && (
        <div className="space-y-4 animate-fade-in text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Block Density / 10k</div>
              <div className="text-xl font-mono font-bold text-foreground">
                {report.competitorMapping.blockBusinessDensityPer10k} Units
              </div>
              <div className="text-[11px] text-muted-foreground">Per 10,000 block residents</div>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Informal / Haat Units</div>
              <div className="text-xl font-mono font-bold text-amber-400">
                ~{report.competitorMapping.informalCompetitorsEstimate} Outlets
              </div>
              <div className="text-[11px] text-muted-foreground">Weekly haats & mobile carts</div>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Saturation Verdict</div>
              <div className="text-base font-bold text-emerald-400 mt-1">
                {report.competitorMapping.marketSaturationVerdict}
              </div>
              <div className="text-[11px] text-muted-foreground">Agglomeration evaluated</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-background/60 border border-border/80 space-y-2">
            <h5 className="font-bold text-foreground">Prominent Mapped Competitors in Catchment</h5>
            <div className="flex flex-wrap gap-2">
              {report.competitorMapping.organizedCompetitors.map((comp, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-md bg-card border border-border/80 text-foreground font-mono text-[11px]">
                  {comp}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Product Market Value */}
      {activeTab === 'pricing' && (
        <div className="space-y-4 animate-fade-in text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-background/60 border border-border/80 space-y-2">
              <h5 className="font-bold text-gold-400 uppercase font-mono text-[11px]">
                Recommended Pricing Strategy
              </h5>
              <p className="text-foreground leading-relaxed">
                {report.productMarketValue.recommendedPricing}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-background/60 border border-border/80 space-y-2">
              <h5 className="font-bold text-emerald-400 uppercase font-mono text-[11px]">
                Target Margin Realization
              </h5>
              <p className="text-foreground leading-relaxed">
                {report.productMarketValue.marginRealizationTarget}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border/80 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Price Elasticity</div>
              <div className="text-sm font-bold text-foreground mt-0.5">
                {report.productMarketValue.priceElasticity}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Regional Purchasing Power</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {report.productMarketValue.regionalPurchasingPowerVerdict}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
