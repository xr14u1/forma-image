import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, 
  Download, 
  Sparkles, 
  RefreshCw, 
  Sun, 
  Contrast, 
  EyeOff, 
  Layers 
} from 'lucide-react';
import { processImage, formatBytes, triggerBlobDownload } from '../utils/imageEngine';
import { Dropzone } from './Dropzone';
import type { ImageFilterSettings, TargetFormat } from '../types';

export const OptimizerTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<TargetFormat>('PNG');
  
  const [filters, setFilters] = useState<ImageFilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    grayscale: 0,
    invert: 0,
    blur: 0,
    sepia: 0,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      grayscale: 0,
      invert: 0,
      blur: 0,
      sepia: 0,
    });
  };

  useEffect(() => {
    if (!file) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsProcessing(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await processImage(file, {
          format: targetFormat,
          quality: 95,
          maintainAspectRatio: true,
          stripMetadata: false,
          filters: filters,
        });

        setResultBlob(res.blob);
        const url = URL.createObjectURL(res.blob);
        setResultUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      } catch (err) {
        console.error('Adjustment failed:', err);
      } finally {
        setIsProcessing(false);
      }
    }, 150);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [file, filters, targetFormat]);

  const updateFilter = (key: keyof ImageFilterSettings, val: number) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      grayscale: 0,
      invert: 0,
      blur: 0,
      sepia: 0,
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
          <Sliders className="w-3.5 h-3.5" />
          <span>Color & Exposure Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Optimize & Fine-Tune Image Filters
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Adjust brightness, enhance contrast, tweak saturation, and apply vintage sepia or monochrome in real-time.
        </p>
      </div>

      {!file ? (
        <Dropzone onFilesSelected={handleFilesSelected} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                  Live Filter Preview
                </span>
                {isProcessing && (
                  <span className="text-xs text-indigo-600 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Rendering...
                  </span>
                )}
              </div>

              <div className="relative rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 overflow-hidden flex items-center justify-center min-h-[300px] max-h-[460px]">
                <img
                  src={resultUrl || previewUrl || ''}
                  alt="Optimized preview"
                  className="max-h-[440px] w-auto object-contain rounded-xl"
                />
              </div>

              {resultBlob && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                  <span>Enhanced Result • {formatBytes(resultBlob.size)}</span>
                  <button
                    onClick={() => {
                      const ext = targetFormat.toLowerCase();
                      const base = file.name.replace(/\.[^/.]+$/, '');
                      triggerBlobDownload(resultBlob, `${base}-enhanced.${ext}`);
                    }}
                    className="font-bold underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Enhanced ({targetFormat})</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
                setResultBlob(null);
                setResultUrl(null);
              }}
              className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
            >
              Choose a different image
            </button>
          </div>

          {/* Controls Sliders */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-sm space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">Color Settings</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Live hardware-accelerated adjustments</p>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-xs font-medium text-zinc-400 hover:text-indigo-600"
                >
                  Reset
                </button>
              </div>

              {/* Brightness */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-700 dark:text-zinc-300">Brightness</span>
                  <span className="font-mono text-zinc-500">{filters.brightness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.brightness}
                  onChange={(e) => updateFilter('brightness', parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-700 dark:text-zinc-300">Contrast</span>
                  <span className="font-mono text-zinc-500">{filters.contrast}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.contrast}
                  onChange={(e) => updateFilter('contrast', parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-700 dark:text-zinc-300">Saturation</span>
                  <span className="font-mono text-zinc-500">{filters.saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.saturation}
                  onChange={(e) => updateFilter('saturation', parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Grayscale */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-700 dark:text-zinc-300">Grayscale (Monochrome)</span>
                  <span className="font-mono text-zinc-500">{filters.grayscale}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.grayscale}
                  onChange={(e) => updateFilter('grayscale', parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Sepia */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-700 dark:text-zinc-300">Vintage Sepia</span>
                  <span className="font-mono text-zinc-500">{filters.sepia}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.sepia}
                  onChange={(e) => updateFilter('sepia', parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Invert */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-700 dark:text-zinc-300">Invert Colors</span>
                  <span className="font-mono text-zinc-500">{filters.invert}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.invert}
                  onChange={(e) => updateFilter('invert', parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Output Format */}
              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Output Format</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['PNG', 'JPG', 'WEBP', 'AVIF', 'SVG', 'TIFF', 'BMP', 'ICO'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setTargetFormat(fmt)}
                      className={`py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
                        targetFormat === fmt
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                          : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
