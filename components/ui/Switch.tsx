import React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  label?: string;
  description?: string;
  badge?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  id,
  label,
  description,
  badge,
}: SwitchProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      {(label || description) && (
        <div className="flex flex-col space-y-0.5">
          {label && (
            <label
              htmlFor={id}
              className="text-sm font-semibold text-slate-900 cursor-pointer flex items-center gap-2"
            >
              {label}
              {badge && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {badge}
                </span>
              )}
            </label>
          )}
          {description && (
            <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
          )}
        </div>
      )}

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onCheckedChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/30 focus-visible:ring-offset-2',
          checked ? 'bg-indigo-600' : 'bg-slate-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
}
