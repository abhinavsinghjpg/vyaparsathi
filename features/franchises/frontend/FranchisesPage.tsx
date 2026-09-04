import { useState, useEffect } from 'react';
import { FranchiseCard } from './FranchiseCard';
import { FranchiseFilters } from './FranchiseFilters';
import { FranchiseModal } from './FranchiseModal';
import { franchisesService } from './franchises.service';
import type { Franchise } from '@/types/schema';

export function FranchisesPage() {
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedFranchise, setSelectedFranchise] = useState<Franchise | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchFranchises = (shuffle = false) => {
    franchisesService
      .getFranchises({ category, search })
      .then(data => {
        if (shuffle && data.length > 2) {
          // Shuffle slightly to simulate live market momentum while preserving custom user franchises at top
          const custom = data.filter(f => f.id.startsWith('user-biz-'));
          const rest = data.filter(f => !f.id.startsWith('user-biz-'));
          const rotated = [...rest.slice(1), rest[0]];
          setFranchises([...custom, ...rotated]);
        } else {
          setFranchises(data);
        }
      });
  };

  useEffect(() => {
    fetchFranchises(false);
  }, [category, search]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      fetchFranchises(true);
      setIsRefreshing(false);
    }, 450);
  };

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
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
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

