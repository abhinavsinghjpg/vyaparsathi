import { Select } from '@/components/Select';
import { cn } from '@/components/utils';

const CITIES = [
  { value: 'All', label: 'All Metros' },
  { value: 'Delhi', label: 'Delhi NCR' },
  { value: 'Bengaluru', label: 'Bengaluru' },
  { value: 'Gurugram', label: 'Gurugram' },
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'Jaipur', label: 'Jaipur' },
  { value: 'Pune', label: 'Pune' },
  { value: 'Chennai', label: 'Chennai' },
  { value: 'Kolkata', label: 'Kolkata' },
];

const TYPES = ['All', 'Shop', 'Office', 'Kiosk', 'Commercial Land'];

interface PropertyFiltersProps {
  city: string;
  onCityChange: (city: string) => void;
  type: string;
  onTypeChange: (type: string) => void;
}

export function PropertyFilters({
  city,
  onCityChange,
  type,
  onTypeChange,
}: PropertyFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-border/80 bg-card shadow-sm">
      <div className="flex flex-wrap items-center gap-1.5">
        {TYPES.map(t => {
          const isActive = type === t;
          return (
            <button
              key={t}
              onClick={() => onTypeChange(t)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors select-none',
                isActive
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="w-48">
        <Select
          value={city}
          onChange={e => onCityChange(e.target.value)}
          options={CITIES}
        />
      </div>
    </div>
  );
}

