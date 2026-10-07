import React from 'react';
import { ShieldCheck, CheckCircle2, Zap, ExternalLink, Code2, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-10 py-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About the Platform</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          About Forma Image Studio
        </h1>
        <p className="text-base text-zinc-500 dark:text-zinc-400 font-medium">
          Reinventing web image manipulation with private, client-side engineering.
        </p>
      </div>

      {/* Creator Attribution Section */}
      <div className="p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-[#0A0A0C] shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Lead Creator & Engineer
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-zinc-950 dark:text-white">
              Developed by snuffdied
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-lg font-medium">
              Designed and built as a modern, privacy-first utility platform. Explore more tools, projects, and experiments on the official portfolio.
            </p>
          </div>

          <a
            href="https://snuffdied.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Visit Portfolio</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Mission */}
      <div className="rounded-3xl border border-zinc-200/90 dark:border-white/10 bg-white dark:bg-[#0A0A0C] p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">Our Mission</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
          Most image converter tools on the web require you to upload your sensitive photos, private documents, or personal graphics to remote servers. This introduces security vulnerabilities, privacy compromises, and unnecessary network delays.
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
          Forma was engineered from the ground up to operate completely inside your local browser sandbox. By leveraging modern HTML5 Canvas, modern browser codecs, and optimized WebAssembly encoders, we process images instantly without a single byte leaving your machine.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl border border-zinc-200/90 dark:border-white/10 bg-white dark:bg-[#0A0A0C] space-y-2.5 oled-card-hover">
          <div className="p-2.5 w-fit rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-zinc-950 dark:text-white">Absolute Privacy</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
            Zero cloud uploads. Your images remain in your device memory and are destroyed immediately upon closing your browser tab.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-zinc-200/90 dark:border-white/10 bg-white dark:bg-[#0A0A0C] space-y-2.5 oled-card-hover">
          <div className="p-2.5 w-fit rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-zinc-950 dark:text-white">Lightning Fast</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
            No upload queue, no network latency. Direct GPU/CPU hardware acceleration handles 4K+ images in milliseconds.
          </p>
        </div>
      </div>

      {/* Tech Specifications */}
      <div className="rounded-3xl border border-zinc-200/90 dark:border-white/10 bg-white dark:bg-[#0A0A0C] p-6 space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Architecture & Technology
        </h3>
        <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-300 font-medium">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>High-precision bicubic resampling with canvas anti-aliasing</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Pure client-side BMP 24/32-bit & ICO multi-resolution binary encoders</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Pure vector XML SVG container generation & rasterization</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>TIFF 6.0 binary encoder with 72 DPI print IFD tags</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Apple iPhone HEIC/HEIF client-side decoding via WebAssembly</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Deflate ZIP compression engine powered by JSZip</span>
          </li>
        </ul>
      </div>

    </div>
  );
};
