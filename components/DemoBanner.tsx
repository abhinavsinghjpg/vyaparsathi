import { AlertCircle, Sparkles } from 'lucide-react';

export function DemoBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-amber-500/15 via-gold-500/20 to-orange-500/15 border-b border-gold-500/20 px-4 py-1.5 text-xs text-center text-amber-200/90 flex items-center justify-center gap-2 select-none">
      <AlertCircle size={13} className="text-gold-400 shrink-0" />
      <span>
        <strong>Demo Presentation Mode:</strong> All metrics, locations, and pricing shown are sample data for interface demonstration.
      </span>
      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-gold-300/80 bg-gold-500/10 px-2 py-0.5 rounded-full border border-gold-500/20">
        <Sparkles size={11} /> VyaparMap Engine v2.0
      </span>
    </div>
  );
}

