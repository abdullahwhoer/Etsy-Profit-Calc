'use client';

import React from 'react';

interface AIAssistantIconProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  pulse?: boolean;
  showSparkles?: boolean;
}

export function AIAssistantIcon({
  className = '',
  size = 'md',
  pulse = false,
  showSparkles = true,
}: AIAssistantIconProps) {
  const sizeClasses = {
    xs: 'w-5 h-5',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${sizeClasses[size]} ${className}`}>
      {pulse && (
        <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 opacity-60 blur-sm animate-pulse" />
      )}
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible transition-transform duration-200"
      >
        <defs>
          <linearGradient id="aiIconGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="aiGlassGrad" x1="0" y1="0" x2="0" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="sparkleStarGrad" x1="0" y1="0" x2="14" y2="14" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="eyeGlowGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* Squircle Background Badge */}
        <rect width="44" height="44" rx="14" fill="url(#aiIconGrad)" />
        <rect width="44" height="44" rx="14" fill="url(#aiGlassGrad)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />

        {/* Robot / AI Head Structure */}
        <rect x="11" y="15" width="22" height="17" rx="7" fill="white" fillOpacity="0.95" />
        
        {/* Dark Visor Screen */}
        <rect x="13.5" y="17.5" width="17" height="10.5" rx="5" fill="#0F172A" />

        {/* Glowing Sensor Eyes */}
        <circle cx="18" cy="22.5" r="2.2" fill="url(#eyeGlowGrad)" />
        <circle cx="26" cy="22.5" r="2.2" fill="url(#eyeGlowGrad)" />
        <circle cx="18.8" cy="21.7" r="0.7" fill="white" />
        <circle cx="26.8" cy="21.7" r="0.7" fill="white" />

        {/* Cute AI Smile Line */}
        <path d="M20 25 Q22 26.5 24 25" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* Antenna with Glowing Node */}
        <path d="M22 15 V10" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="22" cy="8.5" r="3" fill="url(#sparkleStarGrad)" stroke="white" strokeWidth="1.2" />

        {/* Top-Right Sparkle AI Star */}
        {showSparkles && (
          <path
            d="M34 4 L35.3 8.3 L39.5 9.5 L35.3 10.7 L34 15 L32.7 10.7 L28.5 9.5 L32.7 8.3 Z"
            fill="url(#sparkleStarGrad)"
            stroke="white"
            strokeWidth="0.5"
            className="animate-pulse"
          />
        )}

        {/* Base Neck Joint */}
        <path d="M17 32 H27 V34 C27 35.1 26.1 36 25 36 H19 C17.9 36 17 35.1 17 34 V32 Z" fill="white" fillOpacity="0.85" />
      </svg>
    </div>
  );
}
