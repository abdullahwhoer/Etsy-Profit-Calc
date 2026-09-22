import {
  CalculatorInput,
  CalculatorResult,
  CountryFeeConfig,
  FeeItem,
  CostItem,
} from '@/types/etsy';
import {
  ETSY_TRANSACTION_FEE_RATE,
  ETSY_OFFSITE_ADS_RATES,
  ETSY_CURRENCY_CONVERSION_RATE,
  ETSY_OTHER_APPLICABLE_FEES_DEFAULT,
  COUNTRY_FEES,
  getCountryFeeConfig,
  CURRENCIES,
} from './fees';

/**
 * PURE CALCULATION ENGINE FOR ETSY SELLER FINANCIALS
 * 
 * - Pure TypeScript function with zero dependencies on React or browser APIs.
 * - Handles all calculations: revenue, transaction fees, processing, listing, offsite ads,
 *   product costs, packaging, shipping differential, and net profit.
 * - Enforces strict conditional rules: Digital products have zero product cost, packaging,
 *   shipping, or Etsy on-site ads.
 * - Enforces zero-division safety, NaN avoidance, and edge case resilience.
 */
export function calculateEtsyProfit(
  input: CalculatorInput,
  customCountryFees?: CountryFeeConfig[]
): CalculatorResult {
  // ---------------------------------------------------------
  // 1. Sanitize & Normalize Inputs
  // ---------------------------------------------------------
  const regularPrice = Math.max(0, Number(input.regularPrice) || 0);
  const discountPercent = Math.min(100, Math.max(0, Number(input.discount) || 0));

  const isPhysical = input.productType === 'physical';

  // For Digital products: Product Cost, Packaging, Shipping, and Etsy Ads are strictly 0
  const productCost = isPhysical ? Math.max(0, Number(input.productCost) || 0) : 0;
  const packagingCost = isPhysical ? Math.max(0, Number(input.packagingCost) || 0) : 0;
  const customerShipping = isPhysical ? Math.max(0, Number(input.shippingCharged) || 0) : 0;
  const actualShippingCost = isPhysical ? Math.max(0, Number(input.actualShippingCost) || 0) : 0;
  const etsyAdsCost = isPhysical && input.etsyAdsEnabled ? Math.max(0, Number(input.etsyAdsCost) || 0) : 0;
  const otherSellerCosts = isPhysical ? Math.max(0, Number(input.otherSellerCosts) || 0) : 0;

  // ---------------------------------------------------------
  // 2. Resolve Country & Fee Configuration
  // ---------------------------------------------------------
  const countries = customCountryFees || COUNTRY_FEES;
  const country: CountryFeeConfig =
    countries.find((c) => c.code === input.country) || getCountryFeeConfig('US');

  const currencyConfig = CURRENCIES[input.currency] || CURRENCIES.USD;
  const currencySymbol = currencyConfig.symbol;

  // ---------------------------------------------------------
  // 3. Price & Revenue Calculations
  // ---------------------------------------------------------
  const discountAmount = regularPrice * (discountPercent / 100);
  const salePrice = Math.max(0, regularPrice - discountAmount);
  const shippingRevenue = customerShipping;
  const totalCustomerPayment = salePrice + shippingRevenue;
  const totalRevenue = totalCustomerPayment;

  // ---------------------------------------------------------
  // 4. Etsy Marketplace Fees
  // ---------------------------------------------------------
  // A. Transaction Fee: 6.5% on total customer payment (Item Sale Price + Customer-paid Shipping)
  const transactionFee = totalCustomerPayment > 0 ? totalCustomerPayment * ETSY_TRANSACTION_FEE_RATE : 0;

  // B. Payment Processing Fee: Country-specific % + Fixed transaction fee
  const paymentProcessingFee =
    totalCustomerPayment > 0
      ? totalCustomerPayment * (country.paymentProcessingRate / 100) + country.paymentProcessingFixed
      : 0;

  // C. Listing Fee: Configured country fee if Paid ($0.20 USD / local equiv), 0 if Free
  const listingFee = input.listingType === 'paid' ? country.listingFeeFixed : 0;

  // D. Offsite Ads Fee: 15% standard (<$10k) or 12% high-volume (>= $10k) applied to totalCustomerPayment
  const offsiteRate =
    input.offsiteAdsTier === 'high_volume'
      ? ETSY_OFFSITE_ADS_RATES.high_volume
      : ETSY_OFFSITE_ADS_RATES.standard;
  const offsiteAdsFee =
    input.offsiteAdsEnabled && totalCustomerPayment > 0
      ? totalCustomerPayment * offsiteRate
      : 0;

  // E. Currency Conversion Fee: Default 0.00
  const currencyConversionFee =
    totalCustomerPayment > 0 && ETSY_CURRENCY_CONVERSION_RATE > 0
      ? totalCustomerPayment * ETSY_CURRENCY_CONVERSION_RATE
      : 0;

  // F. Other Applicable Fees (e.g. Country Regulatory Operating Fees: UK 0.32%, France 0.40%, AU 1.1%)
  const regulatoryFee =
    country.regulatoryFeeRate && totalCustomerPayment > 0
      ? totalCustomerPayment * (country.regulatoryFeeRate / 100)
      : 0;
  const otherApplicableFees = regulatoryFee || ETSY_OTHER_APPLICABLE_FEES_DEFAULT;

  // Total Etsy Marketplace Fees
  const totalEtsyFees =
    transactionFee +
    paymentProcessingFee +
    listingFee +
    offsiteAdsFee +
    currencyConversionFee +
    otherApplicableFees;

  // ---------------------------------------------------------
  // 5. Total Seller Costs
  // ---------------------------------------------------------
  // For Digital products, totalSellerCosts = 0
  const totalSellerCosts =
    productCost +
    packagingCost +
    actualShippingCost +
    etsyAdsCost +
    otherSellerCosts;

  // ---------------------------------------------------------
  // 6. Net Profit & Margin Metrics
  // ---------------------------------------------------------
  const totalDeductions = totalEtsyFees + totalSellerCosts;
  const netProfit = totalCustomerPayment - totalDeductions;

  const rawProfitMargin =
    totalCustomerPayment > 0 ? (netProfit / totalCustomerPayment) * 100 : 0;
  const profitMargin = Number.isFinite(rawProfitMargin) ? rawProfitMargin : 0;

  const rawROI = totalDeductions > 0 ? (netProfit / totalDeductions) * 100 : 0;
  const returnOnInvestment = Number.isFinite(rawROI) ? rawROI : 0;

  const rawEffectiveFeeRate =
    totalCustomerPayment > 0 ? (totalEtsyFees / totalCustomerPayment) * 100 : 0;
  const effectiveFeeRate = Number.isFinite(rawEffectiveFeeRate) ? rawEffectiveFeeRate : 0;

  // ---------------------------------------------------------
  // 7. Itemized Breakdown Structures for UI
  // ---------------------------------------------------------
  const itemizedFees: FeeItem[] = [
    {
      id: 'transaction',
      name: 'Transaction Fee',
      amount: transactionFee,
      rateDescription: `${(ETSY_TRANSACTION_FEE_RATE * 100).toFixed(1)}%`,
      isReadOnly: true,
      tooltip: 'Etsy charges 6.5% of the total amount collected from the buyer.',
    },
    {
      id: 'payment_processing',
      name: 'Payment Processing',
      amount: paymentProcessingFee,
      rateDescription: `${country.paymentProcessingRate}% + ${currencySymbol}${country.paymentProcessingFixed.toFixed(2)} ${country.defaultCurrency}`,
      isReadOnly: true,
      tooltip: `Standard processing fee for ${country.name} Etsy Payments accounts.`,
    },
  ];

  // Show Listing Fee only when Listing Type is PAID
  if (input.listingType === 'paid') {
    itemizedFees.push({
      id: 'listing',
      name: 'Listing Fee',
      amount: listingFee,
      rateDescription: `${currencySymbol}${country.listingFeeFixed.toFixed(2)} ${country.defaultCurrency}`,
      isReadOnly: true,
      tooltip: 'Standard listing publication or renewal fee.',
    });
  }

  // Show Offsite Ads Fee only when Offsite Ads is enabled
  if (input.offsiteAdsEnabled) {
    itemizedFees.push({
      id: 'offsite_ads',
      name: 'Offsite Ads',
      amount: offsiteAdsFee,
      rateDescription: `${(offsiteRate * 100).toFixed(0)}% (${input.offsiteAdsTier === 'high_volume' ? '≥$10k status' : '<$10k status'})`,
      isReadOnly: true,
      tooltip: 'Etsy fee for sales generated from external search engines and social media ads.',
    });
  }

  // Show Regulatory Operating Fee if applicable to the selected country
  if (otherApplicableFees > 0) {
    itemizedFees.push({
      id: 'other_applicable_fees',
      name: 'Regulatory Operating Fee',
      amount: otherApplicableFees,
      rateDescription: country.regulatoryFeeRate
        ? `${country.regulatoryFeeRate}% (${country.name})`
        : '0.00',
      isReadOnly: true,
      tooltip: 'Country-specific regulatory operating or local statutory marketplace fees.',
    });
  }


  // Cost items: Only populated for Physical products
  const itemizedCosts: CostItem[] = [];

  if (isPhysical) {
    if (productCost > 0) {
      itemizedCosts.push({
        id: 'product',
        name: 'Product / Manufacturing Cost',
        amount: productCost,
        description: 'Raw materials, labor, printing, or wholesale unit cost',
      });
    }

    if (packagingCost > 0) {
      itemizedCosts.push({
        id: 'packaging',
        name: 'Packaging & Materials',
        amount: packagingCost,
        description: 'Boxes, bubble mailers, branded tissue, inserts',
      });
    }

    if (actualShippingCost > 0) {
      itemizedCosts.push({
        id: 'actual_shipping',
        name: 'Actual Shipping Expense',
        amount: actualShippingCost,
        description: 'Postage label cost paid directly by seller to courier',
      });
    }

    if (etsyAdsCost > 0) {
      itemizedCosts.push({
        id: 'etsy_ads',
        name: 'Etsy On-Site Ads Cost',
        amount: etsyAdsCost,
        description: 'Estimated advertising spend to acquire this sale',
      });
    }

    if (otherSellerCosts > 0) {
      itemizedCosts.push({
        id: 'other_costs',
        name: 'Other Seller Costs',
        amount: otherSellerCosts,
        description: 'Additional miscellaneous business overhead expenses',
      });
    }
  }

  // ---------------------------------------------------------
  // 8. Visual Distribution Calculation (Shares of Revenue)
  // ---------------------------------------------------------
  let profitShare = 0;
  let feeShare = 0;
  let costShare = 0;

  if (totalCustomerPayment > 0) {
    feeShare = Math.min(100, Math.max(0, (totalEtsyFees / totalCustomerPayment) * 100));
    costShare = Math.min(100, Math.max(0, (totalSellerCosts / totalCustomerPayment) * 100));
    profitShare = Math.max(0, 100 - feeShare - costShare);
  }

  return {
    regularPrice,
    discountPercent,
    discountAmount,
    salePrice,
    customerShipping,
    shippingRevenue,
    totalCustomerPayment,
    totalRevenue,

    transactionFee,
    paymentProcessingFee,
    listingFee,
    offsiteAdsFee,
    currencyConversionFee,
    otherApplicableFees,
    totalEtsyFees,
    itemizedFees,

    productCost,
    packagingCost,
    actualShippingCost,
    etsyAdsCost,
    otherSellerCosts,
    totalSellerCosts,
    itemizedCosts,

    netProfit: Number.isFinite(netProfit) ? netProfit : 0,
    profitMargin,
    returnOnInvestment,
    effectiveFeeRate,
    totalDeductions,

    distribution: {
      profitShare,
      feeShare,
      costShare,
    },

    isProfitable: netProfit > 0.005,
    isBreakEven: Math.abs(netProfit) <= 0.005,
    isLoss: netProfit < -0.005,
  };
}
