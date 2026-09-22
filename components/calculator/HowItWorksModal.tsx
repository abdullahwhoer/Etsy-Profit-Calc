import React from 'react';
import { X, Lock, CheckCircle2, ShieldCheck, DollarSign, ExternalLink, Info } from 'lucide-react';
import { getCountryFeeConfig, ETSY_TRANSACTION_FEE_RATE } from '@/lib/etsy/fees';
import { formatCurrency } from '@/lib/utils';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  countryCode?: string;
}

const colorMap: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
  orange: {
    bg: 'bg-orange-50/80 dark:bg-orange-950/30',
    border: 'border-orange-100 dark:border-orange-900/40',
    icon: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/50',
    badge: 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/50',
  },
  amber: {
    bg: 'bg-amber-50/80 dark:bg-amber-950/30',
    border: 'border-amber-100 dark:border-amber-900/40',
    icon: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50',
    badge: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50',
  },
  slate: {
    bg: 'bg-slate-50 dark:bg-zinc-800/60',
    border: 'border-slate-200/60 dark:border-zinc-700/60',
    icon: 'text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-700',
    badge: 'text-slate-700 dark:text-zinc-200 bg-slate-100 dark:bg-zinc-700',
  },
};

export function HowItWorksModal({ isOpen, onClose, countryCode = 'US' }: HowItWorksModalProps) {
  if (!isOpen) return null;

  const country = getCountryFeeConfig(countryCode);

  const fees = [
    {
      icon: <DollarSign className="h-4 w-4" />,
      title: 'Transaction Fee',
      rate: `${(ETSY_TRANSACTION_FEE_RATE * 100).toFixed(1)}%`,
      color: 'orange',
      description: (
        <>
          Etsy takes <strong>{(ETSY_TRANSACTION_FEE_RATE * 100).toFixed(1)}% of the total customer payment</strong>, which includes the item sale price plus any shipping charges and gift wrapping collected from the buyer.
        </>
      ),
    },
    {
      icon: <CheckCircle2 className="h-4 w-4" />,
      title: 'Payment Processing Fee',
      rate: `${country.paymentProcessingRate}% + ${formatCurrency(country.paymentProcessingFixed, country.defaultCurrency)}`,
      color: 'amber',
      description: (
        <>
          Etsy Payments charges a percentage plus a fixed flat fee per order based on your bank's registered country. For your currently selected country (<strong>{country.flag} {country.name}</strong>), the rate is <strong>{country.paymentProcessingRate}% + {formatCurrency(country.paymentProcessingFixed, country.defaultCurrency)} {country.defaultCurrency}</strong>.
        </>
      ),
    },
    {
      icon: <Lock className="h-4 w-4" />,
      title: 'Listing Fee',
      rate: `${formatCurrency(country.listingFeeFixed, country.defaultCurrency)}`,
      color: 'slate',
      description: (
        <>
          Charged when an item is published and renewed automatically every 4 months or each time a unit is sold. For <strong>{country.flag} {country.name}</strong>, standard listing fee is <strong>{formatCurrency(country.listingFeeFixed, country.defaultCurrency)}</strong>. Free promotional listings incur $0.00.
        </>
      ),
    },
    {
      icon: <ExternalLink className="h-4 w-4" />,
      title: 'Offsite Ads Fee',
      rate: '15% or 12%',
      color: 'amber',
      description: (
        <>
          Etsy advertises items on external search engines and social networks. When an ad leads to a sale, Etsy charges <strong>15%</strong> for shops earning &lt; $10k/year or <strong>12%</strong> for shops earning ≥ $10k/year.
        </>
      ),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl border border-white/80 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 card-shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-it-works-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-zinc-800 bg-gradient-to-r from-orange-50/80 to-amber-50/80 dark:from-orange-950/40 dark:to-amber-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/30">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h2 id="how-it-works-title" className="text-base font-bold text-slate-900 dark:text-white">How Etsy Fees Work</h2>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">Official fee structure overview</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5 max-h-[70vh] overflow-y-auto">
          {fees.map((fee) => {
            const colors = colorMap[fee.color] || colorMap.orange;
            return (
              <div
                key={fee.title}
                className={`p-4 rounded-xl border ${colors.bg} ${colors.border} space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${colors.icon}`}>
                      {fee.icon}
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{fee.title}</span>
                  </div>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                    {fee.rate}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed pl-1">
                  {fee.description}
                </p>
              </div>
            );
          })}

          {/* Disclaimer */}
          <div className="flex gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60">
            <Info className="h-4 w-4 text-slate-400 dark:text-zinc-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
              This calculator provides estimates only. Fee rates may change. Always verify on your Etsy Shop Manager for the exact fees applied to your account.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl transition-all cursor-pointer shadow-md shadow-orange-500/25"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}


