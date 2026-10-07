import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Check, 
  HelpCircle 
} from 'lucide-react';
import { Dropzone } from '../components/Dropzone';
import { BatchConverter } from '../components/BatchConverter';
import { AdSlot } from '../components/AdSlot';
import type { ImageItem, TargetFormat } from '../types';

interface FormatPairPageProps {
  sourceFormat: string;
  targetFormat: TargetFormat;
  title: string;
  subtitle: string;
  benefits: string[];
  faqs: { q: string; a: string }[];
  items: ImageItem[];
  onFilesSelected: (files: File[]) => void;
  onUpdateItem: (id: string, updates: Partial<ImageItem>) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onConvertItem: (id: string) => Promise<void>;
  onConvertAll: () => Promise<void>;
  onDownloadZip: () => Promise<void>;
  onPreviewImage: (item: ImageItem) => void;
  isProcessingAll: boolean;
}

export const FormatPairPage: React.FC<FormatPairPageProps> = ({
  sourceFormat,
  targetFormat,
  title,
  subtitle,
  benefits,
  faqs,
  items,
  onFilesSelected,
  onUpdateItem,
  onRemoveItem,
  onClearAll,
  onConvertItem,
  onConvertAll,
  onDownloadZip,
  onPreviewImage,
  isProcessingAll,
}) => {
  return (
    <div className="space-y-12 sm:space-y-16 animate-in fade-in duration-300 max-w-5xl mx-auto">
      
      {/* Hero */}
      <div className="text-center space-y-4 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/10">
          <span>{sourceFormat}</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
          <span>{targetFormat} Converter</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          {title}
        </h1>

        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
          {subtitle}
        </p>

        {/* Upload Container */}
        <div className="pt-4">
          {items.length === 0 ? (
            <Dropzone onFilesSelected={onFilesSelected} />
          ) : (
            <div className="space-y-6">
              <BatchConverter
                items={items}
                onUpdateItem={onUpdateItem}
                onRemoveItem={onRemoveItem}
                onClearAll={onClearAll}
                onConvertItem={onConvertItem}
                onConvertAll={onConvertAll}
                onDownloadZip={onDownloadZip}
                onPreviewImage={onPreviewImage}
                isProcessingAll={isProcessingAll}
              />
              <Dropzone onFilesSelected={onFilesSelected} compact={true} />
            </div>
          )}
        </div>
      </div>

      {/* AdSlot */}
      <AdSlot slotKey="toolBelow" />

      {/* Benefits / Technical breakdown */}
      <section className="rounded-3xl border border-zinc-200/90 dark:border-white/10 bg-white dark:bg-[#0A0A0C] p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">
            Why Convert {sourceFormat} to {targetFormat}?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 flex items-start gap-3"
            >
              <div className="p-1 rounded-full bg-emerald-500 text-black mt-0.5 shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-zinc-800 dark:text-zinc-200 font-semibold leading-relaxed">
                {benefit}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Step by step guide */}
      <section className="space-y-6">
        <h3 className="text-xl font-extrabold text-center text-zinc-950 dark:text-white">
          How to Convert {sourceFormat} to {targetFormat} in 3 Simple Steps
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl border border-zinc-200/90 dark:border-white/10 bg-white dark:bg-[#0A0A0C] text-center space-y-2.5 oled-card-hover shadow-sm">
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-black font-extrabold text-xs flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
              1
            </div>
            <h4 className="text-sm font-bold text-zinc-950 dark:text-white">Upload Files</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Drag & drop your {sourceFormat} images or paste them from your clipboard.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-zinc-200/90 dark:border-white/10 bg-white dark:bg-[#0A0A0C] text-center space-y-2.5 oled-card-hover shadow-sm">
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-black font-extrabold text-xs flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
              2
            </div>
            <h4 className="text-sm font-bold text-zinc-950 dark:text-white">Configure Quality</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Optionally fine-tune output dimensions or compression quality.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-zinc-200/90 dark:border-white/10 bg-white dark:bg-[#0A0A0C] text-center space-y-2.5 oled-card-hover shadow-sm">
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-black font-extrabold text-xs flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
              3
            </div>
            <h4 className="text-sm font-bold text-zinc-950 dark:text-white">Instant Download</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Direct client-side generation — download your {targetFormat} file or ZIP archive.
            </p>
          </div>
        </div>
      </section>

      {/* Format specific FAQ */}
      <section className="space-y-4">
        <h3 className="text-xl font-extrabold text-zinc-950 dark:text-white">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#0A0A0C] space-y-1.5 shadow-xs"
            >
              <div className="text-xs font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{f.q}</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 pl-6 leading-relaxed font-medium">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AdSlot footer */}
      <AdSlot slotKey="footerAbove" />

    </div>
  );
};
