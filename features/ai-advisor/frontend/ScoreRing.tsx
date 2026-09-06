import React from 'react';

export interface ScoreRingProps {
  score: number;
  max?: number;
  size?: number;
  label?: string;
}

export function ScoreRing({ score, max = 5, size = 150, label }: ScoreRingProps) {
  const strokeWidth = 10;
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const filledOffset = circumference - (score / max) * circumference;

  const color =
    score >= 4.0 ? '#22c55e' : score >= 3.2 ? '#f59e0b' : '#ef4444';

  const defaultLabel =
    score >= 4.0 ? 'Excellent' : score >= 3.2 ? 'Good' : score >= 2.5 ? 'Moderate' : 'Risky';

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-muted/40"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={filledOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-3xl font-bold font-mono tracking-tight" style={{ color }}>
          {score.toFixed(1)}
        </div>
        <div className="text-[11px] font-mono text-muted-foreground uppercase">
          / {max}
        </div>
        <div className="text-xs font-semibold mt-0.5" style={{ color }}>
          {label || defaultLabel}
        </div>
      </div>
    </div>
  );
}

