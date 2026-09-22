import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'locked' | 'outline';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors',
        variant === 'default' && 'bg-slate-100 text-slate-800 border border-slate-200',
        variant === 'success' &&
          'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm shadow-emerald-100',
        variant === 'warning' &&
          'bg-amber-50 text-amber-700 border border-amber-200',
        variant === 'danger' &&
          'bg-rose-50 text-rose-700 border border-rose-200 shadow-sm shadow-rose-100',
        variant === 'info' &&
          'bg-indigo-50 text-indigo-700 border border-indigo-200',
        variant === 'locked' &&
          'bg-slate-100/90 text-slate-600 border border-slate-200/90 font-mono text-[11px]',
        variant === 'outline' &&
          'bg-transparent text-slate-600 border border-slate-300',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
