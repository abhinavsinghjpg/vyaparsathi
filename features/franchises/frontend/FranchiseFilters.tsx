import { Search } from 'lucide-react';
import { Input } from '@/components/Input';
import { cn } from '@/components/utils';

const CATEGORIES = [
  'All',
  'Food & Beverage',
  'Beverages & Snacks',
  'Retail Eyewear',
  'Salon & Grooming',
  'Logistics & Courier',
  'Florist & Gifts',
  'Bakery & Dessert',
];

interface FranchiseFiltersProps {
  category: string;
  onCategoryChange: (cat: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export function FranchiseFilters({
  category,
  onCategoryChange,
  search,
  onSearchChange,
}: FranchiseFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="max-w-md">
        <Input
          type="text"
          placeholder="Search franchise brand, category..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          leftIcon={<Search size={15} />}
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {CATEGORIES.map(cat => {
          const isActive = category === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
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
    </div>
  );
}

