import React from 'react';
import { Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="text-center sm:text-left py-3 sm:py-5 max-w-3xl space-y-4">
      {/* Eyebrow badge */}
      <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-orange-100/70 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-xs sm:text-sm font-bold shadow-xs">
        <Sparkles className="h-4 w-4 fill-orange-500 text-orange-500" />
        <span>Free · 100% Client-Side · No Signup Required</span>
        <span className="font-cursive text-orange-600 dark:text-orange-400 font-bold text-lg -rotate-2 ml-1">
          Instant ✨
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
        Calculate your{' '}
        <span className="gradient-text font-cursive text-4xl sm:text-5xl lg:text-6xl font-bold tracking-normal inline-block px-1">
          Etsy profit
        </span>{' '}
        in seconds.
      </h1>

      <p className="text-base text-slate-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
        Instantly see your real net profit after transaction fees, payment processing, shipping costs, advertising, and product expenses — updated live as you type.
      </p>
    </div>
  );
}


