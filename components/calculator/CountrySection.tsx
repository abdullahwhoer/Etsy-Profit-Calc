import React from 'react';
import { Globe, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { COUNTRIES } from '@/lib/etsy/constants';
import { CountryFeeConfig, CurrencyCode } from '@/types/etsy';

interface CountrySectionProps {
  countryCode: string;
  onCountryChange: (countryCode: string, defaultCurrency: CurrencyCode) => void;
}

export function CountrySection({ countryCode, onCountryChange }: CountrySectionProps) {
  const selectedCountry =
    COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0];

  const countryOptions = COUNTRIES.map((country: CountryFeeConfig) => ({
    value: country.code,
    label: `${country.flag} ${country.name}`,
    sublabel: `${country.paymentProcessingRate}% + ${country.defaultCurrency} ${country.paymentProcessingFixed.toFixed(2)}`,
  }));

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const found = COUNTRIES.find((c) => c.code === code);
    if (found) {
      onCountryChange(found.code, found.defaultCurrency);
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            <Globe className="h-4 w-4 text-indigo-600" />
            6. Shop Country & Etsy Payments
          </CardTitle>
          <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            <Lock className="h-3 w-3 text-slate-400" />
            Auto-Configured
          </span>
        </div>
        <CardDescription>
          Your registered shop location determines Etsy&apos;s payment processing rate & local listing fee
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <Select
          id="country-select"
          value={countryCode}
          onChange={handleSelectChange}
          options={countryOptions}
        />

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
          <div>
            <span className="font-semibold text-slate-800">
              {selectedCountry.flag} {selectedCountry.name} Processing:
            </span>{' '}
            <span className="font-mono text-indigo-600 font-medium">
              {selectedCountry.paymentProcessingRate}% + {selectedCountry.paymentProcessingFixed.toFixed(2)}{' '}
              {selectedCountry.defaultCurrency}
            </span>
          </div>

          {selectedCountry.regulatoryFeeRate && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              +{selectedCountry.regulatoryFeeRate}% Regulatory Fee
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
