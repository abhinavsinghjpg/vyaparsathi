import React, { useState, useEffect } from 'react';
import { MapPin, Store, Wallet, Zap, Loader2, Search, Key, Sparkles } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Slider } from '@/components/Slider';
import { db } from '@/database/m_index';
import { geminiAdvisorService } from './geminiAdvisor.service';
import type { AdvisorAnalysisInput } from './aiAdvisor.service';

const SHOP_TYPES = [
  { value: 'cafe', label: '☕ Cafe / Coffee Shop' },
  { value: 'restaurant', label: '🍽️ Restaurant / Dining' },
  { value: 'cloud_kitchen', label: '📦 Cloud Kitchen' },
  { value: 'grocery', label: '🛒 Grocery / Supermarket' },
  { value: 'pharmacy', label: '💊 Pharmacy / Chemist' },
  { value: 'gym', label: '🏋️ Gym / Fitness Center' },
  { value: 'salon', label: '✂️ Salon / Spa & Grooming' },
  { value: 'mobile_repair', label: '📱 Mobile Repair & Electronics' },
  { value: 'clothing', label: '👗 Fashion / Apparel Boutique' },
  { value: 'bakery', label: '🥐 Bakery & Confectionery' },
];

const POPULAR_AREAS = [
  'Koramangala, Bengaluru',
  'Connaught Place, New Delhi',
  'Bandra West, Mumbai',
  'Indiranagar, Bengaluru',
  'Cyber City, Gurugram',
  'Banjara Hills, Hyderabad',
  'FC Road, Pune',
  'C-Scheme, Jaipur',
];

interface AdvisorFormProps {
  onSubmit: (input: AdvisorAnalysisInput) => void;
  isLoading: boolean;
}

