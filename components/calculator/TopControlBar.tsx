import React from 'react';
import { ProductType, CurrencyCode } from '@/types/etsy';
import { COUNTRY_FEES, CURRENCIES } from '@/lib/etsy/fees';

interface TopControlBarProps {
  productType: ProductType;
  onProductTypeChange: (type: ProductType) => void;
  countryCode: string;
  onCountryChange: (countryCode: string, defaultCurrency: CurrencyCode) => void;
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
}

export function TopControlBar({
  productType,
  onProductTypeChange,
  countryCode,
  onCountryChange,
  currency,
  onCurrencyChange,
}: TopControlBarProps) {
  const handleCountrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const found = COUNTRY_FEES.find((c) => c.code === code);
    if (found) {
      onCountryChange(found.code, found.defaultCurrency);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Product Type Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 shrink-0">
          Product Type
        </label>
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => onProductTypeChange('digital')}
            className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer select-none ${
              productType === 'digital'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Digital Product
          </button>
          <button
            type="button"
            onClick={() => onProductTypeChange('physical')}
            className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer select-none ${
              productType === 'physical'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Physical Product
          </button>
        </div>
      </div>

      {/* Country & Currency Pickers */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
        {/* Country Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="top-country-select" className="text-xs font-semibold uppercase tracking-wider text-slate-500 shrink-0">
            Country
          </label>
          <select
            id="top-country-select"
            value={countryCode}
            onChange={handleCountrySelect}
            className="flex-1 sm:w-56 h-9 rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 py-1 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
          >
            {COUNTRY_FEES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name} ({country.paymentProcessingRate}% + {country.paymentProcessingFixed.toFixed(2)} {country.defaultCurrency})
              </option>
            ))}
          </select>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="top-currency-select" className="text-xs font-semibold uppercase tracking-wider text-slate-500 shrink-0">
            Currency
          </label>
          <select
            id="top-currency-select"
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
            className="h-9 rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 py-1 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
          >
            {Object.values(CURRENCIES).map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
