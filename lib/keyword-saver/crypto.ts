// ─── Web Crypto Utilities for Keyword Vault ─────────────────────────────────
// Uses PBKDF2 for key derivation and AES-GCM for authenticated encryption.
// All operations run entirely in the browser.

const PBKDF2_ITERATIONS = 100_000;

// ── Base64 helpers ──

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer as ArrayBuffer;
}

export function base64ToUint8Array(b64: string): Uint8Array {
  return new Uint8Array(base64ToArrayBuffer(b64));
}

// ── Key derivation ──

export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16));
}

export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as unknown as BufferSource, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

// ── Encryption ──

export async function encryptData(
  plaintext: string,
  key: CryptoKey,
): Promise<{ iv: string; ciphertext: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as unknown as BufferSource },
    key,
    new TextEncoder().encode(plaintext),
  );
  return {
    iv: arrayBufferToBase64(iv.buffer as ArrayBuffer),
    ciphertext: arrayBufferToBase64(encrypted),
  };
}

// ── Decryption ──

export async function decryptData(
  ciphertext: string,
  key: CryptoKey,
  iv: string,
): Promise<string> {
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToUint8Array(iv) as unknown as BufferSource },
    key,
    base64ToArrayBuffer(ciphertext),
  );
  return new TextDecoder().decode(decrypted);
}
