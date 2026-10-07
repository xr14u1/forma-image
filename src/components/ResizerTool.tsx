import React, { useState, useEffect } from 'react';
import { 
  Maximize2, 
  Download, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Sliders, 
  Sparkles,
  Percent,
  Hash
} from 'lucide-react';
import { processImage, formatBytes, triggerBlobDownload } from '../utils/imageEngine';
import { Dropzone } from './Dropzone';
import type { TargetFormat } from '../types';

export const ResizerTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [maintainAspect, setMaintainAspect] = useState<boolean>(true);
  const [resizeMode, setResizeMode] = useState<'pixels' | 'percentage'>('pixels');
  const [percentage, setPercentage] = useState<number>(100);
  const [targetFormat, setTargetFormat] = useState<TargetFormat>('WEBP');
  const [quality, setQuality] = useState<number>(90);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      setOrigWidth(img.naturalWidth);
      setOrigHeight(img.naturalHeight);
      setTargetWidth(img.naturalWidth);
      setTargetHeight(img.naturalHeight);
      setPercentage(100);
    };
    img.src = url;
  };

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (maintainAspect && origWidth > 0 && origHeight > 0) {
      const ratio = origWidth / origHeight;
      setTargetHeight(Math.round(val / ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (maintainAspect && origWidth > 0 && origHeight > 0) {
      const ratio = origWidth / origHeight;
      setTargetWidth(Math.round(val * ratio));
    }
  };

  const handlePercentageChange = (pct: number) => {
    setPercentage(pct);
    const factor = pct / 100;
    setTargetWidth(Math.round(origWidth * factor));
    setTargetHeight(Math.round(origHeight * factor));
  };

  const presets = [
    { label: 'Instagram Square', w: 1080, h: 1080, desc: '1:1 Ratio' },
    { label: 'Instagram Portrait', w: 1080, h: 1350, desc: '4:5 Ratio' },
    { label: 'Story / Reel / TikTok', w: 1080, h: 1920, desc: '9:16 Ratio' },
    { label: 'YouTube Thumbnail / HD', w: 1280, h: 720, desc: '16:9 720p' },
    { label: 'Full HD Landscape', w: 1920, h: 1080, desc: '16:9 1080p' },
  ];

  const handleApplyPreset = (w: number, h: number) => {
    setResizeMode('pixels');
    setTargetWidth(w);
    setTargetHeight(h);
  };

  const handleExecuteResize = async () => {
    if (!file || targetWidth <= 0 || targetHeight <= 0) return;
    setIsProcessing(true);
    try {
      const res = await processImage(file, {
        format: targetFormat,
        quality: quality,
        width: targetWidth,
        height: targetHeight,
        maintainAspectRatio: false, // Explicit user-defined dimensions
        stripMetadata: false,
      });

      setResultBlob(res.blob);
      const url = URL.createObjectURL(res.blob);
      setResultUrl(url);
    } catch (err) {
      console.error('Resize failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
          <Maximize2 className="w-3.5 h-3.5" />
          <span>High-Precision Resizer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Resize Images to Exact Dimensions
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Scale pixels or percentages with high-fidelity interpolation and social media presets.
        </p>
      </div>

      {!file ? (
        <Dropzone onFilesSelected={handleFilesSelected} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Preview Canvas */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                  Target Dimensions: {targetWidth} × {targetHeight} px
                </span>
                <span className="text-xs text-zinc-500">
                  Original: {origWidth} × {origHeight} px
                </span>
              </div>

              <div className="relative rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 overflow-hidden flex items-center justify-center min-h-[300px] max-h-[460px]">
                <img
                  src={resultUrl || previewUrl || ''}
                  alt="Resized preview"
                  className="max-h-[440px] w-auto object-contain rounded-xl"
                />
              </div>

              {resultBlob && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                  <span>Resized successfully • {formatBytes(resultBlob.size)}</span>
                  <button
                    onClick={() => {
                      const ext = targetFormat.toLowerCase();
                      const base = file.name.replace(/\.[^/.]+$/, '');
                      triggerBlobDownload(resultBlob, `${base}-${targetWidth}x${targetHeight}.${ext}`);
                    }}
                    className="font-bold underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Resized File</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
                setResultBlob(null);
              }}
              className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
            >
              Choose a different image
            </button>
          </div>

          {/* Controls */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-sm space-y-5">
              
              {/* Mode Toggle: Pixels vs Percentage */}
              <div className="flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60">
                <button
                  onClick={() => setResizeMode('pixels')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    resizeMode === 'pixels'
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  <Hash className="w-3.5 h-3.5" />
                  <span>By Pixels</span>
                </button>
                <button
                  onClick={() => setResizeMode('percentage')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    resizeMode === 'percentage'
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" />
                  <span>By Percentage</span>
                </button>
              </div>

              {/* Pixel Inputs */}
              {resizeMode === 'pixels' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="resize-width-input" className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">
                        Width (px):
                      </label>
                      <input
                        id="resize-width-input"
                        type="number"
                        value={targetWidth || ''}
                        onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-bold font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="resize-height-input" className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">
                        Height (px):
                      </label>
                      <input
                        id="resize-height-input"
                        type="number"
                        value={targetHeight || ''}
                        onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-bold font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Lock Aspect Ratio Toggle */}
                  <button
                    onClick={() => setMaintainAspect(!maintainAspect)}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      maintainAspect
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700'
                    }`}
                  >
                    {maintainAspect ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Lock Aspect Ratio (Active)</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Aspect Ratio Unlocked (Free)</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Percentage Slider */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="resize-percentage-slider" className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">Scale Factor:</label>
                    <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
                      {percentage}%
                    </span>
                  </div>
                  <input
                    id="resize-percentage-slider"
                    type="range"
                    min="10"
                    max="200"
                    value={percentage}
                    onChange={(e) => handlePercentageChange(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    {[25, 50, 75, 100].map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePercentageChange(p)}
                        className={`py-1 rounded-lg text-xs font-mono font-semibold border ${
                          percentage === p
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600'
                            : 'border-zinc-200 dark:border-zinc-800 text-zinc-500'
                        }`}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Standard Presets */}
              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Standard Presets</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {presets.map((pr) => (
                    <button
                      key={pr.label}
                      onClick={() => handleApplyPreset(pr.w, pr.h)}
                      className="w-full p-2 rounded-xl text-left border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 text-xs flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-zinc-900 dark:text-white">{pr.label}</div>
                        <div className="text-[10px] text-zinc-400">{pr.desc}</div>
                      </div>
                      <span className="font-mono text-[11px] text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                        {pr.w}×{pr.h}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Output Format */}
              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Output Format</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['WEBP', 'PNG', 'JPG', 'AVIF', 'SVG', 'TIFF', 'BMP', 'ICO'] as const).map((fmt) => (
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

              {/* Execute / Apply Resize */}
              <button
                disabled={isProcessing}
                onClick={handleExecuteResize}
                className="w-full py-3.5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-sm font-bold shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Resampling pixels...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Apply Resize</span>
                  </>
                )}
              </button>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
