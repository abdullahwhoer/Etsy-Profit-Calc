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
  'What are UK & US fees?',
  'How to increase profit margin?',
  'How do Offsite Ads work?',
  'Digital vs Physical product fees',
];

/**
 * Enhanced Client-Side Intent Matching Engine
 * Analyzes user query (English & Roman Urdu) and returns accurate response + follow-up suggestions
 */
export function getBotResponse(userQuery: string): { response: string; suggestions: string[] } {
  const q = userQuery.toLowerCase().trim();

  // 1. Greetings / Hi / Salam / Kaise ho
  if (
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q.includes('salam') ||
    q.includes('assalam') ||
    q.includes('kaise') ||
    q.includes('kya haal') ||
    q.includes('greetings') ||
    q === 'help'
  ) {
    return {
      response: `👋 **Assalamu Alaikum / Hello!** I'm your **Etsy Seller AI Assistant**.\n\nI can help you understand:\n- **Etsy Marketplace Fees** (6.5% transaction, listing fees, payment processing)\n- **Country-Specific Rates** (US, UK, Pakistan, Canada, Australia, Europe, etc.)\n- **Digital vs Physical Product Profitability**\n- **Offsite & Onsite Advertising Costs**\n- **Strategies to maximize net profit margin**\n\nWhat would you like to know today?`,
      suggestions: ['How do Etsy fees work?', 'What are UK & US fees?', 'Digital vs Physical product fees', 'How to increase profit margin?'],
    };
  }

  // 2. Specific Country Query Match (e.g., UK, US, Pakistan, Canada, Australia, Germany, France, India)
  const matchedCountry = COUNTRY_FEES.find(
    (c) =>
      q.includes(c.name.toLowerCase()) ||
      q.includes(c.code.toLowerCase()) ||
      (c.code === 'GB' && (q.includes('uk') || q.includes('britain') || q.includes('england') || q.includes('united kingdom'))) ||
      (c.code === 'US' && (q.includes('usa') || q.includes('america') || q.includes('states') || q.includes('united states'))) ||
      (c.code === 'PK' && (q.includes('pak') || q.includes('pakistan') || q.includes('pkr'))) ||
      (c.code === 'CA' && (q.includes('canada') || q.includes('canadian'))) ||
      (c.code === 'AU' && (q.includes('australia') || q.includes('aussie'))) ||
      (c.code === 'IN' && (q.includes('india') || q.includes('indian')))
  );

  if (matchedCountry && (
    q.includes('fee') || q.includes('rate') || q.includes('country') || q.includes('process') ||
    q.includes('uk') || q.includes('us') || q.includes('pakistan') || q.includes('kya') || q.includes('kitna') || q.includes('kitni')
  )) {
    const regText = matchedCountry.regulatoryFeeRate
      ? `\n- **Regulatory Operating Fee**: ${matchedCountry.regulatoryFeeRate}%`
      : '';

    return {
      response: `Here are the official Etsy seller fees for **${matchedCountry.flag} ${matchedCountry.name}**:\n\n` +
        `- **Payment Processing**: ${matchedCountry.paymentProcessingRate}% + ${matchedCountry.paymentProcessingFixed.toFixed(2)} ${matchedCountry.defaultCurrency}\n` +
        `- **Standard Listing Fee**: ${matchedCountry.listingFeeFixed.toFixed(2)} ${matchedCountry.defaultCurrency} ($0.20 USD)\n` +
        `- **Marketplace Transaction Fee**: ${(ETSY_TRANSACTION_FEE_RATE * 100).toFixed(1)}% of order total (item price + shipping charged)${regText}\n\n` +
        `💡 *Tip: Select **${matchedCountry.name}** in the "Shop Country" dropdown on the calculator to automatically apply these exact rates!*`,
      suggestions: ['Compare with US fees', 'How to lower Etsy fees?', 'Tell me about Offsite Ads'],
    };
  }

  // 3. Offsite Ads Query
  if (
    q.includes('offsite') ||
    q.includes('google ad') ||
    q.includes('social ad') ||
    q.includes('external ad') ||
    (q.includes('ad') && (q.includes('15%') || q.includes('12%') || q.includes('fee') || q.includes('work') || q.includes('kya')))
  ) {
    return {
      response: `**Etsy Offsite Ads Breakdown:**\n\n` +
        `Etsy automatically advertises seller products on external channels like Google, Facebook, Instagram, Pinterest, and Bing.\n\n` +
        `- **Standard Rate (15%)**: Applied if your shop made **less than $10,000 USD** in the past 12 months. *(Optional: You can opt out in Etsy shop settings)*\n` +
        `- **High-Volume Rate (12%)**: Applied if your shop made **$10,000 USD or more** in the past 12 months. *(Mandatory fee for life)*\n` +
        `- **No Sale = Zero Cost**: You are only charged when an offsite ad directly leads to a purchase within 30 days.\n\n` +
        `💡 *Toggle "Etsy Offsite Ads" ON/OFF in the calculator form to see its live impact on your net profit!*`,
      suggestions: ['How to calculate net profit?', 'What is the listing fee?', 'Tips for digital products'],
    };
  }

  // 4. On-site Etsy Ads (Internal PPC)
  if (q.includes('onsite') || q.includes('etsy ad') || q.includes('promoted listing') || q.includes('ad spend') || q.includes('ppc')) {
    return {
      response: `**Etsy On-Site Ads (Etsy Ads):**\n\n` +
        `- Internal cost-per-click (CPC) ads that display your items in Etsy search results and category pages.\n` +
        `- You set a daily budget (e.g. $1–$10/day).\n` +
        `- In our calculator, enter your estimated ad cost per item sold to evaluate whether advertising pays off.\n\n` +
        `💡 *Recommendation: Maintain your ad spend under 10–15% of item price to keep margins healthy.*`,
      suggestions: ['How do Offsite Ads work?', 'How to increase profit margin?', 'Digital vs Physical product fees'],
    };
  }

  // 5. Overall Marketplace Fees & Charges (English & Roman Urdu)
  if (
    q.includes('fee') ||
    q.includes('percent') ||
    q.includes('cost') ||
    q.includes('charge') ||
    q.includes('how much') ||
    q.includes('kitna') ||
    q.includes('kitni') ||
    q.includes('kharcha') ||
    q.includes('tax')
  ) {
    return {
      response: `**Etsy Seller Marketplace Fees Overview:**\n\n` +
        `1. **Transaction Fee (${(ETSY_TRANSACTION_FEE_RATE * 100).toFixed(1)}%)**: Charged on the item price + shipping paid by the buyer.\n` +
        `2. **Payment Processing Fee**: Depends on shop country (e.g., US: 3.0% + $0.25, UK: 4.0% + £0.20, PK: 6.5% + $0.30).\n` +
        `3. **Listing Fee ($0.20 USD)**: Charged when creating or renewing a product listing (lasts 4 months or until sold).\n` +
        `4. **Offsite Ads (15% or 12%)**: Only charged when a buyer clicks an external ad and buys.\n\n` +
        `Use the live calculator form to enter your prices and test exact net profit!`,
      suggestions: ['What are UK & US fees?', 'How to increase profit margin?', 'Digital vs Physical product fees'],
    };
  }

  // 6. Profit Margin & Strategies to Boost Income
  if (
    q.includes('margin') ||
    q.includes('profit') ||
    q.includes('increase') ||
    q.includes('improve') ||
    q.includes('earn') ||
    q.includes('make more') ||
    q.includes('kamai') ||
    q.includes('badae') ||
    q.includes('faida')
  ) {
    return {
      response: `**5 Proven Strategies to Boost Your Etsy Net Profit Margin:**\n\n` +
        `1. **Sell Digital Products**: 0 manufacturing, 0 packaging, and 0 postage costs mean 80%+ net profit margins.\n` +
        `2. **Product Bundles**: Bundle items together to increase order value while paying the fixed $0.20 listing fee only once.\n` +
        `3. **Shipping Margin Optimization**: Charge accurate shipping rates or use discounted commercial postage labels.\n` +
        `4. **Audit Offsite Ads**: If your shop makes <$10k/yr and items have tight margins, consider opting out of 15% offsite ads.\n` +
        `5. **Target 30%+ Net Margin**: Always price items so net profit after all fees remains above 30% to handle returns and discounts.`,
      suggestions: ['Digital vs Physical product fees', 'How do Etsy fees work?', 'What is the listing fee?'],
    };
  }

  // 7. Digital vs Physical Products
  if (
    q.includes('digital') ||
    q.includes('download') ||
    q.includes('physical') ||
    q.includes('printable') ||
    q.includes('template') ||
    q.includes('pdf') ||
    q.includes('svg')
  ) {
    return {
      response: `**Digital vs Physical Products on Etsy:**\n\n` +
        `- **Digital Products**: Instant downloads (PDFs, SVGs, Canva templates, printables). **$0 manufacturing cost, $0 packaging, $0 shipping cost.** Net profit margins are typically **75%–90%**!\n` +
        `- **Physical Products**: Physical items requiring raw materials, boxes, bubble wrap, and shipping labels. Etsy charges a 6.5% transaction fee on buyer shipping too.\n\n` +
        `💡 *Click the "Digital Product" / "Physical Product" toggle at the top of the calculator to compare both instantly!*`,
      suggestions: ['How to increase profit margin?', 'What are the fees for UK & US?', 'Tell me about Offsite Ads'],
    };
  }

  // 8. Listing Fees & Renewals
  if (
    q.includes('listing') ||
    q.includes('renew') ||
    q.includes('20 cent') ||
    q.includes('free listing') ||
    q.includes('auto renew')
  ) {
    return {
      response: `**Etsy Listing Fee Rules ($0.20 USD / Local Equivalent):**\n\n` +
        `- Charged every time you publish a new product listing.\n` +
        `- Auto-renews every **4 months** if the item remains unsold.\n` +
        `- Auto-renews per quantity sold (e.g. if a customer buys 3 items in one order, you pay 3 x $0.20).\n` +
        `- **Free Listing Credits**: If you have free promotional listing credits, click **"FREE ($0.00)"** in the calculator form!`,
      suggestions: ['How do Etsy fees work?', 'Digital vs Physical product fees', 'How to increase profit margin?'],
    };
  }

  // 9. Shipping & Packaging
  if (
    q.includes('ship') ||
    q.includes('postage') ||
    q.includes('deliver') ||
    q.includes('package') ||
    q.includes('packaging') ||
    q.includes('courier')
  ) {
    return {
      response: `**Etsy Shipping & Packaging Costs Explained:**\n\n` +
        `- **Transaction Fee on Shipping**: Etsy charges a **6.5% transaction fee** on the shipping amount charged to the buyer.\n` +
        `- **Actual Postage Expense**: What you pay out of pocket to purchase shipping labels (USPS, Royal Mail, FedEx, etc.).\n` +
        `- **Packaging Material**: Cost of boxes, poly mailers, bubble wrap, and tissue paper.\n\n` +
        `💡 *In our calculator, enter both "Shipping Charged to Customer" and "Actual Shipping Cost" to see exact net returns.*`,
      suggestions: ['Digital vs Physical product fees', 'How to increase profit margin?', 'What are UK & US fees?'],
    };
  }

  // 10. App / Creator / Developer Info
  if (
    q.includes('who') ||
    q.includes('creator') ||
    q.includes('abdullah') ||
    q.includes('saqib') ||
    q.includes('built') ||
    q.includes('made') ||
    q.includes('developer') ||
    q.includes('owner')
  ) {
    return {
      response: `**About Etsy Profit Calculator:**\n\n` +
        `This web application was designed & built by **Abdullah Saqib** to provide Etsy sellers worldwide with a 100% accurate, private, and real-time fee & profit estimation engine.\n\n` +
        `🔒 **Privacy First**: All calculations take place entirely inside your web browser. No shop data, sales figures, or inputs are ever saved or uploaded to external servers.`,
      suggestions: ['How do Etsy fees work?', 'What are the fees for UK & US?', 'How to increase profit margin?'],
    };
  }

  // Default Fallback
  return {
    response: `I'm your **Etsy Seller AI Assistant**! Here is what I can assist you with:\n\n` +
      `- **Etsy Seller Fees**: 6.5% transaction fee, payment processing schedules, listing renewals.\n` +
      `- **20+ Supported Countries**: US, UK, Pakistan, Canada, Australia, Germany, France, India, etc.\n` +
      `- **Product Profitability**: Comparing Digital Downloads vs Physical Items.\n` +
      `- **Advertising Costs**: Etsy internal PPC ads & 15%/12% Offsite Ads.\n\n` +
      `Feel free to type your question or select one of the quick suggestions below!`,
    suggestions: ['How do Etsy fees work?', 'What are UK & US fees?', 'How to increase profit margin?', 'Tell me about Offsite Ads'],
  };
}

