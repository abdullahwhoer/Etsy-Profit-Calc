'use client';

import React, { useState } from 'react';
import { COUNTRY_FEES, ETSY_TRANSACTION_FEE_RATE } from '@/lib/etsy/fees';
import { Globe, Search, Lock, Info, ShieldCheck, Zap, Sparkles } from 'lucide-react';

// Focus countries highlighted specifically
const FEATURED_COUNTRY_CODES = ['US', 'GB', 'CA', 'PK', 'IN'];

export function CountryFeesChartSection() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter countries based on search input
  const filteredCountries = COUNTRY_FEES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      c.defaultCurrency.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const featuredCountries = COUNTRY_FEES.filter((c) =>
    FEATURED_COUNTRY_CODES.includes(c.code)
  );

  return (
    <section className="mt-14 sm:mt-20 space-y-10">
      
      {/* ══════════════════════════════════════════════════
          ORANGE ANIMATED SECTION DIVIDER
      ══════════════════════════════════════════════════ */}
      <div className="relative flex items-center justify-center py-4">
        <div className="animated-section-divider" />
        <div className="absolute px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 border-2 border-orange-400 dark:border-orange-500 text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
          <span className="font-cursive text-base sm:text-lg font-bold">Official Rate Directory</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          1. SECTION HEADER (Prominent & Legible)
      ══════════════════════════════════════════════════ */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/70 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-xs sm:text-sm font-bold shadow-xs">
          <Globe className="h-4 w-4 text-orange-500" />
          <span>Global Seller Rate Card</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Official Etsy Fees{' '}
          <span className="font-cursive text-4xl sm:text-5xl lg:text-6xl text-orange-600 dark:text-orange-400 font-bold inline-block px-1">
            Comparison Chart
          </span>
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed max-w-2xl mx-auto">
          Complete written breakdown of payment processing schedules, marketplace transaction rates, listing renewal fees, and regulatory operating fees across major seller countries.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════
          2. TOP FEATURED COUNTRIES (US, UK, Canada, Pakistan, India)
          With Animated Orange Glowing Borders
      ══════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-cursive text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
            <span>✨</span>
            <span>Featured Countries Overview</span>
          </h3>
          <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-zinc-400">
            Updated for 2026 Etsy Seller Policies
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {featuredCountries.map((country) => (
            <div
              key={country.code}
              className="animated-card-border group hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="h-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-5 rounded-[1.2rem] shadow-md flex flex-col justify-between space-y-4">
                {/* Country Flag & Title */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl select-none" role="img" aria-label={country.name}>
                      {country.flag}
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                        {country.name}
                      </h4>
                      <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
                        {country.defaultCurrency} Currency
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fee Breakdown List (Bigger & Clearer Fonts) */}
                <div className="space-y-2.5 text-sm">
                  {/* Processing Fee */}
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-300">
                      Processing:
                    </span>
                    <span className="font-mono font-black text-slate-900 dark:text-white text-right">
                      {country.paymentProcessingRate}% + {country.paymentProcessingFixed.toFixed(2)}
                    </span>
                  </div>

                  {/* Listing Fee */}
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-300">
                      Listing Fee:
                    </span>
                    <span className="font-mono font-bold text-slate-800 dark:text-zinc-200 text-right">
                      {country.listingFeeFixed.toFixed(2)} {country.defaultCurrency}
                    </span>
                  </div>

                  {/* Transaction Fee */}
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-300">
                      Transaction:
                    </span>
                    <span className="font-mono font-bold text-orange-600 dark:text-orange-400 text-right">
                      {(ETSY_TRANSACTION_FEE_RATE * 100).toFixed(1)}%
                    </span>
                  </div>

                  {/* Regulatory Fee */}
                  <div className="flex items-baseline justify-between gap-1 pt-1.5 border-t border-slate-100 dark:border-zinc-800/80">
                    <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                      Regulatory Fee:
                    </span>
                    {country.regulatoryFeeRate ? (
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded text-xs">
                        +{country.regulatoryFeeRate}%
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-slate-400 dark:text-zinc-500">
                        None (0%)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          3. FULL SEARCHABLE COUNTRY COMPARISON TABLE
          Clean, Professional, Avoids Blue Color, Large Typography
      ══════════════════════════════════════════════════ */}
      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-orange-200/60 dark:border-zinc-800 p-5 sm:p-8 card-shadow space-y-6">
        
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-cursive text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400 leading-tight">
              All 20+ Supported Countries Directory
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
              Official marketplace fee schedules and fixed processing rates per bank location
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search country or currency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-sm text-slate-800 dark:text-zinc-100 focus:outline-none input-field placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-medium"
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100/90 dark:bg-zinc-800/90 text-slate-800 dark:text-zinc-200 border-b border-slate-200 dark:border-zinc-700 font-bold uppercase tracking-wider text-xs sm:text-sm">
                <th className="py-3.5 px-4 sm:px-5">Country</th>
                <th className="py-3.5 px-4 sm:px-5">Currency</th>
                <th className="py-3.5 px-4 sm:px-5">Payment Processing Fee</th>
                <th className="py-3.5 px-4 sm:px-5">Listing Fee</th>
                <th className="py-3.5 px-4 sm:px-5">Transaction Fee</th>
                <th className="py-3.5 px-4 sm:px-5">Regulatory Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => {
                  const isFeatured = FEATURED_COUNTRY_CODES.includes(country.code);
                  return (
                    <tr
                      key={country.code}
                      className={`hover:bg-orange-50/50 dark:hover:bg-zinc-800/50 transition-colors ${
                        isFeatured ? 'bg-orange-50/20 dark:bg-orange-950/10' : ''
                      }`}
                    >
                      {/* Country Flag & Name */}
                      <td className="py-3.5 px-4 sm:px-5 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                        <span className="text-xl select-none">{country.flag}</span>
                        <span>{country.name}</span>
                        {isFeatured && (
                          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/60 px-2 py-0.5 rounded-full font-mono">
                            Top
                          </span>
                        )}
                      </td>

                      {/* Currency */}
                      <td className="py-3.5 px-4 sm:px-5 font-mono font-bold text-slate-700 dark:text-zinc-300">
                        {country.defaultCurrency}
                      </td>

                      {/* Payment Processing Fee */}
                      <td className="py-3.5 px-4 sm:px-5 font-mono font-bold text-slate-900 dark:text-white">
                        {country.paymentProcessingRate}% + {country.paymentProcessingFixed.toFixed(2)} {country.defaultCurrency}
                      </td>

                      {/* Listing Fee */}
                      <td className="py-3.5 px-4 sm:px-5 font-mono font-semibold text-slate-700 dark:text-zinc-300">
                        {country.listingFeeFixed.toFixed(2)} {country.defaultCurrency}
                      </td>

                      {/* Transaction Fee */}
                      <td className="py-3.5 px-4 sm:px-5 font-mono font-bold text-orange-600 dark:text-orange-400">
                        {(ETSY_TRANSACTION_FEE_RATE * 100).toFixed(1)}%
                      </td>

                      {/* Regulatory Fee */}
                      <td className="py-3.5 px-4 sm:px-5">
                        {country.regulatoryFeeRate ? (
                          <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 px-2.5 py-0.5 rounded-full text-xs">
                            {country.regulatoryFeeRate}%
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-zinc-500 font-mono text-xs">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500 dark:text-zinc-400 text-sm">
                    No country matches &quot;{searchQuery}&quot;. Try searching for US, UK, Canada, Pakistan, or India.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ══════════════════════════════════════════════════
            4. KEY ETSY RULES EXPLANATION BANNER
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/70 dark:border-zinc-700/70 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Marketplace Transaction Fee (6.5%)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
              Standard 6.5% rate charged on the final item price plus shipping charged to the buyer across all countries.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/70 dark:border-zinc-700/70 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Standard Listing Fee ($0.20 USD)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
              Flat $0.20 USD (or local equivalent) fee charged whenever a product is published or auto-renewed every 4 months.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/70 dark:border-zinc-700/70 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <Info className="h-4 w-4 text-orange-500" />
              <span>Etsy Offsite Ads (15% / 12%)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
              Only charged when external Google or social ads lead directly to a sale within 30 days.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
