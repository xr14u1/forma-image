import React from 'react';
import { ShieldCheck, Cpu, ExternalLink, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const converters = [
    { label: 'PNG to WebP', path: '/png-to-webp' },
    { label: 'JPG to WebP', path: '/jpg-to-webp' },
    { label: 'PNG to SVG', path: '/png-to-svg' },
    { label: 'SVG to PNG', path: '/svg-to-png' },
    { label: 'HEIC to JPG', path: '/heic-to-jpg' },
    { label: 'PNG to TIFF', path: '/png-to-tiff' },
    { label: 'PNG to ICO', path: '/png-to-ico' },
    { label: 'WebP to JPG', path: '/webp-to-jpg' },
    { label: 'AVIF Converter', path: '/avif-converter' },
  ];

  const tools = [
    { label: 'Batch Converter', path: '/converter' },
    { label: 'Image Compressor', path: '/compress' },
    { label: 'Image Resizer', path: '/resize' },
    { label: 'Image Cropper', path: '/crop' },
    { label: 'Rotate & Flip', path: '/rotate' },
    { label: 'Color Adjustments', path: '/optimize' },
    { label: 'EXIF Metadata Cleaner', path: '/strip-metadata' },
    { label: 'All Tools Directory', path: '/tools' },
  ];

  const legal = [
    { label: 'About Forma', path: '/about' },
    { label: 'Privacy Manifesto', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Contact & Support', path: '/contact' },
  ];

  return (
    <footer className="border-t border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-black/60 backdrop-blur-xl mt-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-zinc-200/80 dark:border-white/10">
          
          {/* Brand & Mission (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center text-black font-extrabold shadow-md shadow-emerald-500/20">
                F
              </div>
              <span className="font-bold text-lg tracking-tight text-zinc-950 dark:text-white">Forma Studio</span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm font-medium">
              Forma is a privacy-first browser image studio. All conversion, compression, and manipulation algorithms run 100% locally on your machine via client-side Canvas and WebAssembly.
            </p>
            
            {/* Developer Attribution Card */}
            <a
              href="https://snuffdied.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 max-w-sm hover:border-emerald-500/60 transition-all group shadow-sm hover:shadow-emerald-500/10"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400 block font-medium">Engineered & Designed by</span>
                  <span className="font-bold text-zinc-950 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                    snuffdied
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Popular Converters */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-white mb-3">
              Converters
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {converters.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => onNavigate(item.path)}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors text-left cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Image Tools */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-white mb-3">
              Image Tools
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {tools.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => onNavigate(item.path)}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors text-left cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & About */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-white mb-3">
              Product & Legal
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {legal.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => onNavigate(item.path)}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors text-left cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Forma Image Studio. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-500" />
              <span>GPU-Accelerated Web Canvas Engine</span>
            </span>
            <span>•</span>
            <a 
              href="https://snuffdied.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
            >
              snuffdied.vercel.app
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
