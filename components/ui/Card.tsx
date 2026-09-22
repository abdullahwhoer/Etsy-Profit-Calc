import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlight' | 'flat' | 'glass';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-200',
        variant === 'default' &&
          'bg-white border-slate-200/80 shadow-sm shadow-slate-100/50 hover:border-slate-300',
        variant === 'highlight' &&
          'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white border-slate-800 shadow-xl shadow-slate-950/20',
        variant === 'glass' &&
          'bg-white/80 backdrop-blur-md border-slate-200/60 shadow-md',
        variant === 'flat' && 'bg-slate-50/70 border-slate-200/70',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-5 sm:p-6 pb-3 sm:pb-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'text-base sm:text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs sm:text-sm text-slate-500', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5 sm:p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center p-5 sm:p-6 pt-0 border-t border-slate-100', className)}
      {...props}
    >
      {children}
    </div>
  );
}
