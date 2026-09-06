import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from './HeroSection';
import { AnalysisCards } from './AnalysisCards';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { MapPin, ArrowRight, ShieldCheck, Database, Layers, CheckCircle2 } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  const [cityQuery, setCityQuery] = useState('');
  const [submittedCity, setSubmittedCity] = useState(false);

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityQuery) return;
    setSubmittedCity(true);
    setTimeout(() => {
      navigate('/ai-advisor');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-gold-500/20">
      {/* 1. Hero Section (Image 3) */}
      <HeroSection />

      {/* 2. Client Proof Bar */}
      <div className="border-b border-border/60 py-6 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-xs font-mono uppercase tracking-widest text-muted-foreground/70">
          <span>Google Maps Platform</span>
          <span>Google Gemini AI</span>
          <span>OpenStreetMap Live POIs</span>
          <span>PostgreSQL / PostGIS</span>
        </div>
      </div>

      {/* 3. What We Analyze (Image 1) */}
      <div id="method">
        <AnalysisCards />
      </div>

      {/* 4. Evidence / Case Study */}
      <section id="evidence" className="py-20 px-6 sm:px-12 lg:px-20 border-y border-border/80 bg-card/40">
        <div className="max-w-4xl mx-auto space-y-10 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold">
            Micro-Market Case Study
          </p>
          <blockquote className="text-xl sm:text-2xl lg:text-3xl font-serif text-foreground/90 leading-relaxed italic">
            "We walked away from a premium high-street lease after saturation crossed 90%. Using VyaparMap, we shifted two blocks into an under-served corridor and reached operating profitability in month four."
          </blockquote>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <div className="p-5 rounded-xl border border-border/80 bg-card/80 text-center">
              <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Location Shift</p>
              <h3 className="text-2xl font-bold font-mono text-gold-400 mt-1">2.1 km</h3>
            </div>
            <div className="p-5 rounded-xl border border-border/80 bg-card/80 text-center">
              <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Monthly Rent Load</p>
              <h3 className="text-2xl font-bold font-mono text-emerald-400 mt-1">-18%</h3>
            </div>
            <div className="p-5 rounded-xl border border-border/80 bg-card/80 text-center">
              <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Breakeven Timeline</p>
              <h3 className="text-2xl font-bold font-mono text-blue-400 mt-1">4 Months</h3>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Intelligence / Data Engine */}
      <section id="intelligence" className="py-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold">
            Data Engine
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Multi-layer signals. One calm decision surface.
          </h2>
          <p className="text-sm text-muted-foreground">
            We synthesize geocoded road graphs, customer demographic distributions, and commercial density into actionable founder metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'OpenStreetMap + Overpass',
              desc: 'Points of interest, pedestrian accessibility networks, and retail category clusters.',
            },
            {
              title: 'Search Intent Signals',
              desc: 'Review momentum, brand reputation density, and consumer intent trends.',
            },
            {
              title: 'Census & Demographics',
              desc: 'Household income tiers, working age clusters, and commuter movement.',
            },
            {
              title: 'Commercial Supply Pulse',
              desc: 'Average sq ft lease benchmark vs local spending capability.',
            },
          ].map(source => (
            <div key={source.title} className="p-6 rounded-xl border border-border/80 bg-card/50 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                <Database size={16} />
              </div>
              <h4 className="font-bold text-sm text-foreground">{source.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{source.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. City Input CTA */}
      <section className="py-20 px-6 sm:px-12 lg:px-20 border-t border-border/80 bg-gradient-to-b from-card/40 to-background">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold">
            Begin Assessment
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground">
            Reserve clarity before you reserve real estate.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Test our AI Location Advisor with your target city to preview footfall quality, rent benchmarks, and competitor saturation.
          </p>

          <form onSubmit={handleCitySubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-4">
            <Input
              type="text"
              placeholder="e.g. Bengaluru, Jaipur, Delhi..."
              value={cityQuery}
              onChange={e => setCityQuery(e.target.value)}
              leftIcon={<MapPin size={15} />}
              className="h-11"
            />
            <Button variant="gold" size="lg" type="submit" className="shrink-0">
              {submittedCity ? 'Opening Advisor...' : 'Explore City'}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/70 text-center text-xs text-muted-foreground font-mono">
        <p>© 2026 VyaparMap Intelligence Inc. All commercial telemetry data presented in demonstration mode.</p>
      </footer>
    </div>
  );
}

