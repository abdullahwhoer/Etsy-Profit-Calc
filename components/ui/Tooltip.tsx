import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InfoHintProps {
  content: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function InfoHint({ content, className, size = 'sm' }: InfoHintProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className={cn(
          'text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 rounded-full',
          className
        )}
        aria-label="More information"
      >
        <HelpCircle className={cn(size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
      </button>

      {isVisible && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 sm:w-64 p-2.5 bg-slate-900 text-slate-100 text-xs rounded-xl shadow-xl z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150 leading-relaxed border border-slate-800"
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
}
