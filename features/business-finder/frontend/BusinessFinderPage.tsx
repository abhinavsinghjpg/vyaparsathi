import { useState, useEffect } from 'react';
import { FinderForm } from './FinderForm';
import { SuggestionCard } from './SuggestionCard';
import { businessFinderService, type BusinessFinderOutput } from './businessFinder.service';

export function BusinessFinderPage() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<BusinessFinderOutput[]>([]);

  useEffect(() => {
    // Initial fetch with Sanganer Tehsil & Leather Footwear
    businessFinderService
      .findBusinesses({ budget: 100000, city: 'Sanganer Tehsil, Jaipur', sectorId: 'leather_footwear' })
      .then(setSuggestions);
  }, []);

  const handleSearch = async (input: import('./businessFinder.service').BusinessFinderInput) => {
    setLoading(true);
    try {
      const results = await businessFinderService.findBusinesses(input);
      setSuggestions(results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
          Smart Business Ideator
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Benchmark business categories by initial capital, typical payback speed, and local market openness.
        </p>
      </div>

      <FinderForm onSubmit={handleSearch} isLoading={loading} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-muted-foreground">
            Ranked Recommendations ({suggestions.length})
          </h3>
          <span className="text-xs text-muted-foreground font-mono">Sorted by ROI & Affordability</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((biz, idx) => (
            <SuggestionCard key={biz.id} biz={biz} rank={idx + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

