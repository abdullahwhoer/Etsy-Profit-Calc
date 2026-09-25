// ─── Keyword Vault Types ────────────────────────────────────────────────────

export interface Niche {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Keyword {
  id: string;
  nicheId: string;
  keyword: string;
  normalizedKeyword: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VaultSettings {
  autoLockMinutes: number; // 0 = never
}

export interface VaultData {
  niches: Niche[];
  keywords: Keyword[];
  settings: VaultSettings;
}

export interface EncryptedVault {
  salt: string;   // base64
  iv: string;     // base64
  data: string;   // base64 AES-GCM ciphertext
}

export interface BackupFile {
  format: 'etsy-keyword-vault-backup';
  version: number;
  timestamp: string;
  vault: EncryptedVault;
}

export const DEFAULT_VAULT_DATA: VaultData = {
  niches: [],
  keywords: [],
  settings: { autoLockMinutes: 15 },
};

export const NICHE_COLORS = [
  '#f97316', '#ef4444', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b',
  '#6366f1', '#d946ef',
];

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function normalizeKw(kw: string): string {
  return kw.trim().toLowerCase().replace(/\s+/g, ' ');
}
