import type { Metadata } from 'next';
import { EtsyKeywordSaver } from '@/components/keyword-saver/EtsyKeywordSaver';

export const metadata: Metadata = {
  title: 'Etsy Keyword Saver — Private Keyword Organizer',
  description:
    'Save and organize your Etsy keyword research by niche with a private, browser-based keyword vault. No signup, no uploads — your keywords stay on your device.',
  keywords: [
    'Etsy keyword saver',
    'Etsy keyword organizer',
    'Etsy keyword research tool',
    'Etsy niche keywords',
    'private keyword manager',
    'browser keyword vault',
  ],
  authors: [{ name: 'Abdullah Saqib' }],
};

export default function EtsyKeywordSaverPage() {
  return (
    <main>
      <EtsyKeywordSaver />
    </main>
  );
}
