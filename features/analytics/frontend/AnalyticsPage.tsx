import { useState } from 'react';
import { RevenueCalculator } from './RevenueCalculator';
import { CompetitorTable } from './CompetitorTable';
import { analyticsService } from './analytics.service';
import { TrendingUp, Users, DollarSign, Layers, MapPin, Store, Search } from 'lucide-react';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';

const BUSINESS_CATEGORIES = [
  { value: 'Cafe / Coffee Shop', label: '☕ Cafe / Coffee Shop' },
  { value: 'Restaurant / Dining', label: '🍽️ Restaurant / Casual Dining' },
  { value: 'Bakery & Dessert', label: '🥐 Bakery & Confectionery' },
  { value: 'Quick Service Restaurant', label: '🍔 Quick Service / Fast Food' },
  { value: 'Retail & Fashion Boutique', label: '👗 Retail & Fashion Boutique' },
  { value: 'Salon & Spa Grooming', label: '✂️ Salon & Spa Grooming' },
  { value: 'Pharmacy & Wellness', label: '💊 Pharmacy & Wellness' },
  { value: 'Gym & Fitness Studio', label: '🏋️ Gym & Fitness Studio' },
];

const QUICK_CITIES = [
  { name: 'Jaipur, Rajasthan', label: 'Jaipur' },
  { name: 'Delhi NCR', label: 'Delhi NCR' },
  { name: 'Bengaluru, Karnataka', label: 'Bengaluru' },
  { name: 'Mumbai, Maharashtra', label: 'Mumbai' },
  { name: 'Pune, Maharashtra', label: 'Pune' },
  { name: 'Hyderabad, Telangana', label: 'Hyderabad' },
];

export function AnalyticsPage() {
  const [searchCity, setSearchCity] = useState('Jaipur, Rajasthan');
  const [category, setCategory] = useState('Cafe / Coffee Shop');
  const kpis = analyticsService.getMarketKPIs();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Market Intelligence & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Real-time macroeconomic benchmarks, rent stress-testing, and local competitor density.
          </p>
        </div>
      </div>

      {/* Target Market Controls Bar: Defaults to Jaipur, Rajasthan & Cafe */}
      <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          {/* Search Bar: Default Jaipur, Rajasthan */}
          <div className="sm:col-span-7 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin size={13} className="text-gold-400" /> Target City / Catchment
            </label>
            <Input
              value={searchCity}
              onChange={e => setSearchCity(e.target.value)}
              placeholder="Search target city or corridor (e.g. Jaipur, Rajasthan)…"
              leftIcon={<Search size={15} />}
            />
          </div>

          {/* Business Category: Default Cafe */}
          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Store size={13} className="text-gold-400" /> Business Category
            </label>
            <Select
              value={category}
              onChange={e => setCategory(e.target.value)}
              options={BUSINESS_CATEGORIES}
            />
          </div>
        </div>

        {/* Quick City Jump Shortcuts */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-mono uppercase text-muted-foreground shrink-0">Quick Metros:</span>
          {QUICK_CITIES.map(c => (
            <button
              key={c.label}
              onClick={() => setSearchCity(c.name)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                searchCity.toLowerCase().includes(c.label.toLowerCase())
                  ? 'bg-gold-500 text-brand-dark font-bold shadow-sm'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.key} className="p-5 rounded-2xl border border-border/80 bg-card shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono uppercase">{kpi.label}</span>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">{kpi.change}</span>
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">{kpi.value}</div>
            <p className="text-[11px] text-muted-foreground truncate">{kpi.description}</p>
          </div>
        ))}
      </div>

      {/* Interactive Financial Calculator localized to target City & Category */}
      <RevenueCalculator city={searchCity} category={category} />

      {/* Competitor Benchmark Table */}
      <CompetitorTable cityFilter={searchCity.split(',')[0].trim()} />
    </div>
  );
}

