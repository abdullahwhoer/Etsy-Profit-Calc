'use client';

import React, { useState, useMemo } from 'react';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { CalculatorForm } from './CalculatorForm';
import { ResultsDashboard } from './ResultsDashboard';
import { HowItWorksModal } from './HowItWorksModal';
import { calculateEtsyProfit } from '@/lib/etsy/calculator';
import { DEFAULT_CALCULATOR_INPUT } from '@/lib/etsy/constants';
import { CalculatorInput, CurrencyCode, ProductType } from '@/types/etsy';
import { formatCurrency, formatPercentClean } from '@/lib/utils';
import { ArrowRight, Download, Package, TrendingUp } from 'lucide-react';

import { CountryFeesChartSection } from './CountryFeesChartSection';
import { FreeListingsSection } from './FreeListingsSection';

// Production SaaS Footer
import { Footer } from './Footer';

export function EtsyCalculator() {


  const [input, setInput] = useState<CalculatorInput>(DEFAULT_CALCULATOR_INPUT);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Pure live calculation
  const result = useMemo(() => {
    return calculateEtsyProfit(input);
  }, [input]);

  const handleReset = () => {
    setInput(DEFAULT_CALCULATOR_INPUT);
  };

  const handleInputChange = <K extends keyof CalculatorInput>(
    key: K,
    value: CalculatorInput[K]
  ) => {
    setInput((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleProductTypeChange = (productType: ProductType) => {
    setInput((prev) => ({
      ...prev,
      productType,
      ...(productType === 'digital'
        ? {
            productCost: 0,
            packagingCost: 0,
            shippingCharged: 0,
            actualShippingCost: 0,
            etsyAdsCost: 0,
            etsyAdsEnabled: false,
          }
        : {}),
    }));
  };

  const handleCountryChange = (country: string, defaultCurrency: CurrencyCode) => {
    setInput((prev) => ({
      ...prev,
      country,
      currency: defaultCurrency,
    }));
  };

  const isDigital = input.productType === 'digital';

  return (
    <div className="min-h-screen pb-24 lg:pb-0">

      {/* Decorative background orbs (Warm Etsy Orange Theme) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-400/15 dark:bg-orange-600/10 rounded-full blur-3xl" />
        <div className="absolute -top-20 right-20 w-80 h-80 bg-amber-400/15 dark:bg-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-72 h-72 bg-orange-300/15 dark:bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-amber-300/10 dark:bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* Top SaaS Navigation */}
      <Header
        onReset={handleReset}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 md:pt-10 space-y-4 sm:space-y-6">
        {/* Compact Hero */}
        <HeroSection />

        {/* 1. TOP SEGMENTED CONTROL: PRODUCT TYPE */}
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-white/90 dark:border-zinc-800 p-1.5 sm:p-2 shadow-xs card-shadow transition-colors duration-200">
          <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
            <button
              type="button"
              id="btn-digital-product"
              onClick={() => handleProductTypeChange('digital')}
              className={`relative flex items-center justify-center gap-1.5 sm:gap-2.5 py-2.5 sm:py-3.5 px-2 sm:px-5 rounded-xl text-xs sm:text-base md:text-lg font-bold transition-all duration-200 cursor-pointer select-none overflow-hidden ${
                isDigital
                  ? 'bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white shadow-md sm:shadow-lg shadow-orange-500/25'
                  : 'bg-transparent text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <Download className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${isDigital ? 'text-white' : ''}`} />
              <span className="truncate">Digital Product</span>
              {isDigital && (
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-[shine_2s_ease_infinite]" />
              )}
            </button>

            <button
              type="button"
              id="btn-physical-product"
              onClick={() => handleProductTypeChange('physical')}
              className={`relative flex items-center justify-center gap-1.5 sm:gap-2.5 py-2.5 sm:py-3.5 px-2 sm:px-5 rounded-xl text-xs sm:text-base md:text-lg font-bold transition-all duration-200 cursor-pointer select-none overflow-hidden ${
                !isDigital
                  ? 'bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white shadow-md sm:shadow-lg shadow-orange-500/25'
                  : 'bg-transparent text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <Package className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${!isDigital ? 'text-white' : ''}`} />
              <span className="truncate">Physical Product</span>
              {!isDigital && (
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-[shine_2s_ease_infinite]" />
              )}
            </button>
          </div>
        </div>

        {/* 2. TWO-COLUMN CALCULATOR & RESULTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Left: Input Form (7 cols) */}
          <div className="lg:col-span-7">
            <CalculatorForm
              input={input}
              salePrice={result.salePrice}
              onInputChange={handleInputChange}
              onCountryChange={handleCountryChange}
            />
          </div>

          {/* Right: Profit Results Dashboard (5 cols) */}
          <div className="lg:col-span-5">
            <ResultsDashboard
              result={result}
              currency={input.currency}
              productType={input.productType}
            />
          </div>
        </div>

        {/* Bottom trust strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-3 pb-2">
          {[
            { icon: '🔒', text: 'No data stored. Fully private.' },
            { icon: '⚡', text: 'Live calculations as you type' },
            { icon: '📊', text: '20+ countries supported' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400 font-semibold">
              <span className="text-base">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* 3. FREE ETSY LISTING CREDITS & PROMO REFERRAL SECTION */}
        <FreeListingsSection />

        {/* 4. ETSY FEES COMPARISON CHART & TABLE (US, UK, Canada, Pakistan, India, etc.) */}
        <CountryFeesChartSection />
      </main>

      {/* How It Works Information Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        countryCode={input.country}
      />

      {/* Production SaaS Footer */}
      <Footer
        onReset={handleReset}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />




      {/* Mobile Sticky Summary Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-dark text-white border-t border-white/10 dark:border-zinc-800 p-2.5 sm:p-3 px-3.5 sm:px-4 pb-[calc(0.65rem+env(safe-area-inset-bottom,0px))] shadow-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-400 uppercase tracking-wider block">
            Net Profit
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-xl font-black font-mono ${
                result.isProfitable
                  ? 'text-emerald-400'
                  : result.isLoss
                  ? 'text-rose-400'
                  : 'text-white'
              }`}
            >
              {formatCurrency(result.netProfit, input.currency)}
            </span>
            <span className={`inline-flex items-center gap-0.5 text-xs font-mono px-2 py-0.5 rounded-full ${
              result.isProfitable
                ? 'bg-emerald-500/20 text-emerald-400'
                : result.isLoss
                ? 'bg-rose-500/20 text-rose-400'
                : 'bg-white/10 text-white'
            }`}>
              <TrendingUp className="h-3 w-3" />
              {formatPercentClean(result.profitMargin)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold shadow-lg shadow-orange-900/30 cursor-pointer transition-all"
        >
          <span>Breakdown</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

