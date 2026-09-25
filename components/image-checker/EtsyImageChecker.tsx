'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Upload, Image as ImageIcon, X, RefreshCw, CheckCircle2, AlertTriangle,
  XCircle, FileImage, Ruler, Maximize2, HardDrive, Ratio, Monitor,
  Zap, ChevronDown, ChevronUp, Shield, Sun, Moon, Eye, Trash2, Info,
  Calculator, ArrowLeft, ImagePlus, MoveHorizontal, MoveVertical, FolderOpen
} from 'lucide-react';
import { CalculatorLogo } from '@/components/ui/CalculatorLogo';
import {
  analyzeImage, isSupportedFormat, isFileTooLarge, formatFileSize,
  type ImageAnalysis, type CheckStatus, type QualityRating
} from '@/lib/image-checker/analysis';

// ─── Status Icon Components ────────────────────────────────────────────────

function StatusIcon({ status, size = 18 }: { status: CheckStatus; size?: number }) {
  switch (status) {
    case 'good':
      return <CheckCircle2 className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" style={{ width: size, height: size }} />;
    case 'warning':
      return <AlertTriangle className="text-amber-500 dark:text-amber-400 flex-shrink-0" style={{ width: size, height: size }} />;
    case 'problem':
      return <XCircle className="text-rose-500 dark:text-rose-400 flex-shrink-0" style={{ width: size, height: size }} />;
  }
}

