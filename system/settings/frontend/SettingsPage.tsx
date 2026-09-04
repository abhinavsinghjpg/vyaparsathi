import { useState } from 'react';
import { User, Store, Key, Sliders, CheckCircle2, Shield } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Tabs } from '@/components/Tabs';
import { useAuth } from '@/system/auth/frontend/AuthContext';

export function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [businessName, setBusinessName] = useState(user.businessName || 'Artisan Roast & Brew');
  const [city, setCity] = useState(user.city || 'Bengaluru');
  const [geminiKey, setGeminiKey] = useState('AIzaSyD_DEMO_KEY_MOCKED_SECURE_981');
  const [mapboxKey, setMapboxKey] = useState('pk.eyJ1IjoiZGVtb19leHBsb3JlciJ9_DEMO');
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const tabs = [
    { id: 'profile', label: 'User Profile', icon: <User size={14} /> },
    { id: 'business', label: 'Store & Business Focus', icon: <Store size={14} /> },
    { id: 'apikeys', label: 'AI & Map API Keys', icon: <Key size={14} /> },
    { id: 'system', label: 'System Preferences', icon: <Sliders size={14} /> },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
          Platform Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Configure founder profile details, business location telemetry, and third-party AI keys.
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-card shadow-sm space-y-6">
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-mono">
              Founder Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
                <Input value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'business' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-mono">
              Store & Enterprise Focus
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Brand / Trade Name</label>
                <Input value={businessName} onChange={e => setBusinessName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Registered Metro</label>
                <Input value={city} onChange={e => setCity(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'apikeys' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-mono">
              Third-Party Intelligence Credentials (Optional)
            </h3>
            <p className="text-xs text-muted-foreground">
              By default, VyaparMap operates seamlessly with internal heuristic models and cached presentation datasets. You can add your own keys for live production calls.
            </p>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Google Gemini API Key</label>
                <Input type="password" value={geminiKey} onChange={e => setGeminiKey(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Mapbox / OSM Token</label>
                <Input type="password" value={mapboxKey} onChange={e => setMapboxKey(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-mono">
              System Environment
            </h3>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span>Display Language</span>
                <span className="font-mono font-bold text-foreground">English (Primary)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active Simulation Mode</span>
                <span className="font-mono font-bold text-gold-400">Simulation Engine v2.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active Database Mode</span>
                <span className="font-mono text-emerald-400">Memory Database (Zero Network Overhead)</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border/70">
          <div>
            {savedToast && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium animate-fade-in">
                <CheckCircle2 size={14} /> Preferences Saved Successfully!
              </span>
            )}
          </div>
          <Button variant="gold" size="md" type="submit">
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}

