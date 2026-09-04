import { cn } from '@/components/utils';

const CATEGORIES = [
  'All',
  'Corridor Hub',
  'Shop',
  'Office',
  'Kiosk',
  'Commercial Land',
];

interface CategoryFiltersProps {
  activeCategory: string;
  onChange: (category: string) => void;
  heatmapEnabled: boolean;
  onToggleHeatmap: () => void;
}

export function CategoryFilters({
  activeCategory,
  onChange,
  heatmapEnabled,
  onToggleHeatmap,
}: CategoryFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-border/80 bg-card shadow-sm">
      <div className="flex flex-wrap items-center gap-1.5">
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors select-none',
                isActive
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <button
        onClick={onToggleHeatmap}
        className={cn(
          'px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all select-none border',
          heatmapEnabled
            ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-sm'
            : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted'
        )}
      >
        🔥 Rent Heatmap: {heatmapEnabled ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}

