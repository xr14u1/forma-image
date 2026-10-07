import React, { useState } from 'react';
import { 
  RotateCw, 
  RotateCcw, 
  FlipHorizontal, 
  FlipVertical, 
  Download, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { processImage, formatBytes, triggerBlobDownload } from '../utils/imageEngine';
import { Dropzone } from './Dropzone';

import type { TargetFormat } from '../types';

export const RotatorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [targetFormat, setTargetFormat] = useState<TargetFormat>('PNG');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setResultBlob(null);
    setResultUrl(null);
  };

  const handleApplyTransform = async (newRot: number, newH: boolean, newV: boolean, fmt = targetFormat) => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const res = await processImage(file, {
        format: fmt,
        quality: 95,
        maintainAspectRatio: true,
        stripMetadata: false,
        rotation: newRot,
        flipHorizontal: newH,
        flipVertical: newV,
      });

      setResultBlob(res.blob);
      const url = URL.createObjectURL(res.blob);
      setResultUrl(url);
    } catch (err) {
      console.error('Transform failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRotateRight = () => {
    const next = (rotation + 90) % 360;
    setRotation(next);
    handleApplyTransform(next, flipH, flipV);
  };

  const handleRotateLeft = () => {
    const next = (rotation + 270) % 360;
    setRotation(next);
    handleApplyTransform(next, flipH, flipV);
  };

  const handleToggleFlipH = () => {
    const next = !flipH;
    setFlipH(next);
    handleApplyTransform(rotation, next, flipV);
  };

  const handleToggleFlipV = () => {
    const next = !flipV;
    setFlipV(next);
    handleApplyTransform(rotation, flipH, next);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
          <RotateCw className="w-3.5 h-3.5" />
          <span>Lossless Orientation Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Rotate & Flip Images Instantly
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Rotate clockwise, counter-clockwise, 180°, or mirror horizontally and vertically with zero quality loss.
        </p>
      </div>

      {!file ? (
        <Dropzone onFilesSelected={handleFilesSelected} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Preview Area */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 text-xs font-mono text-zinc-400">
                <span>Rotation: {rotation}°</span>
                <span>
                  Flip: {flipH ? 'H ' : ''}{flipV ? 'V' : ''}{!flipH && !flipV ? 'None' : ''}
                </span>
              </div>

              <div className="relative rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 overflow-hidden flex items-center justify-center min-h-[300px] max-h-[460px]">
                <img
                  src={resultUrl || previewUrl || ''}
                  alt="Transformed preview"
                  className="max-h-[440px] w-auto object-contain rounded-xl transition-all duration-200"
                />
              </div>

              {resultBlob && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                  <span>Transformed • {formatBytes(resultBlob.size)}</span>
                  <button
                    onClick={() => {
                      const ext = targetFormat.toLowerCase();
                      const base = file.name.replace(/\.[^/.]+$/, '');
                      triggerBlobDownload(resultBlob, `${base}-rotated.${ext}`);
                    }}
                    className="font-bold underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download ({targetFormat})</span>
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

          {/* Action Buttons */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-sm space-y-5">
              
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">Orientation Controls</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Click any action to transform instantly.
                </p>
              </div>

              {/* Rotate grid */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Rotation</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleRotateLeft}
                    className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                  >
                    <RotateCcw className="w-4 h-4 text-indigo-500" />
                    <span>Rotate Left (90°)</span>
                  </button>
                  <button
                    onClick={handleRotateRight}
                    className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                  >
                    <RotateCw className="w-4 h-4 text-indigo-500" />
                    <span>Rotate Right (90°)</span>
                  </button>
                </div>
              </div>

              {/* Flip grid */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Mirror / Flip</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleToggleFlipH}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      flipH
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                    }`}
                  >
                    <FlipHorizontal className="w-4 h-4" />
                    <span>Flip Horizontal</span>
                  </button>
                  <button
                    onClick={handleToggleFlipV}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      flipV
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                    }`}
                  >
                    <FlipVertical className="w-4 h-4" />
                    <span>Flip Vertical</span>
                  </button>
                </div>
              </div>

              {/* Output Format */}
              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Output Format</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['PNG', 'JPG', 'WEBP', 'AVIF', 'SVG', 'TIFF', 'BMP', 'ICO'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => {
                        setTargetFormat(fmt);
                        handleApplyTransform(rotation, flipH, flipV, fmt);
                      }}
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

              {/* Reset action */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => {
                    setRotation(0);
                    setFlipH(false);
                    setFlipV(false);
                    handleApplyTransform(0, false, false, targetFormat);
                  }}
                  className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                >
                  Reset to Original Orientation
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
