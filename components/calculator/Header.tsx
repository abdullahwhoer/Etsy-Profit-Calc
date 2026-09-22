'use client';

import React, { useEffect, useState } from 'react';
import { RotateCcw, HelpCircle, Calculator, Sun, Moon } from 'lucide-react';
import { CalculatorLogo } from '@/components/ui/CalculatorLogo';

interface HeaderProps {
  onReset: () => void;
  onOpenHowItWorks: () => void;
}

export function Header({ onReset, onOpenHowItWorks }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasDarkClass = document.documentElement.classList.contains('dark');
    setIsDark(hasDarkClass);
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  const scrollToCalculator = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="glass border-b border-orange-100/60 dark:border-zinc-800/80 sticky top-0 z-30 shadow-sm transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Title + Author Credit */}
        <div className="flex items-center gap-3.5">
          <CalculatorLogo size="md" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white font-[Plus_Jakarta_Sans,sans-serif] leading-tight">
                Etsy Profit Calculator
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">
              Made by <span className="font-semibold text-slate-700 dark:text-zinc-200">Abdullah Saqib</span>
            </p>
          </div>
        </div>

        {/* Right: Navigation & Dark Mode Toggle */}
        <nav className="flex items-center gap-2 sm:gap-2.5">
          {/* Calculator Scroll Link */}
          <button
            type="button"
            onClick={scrollToCalculator}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/80 dark:hover:bg-zinc-800/80 rounded-xl transition-all duration-150 cursor-pointer"
          >
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </button>

          {/* How It Works Modal Trigger */}
          <button
            type="button"
            onClick={onOpenHowItWorks}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/80 dark:hover:bg-zinc-800/80 rounded-xl transition-all duration-150 cursor-pointer"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">How It Works</span>
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white bg-white/90 dark:bg-zinc-800/90 hover:bg-white dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700/80 hover:border-slate-300 dark:hover:border-zinc-600 rounded-xl transition-all duration-150 cursor-pointer shadow-xs"
            title="Reset calculator inputs to default values"
          >
            <RotateCcw className="h-4 w-4 text-slate-400 dark:text-zinc-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 bg-white/90 dark:bg-zinc-800/90 hover:bg-white dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700/80 rounded-xl transition-all duration-150 cursor-pointer shadow-xs"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {mounted && isDark ? (
              <>
                <Sun className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-slate-500" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}


