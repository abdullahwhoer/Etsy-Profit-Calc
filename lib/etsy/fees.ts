import { CountryFeeConfig, CurrencyCode, CurrencyConfig } from '@/types/etsy';

/**
 * CENTRAL ETSY FEES CONFIGURATION
 * Single source of truth for all Etsy marketplace fee rates, country processing schedules, and currency formatting.
 */

// 1. Transaction Fee
// Etsy charges 6.5% on the total customer payment (Item Sale Price + Customer Shipping + Gift Wrap)
export const ETSY_TRANSACTION_FEE_RATE = 0.065; // 6.5%

// 2. Standard Listing Fee in USD
export const ETSY_LISTING_FEE_USD = 0.20; // $0.20 USD

// 3. Offsite Ads Rates
export const ETSY_OFFSITE_ADS_RATES = {
  standard: 0.15, // 15% (for shops with < $10,000 USD revenue)
  high_volume: 0.12, // 12% (for shops with >= $10,000 USD revenue)
} as const;

// 4. Currency Conversion Fee Rate
export const ETSY_CURRENCY_CONVERSION_RATE = 0.0; // 0.0%

// 5. Default Other Applicable Fees
export const ETSY_OTHER_APPLICABLE_FEES_DEFAULT = 0.0;

// 6. Supported Currencies
export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar (USD)', position: 'before', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro (EUR)', position: 'before', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', position: 'before', decimals: 2 },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)', position: 'before', decimals: 2 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)', position: 'before', decimals: 2 },
  NZD: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar (NZD)', position: 'before', decimals: 2 },
  CHF: { code: 'CHF', symbol: 'CHF ', name: 'Swiss Franc (CHF)', position: 'before', decimals: 2 },
  SEK: { code: 'SEK', symbol: 'kr ', name: 'Swedish Krona (SEK)', position: 'after', decimals: 2 },
  NOK: { code: 'NOK', symbol: 'kr ', name: 'Norwegian Krone (NOK)', position: 'after', decimals: 2 },
  DKK: { code: 'DKK', symbol: 'kr ', name: 'Danish Krone (DKK)', position: 'after', decimals: 2 },
  PLN: { code: 'PLN', symbol: ' zł', name: 'Polish Złoty (PLN)', position: 'after', decimals: 2 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)', position: 'before', decimals: 0 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (SGD)', position: 'before', decimals: 2 },
  HKD: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar (HKD)', position: 'before', decimals: 2 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', position: 'before', decimals: 2 },
};

