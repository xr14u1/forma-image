# Forma — Modern Browser-Based Image Studio & Converter

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**Forma** is a production-ready, ultra-fast, 100% private browser-based image converter and image processing toolkit. Built with modern TypeScript, React 19, Tailwind CSS, and HTML5 Canvas / WebAssembly APIs. Developed by [snuffdied](https://snuffdied.vercel.app/).

---

## ✨ Features & Capabilities

- **100% Client-Side Privacy**: All image processing occurs in the user's browser memory. Zero files uploaded to any server.
- **Complete Multi-Format Engine**:
  - Supported Formats: **PNG, JPG / JPEG, WebP, AVIF, SVG, TIFF, HEIC / HEIF, GIF, BMP, ICO**
  - High-res multi-tier **ICO icon generator** (16x16, 32x32, 48x48, 64x64)
  - Pure vector **XML SVG container generator**
  - Pure client-side **TIFF 6.0 24-bit binary encoder**
  - Pure client-side **24-bit/32-bit BMP binary encoder**
  - Apple **iPhone HEIC/HEIF client-side decoder** (`heic2any`)
- **Batch Processing & ZIP Archiving**:
  - Drag-and-drop or clipboard paste (`Ctrl+V`) dozens of images
  - Individual or global format & quality control
  - Instant one-click **Download All as ZIP** using `JSZip`
  - Real-time size savings metrics (e.g. `2.8 MB → 640 KB (-78%)`)
- **Dedicated Image Tool Suite**:
  - 🗜️ **Image Compressor**: Real-time quality slider with live comparison
  - 📐 **Image Resizer**: Exact pixel inputs, scale factor %, and standard presets (Instagram Square 1080×1080, Portrait 1080×1350, YouTube 1280×720, Full HD 1920×1080)
  - ✂️ **Image Cropper**: Precision aspect ratio cropping (1:1, 4:3, 16:9, 3:2, Freeform)
  - 🔄 **Image Rotator & Flipper**: 90° CW/CCW, 180°, horizontal mirror, and vertical mirror
  - 🎛️ **Color Filters & Exposure**: Brightness, contrast, saturation, monochrome, and vintage sepia
  - 🛡️ **EXIF & Metadata Scrubber**: Strip GPS coordinates, camera serials, timestamps, and device tracking
- **Google AdSense Monetization Ready**:
  - Non-intrusive, responsive `AdSlot` components with clear `<!-- ADSENSE SLOT -->` markers
  - Centralized configuration in `src/utils/adsense.config.ts`
- **SEO & Search Optimized**:
  - Pre-rendered pathways for `/png-to-webp`, `/jpg-to-webp`, `/webp-to-jpg`, `/png-to-jpg`, `/jpg-to-png`, `/avif-converter`
  - Canonical links, OpenGraph metadata, `robots.txt`, and `sitemap.xml`
- **Mobile-First Responsive Design**:
  - Tested from 320px mobile screens to 4K ultra-wide monitors
  - Smooth light/dark theme transitions with `localStorage` persistence

---

## 🌐 Deploy to Vercel

1. Push this repository to GitHub or GitLab.
2. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
3. Select your repository.
4. Framework Preset: **Vite**
5. Root Directory: `./`
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Click **Deploy**.

`vercel.json` is already included to handle client-side SPA routing and security headers automatically.

---

## 🔒 Privacy & Architecture

Forma executes all transformations locally using:
- **HTML5 Canvas 2D Context** with hardware-accelerated bilinear and bicubic interpolation
- **JSZip** for in-browser multi-file compression and streaming ZIP generation
- **Blob & DataView APIs** for binary format encoding

Zero third-party cloud analytics or remote file processing endpoints are involved.
