'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  Lock,
  Minus,
} from 'lucide-react';
import { CalculatorResult, CurrencyCode, ProductType } from '@/types/etsy';
import { formatCurrency, formatPercentClean } from '@/lib/utils';

interface ResultsDashboardProps {
  result: CalculatorResult;
  currency: CurrencyCode;
  productType: ProductType;
}

export function ResultsDashboard({
  result,
  currency,
  productType,
}: ResultsDashboardProps) {
  const [showFeeBreakdown, setShowFeeBreakdown] = useState(true);
  const [copied, setCopied] = useState(false);


  const isProfitable = result.isProfitable;
  const isLoss = result.isLoss;
  const isPhysical = productType === 'physical';

  const handleCopySummary = () => {
    const lines = [
      `Etsy Profit Estimate:`,
      `- Item Sale Price: ${formatCurrency(result.salePrice, currency)}`,
    ];

    if (isPhysical && result.customerShipping > 0) {
      lines.push(`- Customer Shipping: ${formatCurrency(result.customerShipping, currency)}`);
    }

    lines.push(
      `- Total Revenue: ${formatCurrency(result.totalCustomerPayment, currency)}`,
      `- Total Etsy Fees: ${formatCurrency(result.totalEtsyFees, currency)} (${formatPercentClean(result.effectiveFeeRate)})`
    );

    if (isPhysical && result.totalSellerCosts > 0) {
      lines.push(`- Total Seller Costs: ${formatCurrency(result.totalSellerCosts, currency)}`);
    }

    lines.push(
      `- NET PROFIT: ${formatCurrency(result.netProfit, currency)}`,
      `- Profit Margin: ${formatPercentClean(result.profitMargin)}`
    );

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Profit margin color
  const marginColor =
    result.profitMargin > 30
      ? 'text-emerald-300'
      : result.profitMargin > 10
      ? 'text-amber-300'
      : 'text-rose-300';

  const marginBg =
    result.profitMargin > 30
      ? 'bg-emerald-500/15 border-emerald-500/30'
      : result.profitMargin > 10
      ? 'bg-amber-500/15 border-amber-500/30'
      : 'bg-rose-500/15 border-rose-500/30';

  // Distribution bar
  const { profitShare, feeShare, costShare } = result.distribution;

  return (
    <div className="rounded-2xl overflow-hidden card-shadow-lg lg:sticky lg:top-20 transition-colors duration-200">
      
      {/* ══════════════════════════════════
          HERO NET PROFIT PANEL
      ══════════════════════════════════ */}
      <div
        className={`relative p-6 sm:p-7 overflow-hidden transition-colors duration-300 ${
          isLoss
            ? 'bg-gradient-to-br from-rose-950 via-rose-900 to-zinc-950 text-white'
            : 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white'
        }`}
      >
        {/* Decorative glow orb */}
        <div
          className={`absolute -top-8 -right-8 w-40 h-40 rounded-full blur-3xl opacity-30 ${
            isProfitable ? 'bg-emerald-500' : isLoss ? 'bg-rose-500' : 'bg-orange-500'
          }`}
        />
        <div className="absolute inset-0 noise-bg" />

        <div className="relative">
          {/* Label + Copy button */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                Net Profit
              </span>
              <span className="font-cursive text-amber-300 font-bold text-base tracking-wide -rotate-1">
                Live ✨
              </span>
              {isProfitable && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3" />
                  Profitable
                </span>
              )}
              {isLoss && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2.5 py-1 rounded-full">
                  <TrendingDown className="h-3 w-3" />
                  Loss
                </span>
              )}
            </div>

            <button
              type="button"
              id="copy-summary-btn"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-150 cursor-pointer border border-white/15"
              title="Copy estimate summary"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Large Net Profit Amount */}
          <div className="mt-5 mb-4">
            <span
              className={`text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight font-mono leading-none ${
                isProfitable
                  ? 'text-emerald-400 profit-glow'
                  : isLoss
                  ? 'text-rose-400 loss-glow'
                  : 'text-white'
              }`}
            >
              {formatCurrency(result.netProfit, currency)}
            </span>
          </div>

          {/* Profit Margin Badge + Fee Rate */}
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-bold px-3.5 py-1.5 rounded-full border font-mono ${marginBg} ${marginColor}`}
            >
              {isProfitable ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : isLoss ? (
                <TrendingDown className="h-3.5 w-3.5" />
              ) : (
                <Minus className="h-3.5 w-3.5" />
              )}
              {formatPercentClean(result.profitMargin)} margin
            </span>
            <span className="text-sm text-zinc-300 font-mono">
              {formatPercentClean(result.effectiveFeeRate)} in fees
            </span>
          </div>

          {/* Distribution Bar */}
          {result.totalCustomerPayment > 0 && (
            <div className="mt-5 space-y-2">
              <div className="h-2.5 rounded-full overflow-hidden bg-white/10 flex">
                {profitShare > 0 && (
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${profitShare}%` }}
                  />
                )}
                {feeShare > 0 && (
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                    style={{ width: `${feeShare}%` }}
                  />
                )}
                {costShare > 0 && (
                  <div
                    className="bg-gradient-to-r from-zinc-500 to-zinc-400 transition-all duration-500"
                    style={{ width: `${costShare}%` }}
                  />
                )}
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-zinc-300">
                <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Profit</span>
                <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-500"></span> Etsy Fees</span>
                {isPhysical && <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full bg-zinc-500"></span> Your Costs</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════
          SUMMARY PANEL (Clean, Larger Fonts & Generous Spacing)
      ══════════════════════════════════ */}
      <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-6 sm:p-8 space-y-6 border-t border-slate-100 dark:border-zinc-800 transition-colors duration-200">

        {/* Quick Summary */}
        <div className="space-y-1.5">
          {/* Revenue */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-zinc-800">
            <span className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 font-medium">Revenue</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-base sm:text-lg">
              {formatCurrency(result.totalCustomerPayment, currency)}
            </span>
          </div>

          {/* Etsy Fees */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-zinc-800">
            <span className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 font-medium">Etsy Fees</span>
            <span className="font-mono font-bold text-orange-600 dark:text-orange-400 text-base sm:text-lg">
              -{formatCurrency(result.totalEtsyFees, currency)}
            </span>
          </div>

          {/* Your Costs (Only if physical) */}
          {isPhysical && (
            <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-zinc-800">
              <span className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 font-medium">Your Costs</span>
              <span className="font-mono font-bold text-slate-700 dark:text-zinc-300 text-base sm:text-lg">
                -{formatCurrency(result.totalSellerCosts, currency)}
              </span>
            </div>
          )}

          {/* Net Profit Summary */}
          <div className={`flex items-center justify-between py-3.5 px-4 rounded-xl mt-3 ${
            isProfitable
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80'
              : isLoss
              ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/80'
              : 'bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700'
          }`}>
            <span className="text-base font-bold text-slate-900 dark:text-white">Net Profit</span>
            <span
              className={`font-mono text-xl sm:text-2xl font-black ${
                isProfitable
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : isLoss
                  ? 'text-rose-700 dark:text-rose-400'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {formatCurrency(result.netProfit, currency)}
            </span>
          </div>
        </div>

        {/* 3. PHYSICAL DETAILED BREAKDOWN */}
        {isPhysical && result.itemizedCosts.length > 0 && (
          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Itemized Costs</p>
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/70 dark:border-zinc-700/70">
              {result.itemizedCosts.map((cost) => (
                <div key={cost.id} className="flex items-center justify-between text-sm text-slate-600 dark:text-zinc-300">
                  <span>{cost.name}</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-zinc-100">
                    -{formatCurrency(cost.amount, currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. EXPANDABLE ETSY FEE BREAKDOWN */}
        <div className="border-t border-slate-100 dark:border-zinc-800 pt-3">
          <button
            type="button"
            id="toggle-fee-breakdown-btn"
            onClick={() => setShowFeeBreakdown(!showFeeBreakdown)}
            className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-700 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer select-none group"
          >
            <span className="flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-500 group-hover:text-orange-500 transition-colors" />
              Etsy Fee Breakdown
            </span>
            <div className="flex items-center gap-1.5 text-xs font-mono text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-800 font-bold">
              -{formatCurrency(result.totalEtsyFees, currency)}
              {showFeeBreakdown ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </div>
          </button>

          {showFeeBreakdown && (
            <div className="mt-3 space-y-2.5 p-4 rounded-xl bg-gradient-to-b from-slate-50 to-slate-50/50 dark:from-zinc-800/80 dark:to-zinc-800/40 border border-slate-200 dark:border-zinc-700 animate-in fade-in slide-in-from-top-1 duration-150">
              {result.itemizedFees.map((fee) => (
                <div key={fee.id} className="flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-800 dark:text-zinc-200 font-semibold">{fee.name}</span>
                    <span className="text-slate-400 dark:text-zinc-500 ml-2 font-mono">({fee.rateDescription})</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    -{formatCurrency(fee.amount, currency)}
                  </span>
                </div>
              ))}
              
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-200 dark:border-zinc-700 font-bold text-sm sm:text-base">
                <span className="text-slate-900 dark:text-white">Total Etsy Fees</span>
                <span className="font-mono text-orange-600 dark:text-orange-400 font-black">
                  -{formatCurrency(result.totalEtsyFees, currency)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

