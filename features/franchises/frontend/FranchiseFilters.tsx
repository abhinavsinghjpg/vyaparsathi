import { Search, RotateCw } from 'lucide-react';
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
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function FranchiseFilters({
  category,
  onCategoryChange,
  search,
  onSearchChange,
  onRefresh,
  isRefreshing,
}: FranchiseFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Search Input & Refresh Button */}
      <div className="flex items-center gap-3 max-w-xl">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search franchise brand, category..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            leftIcon={<Search size={15} />}
          />
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted/80 text-xs font-mono font-bold text-foreground shadow-sm transition-all hover:border-gold-500/50 cursor-pointer select-none shrink-0"
            title="Refresh franchise demand pipeline and shuffle listings"
          >
            <RotateCw size={13} className={cn('text-gold-400', isRefreshing && 'animate-spin')} />
            <span>Live Market Refresh</span>
          </button>
        )}
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

