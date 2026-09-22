import React from 'react';
import { Layers, CheckCircle2, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ListingType, CurrencyCode } from '@/types/etsy';
import { CURRENCIES, COUNTRIES } from '@/lib/etsy/constants';

interface ListingTypeSectionProps {
  value: ListingType;
  onChange: (value: ListingType) => void;
  countryCode: string;
  currency: CurrencyCode;
}

export function ListingTypeSection({
  value,
  onChange,
  countryCode,
  currency,
}: ListingTypeSectionProps) {
  const country = COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0];
  const currencyConfig = CURRENCIES[currency] || CURRENCIES.USD;
  const listingFeeDisplay = `${currencyConfig.symbol}${country.listingFeeFixed.toFixed(2)}`;

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-indigo-600" />
              <h4 className="text-sm font-semibold text-slate-900">3. Listing Type</h4>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose whether standard Etsy listing fee applies to this calculation
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 self-start sm:self-auto bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
            <Lock className="h-3 w-3 text-slate-400" />
            <span>Rate: <strong>{value === 'free' ? '$0.00' : `${listingFeeDisplay} / listing`}</strong></span>
          </div>
        </div>

        <SegmentedControl<ListingType>
          value={value}
          onChange={onChange}
          size="md"
          options={[
            {
              value: 'paid',
              label: 'PAID Listing',
              icon: <Lock className="h-3.5 w-3.5 text-slate-500" />,
              badge: `${listingFeeDisplay} Standard Fee`,
            },
            {
              value: 'free',
              label: 'FREE Listing',
              icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />,
              badge: '$0.00 Fee',
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
