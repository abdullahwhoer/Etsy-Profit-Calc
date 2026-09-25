'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Lock, Unlock, Plus, Search, Star, Trash2, Copy, Edit3, Download, Upload,
  FolderOpen, LayoutDashboard, Settings, ChevronLeft, ChevronDown, ChevronUp,
  X, Check, AlertTriangle, Shield, Sun, Moon, Calculator, FileImage, Clock,
  Key, Eye, EyeOff, Archive, RotateCcw, FileText, MoreHorizontal, Heart,
  LogOut, Database, Filter, ArrowDownAZ, ArrowUpAZ
} from 'lucide-react';
import { CalculatorLogo } from '@/components/ui/CalculatorLogo';
import {
  deriveKey, encryptData, decryptData, generateSalt,
  arrayBufferToBase64, base64ToUint8Array,
} from '@/lib/keyword-saver/crypto';
import { hasVault, loadVault, saveVault, deleteVaultDB } from '@/lib/keyword-saver/db';
import {
  type VaultData, type Niche, type Keyword, type EncryptedVault, type BackupFile,
  DEFAULT_VAULT_DATA, NICHE_COLORS, generateId, normalizeKw,
} from '@/lib/keyword-saver/types';

// ─── Tiny Helpers ───────────────────────────────────────────────────────────

function toast(msg: string) {
  // Simple toast via state — handled inline
  return msg;
}

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── FAQ Item ───────────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 dark:border-zinc-800 last:border-0">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-3 py-4 text-left cursor-pointer group" aria-expanded={open}>
        <span className="text-sm font-semibold text-slate-800 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
      </button>
      {open && <div className="pb-4 pr-6 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{a}</div>}
    </div>
  );
}

// ─── Modal Shell ────────────────────────────────────────────────────────────

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto card-shadow" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-zinc-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 cursor-pointer transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

type AppState = 'loading' | 'setup' | 'locked' | 'unlocked';
type View = 'dashboard' | 'niche' | 'favorites' | 'all-keywords' | 'settings';
type SortMode = 'default' | 'az' | 'za' | 'recent' | 'favorites';

