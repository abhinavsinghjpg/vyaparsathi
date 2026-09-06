import { useState, useMemo, useEffect, useRef } from 'react';
import { Wallet, MapPin, Briefcase, Sparkles, Layers, Search, Building2, Trees, Compass } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { BUSINESS_SECTORS } from '../backend/m_business';
import { locationSearchService, type LocationSearchResult } from '@/features/map-explorer/frontend/locationSearch.service';
import type { BusinessFinderInput } from './businessFinder.service';

export function FinderForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (input: BusinessFinderInput) => void;
  isLoading: boolean;
}) {
  const [budget, setBudget] = useState(100000);
  const [isMarginMoney, setIsMarginMoney] = useState(false);
  const [city, setCity] = useState('Sanganer Tehsil, Jaipur');
  const [sectorId, setSectorId] = useState('all');
  const [subCategory, setSubCategory] = useState('all');
  const [marketTier, setMarketTier] = useState<'all' | 'rural' | 'urban'>('all');

  // Universal Location Search
  const [locationResults, setLocationResults] = useState<LocationSearchResult[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const locationWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        const res = await locationSearchService.searchLocations(city);
        if (active) setLocationResults(res);
      } catch (e) {
        console.warn(e);
      }
    }, 280);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [city]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationWrapperRef.current && !locationWrapperRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter sectors by market tier
  const filteredSectors = useMemo(() => {
    return BUSINESS_SECTORS.filter(sec => {
      if (marketTier === 'all') return true;
      const isUrban = ['urban_commercial_retail', 'urban_highend_hospitality', 'tech_gaming_electronics', 'luxury_wellness_lifestyle', 'commercial_services_coworking'].includes(sec.id);
      return marketTier === 'urban' ? isUrban : !isUrban;
    });
  }, [marketTier]);

  // Sub-categories for selected sector
  const availableSubCategories = useMemo(() => {
    if (sectorId === 'all') return [];
    const sec = BUSINESS_SECTORS.find(s => s.id === sectorId);
    return sec ? sec.subCategories : [];
  }, [sectorId]);

  const handleCitySelect = (selectedLabel: string) => {
    setCity(selectedLabel);
    setSuggestionsOpen(false);
    onSubmit({ budget, isMarginMoney, city: selectedLabel, sectorId, subCategory });
  };

  const handleSectorChange = (newSectorId: string) => {
    setSectorId(newSectorId);
    setSubCategory('all');
    onSubmit({ budget, isMarginMoney, city, sectorId: newSectorId, subCategory: 'all' });
  };

  const handleSubCategoryChange = (newSub: string) => {
    setSubCategory(newSub);
    onSubmit({ budget, isMarginMoney, city, sectorId, subCategory: newSub });
  };

  const handleBudgetChange = (newBudget: number) => {
    setBudget(newBudget);
    onSubmit({ budget: newBudget, isMarginMoney, city, sectorId, subCategory });
  };

  const handleToggleMargin = (marginMode: boolean) => {
    setIsMarginMoney(marginMode);
    onSubmit({ budget, isMarginMoney: marginMode, city, sectorId, subCategory });
  };

  const handleMarketTierChange = (tier: 'all' | 'rural' | 'urban') => {
    setMarketTier(tier);
    setSectorId('all');
    setSubCategory('all');
    onSubmit({ budget, isMarginMoney, city, sectorId: 'all', subCategory: 'all' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ budget, isMarginMoney, city, sectorId, subCategory });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-border/80 bg-card space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Sparkles size={16} className="text-gold-400" />
            <span>Smart Business Ideator · 4-Filter Cascade</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Filter 20k+ micro & urban enterprises by Capital, Tehsil/City, Industry Sector, and Specific Activity.
          </p>
        </div>

        {/* Tier & Capital Mode Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-border/80 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => handleMarketTierChange('all')}
              className={`px-2 py-0.5 rounded transition-colors ${marketTier === 'all' ? 'bg-gold-500 text-brand-dark font-bold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => handleMarketTierChange('rural')}
              className={`px-2 py-0.5 rounded transition-colors ${marketTier === 'rural' ? 'bg-emerald-600 text-white font-bold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Rural
            </button>
            <button
              type="button"
              onClick={() => handleMarketTierChange('urban')}
              className={`px-2 py-0.5 rounded transition-colors ${marketTier === 'urban' ? 'bg-blue-600 text-white font-bold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Urban
            </button>
          </div>

          <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-border/80 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => handleToggleMargin(false)}
              className={`px-2 py-0.5 rounded transition-colors ${!isMarginMoney ? 'bg-gold-500 text-brand-dark font-bold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Total Budget
            </button>
            <button
              type="button"
              onClick={() => handleToggleMargin(true)}
              className={`px-2 py-0.5 rounded transition-colors ${isMarginMoney ? 'bg-blue-600 text-white font-bold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              10% Margin
            </button>
          </div>
        </div>
      </div>

      {/* 4-Filter Cascade Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filter 1: Capital Budget */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Wallet size={13} className="text-gold-400" />
              <span>1. {isMarginMoney ? '10% Margin Cash' : 'Available Capital'}</span>
            </span>
            <span className="font-mono text-gold-400 font-bold text-[11px]">
              ₹{budget.toLocaleString('en-IN')}
            </span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">₹</span>
            <input
              type="number"
              min={10000}
              max={200000000}
              step={5000}
              value={budget}
              onChange={e => handleBudgetChange(Number(e.target.value))}
              className="w-full pl-7 pr-3 py-2 rounded-xl border border-border/80 bg-background text-foreground font-mono font-bold text-xs focus:outline-none focus:ring-1 focus:ring-gold-400"
            />
          </div>
        </div>

        {/* Filter 2: Universal Location Search (Google Maps + OSM) */}
        <div ref={locationWrapperRef} className="space-y-1.5 relative">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <MapPin size={13} className="text-blue-400" />
            <span>2. Target Tehsil / City</span>
          </label>
          <div className="relative">
            <Input
              value={city}
              onChange={e => {
                setCity(e.target.value);
                setSuggestionsOpen(true);
              }}
              onFocus={() => setSuggestionsOpen(true)}
              placeholder="Search ANY city, tehsil or market..."
              leftIcon={<Search size={14} />}
              autoComplete="off"
            />

            {suggestionsOpen && locationResults.length > 0 && (
              <div
                onMouseLeave={() => setSuggestionsOpen(false)}
                className="absolute top-full left-0 right-0 mt-1 z-50 max-h-56 overflow-y-auto rounded-xl border border-gold-500/40 bg-slate-900 text-white p-1.5 shadow-2xl space-y-1"
              >
                <div className="px-2 py-1 text-[10px] font-mono text-gold-400 font-bold border-b border-white/10 flex items-center justify-between">
                  <span>OpenStreetMap & Google Locations</span>
                  <span className="text-slate-400 text-[9px]">Click to apply</span>
                </div>
                {locationResults.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCitySelect(item.label)}
                    className="flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 hover:text-gold-300 rounded-lg cursor-pointer"
                  >
                    <div className="truncate">
                      <span className="font-semibold">{item.label}</span>
                      <div className="text-[10px] text-slate-400 truncate">{item.formattedAddress}</div>
                    </div>
                    <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0 ml-1.5">
                      {item.source}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filter 3: Industry Sector (Filtered by Tier) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers size={13} className="text-purple-400" />
            <span>3. Sector ({filteredSectors.length})</span>
          </label>
          <Select
            value={sectorId}
            onChange={e => handleSectorChange(e.target.value)}
            options={[
              { value: 'all', label: '⚡ All Sectors (Show All)' },
              ...filteredSectors.map(s => ({
                value: s.id,
                label: `${s.emoji} ${s.name}`,
              })),
            ]}
          />
        </div>

        {/* Filter 4: Granular Sub-Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Briefcase size={13} className="text-emerald-400" />
            <span>4. Specific Activity</span>
          </label>
          <Select
            value={subCategory}
            onChange={e => handleSubCategoryChange(e.target.value)}
            disabled={sectorId === 'all'}
            options={[
              { value: 'all', label: sectorId === 'all' ? 'Select Sector First' : '🎯 All Activities in Sector' },
              ...availableSubCategories.map(sc => ({
                value: sc,
                label: sc,
              })),
            ]}
          />
        </div>
      </div>
    </form>
  );
}
