import React from 'react';
import { Tag, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { CURRENCIES } from '@/lib/etsy/constants';
import { CurrencyCode } from '@/types/etsy';
import { formatCurrency } from '@/lib/utils';

interface PricingSectionProps {
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  regularPrice: number;
  onRegularPriceChange: (value: number) => void;
  discount: number;
  onDiscountChange: (value: number) => void;
  salePrice: number;
}

export function PricingSection({
  currency,
  onCurrencyChange,
  regularPrice,
  onRegularPriceChange,
  discount,
  onDiscountChange,
  salePrice,
}: PricingSectionProps) {
  const currencyConfig = CURRENCIES[currency] || CURRENCIES.USD;
  const currencySymbol = currencyConfig.symbol;

  const currencyOptions = Object.values(CURRENCIES).map((c) => ({
    value: c.code,
    label: `${c.code} (${c.symbol})`,
    sublabel: c.name,
  }));

  const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onRegularPriceChange(isNaN(val) || val < 0 ? 0 : val);
  };

  const handleDiscountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      onDiscountChange(0);
    } else if (val < 0) {
      onDiscountChange(0);
    } else if (val > 100) {
      onDiscountChange(100);
    } else {
      onDiscountChange(val);
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>
          <Tag className="h-4 w-4 text-indigo-600" />
          2. Pricing & Discounts
        </CardTitle>
        <CardDescription>
          Set your item list price and optional shop discount or promotion
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Currency & Regular Price Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
          <div className="sm:col-span-5 space-y-1.5">
            <Label htmlFor="currency-select">Currency</Label>
            <Select
              id="currency-select"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              options={currencyOptions}
            />
          </div>

          <div className="sm:col-span-7 space-y-1.5">
            <Label htmlFor="regular-price" required>
              Regular Listing Price
            </Label>
            <Input
              id="regular-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              prefixNode={<span>{currencySymbol}</span>}
              value={regularPrice === 0 ? '' : regularPrice}
              onChange={handlePriceInput}
            />
          </div>
        </div>

        {/* Discount & Calculated Sale Price Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
          <div className="sm:col-span-5 space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="discount-input">Discount / Sale</Label>
              <span className="text-[11px] text-slate-400">0% - 100%</span>
            </div>
            <Input
              id="discount-input"
              type="number"
              min="0"
              max="100"
              step="1"
              placeholder="0"
              suffixNode={<span>%</span>}
              value={discount === 0 ? '' : discount}
              onChange={handleDiscountInput}
            />
          </div>

          <div className="sm:col-span-7 space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="sale-price" className="text-slate-700">
                Calculated Sale Price
              </Label>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                <Sparkles className="h-3 w-3 text-emerald-600" />
                Auto-calculated
              </span>
            </div>
            <div className="relative flex items-center">
              <Input
                id="sale-price"
                readOnly
                isReadOnlyCustom
                value={formatCurrency(salePrice, currency)}
                className="bg-slate-50/80 font-bold text-slate-900 border-slate-200 select-all"
              />
            </div>
          </div>
        </div>

        {discount > 0 && (
          <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-between text-xs text-amber-800">
            <span>
              Customer saves <strong>{discount}%</strong> ({formatCurrency(regularPrice - salePrice, currency)})
            </span>
            <span className="font-semibold">Sale Active</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
