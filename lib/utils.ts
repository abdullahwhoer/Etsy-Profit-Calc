import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CurrencyCode } from '@/types/etsy';
import { CURRENCIES } from './etsy/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currencyCode: CurrencyCode = 'USD'): string {
  if (!Number.isFinite(amount)) return '$0.00';

  const config = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const isNegative = amount < -0.0001;
  const absAmount = Math.abs(amount);
  
  const formattedNumber = absAmount.toLocaleString('en-US', {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  });

  const formattedWithSymbol =
    config.position === 'before'
      ? `${config.symbol}${formattedNumber}`
      : `${formattedNumber}${config.symbol}`;

  return isNegative ? `-${formattedWithSymbol}` : formattedWithSymbol;
}

export function formatPercent(value: number, decimals: number = 1): string {
  if (!Number.isFinite(value)) return '0.0%';
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(decimals)}%`;
}

export function formatPercentClean(value: number, decimals: number = 1): string {
  if (!Number.isFinite(value)) return '0.0%';
  return `${value.toFixed(decimals)}%`;
}
