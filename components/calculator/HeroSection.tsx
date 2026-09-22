import React from 'react';
import { Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="text-center sm:text-left py-2 sm:py-4 max-w-3xl space-y-3">
      {/* Eyebrow badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/60 text-orange-700 dark:text-orange-300 text-[11px] font-semibold">
        <Sparkles className="h-3 w-3 fill-orange-500 text-orange-500" />
        <span>Free · 100% Client-Side · No Signup Required</span>
        <span className="font-cursive text-orange-600 dark:text-orange-400 font-bold text-base -rotate-2 ml-1">
          Instant ✨
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
        Calculate your{' '}
        <span className="gradient-text font-cursive text-3xl sm:text-4xl lg:text-5xl font-bold tracking-normal inline-block px-1">
          Etsy profit
        </span>{' '}
        in seconds.
      </h1>

      <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
        Instantly see your real net profit after transaction fees, payment processing, shipping costs, advertising, and product expenses — updated live as you type.
      </p>
    </div>
  );
}


