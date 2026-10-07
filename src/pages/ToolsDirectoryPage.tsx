import React from 'react';
import { 
  Layers, 
  Minimize2, 
  Maximize2, 
  Crop, 
  RotateCw, 
  Sliders, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  FileImage
} from 'lucide-react';

interface ToolsDirectoryPageProps {
  onNavigate: (path: string) => void;
}

export const ToolsDirectoryPage: React.FC<ToolsDirectoryPageProps> = ({ onNavigate }) => {
  const allTools = [
    {
      title: 'Batch Image Converter',
      path: '/converter',
      desc: 'Convert single or multiple images simultaneously between PNG, JPG, WebP, AVIF, GIF, BMP, and ICO.',
      icon: Layers,
      category: 'Conversion',
    },
    {
      title: 'Image Compressor',
      path: '/compress',
      desc: 'Reduce image file sizes up to 85% with hardware-accelerated quantization and live side-by-side preview.',
      icon: Minimize2,
      category: 'Optimization',
    },
    {
      title: 'Image Resizer',
      path: '/resize',
      desc: 'Resize images to custom width/height or preset resolutions for Instagram, YouTube, X, and Web.',
      icon: Maximize2,
      category: 'Transformation',
    },
    {
      title: 'Image Cropper',
      path: '/crop',
      desc: 'Crop photos with 1:1, 4:3, 16:9, and freeform aspect ratios with pixel coordinate precision.',
      icon: Crop,
      category: 'Transformation',
    },
    {
      title: 'Rotate & Flip',
      path: '/rotate',
      desc: 'Lossless 90-degree and 180-degree rotation, plus horizontal and vertical mirroring.',
      icon: RotateCw,
      category: 'Transformation',
    },
    {
      title: 'Color Filters & Exposure',
      path: '/optimize',
      desc: 'Adjust brightness, contrast, saturation, vintage sepia, and monochrome grayscale.',
      icon: Sliders,
      category: 'Optimization',
    },
    {
      title: 'EXIF Metadata Scrubber',
      path: '/strip-metadata',
      desc: 'Remove hidden GPS geolocation, camera serial numbers, and device fingerprints for total privacy.',
      icon: ShieldCheck,
      category: 'Privacy',
    },
  ];

  const formatConverters = [
    { from: 'PNG', to: 'WebP', path: '/png-to-webp', desc: 'Preserves transparency with 80% smaller size' },
    { from: 'JPG', to: 'WebP', path: '/jpg-to-webp', desc: 'Superior web compression for modern browsers' },
    { from: 'PNG', to: 'SVG', path: '/png-to-svg', desc: 'Convert raster image into scalable vector SVG' },
    { from: 'SVG', to: 'PNG', path: '/svg-to-png', desc: 'Rasterize scalable SVG vector into lossless PNG' },
    { from: 'HEIC', to: 'JPG', path: '/heic-to-jpg', desc: 'Convert Apple iPhone HEIC photos to universal JPG' },
    { from: 'PNG', to: 'TIFF', path: '/png-to-tiff', desc: 'Uncompressed high-resolution TIFF for print' },
    { from: 'PNG', to: 'ICO', path: '/png-to-ico', desc: 'Multi-resolution Windows favicon generator' },
    { from: 'WebP', to: 'JPG', path: '/webp-to-jpg', desc: 'Universal compatibility across all image viewers' },
    { from: 'PNG', to: 'JPG', path: '/png-to-jpg', desc: 'Flatten alpha channel for email & print' },
    { from: 'JPG', to: 'PNG', path: '/jpg-to-png', desc: 'Lossless format ideal for graphics and illustrations' },
    { from: 'ALL', to: 'AVIF', path: '/avif-converter', desc: 'Next-generation AV1 image format' },
    { from: 'PNG', to: 'BMP', path: '/png-to-bmp', desc: 'Standard 24-bit uncompressed Windows bitmap' },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 animate-in fade-in duration-300 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3 pt-4 sm:pt-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Complete Toolkit Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          All Image Tools & Converters
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Every tool runs directly inside your browser. No accounts, no watermarks, and zero file uploads.
        </p>
      </div>

      {/* Core Tools Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Core Image Utilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.path}
                onClick={() => onNavigate(tool.path)}
                className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 shadow-xs hover:shadow-lg hover:shadow-indigo-500/5 text-left transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">
                      {tool.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Format Converters Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Direct Format Converters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {formatConverters.map((c) => (
            <button
              key={c.path}
              onClick={() => onNavigate(c.path)}
              className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 text-left transition-all group flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center gap-1.5">
                  <FileImage className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{c.from} to {c.to}</span>
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{c.desc}</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </section>

    </div>
  );
};
