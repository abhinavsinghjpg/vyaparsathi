import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { ArrowRight, Compass, Sparkles, Landmark, ShieldCheck } from 'lucide-react';
import { ParticleSphere } from './ParticleSphere';

const HOMEPAGE_CLUSTERS = [
  {
    clusterName: 'Koramangala 5th Block, Bengaluru',
    opportunityIndex: '9.2 / 10',
    footfall: '14.8k',
    footfallDetail: 'Peak student & tech professional walk-ins',
  },
  {
    clusterName: 'C-Scheme (Subhash Marg), Jaipur',
    opportunityIndex: '8.9 / 10',
    footfall: '11.4k',
    footfallDetail: 'High discretionary spend & evening surge',
  },
  {
    clusterName: 'Connaught Place Inner Circle, Delhi',
    opportunityIndex: '9.6 / 10',
    footfall: '24.5k',
    footfallDetail: 'High transit interchange footfall density',
  },
  {
    clusterName: 'Bandra West (Linking Road), Mumbai',
    opportunityIndex: '9.4 / 10',
    footfall: '21.2k',
    footfallDetail: 'Premium fashion & culinary retail corridor',
  },
  {
    clusterName: 'FC Road Promenade, Pune',
    opportunityIndex: '8.8 / 10',
    footfall: '13.6k',
    footfallDetail: 'Campus student density & weekend retail',
  },
  {
    clusterName: 'Banjara Hills Road No. 12, Hyderabad',
    opportunityIndex: '9.1 / 10',
    footfall: '12.8k',
    footfallDetail: 'Affluent luxury retail & fine dining demand',
  },
  {
    clusterName: 'T. Nagar (Pondy Bazaar), Chennai',
    opportunityIndex: '9.3 / 10',
    footfall: '27.4k',
    footfallDetail: 'Heavy regional retail & festival shopping density',
  },
];

export function HeroSection() {
  const navigate = useNavigate();
  const [cluster] = useState(() => {
    const randIdx = Math.floor(Math.random() * HOMEPAGE_CLUSTERS.length);
    return HOMEPAGE_CLUSTERS[randIdx];
  });

  return (
    <div className="relative overflow-hidden pt-6 pb-16 lg:pb-24 border-b border-border/80">
      {/* Top Hero Navigation Header (matching Images 1 & 3) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 mb-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center font-serif font-black text-brand-dark text-xs shadow-md shadow-gold-500/20">
            VM
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
              Modern Monarchy
            </p>
            <p className="text-sm font-bold text-foreground tracking-tight">
              Vyapar<span className="text-gold-400">Map</span>
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-muted-foreground">
          <a href="#method" className="hover:text-gold-400 transition-colors">Method</a>
          <a href="#intelligence" className="hover:text-gold-400 transition-colors">Intelligence</a>
          <a href="#evidence" className="hover:text-gold-400 transition-colors">Evidence</a>
          <button onClick={() => navigate('/loans')} className="hover:text-gold-400 transition-colors uppercase font-mono flex items-center gap-1.5 text-gold-400/90 font-semibold">
            <Landmark size={13} /> MoSJE Credit
          </button>
        </nav>

        <Button
          variant="gold"
          size="sm"
          onClick={() => navigate('/ai-advisor')}
          className="tracking-wider uppercase font-bold text-xs"
        >
          Enter Advisor
        </Button>
      </div>

      {/* Hero Grid (Image 3) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-[11px] font-mono tracking-wide text-gold-400">
              <ShieldCheck size={14} className="text-gold-400" />
              <span>SIH 2024 Problem 26091 • MoSJE Concessional Credit</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-foreground leading-[1.12]">
              Build your venture on{' '}
              <span className="text-gold-400 font-serif italic">evidence</span>, not instinct.
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
              VyaparMap delivers hyper-local feasibility advisory, 5–10km reach analysis, and statutory 10% Margin Money concessional credit routing (Micro Finance & Term Loan) for rural and micro-entrepreneurs.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="gold"
                size="lg"
                onClick={() => navigate('/ai-advisor')}
                className="gap-2"
              >
                <Sparkles size={16} /> Run AI Analysis
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/loans')}
                className="gap-2 border-gold-500/30 text-gold-400 hover:bg-gold-500/10"
              >
                <Landmark size={16} /> MoSJE Credit Schemes
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate('/map')}
                className="gap-2"
              >
                <Compass size={16} /> Map Explorer
              </Button>
            </div>
          </div>

          {/* Right Column: 3D Visual + Floating Overlays (Image 3) */}
          <div className="lg:col-span-6 relative">
            <ParticleSphere />

            {/* Top Metric Overlay */}
            <div className="absolute top-8 right-4 sm:right-10 p-4 rounded-xl border border-border/80 bg-card/90 backdrop-blur-md shadow-xl text-left max-w-xs animate-fade-in pointer-events-none">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Opportunity Index
              </p>
              <h3 className="text-xl font-bold font-mono text-gold-400 mt-0.5">{cluster.opportunityIndex}</h3>
              <p className="text-xs text-foreground/80 mt-1 font-semibold">{cluster.clusterName}</p>
            </div>

            {/* Bottom Metric Overlay */}
            <div className="absolute bottom-8 left-4 sm:left-10 p-4 rounded-xl border border-border/80 bg-card/90 backdrop-blur-md shadow-xl text-left max-w-xs animate-fade-in pointer-events-none">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Est. Daily Footfall
              </p>
              <h3 className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{cluster.footfall}</h3>
              <p className="text-xs text-foreground/80 mt-1">{cluster.footfallDetail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

