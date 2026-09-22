import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixNode?: React.ReactNode;
  suffixNode?: React.ReactNode;
  isReadOnlyCustom?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', prefixNode, suffixNode, isReadOnlyCustom, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {prefixNode && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 font-medium text-sm sm:text-base select-none">
            {prefixNode}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm sm:text-base font-medium text-slate-900 shadow-sm transition-all duration-150',
            'placeholder:text-slate-400 placeholder:font-normal',
            'hover:border-slate-300',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-600',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
            prefixNode && 'pl-9',
            suffixNode && 'pr-9',
            isReadOnlyCustom &&
              'bg-slate-50 text-slate-700 border-slate-200 cursor-default focus-visible:ring-0 focus-visible:border-slate-200',
            className
          )}
          ref={ref}
          {...props}
        />
        {suffixNode && (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400 font-medium text-sm select-none">
            {suffixNode}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
