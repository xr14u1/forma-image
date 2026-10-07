import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, HardDrive } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-10 py-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy Manifesto</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          Your Privacy Is Guaranteed
        </h1>
        <p className="text-base text-zinc-500 dark:text-zinc-400">
          Last updated: October 2026. How Forma handles your files and data.
        </p>
      </div>

      {/* Hero Guarantee */}
      <div className="p-6 sm:p-8 rounded-3xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-4">
        <h2 className="text-lg font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>The Zero-Upload Guarantee</span>
        </h2>
        <p className="text-sm text-emerald-800/90 dark:text-emerald-300 leading-relaxed">
          When you select or drop an image into Forma, it is loaded directly into your browser's local RAM. No API requests transmitting image binaries are made to Forma or any third-party infrastructure.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-8 text-sm text-zinc-600 dark:text-zinc-300">
        
        <section className="space-y-3">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            1. Client-Side Image Processing
          </h3>
          <p className="leading-relaxed">
            All format conversion (PNG, JPG, WebP, AVIF, BMP, ICO), resizing, compression, cropping, and filtering operations are performed exclusively via HTML5 Canvas, Web Workers, and WebAssembly APIs on your local device.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            2. EXIF & Geolocation Scrubbing
          </h3>
          <p className="leading-relaxed">
            By default, canvas export in modern browsers discards EXIF tags, GPS coordinates, and camera metadata unless explicitly stored. When using our EXIF Scrubber tool, we ensure no tracking artifacts remain in the output files.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            3. Zero Tracking & No Third-Party Ads
          </h3>
          <p className="leading-relaxed">
            Forma is completely free, does not use advertising trackers or third-party ad networks, and requires no account registrations or subscriptions. Your browsing experience remains private and distraction-free.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            4. Local Storage
          </h3>
          <p className="leading-relaxed">
            We store only your theme preference (Dark or Light mode) inside your browser's `localStorage`. No identifiers, session tracking, or file histories are stored.
          </p>
        </section>

      </div>

    </div>
  );
};
