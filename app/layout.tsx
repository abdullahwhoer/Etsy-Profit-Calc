import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Etsy Profit Calculator — Real Net Profit, Fees & Margins',
  description:
    'Calculate your real profit after Etsy fees, discounts, advertising, shipping, and product costs with our modern, real-time Etsy fee calculator.',
  keywords: [
    'Etsy fee calculator',
    'Etsy profit calculator',
    'Etsy pricing tool',
    'Etsy seller calculator',
    'Etsy margin calculator',
    'Etsy offsite ads calculator',
  ],
  authors: [{ name: 'Etsy Seller Tools' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

