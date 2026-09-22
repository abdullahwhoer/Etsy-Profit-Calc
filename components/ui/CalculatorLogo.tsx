import React from 'react';
import Image from 'next/image';

interface CalculatorLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export function CalculatorLogo({ size = 'md', showPulse = true }: CalculatorLogoProps) {
  const containerClasses = {
    sm: 'h-9 w-9 p-0.5',
    md: 'h-11 w-11 p-0.5',
    lg: 'h-13 w-13 p-0.5',
  }[size];

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${containerClasses} bg-transparent flex items-center justify-center transition-transform hover:scale-105 duration-200`}
      >
        <img
          src="/logo.png"
          alt="Etsy Profit Calculator Logo"
          className="w-full h-full object-contain rounded-full bg-transparent"
        />
      </div>

      {showPulse && (
        <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white dark:border-zinc-900"></span>
        </span>
      )}
    </div>
  );
}

