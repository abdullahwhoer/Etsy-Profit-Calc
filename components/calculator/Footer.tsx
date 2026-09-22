'use client';

import React from 'react';
import { CalculatorLogo } from '@/components/ui/CalculatorLogo';
import { Calculator, HelpCircle, RotateCcw, Heart } from 'lucide-react';

interface FooterProps {
  onReset: () => void;
  onOpenHowItWorks: () => void;
}

export function Footer({ onReset, onOpenHowItWorks }: FooterProps) {
  const scrollToCalculator = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-100/90 dark:bg-zinc-950/95 border-t border-slate-200/80 dark:border-zinc-800/80 text-slate-600 dark:text-zinc-400 text-xs mt-16 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          {/* Brand Info (7 cols) */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center gap-3">
              <CalculatorLogo size="md" showPulse={false} />
              <div>
                <span className="text-base font-bold text-slate-900 dark:text-white font-[Plus_Jakarta_Sans,sans-serif] block leading-tight">
                  Etsy Profit Calculator
                </span>
                <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                  Seller fee & net profit analytics
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-md">
              Calculate your real net profit after Etsy transaction fees, payment processing, shipping costs, listing renewal fees, and advertising expenses.
            </p>

            <div className="pt-1 flex items-center gap-1.5 text-xs text-slate-700 dark:text-zinc-300 font-medium">
              <span>Made with</span>
              <Heart className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
              <span>by</span>
              <span className="font-bold text-slate-900 dark:text-white">Abdullah Saqib</span>
            </div>
          </div>

          {/* Quick Navigation (5 cols) */}
          <div className="md:col-span-5 space-y-3 md:text-right">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-zinc-200">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={scrollToCalculator}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
                >
                  <Calculator className="h-3.5 w-3.5" />
                  <span>Calculator Top</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenHowItWorks}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>How Etsy Fees Work</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Form</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="border-t border-slate-200/60 dark:border-zinc-800/80 pt-6 space-y-3 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 max-w-xl leading-relaxed">
            Independent Etsy selling cost and profit estimation tool. Etsy fees, policies, and rates are subject to change by Etsy, Inc.
          </p>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono flex-shrink-0">
            © 2026 Etsy Profit Calculator. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
