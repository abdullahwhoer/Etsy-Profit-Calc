import React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'text-xs sm:text-sm font-medium text-slate-700 select-none flex items-center gap-1.5',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-amber-500">*</span>}
    </label>
  );
}
