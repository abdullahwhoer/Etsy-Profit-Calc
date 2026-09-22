import React from 'react';
import { Truck, PackageCheck, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { CurrencyCode } from '@/types/etsy';
import { CURRENCIES } from '@/lib/etsy/constants';
import { InfoHint } from '@/components/ui/Tooltip';

interface PhysicalShippingSectionProps {
  packagingCost: number;
  onPackagingCostChange: (value: number) => void;
  shippingCharged: number;
  onShippingChargedChange: (value: number) => void;
  actualShippingCost: number;
  onActualShippingCostChange: (value: number) => void;
  currency: CurrencyCode;
}

export function PhysicalShippingSection({
  packagingCost,
  onPackagingCostChange,
  shippingCharged,
  onShippingChargedChange,
  actualShippingCost,
  onActualShippingCostChange,
  currency,
}: PhysicalShippingSectionProps) {
  const currencyConfig = CURRENCIES[currency] || CURRENCIES.USD;
  const currencySymbol = currencyConfig.symbol;

  const handlePackagingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onPackagingCostChange(isNaN(val) || val < 0 ? 0 : val);
  };

  const handleShippingChargedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onShippingChargedChange(isNaN(val) || val < 0 ? 0 : val);
  };

  const handleActualShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onActualShippingCostChange(isNaN(val) || val < 0 ? 0 : val);
  };

  const shippingProfitLoss = shippingCharged - actualShippingCost;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <Card className="border-amber-200/80 bg-gradient-to-b from-amber-50/20 via-white to-white shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              <Truck className="h-4 w-4 text-amber-600" />
              5. Packaging & Shipping (Physical Product)
            </CardTitle>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
              Physical Only
            </span>
          </div>
          <CardDescription>
            Account for packaging supplies and separate customer shipping revenue from your postage costs
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Packaging Cost */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="packaging-cost">Packaging & Materials Cost</Label>
              <InfoHint content="Boxes, padded envelopes, bubble wrap, stickers, thank-you cards, tissue paper." />
            </div>
            <Input
              id="packaging-cost"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              prefixNode={<span>{currencySymbol}</span>}
              value={packagingCost === 0 ? '' : packagingCost}
              onChange={handlePackagingChange}
            />
          </div>

          {/* Shipping Charged vs Actual Shipping Cost (Two distinct columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Customer Shipping Charged (Revenue) */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="shipping-charged" className="text-slate-800 font-semibold flex items-center gap-1.5">
                  <ArrowDownRight className="h-4 w-4 text-emerald-600" />
                  Shipping Charged to Buyer
                </Label>
                <InfoHint content="Amount the buyer pays you for shipping. (Enter 0 if offering Free Shipping). Note: Etsy charges 6.5% transaction fee on this amount." />
              </div>
              <p className="text-[11px] text-slate-500">
                Revenue received from the customer
              </p>
              <Input
                id="shipping-charged"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                prefixNode={<span>{currencySymbol}</span>}
                value={shippingCharged === 0 ? '' : shippingCharged}
                onChange={handleShippingChargedChange}
              />
            </div>

            {/* Actual Shipping Cost (Expense) */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="actual-shipping" className="text-slate-800 font-semibold flex items-center gap-1.5">
                  <ArrowUpRight className="h-4 w-4 text-rose-600" />
                  Actual Shipping Cost
                </Label>
                <InfoHint content="Actual postage label cost paid by you to USPS, FedEx, Royal Mail, Canada Post, etc." />
              </div>
              <p className="text-[11px] text-slate-500">
                Postage expense paid out of pocket
              </p>
              <Input
                id="actual-shipping"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                prefixNode={<span>{currencySymbol}</span>}
                value={actualShippingCost === 0 ? '' : actualShippingCost}
                onChange={handleActualShippingChange}
              />
            </div>
          </div>

          {/* Shipping Differential Alert */}
          {(shippingCharged > 0 || actualShippingCost > 0) && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-700">
              <span className="flex items-center gap-1.5">
                <PackageCheck className="h-3.5 w-3.5 text-slate-500" />
                Shipping Margin:
              </span>
              <span
                className={`font-semibold ${
                  shippingProfitLoss >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {shippingProfitLoss >= 0
                  ? `+${currencySymbol}${shippingProfitLoss.toFixed(2)} (Covered)`
                  : `-${currencySymbol}${Math.abs(shippingProfitLoss).toFixed(2)} (Subsidized)`}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
