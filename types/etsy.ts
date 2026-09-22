export type ProductType = 'digital' | 'physical';

export type ListingType = 'free' | 'paid';

export type OffsiteAdsTier = 'standard' | 'high_volume'; // 15% (<$10k) vs 12% (>=$10k)

export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'CAD'
  | 'AUD'
  | 'NZD'
  | 'CHF'
  | 'SEK'
  | 'NOK'
  | 'DKK'
  | 'JPY'
  | 'SGD'
  | 'HKD'
  | 'PLN'
  | 'INR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  position: 'before' | 'after';
  decimals: number;
}

export interface CountryFeeConfig {
  code: string;
  name: string;
  defaultCurrency: CurrencyCode;
  /** Percentage of payment processing fee (e.g. 3.0 for 3%) */
  paymentProcessingRate: number;
  /** Fixed payment processing fee in the country's default currency (e.g. 0.25) */
  paymentProcessingFixed: number;
  /** Standard listing fee in local currency (e.g. 0.20 USD) */
  listingFeeFixed: number;
  /** Regulatory operating fee percentage if applicable (e.g. 0.32% in UK, 1.1% in AU) */
  regulatoryFeeRate?: number;
  /** Country flag emoji */
  flag: string;
}

export interface CalculatorInput {
  productType: ProductType;
  currency: CurrencyCode;
  regularPrice: number;
  discount: number; // percentage (0 - 100)
  listingType: ListingType;
  productCost: number;
  packagingCost: number;
  shippingCharged: number; // Customer-paid shipping
  actualShippingCost: number; // Actual courier/postage expense
  country: string; // Country code e.g. 'US'
  etsyAdsEnabled: boolean;
  etsyAdsCost: number;
  offsiteAdsEnabled: boolean;
  offsiteAdsTier?: OffsiteAdsTier;
  otherSellerCosts?: number;
}

export interface FeeItem {
  id: string;
  name: string;
  amount: number;
  rateDescription: string;
  isReadOnly: boolean;
  tooltip?: string;
}

export interface CostItem {
  id: string;
  name: string;
  amount: number;
  description?: string;
}

export interface CalculatorResult {
  // 1. Pricing & Revenue
  regularPrice: number;
  discountPercent: number;
  discountAmount: number;
  salePrice: number;
  customerShipping: number;
  shippingRevenue: number; // Alias for customerShipping
  totalCustomerPayment: number;
  totalRevenue: number; // Alias for totalCustomerPayment

  // 2. Etsy Marketplace Fees
  transactionFee: number;
  paymentProcessingFee: number;
  listingFee: number;
  offsiteAdsFee: number;
  currencyConversionFee: number;
  otherApplicableFees: number;
  totalEtsyFees: number;
  itemizedFees: FeeItem[];

  // 3. Your Seller Costs
  productCost: number;
  packagingCost: number;
  actualShippingCost: number;
  etsyAdsCost: number;
  otherSellerCosts: number;
  totalSellerCosts: number;
  itemizedCosts: CostItem[];

  // 4. Final Bottom-Line Metrics
  netProfit: number;
  profitMargin: number; // In percentage (e.g. 42.5%)
  returnOnInvestment: number; // In percentage (e.g. 110.0%)
  effectiveFeeRate: number; // Total Etsy Fees / Total Customer Payment %
  totalDeductions: number; // Total Etsy Fees + Total Seller Costs

  // Visual Distribution for Progress Bars (0 - 100%)
  distribution: {
    profitShare: number;
    feeShare: number;
    costShare: number;
  };

  // Status
  isProfitable: boolean;
  isBreakEven: boolean;
  isLoss: boolean;
}

export interface PresetScenario {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  data: Partial<CalculatorInput>;
}
