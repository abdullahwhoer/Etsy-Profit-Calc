'use client';

import React, { useState } from 'react';
import {
  Gift,
  Sparkles,
  ExternalLink,
  Copy,
  CheckCircle2,
  Tag,
  ArrowRight,
  Flame,
  Check,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface FreeListingsSectionProps {
  /** Customize your personal Etsy referral link here */
  referralLink?: string;
  promoCode?: string;
}

// Default referral link - easy to update by the owner
export const DEFAULT_ETSY_REFERRAL_LINK = 'https://etsy.me/40freelistings';
export const DEFAULT_PROMO_CODE = 'FREE40';

export function FreeListingsSection({
  referralLink = DEFAULT_ETSY_REFERRAL_LINK,
  promoCode = DEFAULT_PROMO_CODE,
}: FreeListingsSectionProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  return (
    <section
      id="free-listings-section"
      className="relative overflow-hidden rounded-3xl border border-orange-200/80 dark:border-zinc-800 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 dark:from-orange-950/30 dark:via-zinc-900/90 dark:to-amber-950/20 p-5 sm:p-8 lg:p-10 card-shadow transition-all duration-300"
    >
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-orange-400/20 to-amber-300/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-tr from-amber-400/15 to-orange-500/10 blur-3xl pointer-events-none" />

      <div className="relative space-y-7">
        {/* Top Header Row with Event Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Official Referral Program Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500/15 to-amber-500/15 dark:from-orange-500/25 dark:to-amber-500/25 border border-orange-300/60 dark:border-orange-500/30 text-orange-700 dark:text-orange-300 text-xs sm:text-sm font-bold shadow-xs self-start">
            <Gift className="h-4 w-4 text-orange-500 animate-bounce" />
            <span>Official Etsy Seller Referral Program</span>
            <span className="font-cursive text-base text-amber-600 dark:text-amber-400 font-bold ml-0.5">
              Bonus ✨
            </span>
          </div>

          {/* Active Promo Event Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 dark:bg-rose-500/20 border border-rose-300/50 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-bold font-mono self-start sm:self-auto">
            <Flame className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            <span>2026 SELLER JUMPSTART EVENT ACTIVE</span>
          </div>
        </div>

        {/* Main Pitch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Want{' '}
              <span className="gradient-text font-cursive text-4xl sm:text-5xl lg:text-6xl font-bold inline-block px-1">
                40 Free Etsy Listings
              </span>{' '}
              to start your shop?
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
              Opening a brand new Etsy shop? Click our verified partner link below before registering. 
              Etsy gives <strong className="text-slate-900 dark:text-white">40 free listing credits</strong> ($8.00+ USD value) to your new shop, and rewards us with 40 free listings too. 
              A 100% win-win for both of us!
            </p>
          </div>

          {/* Value highlight badge */}
          <div className="lg:col-span-4 flex lg:justify-end">
            <div className="w-full sm:w-auto p-4 rounded-2xl bg-white/90 dark:bg-zinc-800/90 border border-orange-200/80 dark:border-zinc-700 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-orange-500/30 flex-shrink-0">
                $8+
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-zinc-400 block">
                  Starter Savings
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  40 Listings = $0.00 Cost
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                  Valid for 4 Months per item
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar: Link Box + CTA Buttons */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-orange-200/70 dark:border-zinc-700/80 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
          {/* Link display & copy */}
          <div className="flex-1 min-w-0 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-700">
            <Tag className="h-4 w-4 text-orange-500 shrink-0" />
            <span className="text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-zinc-200 truncate select-all">
              {referralLink}
            </span>
          </div>

          {/* Buttons: Copy & Claim */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-slate-700 dark:text-zinc-200 text-xs sm:text-sm font-bold transition-all cursor-pointer border border-slate-200 dark:border-zinc-600 shadow-xs"
              title="Copy referral link"
            >
              {copiedLink ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied Link!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-slate-500 dark:text-zinc-400" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <a
              href={referralLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Claim 40 Free Listings</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* 3 Step Visual Guide: How to Get Free Credits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          <div className="p-4 rounded-xl bg-white/70 dark:bg-zinc-800/60 border border-slate-200/70 dark:border-zinc-700/60 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 font-bold text-xs flex items-center justify-center font-mono">
                1
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Click Invite Link
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed pl-8">
              Click the referral button <strong>before</strong> creating your shop so Etsy activates your 40 credit token.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/70 dark:bg-zinc-800/60 border border-slate-200/70 dark:border-zinc-700/60 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 font-bold text-xs flex items-center justify-center font-mono">
                2
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Open New Shop
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed pl-8">
              Follow Etsy&apos;s standard registration steps and publish your first product listing ($0.20 fee will show as FREE).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/70 dark:bg-zinc-800/60 border border-slate-200/70 dark:border-zinc-700/60 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center font-mono">
                3
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Both Get 40 Credits
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed pl-8">
              Your store receives 40 free listing renewals instantly, and we receive 40 as well. Zero cost!
            </p>
          </div>
        </div>

        {/* Fine Print Note */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-zinc-500 pt-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span>
            Note: Free listing credits apply strictly to brand new shop registrations through the referral link, per official Etsy Seller Referral terms.
          </span>
        </div>
      </div>
    </section>
  );
}
