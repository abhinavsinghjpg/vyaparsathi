import { useState, useEffect } from 'react';
import { FranchiseCard } from './FranchiseCard';
import { FranchiseFilters } from './FranchiseFilters';
import { FranchiseModal } from './FranchiseModal';
import { franchisesService } from './franchises.service';
import type { Franchise } from '@/database';

export function FranchisesPage() {
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedFranchise, setSelectedFranchise] = useState<Franchise | null>(null);

  useEffect(() => {
    franchisesService
      .getFranchises({ category, search })
      .then(setFranchises);
  }, [category, search]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
          Franchise Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Browse verified Indian QSR, retail, salon, and logistics franchises with standard investment payback benchmarks.
        </p>
      </div>

      <FranchiseFilters
        category={category}
        onCategoryChange={setCategory}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {franchises.map(franchise => (
          <FranchiseCard
            key={franchise.id}
            franchise={franchise}
            onApply={setSelectedFranchise}
          />
        ))}
      </div>

      <FranchiseModal
        franchise={selectedFranchise}
        isOpen={Boolean(selectedFranchise)}
        onClose={() => setSelectedFranchise(null)}
      />
    </div>
  );
}

