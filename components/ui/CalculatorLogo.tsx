import React from 'react';
import Image from 'next/image';

interface CalculatorLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export function CalculatorLogo({ size = 'md', showPulse = true }: CalculatorLogoProps) {
  const dimensions = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10',
  }[size];

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${dimensions} rounded-xl overflow-hidden shadow-md shadow-orange-500/20 ring-1 ring-orange-400/30 dark:ring-zinc-700 bg-orange-50 dark:bg-zinc-900 flex items-center justify-center`}
      >
        <img
          src="/logo.png"
          alt="Etsy Profit Calculator Logo"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {showPulse && (
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white dark:border-zinc-900"></span>
        </span>
      )}
    </div>
  );
}

