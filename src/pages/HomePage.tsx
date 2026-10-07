import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Minimize2, 
  Maximize2, 
  Crop, 
  RotateCw, 
  Check, 
  ChevronRight,
  HelpCircle,
  Zap,
  Lock,
  Flame
} from 'lucide-react';
import { Dropzone } from '../components/Dropzone';
import { BatchConverter } from '../components/BatchConverter';
import type { ImageItem } from '../types';

interface HomePageProps {
  items: ImageItem[];
  onFilesSelected: (files: File[]) => void;
  onUpdateItem: (id: string, updates: Partial<ImageItem>) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onConvertItem: (id: string) => Promise<void>;
  onConvertAll: () => Promise<void>;
  onDownloadZip: () => Promise<void>;
  onPreviewImage: (item: ImageItem) => void;
  isProcessingAll: boolean;
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  items,
  onFilesSelected,
  onUpdateItem,
  onRemoveItem,
  onClearAll,
  onConvertItem,
  onConvertAll,
  onDownloadZip,
  onPreviewImage,
  isProcessingAll,
  onNavigate,
}) => {
  const popularConverters = [
    { title: 'PNG to WebP', desc: 'Shrink PNG sizes up to 80% with transparency', path: '/png-to-webp' },
    { title: 'JPG to WebP', desc: 'Modern web image format for faster loading', path: '/jpg-to-webp' },
    { title: 'PNG to SVG', desc: 'Convert raster graphics to scalable SVG vector', path: '/png-to-svg' },
    { title: 'SVG to PNG', desc: 'Render scalable SVG vectors into crisp PNG', path: '/svg-to-png' },
    { title: 'HEIC to JPG', desc: 'Convert Apple iPhone HEIC/HEIF photos to JPG', path: '/heic-to-jpg' },
    { title: 'PNG to TIFF', desc: 'Export high-res uncompressed TIFF for print', path: '/png-to-tiff' },
    { title: 'PNG to ICO', desc: 'Generate multi-resolution website favicons', path: '/png-to-ico' },
    { title: 'WebP to JPG', desc: 'Convert WebP to universal high-res JPEG', path: '/webp-to-jpg' },
    { title: 'AVIF Converter', desc: 'Next-generation compression with AV1 codec', path: '/avif-converter' },
  ];

  const coreTools = [
    {
      title: 'Image Compressor',
      desc: 'Optimize file size with real-time before/after quality control.',
      path: '/compress',
      icon: Minimize2,
      badge: 'Up to 85% smaller',
    },
    {
      title: 'Image Resizer',
      desc: 'Preset dimensions for Instagram, YouTube, X, and custom aspect ratios.',
      path: '/resize',
      icon: Maximize2,
      badge: 'Precise Scaling',
    },
    {
      title: 'Image Cropper',
      desc: 'Crop to 1:1, 4:3, 16:9 or custom regions with instant feedback.',
      path: '/crop',
      icon: Crop,
      badge: 'Visual Grid',
    },
    {
      title: 'Rotate & Flip',
      desc: 'Instant 90°, 180° rotation and horizontal or vertical mirroring.',
      path: '/rotate',
      icon: RotateCw,
      badge: 'Lossless',
    },
  ];

  const faqs = [
    {
      q: 'Are my images uploaded to any server?',
      a: 'Never. Forma processes 100% of your images locally in your web browser using HTML5 Canvas, Web Workers, and WebAssembly. Your photos never leave your device, ensuring complete privacy for personal documents and photos.',
    },
    {
      q: 'Can I convert multiple images at the same time?',
      a: 'Yes! Batch conversion is built right into the platform. You can upload dozens of images simultaneously, customize target formats or quality levels individually or globally, and download all converted files in one convenient .ZIP archive.',
    },
    {
      q: 'What formats are supported for conversion?',
      a: 'Forma supports PNG, JPG/JPEG, WebP, AVIF, SVG, TIFF, GIF, BMP, ICO (multi-resolution icons), HEIC/HEIF (iPhone photos), and clipboard image pasting.',
    },
    {
      q: 'Is Forma free to use?',
      a: 'Yes, Forma is 100% free with no file upload limits, no daily restrictions, and no watermarks.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 animate-in fade-in duration-300">
      
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 pb-4 text-center space-y-6">
        
        {/* Floating Privacy Pill with Qraft Mint Glow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/10 animate-float">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>100% Client-Side Engine • Zero Server Uploads</span>
        </div>

        {/* Hero Title with Gradient Text */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-zinc-950 dark:text-white max-w-4xl mx-auto leading-[1.08]">
          Convert images without the <span className="bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-[#00E599] dark:to-[#05DF72] bg-clip-text text-transparent">complicated stuff.</span>
        </h1>

        {/* Hero Tagline */}
        <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
          Convert, compress, resize, crop, and optimize your images directly inside your browser. Fast, free, and completely private.
        </p>

        {/* Upload Zone / Batch Queue */}
        <div className="pt-4 max-w-4xl mx-auto">
          {items.length === 0 ? (
            <Dropzone onFilesSelected={onFilesSelected} />
          ) : (
            <div className="space-y-6">
              <BatchConverter
                items={items}
                onUpdateItem={onUpdateItem}
                onRemoveItem={onRemoveItem}
                onClearAll={onClearAll}
                onConvertItem={onConvertItem}
                onConvertAll={onConvertAll}
                onDownloadZip={onDownloadZip}
                onPreviewImage={onPreviewImage}
                isProcessingAll={isProcessingAll}
              />
              <Dropzone onFilesSelected={onFilesSelected} compact={true} />
            </div>
          )}
        </div>
      </section>

      {/* Feature Showcase Grid: Dedicated Tools */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Comprehensive Image Toolkit
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto font-medium">
            Everything you need to optimize and manipulate photos right in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {coreTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.path}
                onClick={() => onNavigate(tool.path)}
                className="group p-6 rounded-3xl oled-card oled-card-hover transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-white/5">
                      {tool.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-zinc-950 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed font-medium">
                      {tool.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-white/10 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>Open Tool</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Format Converters Directory */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200/80 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              Popular Format Conversions
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Direct pathways optimized for web performance, vectors, and image quality.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/tools')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Tools & Formats</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularConverters.map((conv) => (
            <button
              key={conv.path}
              onClick={() => onNavigate(conv.path)}
              className="p-4 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#0A0A0C] hover:border-emerald-500/60 dark:hover:border-emerald-400/60 text-left transition-all group flex items-center justify-between shadow-xs hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer"
            >
              <div>
                <h4 className="text-sm font-bold text-zinc-950 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                  {conv.title}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">{conv.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </section>

      {/* Why Forma — Client-Side Architecture vs Traditional Uploaders */}
      <section className="rounded-3xl border border-zinc-200/90 dark:border-white/10 bg-white dark:bg-[#0A0A0C] p-6 sm:p-10 shadow-xl">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              Why In-Browser Processing Wins
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
              Traditional converters upload your personal photos to unknown remote servers. Forma processes everything locally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional Converter */}
            <div className="p-5 rounded-2xl border border-rose-200/70 dark:border-rose-950/60 bg-rose-50/30 dark:bg-rose-950/10 space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Traditional Converters
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Files uploaded to third-party cloud servers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Slow upload and download times on large files</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Strict file size limits (5 MB to 10 MB)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Queue waiting times and paid tier limits</span>
                </li>
              </ul>
            </div>

            {/* Forma Studio */}
            <div className="p-5 rounded-2xl border border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Forma Browser Studio
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-800 dark:text-zinc-200 font-medium">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>100% Private</strong> — 0 bytes sent over the wire</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Instant Speed</strong> — runs on your GPU & CPU</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>No Arbitrary Limits</strong> — batch convert heavy albums</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Full Toolkit</strong> — SVG, TIFF, HEIC, WebP, ICO, AVIF</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Got questions about how our browser image engine works?
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#0A0A0C] space-y-2 shadow-xs"
            >
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 pl-6 leading-relaxed font-medium">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
