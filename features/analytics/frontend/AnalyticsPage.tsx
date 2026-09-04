import { useState } from 'react';
import { RevenueCalculator } from './RevenueCalculator';
import { CompetitorTable } from './CompetitorTable';
import { GovAnalyticsSection } from './GovAnalyticsSection';
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

const CORRIDOR_SUGGESTIONS = [
  { city: 'Jaipur, Rajasthan', label: 'C-Scheme (Subhash Marg), Jaipur', type: 'High-Street Hub' },
  { city: 'Jaipur, Rajasthan', label: 'Malviya Nagar (GT Central), Jaipur', type: 'Mall & Youth' },
  { city: 'Jaipur, Rajasthan', label: 'Raja Park Commercial Belt, Jaipur', type: 'Retail Corridor' },
  { city: 'Bengaluru, Karnataka', label: 'Koramangala 5th Block, Bengaluru', type: 'Startup & Dining' },
  { city: 'Bengaluru, Karnataka', label: 'Indiranagar 100ft Road, Bengaluru', type: 'Premium High-Street' },
  { city: 'Bengaluru, Karnataka', label: 'HSR Layout Sector 1, Bengaluru', type: 'Tech & QSR' },
  { city: 'Delhi NCR', label: 'Connaught Place Inner Circle, Delhi', type: 'Heritage Commercial' },
  { city: 'Delhi NCR', label: 'Cyber City (Cyber Hub), Gurugram', type: 'Corporate Transit' },
  { city: 'Delhi NCR', label: 'Lajpat Nagar Central Market, Delhi', type: 'High-Volume Retail' },
  { city: 'Mumbai, Maharashtra', label: 'Bandra West (Linking Road), Mumbai', type: 'Fashion & Cafe' },
  { city: 'Mumbai, Maharashtra', label: 'Lower Parel High Street, Mumbai', type: 'Corporate Dining' },
  { city: 'Pune, Maharashtra', label: 'FC Road Deccan, Pune', type: 'Student & Youth Hub' },
  { city: 'Pune, Maharashtra', label: 'Koregaon Park North Main, Pune', type: 'Specialty Bistro' },
  { city: 'Hyderabad, Telangana', label: 'Banjara Hills Road No. 12, Hyderabad', type: 'Luxury High-Street' },
  { city: 'Hyderabad, Telangana', label: 'Jubilee Hills Road No. 36, Hyderabad', type: 'Dining & Retail' },
  { city: 'Chennai, Tamil Nadu', label: 'Anna Salai Thousand Lights, Chennai', type: 'Central Business District' },
];

export function AnalyticsPage() {
  const [searchCity, setSearchCity] = useState('Jaipur, Rajasthan');
  const [category, setCategory] = useState('Cafe / Coffee Shop');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  
  // Dynamically calculate KPIs localized to the searched city
  const kpis = analyticsService.getMarketKPIs(searchCity);

  const matchingSuggestions = CORRIDOR_SUGGESTIONS.filter(
    s => s.label.toLowerCase().includes(searchCity.toLowerCase()) || s.city.toLowerCase().includes(searchCity.toLowerCase())
  );

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

      {/* 1. Target Market Search & Filter Engine */}
      <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          {/* Active Search Engine with Dropdown Autocomplete */}
          <div className="sm:col-span-7 space-y-1.5 relative">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin size={13} className="text-gold-400" /> Target City / Catchment Search Engine
            </label>
            <div className="relative">
              <Input
                value={searchCity}
                onChange={e => {
                  setSearchCity(e.target.value);
                  setSuggestionsOpen(true);
                }}
                onFocus={() => setSuggestionsOpen(true)}
                placeholder="Search target city or corridor (e.g. C-Scheme, Jaipur, Koramangala)…"
                leftIcon={<Search size={15} />}
                autoComplete="off"
              />

              {/* Live Autocomplete Dropdown */}
              {suggestionsOpen && matchingSuggestions.length > 0 && (
                <div
                  onMouseLeave={() => setSuggestionsOpen(false)}
                  className="absolute top-full left-0 right-0 mt-1.5 z-50 max-h-64 overflow-y-auto rounded-xl border-2 border-gold-500/40 bg-slate-900 text-white p-2 shadow-2xl"
                >
                  <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-gold-400 font-bold border-b border-white/10 mb-1 flex items-center justify-between">
                    <span>Matching Commercial Corridors</span>
                    <span className="text-slate-400 font-normal">Click to apply</span>
                  </div>
                  {matchingSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSearchCity(item.label);
                        setSuggestionsOpen(false);
                      }}
                      className="flex items-center justify-between px-3 py-2 text-xs text-slate-100 hover:bg-slate-800 hover:text-gold-300 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-gold-400 shrink-0" />
                        <span className="font-semibold">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                        {item.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              onClick={() => {
                setSearchCity(c.name);
                setSuggestionsOpen(false);
              }}
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

      {/* 2. Rent-to-Revenue Stress Test Calculator (Placed directly beneath Search) */}
      <RevenueCalculator city={searchCity} category={category} />

      {/* 3. Official Government Economic & MSME Intelligence Section (Placed below calculator) */}
      <GovAnalyticsSection currentCity={searchCity} />

      {/* 4. Localized Macroeconomic & Micro-market KPI Cards Grid (Updates per searched city) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-gold-400 uppercase tracking-wider">
            {searchCity.split(',')[0].trim()} Macroeconomic & Corridor Health Pulse
          </h3>
          <span className="text-xs text-muted-foreground font-mono">Real-time local retail indicators</span>
        </div>
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
      </div>

      {/* 5. Competitor Pricing Benchmark Table */}
      <CompetitorTable cityFilter={searchCity.split(',')[0].trim()} />
    </div>
  );
}

