import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, RotateCcw, MapPin, Compass, Sparkles } from 'lucide-react';
import { AdvisorForm } from './AdvisorForm';
import { ScoreRing } from './ScoreRing';
import { BreakdownCards } from './BreakdownCards';
import { ProsConsCard } from './ProsConsCard';
import { CompetitorsList } from './CompetitorsList';
import { ProfitabilityCard } from './ProfitabilityCard';
import { GovSchemeCard } from './GovSchemeCard';
import { SIHFeasibilityCard } from './SIHFeasibilityCard';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { aiAdvisorService, type AdvisorAnalysisInput, type AdvisorAnalysisResult } from './aiAdvisor.service';

export function AIAdvisorPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdvisorAnalysisResult | null>(null);

  const handleRunAnalysis = async (input: AdvisorAnalysisInput) => {
    setLoading(true);
    try {
      const res = await aiAdvisorService.runAnalysis(input);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* 1. Page Header (Image 2) */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-[11px] font-mono font-bold tracking-widest text-gold-400 uppercase">
          <Zap size={12} /> Powered by Gemini AI
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
          AI Location Advisor
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Enter your location, shop type, size and budget. Our AI will analyze rent, footfall, competition, 5-year growth, and give you an{' '}
          <strong className="text-foreground">overall rating out of 5</strong>.
        </p>
      </div>

      {/* 2. Main Content Grid */}
      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Form (Image 2) */}
          <div className="lg:col-span-7">
            <AdvisorForm onSubmit={handleRunAnalysis} isLoading={loading} />
          </div>

          {/* Right Column: Explanatory Info & Example Output (Image 2) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-6 shadow-sm">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">
                What We Analyze
              </h3>

              <div className="space-y-4">
                {[
                  { icon: '📍', title: 'Average Rent/sqft', desc: 'Live rent benchmark for that target micro-market' },
                  { icon: '👣', title: 'Footfall Density', desc: 'Pedestrian & customer traffic volume patterns' },
                  { icon: '📈', title: '5-Year Growth', desc: 'Expected footfall compound growth over 5 years' },
                  { icon: '🏪', title: 'Competitor Count', desc: 'Number of active matching outlets in immediate vicinity' },
                  { icon: '💼', title: 'Major Competitors', desc: 'Dominant regional brands and national chains present' },
                  { icon: '⭐', title: 'Overall Rating / 5', desc: 'Composite AI success score with pros and cons' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-3 text-xs">
                    <span className="text-base select-none">{item.icon}</span>
                    <div>
                      <div className="font-semibold text-foreground">{item.title}</div>
                      <div className="text-muted-foreground text-[11px] leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Example Output Card (Image 2) */}
              <div className="p-4 rounded-xl border border-border/80 bg-muted/40 space-y-3 pt-4">
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Example Output
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-foreground">Cafe · Koramangala, BLR</span>
                  <span className="text-xs font-bold font-mono text-emerald-400">4.3 / 5</span>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground font-mono">
                  <div className="flex justify-between">
                    <span>☕ Rent/sqft</span>
                    <span className="text-foreground">₹95</span>
                  </div>
                  <div className="flex justify-between">
                    <span>👣 Footfall</span>
                    <span className="text-emerald-400 font-semibold">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span>📈 5yr Growth</span>
                    <span className="text-foreground">+42%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🏪 Competitors</span>
                    <span className="text-foreground">14</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Result View */
        <div className="space-y-8 animate-fade-in">
          {/* Result Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-card shadow-sm">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="green" className="font-mono text-[10px]">
                  Commercial Feasibility Complete
                </Badge>
                <Badge variant="gold" className="font-mono text-[10px] flex items-center gap-1">
                  <Sparkles size={11} /> {result.financials ? result.financials.engineUsed : 'Gemini AI Engine'}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">
                  Google Maps Scanned
                </span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-foreground mt-1">
                {result.shopType}
              </h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5" title={result.fullAddress}>
                <MapPin size={13} className="text-gold-400 shrink-0" />{' '}
                <span className="truncate max-w-lg">{result.fullAddress || result.location}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResult(null)}
                className="gap-1.5"
              >
                <RotateCcw size={14} /> New Analysis
              </Button>
              <Button
                variant="gold"
                size="sm"
                onClick={() => navigate('/map')}
                className="gap-1.5"
              >
                <Compass size={14} /> Explore On Map
              </Button>
            </div>
          </div>

          {/* Viability Score + Recommendation */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl border border-border/80 bg-card items-center shadow-sm">
            <div className="md:col-span-4 flex justify-center py-2">
              <ScoreRing score={result.overallRating} size={160} label={result.ratingLabel} />
            </div>

            <div className="md:col-span-8 space-y-3">
              <div className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold">
                Commercial Feasibility Verdict
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {result.recommendation}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {result.highlights.map(h => (
                  <Badge key={h} variant="gold" className="text-xs">
                    {h}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Core Commercial Profitability & Unit Economics Card */}
          {result.financials && (
            <ProfitabilityCard
              financials={result.financials}
              shopType={result.shopType}
              location={result.location}
              googleMapsUrl={result.googleMapsUrl}
            />
          )}

          {/* SIH 26091: Hyper-Local Strategic Advisory (MoSJE Module 1) */}
          <SIHFeasibilityCard
            report={result.sihFeasibility || result.financials?.sihFeasibility}
            locationName={result.location}
            categoryName={result.shopType}
            totalBudget={result.budget}
          />

          {/* Official Government MSME Scheme & Subsidy Advisor */}
          <GovSchemeCard
            shopType={result.shopType}
            location={result.location}
            budget={result.budget}
          />

          {/* Metric Breakdown Cards */}
          <BreakdownCards result={result} />

          {/* Pros & Cons */}
          <ProsConsCard pros={result.pros} cons={result.cons} />

          {/* Established Competitors */}
          <CompetitorsList competitors={result.majorCompetitors} />
        </div>
      )}
    </div>
  );
}

