import React from 'react';
import { X, Download, ZoomIn, ZoomOut, CheckCircle2 } from 'lucide-react';
import type { ImageItem } from '../types';
import { formatBytes, triggerBlobDownload } from '../utils/imageEngine';

interface ImagePreviewModalProps {
  item: ImageItem | null;
  onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const isDone = item.status === 'done' && item.convertedBlob;
  const imageSrc = item.convertedUrl || item.previewUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121316] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white truncate">
              {item.name}
            </h3>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
              {item.originalWidth} × {item.originalHeight} px
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isDone && (
              <button
                onClick={() => {
                  const ext = item.targetFormat.toLowerCase();
                  const base = item.name.replace(/\.[^/.]+$/, '');
                  triggerBlobDownload(item.convertedBlob!, `${base}-converted.${ext}`);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Image View */}
        <div className="p-6 flex-1 overflow-auto flex items-center justify-center bg-zinc-50/50 dark:bg-black/40 min-h-[350px]">
          <img
            src={imageSrc}
            alt={item.name}
            className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-md"
          />
        </div>

        {/* Modal Footer / Stats */}
        <div className="px-6 py-3 border-t border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex flex-wrap items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 gap-2">
          <div className="flex items-center gap-4">
            <span>Original: <strong>{formatBytes(item.originalSize)}</strong> ({item.originalFormat})</span>
            {item.convertedSize && (
              <span>Converted: <strong className="text-emerald-600 dark:text-emerald-400">{formatBytes(item.convertedSize)}</strong> ({item.targetFormat})</span>
            )}
          </div>
          {item.savingsPercent !== undefined && item.savingsPercent > 0 && (
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{item.savingsPercent}% Size Reduction</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