// 7. Official Etsy Country Fee Schedules
export const COUNTRY_FEES: CountryFeeConfig[] = [
  {
    code: 'US',
    name: 'United States',
    defaultCurrency: 'USD',
    paymentProcessingRate: 3.0,
    paymentProcessingFixed: 0.25,
    listingFeeFixed: 0.20,
    flag: '🇺🇸',
  },
  {
    code: 'PK',
    name: 'Pakistan',
    defaultCurrency: 'USD',
    paymentProcessingRate: 6.5,
    paymentProcessingFixed: 0.30,
    listingFeeFixed: 0.20,
    flag: '🇵🇰',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    defaultCurrency: 'GBP',
    paymentProcessingRate: 4.0,
    paymentProcessingFixed: 0.20,
    listingFeeFixed: 0.16,
    regulatoryFeeRate: 0.32,
    flag: '🇬🇧',
  },
  {
    code: 'CA',
    name: 'Canada',
    defaultCurrency: 'CAD',
    paymentProcessingRate: 3.0,
    paymentProcessingFixed: 0.25,
    listingFeeFixed: 0.28,
    flag: '🇨🇦',
  },
  {
    code: 'AU',
    name: 'Australia',
    defaultCurrency: 'AUD',
    paymentProcessingRate: 3.0,
    paymentProcessingFixed: 0.25,
    listingFeeFixed: 0.30,
    regulatoryFeeRate: 1.1,
    flag: '🇦🇺',
  },
  {
    code: 'DE',
    name: 'Germany',
    defaultCurrency: 'EUR',
    paymentProcessingRate: 4.0,
    paymentProcessingFixed: 0.30,
    listingFeeFixed: 0.19,
    flag: '🇩🇪',
  },
  {
    code: 'FR',
    name: 'France',
    defaultCurrency: 'EUR',
    paymentProcessingRate: 4.0,
    paymentProcessingFixed: 0.30,
    listingFeeFixed: 0.19,
    regulatoryFeeRate: 0.40,
    flag: '🇫🇷',
  },
  {
    code: 'IT',
    name: 'Italy',
    defaultCurrency: 'EUR',
    paymentProcessingRate: 4.0,
    paymentProcessingFixed: 0.30,
    listingFeeFixed: 0.19,
    regulatoryFeeRate: 0.32,
    flag: '🇮🇹',
  },
  {
    code: 'ES',
    name: 'Spain',
    defaultCurrency: 'EUR',
    paymentProcessingRate: 4.0,
    paymentProcessingFixed: 0.30,
    listingFeeFixed: 0.19,
    regulatoryFeeRate: 0.40,
    flag: '🇪🇸',
  },
  {
    code: 'NL',
    name: 'Netherlands',
    defaultCurrency: 'EUR',
    paymentProcessingRate: 4.0,
    paymentProcessingFixed: 0.30,
    listingFeeFixed: 0.19,
    flag: '🇳🇱',
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    defaultCurrency: 'NZD',
    paymentProcessingRate: 4.0,
    paymentProcessingFixed: 0.30,
    listingFeeFixed: 0.33,
    flag: '🇳🇿',
  },
  {
    code: 'CH',
    name: 'Switzerland',
    defaultCurrency: 'CHF',
    paymentProcessingRate: 4.0,
    paymentProcessingFixed: 0.30,
    listingFeeFixed: 0.18,
    flag: '🇨🇭',
  },
  {
    code: 'SE',
    name: 'Sweden',
    defaultCurrency: 'SEK',
    paymentProcessingRate: 4.0,
    paymentProcessingFixed: 3.00,
    listingFeeFixed: 2.20,
    flag: '🇸🇪',
  },
  {
    code: 'NO',
    name: 'Norway',
    defaultCurrency: 'NOK',
    paymentProcessingRate: 4.0,
    paymentProcessingFixed: 2.50,
    listingFeeFixed: 2.20,
    flag: '🇳🇴',
  },
  {
    code: 'DK',
    name: 'Denmark',
    defaultCurrency: 'DKK',
    paymentProcessingRate: 4.0,
    paymentProcessingFixed: 2.50,
    listingFeeFixed: 1.40,
    flag: '🇩🇰',
  },
  {
    code: 'PL',
    name: 'Poland',
    defaultCurrency: 'PLN',
    paymentProcessingRate: 4.0,
    paymentProcessingFixed: 1.20,
    listingFeeFixed: 0.85,
    flag: '🇵🇱',
  },
  {
    code: 'JP',
    name: 'Japan',
    defaultCurrency: 'JPY',
    paymentProcessingRate: 6.0,
    paymentProcessingFixed: 0,
    listingFeeFixed: 30,
    flag: '🇯🇵',
  },
  {
    code: 'SG',
    name: 'Singapore',
    defaultCurrency: 'SGD',
    paymentProcessingRate: 4.4,
    paymentProcessingFixed: 0.35,
    listingFeeFixed: 0.27,
    flag: '🇸🇬',
  },
  {
    code: 'HK',
    name: 'Hong Kong',
    defaultCurrency: 'HKD',
    paymentProcessingRate: 4.4,
    paymentProcessingFixed: 2.00,
    listingFeeFixed: 1.60,
    flag: '🇭🇰',
  },
  {
    code: 'IN',
    name: 'India',
    defaultCurrency: 'INR',
    paymentProcessingRate: 4.0,
    paymentProcessingFixed: 15.0,
    listingFeeFixed: 17.0,
    regulatoryFeeRate: 0.40,
    flag: '🇮🇳',
  },
];

/**
 * Helper to get country fee configuration by country code (defaults to US)
 */
export function getCountryFeeConfig(countryCode: string): CountryFeeConfig {
  return COUNTRY_FEES.find((c) => c.code === countryCode) || COUNTRY_FEES[0];
}
