import React from 'react';
import { cn } from './utils';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  label?: string;
  onChange: (value: number) => void;
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  unit = '',
  label,
  className,
  onChange,
  ...props
}: SliderProps) {
  return (
    <div className={cn('w-full space-y-2', className)}>
      {(label || unit) && (
        <div className="flex items-center justify-between text-xs font-medium">
          {label && <span className="text-muted-foreground uppercase tracking-wider">{label}</span>}
          <span className="font-bold text-brand-orange text-sm font-mono">
            {value.toLocaleString('en-IN')} {unit}
          </span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-muted/70 rounded-lg appearance-none cursor-pointer accent-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
        {...props}
      />
      <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
        <span>{min.toLocaleString('en-IN')} {unit}</span>
        <span>{max.toLocaleString('en-IN')} {unit}</span>
      </div>
    </div>
  );
}

