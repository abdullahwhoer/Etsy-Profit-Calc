import React from 'react';
import { Hammer } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { CurrencyCode, ProductType } from '@/types/etsy';
import { CURRENCIES } from '@/lib/etsy/constants';

interface CostSectionProps {
  productCost: number;
  onProductCostChange: (value: number) => void;
  currency: CurrencyCode;
  productType: ProductType;
}

export function CostSection({
  productCost,
  onProductCostChange,
  currency,
  productType,
}: CostSectionProps) {
  const currencyConfig = CURRENCIES[currency] || CURRENCIES.USD;

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onProductCostChange(isNaN(val) || val < 0 ? 0 : val);
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>
          <Hammer className="h-4 w-4 text-indigo-600" />
          4. Item Production Cost
        </CardTitle>
        <CardDescription>
          {productType === 'digital'
            ? 'Software licenses, graphic assets, or unit production cost (enter 0 if none)'
            : 'Raw materials, labor, printing, or wholesale unit cost'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-1.5">
          <Label htmlFor="product-cost">Product / Manufacturing Cost</Label>
          <Input
            id="product-cost"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            prefixNode={<span>{currencyConfig.symbol}</span>}
            value={productCost === 0 ? '' : productCost}
            onChange={handleCostChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
