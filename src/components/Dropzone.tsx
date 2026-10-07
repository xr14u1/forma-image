import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Clipboard, Plus, Sparkles } from 'lucide-react';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing?: boolean;
  compact?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesSelected,
  isProcessing = false,
  compact = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Listen to clipboard paste (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) files.push(file);
        }
      }

      if (files.length > 0) {
        onFilesSelected(files);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onFilesSelected]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileList = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/') || /\.(png|jpe?g|webp|avif|gif|bmp|ico|svg|tiff|heic|heif)$/i.test(file.name)
      );
      if (fileList.length > 0) {
        onFilesSelected(fileList);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files);
      onFilesSelected(fileList);
      e.target.value = '';
    }
  };

  const formats = ['PNG', 'JPG', 'WebP', 'AVIF', 'SVG', 'TIFF', 'GIF', 'BMP', 'ICO', 'HEIC'];

  if (compact) {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full p-4 rounded-2xl border border-dashed transition-all cursor-pointer flex items-center justify-between gap-4 ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/40 shadow-lg shadow-emerald-500/15'
            : 'border-zinc-300 dark:border-white/10 bg-white dark:bg-[#0A0A0C] hover:border-emerald-500/60 dark:hover:border-emerald-400/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.png,.jpg,.jpeg,.webp,.avif,.gif,.bmp,.ico,.svg,.tiff,.heic,.heif"
          className="hidden"
          onChange={handleFileInputChange}
          disabled={isProcessing}
        />
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Plus className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-zinc-950 dark:text-white">Add more images</span>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Drag & drop or click to choose files</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
          <Clipboard className="w-3.5 h-3.5" />
          <span>Paste with Ctrl+V</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative group rounded-3xl p-8 sm:p-12 md:p-16 text-center transition-all duration-300 cursor-pointer overflow-hidden border ${
        isDragOver
          ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/30 scale-[1.01] shadow-2xl shadow-emerald-500/20'
          : 'border-zinc-200/90 dark:border-white/10 bg-white dark:bg-[#0A0A0C] hover:border-emerald-500/50 dark:hover:border-emerald-400/50 shadow-xl shadow-black/3 dark:shadow-black/60'
      }`}
      onClick={() => fileInputRef.current?.click()}
    >
      {/* Background Dot Texture */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.png,.jpg,.jpeg,.webp,.avif,.gif,.bmp,.ico,.svg,.tiff,.heic,.heif"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={isProcessing}
      />

      <div className="relative z-10 flex flex-col items-center justify-center max-w-lg mx-auto">
        
        {/* Upload Icon Badge with Emerald Radiance */}
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
          isDragOver
            ? 'bg-gradient-to-tr from-emerald-500 to-emerald-400 text-black scale-110 shadow-xl shadow-emerald-500/40'
            : 'bg-zinc-100 dark:bg-white/5 text-zinc-800 dark:text-zinc-200 group-hover:scale-105 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:bg-emerald-50/80 dark:group-hover:bg-emerald-950/30 border border-zinc-200/60 dark:border-white/5'
        }`}>
          <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:-translate-y-1 duration-300" />
        </div>

        {/* Action Title */}
        <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white mb-2">
          Drop your images here
        </h3>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm font-medium">
          Drag and drop any image files here, or click to browse from your device.
        </p>

        {/* Primary CTA Button */}
        <div className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-black text-sm font-bold shadow-lg hover:bg-emerald-600 dark:hover:bg-emerald-400 dark:hover:text-black group-hover:scale-105 transition-all duration-200 mb-6 active:scale-95">
          <ImageIcon className="w-4 h-4" />
          <span>Choose Image Files</span>
        </div>

        {/* Format Chips & Clipboard Hint */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-4">
          {formats.map((fmt) => (
            <span
              key={fmt}
              className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-white/10 group-hover:border-emerald-500/30 transition-colors"
            >
              {fmt}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 font-medium">
          <Clipboard className="w-3.5 h-3.5 text-emerald-500" />
          <span>Tip: You can also paste directly with <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/10 font-mono text-[10px] text-zinc-700 dark:text-zinc-300">Ctrl + V</kbd></span>
        </div>

      </div>
    </div>
  );
};
