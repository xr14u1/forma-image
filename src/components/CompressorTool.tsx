import React, { useState, useEffect, useRef } from 'react';
import { 
  Minimize2, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  ArrowRight,
  Zap,
  Sliders
} from 'lucide-react';
import { processImage, formatBytes, triggerBlobDownload } from '../utils/imageEngine';
import { Dropzone } from './Dropzone';

import type { TargetFormat } from '../types';

export const CompressorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(75);
  const [format, setFormat] = useState<TargetFormat>('WEBP');
  
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setOriginalSize(selected.size);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);

    // Read dimensions
    const img = new Image();
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = url;
  };

  // Re-run compression when quality, format, or file changes
  useEffect(() => {
    if (!file) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsCompressing(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const result = await processImage(file, {
          format: format,
          quality: quality,
          maintainAspectRatio: true,
          stripMetadata: true,
        });

        setConvertedBlob(result.blob);
        setConvertedSize(result.blob.size);
        const url = URL.createObjectURL(result.blob);
        setConvertedUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      } catch (err) {
        console.error('Compression failed:', err);
      } finally {
        setIsCompressing(false);
      }
    }, 250);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [file, quality, format]);

  const savingsPercent = originalSize > 0 && convertedSize > 0
    ? Math.max(0, Math.round(((originalSize - convertedSize) / originalSize) * 100))
    : 0;

  const presets = [
    { label: 'Maximum Compression', quality: 50, desc: 'Smallest file size' },
    { label: 'Balanced (Recommended)', quality: 75, desc: 'Best size vs quality' },
    { label: 'High Fidelity', quality: 90, desc: 'Visually indistinguishable' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Smart In-Browser Compressor</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Compress Images Without Quality Loss
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Reduce image file sizes up to 85% with client-side quantization. Fast, private, and no server uploads.
        </p>
      </div>

      {!file ? (
        <Dropzone onFilesSelected={handleFilesSelected} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Visual Comparison & Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                  Compressed Preview
                </span>
                <span className="text-xs text-zinc-500">
                  {dimensions.width} × {dimensions.height} px
                </span>
              </div>

              {/* Image Preview Container */}
              <div className="relative rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 overflow-hidden flex items-center justify-center min-h-[300px] max-h-[460px]">
                <img
                  src={convertedUrl || previewUrl || ''}
                  alt="Compression Preview"
                  className="max-h-[440px] w-auto object-contain rounded-xl"
                />

                {isCompressing && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center text-white text-xs font-medium gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>Optimizing pixels...</span>
                  </div>
                )}
              </div>

              {/* Before vs After Stats Bar */}
              <div className="mt-4 grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800 text-center">
                <div>
                  <div className="text-[11px] text-zinc-400 font-medium uppercase">Original</div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-white mt-0.5">
                    {formatBytes(originalSize)}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                    -{savingsPercent}% Saved
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 mt-1" />
                </div>

                <div>
                  <div className="text-[11px] text-zinc-400 font-medium uppercase">Compressed</div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {convertedSize > 0 ? formatBytes(convertedSize) : 'Calculating...'}
                  </div>
                </div>
              </div>
            </div>

            {/* Change File Button */}
            <button
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
                setConvertedBlob(null);
              }}
              className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
            >
              Choose a different image
            </button>
          </div>

          {/* Right Column: Compression Controls */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-sm space-y-6">
              
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Compression Settings</span>
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Adjust quality slider or pick a preset balance.
                </p>
              </div>

              {/* Quality Presets */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Compression Presets</span>
                <div className="grid grid-cols-1 gap-2">
                  {presets.map((p) => (
                    <button
                      key={p.quality}
                      onClick={() => setQuality(p.quality)}
                      className={`p-2.5 rounded-xl text-left border text-xs transition-all flex items-center justify-between ${
                        quality === p.quality
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      <div>
                        <div>{p.label}</div>
                        <div className="text-[11px] font-normal text-zinc-400">{p.desc}</div>
                      </div>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {p.quality}%
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="compress-quality-slider" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Custom Quality:
                  </label>
                  <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {quality}%
                  </span>
                </div>
                <input
                  id="compress-quality-slider"
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>10% (Maximum compression)</span>
                  <span>100% (Lossless)</span>
                </div>
              </div>

              {/* Output Format */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Output Format</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['WEBP', 'JPG', 'PNG', 'AVIF', 'SVG', 'TIFF', 'BMP', 'ICO'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
                        format === fmt
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                          : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Download CTA */}
              <button
                disabled={!convertedBlob || isCompressing}
                onClick={() => {
                  if (convertedBlob) {
                    const ext = format.toLowerCase();
                    const baseName = file.name.replace(/\.[^/.]+$/, '');
                    triggerBlobDownload(convertedBlob, `${baseName}-compressed.${ext}`);
                  }
                }}
                className="w-full py-3.5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-sm font-bold shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Download Compressed Image</span>
              </button>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
