import React from 'react';
import { Download, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ProductType } from '@/types/etsy';

interface ProductTypeSectionProps {
  value: ProductType;
  onChange: (value: ProductType) => void;
}

export function ProductTypeSection({ value, onChange }: ProductTypeSectionProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">1. Product Type</h4>
            <p className="text-xs text-slate-500">
              Select product category to customize cost & shipping fields
            </p>
          </div>
          <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md self-start sm:self-auto">
            {value === 'digital' ? 'No shipping required' : 'Includes shipping calculation'}
          </span>
        </div>

        <SegmentedControl<ProductType>
          value={value}
          onChange={onChange}
          size="lg"
          options={[
            {
              value: 'digital',
              label: 'Digital Product',
              icon: <Download className="h-4 w-4 text-indigo-600" />,
              badge: 'Downloads & Printables',
            },
            {
              value: 'physical',
              label: 'Physical Product',
              icon: <Package className="h-4 w-4 text-amber-600" />,
              badge: 'Handmade & Goods',
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
