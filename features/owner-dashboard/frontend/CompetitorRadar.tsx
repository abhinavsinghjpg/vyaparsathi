import { Crosshair, MapPin } from 'lucide-react';
import type { StoreTelemetry } from '@/types/schema';

export function CompetitorRadar({ telemetry }: { telemetry: StoreTelemetry }) {
  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-card shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Crosshair size={18} className="text-gold-400" /> Local Competitor Radar (500m)
          </h3>
          <p className="text-xs text-muted-foreground">
            Estimated market footfall share absorbed by nearby competing outlets.
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {telemetry.nearbyCompetitors.map(comp => (
          <div key={comp.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">{comp.name}</span>
              <span className="font-mono text-gold-400 font-bold">{comp.footfallShare}% footfall share</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-500 to-amber-500"
                style={{ width: `${comp.footfallShare * 2}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

