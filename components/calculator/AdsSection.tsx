import React from 'react';
import { Megaphone, ExternalLink, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { InfoHint } from '@/components/ui/Tooltip';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { CurrencyCode, OffsiteAdsTier } from '@/types/etsy';
import { CURRENCIES, ETSY_OFFSITE_ADS_RATES } from '@/lib/etsy/constants';

interface AdsSectionProps {
  currency: CurrencyCode;
  etsyAdsEnabled: boolean;
  onEtsyAdsToggle: (enabled: boolean) => void;
  etsyAdsCost: number;
  onEtsyAdsCostChange: (cost: number) => void;
  offsiteAdsEnabled: boolean;
  onOffsiteAdsToggle: (enabled: boolean) => void;
  offsiteAdsTier?: OffsiteAdsTier;
  onOffsiteAdsTierChange?: (tier: OffsiteAdsTier) => void;
}

export function AdsSection({
  currency,
  etsyAdsEnabled,
  onEtsyAdsToggle,
  etsyAdsCost,
  onEtsyAdsCostChange,
  offsiteAdsEnabled,
  onOffsiteAdsToggle,
  offsiteAdsTier = 'standard',
  onOffsiteAdsTierChange,
}: AdsSectionProps) {
  const currencyConfig = CURRENCIES[currency] || CURRENCIES.USD;
  const currencySymbol = currencyConfig.symbol;

  const currentOffsiteRate =
    offsiteAdsTier === 'high_volume'
      ? ETSY_OFFSITE_ADS_RATES.high_volume
      : ETSY_OFFSITE_ADS_RATES.standard;

  const handleAdsCostInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onEtsyAdsCostChange(isNaN(val) || val < 0 ? 0 : val);
  };

  return (
    <div className="space-y-4">
      {/* 8. ETSY ON-SITE ADS */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>
              <Megaphone className="h-4 w-4 text-indigo-600" />
              8. Etsy On-Site Ads
            </CardTitle>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Optional Campaign
            </span>
          </div>
          <CardDescription>
            Paid advertising within Etsy search results and category pages
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <Switch
              id="etsy-ads-switch"
              checked={etsyAdsEnabled}
              onCheckedChange={onEtsyAdsToggle}
              label="Enable Etsy On-Site Ads for this listing"
              description="Calculate estimated advertising spend needed to generate this sale"
            />
          </div>

          {etsyAdsEnabled && (
            <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100/80 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center justify-between">
                <Label htmlFor="etsy-ads-cost" className="text-slate-900">
                  Estimated Ad Spend Per Sale
                </Label>
                <InfoHint content="Total ad clicks / cost spent to convert this individual sale. Classified under Your Seller Costs." />
              </div>
              <Input
                id="etsy-ads-cost"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                prefixNode={<span>{currencySymbol}</span>}
                value={etsyAdsCost === 0 ? '' : etsyAdsCost}
                onChange={handleAdsCostInput}
              />
              <p className="text-[11px] text-slate-500">
                This cost will be deducted under Your Seller Costs from your net earnings.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 9. ETSY OFFSITE ADS */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>
              <ExternalLink className="h-4 w-4 text-indigo-600" />
              9. Etsy Offsite Ads
            </CardTitle>
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              <Lock className="h-2.5 w-2.5" />
              {(currentOffsiteRate * 100).toFixed(0)}% Read-Only Rate
            </span>
          </div>
          <CardDescription>
            Etsy advertises your listings on Google, Facebook, Instagram, Pinterest, and Bing. Etsy only charges a fee when an offsite click leads to a sale within 30 days.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <Switch
              id="offsite-ads-switch"
              checked={offsiteAdsEnabled}
              onCheckedChange={onOffsiteAdsToggle}
              label="Sale attributed to Etsy Offsite Ads"
              description="Applies Etsy's locked offsite advertising fee on the total customer payment"
            />
          </div>

          {offsiteAdsEnabled && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
              {/* Shop Revenue Status Tier Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-slate-700">Shop Annual Revenue Status</Label>
                  <InfoHint content="Shops earning under $10,000 USD in trailing 12 months pay 15% (optional). Shops earning $10,000+ USD pay 12% (mandatory participation)." />
                </div>
                {onOffsiteAdsTierChange && (
                  <SegmentedControl<OffsiteAdsTier>
                    value={offsiteAdsTier}
                    onChange={onOffsiteAdsTierChange}
                    size="sm"
                    options={[
                      {
                        value: 'standard',
                        label: 'Under $10,000/yr',
                        badge: '15% Fee',
                      },
                      {
                        value: 'high_volume',
                        label: '$10,000+/yr',
                        badge: '12% Fee',
                      },
                    ]}
                  />
                )}
              </div>

              {/* Read-Only Rate Display */}
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between gap-3">
                <div className="text-xs text-amber-900 space-y-0.5">
                  <span className="font-semibold block">
                    Offsite Ads Fee Rate: {(currentOffsiteRate * 100).toFixed(0)}%
                  </span>
                  <span className="text-amber-700/80 text-[11px]">
                    Calculated against total customer payment (item + shipping). Non-editable rate.
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 font-mono font-bold text-sm shrink-0 border border-amber-200 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  {(currentOffsiteRate * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
