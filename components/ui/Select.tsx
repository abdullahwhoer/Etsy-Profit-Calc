import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  iconNode?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, iconNode, children, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {iconNode && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
            {iconNode}
          </div>
        )}
        <select
          ref={ref}
          className={cn(
            'appearance-none flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 pr-10 text-sm sm:text-base font-medium text-slate-900 shadow-sm transition-all duration-150 cursor-pointer',
            'hover:border-slate-300',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-600',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
            iconNode && 'pl-9',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} {opt.sublabel ? `(${opt.sublabel})` : ''}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    );
  }
);
Select.displayName = 'Select';
