import React from 'react';
import { Lock, Sparkles, Truck, Globe, Tag, ExternalLink } from 'lucide-react';
import {
  CalculatorInput,
  ListingType,
  OffsiteAdsTier,
  CurrencyCode,
} from '@/types/etsy';
import {
  CURRENCIES,
  COUNTRY_FEES,
  ETSY_OFFSITE_ADS_RATES,
  ETSY_TRANSACTION_FEE_RATE,
} from '@/lib/etsy/fees';
import { formatCurrency } from '@/lib/utils';


interface CalculatorFormProps {
  input: CalculatorInput;
  salePrice: number;
  onInputChange: <K extends keyof CalculatorInput>(key: K, value: CalculatorInput[K]) => void;
  onCountryChange: (countryCode: string, defaultCurrency: CurrencyCode) => void;
}

/** Shared label style */
const labelCls = 'text-xs font-semibold text-slate-600 dark:text-zinc-300 block mb-1.5';

/** Shared input style */
const inputCls =
  'h-11 w-full rounded-xl border border-slate-200 dark:border-zinc-700/80 bg-white/80 dark:bg-zinc-800/80 px-3 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none input-field transition-smooth placeholder:text-slate-300 dark:placeholder:text-zinc-500';

/** Shared section divider */
function SectionDivider({
  title,
  subtitle,
  icon,
  badge,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between pt-1">
      <div className="flex items-center gap-2">
        {icon && (
          <div className="h-6 w-6 rounded-lg bg-orange-50 dark:bg-orange-950/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-zinc-200">{title}</h3>
          {subtitle && (
            <p className="text-[10px] text-slate-400 dark:text-zinc-400 font-medium mt-0.5 leading-none">{subtitle}</p>
          )}
        </div>
      </div>
      {badge}
    </div>
  );
}

export function CalculatorForm({
  input,
  salePrice,
  onInputChange,
  onCountryChange,
}: CalculatorFormProps) {
  const currencyConfig = CURRENCIES[input.currency] || CURRENCIES.USD;
  const currencySymbol = currencyConfig.symbol;

  const country =
    COUNTRY_FEES.find((c) => c.code === input.country) || COUNTRY_FEES[0];

  const offsiteRate =
    input.offsiteAdsTier === 'high_volume'
      ? ETSY_OFFSITE_ADS_RATES.high_volume
      : ETSY_OFFSITE_ADS_RATES.standard;

  const isPhysical = input.productType === 'physical';

  const handleCountrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const found = COUNTRY_FEES.find((c) => c.code === code);
    if (found) {
      onCountryChange(found.code, found.defaultCurrency);
    }
  };

  return (
    <div className="bg-white/85 dark:bg-zinc-900/85 backdrop-blur-sm rounded-2xl border border-white/90 dark:border-zinc-800/80 p-5 sm:p-7 card-shadow space-y-7 transition-colors duration-200">
      
      {/* ═══════════════════════════════════════
          1. PRICING SECTION
      ═══════════════════════════════════════ */}
      <div className="space-y-4">
        <SectionDivider
          title="Pricing"
          subtitle="Item price & promotional discounts"
          icon={<Tag className="h-3.5 w-3.5" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Regular Price */}
          <div>
            <label htmlFor="regular-price-input" className={labelCls}>
              Regular Price
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 dark:text-zinc-400 text-sm font-bold pointer-events-none select-none">
                {currencySymbol}
              </span>
              <input
                id="regular-price-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={input.regularPrice === 0 ? '' : input.regularPrice}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  onInputChange('regularPrice', isNaN(v) || v < 0 ? 0 : v);
                }}
                className={`${inputCls} pl-8 pr-3`}
              />
            </div>
          </div>

          {/* Sale Discount */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="discount-input" className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
                Sale Discount
              </label>
              <span className="text-[10px] text-slate-400 dark:text-zinc-400 font-mono bg-slate-50 dark:bg-zinc-800 px-1.5 py-0.5 rounded">0–100%</span>
            </div>
            <div className="relative flex items-center">
              <input
                id="discount-input"
                type="number"
                min="0"
                max="100"
                step="1"
                placeholder="0"
                value={input.discount === 0 ? '' : input.discount}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  onInputChange('discount', isNaN(v) ? 0 : Math.min(100, Math.max(0, v)));
                }}
                className={`${inputCls} px-3 pr-8`}
              />
              <span className="absolute right-3 text-slate-400 dark:text-zinc-400 text-sm font-semibold pointer-events-none select-none">
                %
              </span>
            </div>
          </div>

          {/* Calculated Sale Price (Read-only) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300">Sale Price</label>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                <Sparkles className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" />
                Auto
              </span>
            </div>
            <div className="h-11 w-full rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/40 dark:to-teal-950/40 px-3 flex items-center text-sm font-black text-emerald-800 dark:text-emerald-300 select-all font-mono">
              {formatCurrency(salePrice, input.currency)}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          2. ETSY SETTINGS
      ═══════════════════════════════════════ */}
      <div className="space-y-4 pt-1 border-t border-slate-100/80 dark:border-zinc-800/80">
        <SectionDivider
          title="Etsy Settings"
          subtitle="Shop location & marketplace rules"
          icon={<Globe className="h-3.5 w-3.5" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Country Selector */}
          <div>
            <label htmlFor="country-select" className={labelCls}>
              Shop Country
            </label>
            <select
              id="country-select"
              value={input.country}
              onChange={handleCountrySelect}
              className="h-11 w-full rounded-xl border border-slate-200 dark:border-zinc-700/80 bg-white/80 dark:bg-zinc-800/80 px-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-100 focus:outline-none input-field cursor-pointer transition-smooth"
            >
              {COUNTRY_FEES.map((c) => (
                <option key={c.code} value={c.code} className="dark:bg-zinc-900 dark:text-white">
                  {c.flag} {c.name} ({c.paymentProcessingRate}% + {c.paymentProcessingFixed.toFixed(2)} {c.defaultCurrency})
                </option>
              ))}
            </select>
          </div>

          {/* Listing Type Toggle */}
          <div>
            <label className={labelCls}>Listing Type</label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100/80 dark:bg-zinc-800/80 rounded-xl border border-slate-200/60 dark:border-zinc-700/60 h-11 items-center">
              <button
                type="button"
                id="listing-type-paid"
                onClick={() => onInputChange('listingType', 'paid')}
                className={`h-9 flex items-center justify-center text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  input.listingType === 'paid'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-zinc-600'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                PAID ({currencySymbol}{country.listingFeeFixed.toFixed(2)})
              </button>
              <button
                type="button"
                id="listing-type-free"
                onClick={() => onInputChange('listingType', 'free')}
                className={`h-9 flex items-center justify-center text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  input.listingType === 'free'
                    ? 'bg-white dark:bg-zinc-700 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-200/60 dark:border-emerald-700/60'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                FREE ($0.00)
              </button>
            </div>
          </div>
        </div>

        {/* Offsite Ads Toggle */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50/80 to-orange-50/60 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-100 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Etsy Offsite Ads</span>
              {input.offsiteAdsEnabled && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 font-bold">
                  <Lock className="h-2.5 w-2.5" /> {(offsiteRate * 100).toFixed(0)}% Read-Only
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 pl-5.5">
              Etsy&apos;s locked fee on sales from external search or social ads
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-shrink-0">
            <div className="inline-flex p-0.5 bg-white/70 dark:bg-zinc-800/80 rounded-xl border border-slate-200/60 dark:border-zinc-700/60 shadow-sm">
              <button
                type="button"
                onClick={() => onInputChange('offsiteAdsEnabled', false)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer ${
                  !input.offsiteAdsEnabled
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-zinc-400'
                }`}
              >
                OFF
              </button>
              <button
                type="button"
                onClick={() => onInputChange('offsiteAdsEnabled', true)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer ${
                  input.offsiteAdsEnabled
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                    : 'text-slate-500 dark:text-zinc-400'
                }`}
              >
                ON
              </button>
            </div>

            {input.offsiteAdsEnabled && (
              <select
                value={input.offsiteAdsTier || 'standard'}
                onChange={(e) =>
                  onInputChange('offsiteAdsTier', e.target.value as OffsiteAdsTier)
                }
                className="h-8 rounded-lg border border-amber-200 dark:border-amber-800 bg-white dark:bg-zinc-800 px-2 text-[11px] font-bold text-amber-800 dark:text-amber-300 cursor-pointer focus:outline-none shadow-sm"
              >
                <option value="standard" className="dark:bg-zinc-900">&lt; $10k/yr (15%)</option>
                <option value="high_volume" className="dark:bg-zinc-900">&ge; $10k/yr (12%)</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          3. PHYSICAL COSTS & SHIPPING
      ═══════════════════════════════════════ */}
      {isPhysical && (
        <div className="space-y-4 pt-1 border-t border-slate-100/80 dark:border-zinc-800/80 animate-in fade-in duration-200">
          <SectionDivider
            title="Physical Costs & Shipping"
            subtitle="Manufacturing, packaging, and postage expenses"
            icon={<Truck className="h-3.5 w-3.5" />}
            badge={
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200/60 dark:border-amber-800/60">
                Physical Only
              </span>
            }
          />

          {/* Product & Packaging Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="product-cost-input" className={labelCls}>
                Product / Manufacturing Cost
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 dark:text-zinc-400 text-sm font-bold pointer-events-none select-none">
                  {currencySymbol}
                </span>
                <input
                  id="product-cost-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={input.productCost === 0 ? '' : input.productCost}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    onInputChange('productCost', isNaN(v) || v < 0 ? 0 : v);
                  }}
                  className={`${inputCls} pl-8 pr-3`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="packaging-cost-input" className={labelCls}>
                Packaging Cost
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 dark:text-zinc-400 text-sm font-bold pointer-events-none select-none">
                  {currencySymbol}
                </span>
                <input
                  id="packaging-cost-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={input.packagingCost === 0 ? '' : input.packagingCost}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    onInputChange('packagingCost', isNaN(v) || v < 0 ? 0 : v);
                  }}
                  className={`${inputCls} pl-8 pr-3`}
                />
              </div>
            </div>
          </div>

          {/* Shipping Charged vs Actual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 space-y-2">
              <div>
                <label htmlFor="shipping-charged-input" className="text-xs font-bold text-slate-800 dark:text-zinc-200 block">
                  Shipping Charged to Customer
                </label>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  Revenue from buyer (6.5% fee applies)
                </p>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 dark:text-zinc-400 text-sm font-bold pointer-events-none select-none">
                  {currencySymbol}
                </span>
                <input
                  id="shipping-charged-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={input.shippingCharged === 0 ? '' : input.shippingCharged}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    onInputChange('shippingCharged', isNaN(v) || v < 0 ? 0 : v);
                  }}
                  className={`${inputCls} pl-8 pr-3`}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 space-y-2">
              <div>
                <label htmlFor="actual-shipping-input" className="text-xs font-bold text-slate-800 dark:text-zinc-200 block">
                  Actual Shipping Cost
                </label>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  Postage label expense paid out of pocket
                </p>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 dark:text-zinc-400 text-sm font-bold pointer-events-none select-none">
                  {currencySymbol}
                </span>
                <input
                  id="actual-shipping-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={input.actualShippingCost === 0 ? '' : input.actualShippingCost}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    onInputChange('actualShippingCost', isNaN(v) || v < 0 ? 0 : v);
                  }}
                  className={`${inputCls} pl-8 pr-3`}
                />
              </div>
            </div>
          </div>

          {/* Etsy Ads for Physical Products */}
          <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Etsy Ads (On-Site)</span>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Estimated ad spend per unit sold
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex p-0.5 bg-white/70 dark:bg-zinc-800/80 rounded-xl border border-slate-200/60 dark:border-zinc-700/60 shadow-sm">
                <button
                  type="button"
                  onClick={() => onInputChange('etsyAdsEnabled', false)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer ${
                    !input.etsyAdsEnabled
                      ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-zinc-400'
                  }`}
                >
                  OFF
                </button>
                <button
                  type="button"
                  onClick={() => onInputChange('etsyAdsEnabled', true)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer ${
                    input.etsyAdsEnabled
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                      : 'text-slate-500 dark:text-zinc-400'
                  }`}
                >
                  ON
                </button>
              </div>

              {input.etsyAdsEnabled && (
                <div className="relative flex items-center w-28 animate-in fade-in duration-150">
                  <span className="absolute left-2.5 text-slate-400 dark:text-zinc-400 text-xs font-bold pointer-events-none select-none">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={input.etsyAdsCost === 0 ? '' : input.etsyAdsCost}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      onInputChange('etsyAdsCost', isNaN(v) || v < 0 ? 0 : v);
                    }}
                    className="h-9 w-full rounded-xl border border-orange-200 dark:border-orange-800 bg-white dark:bg-zinc-800 pl-7 pr-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none input-field"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          4. COMPACT ETSY FEE SUMMARY STRIP
      ═══════════════════════════════════════ */}
      <div className="pt-1 border-t border-slate-100/80 dark:border-zinc-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-zinc-300 flex items-center gap-1.5">
            <span>{country.flag}</span>
            <span>{country.name} Etsy Marketplace Fees</span>
          </span>
          <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800/80 px-2 py-1 rounded-lg border border-slate-100 dark:border-zinc-700/80">
            <Lock className="h-2.5 w-2.5" /> System Rates
          </span>
        </div>

        <div className={`grid grid-cols-1 sm:${country.regulatoryFeeRate ? 'grid-cols-4' : 'grid-cols-3'} gap-2.5`}>
          {/* 1. Transaction Fee */}
          <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 text-center">
            <span className="text-[10px] text-slate-400 dark:text-zinc-400 font-semibold block mb-0.5">
              Transaction Fee
            </span>
            <span className="font-mono font-black text-xs text-slate-800 dark:text-zinc-200">
              {(ETSY_TRANSACTION_FEE_RATE * 100).toFixed(1)}% 🔒
            </span>
          </div>

          {/* 2. Payment Processing Fee */}
          <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 text-center">
            <span className="text-[10px] text-slate-400 dark:text-zinc-400 font-semibold block mb-0.5">
              Processing ({country.code})
            </span>
            <span className="font-mono font-black text-xs text-slate-800 dark:text-zinc-200">
              {country.paymentProcessingRate}% + {currencySymbol}{country.paymentProcessingFixed.toFixed(2)} {country.defaultCurrency} 🔒
            </span>
          </div>

          {/* 3. Listing Fee */}
          <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 text-center">
            <span className="text-[10px] text-slate-400 dark:text-zinc-400 font-semibold block mb-0.5">
              Listing Fee
            </span>
            <span className="font-mono font-black text-xs text-slate-800 dark:text-zinc-200">
              {input.listingType === 'free'
                ? 'FREE ($0.00)'
                : `${currencySymbol}${country.listingFeeFixed.toFixed(2)} ${country.defaultCurrency}`}{' '}
              🔒
            </span>
          </div>

          {/* 4. Regulatory Operating Fee (if applicable) */}
          {country.regulatoryFeeRate && (
            <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 text-center">
              <span className="text-[10px] text-slate-400 dark:text-zinc-400 font-semibold block mb-0.5">
                Regulatory Fee
              </span>
              <span className="font-mono font-black text-xs text-slate-800 dark:text-zinc-200">
                {country.regulatoryFeeRate}% 🔒
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