function StatusBadge({ status, text }: { status: CheckStatus; text: string }) {
  const colors = {
    good: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    problem: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${colors[status]}`}>
      <StatusIcon status={status} size={12} />
      {text}
    </span>
  );
}

// ─── Quality Rating ─────────────────────────────────────────────────────────

function QualityBadge({ rating }: { rating: QualityRating }) {
  const config = {
    'excellent': { label: 'Excellent', desc: 'Large enough for typical listing use', status: 'good' as CheckStatus, bg: 'bg-emerald-500' },
    'good': { label: 'Good', desc: 'Suitable dimensions with no major concern', status: 'good' as CheckStatus, bg: 'bg-emerald-400' },
    'warning': { label: 'Warning', desc: 'Image dimensions are relatively low', status: 'warning' as CheckStatus, bg: 'bg-amber-400' },
    'too-small': { label: 'Too Small', desc: 'Image is very small and should be replaced with a higher-resolution version', status: 'problem' as CheckStatus, bg: 'bg-rose-400' },
  };
  const c = config[rating];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <StatusIcon status={c.status} size={20} />
        <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">{c.label}</span>
      </div>
      <p className="text-xs text-slate-500 dark:text-zinc-400">{c.desc}</p>
    </div>
  );
}

// ─── Section Icon Wrapper ───────────────────────────────────────────────────

function SectionIcon({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
}

// ─── FAQ Accordion Item ─────────────────────────────────────────────────────

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 dark:border-zinc-800 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 py-4 text-left cursor-pointer group"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-slate-800 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          {question}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400 dark:text-zinc-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-zinc-500 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="pb-4 pr-6 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed animate-in slide-in-from-top-1 duration-200">
          {answer}
        </div>
      )}
    </div>
  );
}

// ─── Uploaded Image Entry ───────────────────────────────────────────────────

interface ImageEntry {
  id: string;
  file: File;
  objectUrl: string;
  analysis: ImageAnalysis | null;
  error: string | null;
  loading: boolean;
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function EtsyImageChecker() {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Theme
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.objectUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedImage = images.find(i => i.id === selectedId) ?? images[0] ?? null;

  // ── Process Files ──

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);

    const newEntries: ImageEntry[] = fileArray.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      file,
      objectUrl: URL.createObjectURL(file),
      analysis: null,
      error: null,
      loading: true,
    }));

    setImages(prev => [...prev, ...newEntries]);

    // Select the first new image if nothing is selected
    if (!selectedId && newEntries.length > 0) {
      setSelectedId(newEntries[0].id);
    }

    // Analyze each image
    newEntries.forEach(entry => {
      if (!isSupportedFormat(entry.file)) {
        setImages(prev => prev.map(img =>
          img.id === entry.id
            ? { ...img, loading: false, error: 'This file format is not supported. Please upload a JPG, JPEG, PNG, or WebP image.' }
            : img
        ));
        return;
      }

      if (isFileTooLarge(entry.file)) {
        setImages(prev => prev.map(img =>
          img.id === entry.id
            ? { ...img, loading: false, error: 'This file is too large to process. Please choose a smaller image (under 50 MB).' }
            : img
        ));
        return;
      }

      const img = new window.Image();
      img.onload = () => {
        const analysis = analyzeImage(entry.file, img.naturalWidth, img.naturalHeight);
        setImages(prev => prev.map(item =>
          item.id === entry.id ? { ...item, loading: false, analysis } : item
        ));
      };
      img.onerror = () => {
        setImages(prev => prev.map(item =>
          item.id === entry.id
            ? { ...item, loading: false, error: 'We couldn\'t read this image. Please try another file.' }
            : item
        ));
      };
      img.src = entry.objectUrl;
    });
  }, [selectedId]);

  // ── Drag & Drop ──

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  }, [processFiles]);

  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const target = prev.find(i => i.id === id);
      if (target) URL.revokeObjectURL(target.objectUrl);
      const updated = prev.filter(i => i.id !== id);
      if (selectedId === id) {
        setSelectedId(updated.length > 0 ? updated[0].id : null);
      }
      return updated;
    });
  }, [selectedId]);

  const resetAll = useCallback(() => {
    images.forEach(img => URL.revokeObjectURL(img.objectUrl));
    setImages([]);
    setSelectedId(null);
  }, [images]);

  // ── Computed summary ──

  const readyCount = images.filter(i => i.analysis?.overallStatus === 'ready').length;
  const attentionCount = images.filter(i => i.analysis?.overallStatus === 'attention' || i.error).length;
  const hasImages = images.length > 0;

  // ────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen">
      {/* Background orbs matching main site */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-400/15 dark:bg-orange-600/10 rounded-full blur-3xl" />
        <div className="absolute -top-20 right-20 w-80 h-80 bg-amber-400/15 dark:bg-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-72 h-72 bg-orange-300/15 dark:bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-amber-300/10 dark:bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* ── HEADER ── */}
      <header className="glass border-b border-orange-100/60 dark:border-zinc-800/80 sticky top-0 z-30 shadow-xs transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
            <CalculatorLogo size="responsive" />
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-base md:text-xl font-bold tracking-tight text-slate-900 dark:text-white font-[Plus_Jakarta_Sans,sans-serif] leading-tight truncate">
                Etsy Image Checker
              </h1>
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-zinc-400 truncate">
                Made by <span className="font-semibold text-slate-700 dark:text-zinc-200">Abdullah Saqib</span>
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/80 dark:hover:bg-zinc-800/80 rounded-xl transition-all duration-150 cursor-pointer"
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Calculator</span>
            </a>

            <a
              href="/etsy-keyword-saver"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/80 dark:hover:bg-zinc-800/80 rounded-xl transition-all duration-150 cursor-pointer"
            >
              <FolderOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Keyword Saver</span>
            </a>

            <button
              type="button"
              onClick={toggleDarkMode}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 bg-white/90 dark:bg-zinc-800/90 hover:bg-white dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700/80 rounded-xl transition-all duration-150 cursor-pointer shadow-xs"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {mounted && isDark ? (
                <>
                  <Sun className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-slate-500" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-10 space-y-6 sm:space-y-8">

        {/* ── HERO SECTION ── */}
        <div className="text-center py-2 sm:py-6 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-orange-100/70 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-xs sm:text-sm font-bold shadow-xs">
            <FileImage className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0" />
            <span>Free · 100% Private · No Upload</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Etsy Image{' '}
            <span className="gradient-text font-cursive text-3xl sm:text-5xl lg:text-6xl font-bold tracking-normal inline-block px-1">
              Size Checker
            </span>
          </h2>

          <p className="text-xs sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed max-w-2xl mx-auto">
            Check your Etsy listing images for dimensions, file size, format, aspect ratio, and technical compatibility — instantly and privately in your browser.
          </p>

          <div className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 font-medium">
            <Shield className="h-3.5 w-3.5 text-emerald-500" />
            <span>Your images are processed locally in your browser. Nothing is uploaded.</span>
          </div>
        </div>

        {/* ── UPLOAD AREA ── */}
        {!hasImages && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200
              bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm
              ${isDragging
                ? 'border-orange-400 dark:border-orange-500 bg-orange-50/60 dark:bg-orange-950/30 scale-[1.01] shadow-lg shadow-orange-500/10'
                : 'border-slate-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50/30 dark:hover:bg-zinc-800/60'
              }
              card-shadow p-8 sm:p-12 md:p-16
            `}
            role="button"
            tabIndex={0}
            aria-label="Upload image"
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className={`
                w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-200
                ${isDragging
                  ? 'bg-orange-100 dark:bg-orange-900/60 scale-110'
                  : 'bg-slate-100 dark:bg-zinc-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40'
                }
              `}>
                <Upload className={`h-8 w-8 sm:h-10 sm:w-10 transition-colors ${isDragging ? 'text-orange-500' : 'text-slate-400 dark:text-zinc-500 group-hover:text-orange-400'}`} />
              </div>

              <div>
                <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-zinc-100">
                  {isDragging ? 'Drop your image here' : 'Drop your Etsy listing image here'}
                </p>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">or</p>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white text-sm font-bold shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200 cursor-pointer"
                onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
              >
                <ImageIcon className="h-4 w-4" />
                Choose Image
              </button>

              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                Supports JPG, JPEG, PNG, WebP · Max 50 MB
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              multiple
              className="hidden"
              onChange={handleFileInput}
              aria-label="Choose image files"
            />
          </div>
        )}

        {/* ── RESULTS AREA ── */}
        {hasImages && (
          <>
            {/* ── Multi-image summary strip ── */}
            {images.length > 1 && (
              <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-4 sm:p-5 card-shadow">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <SectionIcon className="bg-orange-100 dark:bg-orange-950/60">
                      <ImagePlus className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </SectionIcon>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                        {images.length} Images Checked
                      </h3>
                      <div className="flex items-center gap-3 mt-0.5">
                        {readyCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {readyCount} Ready
                          </span>
                        )}
                        {attentionCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            {attentionCount} Needs Attention
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-600 rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                      <Upload className="h-3.5 w-3.5" /> Add More
                    </button>
                    <button
                      type="button"
                      onClick={resetAll}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-rose-300 dark:hover:border-rose-600 rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Check New Images
                    </button>
                  </div>
                </div>

                {/* Multi-image grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 mt-4">
                  {images.map(img => (
                    <div
                      key={img.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedId(img.id)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedId(img.id); }}
                      className={`
                        relative group rounded-xl border overflow-hidden transition-all duration-150 cursor-pointer text-left
                        ${selectedId === img.id
                          ? 'border-orange-400 dark:border-orange-500 ring-2 ring-orange-400/30 dark:ring-orange-500/20 shadow-md'
                          : 'border-slate-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-600'
                        }
                      `}
                    >
                      <div className="aspect-square bg-slate-50 dark:bg-zinc-800/60 relative">
                        <img
                          src={img.objectUrl}
                          alt={img.file.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Status overlay */}
                        <div className="absolute top-1.5 right-1.5">
                          {img.loading ? (
                            <div className="w-5 h-5 rounded-full bg-white/90 dark:bg-zinc-800/90 flex items-center justify-center">
                              <div className="w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                            </div>
                          ) : img.error ? (
                            <XCircle className="w-5 h-5 text-rose-500 drop-shadow" />
                          ) : img.analysis?.overallStatus === 'ready' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 drop-shadow" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-amber-500 drop-shadow" />
                          )}
                        </div>
                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); removeImage(img.id); }}
                          className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          aria-label={`Remove ${img.file.name}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="px-2 py-1.5 bg-white dark:bg-zinc-900">
                        <p className="text-[10px] font-medium text-slate-600 dark:text-zinc-300 truncate">{img.file.name}</p>
                        <p className="text-[9px] text-slate-400 dark:text-zinc-500">
                          {img.analysis ? `${img.analysis.width}×${img.analysis.height}` : img.error ? 'Error' : 'Analyzing...'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Single/Selected Image Detail ── */}
            {selectedImage && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                {/* LEFT: Image Preview */}
                <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-zinc-800 card-shadow overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SectionIcon className="bg-indigo-100 dark:bg-indigo-950/60">
                        <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </SectionIcon>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Image Preview</h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-600 rounded-lg transition-all cursor-pointer"
                      >
                        <RefreshCw className="h-3 w-3" /> Change Image
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(selectedImage.id)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    {selectedImage.loading ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-3 border-orange-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : selectedImage.error ? (
                      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center">
                          <XCircle className="h-7 w-7 text-rose-500" />
                        </div>
                        <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{selectedImage.error}</p>
                      </div>
                    ) : (
                      <>
                        <div className="relative bg-slate-50 dark:bg-zinc-800/60 rounded-xl overflow-hidden flex items-center justify-center" style={{ minHeight: '200px', maxHeight: '450px' }}>
                          <img
                            src={selectedImage.objectUrl}
                            alt={`Preview of ${selectedImage.file.name}`}
                            className="max-w-full max-h-[450px] object-contain"
                          />
                        </div>
                        <p className="mt-3 text-xs text-slate-500 dark:text-zinc-400 font-mono truncate">{selectedImage.file.name}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* RIGHT: Analysis Results */}
                <div className="space-y-5">
                  {selectedImage.analysis && (
                    <>
                      {/* Image Analysis Card */}
                      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-zinc-800 card-shadow overflow-hidden">
                        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-zinc-800">
                          <div className="flex items-center gap-2">
                            <SectionIcon className="bg-sky-100 dark:bg-sky-950/60">
                              <Ruler className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                            </SectionIcon>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Image Analysis</h3>
                          </div>
                        </div>
                        <div className="p-4 sm:p-5">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                              { icon: <Maximize2 className="h-3.5 w-3.5" />, label: 'Dimensions', value: `${selectedImage.analysis.width.toLocaleString()} × ${selectedImage.analysis.height.toLocaleString()} px` },
                              { icon: <MoveHorizontal className="h-3.5 w-3.5" />, label: 'Width', value: `${selectedImage.analysis.width.toLocaleString()} px` },
                              { icon: <MoveVertical className="h-3.5 w-3.5" />, label: 'Height', value: `${selectedImage.analysis.height.toLocaleString()} px` },
                              { icon: <Ratio className="h-3.5 w-3.5" />, label: 'Aspect Ratio', value: selectedImage.analysis.aspectRatio },
                              { icon: <FileImage className="h-3.5 w-3.5" />, label: 'File Format', value: selectedImage.analysis.fileType },
                              { icon: <HardDrive className="h-3.5 w-3.5" />, label: 'File Size', value: selectedImage.analysis.fileSizeFormatted },
                              { icon: <Monitor className="h-3.5 w-3.5" />, label: 'Orientation', value: selectedImage.analysis.orientation },
                              { icon: <Zap className="h-3.5 w-3.5" />, label: 'Pixel Count', value: selectedImage.analysis.megapixelsFormatted },
                            ].map(item => (
                              <div key={item.label} className="space-y-1">
                                <div className="flex items-center gap-1.5 text-slate-400 dark:text-zinc-500">
                                  {item.icon}
                                  <span className="text-[10px] font-semibold uppercase tracking-wider">{item.label}</span>
                                </div>
                                <p className="text-sm font-bold text-slate-800 dark:text-zinc-100 font-mono">{item.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Listing Image Check — Overall Status */}
                      <div className={`
                        rounded-2xl border overflow-hidden card-shadow transition-all
                        ${selectedImage.analysis.overallStatus === 'ready'
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                        }
                      `}>
                        <div className="p-4 sm:p-5">
                          <div className="flex items-center gap-3 mb-4">
                            {selectedImage.analysis.overallStatus === 'ready' ? (
                              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                              </div>
                            )}
                            <div>
                              <h3 className="text-base font-bold text-slate-800 dark:text-zinc-100">
                                {selectedImage.analysis.overallStatus === 'ready' ? 'Ready for Etsy' : 'Needs Attention'}
                              </h3>
                              <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                                Listing Image Check
                              </p>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-zinc-400 mb-4">
                            {selectedImage.analysis.overallStatus === 'ready'
                              ? 'Your image meets the technical checks configured for this tool.'
                              : 'Your image has some technical issues that should be fixed before using it as an Etsy listing image.'
                            }
                          </p>

                          {/* Checklist */}
                          <div className="space-y-2">
                            {selectedImage.analysis.checks.map(check => (
                              <div key={check.label} className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-100/60 dark:border-zinc-800/60 last:border-0">
                                <div className="flex items-center gap-2 min-w-0">
                                  <StatusIcon status={check.status} size={16} />
                                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200">{check.label}</span>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 hidden sm:inline">{check.value}</span>
                                  <StatusBadge status={check.status} text={check.statusText} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Image Quality Check */}
                      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-zinc-800 card-shadow overflow-hidden">
                        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-zinc-800">
                          <div className="flex items-center gap-2">
                            <SectionIcon className="bg-violet-100 dark:bg-violet-950/60">
                              <Zap className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                            </SectionIcon>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Image Quality Check</h3>
                          </div>
                        </div>
                        <div className="p-4 sm:p-5">
                          <QualityBadge rating={selectedImage.analysis.qualityRating} />
                        </div>
                      </div>

                      {/* Recommendations */}
                      {selectedImage.analysis.recommendations.length > 0 && (
                        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-zinc-800 card-shadow overflow-hidden">
                          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2">
                              <SectionIcon className="bg-amber-100 dark:bg-amber-950/60">
                                <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              </SectionIcon>
                              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Recommendations</h3>
                            </div>
                          </div>
                          <div className="p-4 sm:p-5 space-y-3">
                            {selectedImage.analysis.recommendations.map((rec, i) => (
                              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 bg-slate-50/80 dark:bg-zinc-800/50 rounded-xl px-3.5 py-3 border border-slate-100 dark:border-zinc-800">
                                <Info className="h-4 w-4 text-slate-400 dark:text-zinc-500 flex-shrink-0 mt-0.5" />
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Aspect Ratio Detail */}
                      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-zinc-800 card-shadow overflow-hidden">
                        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-zinc-800">
                          <div className="flex items-center gap-2">
                            <SectionIcon className="bg-rose-100 dark:bg-rose-950/60">
                              <Ratio className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                            </SectionIcon>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Aspect Ratio</h3>
                          </div>
                        </div>
                        <div className="p-4 sm:p-5">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl font-black font-mono text-slate-800 dark:text-zinc-100">
                              {selectedImage.analysis.aspectRatio}
                            </span>
                            <StatusBadge
                              status={selectedImage.analysis.aspectRatioStatus}
                              text={selectedImage.analysis.aspectRatioStatus === 'good' ? 'Common ratio' : 'Unusual ratio'}
                            />
                          </div>
                          {selectedImage.analysis.aspectRatioStatus === 'warning' && (
                            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 bg-amber-50/60 dark:bg-amber-950/20 rounded-lg px-3 py-2 border border-amber-100 dark:border-amber-900/50">
                              Consider checking your design composition to make sure important text or product details remain visible.
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Error state for selected image */}
                  {selectedImage.error && !selectedImage.analysis && (
                    <div className="bg-rose-50/80 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-800 p-5 card-shadow">
                      <div className="flex items-center gap-3">
                        <XCircle className="h-6 w-6 text-rose-500 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-bold text-rose-700 dark:text-rose-300">Error</h3>
                          <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{selectedImage.error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Check Another Image Button */}
            {images.length === 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white text-sm font-bold shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/30 transition-all cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  Add More Images
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-600 shadow-xs transition-all cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4" />
                  Check Another Image
                </button>
              </div>
            )}

            {/* Hidden file input for "Add More" / "Change Image" */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              multiple
              className="hidden"
              onChange={handleFileInput}
              aria-label="Choose image files"
            />
          </>
        )}

        {/* ── SEO SECTION ── */}
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-zinc-800 card-shadow overflow-hidden mt-8 sm:mt-12">
          <div className="p-5 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4">
              Etsy Listing Image Size Guide
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-zinc-200 mb-1">Why Image Dimensions Matter</h4>
                  <p>Larger images allow Etsy buyers to zoom in on product details. Images that are too small may appear blurry or pixelated, reducing buyer confidence.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-zinc-200 mb-1">Why Aspect Ratio Matters</h4>
                  <p>Listing thumbnails are displayed at consistent aspect ratios. Images that don&apos;t match may be cropped automatically, potentially hiding important details.</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-zinc-200 mb-1">Why File Size Matters</h4>
                  <p>Very large files load slowly for buyers. Overly compressed files lose detail. Finding the right balance ensures fast loading without sacrificing quality.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-zinc-200 mb-1">Preview Before Publishing</h4>
                  <p>Always preview your listing images at different sizes before publishing. What looks good on desktop may appear different on mobile devices.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FAQ SECTION ── */}
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-zinc-800 card-shadow overflow-hidden">
          <div className="p-5 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <div>
              <FAQItem
                question="What image formats can I check?"
                answer="This tool supports JPG, JPEG, PNG, and WebP image formats. These are the most common formats used for Etsy listing images."
              />
              <FAQItem
                question="Does this tool upload my image?"
                answer="No. Your images are processed entirely within your browser using local JavaScript APIs. Nothing is sent to any server. Your images remain completely private."
              />
              <FAQItem
                question="What dimensions should an Etsy listing image have?"
                answer="Etsy recommends listing images to be at least 2000 pixels on the shortest side for high-quality zoom functionality. Images smaller than 1000 pixels may appear less sharp to buyers."
              />
              <FAQItem
                question="Why is my image marked as too small?"
                answer="Images under 500 pixels wide or tall are generally too small for product listing use. They may appear pixelated or blurry when displayed on Etsy's listing pages."
              />
              <FAQItem
                question="Can I check multiple Etsy listing images?"
                answer="Yes. You can upload multiple images at once using the file picker or by dragging and dropping several files. Each image will be analyzed individually."
              />
              <FAQItem
                question="Does this tool compress or modify my image?"
                answer="No. This tool only reads your image's metadata (dimensions, file size, format) for analysis purposes. It does not alter, compress, or save your image in any way."
              />
            </div>
          </div>
        </div>

        {/* ── Trust strip ── */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-2 pb-4">
          {[
            { icon: '🔒', text: 'No data stored. Fully private.' },
            { icon: '⚡', text: 'Instant browser-based analysis' },
            { icon: '🖼️', text: 'Multiple images supported' },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400 font-semibold">
              <span className="text-base">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-100/90 dark:bg-zinc-950/95 border-t border-slate-200/80 dark:border-zinc-800/80 text-slate-600 dark:text-zinc-400 text-xs mt-8 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center gap-3">
                <CalculatorLogo size="md" showPulse={false} />
                <div>
                  <span className="text-base font-bold text-slate-900 dark:text-white font-[Plus_Jakarta_Sans,sans-serif] block leading-tight">
                    Etsy Image Checker
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                    Listing image dimension &amp; format analysis
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-md">
                Check your Etsy listing images for dimensions, file size, format, and aspect ratio — entirely in your browser with no uploads.
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-xs text-slate-700 dark:text-zinc-300 font-medium">
                <span>Made with</span>
                <svg className="h-3.5 w-3.5 fill-orange-500 text-orange-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                <span>by</span>
                <span className="font-bold text-slate-900 dark:text-white">Abdullah Saqib</span>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3 md:text-right">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-zinc-200">
                Navigation
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    <Calculator className="h-3.5 w-3.5" />
                    <span>Profit Calculator</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/etsy-image-checker"
                    className="inline-flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 font-bold hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
                  >
                    <FileImage className="h-3.5 w-3.5" />
                    <span>Image Checker</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200/60 dark:border-zinc-800/80 pt-6 space-y-3 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 max-w-xl leading-relaxed">
              Independent Etsy listing image analysis tool. This tool does not represent or claim affiliation with Etsy, Inc.
            </p>
            <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono flex-shrink-0">
              © 2026 Etsy Seller Tools. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
