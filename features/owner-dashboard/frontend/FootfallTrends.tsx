import { useState } from 'react';
import type { StoreDashboardData } from '../backend/ownerDashboard.db';
import { Footprints, Clock, Calendar, CalendarDays, CheckCircle2, AlertCircle } from 'lucide-react';

interface FootfallTrendsProps {
  data: StoreDashboardData;
}

export function FootfallTrends({ data }: FootfallTrendsProps) {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  const currentSeries =
    timeframe === '24h'
      ? data.walkInTrends.hours24
      : timeframe === '7d'
      ? data.walkInTrends.days7
      : data.walkInTrends.days30;

  const maxVal = Math.max(...currentSeries.map(s => s.patrons), 10);

  const getPeakPoint = () => {
    let peak = currentSeries[0];
    currentSeries.forEach(pt => {
      if (pt.patrons > peak.patrons) peak = pt;
    });
    return peak;
  };

  const peak = getPeakPoint();

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-card shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Footprints size={18} className="text-gold-400" />
              {data.isVerified ? 'Live Customer Walk-ins Telemetry' : 'Estimated Customer Walk-ins'}
            </h3>
            {data.isVerified ? (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 size={11} /> Sensor Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <AlertCircle size={11} /> Modeled Projection
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {data.isVerified
              ? 'Real-time laser sensor & WiFi node telemetry installed in ' + data.location + '.'
              : 'Statistical corridor traffic simulation calibrated for ' + data.businessType + '.'}
          </p>
        </div>

        {/* 24hrs / 7 days / 30 days Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-xl border border-border/60 text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimeframe('24h')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              timeframe === '24h'
                ? 'bg-card font-bold text-foreground shadow-sm ring-1 ring-border/80'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Clock size={13} />
            <span>24 Hours</span>
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('7d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              timeframe === '7d'
                ? 'bg-card font-bold text-foreground shadow-sm ring-1 ring-border/80'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Calendar size={13} />
            <span>7 Days</span>
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('30d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              timeframe === '30d'
                ? 'bg-card font-bold text-foreground shadow-sm ring-1 ring-border/80'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CalendarDays size={13} />
            <span>30 Days</span>
          </button>
        </div>
      </div>

      {/* Meta Stats Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-gold-600 to-amber-400" />
            <span className="text-muted-foreground font-mono">
              {timeframe === '24h' ? 'Hourly Walk-ins' : timeframe === '7d' ? 'Daily Patrons' : 'Weekly Total'}
            </span>
          </div>
          <div className="text-muted-foreground font-mono text-[11px]">
            Peak Surge: <strong className="text-gold-400">{peak.label}</strong> ({peak.patrons} patrons)
          </div>
        </div>

        <span className="text-[11px] font-mono text-muted-foreground">
          Tracked Storage: <code className="text-gold-400 bg-muted/60 px-1.5 py-0.5 rounded">{data.storageKey}</code>
        </span>
      </div>

      {/* Dynamic Bar Chart Visualization */}
      <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 border-b border-border/70">
        {currentSeries.map((item, idx) => {
          const heightPercent = Math.max(8, (item.patrons / maxVal) * 100);
          const isPeak = item.patrons === peak.patrons;

          return (
            <div key={`${item.label}-${idx}`} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-gold-300 font-bold mb-1">
                {item.patrons}
              </div>
              <div className="w-full flex items-end justify-center h-full">
                <div
                  className={`w-full max-w-[28px] rounded-t-lg transition-all duration-500 relative ${
                    isPeak
                      ? 'bg-gradient-to-t from-amber-600 to-gold-400 shadow-md shadow-gold-500/20 ring-1 ring-gold-400/50'
                      : 'bg-gold-500/80 hover:bg-gold-400 group-hover:opacity-100'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                  title={`${item.label}: ${item.patrons} patrons`}
                />
              </div>
              <span className={`text-[11px] font-mono truncate ${isPeak ? 'font-bold text-gold-400' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