export function EtsyKeywordSaver() {
  // ── Core state ──
  const [appState, setAppState] = useState<AppState>('loading');
  const [view, setView] = useState<View>('dashboard');
  const [data, setData] = useState<VaultData>(DEFAULT_VAULT_DATA);
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);
  const [vaultSalt, setVaultSalt] = useState<string | null>(null);
  const [selectedNicheId, setSelectedNicheId] = useState<string | null>(null);

  // ── UI state ──
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [toastMsg, setToastMsg] = useState('');
  const [mobileNav, setMobileNav] = useState(false);

  // ── Modal states ──
  const [showCreateNiche, setShowCreateNiche] = useState(false);
  const [showEditNiche, setShowEditNiche] = useState<Niche | null>(null);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showDeleteVault, setShowDeleteVault] = useState(false);
  const [showBackupRestore, setShowBackupRestore] = useState(false);

  // ── Form state ──
  const [nicheName, setNicheName] = useState('');
  const [nicheDesc, setNicheDesc] = useState('');
  const [nicheColor, setNicheColor] = useState(NICHE_COLORS[0]);
  const [newKw, setNewKw] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [editingKwId, setEditingKwId] = useState<string | null>(null);
  const [editingKwText, setEditingKwText] = useState('');

  // ── Theme ──
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ── Refs ──
  const lastActivity = useRef(Date.now());
  const autoLockTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  // ── Init ──
  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
    (async () => {
      try {
        const exists = await hasVault();
        setAppState(exists ? 'locked' : 'setup');
      } catch {
        setAppState('setup');
      }
    })();
  }, []);

  // ── Auto-lock ──
  useEffect(() => {
    if (appState !== 'unlocked') return;
    const reset = () => { lastActivity.current = Date.now(); };
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, reset));
    autoLockTimer.current = setInterval(() => {
      const mins = data.settings.autoLockMinutes;
      if (!mins) return;
      if ((Date.now() - lastActivity.current) / 60000 >= mins) lockVault();
    }, 30000);
    return () => {
      events.forEach(e => window.removeEventListener(e, reset));
      if (autoLockTimer.current) clearInterval(autoLockTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState, data.settings.autoLockMinutes]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const flash = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  }, []);

  // ════════════════════════════════════════════════════════════════════════════
  // CRYPTO OPERATIONS
  // ════════════════════════════════════════════════════════════════════════════

  const persistVault = useCallback(async (vaultData: VaultData, key: CryptoKey, salt: string) => {
    const json = JSON.stringify(vaultData);
    const { iv, ciphertext } = await encryptData(json, key);
    await saveVault({ salt, iv, data: ciphertext });
  }, []);

  const createVault = useCallback(async () => {
    setPwError('');
    if (pw.length < 4) { setPwError('Password must be at least 4 characters.'); return; }
    if (pw !== pwConfirm) { setPwError('Passwords do not match.'); return; }
    try {
      const salt = generateSalt();
      const saltB64 = arrayBufferToBase64(salt.buffer as ArrayBuffer);
      const key = await deriveKey(pw, salt);
      const initialData = { ...DEFAULT_VAULT_DATA };
      await persistVault(initialData, key, saltB64);
      setCryptoKey(key);
      setVaultSalt(saltB64);
      setData(initialData);
      setPw(''); setPwConfirm('');
      setAppState('unlocked');
    } catch (e) {
      setPwError('Failed to create vault. Please try again.');
    }
  }, [pw, pwConfirm, persistVault]);

  const unlockVault = useCallback(async () => {
    setPwError('');
    if (!pw) { setPwError('Please enter your password.'); return; }
    try {
      const vault = await loadVault();
      if (!vault) { setPwError('No vault found.'); setAppState('setup'); return; }
      const salt = base64ToUint8Array(vault.salt);
      const key = await deriveKey(pw, salt);
      const json = await decryptData(vault.data, key, vault.iv);
      const parsed: VaultData = JSON.parse(json);
      setCryptoKey(key);
      setVaultSalt(vault.salt);
      setData(parsed);
      setPw('');
      setAppState('unlocked');
    } catch {
      setPwError('Incorrect password or corrupted vault.');
    }
  }, [pw]);

  const lockVault = useCallback(() => {
    setData(DEFAULT_VAULT_DATA);
    setCryptoKey(null);
    setVaultSalt(null);
    setView('dashboard');
    setSelectedNicheId(null);
    setSearchQ('');
    setAppState('locked');
  }, []);

  const saveData = useCallback(async (newData: VaultData) => {
    setData(newData);
    if (cryptoKey && vaultSalt) {
      await persistVault(newData, cryptoKey, vaultSalt);
    }
  }, [cryptoKey, vaultSalt, persistVault]);

  // ════════════════════════════════════════════════════════════════════════════
  // DATA OPERATIONS
  // ════════════════════════════════════════════════════════════════════════════

  const addNiche = useCallback(async () => {
    if (!nicheName.trim()) return;
    const now = new Date().toISOString();
    const niche: Niche = { id: generateId(), name: nicheName.trim(), description: nicheDesc.trim(), color: nicheColor, createdAt: now, updatedAt: now };
    const newData = { ...data, niches: [...data.niches, niche] };
    await saveData(newData);
    setNicheName(''); setNicheDesc(''); setNicheColor(NICHE_COLORS[0]);
    setShowCreateNiche(false);
    setSelectedNicheId(niche.id);
    setView('niche');
    flash('Niche created');
  }, [nicheName, nicheDesc, nicheColor, data, saveData, flash]);

  const updateNiche = useCallback(async () => {
    if (!showEditNiche || !nicheName.trim()) return;
    const now = new Date().toISOString();
    const newData = { ...data, niches: data.niches.map(n => n.id === showEditNiche.id ? { ...n, name: nicheName.trim(), description: nicheDesc.trim(), color: nicheColor, updatedAt: now } : n) };
    await saveData(newData);
    setShowEditNiche(null); setNicheName(''); setNicheDesc('');
    flash('Niche updated');
  }, [showEditNiche, nicheName, nicheDesc, nicheColor, data, saveData, flash]);

  const deleteNiche = useCallback(async (id: string) => {
    const newData = { ...data, niches: data.niches.filter(n => n.id !== id), keywords: data.keywords.filter(k => k.nicheId !== id) };
    await saveData(newData);
    if (selectedNicheId === id) { setSelectedNicheId(null); setView('dashboard'); }
    flash('Niche deleted');
  }, [data, selectedNicheId, saveData, flash]);

  const addKeyword = useCallback(async (nicheId: string, kwText: string) => {
    const trimmed = kwText.trim();
    if (!trimmed) return;
    const norm = normalizeKw(trimmed);
    const dup = data.keywords.find(k => k.nicheId === nicheId && k.normalizedKeyword === norm);
    if (dup) { flash('This keyword already exists in this niche.'); return; }
    const now = new Date().toISOString();
    const kw: Keyword = { id: generateId(), nicheId, keyword: trimmed, normalizedKeyword: norm, favorite: false, createdAt: now, updatedAt: now };
    const newData = { ...data, keywords: [...data.keywords, kw], niches: data.niches.map(n => n.id === nicheId ? { ...n, updatedAt: now } : n) };
    await saveData(newData);
    setNewKw('');
    flash('Keyword added');
  }, [data, saveData, flash]);

  const bulkAddKeywords = useCallback(async (nicheId: string) => {
    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
    const existingNorms = new Set(data.keywords.filter(k => k.nicheId === nicheId).map(k => k.normalizedKeyword));
    const now = new Date().toISOString();
    const newKws: Keyword[] = [];
    const seenNorms = new Set<string>();
    for (const line of lines) {
      const norm = normalizeKw(line);
      if (!norm || existingNorms.has(norm) || seenNorms.has(norm)) continue;
      seenNorms.add(norm);
      newKws.push({ id: generateId(), nicheId, keyword: line.trim(), normalizedKeyword: norm, favorite: false, createdAt: now, updatedAt: now });
    }
    if (newKws.length === 0) { flash('No new unique keywords to add.'); return; }
    const newData = { ...data, keywords: [...data.keywords, ...newKws], niches: data.niches.map(n => n.id === nicheId ? { ...n, updatedAt: now } : n) };
    await saveData(newData);
    setBulkText('');
    setShowBulkAdd(false);
    flash(`${newKws.length} keywords added`);
  }, [bulkText, data, saveData, flash]);

  const deleteKeyword = useCallback(async (id: string) => {
    const newData = { ...data, keywords: data.keywords.filter(k => k.id !== id) };
    await saveData(newData);
  }, [data, saveData]);

  const toggleFavorite = useCallback(async (id: string) => {
    const now = new Date().toISOString();
    const newData = { ...data, keywords: data.keywords.map(k => k.id === id ? { ...k, favorite: !k.favorite, updatedAt: now } : k) };
    await saveData(newData);
  }, [data, saveData]);

  const saveEditKeyword = useCallback(async () => {
    if (!editingKwId || !editingKwText.trim()) return;
    const norm = normalizeKw(editingKwText);
    const existing = data.keywords.find(k => k.id === editingKwId);
    if (!existing) return;
    const dup = data.keywords.find(k => k.id !== editingKwId && k.nicheId === existing.nicheId && k.normalizedKeyword === norm);
    if (dup) { flash('This keyword already exists.'); return; }
    const now = new Date().toISOString();
    const newData = { ...data, keywords: data.keywords.map(k => k.id === editingKwId ? { ...k, keyword: editingKwText.trim(), normalizedKeyword: norm, updatedAt: now } : k) };
    await saveData(newData);
    setEditingKwId(null); setEditingKwText('');
  }, [editingKwId, editingKwText, data, saveData, flash]);

  const copyKeyword = useCallback(async (text: string) => {
    try { await navigator.clipboard.writeText(text); flash('Copied!'); } catch { flash('Copy failed'); }
  }, [flash]);

  // ── Import ──
  const handleImportFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedNicheId) return;
    try {
      const text = await file.text();
      let lines: string[] = [];
      if (file.name.endsWith('.csv')) {
        const rows = text.split('\n').slice(1); // skip header
        lines = rows.map(r => r.split(',')[0]?.trim()).filter(Boolean);
      } else {
        lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      }
      setBulkText(lines.join('\n'));
      setShowImport(false);
      setShowBulkAdd(true);
    } catch { flash('Failed to read file.'); }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [selectedNicheId, flash]);

  // ── Export ──
  const exportNiche = useCallback((nicheId: string, format: 'txt' | 'csv' | 'json') => {
    const niche = data.niches.find(n => n.id === nicheId);
    if (!niche) return;
    const kws = data.keywords.filter(k => k.nicheId === nicheId);
    let content = '', mime = 'text/plain', ext = 'txt';
    if (format === 'txt') {
      content = kws.map(k => k.keyword).join('\n');
    } else if (format === 'csv') {
      content = 'keyword,favorite\n' + kws.map(k => `"${k.keyword}",${k.favorite}`).join('\n');
      mime = 'text/csv'; ext = 'csv';
    } else {
      content = JSON.stringify({ niche: niche.name, keywords: kws.map(k => ({ keyword: k.keyword, favorite: k.favorite })) }, null, 2);
      mime = 'application/json'; ext = 'json';
    }
    downloadFile(content, `${niche.name.replace(/\s+/g, '-').toLowerCase()}-keywords.${ext}`, mime);
    flash('Exported');
  }, [data, flash]);

  const exportAll = useCallback((format: 'csv' | 'json') => {
    let content = '', mime = 'text/plain', ext = 'txt';
    if (format === 'csv') {
      content = 'niche,keyword,favorite\n' + data.keywords.map(k => {
        const n = data.niches.find(n => n.id === k.nicheId);
        return `"${n?.name ?? ''}","${k.keyword}",${k.favorite}`;
      }).join('\n');
      mime = 'text/csv'; ext = 'csv';
    } else {
      content = JSON.stringify({ niches: data.niches.map(n => ({ ...n, keywords: data.keywords.filter(k => k.nicheId === n.id).map(k => ({ keyword: k.keyword, favorite: k.favorite })) })) }, null, 2);
      mime = 'application/json'; ext = 'json';
    }
    downloadFile(content, `etsy-keywords-all.${ext}`, mime);
    flash('Exported all');
  }, [data, flash]);

  // ── Backup / Restore ──
  const createBackup = useCallback(async () => {
    const vault = await loadVault();
    if (!vault) return;
    const backup: BackupFile = { format: 'etsy-keyword-vault-backup', version: 1, timestamp: new Date().toISOString(), vault };
    downloadFile(JSON.stringify(backup, null, 2), `etsy-keyword-vault-backup-${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
    flash('Backup created');
  }, [flash]);

  const restoreBackup = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed: BackupFile = JSON.parse(text);
      if (parsed.format !== 'etsy-keyword-vault-backup' || !parsed.vault) throw new Error('Invalid');
      await saveVault(parsed.vault);
      flash('Backup restored. Please unlock with the original password.');
      lockVault();
    } catch {
      flash('Invalid or corrupted backup file.');
    }
    if (backupInputRef.current) backupInputRef.current.value = '';
  }, [flash, lockVault]);

  // ── Delete Vault ──
  const nukeVault = useCallback(async () => {
    if (deleteConfirm !== 'DELETE') return;
    await deleteVaultDB();
    setData(DEFAULT_VAULT_DATA);
    setCryptoKey(null);
    setVaultSalt(null);
    setDeleteConfirm('');
    setShowDeleteVault(false);
    setAppState('setup');
    flash('Vault deleted');
  }, [deleteConfirm, flash]);

  // ── Settings ──
  const setAutoLock = useCallback(async (mins: number) => {
    const newData = { ...data, settings: { ...data.settings, autoLockMinutes: mins } };
    await saveData(newData);
  }, [data, saveData]);

  // ════════════════════════════════════════════════════════════════════════════
  // COMPUTED
  // ════════════════════════════════════════════════════════════════════════════

  const selectedNiche = data.niches.find(n => n.id === selectedNicheId) ?? null;

  const filteredKeywords = useMemo(() => {
    let kws: Keyword[] = [];
    if (view === 'niche' && selectedNicheId) {
      kws = data.keywords.filter(k => k.nicheId === selectedNicheId);
    } else if (view === 'favorites') {
      kws = data.keywords.filter(k => k.favorite);
    } else if (view === 'all-keywords') {
      kws = [...data.keywords];
    } else {
      return [];
    }
    // Search
    if (searchQ) {
      const q = searchQ.toLowerCase();
      kws = kws.filter(k => k.keyword.toLowerCase().includes(q));
    }
    // Sort
    if (sortMode === 'az') kws.sort((a, b) => a.keyword.localeCompare(b.keyword));
    else if (sortMode === 'za') kws.sort((a, b) => b.keyword.localeCompare(a.keyword));
    else if (sortMode === 'recent') kws.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (sortMode === 'favorites') kws = [...kws.filter(k => k.favorite), ...kws.filter(k => !k.favorite)];
    return kws;
  }, [data.keywords, view, selectedNicheId, searchQ, sortMode]);

  const stats = useMemo(() => ({
    niches: data.niches.length,
    keywords: data.keywords.length,
    favorites: data.keywords.filter(k => k.favorite).length,
    lastUpdated: data.keywords.length > 0 ? timeAgo(data.keywords.reduce((a, b) => a.updatedAt > b.updatedAt ? a : b).updatedAt) : data.niches.length > 0 ? timeAgo(data.niches.reduce((a, b) => a.updatedAt > b.updatedAt ? a : b).updatedAt) : 'Never',
  }), [data]);

  const bulkParsed = useMemo(() => {
    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
    return lines;
  }, [bulkText]);

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER HELPERS
  // ════════════════════════════════════════════════════════════════════════════

  const openEditNiche = (n: Niche) => { setNicheName(n.name); setNicheDesc(n.description); setNicheColor(n.color); setShowEditNiche(n); };
  const openCreateNiche = () => { setNicheName(''); setNicheDesc(''); setNicheColor(NICHE_COLORS[Math.floor(Math.random() * NICHE_COLORS.length)]); setShowCreateNiche(true); };

  // Nav items
  const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'favorites', label: 'Favorites', icon: <Star className="w-4 h-4" /> },
    { id: 'all-keywords', label: 'All Keywords', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-400/15 dark:bg-orange-600/10 rounded-full blur-3xl" />
        <div className="absolute -top-20 right-20 w-80 h-80 bg-amber-400/15 dark:bg-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-72 h-72 bg-orange-300/15 dark:bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-semibold shadow-xl animate-in slide-in-from-top-2 duration-200">
          {toastMsg}
        </div>
      )}

      {/* ── HEADER ── */}
      <header className="glass border-b border-orange-100/60 dark:border-zinc-800/80 sticky top-0 z-30 shadow-xs transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
            <CalculatorLogo size="responsive" />
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-base md:text-xl font-bold tracking-tight text-slate-900 dark:text-white font-[Plus_Jakarta_Sans,sans-serif] leading-tight truncate">Etsy Keyword Saver</h1>
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-zinc-400 truncate">Made by <span className="font-semibold text-slate-700 dark:text-zinc-200">Abdullah Saqib</span></p>
            </div>
          </div>
          <nav className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <a href="/" className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/80 dark:hover:bg-zinc-800/80 rounded-xl transition-all cursor-pointer"><Calculator className="h-4 w-4" /><span className="hidden sm:inline">Calculator</span></a>
            <a href="/etsy-image-checker" className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/80 dark:hover:bg-zinc-800/80 rounded-xl transition-all cursor-pointer"><FileImage className="h-4 w-4" /><span>Image Checker</span></a>
            {appState === 'unlocked' && (
              <button type="button" onClick={lockVault} className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 bg-white/90 dark:bg-zinc-800/90 border border-slate-200 dark:border-zinc-700/80 rounded-xl transition-all cursor-pointer shadow-xs hover:border-orange-300 dark:hover:border-orange-600"><Lock className="h-4 w-4" /><span className="hidden sm:inline">Lock</span></button>
            )}
            <button type="button" onClick={toggleDark} className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 bg-white/90 dark:bg-zinc-800/90 border border-slate-200 dark:border-zinc-700/80 rounded-xl transition-all cursor-pointer shadow-xs" aria-label="Toggle dark mode">
              {mounted && isDark ? <Sun className="h-4 w-4 text-amber-400 fill-amber-400" /> : <Moon className="h-4 w-4 text-slate-500" />}
            </button>
          </nav>
        </div>
      </header>

      {/* ════════════════════ LOADING ════════════════════ */}
      {appState === 'loading' && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-3 border-orange-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* ════════════════════ SETUP ════════════════════ */}
      {appState === 'setup' && (
        <main className="max-w-md mx-auto px-4 pt-12 sm:pt-20 pb-20">
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-zinc-800 card-shadow overflow-hidden">
            <div className="p-6 sm:p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center"><Key className="h-8 w-8 text-orange-500" /></div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Your Private Keyword Vault</h2>
              <p className="text-sm text-slate-600 dark:text-zinc-400">Create a password to protect your saved keywords on this device.</p>
              <div className="space-y-3 text-left">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Password</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} className="w-full px-3 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white input-field" placeholder="Min 4 characters" onKeyDown={e => e.key === 'Enter' && document.getElementById('pw-confirm')?.focus()} />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Confirm Password</label>
                  <input id="pw-confirm" type={showPw ? 'text' : 'password'} value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white input-field" placeholder="Repeat password" onKeyDown={e => e.key === 'Enter' && createVault()} />
                </div>
                {pwError && <p className="text-xs text-rose-500 font-semibold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{pwError}</p>}
                <button type="button" onClick={createVault} className="w-full py-2.5 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white text-sm font-bold shadow-md shadow-orange-500/25 cursor-pointer hover:shadow-lg transition-all">Create Vault</button>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-500 pt-2"><Shield className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /><span>Your keyword data is stored locally in this browser and is not uploaded to our servers.</span></div>
            </div>
          </div>
        </main>
      )}

      {/* ════════════════════ LOCKED ════════════════════ */}
      {appState === 'locked' && (
        <main className="max-w-md mx-auto px-4 pt-12 sm:pt-20 pb-20">
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-zinc-800 card-shadow overflow-hidden">
            <div className="p-6 sm:p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center"><Lock className="h-8 w-8 text-orange-500" /></div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Unlock Your Keyword Vault</h2>
              <p className="text-sm text-slate-600 dark:text-zinc-400">Enter your password to access your saved keywords.</p>
              <div className="space-y-3 text-left">
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} className="w-full px-3 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white input-field" placeholder="Enter password" onKeyDown={e => e.key === 'Enter' && unlockVault()} autoFocus />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
                {pwError && <p className="text-xs text-rose-500 font-semibold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{pwError}</p>}
                <button type="button" onClick={unlockVault} className="w-full py-2.5 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white text-sm font-bold shadow-md shadow-orange-500/25 cursor-pointer hover:shadow-lg transition-all"><Unlock className="w-4 h-4 inline mr-1.5" />Unlock Vault</button>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-500 pt-2"><Shield className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /><span>Your keyword data is stored locally in this browser and is not uploaded to our servers.</span></div>
            </div>
          </div>
        </main>
      )}

      {/* ════════════════════ UNLOCKED ════════════════════ */}
      {appState === 'unlocked' && (
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:flex flex-col w-56 border-r border-slate-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm p-3 gap-1 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <button type="button" onClick={openCreateNiche} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 shadow-md shadow-orange-500/25 cursor-pointer hover:shadow-lg transition-all mb-2"><Plus className="w-4 h-4" />New Niche</button>
            {navItems.map(item => (
              <button key={item.id} type="button" onClick={() => { setView(item.id); setSelectedNicheId(null); setSearchQ(''); setSortMode('default'); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${view === item.id && !selectedNicheId ? 'bg-orange-100/80 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-white'}`}>{item.icon}{item.label}{item.id === 'favorites' && stats.favorites > 0 && <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500 text-white font-bold">{stats.favorites}</span>}</button>
            ))}
            <div className="border-t border-slate-100 dark:border-zinc-800 mt-2 pt-2">
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-600">Niches</p>
              {data.niches.map(n => (
                <button key={n.id} type="button" onClick={() => { setSelectedNicheId(n.id); setView('niche'); setSearchQ(''); setSortMode('default'); }} className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold truncate transition-all cursor-pointer ${selectedNicheId === n.id ? 'bg-orange-100/80 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/60'}`}>
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: n.color }} />
                  <span className="truncate">{n.name}</span>
                  <span className="ml-auto text-[10px] text-slate-400 dark:text-zinc-500">{data.keywords.filter(k => k.nicheId === n.id).length}</span>
                </button>
              ))}
            </div>
            <div className="mt-auto pt-3 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 px-3 text-[11px] text-slate-500 dark:text-zinc-500"><Shield className="w-3 h-3 text-emerald-500" /><span>Private & Local</span></div>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <main className="flex-1 max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 w-full pb-24 lg:pb-6">

            {/* ──────── DASHBOARD ──────── */}
            {view === 'dashboard' && !selectedNicheId && (
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">My Keyword Vault</h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">Organize your Etsy keywords by niche and keep your research in one place.</p>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Niches', value: stats.niches, icon: <FolderOpen className="w-4 h-4 text-orange-500" /> },
                    { label: 'Keywords', value: stats.keywords, icon: <FileText className="w-4 h-4 text-sky-500" /> },
                    { label: 'Favorites', value: stats.favorites, icon: <Star className="w-4 h-4 text-amber-500" /> },
                    { label: 'Last Updated', value: stats.lastUpdated, icon: <Clock className="w-4 h-4 text-violet-500" /> },
                  ].map(s => (
                    <div key={s.label} className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-xl border border-slate-200/80 dark:border-zinc-800 p-3 sm:p-4 card-shadow">
                      <div className="flex items-center gap-2 mb-1">{s.icon}<span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">{s.label}</span></div>
                      <p className="text-lg sm:text-xl font-bold text-slate-800 dark:text-zinc-100 font-mono">{s.value}</p>
                    </div>
                  ))}
                </div>
                {/* Niche cards */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Your Niches</h3>
                  <button type="button" onClick={openCreateNiche} className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-sm cursor-pointer"><Plus className="w-3.5 h-3.5" />New Niche</button>
                </div>
                {data.niches.length === 0 ? (
                  <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-8 sm:p-12 text-center card-shadow">
                    <FolderOpen className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-800 dark:text-zinc-100">No niches yet</h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 mb-4">Create your first niche to start organizing your Etsy keyword research.</p>
                    <button type="button" onClick={openCreateNiche} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white text-sm font-bold shadow-md shadow-orange-500/25 cursor-pointer"><Plus className="w-4 h-4" />Create Niche</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {data.niches.map(n => {
                      const kwCount = data.keywords.filter(k => k.nicheId === n.id).length;
                      return (
                        <div key={n.id} className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-xl border border-slate-200/80 dark:border-zinc-800 card-shadow overflow-hidden group hover:border-orange-300 dark:hover:border-orange-700 transition-all">
                          <div className="h-1.5" style={{ background: n.color }} />
                          <div className="p-4">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100 truncate">{n.name}</h4>
                            {n.description && <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 truncate">{n.description}</p>}
                            <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 dark:text-zinc-500">
                              <span className="font-semibold">{kwCount} keywords</span>
                              <span>Updated {formatDate(n.updatedAt)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-3">
                              <button type="button" onClick={() => { setSelectedNicheId(n.id); setView('niche'); setSearchQ(''); }} className="flex-1 py-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg cursor-pointer hover:shadow transition-all text-center">Open</button>
                              <button type="button" onClick={() => openEditNiche(n)} className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all"><Edit3 className="w-3 h-3" /></button>
                              <button type="button" onClick={() => { if (confirm(`Delete "${n.name}" and all its keywords?`)) deleteNiche(n.id); }} className="px-2.5 py-1.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 rounded-lg cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-all"><Trash2 className="w-3 h-3" /></button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ──────── NICHE DETAIL ──────── */}
            {view === 'niche' && selectedNiche && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <button type="button" onClick={() => { setView('dashboard'); setSelectedNicheId(null); }} className="mt-1 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 cursor-pointer transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: selectedNiche.color }} />
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">{selectedNiche.name}</h2>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{data.keywords.filter(k => k.nicheId === selectedNiche.id).length} keywords</p>
                  </div>
                </div>

                {/* Actions bar */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex-1 min-w-0 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search keywords..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white input-field" />
                  </div>
                  <button type="button" onClick={() => setShowBulkAdd(true)} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl cursor-pointer hover:border-orange-300 dark:hover:border-orange-600 transition-all shadow-xs"><Upload className="w-3.5 h-3.5" /><span className="hidden sm:inline">Bulk Add</span></button>
                  <button type="button" onClick={() => setShowImport(true)} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl cursor-pointer hover:border-orange-300 dark:hover:border-orange-600 transition-all shadow-xs"><Download className="w-3.5 h-3.5" /><span className="hidden sm:inline">Import</span></button>
                  <div className="relative group">
                    <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl cursor-pointer hover:border-orange-300 dark:hover:border-orange-600 transition-all shadow-xs"><Archive className="w-3.5 h-3.5" /><span className="hidden sm:inline">Export</span></button>
                    <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-20">
                      <div className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl shadow-xl p-1 min-w-[100px]">
                        {(['txt', 'csv', 'json'] as const).map(f => (
                          <button key={f} type="button" onClick={() => exportNiche(selectedNiche.id, f)} className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-lg cursor-pointer">{f.toUpperCase()}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sort pills */}
                <div className="flex flex-wrap gap-1.5">
                  {([['default', 'All'], ['favorites', 'Favorites'], ['recent', 'Recent'], ['az', 'A–Z'], ['za', 'Z–A']] as [SortMode, string][]).map(([key, label]) => (
                    <button key={key} type="button" onClick={() => setSortMode(key)} className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg cursor-pointer transition-all ${sortMode === key ? 'bg-orange-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'}`}>{label}</button>
                  ))}
                </div>

                {/* Add keyword */}
                <div className="flex gap-2">
                  <input type="text" value={newKw} onChange={e => setNewKw(e.target.value)} placeholder="Enter keyword" className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white input-field" onKeyDown={e => { if (e.key === 'Enter') addKeyword(selectedNiche.id, newKw); }} />
                  <button type="button" onClick={() => addKeyword(selectedNiche.id, newKw)} className="px-4 py-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white text-sm font-bold cursor-pointer shadow-sm hover:shadow-md transition-all"><Plus className="w-4 h-4" /></button>
                </div>

                {/* Keywords list */}
                {filteredKeywords.length === 0 ? (
                  <div className="bg-white/90 dark:bg-zinc-900/90 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-8 text-center card-shadow">
                    <FileText className="w-10 h-10 text-slate-300 dark:text-zinc-600 mx-auto mb-2" />
                    <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">{searchQ ? 'No matching keywords' : 'No keywords yet'}</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{searchQ ? 'Try a different search term.' : 'Add your first keyword or paste a keyword list.'}</p>
                    {!searchQ && (
                      <div className="flex items-center justify-center gap-2 mt-3">
                        <button type="button" onClick={() => document.querySelector<HTMLInputElement>('input[placeholder="Enter keyword"]')?.focus()} className="px-3 py-1.5 text-xs font-bold text-white bg-orange-500 rounded-lg cursor-pointer">Add Keyword</button>
                        <button type="button" onClick={() => setShowBulkAdd(true)} className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-zinc-200 bg-slate-100 dark:bg-zinc-800 rounded-lg cursor-pointer">Bulk Add</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/90 dark:bg-zinc-900/90 rounded-2xl border border-slate-200/80 dark:border-zinc-800 card-shadow overflow-hidden">
                    {/* Desktop table header */}
                    <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-slate-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      <div className="col-span-7">Keyword</div>
                      <div className="col-span-2 text-center">Favorite</div>
                      <div className="col-span-3 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-slate-100/80 dark:divide-zinc-800/80">
                      {filteredKeywords.map(kw => {
                        const isEditing = editingKwId === kw.id;
                        const nicheName = data.niches.find(n => n.id === kw.nicheId)?.name;
                        return (
                          <div key={kw.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 px-4 py-2.5 items-center hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                            <div className="sm:col-span-7 min-w-0">
                              {isEditing ? (
                                <div className="flex items-center gap-1.5">
                                  <input type="text" value={editingKwText} onChange={e => setEditingKwText(e.target.value)} className="flex-1 px-2 py-1 rounded-lg border border-orange-300 dark:border-orange-600 bg-white dark:bg-zinc-800 text-sm input-field" autoFocus onKeyDown={e => { if (e.key === 'Enter') saveEditKeyword(); if (e.key === 'Escape') setEditingKwId(null); }} />
                                  <button type="button" onClick={saveEditKeyword} className="p-1 text-emerald-500 cursor-pointer"><Check className="w-4 h-4" /></button>
                                  <button type="button" onClick={() => setEditingKwId(null)} className="p-1 text-slate-400 cursor-pointer"><X className="w-4 h-4" /></button>
                                </div>
                              ) : (
                                <div>
                                  <span className="text-sm text-slate-800 dark:text-zinc-100 font-medium">{kw.keyword}</span>
                                  {(selectedNicheId === 'favorites' || selectedNicheId === 'all-keywords') && nicheName && <span className="text-[10px] text-slate-400 dark:text-zinc-500 ml-2">in {nicheName}</span>}
                                </div>
                              )}
                            </div>
                            <div className="sm:col-span-2 flex sm:justify-center">
                              <button type="button" onClick={() => toggleFavorite(kw.id)} className={`p-1 cursor-pointer transition-colors ${kw.favorite ? 'text-amber-400' : 'text-slate-300 dark:text-zinc-600 hover:text-amber-400'}`} aria-label="Toggle favorite"><Star className="w-4 h-4" fill={kw.favorite ? 'currentColor' : 'none'} /></button>
                            </div>
                            <div className="sm:col-span-3 flex items-center justify-end gap-1">
                              <button type="button" onClick={() => copyKeyword(kw.keyword)} className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-500 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/30 cursor-pointer transition-all" title="Copy"><Copy className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => { setEditingKwId(kw.id); setEditingKwText(kw.keyword); }} className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30 cursor-pointer transition-all" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => deleteKeyword(kw.id)} className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer transition-all" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ──────── FAVORITES ──────── */}
            {view === 'favorites' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Favorite Keywords</h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{stats.favorites} favorited keywords across all niches</p>
                </div>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search favorites..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white input-field" />
                </div>
                {filteredKeywords.length === 0 ? (
                  <div className="bg-white/90 dark:bg-zinc-900/90 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-8 text-center card-shadow">
                    <Star className="w-10 h-10 text-slate-300 dark:text-zinc-600 mx-auto mb-2" />
                    <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">No favorites yet</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Star keywords to add them to your favorites.</p>
                  </div>
                ) : (
                  <div className="bg-white/90 dark:bg-zinc-900/90 rounded-2xl border border-slate-200/80 dark:border-zinc-800 card-shadow overflow-hidden">
                    <div className="divide-y divide-slate-100/80 dark:divide-zinc-800/80">
                      {filteredKeywords.map(kw => {
                        const nicheName = data.niches.find(n => n.id === kw.nicheId)?.name;
                        return (
                          <div key={kw.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                            <button type="button" onClick={() => toggleFavorite(kw.id)} className="text-amber-400 cursor-pointer"><Star className="w-4 h-4" fill="currentColor" /></button>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-slate-800 dark:text-zinc-100 font-medium">{kw.keyword}</span>
                              {nicheName && <span className="text-[10px] text-slate-400 dark:text-zinc-500 ml-2">in {nicheName}</span>}
                            </div>
                            <button type="button" onClick={() => copyKeyword(kw.keyword)} className="p-1.5 text-slate-400 hover:text-sky-500 cursor-pointer"><Copy className="w-3.5 h-3.5" /></button>
                            <button type="button" onClick={() => deleteKeyword(kw.id)} className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ──────── ALL KEYWORDS ──────── */}
            {view === 'all-keywords' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">All Keywords</h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{stats.keywords} keywords across {stats.niches} niches</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search all keywords..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white input-field" />
                  </div>
                  <div className="relative group">
                    <button type="button" className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl cursor-pointer shadow-xs"><Archive className="w-3.5 h-3.5" /></button>
                    <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-20">
                      <div className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl shadow-xl p-1 min-w-[100px]">
                        <button type="button" onClick={() => exportAll('csv')} className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-lg cursor-pointer">CSV</button>
                        <button type="button" onClick={() => exportAll('json')} className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-lg cursor-pointer">JSON</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {([['default', 'All'], ['favorites', 'Favorites'], ['recent', 'Recent'], ['az', 'A–Z'], ['za', 'Z–A']] as [SortMode, string][]).map(([key, label]) => (
                    <button key={key} type="button" onClick={() => setSortMode(key)} className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg cursor-pointer transition-all ${sortMode === key ? 'bg-orange-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'}`}>{label}</button>
                  ))}
                </div>
                {filteredKeywords.length === 0 ? (
                  <div className="bg-white/90 dark:bg-zinc-900/90 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-8 text-center card-shadow">
                    <FileText className="w-10 h-10 text-slate-300 dark:text-zinc-600 mx-auto mb-2" />
                    <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">{searchQ ? 'No matching keywords' : 'No keywords yet'}</h3>
                  </div>
                ) : (
                  <div className="bg-white/90 dark:bg-zinc-900/90 rounded-2xl border border-slate-200/80 dark:border-zinc-800 card-shadow overflow-hidden">
                    <div className="divide-y divide-slate-100/80 dark:divide-zinc-800/80">
                      {filteredKeywords.map(kw => {
                        const nicheName = data.niches.find(n => n.id === kw.nicheId)?.name;
                        return (
                          <div key={kw.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                            <button type="button" onClick={() => toggleFavorite(kw.id)} className={`cursor-pointer ${kw.favorite ? 'text-amber-400' : 'text-slate-300 dark:text-zinc-600 hover:text-amber-400'}`}><Star className="w-4 h-4" fill={kw.favorite ? 'currentColor' : 'none'} /></button>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-slate-800 dark:text-zinc-100 font-medium">{kw.keyword}</span>
                              {nicheName && <span className="text-[10px] text-slate-400 dark:text-zinc-500 ml-2">{nicheName}</span>}
                            </div>
                            <button type="button" onClick={() => copyKeyword(kw.keyword)} className="p-1.5 text-slate-400 hover:text-sky-500 cursor-pointer"><Copy className="w-3.5 h-3.5" /></button>
                            <button type="button" onClick={() => deleteKeyword(kw.id)} className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ──────── SETTINGS ──────── */}
            {view === 'settings' && (
              <div className="space-y-5 max-w-2xl">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h2>

                {/* Auto-lock */}
                <div className="bg-white/90 dark:bg-zinc-900/90 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-5 card-shadow">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-orange-500" />Auto-lock after inactivity</h3>
                  <div className="flex flex-wrap gap-2">
                    {[{ v: 0, l: 'Never' }, { v: 5, l: '5 min' }, { v: 15, l: '15 min' }, { v: 30, l: '30 min' }, { v: 60, l: '1 hour' }].map(opt => (
                      <button key={opt.v} type="button" onClick={() => setAutoLock(opt.v)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${data.settings.autoLockMinutes === opt.v ? 'bg-orange-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'}`}>{opt.l}</button>
                    ))}
                  </div>
                </div>

                {/* Backup */}
                <div className="bg-white/90 dark:bg-zinc-900/90 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-5 card-shadow">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 mb-2 flex items-center gap-2"><Archive className="w-4 h-4 text-sky-500" />Backup Your Keyword Vault</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">Because your keywords are stored locally on this device, create a backup if you want to move them to another device or browser.</p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={createBackup} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl cursor-pointer shadow-sm"><Download className="w-3.5 h-3.5" />Export Backup</button>
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl cursor-pointer shadow-xs hover:border-orange-300 dark:hover:border-orange-600 transition-all">
                      <RotateCcw className="w-3.5 h-3.5" />Restore Backup
                      <input ref={backupInputRef} type="file" accept=".json" className="hidden" onChange={restoreBackup} />
                    </label>
                  </div>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-3 flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />Restoring a backup replaces your current vault. You will need the original password to unlock the restored vault.</p>
                </div>

                {/* Export all */}
                <div className="bg-white/90 dark:bg-zinc-900/90 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-5 card-shadow">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 mb-3 flex items-center gap-2"><Download className="w-4 h-4 text-violet-500" />Export All Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => exportAll('csv')} className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 bg-slate-100 dark:bg-zinc-800 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-700">CSV</button>
                    <button type="button" onClick={() => exportAll('json')} className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 bg-slate-100 dark:bg-zinc-800 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-700">JSON</button>
                  </div>
                </div>

                {/* Privacy */}
                <div className="bg-emerald-50/80 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-5">
                  <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-200 mb-2 flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-500" />Private & Local</h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">Your keyword vault is stored in your browser. Your keywords are not uploaded to our servers.</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-semibold">Important: Clearing this website&apos;s browser data may remove your local vault. Keep a backup if the keywords are important.</p>
                </div>

                {/* Delete vault */}
                <div className="bg-rose-50/80 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-800 p-5">
                  <h3 className="text-sm font-bold text-rose-800 dark:text-rose-200 mb-2 flex items-center gap-2"><Trash2 className="w-4 h-4 text-rose-500" />Delete Local Vault</h3>
                  <p className="text-xs text-rose-700 dark:text-rose-300 mb-3">This will permanently delete all locally stored niches and keywords from this browser. Make sure you have a backup first.</p>
                  <button type="button" onClick={() => setShowDeleteVault(true)} className="px-4 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl cursor-pointer shadow-sm transition-all">Delete Everything</button>
                </div>
              </div>
            )}
          </main>

          {/* ── Mobile Bottom Nav ── */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-slate-200/80 dark:border-zinc-800 px-2 pb-[env(safe-area-inset-bottom,0px)]">
            <div className="flex items-center justify-around py-1.5">
              {navItems.map(item => (
                <button key={item.id} type="button" onClick={() => { setView(item.id); setSelectedNicheId(null); setSearchQ(''); setSortMode('default'); }} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${view === item.id && !selectedNicheId ? 'text-orange-600 dark:text-orange-400' : 'text-slate-500 dark:text-zinc-500'}`}>
                  {item.icon}
                  <span className="text-[9px] font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}

      {/* ════════════════════ MODALS ════════════════════ */}

      {/* Create Niche */}
      <Modal open={showCreateNiche} onClose={() => setShowCreateNiche(false)} title="Create New Niche">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Niche Name</label>
            <input type="text" value={nicheName} onChange={e => setNicheName(e.target.value)} placeholder="e.g. Wedding Invitations" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white input-field" autoFocus onKeyDown={e => { if (e.key === 'Enter') addNiche(); }} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Description <span className="text-slate-400">(optional)</span></label>
            <input type="text" value={nicheDesc} onChange={e => setNicheDesc(e.target.value)} placeholder="Keywords related to..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Color</label>
            <div className="flex flex-wrap gap-2">
              {NICHE_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setNicheColor(c)} className={`w-7 h-7 rounded-full cursor-pointer transition-all border-2 ${nicheColor === c ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'}`} style={{ background: c }} />
              ))}
            </div>
          </div>
          <button type="button" onClick={addNiche} className="w-full py-2.5 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white text-sm font-bold shadow-md shadow-orange-500/25 cursor-pointer hover:shadow-lg transition-all mt-2">Create Niche</button>
        </div>
      </Modal>

      {/* Edit Niche */}
      <Modal open={!!showEditNiche} onClose={() => setShowEditNiche(null)} title="Edit Niche">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Niche Name</label>
            <input type="text" value={nicheName} onChange={e => setNicheName(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white input-field" autoFocus />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Description</label>
            <input type="text" value={nicheDesc} onChange={e => setNicheDesc(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Color</label>
            <div className="flex flex-wrap gap-2">
              {NICHE_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setNicheColor(c)} className={`w-7 h-7 rounded-full cursor-pointer transition-all border-2 ${nicheColor === c ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'}`} style={{ background: c }} />
              ))}
            </div>
          </div>
          <button type="button" onClick={updateNiche} className="w-full py-2.5 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white text-sm font-bold shadow-md cursor-pointer hover:shadow-lg transition-all mt-2">Save Changes</button>
        </div>
      </Modal>

      {/* Bulk Add */}
      <Modal open={showBulkAdd} onClose={() => setShowBulkAdd(false)} title="Bulk Add Keywords">
        <div className="space-y-3">
          <p className="text-xs text-slate-500 dark:text-zinc-400">Paste one keyword per line. Duplicates will be automatically skipped.</p>
          <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} placeholder={"wedding invitation\nwedding invite template\nminimalist wedding invitation"} className="w-full h-40 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white input-field resize-none font-mono" autoFocus />
          {bulkParsed.length > 0 && <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">{bulkParsed.length} keywords detected</p>}
          <button type="button" onClick={() => selectedNicheId && bulkAddKeywords(selectedNicheId)} disabled={bulkParsed.length === 0} className="w-full py-2.5 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white text-sm font-bold shadow-md cursor-pointer hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">Add All</button>
        </div>
      </Modal>

      {/* Import */}
      <Modal open={showImport} onClose={() => setShowImport(false)} title="Import Keywords">
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-zinc-400">Upload a TXT or CSV file with keywords (one per line).</p>
          <label className="flex flex-col items-center gap-2 p-8 rounded-xl border-2 border-dashed border-slate-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-600 cursor-pointer transition-all text-center">
            <Upload className="w-8 h-8 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">Choose File</span>
            <span className="text-[11px] text-slate-400">TXT or CSV</span>
            <input ref={fileInputRef} type="file" accept=".txt,.csv" className="hidden" onChange={handleImportFile} />
          </label>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">Or paste keywords directly using the Bulk Add feature.</p>
        </div>
      </Modal>

      {/* Delete Vault Confirmation */}
      <Modal open={showDeleteVault} onClose={() => { setShowDeleteVault(false); setDeleteConfirm(''); }} title="Delete Vault">
        <div className="space-y-3">
          <p className="text-sm text-rose-700 dark:text-rose-300 font-semibold">This will permanently delete all locally stored niches and keywords from this browser.</p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Type <span className="font-mono font-bold text-rose-600 dark:text-rose-400">DELETE</span> to confirm.</p>
          <input type="text" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="Type DELETE" className="w-full px-3 py-2.5 rounded-xl border border-rose-200 dark:border-rose-800 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white input-field" />
          <button type="button" onClick={nukeVault} disabled={deleteConfirm !== 'DELETE'} className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold cursor-pointer shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">Delete Everything</button>
        </div>
      </Modal>

      {/* ── FOOTER ── */}
      {appState !== 'unlocked' && (
        <footer className="bg-slate-100/90 dark:bg-zinc-950/95 border-t border-slate-200/80 dark:border-zinc-800/80 text-xs mt-16 transition-colors duration-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
            <div className="flex items-center gap-3">
              <CalculatorLogo size="md" showPulse={false} />
              <div>
                <span className="text-base font-bold text-slate-900 dark:text-white font-[Plus_Jakarta_Sans,sans-serif] block">Etsy Keyword Saver</span>
                <span className="text-[11px] text-slate-400 dark:text-zinc-500">Private browser-based keyword organizer</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-zinc-300 font-medium">
              <span>Made with</span>
              <Heart className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
              <span>by</span>
              <span className="font-bold text-slate-900 dark:text-white">Abdullah Saqib</span>
            </div>
            <div className="border-t border-slate-200/60 dark:border-zinc-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">Independent Etsy keyword organizer tool. All data is stored locally in your browser.</p>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">© 2026 Etsy Seller Tools</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

// ── Download helper ──

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
