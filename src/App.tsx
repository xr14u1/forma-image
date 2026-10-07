import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { FormatPairPage } from './pages/FormatPairPage';
import { ToolsDirectoryPage } from './pages/ToolsDirectoryPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { CompressorTool } from './components/CompressorTool';
import { ResizerTool } from './components/ResizerTool';
import { CropperTool } from './components/CropperTool';
import { RotatorTool } from './components/RotatorTool';
import { OptimizerTool } from './components/OptimizerTool';
import { MetadataScrubberTool } from './components/MetadataScrubberTool';
import { ImagePreviewModal } from './components/ImagePreviewModal';

import type { ImageItem, TargetFormat } from './types';
import { 
  processImage, 
  detectFormat, 
  downloadBatchAsZip, 
  loadImageElement 
} from './utils/imageEngine';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('forma_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [items, setItems] = useState<ImageItem[]>([]);
  const [isProcessingAll, setIsProcessingAll] = useState<boolean>(false);
  const [previewModalItem, setPreviewModalItem] = useState<ImageItem | null>(null);

  // Synchronize dark class on <html> and persistent storage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('forma_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('forma_theme', 'light');
    }
  }, [isDarkMode]);

  // Handle browser popstate (Back / Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('forma_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('forma_theme', 'light');
      }
      return next;
    });
  };

  // Add files to batch queue
  const handleFilesSelected = useCallback(async (files: File[]) => {
    const newItems: ImageItem[] = [];

    for (const file of files) {
      const origFormat = detectFormat(file);
      // Sensible target format based on source
      let targetFmt: TargetFormat = 'WEBP';
      if (origFormat === 'WEBP') targetFmt = 'PNG';
      if (origFormat === 'PNG') targetFmt = 'WEBP';
      if (origFormat === 'JPG' || origFormat === 'JPEG') targetFmt = 'WEBP';

      const previewUrl = URL.createObjectURL(file);
      let width = 0;
      let height = 0;

      try {
        const img = await loadImageElement(file);
        width = img.naturalWidth || img.width;
        height = img.naturalHeight || img.height;
      } catch (err) {
        console.warn('Could not read image dimensions:', err);
      }

      newItems.push({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        name: file.name,
        originalFormat: origFormat,
        targetFormat: targetFmt,
        originalSize: file.size,
        originalWidth: width,
        originalHeight: height,
        targetWidth: width,
        targetHeight: height,
        maintainAspectRatio: true,
        quality: 85,
        status: 'idle',
        progress: 0,
        previewUrl,
        options: {
          format: targetFmt,
          quality: 85,
          maintainAspectRatio: true,
          stripMetadata: false,
        },
      });
    }

    setItems((prev) => [...prev, ...newItems]);
  }, []);

  const updateItem = (id: string, updates: Partial<ImageItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        if (target.convertedUrl) URL.revokeObjectURL(target.convertedUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearAll = () => {
    items.forEach((item) => {
      URL.revokeObjectURL(item.previewUrl);
      if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
    });
    setItems([]);
  };

  // Convert single item
  const convertSingleItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    updateItem(id, { status: 'processing', progress: 30, errorMessage: undefined });

    try {
      const result = await processImage(item.file, {
        format: item.targetFormat,
        quality: item.quality,
        width: item.targetWidth || undefined,
        height: item.targetHeight || undefined,
        maintainAspectRatio: item.maintainAspectRatio,
        stripMetadata: item.options.stripMetadata,
        customOutputName: item.options.customOutputName,
      });

      const convertedUrl = URL.createObjectURL(result.blob);
      const convertedSize = result.blob.size;
      const savings = item.originalSize > 0
        ? Math.round(((item.originalSize - convertedSize) / item.originalSize) * 100)
        : 0;

      updateItem(id, {
        status: 'done',
        progress: 100,
        convertedBlob: result.blob,
        convertedUrl,
        convertedSize,
        savingsPercent: savings,
      });
    } catch (err) {
      console.error(`Conversion failed for ${item.name}:`, err);
      updateItem(id, {
        status: 'error',
        progress: 0,
        errorMessage: err instanceof Error ? err.message : 'Conversion failed. Please try again.',
      });
    }
  };

  // Convert all items in batch
  const convertAllItems = async () => {
    if (items.length === 0) return;
    setIsProcessingAll(true);

    for (const item of items) {
      if (item.status !== 'done') {
        await convertSingleItem(item.id);
      }
    }

    setIsProcessingAll(false);
  };

  // Download all as ZIP
  const handleDownloadZip = async () => {
    try {
      await downloadBatchAsZip(items, 'forma-converted-images.zip');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to generate ZIP archive.');
    }
  };

  // Route Rendering
  const renderRoute = () => {
    switch (currentPath) {
      case '/':
      case '/converter':
        return (
          <HomePage
            items={items}
            onFilesSelected={handleFilesSelected}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onClearAll={clearAll}
            onConvertItem={convertSingleItem}
            onConvertAll={convertAllItems}
            onDownloadZip={handleDownloadZip}
            onPreviewImage={(item) => setPreviewModalItem(item)}
            isProcessingAll={isProcessingAll}
            onNavigate={navigate}
          />
        );

      case '/compress':
        return <CompressorTool />;

      case '/resize':
        return <ResizerTool />;

      case '/crop':
        return <CropperTool />;

      case '/rotate':
        return <RotatorTool />;

      case '/optimize':
        return <OptimizerTool />;

      case '/strip-metadata':
        return <MetadataScrubberTool />;

      case '/tools':
        return <ToolsDirectoryPage onNavigate={navigate} />;

      case '/png-to-webp':
        return (
          <FormatPairPage
            sourceFormat="PNG"
            targetFormat="WEBP"
            title="Convert PNG to WebP Online"
            subtitle="Transform lossless PNG graphics into next-generation WebP files. Cut file sizes by up to 80% while preserving full alpha transparency."
            benefits={[
              'Maintains full alpha channel transparency without pixel artifacts',
              'Reduces load times for websites and web applications',
              'Supported in 98%+ of all modern web browsers',
              'Processed 100% locally on your machine with zero server uploads',
            ]}
            faqs={[
              {
                q: 'Will my transparent PNG background be preserved in WebP?',
                a: 'Yes! WebP fully supports 8-bit alpha transparency just like PNG, but with vastly superior compression ratios.',
              },
              {
                q: 'How much smaller will the WebP file be compared to PNG?',
                a: 'Typically, WebP achieves 60% to 85% reduction in size compared to PNG with indistinguishable visual quality.',
              },
            ]}
            items={items}
            onFilesSelected={handleFilesSelected}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onClearAll={clearAll}
            onConvertItem={convertSingleItem}
            onConvertAll={convertAllItems}
            onDownloadZip={handleDownloadZip}
            onPreviewImage={(item) => setPreviewModalItem(item)}
            isProcessingAll={isProcessingAll}
          />
        );

      case '/jpg-to-webp':
        return (
          <FormatPairPage
            sourceFormat="JPG"
            targetFormat="WEBP"
            title="Convert JPG to WebP Online"
            subtitle="Compress JPEG photos into modern WebP format for fast web delivery and superior mobile performance."
            benefits={[
              'Saves 25% to 35% more file size compared to standard JPEG at equivalent quality',
              'Drastically boosts Google PageSpeed Insights & Core Web Vitals scores',
              'Hardware-accelerated encoding in your web browser',
              'Batch convert dozens of photos at once and download as ZIP',
            ]}
            faqs={[
              {
                q: 'Why should I switch from JPG to WebP?',
                a: 'WebP uses advanced predictive encoding algorithms developed by Google, allowing smaller files without noticeable degradation.',
              },
            ]}
            items={items}
            onFilesSelected={handleFilesSelected}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onClearAll={clearAll}
            onConvertItem={convertSingleItem}
            onConvertAll={convertAllItems}
            onDownloadZip={handleDownloadZip}
            onPreviewImage={(item) => setPreviewModalItem(item)}
            isProcessingAll={isProcessingAll}
          />
        );

      case '/webp-to-jpg':
        return (
          <FormatPairPage
            sourceFormat="WEBP"
            targetFormat="JPG"
            title="Convert WebP to JPG Online"
            subtitle="Convert WebP images to universal high-resolution JPEG format for full compatibility with legacy software and printers."
            benefits={[
              'Universal compatibility with every photo viewer, editor, and operating system',
              'Perfect for uploading to older platforms that do not yet support WebP',
              'Adjustable JPEG compression quality (10% to 100%)',
              '100% private in-browser conversion',
            ]}
            faqs={[
              {
                q: 'What happens to transparency when converting WebP to JPG?',
                a: 'Because JPEG does not support transparency, transparent areas will automatically be rendered over a clean white background.',
              },
            ]}
            items={items}
            onFilesSelected={handleFilesSelected}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onClearAll={clearAll}
            onConvertItem={convertSingleItem}
            onConvertAll={convertAllItems}
            onDownloadZip={handleDownloadZip}
            onPreviewImage={(item) => setPreviewModalItem(item)}
            isProcessingAll={isProcessingAll}
          />
        );

      case '/png-to-jpg':
        return (
          <FormatPairPage
            sourceFormat="PNG"
            targetFormat="JPG"
            title="Convert PNG to JPG Online"
            subtitle="Flatten heavy PNG images into compact JPEG files for easy emailing, printing, and sharing."
            benefits={[
              'Significantly reduces file size for photographic PNGs',
              'Replaces transparent backgrounds with a clean solid background',
              'Compatible with all email clients, document editors, and social media platforms',
              'Batch export to single files or ZIP archive',
            ]}
            faqs={[
              {
                q: 'When should I convert PNG to JPG?',
                a: 'If you have photo-like images saved as PNG that take up megabytes of space, converting to JPG can reduce their size by 70-90%.',
              },
            ]}
            items={items}
            onFilesSelected={handleFilesSelected}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onClearAll={clearAll}
            onConvertItem={convertSingleItem}
            onConvertAll={convertAllItems}
            onDownloadZip={handleDownloadZip}
            onPreviewImage={(item) => setPreviewModalItem(item)}
            isProcessingAll={isProcessingAll}
          />
        );

      case '/jpg-to-png':
        return (
          <FormatPairPage
            sourceFormat="JPG"
            targetFormat="PNG"
            title="Convert JPG to PNG Online"
            subtitle="Convert compressed JPEG files into lossless PNG format for graphic design, overlays, and digital art editing."
            benefits={[
              'Lossless container format ideal for graphic manipulation and layering',
              'Prevents repeated compression loss when saving multiple revisions',
              'Zero watermarks, zero limits, and 100% free',
            ]}
            faqs={[
              {
                q: 'Does converting JPG to PNG make the image higher quality?',
                a: 'It prevents further quality loss from repeated JPEG compression cycles, preserving the exact pixels for subsequent editing.',
              },
            ]}
            items={items}
            onFilesSelected={handleFilesSelected}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onClearAll={clearAll}
            onConvertItem={convertSingleItem}
            onConvertAll={convertAllItems}
            onDownloadZip={handleDownloadZip}
            onPreviewImage={(item) => setPreviewModalItem(item)}
            isProcessingAll={isProcessingAll}
          />
        );

      case '/avif-converter':
        return (
          <FormatPairPage
            sourceFormat="ANY"
            targetFormat="AVIF"
            title="Convert Images to AVIF Online"
            subtitle="Harness next-generation AV1 image format compression. Enjoy 50% smaller sizes than JPEG and 20% smaller than WebP."
            benefits={[
              'Industry-leading AV1 image compression algorithm',
              'High dynamic range (HDR) and wide color gamut support',
              'Supported by Chrome, Firefox, Safari, and Edge',
              'Completely client-side conversion',
            ]}
            faqs={[
              {
                q: 'What is AVIF?',
                a: 'AVIF (AV1 Image File Format) is an open, royalty-free image format derived from the keyframes of AV1 video, delivering maximum compression efficiency.',
              },
            ]}
            items={items}
            onFilesSelected={handleFilesSelected}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onClearAll={clearAll}
            onConvertItem={convertSingleItem}
            onConvertAll={convertAllItems}
            onDownloadZip={handleDownloadZip}
            onPreviewImage={(item) => setPreviewModalItem(item)}
            isProcessingAll={isProcessingAll}
          />
        );

      case '/png-to-svg':
        return (
          <FormatPairPage
            sourceFormat="PNG"
            targetFormat="SVG"
            title="Convert PNG to SVG Online"
            subtitle="Transform raster PNG images into standard, scalable XML SVG vector containers with zero pixel loss."
            benefits={[
              'Scalable vector XML container format',
              'Embeds cleanly into web markup and CSS',
              'Instant high-resolution vector rendering',
              '100% private in-browser generation',
            ]}
            faqs={[
              {
                q: 'Can I use the exported SVG directly in HTML?',
                a: 'Yes! The generated SVG is standard XML that can be placed in <img> tags or embedded inline in SVG markup.',
              },
            ]}
            items={items}
            onFilesSelected={handleFilesSelected}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onClearAll={clearAll}
            onConvertItem={convertSingleItem}
            onConvertAll={convertAllItems}
            onDownloadZip={handleDownloadZip}
            onPreviewImage={(item) => setPreviewModalItem(item)}
            isProcessingAll={isProcessingAll}
          />
        );

      case '/svg-to-png':
        return (
          <FormatPairPage
            sourceFormat="SVG"
            targetFormat="PNG"
            title="Convert SVG to PNG Online"
            subtitle="Rasterize scalable SVG vector graphics into crisp, high-resolution PNG bitmap images with transparency."
            benefits={[
              'Preserves crisp lines and vector detail at high resolution',
              'Retains full alpha channel transparency',
              'Universal compatibility with photo editors, video tools, and office suites',
              'Zero watermarks and batch conversion enabled',
            ]}
            faqs={[
              {
                q: 'Will my SVG transparency be preserved?',
                a: 'Yes, the rendered PNG retains the transparent background of your SVG graphics.',
              },
            ]}
            items={items}
            onFilesSelected={handleFilesSelected}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onClearAll={clearAll}
            onConvertItem={convertSingleItem}
            onConvertAll={convertAllItems}
            onDownloadZip={handleDownloadZip}
            onPreviewImage={(item) => setPreviewModalItem(item)}
            isProcessingAll={isProcessingAll}
          />
        );

      case '/heic-to-jpg':
        return (
          <FormatPairPage
            sourceFormat="HEIC"
            targetFormat="JPG"
            title="Convert iPhone HEIC to JPG Online"
            subtitle="Convert Apple iOS HEIC and HEIF photos to universal high-quality JPEG format directly in your browser."
            benefits={[
              'Converts iPhone / iPad HEIC files to universal JPG',
              '100% private client-side decoding with zero upload delays',
              'Compatible with Windows, Android, websites, and photo editors',
              'Batch convert entire albums and download as ZIP',
            ]}
            faqs={[
              {
                q: 'Why does my iPhone take photos in HEIC format?',
                a: 'Apple uses High Efficiency Image Container (HEIC) to save disk space, but many Windows apps and websites require standard JPG.',
              },
            ]}
            items={items}
            onFilesSelected={handleFilesSelected}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onClearAll={clearAll}
            onConvertItem={convertSingleItem}
            onConvertAll={convertAllItems}
            onDownloadZip={handleDownloadZip}
            onPreviewImage={(item) => setPreviewModalItem(item)}
            isProcessingAll={isProcessingAll}
          />
        );

      case '/png-to-tiff':
        return (
          <FormatPairPage
            sourceFormat="PNG"
            targetFormat="TIFF"
            title="Convert PNG to TIFF Online"
            subtitle="Export uncompressed 24-bit RGB TIFF images with standard IFD tags for commercial printing and professional archiving."
            benefits={[
              'Produces valid uncompressed TIFF 6.0 binary files',
              'Standard 72 DPI resolution tags ready for pre-press',
              'Compatible with Photoshop, GIMP, InDesign, and print RIPs',
              'Direct browser binary encoding',
            ]}
            faqs={[
              {
                q: 'What is TIFF used for?',
                a: 'TIFF (Tagged Image File Format) is the gold standard for print publishing, medical imaging, and uncompressed archival photography.',
              },
            ]}
            items={items}
            onFilesSelected={handleFilesSelected}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onClearAll={clearAll}
            onConvertItem={convertSingleItem}
            onConvertAll={convertAllItems}
            onDownloadZip={handleDownloadZip}
            onPreviewImage={(item) => setPreviewModalItem(item)}
            isProcessingAll={isProcessingAll}
          />
        );

      case '/png-to-ico':
        return (
          <FormatPairPage
            sourceFormat="PNG"
            targetFormat="ICO"
            title="Convert PNG to ICO Favicon Online"
            subtitle="Generate authentic Windows Icon (.ico) files with 16x16, 32x32, and 48x48 multi-resolution layers for websites and apps."
            benefits={[
              'Multi-layer icon container (16x16, 32x32, 48x48, 64x64)',
              'Standard favicon.ico format for websites',
              'Valid Windows Icon binary headers',
              'Instant one-click browser generation',
            ]}
            faqs={[
              {
                q: 'Can I use this as a website favicon.ico?',
                a: 'Yes! The generated ICO contains all standard icon resolutions needed for modern web browsers and desktop operating systems.',
              },
            ]}
            items={items}
            onFilesSelected={handleFilesSelected}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onClearAll={clearAll}
            onConvertItem={convertSingleItem}
            onConvertAll={convertAllItems}
            onDownloadZip={handleDownloadZip}
            onPreviewImage={(item) => setPreviewModalItem(item)}
            isProcessingAll={isProcessingAll}
          />
        );

      case '/about':
        return <AboutPage />;

      case '/privacy':
        return <PrivacyPage />;

      case '/terms':
        return <TermsPage />;

      case '/contact':
        return <ContactPage />;

      default:
        return (
          <HomePage
            items={items}
            onFilesSelected={handleFilesSelected}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onClearAll={clearAll}
            onConvertItem={convertSingleItem}
            onConvertAll={convertAllItems}
            onDownloadZip={handleDownloadZip}
            onPreviewImage={(item) => setPreviewModalItem(item)}
            isProcessingAll={isProcessingAll}
            onNavigate={navigate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFD] dark:bg-black text-zinc-950 dark:text-white transition-colors duration-200 relative selection:bg-emerald-500/30 selection:text-emerald-400">
      {/* Ambient background glow */}
      <div className="fixed inset-0 emerald-ambient-glow pointer-events-none z-0" />
      
      {/* Top Navigation */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 relative z-10">
        {renderRoute()}
      </main>

      {/* Preview Modal */}
      <ImagePreviewModal
        item={previewModalItem}
        onClose={() => setPreviewModalItem(null)}
      />

      {/* Footer */}
      <Footer onNavigate={navigate} />

    </div>
  );
}

export default App;
