import React from 'react';
import { Lock, Percent, CreditCard, Layers } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { InfoHint } from '@/components/ui/Tooltip';
import { COUNTRIES, CURRENCIES } from '@/lib/etsy/constants';
import { CurrencyCode, ListingType } from '@/types/etsy';

interface EtsyFeesConfigSectionProps {
  countryCode: string;
  currency: CurrencyCode;
  listingType: ListingType;
}

export function EtsyFeesConfigSection({
  countryCode,
  currency,
  listingType,
}: EtsyFeesConfigSectionProps) {
  const country = COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0];
  const currencyConfig = CURRENCIES[currency] || CURRENCIES.USD;
  const currencySymbol = currencyConfig.symbol;

  return (
    <Card className="border-slate-200/90 bg-slate-50/50 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            <Lock className="h-4 w-4 text-slate-600" />
            7. Etsy Standard Fee Rates
          </CardTitle>
          <Badge variant="locked" className="flex items-center gap-1">
            <Lock className="h-2.5 w-2.5" />
            READ-ONLY / LOCKED
          </Badge>
        </div>
        <CardDescription>
          Standard marketplace fee rates enforced by Etsy. These rates are non-editable and pulled directly from central configuration.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Transaction Fee 6.5% */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 flex flex-col justify-between space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <Percent className="h-3.5 w-3.5 text-indigo-600" />
                Transaction Fee
              </span>
              <InfoHint content="Etsy charges a 6.5% fee on the total sale price including item price, shipping charged to customer, and gift wrapping." />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold tracking-tight text-slate-900 font-mono">
                6.5%
              </span>
              <span className="text-[11px] font-medium text-slate-400">🔒 Fixed Rate</span>
            </div>
            <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-1.5">
              Applied to (Item + Shipping)
            </p>
          </div>

          {/* Payment Processing Fee */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 flex flex-col justify-between space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <CreditCard className="h-3.5 w-3.5 text-indigo-600" />
                Payment Processing
              </span>
              <InfoHint content={`Etsy Payments fee for ${country.name}. Rate is ${country.paymentProcessingRate}% plus ${country.defaultCurrency} ${country.paymentProcessingFixed.toFixed(2)} fixed transaction charge.`} />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold tracking-tight text-slate-900 font-mono">
                {country.paymentProcessingRate}% + {currencySymbol}{country.paymentProcessingFixed.toFixed(2)}
              </span>
              <span className="text-[11px] font-medium text-slate-400">🔒 Country Rate</span>
            </div>
            <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-1.5">
              {country.flag} {country.name} Rates
            </p>
          </div>

          {/* Listing Fee */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 flex flex-col justify-between space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <Layers className="h-3.5 w-3.5 text-indigo-600" />
                Listing Fee
              </span>
              <InfoHint content="Etsy charges $0.20 USD (or local currency equivalent) per item listing renewal or initial publication. If FREE listing is selected, this becomes $0.00." />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold tracking-tight text-slate-900 font-mono">
                {listingType === 'free'
                  ? `${currencySymbol}0.00`
                  : `${currencySymbol}${country.listingFeeFixed.toFixed(2)}`}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                {listingType === 'free' ? '✨ Free Promo' : '🔒 per listing'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-1.5">
              {listingType === 'free' ? 'Excluded from total' : 'Charged every 4 months/sale'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
