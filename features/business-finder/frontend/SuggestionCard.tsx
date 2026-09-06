import { useState } from 'react';
import { ExternalLink, Sparkles, Landmark, Send, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { BusinessFinderOutput } from './businessFinder.service';
import { governmentDataService } from '@/features/government-data/frontend/governmentData.service';
import { formatCurrency } from '@/components/utils';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { BusinessInquiryModal } from './BusinessInquiryModal';

export function SuggestionCard({ biz, rank }: { biz: BusinessFinderOutput; rank: number }) {
  const navigate = useNavigate();
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const compBadgeColor =
    biz.competition === 'Low' ? 'green' : biz.competition === 'Medium' ? 'orange' : 'red';

  return (
    <div
      className={`p-6 rounded-2xl border transition-all duration-200 space-y-4 ${
        biz.affordable
          ? 'border-border/80 bg-card hover:border-gold-500/40 shadow-sm'
          : 'border-border/40 bg-card/40 opacity-75'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2 rounded-xl bg-muted/50 select-none">{biz.emoji}</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold text-muted-foreground">
                Rank #{rank}
              </span>
              {biz.isActualData && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  Verified Live Model
                </span>
              )}
              <Badge variant={compBadgeColor} className="text-[10px]">
                {biz.competition} Competition
              </Badge>
              {biz.agglomerationIndex && biz.agglomerationIndex >= 8.0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-bold">
                  ★ Agglomeration Advantage ({biz.agglomerationIndex}/10)
                </span>
              )}
              {biz.sourceBadge && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-400 border border-gold-500/30">
                  {biz.sourceBadge}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-foreground mt-0.5">{biz.name}</h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-gold-400">
            {biz.matchScore}% Match
          </span>
          <div className="mt-1">
            {biz.affordable ? (
              <Badge variant="green" className="text-[10px]">
                Within Budget
              </Badge>
            ) : (
              <Badge variant="red" className="text-[10px]">
                Requires Capital
              </Badge>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {biz.description}
      </p>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-muted/40 border border-border/50 text-xs">
        <div>
          <div className="text-[10px] text-muted-foreground uppercase font-mono">Startup Cost</div>
          <div className="font-bold font-mono text-blue-400 mt-0.5">
            {formatCurrency(biz.startupCost)}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground uppercase font-mono">Est. Revenue</div>
          <div className="font-bold font-mono text-emerald-400 mt-0.5">
            {formatCurrency(biz.monthlyRevenue)} /mo
          </div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground uppercase font-mono">Payback ROI</div>
          <div className="font-bold font-mono text-purple-400 mt-0.5">
            {biz.roiMonths} Months
          </div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground uppercase font-mono">Openness Score</div>
          <div className="font-bold font-mono text-gold-400 mt-0.5">
            {biz.competitionScore} / 10
          </div>
        </div>
      </div>

      {/* Official Government MSME Scheme Match */}
      {(() => {
        const govScheme = governmentDataService.matchGovScheme(biz.name, biz.startupCost);
        return (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 px-3 rounded-xl bg-gold-500/10 border border-gold-500/25 text-xs">
            <div className="flex items-center gap-2">
              <Landmark size={14} className="text-gold-400 shrink-0" />
              <span className="text-foreground/90 font-medium">
                {govScheme.eligibleSubsidyPct > 0 ? (
                  <>
                    Govt MSME Capital Subsidy ({govScheme.primaryScheme.code}):{' '}
                    <strong className="text-emerald-400 font-mono font-bold">
                      {formatCurrency(govScheme.estimatedSubsidyAmount)}
                    </strong>{' '}
                    ({govScheme.eligibleSubsidyPct}% Grant)
                  </>
                ) : (
                  <>
                    Govt Credit Scheme ({govScheme.primaryScheme.code}):{' '}
                    <strong className="text-purple-400 font-mono font-bold">
                      {govScheme.primaryScheme.maxAssistance}
                    </strong>{' '}
                    Collateral-Free
                  </>
                )}
              </span>
            </div>
            <a
              href="https://www.jansamarth.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1 shrink-0 self-end sm:self-auto"
            >
              <span>JanSamarth Portal</span>
              <ExternalLink size={11} />
            </a>
          </div>
        );
      })()}

      {/* Bottom Action Row - Dual Action Buttons */}
      <div className="pt-2 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="text-[11px] text-muted-foreground italic truncate">
          Best Suited: <span className="text-foreground font-medium">{biz.bestSuitedFor}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Button 1: Apply on Official Portal */}
          <a
            href={biz.applyUrl || 'https://www.jansamarth.in/'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted/70 text-foreground font-semibold text-xs shadow-sm transition-all"
            title="Open official statutory portal (JanSamarth / KVIC / MoSJE / Brand)"
          >
            <span>Official Portal</span>
            <ExternalLink size={11} className="text-muted-foreground" />
          </a>

          {/* Button 2: Apply on VyaparMap */}
          <Button
            variant="gold"
            size="sm"
            onClick={() => setShowInquiryModal(true)}
            className="text-xs font-bold gap-1.5 shadow-sm"
            title="Register enterprise application directly in VyaparMap internal database"
          >
            <Send size={12} />
            <span>Apply on VyaparMap</span>
          </Button>

          {/* Bonus Quick AI Analysis */}
          <button
            type="button"
            onClick={() => navigate('/ai-advisor')}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-gold-400 hover:bg-gold-500/10 transition-colors"
            title="Simulate viability in AI Advisor"
          >
            <Sparkles size={14} />
          </button>
        </div>
      </div>

      {/* Internal Onboarding Application Modal */}
      <BusinessInquiryModal
        biz={biz}
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
      />
    </div>
  );
}

