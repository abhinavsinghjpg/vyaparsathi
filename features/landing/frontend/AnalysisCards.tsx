import { Activity, Crosshair, Wallet, PieChart } from 'lucide-react';

const ANALYSIS_MODULES = [
  {
    icon: Activity,
    title: 'FOOTFALL DENSITY',
    description:
      'Estimate pedestrian and vehicle traffic quality in your target micro-market before lease commitment.',
  },
  {
    icon: Crosshair,
    title: 'COMPETITOR RADAR',
    description:
      'Identify saturation pockets, benchmark price levels, and understand category crowding in minutes.',
  },
  {
    icon: Wallet,
    title: 'RENT-TO-REVENUE MATRIX',
    description:
      'Stress-test monthly rent against practical demand signals to avoid vanity locations with weak viability.',
  },
  {
    icon: PieChart,
    title: 'DEMOGRAPHIC SIGNALS',
    description:
      'Align concept, menu, and ticket size with household income patterns and age clusters nearby.',
  },
];

export function AnalysisCards() {
  return (
    <section className="py-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column Text (Image 1) */}
        <div className="lg:col-span-5 space-y-6">
          <p className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold">
            What We Analyze
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-[1.15] tracking-tight">
            Structured intelligence for deliberate expansion.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            We avoid noisy dashboards. Every module exists to answer one founder question: will this location produce sustainable returns for this exact business model?
          </p>
        </div>

        {/* Right Column 4 Cards (Image 1) */}
        <div className="lg:col-span-7 space-y-4">
          {ANALYSIS_MODULES.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group p-6 rounded-xl border border-border/80 bg-card/60 hover:bg-card hover:border-gold-500/40 transition-all duration-200 space-y-2 shadow-sm"
              >
                <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-muted-foreground group-hover:text-gold-400 transition-colors uppercase">
                  <Icon size={15} />
                  <span>{item.title}</span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

