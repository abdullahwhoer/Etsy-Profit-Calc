import { calculateEtsyProfit } from '../calculator';
import { CalculatorInput } from '@/types/etsy';

function assertApprox(actual: number, expected: number, tolerance = 0.001, label = '') {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(
      `Assertion failed for ${label}: expected ${expected.toFixed(4)}, but got ${actual.toFixed(4)} (diff: ${Math.abs(actual - expected)})`
    );
  }
}

export function runAllTests() {
  console.log('🧪 Starting Etsy Calculation Engine Unit Tests...\n');

  // ---------------------------------------------------------
  // Test A — Digital / Free Listing (US)
  // ---------------------------------------------------------
  console.log('Running Test A: Digital / Free Listing...');
  const inputA: CalculatorInput = {
    productType: 'digital',
    currency: 'USD',
    regularPrice: 20.0,
    discount: 0,
    listingType: 'free',
    productCost: 0,
    packagingCost: 0,
    shippingCharged: 0,
    actualShippingCost: 0,
    country: 'US',
    etsyAdsEnabled: false,
    etsyAdsCost: 0,
    offsiteAdsEnabled: false,
  };

  const resA = calculateEtsyProfit(inputA);
  assertApprox(resA.salePrice, 20.0, 0.001, 'Test A salePrice');
  assertApprox(resA.customerShipping, 0.0, 0.001, 'Test A customerShipping');
  assertApprox(resA.totalCustomerPayment, 20.0, 0.001, 'Test A totalCustomerPayment');
  assertApprox(resA.listingFee, 0.0, 0.001, 'Test A listingFee');
  assertApprox(resA.etsyAdsCost, 0.0, 0.001, 'Test A etsyAdsCost');
  assertApprox(resA.offsiteAdsFee, 0.0, 0.001, 'Test A offsiteAdsFee');
  // US Transaction: 6.5% of 20 = 1.30
  assertApprox(resA.transactionFee, 1.3, 0.001, 'Test A transactionFee');
  // US Processing: 3% of 20 + 0.25 = 0.60 + 0.25 = 0.85
  assertApprox(resA.paymentProcessingFee, 0.85, 0.001, 'Test A paymentProcessingFee');
  // Total fees = 1.30 + 0.85 = 2.15
  assertApprox(resA.totalEtsyFees, 2.15, 0.001, 'Test A totalEtsyFees');
  assertApprox(resA.totalSellerCosts, 0.0, 0.001, 'Test A totalSellerCosts');
  // Net profit = 20 - 2.15 = 17.85
  assertApprox(resA.netProfit, 17.85, 0.001, 'Test A netProfit');
  // Margin = (17.85 / 20) * 100 = 89.25%
  assertApprox(resA.profitMargin, 89.25, 0.001, 'Test A profitMargin');
  console.log('✅ Test A passed!\n');

  // ---------------------------------------------------------
  // Test B — Digital / Paid Listing (US)
  // ---------------------------------------------------------
  console.log('Running Test B: Digital / Paid Listing with 20% discount...');
  const inputB: CalculatorInput = {
    productType: 'digital',
    currency: 'USD',
    regularPrice: 20.0,
    discount: 20, // 20% discount
    listingType: 'paid',
    productCost: 0,
    packagingCost: 0,
    shippingCharged: 0,
    actualShippingCost: 0,
    country: 'US',
    etsyAdsEnabled: false,
    etsyAdsCost: 0,
    offsiteAdsEnabled: false,
  };

  const resB = calculateEtsyProfit(inputB);
  assertApprox(resB.salePrice, 16.0, 0.001, 'Test B salePrice ($20 - 20% = $16)');
  assertApprox(resB.discountAmount, 4.0, 0.001, 'Test B discountAmount');
  assertApprox(resB.listingFee, 0.2, 0.001, 'Test B listingFee ($0.20)');
  // Transaction: 6.5% of 16 = 1.04
  assertApprox(resB.transactionFee, 1.04, 0.001, 'Test B transactionFee');
  // Processing: 3% of 16 + 0.25 = 0.48 + 0.25 = 0.73
  assertApprox(resB.paymentProcessingFee, 0.73, 0.001, 'Test B paymentProcessingFee');
  // Total fees = 1.04 + 0.73 + 0.20 = 1.97
  assertApprox(resB.totalEtsyFees, 1.97, 0.001, 'Test B totalEtsyFees');
  // Net profit = 16 - 1.97 = 14.03
  assertApprox(resB.netProfit, 14.03, 0.001, 'Test B netProfit');
  console.log('✅ Test B passed!\n');

  // ---------------------------------------------------------
  // Test Pakistan Fee Schedule (6.5% + $0.30 USD)
  // ---------------------------------------------------------
  console.log('Running Test: Pakistan Payment Processing Schedule (6.5% + $0.30 USD)...');
  const inputPK: CalculatorInput = {
    productType: 'digital',
    currency: 'USD',
    regularPrice: 20.0,
    discount: 0,
    listingType: 'paid',
    productCost: 0,
    packagingCost: 0,
    shippingCharged: 0,
    actualShippingCost: 0,
    country: 'PK', // Pakistan
    etsyAdsEnabled: false,
    etsyAdsCost: 0,
    offsiteAdsEnabled: false,
  };

  const resPK = calculateEtsyProfit(inputPK);
  // Transaction Fee: 6.5% of 20 = 1.30
  assertApprox(resPK.transactionFee, 1.30, 0.001, 'PK Transaction Fee');
  // PK Processing Fee: 6.5% of 20 + $0.30 = 1.30 + 0.30 = $1.60
  assertApprox(resPK.paymentProcessingFee, 1.60, 0.001, 'PK Payment Processing (6.5% + $0.30)');
  // Listing Fee: $0.20
  assertApprox(resPK.listingFee, 0.20, 0.001, 'PK Listing Fee');
  // Total Etsy Fees: 1.30 + 1.60 + 0.20 = $3.10
  assertApprox(resPK.totalEtsyFees, 3.10, 0.001, 'PK Total Etsy Fees');
  // Net Profit: 20 - 3.10 = $16.90
  assertApprox(resPK.netProfit, 16.90, 0.001, 'PK Net Profit');
  console.log('✅ Pakistan Test passed!\n');

  // ---------------------------------------------------------
  // Test C — Physical Product
  // ---------------------------------------------------------
  console.log('Running Test C: Physical Product with shipping and Etsy Ads...');
  const inputC: CalculatorInput = {
    productType: 'physical',
    currency: 'USD',
    regularPrice: 30.0,
    discount: 10, // 10% discount -> $27
    listingType: 'paid',
    productCost: 8.0,
    packagingCost: 1.0,
    shippingCharged: 5.0, // Customer pays $5
    actualShippingCost: 4.0, // Seller courier cost $4
    country: 'US',
    etsyAdsEnabled: true,
    etsyAdsCost: 2.0,
    offsiteAdsEnabled: false,
  };

  const resC = calculateEtsyProfit(inputC);
  assertApprox(resC.salePrice, 27.0, 0.001, 'Test C salePrice ($30 - 10% = $27)');
  assertApprox(resC.customerShipping, 5.0, 0.001, 'Test C customerShipping');
  assertApprox(resC.totalCustomerPayment, 32.0, 0.001, 'Test C totalCustomerPayment ($27 + $5)');
  assertApprox(resC.actualShippingCost, 4.0, 0.001, 'Test C actualShippingCost');
  // Transaction Fee: 6.5% of totalCustomerPayment ($32) = 2.08
  assertApprox(resC.transactionFee, 2.08, 0.001, 'Test C transactionFee (6.5% on $32)');
  // Payment Processing: 3% of $32 + 0.25 = 0.96 + 0.25 = 1.21
  assertApprox(resC.paymentProcessingFee, 1.21, 0.001, 'Test C paymentProcessingFee');
  // Listing Fee: $0.20
  assertApprox(resC.listingFee, 0.20, 0.001, 'Test C listingFee');
  // Total Etsy Fees = 2.08 + 1.21 + 0.20 = 3.49
  assertApprox(resC.totalEtsyFees, 3.49, 0.001, 'Test C totalEtsyFees');
  // Total Seller Costs = $8 product + $1 packaging + $4 shipping + $2 Etsy Ads = $15.00
  assertApprox(resC.totalSellerCosts, 15.0, 0.001, 'Test C totalSellerCosts ($8+$1+$4+$2)');
  // Net Profit = $32 - $3.49 - $15.00 = $13.51
  assertApprox(resC.netProfit, 13.51, 0.001, 'Test C netProfit ($32 - $3.49 - $15)');
  // Margin = (13.51 / 32) * 100 = 42.21875%
  assertApprox(resC.profitMargin, 42.21875, 0.001, 'Test C profitMargin');
  console.log('✅ Test C passed!\n');

  // ---------------------------------------------------------
  // Test D — Offsite Ads
  // ---------------------------------------------------------
  console.log('Running Test D: Offsite Ads calculation on order amount...');
  const inputD: CalculatorInput = {
    ...inputC,
    offsiteAdsEnabled: true,
    offsiteAdsTier: 'standard', // 15%
  };

  const resD = calculateEtsyProfit(inputD);
  // Offsite Ads Fee: 15% of $32 = 4.80
  assertApprox(resD.offsiteAdsFee, 4.80, 0.001, 'Test D offsiteAdsFee (15% of $32)');
  // Total Etsy Fees = 3.49 + 4.80 = 8.29
  assertApprox(resD.totalEtsyFees, 8.29, 0.001, 'Test D totalEtsyFees');
  // Etsy Ads remains separate in seller costs: $15.00
  assertApprox(resD.totalSellerCosts, 15.0, 0.001, 'Test D totalSellerCosts');
  // Net Profit = $32 - $8.29 - $15.00 = $8.71
  assertApprox(resD.netProfit, 8.71, 0.001, 'Test D netProfit');

  // High Volume Tier: 12%
  const inputD2: CalculatorInput = {
    ...inputC,
    offsiteAdsEnabled: true,
    offsiteAdsTier: 'high_volume', // 12%
  };
  const resD2 = calculateEtsyProfit(inputD2);
  // Offsite Ads Fee: 12% of $32 = 3.84
  assertApprox(resD2.offsiteAdsFee, 3.84, 0.001, 'Test D2 offsiteAdsFee (12% of $32)');
  // Net Profit = $32 - (3.49 + 3.84) - $15 = $9.67
  assertApprox(resD2.netProfit, 9.67, 0.001, 'Test D2 netProfit');
  console.log('✅ Test D passed!\n');

  // ---------------------------------------------------------
  // Test Edge Cases (0, NaN, 100% discount, negative values)
  // ---------------------------------------------------------
  console.log('Running Edge Cases: 0 price, 100% discount, negative sanitization...');
  const inputEdge: CalculatorInput = {
    productType: 'physical',
    currency: 'USD',
    regularPrice: 0,
    discount: 100,
    listingType: 'free',
    productCost: -5, // Should sanitize to 0
    packagingCost: 0,
    shippingCharged: 0,
    actualShippingCost: 0,
    country: 'US',
    etsyAdsEnabled: false,
    etsyAdsCost: 0,
    offsiteAdsEnabled: false,
  };

  const resEdge = calculateEtsyProfit(inputEdge);
  assertApprox(resEdge.salePrice, 0, 0.001, 'Edge salePrice');
  assertApprox(resEdge.totalCustomerPayment, 0, 0.001, 'Edge totalCustomerPayment');
  assertApprox(resEdge.profitMargin, 0, 0.001, 'Edge profitMargin (no division by zero)');
  assertApprox(resEdge.productCost, 0, 0.001, 'Edge productCost (negative clamped to 0)');
  assertApprox(resEdge.netProfit, 0, 0.001, 'Edge netProfit');
  if (!Number.isFinite(resEdge.profitMargin) || !Number.isFinite(resEdge.netProfit)) {
    throw new Error('Edge case returned non-finite number');
  }
  console.log('✅ Edge cases passed!\n');

  console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! 🚀');
}
