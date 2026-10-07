import React, { useState, useRef, useEffect } from 'react';
import { 
  Crop as CropIcon, 
  Download, 
  RefreshCw, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { processImage, formatBytes, triggerBlobDownload } from '../utils/imageEngine';
import { Dropzone } from './Dropzone';
import type { CropRect, TargetFormat } from '../types';

export const CropperTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [cropRect, setCropRect] = useState<CropRect>({ x: 0, y: 0, width: 100, height: 100 });
  const [aspectPreset, setAspectPreset] = useState<'free' | '1:1' | '4:3' | '16:9' | '3:2'>('free');
  const [targetFormat, setTargetFormat] = useState<TargetFormat>('PNG');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      // Initialize crop to central 80%
      const initW = Math.round(img.naturalWidth * 0.8);
      const initH = Math.round(img.naturalHeight * 0.8);
      const initX = Math.round((img.naturalWidth - initW) / 2);
      const initY = Math.round((img.naturalHeight - initH) / 2);
      setCropRect({ x: initX, y: initY, width: initW, height: initH });
    };
    img.src = url;
  };

  const applyPresetRatio = (preset: 'free' | '1:1' | '4:3' | '16:9' | '3:2') => {
    setAspectPreset(preset);
    if (preset === 'free' || imageDimensions.width === 0) return;

    let targetRatio = 1;
    if (preset === '1:1') targetRatio = 1;
    if (preset === '4:3') targetRatio = 4 / 3;
    if (preset === '16:9') targetRatio = 16 / 9;
    if (preset === '3:2') targetRatio = 3 / 2;

    const maxW = imageDimensions.width;
    const maxH = imageDimensions.height;

    let newW = maxW * 0.8;
    let newH = newW / targetRatio;

    if (newH > maxH * 0.9) {
      newH = maxH * 0.8;
      newW = newH * targetRatio;
    }

    newW = Math.round(newW);
    newH = Math.round(newH);
    const newX = Math.round((maxW - newW) / 2);
    const newY = Math.round((maxH - newH) / 2);

    setCropRect({ x: Math.max(0, newX), y: Math.max(0, newY), width: newW, height: newH });
  };

  const handleExecuteCrop = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const res = await processImage(file, {
        format: targetFormat,
        quality: 95,
        maintainAspectRatio: false,
        stripMetadata: false,
        crop: cropRect,
      });

      setCroppedBlob(res.blob);
      const url = URL.createObjectURL(res.blob);
      setCroppedUrl(url);
    } catch (err) {
      console.error('Crop failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
          <CropIcon className="w-3.5 h-3.5" />
          <span>Pixel-Accurate Cropper</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Crop Images with Precision
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Cut out unwanted areas, adjust aspect ratios, and export high-resolution cropped photos in seconds.
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
                  Crop Box: {cropRect.width} × {cropRect.height} px
                </span>
                <span className="text-xs text-zinc-500">
                  Origin: ({cropRect.x}, {cropRect.y})
                </span>
              </div>

              {/* Viewport */}
              <div className="relative rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 overflow-hidden flex items-center justify-center min-h-[320px] max-h-[460px]">
                {croppedUrl ? (
                  <img
                    src={croppedUrl}
                    alt="Cropped result"
                    className="max-h-[440px] w-auto object-contain rounded-xl"
                  />
                ) : (
                  <img
                    ref={imgRef}
                    src={previewUrl || ''}
                    alt="Source for cropping"
                    className="max-h-[440px] w-auto object-contain rounded-xl opacity-90"
                  />
                )}
              </div>

              {croppedBlob && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                  <span>Cropped Output • {formatBytes(croppedBlob.size)}</span>
                  <button
                    onClick={() => {
                      const ext = targetFormat.toLowerCase();
                      const base = file.name.replace(/\.[^/.]+$/, '');
                      triggerBlobDownload(croppedBlob, `${base}-cropped.${ext}`);
                    }}
                    className="font-bold underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Cropped ({targetFormat})</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
                setCroppedBlob(null);
                setCroppedUrl(null);
              }}
              className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
            >
              Choose a different image
            </button>
          </div>

          {/* Controls */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-sm space-y-5">
              
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">Crop Ratios & Offsets</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Select standard aspect ratio presets or specify exact pixel regions.
                </p>
              </div>

              {/* Aspect Ratio Presets */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Aspect Presets</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['free', '1:1', '4:3', '16:9', '3:2'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => applyPresetRatio(r)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                        aspectPreset === r
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                          : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                      }`}
                    >
                      {r.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pixel Coordinates */}
              <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">Crop Width (px):</label>
                    <input
                      type="number"
                      value={cropRect.width}
                      onChange={(e) => setCropRect({ ...cropRect, width: parseInt(e.target.value, 10) || 10 })}
                      className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono font-bold text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">Crop Height (px):</label>
                    <input
                      type="number"
                      value={cropRect.height}
                      onChange={(e) => setCropRect({ ...cropRect, height: parseInt(e.target.value, 10) || 10 })}
                      className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono font-bold text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">X Offset (px):</label>
                    <input
                      type="number"
                      value={cropRect.x}
                      onChange={(e) => setCropRect({ ...cropRect, x: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono font-bold text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">Y Offset (px):</label>
                    <input
                      type="number"
                      value={cropRect.y}
                      onChange={(e) => setCropRect({ ...cropRect, y: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono font-bold text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
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

              {/* Execute Button */}
              <button
                disabled={isProcessing}
                onClick={handleExecuteCrop}
                className="w-full py-3.5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-sm font-bold shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Cropping...</span>
                  </>
                ) : (
                  <>
                    <CropIcon className="w-4 h-4" />
                    <span>Apply Crop</span>
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
