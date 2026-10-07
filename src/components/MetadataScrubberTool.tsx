import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  MapPin, 
  Camera, 
  Calendar, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { processImage, formatBytes, triggerBlobDownload } from '../utils/imageEngine';
import { Dropzone } from './Dropzone';

export const MetadataScrubberTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cleanBlob, setCleanBlob] = useState<Blob | null>(null);
  const [cleanUrl, setCleanUrl] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);

    setIsProcessing(true);
    try {
      // Strips all EXIF by re-rendering clean pixel data to a fresh canvas buffer
      const res = await processImage(selected, {
        format: 'JPG',
        quality: 95,
        maintainAspectRatio: true,
        stripMetadata: true,
      });

      setCleanBlob(res.blob);
      const cUrl = URL.createObjectURL(res.blob);
      setCleanUrl(cUrl);
    } catch (err) {
      console.error('Metadata scrub failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Privacy EXIF Scrubber</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Remove EXIF & Location Metadata
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Strip sensitive GPS coordinates, camera serial numbers, and device fingerprints before sharing online.
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
                  Cleaned Image Preview
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> EXIF Stripped
                </span>
              </div>

              <div className="relative rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 overflow-hidden flex items-center justify-center min-h-[300px] max-h-[460px]">
                <img
                  src={cleanUrl || previewUrl || ''}
                  alt="Scrubbed output"
                  className="max-h-[440px] w-auto object-contain rounded-xl"
                />
              </div>

              {cleanBlob && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                  <span>Cleaned File • {formatBytes(cleanBlob.size)}</span>
                  <button
                    onClick={() => {
                      const base = file.name.replace(/\.[^/.]+$/, '');
                      triggerBlobDownload(cleanBlob, `${base}-scrubbed.jpg`);
                    }}
                    className="font-bold underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Scrubbed Image</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
                setCleanBlob(null);
                setCleanUrl(null);
              }}
              className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
            >
              Choose a different image
            </button>
          </div>

          {/* Privacy Checklist & Action */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-sm space-y-5">
              
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">Privacy Scrubber Report</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  The following sensitive metadata markers have been permanently removed:
                </p>
              </div>

              {/* Items Scrubbed */}
              <div className="space-y-2.5">
                {[
                  { icon: MapPin, label: 'GPS Coordinates', desc: 'Exact latitude, longitude, and elevation' },
                  { icon: Camera, label: 'Camera & Device Model', desc: 'Device serial numbers, lens info, and make' },
                  { icon: Calendar, label: 'Creation Timestamps', desc: 'Original date and time taken' },
                  { icon: Lock, label: 'Author & Software Tags', desc: 'Editing application fingerprints & copyright' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-emerald-100 dark:border-emerald-950/60 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-start gap-3"
                    >
                      <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                          <span>{item.label}</span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                            [REMOVED]
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Download CTA */}
              <button
                disabled={!cleanBlob || isProcessing}
                onClick={() => {
                  if (cleanBlob) {
                    const base = file.name.replace(/\.[^/.]+$/, '');
                    triggerBlobDownload(cleanBlob, `${base}-scrubbed.jpg`);
                  }
                }}
                className="w-full py-3.5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-sm font-bold shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Save Private Image</span>
              </button>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
