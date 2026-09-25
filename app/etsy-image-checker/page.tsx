import type { Metadata } from 'next';
import { EtsyImageChecker } from '@/components/image-checker/EtsyImageChecker';

export const metadata: Metadata = {
  title: 'Etsy Image Size Checker — Check Listing Image Dimensions, Format & Compatibility',
  description:
    'Free Etsy listing image checker. Instantly analyze image dimensions, file size, format, aspect ratio, and technical compatibility — privately in your browser. No uploads.',
  keywords: [
    'Etsy image size checker',
    'Etsy listing image dimensions',
    'Etsy image format checker',
    'Etsy product photo size',
    'Etsy image aspect ratio',
    'Etsy listing photo analyzer',
  ],
  authors: [{ name: 'Abdullah Saqib' }],
};

export default function EtsyImageCheckerPage() {
  return (
    <main>
      <EtsyImageChecker />
    </main>
  );
}
