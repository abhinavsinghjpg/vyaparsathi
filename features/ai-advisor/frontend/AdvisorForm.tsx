import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Store, Wallet, Zap, Loader2, Search, Key, Sparkles, Network, CheckCircle2, Building2, Trees, Compass } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Slider } from '@/components/Slider';
import { formatCurrency } from '@/components/utils';
import { geminiAdvisorService } from './geminiAdvisor.service';
import { locationSearchService, type LocationSearchResult } from '@/features/map-explorer/frontend/locationSearch.service';
import { BUSINESS_SECTORS, M_BUSINESS_CATALOG, type MicroBusiness } from '@/features/business-finder/backend/m_business';
import type { AdvisorAnalysisInput } from './aiAdvisor.service';

interface AdvisorFormProps {
  onSubmit: (input: AdvisorAnalysisInput) => void;
  isLoading: boolean;
}

export function AdvisorForm({ onSubmit, isLoading }: AdvisorFormProps) {
  const [locationInput, setLocationInput] = useState('Sanganer Tehsil, Jaipur');
  const [locationResults, setLocationResults] = useState<LocationSearchResult[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  // Market Tier Filter
  const [marketTierFilter, setMarketTierFilter] = useState<'all' | 'rural' | 'urban'>('all');
  
  // Sectors filtered by market tier
  const filteredSectors = BUSINESS_SECTORS.filter(sec => {
    if (marketTierFilter === 'all') return true;
    const isUrbanSec = ['urban_commercial_retail', 'urban_highend_hospitality', 'tech_gaming_electronics', 'luxury_wellness_lifestyle', 'commercial_services_coworking'].includes(sec.id);
    return marketTierFilter === 'urban' ? isUrbanSec : !isUrbanSec;
  });

  const [selectedSectorId, setSelectedSectorId] = useState('leather_footwear');
  const [selectedBusinessId, setSelectedBusinessId] = useState('mb-leather-01');
  const [isCustomBusiness, setIsCustomBusiness] = useState(false);
  const [customBusinessName, setCustomBusinessName] = useState('');

  const [shopSize, setShopSize] = useState(120);
  const [budget, setBudget] = useState(100000);
  const [isMarginMoney, setIsMarginMoney] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const locationWrapperRef = useRef<HTMLDivElement | null>(null);

  // Available businesses for selected sector
  const availableBusinesses = M_BUSINESS_CATALOG.filter(b => b.sectorId === selectedSectorId);
  const currentBusiness = M_BUSINESS_CATALOG.find(b => b.id === selectedBusinessId) || availableBusinesses[0];

  // Auto-adjust default values when business changes
  const handleSectorChange = (newSectorId: string) => {
    setSelectedSectorId(newSectorId);
    const firstBiz = M_BUSINESS_CATALOG.find(b => b.sectorId === newSectorId);
    if (firstBiz) {
      setSelectedBusinessId(firstBiz.id);
      setBudget(firstBiz.typicalBudget);
      setShopSize(Math.max(40, firstBiz.minAreaSqft));
    }
  };

  const handleBusinessChange = (newBizId: string) => {
    setSelectedBusinessId(newBizId);
    const b = M_BUSINESS_CATALOG.find(biz => biz.id === newBizId);
    if (b) {
      setBudget(b.typicalBudget);
      setShopSize(Math.max(40, b.minAreaSqft));
    }
  };

  const handleMarketTierChange = (tier: 'all' | 'rural' | 'urban') => {
    setMarketTierFilter(tier);
    const validSectors = BUSINESS_SECTORS.filter(sec => {
      if (tier === 'all') return true;
      const isUrbanSec = ['urban_commercial_retail', 'urban_highend_hospitality', 'tech_gaming_electronics', 'luxury_wellness_lifestyle', 'commercial_services_coworking'].includes(sec.id);
      return tier === 'urban' ? isUrbanSec : !isUrbanSec;
    });

    if (validSectors.length > 0) {
      handleSectorChange(validSectors[0].id);
    }
  };

  // Live Location Search (OSM Nominatim + Google + Curated)
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const results = await locationSearchService.searchLocations(locationInput);
        if (active) setLocationResults(results);
      } finally {
        if (active) setIsSearchingLocation(false);
      }
    }, 280);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [locationInput]);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationWrapperRef.current && !locationWrapperRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSuggestionsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setGeminiApiKey(geminiAdvisorService.getStoredApiKey());
  }, []);

  const handleKeyChange = (val: string) => {
    setGeminiApiKey(val);
    geminiAdvisorService.setStoredApiKey(val);
  };

  const steps = [
    'Scanning location via OpenStreetMap & Google Maps…',
    'Auditing local footfall, commercial anchors & competitor density…',
    'Checking specialized artisan cluster vs dispersion advantage…',
    'Calculating rent-to-revenue stress ratio & capital sufficiency…',
    'Synthesizing MoSJE concessional credit & PM Vishwakarma roadmap…',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLocation = locationInput.trim() || 'Sanganer Tehsil, Jaipur';
    const finalShopType = isCustomBusiness
      ? (customBusinessName.trim() || 'Commercial Retail Shop')
      : (currentBusiness ? currentBusiness.name : 'Traditional Handcrafted Mojari & Jutti Workshop');

    let s = 0;
    const interval = setInterval(() => {
      s++;
      setStepIndex(s % steps.length);
    }, 650);

    setTimeout(() => {
      clearInterval(interval);
    }, 3200);

    onSubmit({
      location: finalLocation,
      shopType: finalShopType,
      shopSize,
      budget,
      isMarginMoney,
      geminiApiKey,
      useGoogleMaps: true,
    });
  };

  // Quick budget chips depending on urban vs rural
  const isUrbanContext = marketTierFilter === 'urban' || budget >= 1000000;
  const budgetChips = isUrbanContext
    ? [
        { label: '₹15 Lakh', value: 1500000 },
        { label: '₹35 Lakh', value: 3500000 },
        { label: '₹75 Lakh', value: 7500000 },
        { label: '₹1.5 Crore', value: 15000000 },
        { label: '₹5 Crore', value: 50000000 },
        { label: '₹20 Crore', value: 200000000 },
      ]
    : [
        { label: '₹10k (PM Vishwakarma)', value: 10000 },
        { label: '₹25k (Cobbler / Mudra)', value: 25000 },
        { label: '₹50k (Dairy Unit)', value: 50000 },
        { label: '₹1 Lakh (Micro Cap)', value: 100000 },
        { label: '₹5 Lakh (Workshop)', value: 500000 },
        { label: '₹25 Lakh (Agro Mill)', value: 2500000 },
      ];

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-card shadow-lg space-y-6"
    >
      {/* 1. Universal Location Search Engine */}
      <div ref={locationWrapperRef} className="space-y-2 relative">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-gold-400" /> Target Location (Tehsil, Local Market, Mall, or Metro)
          </span>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <Compass size={12} /> Live Google + OSM Geocoding Active
          </span>
        </label>
        <div className="relative">
          <Input
            placeholder="Search ANY local street, mall, tehsil, or city (e.g. Sanganer Tehsil, Raja Park, Koramangala, Bandra)..."
            value={locationInput}
            onChange={e => {
              setLocationInput(e.target.value);
              setSuggestionsOpen(true);
            }}
            onFocus={() => setSuggestionsOpen(true)}
            leftIcon={<Search size={15} />}
            autoComplete="off"
          />

          {/* Autocomplete Dropdown */}
          {suggestionsOpen && (
            <div
              onMouseLeave={() => setSuggestionsOpen(false)}
              className="absolute top-full left-0 right-0 mt-1.5 z-50 max-h-64 overflow-y-auto rounded-xl border-2 border-gold-500/50 bg-slate-900 text-white p-2 shadow-2xl space-y-1"
            >
              <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-gold-400 font-bold border-b border-white/10 mb-1 flex items-center justify-between">
                <span>{isSearchingLocation ? 'Searching OpenStreetMap & Google...' : 'Live Geocoded Places in India'}</span>
                <span className="text-slate-400 font-normal">Click to select</span>
              </div>

              {locationResults.length > 0 ? (
                locationResults.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setLocationInput(item.label);
                      setSuggestionsOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-2 text-xs text-slate-100 hover:bg-slate-800 hover:text-gold-300 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <MapPin size={13} className="text-gold-400 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold">{item.label}</span>
                        <div className="text-[10px] text-slate-400 truncate">{item.formattedAddress}</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0 ml-2">
                      {item.source}
                    </span>
                  </div>
                ))
              ) : (
                <div
                  onClick={() => setSuggestionsOpen(false)}
                  className="px-3 py-2 text-xs text-gold-300 hover:bg-slate-800 rounded-lg cursor-pointer flex items-center gap-2"
                >
                  <Search size={13} className="text-gold-400" />
                  <span>Search for custom location &quot;{locationInput}&quot;</span>
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Covers all 28 states & UTs: enter any local bazaar, highway crossroads, shopping mall, or Gram Panchayat.
        </p>
      </div>

      {/* 2. Market Tier Filter (Rural vs Urban vs All) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-muted/40 border border-border/80">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Sparkles size={14} className="text-gold-400" /> Economic Spectrum Filter
          </span>
          <p className="text-[10px] text-muted-foreground">
            Explore businesses across the full economic spectrum — from ₹10k rural cobblers to ₹20Cr commercial malls.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-background p-1 rounded-lg border border-border/80 text-xs font-medium">
          <button
            type="button"
            onClick={() => handleMarketTierChange('all')}
            className={`px-2.5 py-1 rounded transition-colors ${
              marketTierFilter === 'all'
                ? 'bg-gold-500 text-brand-dark font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Models (21 Sectors)
          </button>
          <button
            type="button"
            onClick={() => handleMarketTierChange('rural')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
              marketTierFilter === 'rural'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Trees size={12} />
            <span>Rural & Micro (16)</span>
          </button>
          <button
            type="button"
            onClick={() => handleMarketTierChange('urban')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
              marketTierFilter === 'urban'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Building2 size={12} />
            <span>Urban & High-End (5)</span>
          </button>
        </div>
      </div>

      {/* 3. Hierarchical Business Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Sector Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Store size={14} className="text-gold-400" /> 1. Industry Sector
          </label>
          <Select
            value={selectedSectorId}
            onChange={e => handleSectorChange(e.target.value)}
            options={filteredSectors.map(s => ({
              value: s.id,
              label: `${s.emoji} ${s.name}`,
            }))}
          />
        </div>

        {/* Specific Business in Sector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Store size={14} className="text-blue-400" /> 2. Business Model
            </span>
            <button
              type="button"
              onClick={() => setIsCustomBusiness(!isCustomBusiness)}
              className="text-[10px] text-gold-400 underline font-mono cursor-pointer"
            >
              {isCustomBusiness ? '← Select from Catalog' : '+ Custom Name'}
            </button>
          </label>

          {isCustomBusiness ? (
            <Input
              value={customBusinessName}
              onChange={e => setCustomBusinessName(e.target.value)}
              placeholder="Type any custom business (e.g. Acer Laptop Outlet, Cloud Kitchen, Crossfit Gym)..."
            />
          ) : (
            <Select
              value={selectedBusinessId}
              onChange={e => handleBusinessChange(e.target.value)}
              options={availableBusinesses.map(b => ({
                value: b.id,
                label: `${b.emoji} ${b.name}`,
              }))}
            />
          )}
        </div>
      </div>

      {/* Business Model Summary Banner */}
      {!isCustomBusiness && currentBusiness && (
        <div className="p-3.5 rounded-xl bg-background/80 border border-border/80 flex items-start gap-3 text-xs">
          <span className="text-2xl shrink-0">{currentBusiness.emoji}</span>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-foreground">{currentBusiness.name}</span>
              <span className="px-2 py-0.5 rounded bg-gold-500/15 text-gold-400 font-mono text-[10px] font-bold">
                {currentBusiness.sectorName}
              </span>
              {currentBusiness.competitionSensitivity === 'Cluster_Beneficial' && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono text-[10px] font-bold">
                  ★ Agglomeration Advantage ({currentBusiness.agglomerationIndex}/10)
                </span>
              )}
              {currentBusiness.marketTier === 'metro_luxury' && (
                <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 font-mono text-[10px] font-bold">
                  ★ High-Net-Worth / Commercial Anchor
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              {currentBusiness.description}
            </p>
          </div>
        </div>
      )}

      {/* 4. Shop Size Slider */}
      <div className="space-y-2 pt-1">
        <Slider
          label="Proposed Floor Area / Carpet Space"
          min={40}
          max={15000}
          step={20}
          unit="sq ft"
          value={shopSize}
          onChange={setShopSize}
        />
        <p className="text-[11px] text-muted-foreground">
          Ultra-micro cobbler stalls start at 40 sq ft; cafes ~1,200 sq ft; commercial malls up to 15,000+ sq ft
        </p>
      </div>

      {/* 5. Capital Input with 10% Margin Money Mode Toggle */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Wallet size={14} className="text-gold-400" /> Capital Available
          </label>

          {/* Capital Mode Toggle */}
          <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-border/80 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => setIsMarginMoney(false)}
              className={`px-2.5 py-1 rounded transition-colors ${
                !isMarginMoney ? 'bg-gold-500 text-brand-dark font-bold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Total Budget
            </button>
            <button
              type="button"
              onClick={() => setIsMarginMoney(true)}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                isMarginMoney ? 'bg-blue-600 text-white font-bold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>10% Margin Mode (Govt Loan)</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
            ₹
          </span>
          <Input
            type="number"
            min={10000}
            max={200000000}
            step={5000}
            value={budget || ''}
            onChange={e => setBudget(Number(e.target.value))}
            placeholder={isMarginMoney ? "Enter your 10% self-contribution (e.g. 10000)" : "Enter total project budget (e.g. 100000)"}
            className="pl-8"
          />
        </div>

        {/* Quick Budget Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[10px] text-muted-foreground uppercase font-mono mr-1">Presets:</span>
          {budgetChips.map(chip => (
            <button
              key={chip.value}
              type="button"
              onClick={() => setBudget(chip.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                budget === chip.value
                  ? 'bg-gold-500/20 text-gold-300 border-gold-500/50 font-bold'
                  : 'bg-muted/30 text-muted-foreground border-border/60 hover:text-foreground'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. AI Engine Credentials (Supports Gemini, Groq, Perplexity) */}
      <div className="pt-2 border-t border-border/70 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
          >
            <Key size={13} className="text-gold-400" />
            <span>AI Provider API Key (Optional: Google Gemini / Groq / Perplexity)</span>
            <span className="text-[10px] font-mono text-gold-400 underline ml-1">
              {showKeyInput ? 'Hide' : geminiApiKey ? '● Key Configured' : '+ Add Key'}
            </span>
          </button>
        </div>

        {showKeyInput && (
          <div className="space-y-1.5 animate-fade-in p-3 rounded-xl bg-background/90 border border-border/80">
            <Input
              type="password"
              placeholder="Paste Google Gemini, Groq (gsk_...), or Perplexity (pplx-...) key"
              value={geminiApiKey}
              onChange={e => handleKeyChange(e.target.value)}
            />
            <p className="text-[10px] text-muted-foreground">
              If left blank, VyaparMap executes its deterministic actuarial retail econometric model.
            </p>
          </div>
        )}
      </div>

      {/* 10% Margin + 90% Concessional Loan / Subsidy Advisory Banner (SIH 26091) */}
      {(() => {
        const totalProjectOutlay = isMarginMoney ? budget * 10 : budget;
        const businessMinRequired = currentBusiness ? currentBusiness.minBudget : 0;

        // Only show if total required or entered capital is <= 50 Lakhs (MoSJE Statutory Cap)
        if (totalProjectOutlay > 5000000 || businessMinRequired > 5000000) {
          return null;
        }

        const userMargin = isMarginMoney ? budget : Math.round(budget * 0.10);
        const govtLoan = isMarginMoney ? budget * 9 : Math.round(budget * 0.90);

        return (
          <div className="p-4 rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-card to-card space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-brand-dark font-mono font-bold text-[9px] uppercase tracking-wider">
                  MoSJE SIH 26091 Advisory
                </span>
                <span className="text-xs font-mono font-bold text-foreground">
                  Up to 90% Govt Loan / Subsidy Recommendation
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400">
                {isMarginMoney ? '● 10% Margin Mode' : '● Total Outlay Mode'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-background/80 border border-border/70 space-y-0.5">
                <div className="text-[10px] font-mono text-muted-foreground uppercase">Your Margin (10%)</div>
                <div className="text-xs sm:text-sm font-mono font-bold text-gold-400">
                  {formatCurrency(userMargin)}
                </div>
                <div className="text-[9px] text-muted-foreground">Self-Contribution</div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-0.5">
                <div className="text-[10px] font-mono text-emerald-400 uppercase">Govt Loan (90%)</div>
                <div className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                  {formatCurrency(govtLoan)}
                </div>
                <div className="text-[9px] text-emerald-300/80">6.5% – 8.0% Subsidized</div>
              </div>

              <div className="p-2.5 rounded-xl bg-background/80 border border-border/70 space-y-0.5">
                <div className="text-[10px] font-mono text-muted-foreground uppercase">Total Outlay (100%)</div>
                <div className="text-xs sm:text-sm font-mono font-bold text-foreground">
                  {formatCurrency(totalProjectOutlay)}
                </div>
                <div className="text-[9px] text-muted-foreground">Total Scaled Project</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-background/60 border border-border/60 text-[11px] text-muted-foreground leading-relaxed space-y-1">
              <p>
                💡 Under MoSJE & MSME guidelines, this venture can be proposed with just a <strong className="text-gold-400">{formatCurrency(userMargin)}</strong> self-contribution (10%), qualifying for up to <strong className="text-emerald-400">{formatCurrency(govtLoan)}</strong> in concessional loan assistance.
              </p>
              <p className="text-[10px] text-muted-foreground/90 italic">
                *<strong>Notice</strong>: This is an advisory recommendation and not an approval guarantee; final sanction depends on official SCA verification, bank appraisal, and scheme eligibility criteria. You can apply through official government portals (Jan Samarth) or via VyaparMap.
              </p>
            </div>
          </div>
        );
      })()}

      {/* 7. Submit Action Button */}
      <Button
        type="submit"
        variant="gold"
        size="lg"
        disabled={isLoading}
        className="w-full gap-2 font-bold shadow-md shadow-gold-500/10 text-sm sm:text-base py-3.5"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span className="truncate">{steps[stepIndex]}</span>
          </>
        ) : (
          <>
            <Zap size={18} />
            <span>Analyze Location & Feasibility</span>
          </>
        )}
      </Button>
    </form>
  );
}
