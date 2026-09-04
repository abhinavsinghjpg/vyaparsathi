import React from 'react';
import { cn } from './utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'gold' | 'green' | 'orange' | 'blue' | 'purple' | 'outline' | 'red';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-muted text-muted-foreground border-transparent',
    gold: 'bg-gold-500/15 text-gold-400 border-gold-500/30',
    green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    orange: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    red: 'bg-red-500/15 text-red-400 border-red-500/30',
    outline: 'border-border text-foreground bg-transparent',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

