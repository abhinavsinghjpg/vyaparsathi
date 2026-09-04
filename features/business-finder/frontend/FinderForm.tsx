import { useState } from 'react';
import { Wallet, MapPin, Briefcase, Sparkles } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import type { BusinessFinderInput } from './businessFinder.service';

const CITIES = [
  { value: 'Bengaluru', label: 'Bengaluru, Karnataka' },
  { value: 'Delhi', label: 'Delhi NCR' },
  { value: 'Mumbai', label: 'Mumbai, Maharashtra' },
  { value: 'Jaipur', label: 'Jaipur, Rajasthan' },
  { value: 'Pune', label: 'Pune, Maharashtra' },
  { value: 'Chennai', label: 'Chennai, Tamil Nadu' },
];

const SKILLSETS = [
  { value: 'all', label: 'All Industries (Explore Everything)' },
  { value: 'tech', label: 'Technical & Repair Services' },
  { value: 'food', label: 'Culinary & F&B Management' },
  { value: 'fitness', label: 'Health, Wellness & Fitness' },
  { value: 'retail', label: 'Customer Retail & Merchandising' },
  { value: 'education', label: 'Teaching, Coaching & Mentorship' },
];

export function FinderForm({ onSubmit, isLoading }: { onSubmit: (input: BusinessFinderInput) => void; isLoading: boolean }) {
  const [budget, setBudget] = useState(500000);
  const [city, setCity] = useState('Bengaluru');
  const [skillset, setSkillset] = useState('food');

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    onSubmit({ budget, city: newCity, skillset });
  };

  const handleSkillsetChange = (newSkillset: string) => {
    setSkillset(newSkillset);
    onSubmit({ budget, city, skillset: newSkillset });
  };

  const handleBudgetChange = (newBudget: number) => {
    setBudget(newBudget);
    onSubmit({ budget: newBudget, city, skillset });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ budget, city, skillset });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-border/80 bg-card space-y-5 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground">Find Ideal Business Models</h3>
        <p className="text-xs text-muted-foreground">
          Enter your capital parameters to generate ranked commercial models suited for your budget and city.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Budget */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Wallet size={13} /> Capital Available (₹)
          </label>
          <Input
            type="number"
            min={50000}
            step={25000}
            value={budget}
            onChange={e => handleBudgetChange(Number(e.target.value))}
          />
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <MapPin size={13} /> Target Metro
          </label>
          <Select
            value={city}
            onChange={e => handleCityChange(e.target.value)}
            options={CITIES}
          />
        </div>

        {/* Skillset */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Briefcase size={13} /> Founder Interest
          </label>
          <Select
            value={skillset}
            onChange={e => handleSkillsetChange(e.target.value)}
            options={SKILLSETS}
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="gold"
        size="md"
        isLoading={isLoading}
        className="w-full sm:w-auto gap-2"
      >
        <Sparkles size={15} /> Analyze & Match Businesses
      </Button>
    </form>
  );
}

