import { COUNTRY_FEES, ETSY_TRANSACTION_FEE_RATE, ETSY_OFFSITE_ADS_RATES } from '@/lib/etsy/fees';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

/** Quick suggestion prompts shown at start */
export const INITIAL_SUGGESTIONS = [
  'How do Etsy fees work?',
  'What are the fees for UK & US?',
  'How to increase profit margin?',
  'How do Offsite Ads work?',
  'Digital vs Physical product fees',
];

/**
 * Intelligent Client-Side Intent Matching Engine
 * Analyzes query text and returns structured response + follow-up suggestions
 */
export function getBotResponse(userQuery: string): { response: string; suggestions: string[] } {
  const q = userQuery.toLowerCase().trim();

  // 1. Specific Country Query Match (e.g., UK, US, Pakistan, Canada, Australia, Germany, France)
  const matchedCountry = COUNTRY_FEES.find(
    (c) =>
      q.includes(c.name.toLowerCase()) ||
      q.includes(c.code.toLowerCase()) ||
      (c.code === 'GB' && (q.includes('uk') || q.includes('britain') || q.includes('england'))) ||
      (c.code === 'US' && (q.includes('usa') || q.includes('america') || q.includes('states'))) ||
      (c.code === 'PK' && (q.includes('pak') || q.includes('pakistan')))
  );

  if (matchedCountry && (q.includes('fee') || q.includes('rate') || q.includes('country') || q.includes('process') || q.includes('uk') || q.includes('us') || q.includes('pakistan'))) {
    const regText = matchedCountry.regulatoryFeeRate
      ? `\n- **Regulatory Operating Fee**: ${matchedCountry.regulatoryFeeRate}%`
      : '';

    return {
      response: `Here are the official Etsy seller fees for **${matchedCountry.flag} ${matchedCountry.name}**:\n\n` +
        `- **Payment Processing**: ${matchedCountry.paymentProcessingRate}% + ${matchedCountry.paymentProcessingFixed.toFixed(2)} ${matchedCountry.defaultCurrency}\n` +
        `- **Standard Listing Fee**: ${matchedCountry.listingFeeFixed.toFixed(2)} ${matchedCountry.defaultCurrency}\n` +
        `- **Marketplace Transaction Fee**: ${(ETSY_TRANSACTION_FEE_RATE * 100).toFixed(1)}% of order total${regText}\n\n` +
        `💡 *Tip: Select ${matchedCountry.name} in the "Shop Country" dropdown on the calculator to automatically update all calculations!*`,
      suggestions: ['Compare with US fees', 'How to lower Etsy fees?', 'Tell me about Offsite Ads'],
    };
  }

  // 2. Offsite Ads Query
  if (q.includes('offsite') || q.includes('ad') || q.includes('google ad') || q.includes('social ad')) {
    return {
      response: `**Etsy Offsite Ads Breakdown:**\n\n` +
        `Etsy advertises your items on external sites like Google, Facebook, Instagram, and Pinterest.\n\n` +
        `- **Standard Rate (15%)**: Charged on sales made via an ad if your shop earned **less than $10,000 USD** in the past 12 months. (Optional to turn OFF)\n` +
        `- **High-Volume Rate (12%)**: Charged if your shop earned **$10,000 USD or more**. (Mandatory read-only fee)\n` +
        `- **No Sales = No Fee**: You only pay when an offsite ad directly leads to a buyer purchase within 30 days.\n\n` +
        `💡 *You can toggle Offsite Ads ON/OFF in the calculator form to test its impact on your net profit!*`,
      suggestions: ['How to calculate net profit?', 'What is the listing fee?', 'Tips for digital products'],
    };
  }

  // 3. Overall Fees & Transaction Fee
  if (q.includes('fee') || q.includes('percent') || q.includes('cost') || q.includes('charge') || q.includes('how much')) {
    return {
      response: `**Etsy Seller Marketplace Fees Overview:**\n\n` +
        `1. **Transaction Fee (${(ETSY_TRANSACTION_FEE_RATE * 100).toFixed(1)}%)**: Applied to item sale price + shipping charged to buyer.\n` +
        `2. **Payment Processing Fee**: Varies by bank country (e.g. US: 3.0% + $0.25, UK: 4.0% + £0.20, PK: 6.5% + $0.30).\n` +
        `3. **Listing Fee ($0.20 USD)**: Charged when publishing or auto-renewing an item (FREE if using promotional free listings).\n` +
        `4. **Offsite Ads (15% or 12%)**: Only applied if a buyer clicks an external ad and buys.\n\n` +
        `Use the live calculator on the left to test your exact price!`,
      suggestions: ['What are UK & US fees?', 'How to increase profit margin?', 'Digital vs Physical product fees'],
    };
  }

  // 4. Profit Margin & How to Increase Profit
  if (q.includes('margin') || q.includes('profit') || q.includes('increase') || q.includes('improve') || q.includes('earn') || q.includes('make more')) {
    return {
      response: `**5 Proven Strategies to Boost Your Etsy Profit Margin:**\n\n` +
        `1. **Optimize Packaging & Shipping**: Charge buyers actual shipping or build shipping into item price while using discounted commercial postage labels.\n` +
        `2. **Bundle Products**: Selling multi-item bundles increases order value while paying the fixed $0.20 listing fee only once.\n` +
        `3. **Create Digital Products**: Digital downloads have 0 manufacturing, 0 packaging, and 0 postage costs!\n` +
        `4. **Audit Offsite Ads**: If your revenue is <$10k, evaluate whether 15% offsite ad fees are profitable for low-margin items.\n` +
        `5. **Target 30%+ Profit Margin**: Aim for a net margin above 30% to account for returns and seasonal dips.`,
      suggestions: ['Digital vs Physical product fees', 'How do Etsy fees work?', 'What is the listing fee?'],
    };
  }

  // 5. Digital vs Physical Products
  if (q.includes('digital') || q.includes('download') || q.includes('physical') || q.includes('printable')) {
    return {
      response: `**Digital vs Physical Products on Etsy:**\n\n` +
        `- **Digital Products**: Instant downloads (PDFs, SVGs, templates). **0 product cost, 0 packaging, 0 shipping, 0 postage labels.** Net profit margins are often 80%-90%!\n` +
        `- **Physical Products**: Require raw materials, labor, shipping boxes, and postage labels. Subject to shipping fees (6.5% fee on buyer shipping).\n\n` +
        `💡 *Click the "Digital Product" / "Physical Product" toggle button at the top of the calculator to instantly test both!*`,
      suggestions: ['How to increase profit margin?', 'What are the fees for UK & US?', 'Tell me about Offsite Ads'],
    };
  }

  // 6. Listing Fees & Renewals
  if (q.includes('listing') || q.includes('renew') || q.includes('20 cent') || q.includes('free listing')) {
    return {
      response: `**Etsy Listing Fee Rules ($0.20 USD / Local Equivalent):**\n\n` +
        `- Charged every time you publish a new listing.\n` +
        `- Auto-renews every 4 months if un-sold.\n` +
        `- Auto-renews per unit sold if a buyer purchases quantity > 1.\n` +
        `- **Free Listing Mode**: If your shop has promotional free listing credits, select "FREE ($0.00)" in the calculator to exclude this cost!`,
      suggestions: ['How do Etsy fees work?', 'Digital vs Physical product fees', 'How to increase profit margin?'],
    };
  }

  // 7. Creator / About App
  if (q.includes('who') || q.includes('creator') || q.includes('abdullah') || q.includes('saqib') || q.includes('built') || q.includes('made')) {
    return {
      response: `**About Etsy Profit Calculator:**\n\n` +
        `This application was created by **Abdullah Saqib** to provide Etsy sellers worldwide with a clean, 100% private, real-time fee and profit estimation tool.\n\n` +
        `All calculations run locally in your browser with zero data collection or tracking.`,
      suggestions: ['How do Etsy fees work?', 'What are the fees for UK & US?', 'How to increase profit margin?'],
    };
  }

  // Default Fallback
  return {
    response: `I'm your **Etsy Seller AI Assistant**! Here is what I can help you with:\n\n` +
      `- **Etsy Marketplace Fees**: Transaction fees (6.5%), payment processing schedules, and listing fees.\n` +
      `- **20+ Supported Countries**: US, UK, Pakistan, Canada, Australia, Germany, France, etc.\n` +
      `- **Profit Optimization**: Pricing strategies, margins, and digital vs physical product advice.\n\n` +
      `Feel free to ask any question or click one of the quick suggestions below!`,
    suggestions: ['How do Etsy fees work?', 'What are the fees for UK & US?', 'How to increase profit margin?', 'Tell me about Offsite Ads'],
  };
}
