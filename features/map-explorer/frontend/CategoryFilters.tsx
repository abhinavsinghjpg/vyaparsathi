import { cn } from '@/components/utils';

export const HARVEST_CATEGORIES = [
  'All',
  'Cafes & Dining',
  'Malls & Retail',
  'IT & Gaming',
  'Footwear & Leather',
  'Healthcare',
  'Offices & Commercial',
];

interface CategoryFiltersProps {
  activeCategory: string;
  onChange: (category: string) => void;
  heatmapEnabled: boolean;
  onToggleHeatmap: () => void;
  harvestCount?: number;
}

export function CategoryFilters({
  activeCategory,
  onChange,
  heatmapEnabled,
  onToggleHeatmap,
  harvestCount = 0,
}: CategoryFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border border-border/80 bg-card shadow-sm">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-mono uppercase text-muted-foreground mr-1 hidden sm:inline">
          Filter POIs:
        </span>
        {HARVEST_CATEGORIES.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-medium transition-colors select-none',
                isActive
                  ? 'bg-gold-500 text-brand-dark font-bold shadow-sm'
                  : 'bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        {harvestCount > 0 && (
          <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
            💾 {harvestCount} Harvested in Local Vault
          </span>
        )}
        <button
          onClick={onToggleHeatmap}
          className={cn(
            'px-3 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all select-none border',
            heatmapEnabled
              ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-sm'
              : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted'
          )}
        >
          🔥 Heatmap: {heatmapEnabled ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
}
