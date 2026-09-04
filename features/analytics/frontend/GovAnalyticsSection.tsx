import { useState, useEffect } from 'react';
import {
  Landmark,
  Search,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Building2,
  Activity,
  Award,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { governmentDataService } from '@/features/government-data/frontend/governmentData.service';
import type { DistrictMsmeStats, PostalApiResponse, PostalOfficeInfo } from '@/types/schema';
import { formatCurrency } from '@/components/utils';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

interface GovAnalyticsSectionProps {
  currentCity: string;
}

const SAMPLE_PINS = [
  { pin: '302001', label: 'Jaipur (C-Scheme)' },
  { pin: '560034', label: 'Bengaluru (Koramangala)' },
  { pin: '110001', label: 'Delhi (Connaught Place)' },
  { pin: '400050', label: 'Mumbai (Bandra West)' },
  { pin: '411004', label: 'Pune (Deccan)' },
  { pin: '600002', label: 'Chennai (Anna Salai)' },
];

const CITY_PIN_MAP: Record<string, string> = {
  jaipur: '302001',
  bengaluru: '560034',
  bangalore: '560034',
  delhi: '110001',
  mumbai: '400050',
  pune: '411004',
  hyderabad: '500034',
  chennai: '600002',
};

export function GovAnalyticsSection({ currentCity }: GovAnalyticsSectionProps) {
  const [pinInput, setPinInput] = useState('302001');
  const [postalData, setPostalData] = useState<PostalApiResponse | null>(null);
  const [isSearchingPin, setIsSearchingPin] = useState(false);
  const [activeTab, setActiveTab] = useState<'pincode' | 'msme' | 'schemes'>('pincode');

  const districtStats = governmentDataService.getDistrictMsmeStats(currentCity);
  const allSchemes = governmentDataService.getAllGovSchemes();

  const handleFetchPin = async (pinToQuery: string) => {
    setIsSearchingPin(true);
    try {
      const res = await governmentDataService.fetchPincodeData(pinToQuery);
      setPostalData(res);
    } finally {
      setIsSearchingPin(false);
    }
  };

  useEffect(() => {
    const raw = (currentCity || '').toLowerCase();
    const matchedKey = Object.keys(CITY_PIN_MAP).find(k => raw.includes(k));
    const targetPin = matchedKey ? CITY_PIN_MAP[matchedKey] : '302001';
    setPinInput(targetPin);
    handleFetchPin(targetPin);
  }, [currentCity]);

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-gold-500/40 bg-gradient-to-br from-card via-card/95 to-gold-950/20 shadow-lg space-y-6">
      {/* Header with National Portal Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border/70">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 shrink-0 shadow-inner">
            <Landmark size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="gold" className="text-[10px] font-mono tracking-widest uppercase flex items-center gap-1">
                <ShieldCheck size={11} /> Open Government Data (OGD)
              </Badge>
              <span className="text-xs font-mono text-muted-foreground">
                India Post API · Ministry of MSME · MoSPI
              </span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-foreground mt-0.5">
              Official Government Economic & MSME Intelligence
            </h2>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/80 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('pincode')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'pincode'
                ? 'bg-gold-500 text-brand-dark font-bold shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            India Post API
          </button>
          <button
            onClick={() => setActiveTab('msme')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'msme'
                ? 'bg-gold-500 text-brand-dark font-bold shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            District MSME Density
          </button>
          <button
            onClick={() => setActiveTab('schemes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'schemes'
                ? 'bg-gold-500 text-brand-dark font-bold shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Govt Subsidies & Schemes
          </button>
        </div>
      </div>

      {/* Tab 1: Live India Post Pincode & Catchment API */}
      {activeTab === 'pincode' && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <h3 className="text-sm font-bold font-mono text-gold-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin size={15} /> Live Postal Catchment & Delivery Zone Scanner
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Connects directly to the Department of Posts (<code className="text-gold-400 font-mono">api.postalpincode.in</code>) 
              to verify postal divisions, sub-post offices, and administrative delivery jurisdictions for any Indian commercial address.
            </p>
          </div>

          {/* Search Input and Sample Buttons */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  placeholder="Enter any 6-digit Indian PIN code (e.g. 302001)..."
                  leftIcon={<Search size={15} />}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleFetchPin(pinInput);
                  }}
                />
              </div>
              <Button
                variant="gold"
                onClick={() => handleFetchPin(pinInput)}
                disabled={isSearchingPin || pinInput.length < 6}
                className="gap-2 shrink-0 font-bold"
              >
                {isSearchingPin ? <Activity size={14} className="animate-spin" /> : <Search size={14} />}
                Query India Post API
              </Button>
            </div>

            {/* Quick Sample Pins */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-mono uppercase text-muted-foreground">Sample Metros:</span>
              {SAMPLE_PINS.map(s => (
                <button
                  key={s.pin}
                  onClick={() => {
                    setPinInput(s.pin);
                    handleFetchPin(s.pin);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all ${
                    pinInput === s.pin
                      ? 'bg-gold-500/20 text-gold-300 border-gold-500/40 font-bold'
                      : 'bg-muted/40 text-muted-foreground border-border/70 hover:text-foreground'
                  }`}
                >
                  {s.label} ({s.pin})
                </button>
              ))}
            </div>
          </div>

          {/* Live Postal API Result Container */}
          {postalData && (
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Badge variant={postalData.Status === 'Success' ? 'green' : 'red'} className="text-[10px] font-mono">
                    Status: {postalData.Status} (HTTP 200 OK)
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {postalData.PostOffice ? `${postalData.PostOffice.length} Registered Post Offices Found` : postalData.Message}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-muted-foreground">
                  API: <span className="text-gold-400">api.postalpincode.in</span>
                </span>
              </div>

              {postalData.PostOffice && postalData.PostOffice.length > 0 && (
                <>
                  {/* Top Jurisdiction Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs">
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-mono">Postal Circle</div>
                      <div className="font-bold text-foreground mt-0.5">{postalData.PostOffice[0].circle}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-mono">Postal Division</div>
                      <div className="font-bold text-foreground mt-0.5">{postalData.PostOffice[0].division}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-mono">District</div>
                      <div className="font-bold text-emerald-400 mt-0.5">{postalData.PostOffice[0].district}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-mono">State</div>
                      <div className="font-bold text-foreground mt-0.5">{postalData.PostOffice[0].state}</div>
                    </div>
                  </div>

                  {/* Registered Delivery Post Offices Grid */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono font-bold uppercase text-muted-foreground">
                      Branch Offices in Catchment
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                      {postalData.PostOffice.map((po, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-muted/20 border border-border/50 text-xs space-y-1 hover:border-gold-500/30 transition-all"
                        >
                          <div className="font-semibold text-foreground flex items-center justify-between">
                            <span className="truncate">{po.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 shrink-0">
                              {po.deliveryStatus}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground flex justify-between font-mono">
                            <span>{po.branchType}</span>
                            <span className="text-gold-400 font-bold">{po.pincode}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Official District MSME Density & MoSPI Benchmarks */}
      {activeTab === 'msme' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold font-mono text-gold-400 uppercase tracking-wider">
                Official Udyam Registration Density: {districtStats.district}, {districtStats.state}
              </h3>
              <p className="text-xs text-muted-foreground">
                Direct statutory data compiled from the Ministry of MSME national dashboard and MoSPI economic survey.
              </p>
            </div>
            <Badge variant="gold" className="text-[10px] font-mono self-start sm:self-auto">
              District: {districtStats.district}
            </Badge>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
              <div className="text-[10px] uppercase font-mono text-muted-foreground">Total Registered MSMEs</div>
              <div className="text-2xl font-bold font-mono text-foreground">
                {districtStats.totalRegisteredMsmes.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-emerald-400">Official Ministry of MSME Records</div>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
              <div className="text-[10px] uppercase font-mono text-muted-foreground">Micro Enterprises</div>
              <div className="text-2xl font-bold font-mono text-blue-400">
                {districtStats.microCount.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {((districtStats.microCount / districtStats.totalRegisteredMsmes) * 100).toFixed(1)}% of total enterprises
              </div>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
              <div className="text-[10px] uppercase font-mono text-muted-foreground">Urban CPI Index (MoSPI)</div>
              <div className="text-2xl font-bold font-mono text-purple-400">
                {districtStats.urbanCpiInflationIndex}
              </div>
              <div className="text-[10px] text-muted-foreground">Consumer Price Index (Base 2012=100)</div>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
              <div className="text-[10px] uppercase font-mono text-muted-foreground">Urban Spending Power (MPCE)</div>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {formatCurrency(districtStats.monthlyPerCapitaSpendingUrban)}
              </div>
              <div className="text-[10px] text-muted-foreground">Monthly per capita expenditure</div>
            </div>
          </div>

          {/* Top Clusters & Priority Lending Rebates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-3">
              <div className="text-xs font-mono font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                <Building2 size={13} className="text-gold-400" />
                Dominant Commercial & Industrial Clusters
              </div>
              <div className="flex flex-wrap gap-2">
                {districtStats.topClusters.map(c => (
                  <span
                    key={c}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-muted/60 text-foreground border border-border/70"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-3">
              <div className="text-xs font-mono font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                <Zap size={13} className="text-emerald-400" />
                RBI Priority Sector Lending (PSL) Rebate
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Registered retail units in {districtStats.district} qualify for an interest rate concession of{' '}
                <strong className="text-foreground">{districtStats.priorityLendingInterestDiscount}</strong> under RBI PSL guidelines, 
                along with commercial electricity tariff at ₹{districtStats.commercialElectricityRatePerUnit}/unit.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Official Government MSME Subsidies Directory */}
      {activeTab === 'schemes' && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-sm font-bold font-mono text-gold-400 uppercase tracking-wider">
              National Government MSME Subsidies & Loan Schemes
            </h3>
            <p className="text-xs text-muted-foreground">
              Official credit schemes backed by the Ministry of MSME, Ministry of Finance, SIDBI, and KVIC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allSchemes.map(s => (
              <div
                key={s.id}
                className="p-5 rounded-2xl bg-card border border-border/80 space-y-3 flex flex-col justify-between hover:border-gold-500/40 transition-all shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono bg-gold-500/15 text-gold-400 border border-gold-500/30">
                      {s.code}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">{s.ministry}</span>
                  </div>

                  <h4 className="text-base font-bold text-foreground">{s.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.benefitSummary}</p>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-muted/30 border border-border/50">
                      <div className="text-[10px] text-muted-foreground uppercase">Assistance</div>
                      <div className="font-bold text-emerald-400 truncate">{s.maxAssistance}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/30 border border-border/50">
                      <div className="text-[10px] text-muted-foreground uppercase">Collateral</div>
                      <div className="font-bold text-purple-400 truncate">{s.collateralRequirement}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground truncate">{s.eligibility}</span>
                  <a
                    href={s.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-gold-400 hover:text-gold-300 shrink-0"
                  >
                    <span>Portal</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Unified JanSamarth Portal Direct Gateway */}
          <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Award size={18} className="text-gold-400 shrink-0" />
              <span>
                Apply for all 13 credit-linked Government of India schemes through the unified{' '}
                <strong className="text-foreground">JanSamarth Portal</strong> with zero intermediary charges.
              </span>
            </div>
            <a
              href="https://www.jansamarth.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <Button variant="gold" size="sm" className="font-bold gap-1.5">
                Visit JanSamarth Portal <ExternalLink size={13} />
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

