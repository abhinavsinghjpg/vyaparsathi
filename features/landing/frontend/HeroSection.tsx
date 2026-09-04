import { useNavigate } from 'react-router-dom';
import { ParticleSphere } from './ParticleSphere';
import { Button } from '@/components/Button';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

export function HeroSection() {
  const navigate = useNavigate();

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
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-semibold">
              Location Intelligence for Founders
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-foreground leading-[1.12]">
              Build your venture on{' '}
              <span className="text-gold-400 font-serif italic">evidence</span>, not instinct.
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
              VyaparMap ranks streets, clusters, and catchments through competition, demographics, and footfall so every lease decision is disciplined before capital is locked.
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
                onClick={() => navigate('/map')}
                className="gap-2"
              >
                <Compass size={16} /> Explore Live Map
              </Button>

              <button
                onClick={() => navigate('/analytics')}
                className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-gold-400 transition-colors ml-2 py-2"
              >
                View Scoreboard →
              </button>
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
              <h3 className="text-xl font-bold font-mono text-gold-400 mt-0.5">8.9 / 10</h3>
              <p className="text-xs text-foreground/80 mt-1">Koramangala Cafe Cluster</p>
            </div>

            {/* Bottom Metric Overlay */}
            <div className="absolute bottom-8 left-4 sm:left-10 p-4 rounded-xl border border-border/80 bg-card/90 backdrop-blur-md shadow-xl text-left max-w-xs animate-fade-in pointer-events-none">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Est. Daily Footfall
              </p>
              <h3 className="text-xl font-bold font-mono text-emerald-400 mt-0.5">14.2k</h3>
              <p className="text-xs text-foreground/80 mt-1">Balanced weekday + weekend demand</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

