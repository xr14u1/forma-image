import React, { useState } from 'react';
import { 
  Play, 
  Download, 
  Archive, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  SlidersHorizontal, 
  Lock, 
  Unlock,
  Eye,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import type { ImageItem, TargetFormat } from '../types';
import { formatBytes, triggerBlobDownload } from '../utils/imageEngine';

interface BatchConverterProps {
  items: ImageItem[];
  onUpdateItem: (id: string, updates: Partial<ImageItem>) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onConvertItem: (id: string) => Promise<void>;
  onConvertAll: () => Promise<void>;
  onDownloadZip: () => Promise<void>;
  onPreviewImage: (item: ImageItem) => void;
  isProcessingAll: boolean;
}

export const BatchConverter: React.FC<BatchConverterProps> = ({
  items,
  onUpdateItem,
  onRemoveItem,
  onClearAll,
  onConvertItem,
  onConvertAll,
  onDownloadZip,
  onPreviewImage,
  isProcessingAll,
}) => {
  const [globalFormat, setGlobalFormat] = useState<TargetFormat>('WEBP');
  const [globalQuality, setGlobalQuality] = useState<number>(85);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const formats: TargetFormat[] = ['WEBP', 'PNG', 'JPG', 'AVIF', 'SVG', 'TIFF', 'GIF', 'BMP', 'ICO'];

  const completedItems = items.filter((item) => item.status === 'done');
  const totalOriginalBytes = items.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalConvertedBytes = completedItems.reduce(
    (acc, curr) => acc + (curr.convertedSize || curr.originalSize),
    0
  );
  const totalSavedBytes = Math.max(0, totalOriginalBytes - totalConvertedBytes);
  const overallSavingsPercent =
    totalOriginalBytes > 0 && completedItems.length === items.length
      ? Math.round((totalSavedBytes / totalOriginalBytes) * 100)
      : 0;

  // Apply format to all items
  const handleApplyGlobalFormat = (fmt: TargetFormat) => {
    setGlobalFormat(fmt);
    items.forEach((item) => {
      onUpdateItem(item.id, {
        targetFormat: fmt,
        options: { ...item.options, format: fmt },
      });
    });
  };

  // Apply quality to all items
  const handleApplyGlobalQuality = (q: number) => {
    setGlobalQuality(q);
    items.forEach((item) => {
      onUpdateItem(item.id, {
        quality: q,
        options: { ...item.options, quality: q },
      });
    });
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      
      {/* Global Control Bar */}
      <div className="p-4 sm:p-5 rounded-3xl border border-zinc-200/90 dark:border-white/10 bg-white/90 dark:bg-[#0A0A0C]/90 shadow-lg backdrop-blur-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Left: Summary & Format Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
              Queue:
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-bold">
              {items.length} {items.length === 1 ? 'file' : 'files'}
            </span>
          </div>

          <div className="h-4 w-px bg-zinc-200 dark:bg-white/10 hidden sm:block" />

          {/* Batch Format Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="global-format-select" className="text-xs text-zinc-500 dark:text-zinc-400 font-bold">Convert all to:</label>
            <select
              id="global-format-select"
              aria-label="Target format for all images"
              value={globalFormat}
              onChange={(e) => handleApplyGlobalFormat(e.target.value as TargetFormat)}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-white/15 bg-zinc-50 dark:bg-black text-xs font-bold text-zinc-950 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
            >
              {formats.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt}
                </option>
              ))}
            </select>
          </div>

          {/* Batch Quality Slider */}
          <div className="hidden lg:flex items-center gap-2 pl-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold">Quality:</span>
            <input
              type="range"
              min="10"
              max="100"
              value={globalQuality}
              onChange={(e) => handleApplyGlobalQuality(parseInt(e.target.value, 10))}
              className="w-24 h-1.5 bg-zinc-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 w-8">
              {globalQuality}%
            </span>
          </div>
        </div>

        {/* Right: Actions (Convert All, Download ZIP, Clear) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onClearAll}
            disabled={isProcessingAll}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Clear all images"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          {completedItems.length > 0 && (
            <button
              onClick={onDownloadZip}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Download ZIP ({completedItems.length})</span>
            </button>
          )}

          <button
            onClick={onConvertAll}
            disabled={isProcessingAll}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-zinc-950 dark:bg-white text-white dark:text-black hover:bg-emerald-600 dark:hover:bg-emerald-400 dark:hover:text-black shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
          >
            {isProcessingAll ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Converting...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Convert All</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Aggregate Savings Pill */}
      {completedItems.length > 0 && totalSavedBytes > 0 && (
        <div className="px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 font-semibold">
            <div className="p-1 rounded-full bg-emerald-500 text-black">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span>
              Saved <strong className="font-extrabold text-emerald-600 dark:text-emerald-400">{formatBytes(totalSavedBytes)}</strong> ({overallSavingsPercent}% reduction) across {completedItems.length} images!
            </span>
          </div>
          <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hidden sm:inline">
            {formatBytes(totalOriginalBytes)} → {formatBytes(totalConvertedBytes)}
          </span>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {items.map((item) => {
          const isExpanded = expandedItemId === item.id;
          const isDone = item.status === 'done';
          const isProcessing = item.status === 'processing';
          const isError = item.status === 'error';

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isDone
                  ? 'border-emerald-500/40 bg-white dark:bg-[#0A0A0C] shadow-sm'
                  : isError
                  ? 'border-rose-500/40 bg-rose-50/20 dark:bg-rose-950/10'
                  : 'border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#0A0A0C] hover:border-zinc-300 dark:hover:border-white/20'
              }`}
            >
              {/* Main Row */}
              <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                
                {/* Thumbnail & File Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Thumbnail */}
                  <div
                    onClick={() => onPreviewImage(item)}
                    className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 shrink-0 cursor-pointer group/thumb"
                  >
                    <img
                      src={item.convertedUrl || item.previewUrl}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform group-hover/thumb:scale-110 duration-200"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center text-white transition-opacity">
                      <Eye className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-950 dark:text-white truncate max-w-[200px] sm:max-w-[280px]">
                        {item.name}
                      </h4>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-white/10 text-zinc-500 dark:text-zinc-400 uppercase shrink-0">
                        {item.originalFormat}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                      <span>{formatBytes(item.originalSize)}</span>
                      <span>•</span>
                      <span>{item.originalWidth} × {item.originalHeight} px</span>
                      
                      {/* Savings calculation tag */}
                      {isDone && item.convertedSize && (
                        <>
                          <span>→</span>
                          <span className="font-bold text-zinc-950 dark:text-white">
                            {formatBytes(item.convertedSize)}
                          </span>
                          {item.savingsPercent !== undefined && item.savingsPercent > 0 && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              -{item.savingsPercent}%
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status / Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-white/10">
                  
                  {/* Format Selector per Item */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-zinc-400 font-mono font-semibold">To:</span>
                    <select
                      aria-label={`Target format for ${item.name}`}
                      value={item.targetFormat}
                      disabled={isProcessing}
                      onChange={(e) => {
                        const fmt = e.target.value as TargetFormat;
                        onUpdateItem(item.id, {
                          targetFormat: fmt,
                          options: { ...item.options, format: fmt },
                        });
                      }}
                      className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-white/15 bg-zinc-50 dark:bg-black text-xs font-bold text-zinc-950 dark:text-white focus:outline-none cursor-pointer"
                    >
                      {formats.map((fmt) => (
                        <option key={fmt} value={fmt}>
                          {fmt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Settings toggle button */}
                  <button
                    onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                    className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                      isExpanded
                        ? 'border-emerald-500 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                        : 'border-zinc-200 dark:border-white/10 text-zinc-500 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                    title="Fine-tune resize & quality"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>

                  {/* Single Action Button: Convert / Download / Retry */}
                  {isDone ? (
                    <button
                      onClick={() => {
                        const ext = item.targetFormat.toLowerCase();
                        const base = item.name.replace(/\.[^/.]+$/, '');
                        const filename = item.options.customOutputName
                          ? `${item.options.customOutputName}.${ext}`
                          : `${base}-converted.${ext}`;
                        if (item.convertedBlob) {
                          triggerBlobDownload(item.convertedBlob, filename);
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  ) : isProcessing ? (
                    <div className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-200 flex items-center gap-1.5 animate-shimmer">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                      <span>Processing...</span>
                    </div>
                  ) : isError ? (
                    <button
                      onClick={() => onConvertItem(item.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950 text-rose-600 border border-rose-200 dark:border-rose-800 flex items-center gap-1 hover:bg-rose-100 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onConvertItem(item.id)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-zinc-950 dark:bg-white text-white dark:text-black hover:bg-emerald-600 dark:hover:bg-emerald-400 dark:hover:text-black flex items-center gap-1 shadow-sm transition-all cursor-pointer active:scale-95"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Convert</span>
                    </button>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>

              {/* Collapsible Fine-Tuning Drawer */}
              {isExpanded && (
                <div className="px-4 py-3.5 bg-zinc-50 dark:bg-[#111114] border-t border-zinc-200/80 dark:border-white/10 text-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-in slide-in-from-top-2 duration-150">
                  
                  {/* Quality Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-zinc-500 dark:text-zinc-400 font-semibold">Quality:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {item.quality}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={item.quality}
                      onChange={(e) => {
                        const q = parseInt(e.target.value, 10);
                        onUpdateItem(item.id, {
                          quality: q,
                          options: { ...item.options, quality: q },
                        });
                      }}
                      className="w-full h-1.5 bg-zinc-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* Width Input */}
                  <div>
                    <label className="text-zinc-500 dark:text-zinc-400 block mb-1 font-semibold">Width (px):</label>
                    <input
                      type="number"
                      placeholder={item.originalWidth.toString()}
                      value={item.targetWidth || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        let newHeight = item.targetHeight;
                        if (item.maintainAspectRatio && val > 0) {
                          const ratio = item.originalWidth / item.originalHeight;
                          newHeight = Math.round(val / ratio);
                        }
                        onUpdateItem(item.id, {
                          targetWidth: val,
                          targetHeight: newHeight,
                          options: { ...item.options, width: val, height: newHeight },
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-white/15 bg-white dark:bg-black text-zinc-950 dark:text-white font-mono font-bold"
                    />
                  </div>

                  {/* Height Input */}
                  <div>
                    <label className="text-zinc-500 dark:text-zinc-400 block mb-1 font-semibold">Height (px):</label>
                    <input
                      type="number"
                      placeholder={item.originalHeight.toString()}
                      value={item.targetHeight || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        let newWidth = item.targetWidth;
                        if (item.maintainAspectRatio && val > 0) {
                          const ratio = item.originalWidth / item.originalHeight;
                          newWidth = Math.round(val * ratio);
                        }
                        onUpdateItem(item.id, {
                          targetWidth: newWidth,
                          targetHeight: val,
                          options: { ...item.options, width: newWidth, height: val },
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-white/15 bg-white dark:bg-black text-zinc-950 dark:text-white font-mono font-bold"
                    />
                  </div>

                  {/* Maintain Aspect Ratio Toggle */}
                  <div className="flex flex-col justify-end">
                    <button
                      onClick={() => {
                        const next = !item.maintainAspectRatio;
                        onUpdateItem(item.id, {
                          maintainAspectRatio: next,
                          options: { ...item.options, maintainAspectRatio: next },
                        });
                      }}
                      className={`w-full py-1.5 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        item.maintainAspectRatio
                          ? 'border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          : 'border-zinc-200 dark:border-white/15 text-zinc-500'
                      }`}
                    >
                      {item.maintainAspectRatio ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Aspect Ratio Locked</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Aspect Ratio Free</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              )}

              {/* Error Message if any */}
              {isError && item.errorMessage && (
                <div className="px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 border-t border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{item.errorMessage}</span>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
