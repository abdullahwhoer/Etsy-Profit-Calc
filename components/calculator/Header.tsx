'use client';

import React, { useEffect, useState } from 'react';
import { RotateCcw, Calculator, Sun, Moon, Gift, FileImage, FolderOpen } from 'lucide-react';
import { CalculatorLogo } from '@/components/ui/CalculatorLogo';

interface HeaderProps {
  onReset: () => void;
  onOpenHowItWorks?: () => void;
}

export function Header({ onReset, onOpenHowItWorks }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasDarkClass = document.documentElement.classList.contains('dark');
    setIsDark(hasDarkClass);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    setIsMobileMenuOpen(false);
  };

  const scrollToFreeListings = () => {
    const el = document.getElementById('free-listings-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleMobileReset = () => {
    setIsMobileMenuOpen(false);
    onReset();
  };

  return (
    <header className="glass border-b border-orange-100/60 dark:border-zinc-800/80 sticky top-0 z-30 shadow-xs transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo & Title + Author Credit (No Overflow) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
          <CalculatorLogo size="responsive" />

          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-base md:text-xl font-bold tracking-tight text-slate-900 dark:text-white font-[Plus_Jakarta_Sans,sans-serif] leading-tight truncate">
              Etsy Profit Calculator
            </h1>
            <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-zinc-400 truncate">
              Made by <span className="font-semibold text-slate-700 dark:text-zinc-200">Abdullah Saqib</span>
            </p>
          </div>
        </div>

        {/* Right: Desktop Navigation Items */}
        <nav className="hidden md:flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* Calculator Scroll Link */}
          <button
            type="button"
            onClick={scrollToCalculator}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/80 dark:hover:bg-zinc-800/80 rounded-xl transition-all duration-150 cursor-pointer"
          >
            <Calculator className="h-4 w-4" />
            <span>Calculator</span>
          </button>

          {/* Free Listings Referral Button */}
          <button
            type="button"
            onClick={scrollToFreeListings}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-orange-700 dark:text-orange-300 bg-orange-100/80 hover:bg-orange-200/80 dark:bg-orange-950/60 dark:hover:bg-orange-900/60 border border-orange-200 dark:border-orange-800 rounded-xl transition-all duration-150 cursor-pointer shadow-xs"
            title="Claim 40 free listing credits for new Etsy shops"
          >
            <Gift className="h-4 w-4 text-orange-500 animate-bounce" />
            <span>Free 40 Listings</span>
          </button>

          {/* Keyword Saver Link */}
          <a
            href="/etsy-keyword-saver"
            className="inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/80 dark:hover:bg-zinc-800/80 rounded-xl transition-all duration-150 cursor-pointer"
          >
            <FolderOpen className="h-4 w-4" />
            <span>Keyword Saver</span>
          </a>

          {/* Image Checker Link */}
          <a
            href="/etsy-image-checker"
            className="inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/80 dark:hover:bg-zinc-800/80 rounded-xl transition-all duration-150 cursor-pointer"
          >
            <FileImage className="h-4 w-4" />
            <span>Image Checker</span>
          </a>

          {/* Reset Button */}
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white bg-white/90 dark:bg-zinc-800/90 hover:bg-white dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700/80 hover:border-slate-300 dark:hover:border-zinc-600 rounded-xl transition-all duration-150 cursor-pointer shadow-xs"
            title="Reset calculator inputs to default values"
          >
            <RotateCcw className="h-4 w-4 text-slate-400 dark:text-zinc-400" />
            <span>Reset</span>
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
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-slate-500" />
                <span>Dark</span>
              </>
            )}
          </button>
        </nav>

        {/* Right: Mobile Quick Actions & Hamburger Menu Button */}
        <div className="flex md:hidden items-center gap-1.5 flex-shrink-0">
          {/* Quick Theme Toggle on Mobile */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-2 text-slate-700 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 bg-white/80 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/80 rounded-xl transition-all duration-150 cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {mounted && isDark ? (
              <Sun className="h-4 w-4 text-amber-400 fill-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600 dark:text-zinc-300" />
            )}
          </button>

          {/* Quick Reset on Mobile */}
          <button
            type="button"
            onClick={onReset}
            className="p-2 text-slate-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 bg-white/80 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/80 rounded-xl transition-all duration-150 cursor-pointer"
            title="Reset calculator inputs"
            aria-label="Reset calculator inputs"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-800 dark:text-zinc-100 hover:text-orange-600 dark:hover:text-orange-400 bg-orange-50/80 dark:bg-zinc-800 border border-orange-200/80 dark:border-zinc-700 rounded-xl transition-all duration-150 cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-4 h-4 relative flex flex-col justify-center gap-1">
              <span
                className={`block h-0.5 w-4 bg-current rounded-full transition-all duration-200 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-4 bg-current rounded-full transition-all duration-200 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block h-0.5 w-4 bg-current rounded-full transition-all duration-200 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-orange-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <div className="px-4 py-4 space-y-2">
            <button
              type="button"
              onClick={scrollToCalculator}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-zinc-200 hover:bg-orange-50 dark:hover:bg-zinc-800/80 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                <Calculator className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="block font-bold">Calculator</span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal">Back to pricing form</span>
              </div>
            </button>

            <button
              type="button"
              onClick={scrollToFreeListings}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-orange-950 dark:text-orange-200 bg-orange-100/60 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/50 hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-xs">
                <Gift className="h-4 w-4 animate-bounce" />
              </div>
              <div className="text-left">
                <span className="block font-bold text-orange-700 dark:text-orange-300">Free 40 Listings Credits</span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal">Claim $8.00 new shop starter bonus</span>
              </div>
            </button>

            <a
              href="/etsy-keyword-saver"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-zinc-200 hover:bg-orange-50 dark:hover:bg-zinc-800/80 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <FolderOpen className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="block font-bold">Keyword Saver</span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal">Private keyword vault & organizer</span>
              </div>
            </a>

            <a
              href="/etsy-image-checker"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-zinc-200 hover:bg-orange-50 dark:hover:bg-zinc-800/80 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                <FileImage className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="block font-bold">Image Checker</span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal">Check Etsy listing image sizes</span>
              </div>
            </a>

            <button
              type="button"
              onClick={handleMobileReset}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-zinc-200 hover:bg-rose-50 dark:hover:bg-zinc-800/80 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                <RotateCcw className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="block font-bold">Reset Form</span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal">Clear all inputs to default</span>
              </div>
            </button>

            {/* Mobile Mode Switcher Row */}
            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between px-3 py-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">Theme</span>
              <button
                type="button"
                onClick={toggleDarkMode}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200"
              >
                {mounted && isDark ? (
                  <>
                    <Sun className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5 text-slate-500" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


