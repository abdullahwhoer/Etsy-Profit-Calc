// ─── IndexedDB Wrapper for Keyword Vault ────────────────────────────────────
// Database: etsyKeywordVault
// Store: vault (single record keyed as 'main')

import type { EncryptedVault } from './types';

const DB_NAME = 'etsyKeywordVault';
const DB_VERSION = 1;
const STORE = 'vault';
const KEY = 'main';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function hasVault(): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readonly');
      const store = tx.objectStore(STORE);
      const r = store.get(KEY);
      r.onsuccess = () => resolve(r.result != null);
      r.onerror = () => resolve(false);
      tx.oncomplete = () => db.close();
    });
  } catch {
    return false;
  }
}

export async function loadVault(): Promise<EncryptedVault | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const r = store.get(KEY);
    r.onsuccess = () => resolve(r.result ?? null);
    r.onerror = () => reject(r.error);
    tx.oncomplete = () => db.close();
  });
}

export async function saveVault(vault: EncryptedVault): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    store.put(vault, KEY);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteVaultDB(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    store.delete(KEY);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => reject(tx.error);
  });
}