export function AdvisorForm({ onSubmit, isLoading }: AdvisorFormProps) {
  const locations = db.getLocations();

  const [locationInput, setLocationInput] = useState('');
  const [shopType, setShopType] = useState('cafe');
  const [shopSize, setShopSize] = useState(300);
  const [budget, setBudget] = useState(1500000);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const locationWrapperRef = React.useRef<HTMLDivElement | null>(null);

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

  const matchingAreas = POPULAR_AREAS.filter(a =>
    a.toLowerCase().includes(locationInput.toLowerCase())
  );

  useEffect(() => {
    setGeminiApiKey(geminiAdvisorService.getStoredApiKey());
  }, []);

  const handleKeyChange = (val: string) => {
    setGeminiApiKey(val);
    geminiAdvisorService.setStoredApiKey(val);
  };

  const steps = [
    'Scanning location via Google Maps…',
    'Analyzing pedestrian footfall density…',
    'Auditing competitor saturation…',
    'Evaluating break-even unit economics…',
    'Running Gemini profitability verdict…',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLocation = locationInput.trim() || locations[0].name;

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
      shopType: SHOP_TYPES.find(s => s.value === shopType)?.label || 'Cafe / Coffee Shop',
      shopSize,
      budget,
      geminiApiKey,
      useGoogleMaps: true,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-card shadow-lg space-y-6"
    >
      {/* 1. Location (Google Maps & Geocoding) */}
      <div ref={locationWrapperRef} className="space-y-2 relative">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-gold-400" /> Target Location (Google Maps)
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">● Footfall Scanner Active</span>
        </label>
        <div className="relative">
          <Input
            placeholder="Search any locality (e.g. Koramangala, Connaught Place, Bandra)…"
            value={locationInput}
            onChange={e => {
              setLocationInput(e.target.value);
              setSuggestionsOpen(true);
            }}
            onFocus={() => {
              if (locationInput.trim().length >= 3) setSuggestionsOpen(true);
            }}
            leftIcon={<Search size={15} />}
            autoComplete="off"
          />

          {/* Autocomplete Dropdown - solid background, auto-close on mouse leave, triggers >= 3 chars */}
          {suggestionsOpen && locationInput.trim().length >= 3 && (
            <div
              onMouseLeave={() => setSuggestionsOpen(false)}
              className="absolute top-full left-0 right-0 mt-1.5 z-50 max-h-60 overflow-y-auto rounded-xl border-2 border-gold-500/50 bg-slate-900 text-white p-2 shadow-2xl"
            >
              <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-gold-400 font-bold border-b border-white/10 mb-1 flex items-center justify-between">
                <span>Matching Retail Corridors</span>
                <span className="text-slate-400 font-normal">Exit hover to close</span>
              </div>
              {matchingAreas.length > 0 ? (
                matchingAreas.map((area, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setLocationInput(area);
                      setSuggestionsOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-100 hover:bg-slate-800 hover:text-gold-300 rounded-lg cursor-pointer transition-colors"
                  >
                    <MapPin size={13} className="text-gold-400 shrink-0" />
                    <span className="font-semibold">{area}</span>
                  </div>
                ))
              ) : (
                <div
                  onClick={() => setSuggestionsOpen(false)}
                  className="px-3 py-2 text-xs text-gold-300 hover:bg-slate-800 rounded-lg cursor-pointer flex items-center gap-2"
                >
                  <Search size={13} className="text-gold-400" />
                  <span>Use custom location &quot;{locationInput}&quot;</span>
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Enter any street, market, or city — scans Google Maps coordinates, transit stops & nearby stores
        </p>
      </div>

      {/* 2. Shop / Business Type */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Store size={14} /> Shop / Business Category
        </label>
        <Select
          value={shopType}
          onChange={e => setShopType(e.target.value)}
          options={SHOP_TYPES}
        />
      </div>

      {/* 3. Shop Size Slider */}
      <div className="space-y-2 pt-1">
        <Slider
          label="Proposed Floor Area"
          min={100}
          max={5000}
          step={50}
          unit="sq ft"
          value={shopSize}
          onChange={setShopSize}
        />
      </div>

      {/* 4. Total Budget (₹) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Wallet size={14} /> Total Available Budget (₹)
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
            ₹
          </span>
          <Input
            type="number"
            min={50000}
            step={10000}
            value={budget || ''}
            onChange={e => setBudget(Number(e.target.value))}
            placeholder="e.g. 1500000"
            className="pl-8"
          />
        </div>
        {budget > 0 && (
          <p className="text-[11px] font-mono font-medium text-emerald-400">
            = ₹{(budget / 100000).toFixed(1)} Lakhs Available Setup Capital
          </p>
        )}
      </div>

      {/* 5. Google Gemini AI Engine / Key Configuration */}
      <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-gold-400" />
            <span className="text-xs font-bold text-foreground">Google Gemini Profitability Engine</span>
          </div>
          <button
            type="button"
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="text-[11px] font-mono text-gold-400 hover:underline flex items-center gap-1"
          >
            <Key size={11} /> {geminiApiKey ? 'Key Configured' : 'Add Gemini Key (Optional)'}
          </button>
        </div>

        {showKeyInput && (
          <div className="space-y-1.5 pt-1 animate-fade-in">
            <Input
              type="password"
              placeholder="Paste Google AI Studio API Key (AIzaSy…)"
              value={geminiApiKey}
              onChange={e => handleKeyChange(e.target.value)}
              className="text-xs font-mono"
            />
            <p className="text-[10px] text-muted-foreground">
              Optional. Free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-gold-400 underline">aistudio.google.com</a>. If omitted, uses our calibrated actuarial retail model.
            </p>
          </div>
        )}

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Computes break-even orders/day, monthly net profit, and tells you whether opening this store is profitable or high-risk.
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="orange"
          size="lg"
          isLoading={isLoading}
          className="w-full text-sm font-bold uppercase tracking-wider py-3.5 shadow-lg"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              {steps[stepIndex]}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Zap size={16} /> Run Feasibility & Profitability Analysis
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
