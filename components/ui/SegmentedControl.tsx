import React from 'react';
import { cn } from '@/lib/utils';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  size = 'md',
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        'relative flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 w-full',
        className
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 cursor-pointer select-none',
              size === 'sm' && 'py-1.5 px-3 text-xs',
              size === 'md' && 'py-2 px-3.5 text-sm',
              size === 'lg' && 'py-2.5 px-4 text-base',
              isSelected
                ? 'bg-white text-slate-900 shadow-sm shadow-slate-200 font-semibold border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
            )}
          >
            {option.icon && <span className="shrink-0">{option.icon}</span>}
            <span>{option.label}</span>
            {option.badge && (
              <span
                className={cn(
                  'text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full',
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'bg-slate-200 text-slate-600'
                )}
              >
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
