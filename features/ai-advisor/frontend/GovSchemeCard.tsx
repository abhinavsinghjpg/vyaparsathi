import { useEffect, useState } from 'react';
import { Landmark, Award, ExternalLink, ShieldCheck, CheckCircle2, MapPin, IndianRupee } from 'lucide-react';
import {
  governmentDataService,
  type GovSchemeRecommendation,
} from '@/features/government-data/frontend/governmentData.service';
import type { PostalApiResponse, PostalOfficeInfo } from '@/types/schema';
import { formatCurrency } from '@/components/utils';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';

interface GovSchemeCardProps {
  shopType: string;
  location: string;
  budget: number;
}

export function GovSchemeCard({ shopType, location, budget }: GovSchemeCardProps) {
  const [recommendation, setRecommendation] = useState<GovSchemeRecommendation | null>(null);
  const [postalInfo, setPostalInfo] = useState<PostalOfficeInfo | null>(null);
  const [postalLoading, setPostalLoading] = useState(false);

  // Extract potential 6-digit pincode or use locality
  const pincodeMatch = location.match(/\b\d{6}\b/);
  const detectedPincode = pincodeMatch ? pincodeMatch[0] : null;

  useEffect(() => {
    // 1. Calculate matching Government MSME scheme & subsidies
    const rec = governmentDataService.matchGovScheme(shopType, budget, location);
    setRecommendation(rec);

    // 2. Fetch official India Post jurisdiction
    setPostalLoading(true);
    const fetchPostal = async () => {
      try {
        let res: PostalApiResponse;
        if (detectedPincode) {
          res = await governmentDataService.fetchPincodeData(detectedPincode);
        } else {
          // If no pincode in string, search by locality/corridor
          const area = location.split(',')[0].trim();
          res = await governmentDataService.searchPostalZones(area);
        }

        if (res.Status === 'Success' && res.PostOffice && res.PostOffice.length > 0) {
          setPostalInfo(res.PostOffice[0]);
        }
      } catch (e) {
        console.warn('Postal lookup error', e);
      } finally {
        setPostalLoading(false);
      }
    };

    fetchPostal();
  }, [shopType, location, budget, detectedPincode]);

  if (!recommendation) return null;

  const scheme = recommendation.primaryScheme;

  return (
    <div className="p-6 rounded-2xl border border-gold-500/40 bg-gradient-to-br from-card via-card/90 to-gold-950/20 shadow-md space-y-6">
      {/* Header with National Emblems & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0 shadow-inner">
            <Landmark size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="gold" className="text-[10px] font-mono tracking-wider uppercase flex items-center gap-1">
                <ShieldCheck size={11} /> Official Govt of India Data
              </Badge>
              <span className="text-xs font-mono text-muted-foreground">{scheme.ministry}</span>
            </div>
            <h3 className="text-xl font-bold font-serif text-foreground mt-0.5">
              MSME Scheme & Capital Subsidy Advisor
            </h3>
          </div>
        </div>

        {/* Live Postal Badge */}
        {postalInfo && (
          <div className="p-2.5 px-3 rounded-xl bg-muted/50 border border-border/80 text-xs font-mono flex items-center gap-2">
            <MapPin size={14} className="text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase">Postal Division (Govt API)</div>
              <div className="font-bold text-foreground truncate max-w-[200px]">
                {postalInfo.division} ({postalInfo.pincode})
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Scheme Highlight Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Matched: {scheme.code}
            </span>
            <span className="text-xs text-muted-foreground">· {scheme.name}</span>
          </div>

          <p className="text-sm text-foreground/90 font-medium leading-relaxed">
            {recommendation.recommendationReason}
          </p>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {scheme.benefitSummary}
          </p>
        </div>

        {/* Subsidy / Loan Calculation Callout */}
        <div className="md:col-span-4 p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 space-y-2 text-center">
          <div className="text-[11px] font-mono uppercase tracking-wider text-gold-400 font-bold">
            {recommendation.eligibleSubsidyPct > 0 ? 'Eligible Capital Subsidy' : 'Max Assistance Cap'}
          </div>
          <div className="text-2xl font-bold font-mono text-foreground flex items-center justify-center gap-1">
            <IndianRupee size={20} className="text-gold-400" />
            {recommendation.eligibleSubsidyPct > 0
              ? formatCurrency(recommendation.estimatedSubsidyAmount).replace('₹', '')
              : scheme.maxAssistance}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {recommendation.eligibleSubsidyPct > 0
              ? `${recommendation.eligibleSubsidyPct}% non-repayable government grant`
              : 'Collateral-free institutional bank financing'}
          </div>
        </div>
      </div>

      {/* Capital Structure Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-card border border-border/80 text-xs">
        <div className="space-y-1">
          <div className="text-[10px] uppercase font-mono text-muted-foreground">Promoter Equity (You)</div>
          <div className="text-base font-bold font-mono text-blue-400">
            {formatCurrency(recommendation.promoterRequiredContribution)} (10%)
          </div>
          <div className="text-[10px] text-muted-foreground">Minimum down payment required</div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] uppercase font-mono text-muted-foreground">Govt Capital Grant (PMEGP)</div>
          <div className="text-base font-bold font-mono text-emerald-400">
            {recommendation.eligibleSubsidyPct > 0
              ? `${formatCurrency(recommendation.estimatedSubsidyAmount)} (${recommendation.eligibleSubsidyPct}%)`
              : 'Interest Subvention'}
          </div>
          <div className="text-[10px] text-muted-foreground">Direct government margin deposit</div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] uppercase font-mono text-muted-foreground">Bank Term Loan (MUDRA/CGTMSE)</div>
          <div className="text-base font-bold font-mono text-purple-400">
            {formatCurrency(recommendation.bankFinancedAmount)}
          </div>
          <div className="text-[10px] text-muted-foreground">Zero-collateral bank financing</div>
        </div>
      </div>

      {/* Official Udyam Statutory Benefits Checklist */}
      <div className="space-y-2">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Award size={13} className="text-gold-400" />
          Statutory Udyam MSME Registration Entitlements
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recommendation.udyamBenefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg border border-border/40">
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Official Government Portals Direct Links */}
      <div className="pt-2 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          Apply online through the Government of India single-window credit portal:
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <a
            href="https://www.jansamarth.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial"
          >
            <Button variant="gold" size="sm" className="w-full gap-1.5 font-bold">
              Apply on JanSamarth Portal <ExternalLink size={13} />
            </Button>
          </a>

          <a
            href={scheme.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial"
          >
            <Button variant="outline" size="sm" className="w-full gap-1.5">
              Official Portal <ExternalLink size={13} />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

