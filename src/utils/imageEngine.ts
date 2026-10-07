import JSZip from 'jszip';
import heic2any from 'heic2any';
import type { 
  ConversionOptions, 
  ImageFilterSettings, 
  ImageItem,
  TargetFormat
} from '../types';

/**
 * Format bytes into human readable string (KB, MB, GB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Extract format name from filename or MIME type
 */
export function detectFormat(file: File): string {
  const ext = file.name.split('.').pop()?.toUpperCase();
  if (ext) {
    if (ext === 'JPEG') return 'JPG';
    if (ext === 'TIF') return 'TIFF';
    return ext;
  }
  if (file.type.includes('svg')) return 'SVG';
  if (file.type.includes('png')) return 'PNG';
  if (file.type.includes('jpeg') || file.type.includes('jpg')) return 'JPG';
  if (file.type.includes('webp')) return 'WEBP';
  if (file.type.includes('avif')) return 'AVIF';
  if (file.type.includes('gif')) return 'GIF';
  if (file.type.includes('bmp')) return 'BMP';
  if (file.type.includes('tiff')) return 'TIFF';
  if (file.type.includes('x-icon') || file.type.includes('vnd.microsoft.icon')) return 'ICO';
  if (file.type.includes('heic') || file.type.includes('heif')) return 'HEIC';
  return 'IMG';
}

/**
 * Check if the browser supports encoding to AVIF natively
 */
export function isAvifEncodingSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/avif').startsWith('data:image/avif');
  } catch {
    return false;
  }
}

/**
 * Decode HEIC/HEIF images if needed
 */
export async function prepareImageSource(source: File | Blob | string): Promise<File | Blob | string> {
  if (source instanceof File || source instanceof Blob) {
    const fileName = (source as File).name || '';
    const isHeic = source.type.includes('heic') || 
                   source.type.includes('heif') || 
                   /\.(heic|heif)$/i.test(fileName);

    if (isHeic) {
      try {
        const converted = await heic2any({
          blob: source,
          toType: 'image/png',
          quality: 0.95,
        });
        return Array.isArray(converted) ? converted[0] : converted;
      } catch (err) {
        console.warn('heic2any decoding failed, attempting standard load:', err);
      }
    }
  }
  return source;
}

/**
 * Load image file into HTMLImageElement
 */
export async function loadImageElement(source: File | Blob | string): Promise<HTMLImageElement> {
  const prepared = await prepareImageSource(source);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image into browser canvas.'));

    if (typeof prepared === 'string') {
      img.src = prepared;
    } else {
      img.src = URL.createObjectURL(prepared);
    }
  });
}

/**
 * Pure TypeScript BMP Encoder for Canvas
 * Produces valid Windows 24-bit/32-bit BMP file
 */
export function encodeCanvasToBMP(canvas: HTMLCanvasElement): Blob {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // BMP row width must be padded to a multiple of 4 bytes
  const rowSize = Math.floor((24 * width + 31) / 32) * 4;
  const pixelArraySize = rowSize * height;
  const fileHeaderSize = 14;
  const dibHeaderSize = 40;
  const fileSize = fileHeaderSize + dibHeaderSize + pixelArraySize;

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  // --- BMP File Header (14 bytes) ---
  view.setUint16(0, 0x4d42, true); // 'BM'
  view.setUint32(2, fileSize, true); // File size
  view.setUint16(6, 0, true); // Reserved 1
  view.setUint16(8, 0, true); // Reserved 2
  view.setUint32(10, fileHeaderSize + dibHeaderSize, true); // Offset to pixel array

  // --- DIB Header (BITMAPINFOHEADER - 40 bytes) ---
  view.setUint32(14, dibHeaderSize, true); // DIB Header size
  view.setInt32(18, width, true); // Image width
  view.setInt32(22, height, true); // Image height (positive = bottom-to-top)
  view.setUint16(26, 1, true); // Color planes (must be 1)
  view.setUint16(28, 24, true); // Bits per pixel (24 bit RGB)
  view.setUint32(30, 0, true); // Compression (0 = BI_RGB, none)
  view.setUint32(34, pixelArraySize, true); // Image data size
  view.setInt32(38, 2835, true); // Horizontal resolution (72 DPI = ~2835 ppm)
  view.setInt32(42, 2835, true); // Vertical resolution
  view.setUint32(46, 0, true); // Colors in palette
  view.setUint32(50, 0, true); // Important colors

  // --- Pixel Array (BGR, Bottom-to-Top) ---
  let offset = fileHeaderSize + dibHeaderSize;
  const padding = rowSize - width * 3;

  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];
      const a = data[srcIdx + 3] / 255;

      // Alpha composite over white background for 24-bit BMP
      const finalR = Math.round(r * a + 255 * (1 - a));
      const finalG = Math.round(g * a + 255 * (1 - a));
      const finalB = Math.round(b * a + 255 * (1 - a));

      view.setUint8(offset++, finalB); // Blue
      view.setUint8(offset++, finalG); // Green
      view.setUint8(offset++, finalR); // Red
    }
    for (let p = 0; p < padding; p++) {
      view.setUint8(offset++, 0);
    }
  }

  return new Blob([buffer], { type: 'image/bmp' });
}

/**
 * Pure TypeScript TIFF 6.0 Binary Encoder
 * Produces valid uncompressed 24-bit RGB TIFF file
 */
export function encodeCanvasToTIFF(canvas: HTMLCanvasElement): Blob {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const numTags = 12;
  const headerSize = 8;
  const ifdSize = 2 + numTags * 12 + 4; // num entries + tags + next IFD offset
  const extraDataSize = 6 + 8 + 8; // BitsPerSample values (6 bytes), XResolution (8 bytes), YResolution (8 bytes)
  const offsetToImageData = headerSize + ifdSize + extraDataSize;
  const imageDataSize = width * height * 3;
  const totalFileSize = offsetToImageData + imageDataSize;

  const buffer = new ArrayBuffer(totalFileSize);
  const view = new DataView(buffer);
  const uint8 = new Uint8Array(buffer);

  // --- TIFF Header (8 bytes, Little Endian 'II') ---
  view.setUint16(0, 0x4949, true); // 'II' (Intel Little Endian)
  view.setUint16(2, 42, true);     // Magic number 42
  view.setUint32(4, 8, true);      // Offset to first IFD (byte 8)

  // --- IFD0 Entries ---
  let ifdOffset = 8;
  view.setUint16(ifdOffset, numTags, true);
  ifdOffset += 2;

  const bitsPerSampleOffset = headerSize + ifdSize;
  const xResOffset = bitsPerSampleOffset + 6;
  const yResOffset = xResOffset + 8;

  function writeTag(tag: number, type: number, count: number, valueOrOffset: number) {
    view.setUint16(ifdOffset, tag, true);
    view.setUint16(ifdOffset + 2, type, true);
    view.setUint32(ifdOffset + 4, count, true);
    view.setUint32(ifdOffset + 8, valueOrOffset, true);
    ifdOffset += 12;
  }

  // 1. ImageWidth (SHORT / LONG)
  writeTag(256, 4, 1, width);
  // 2. ImageLength (SHORT / LONG)
  writeTag(257, 4, 1, height);
  // 3. BitsPerSample (SHORT[3] -> offset)
  writeTag(258, 3, 3, bitsPerSampleOffset);
  // 4. Compression (SHORT: 1 = uncompressed)
  writeTag(259, 3, 1, 1);
  // 5. PhotometricInterpretation (SHORT: 2 = RGB)
  writeTag(262, 3, 1, 2);
  // 6. StripOffsets (LONG)
  writeTag(273, 4, 1, offsetToImageData);
  // 7. SamplesPerPixel (SHORT: 3)
  writeTag(277, 3, 1, 3);
  // 8. RowsPerStrip (LONG)
  writeTag(278, 4, 1, height);
  // 9. StripByteCounts (LONG)
  writeTag(279, 4, 1, imageDataSize);
  // 10. XResolution (RATIONAL -> offset)
  writeTag(282, 5, 1, xResOffset);
  // 11. YResolution (RATIONAL -> offset)
  writeTag(283, 5, 1, yResOffset);
  // 12. ResolutionUnit (SHORT: 2 = inches)
  writeTag(296, 3, 1, 2);

  // Next IFD Offset (0 = none)
  view.setUint32(ifdOffset, 0, true);

  // --- Write Extra Data ---
  // BitsPerSample: 8, 8, 8
  view.setUint16(bitsPerSampleOffset, 8, true);
  view.setUint16(bitsPerSampleOffset + 2, 8, true);
  view.setUint16(bitsPerSampleOffset + 4, 8, true);

  // XResolution: 72 / 1
  view.setUint32(xResOffset, 72, true);
  view.setUint32(xResOffset + 4, 1, true);

  // YResolution: 72 / 1
  view.setUint32(yResOffset, 72, true);
  view.setUint32(yResOffset + 4, 1, true);

  // --- Write RGB Pixel Data ---
  let destIdx = offsetToImageData;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3] / 255;

    // Blend over white if alpha exists
    uint8[destIdx++] = Math.round(r * a + 255 * (1 - a));
    uint8[destIdx++] = Math.round(g * a + 255 * (1 - a));
    uint8[destIdx++] = Math.round(b * a + 255 * (1 - a));
  }

  return new Blob([buffer], { type: 'image/tiff' });
}

/**
 * Pure SVG Vector Container Encoder
 * Produces clean, scalable XML SVG containing vector metadata and embedded high-res image data
 */
export function encodeCanvasToSVG(canvas: HTMLCanvasElement): Blob {
  const width = canvas.width;
  const height = canvas.height;
  const dataUrl = canvas.toDataURL('image/png');

  const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" version="1.1">
  <!-- Generated by Forma Image Studio (100% Client-Side Engine) -->
  <title>Forma Exported SVG</title>
  <image width="${width}" height="${height}" x="0" y="0" href="${dataUrl}" xlink:href="${dataUrl}" />
</svg>`;

  return new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
}

/**
 * Pure TypeScript ICO Encoder
 * Builds standard Windows .ico icon file containing multi-resolution PNG layers
 */
export async function encodeCanvasToICO(canvas: HTMLCanvasElement): Promise<Blob> {
  const sizes = [16, 32, 48, 64];
  const pngBlobs: { size: number; bytes: Uint8Array }[] = [];

  for (const s of sizes) {
    const resized = document.createElement('canvas');
    resized.width = s;
    resized.height = s;
    const ctx = resized.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(canvas, 0, 0, s, s);
      const blob = await new Promise<Blob | null>((res) => resized.toBlob(res, 'image/png'));
      if (blob) {
        const buffer = await blob.arrayBuffer();
        pngBlobs.push({ size: s, bytes: new Uint8Array(buffer) });
      }
    }
  }

  if (pngBlobs.length === 0) {
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) throw new Error('Failed to create icon data');
    const buffer = await blob.arrayBuffer();
    pngBlobs.push({ size: Math.min(canvas.width, 256), bytes: new Uint8Array(buffer) });
  }

  const iconCount = pngBlobs.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + dirEntrySize * iconCount;

  const totalSize = offset + pngBlobs.reduce((acc, curr) => acc + curr.bytes.length, 0);
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const uint8 = new Uint8Array(buffer);

  // --- ICONHEADER (6 bytes) ---
  view.setUint16(0, 0, true); // Reserved, must be 0
  view.setUint16(2, 1, true); // Resource type: 1 = ICO
  view.setUint16(4, iconCount, true); // Number of images

  // --- ICONDIRENTRY (16 bytes per image) ---
  pngBlobs.forEach((item, index) => {
    const entryOffset = headerSize + index * dirEntrySize;
    view.setUint8(entryOffset + 0, item.size >= 256 ? 0 : item.size); // Width
    view.setUint8(entryOffset + 1, item.size >= 256 ? 0 : item.size); // Height
    view.setUint8(entryOffset + 2, 0); // Palette count
    view.setUint8(entryOffset + 3, 0); // Reserved
    view.setUint16(entryOffset + 4, 1, true); // Color planes
    view.setUint16(entryOffset + 6, 32, true); // Bits per pixel
    view.setUint32(entryOffset + 8, item.bytes.length, true); // Size in bytes
    view.setUint32(entryOffset + 12, offset, true); // File offset to image data

    uint8.set(item.bytes, offset);
    offset += item.bytes.length;
  });

  return new Blob([buffer], { type: 'image/x-icon' });
}

/**
 * Apply real-time visual filters onto a canvas context
 */
export function applyCanvasFilters(
  ctx: CanvasRenderingContext2D,
  filters?: Partial<ImageFilterSettings>
) {
  if (!filters) return;
  const filterParts: string[] = [];

  if (filters.brightness !== undefined && filters.brightness !== 100) {
    filterParts.push(`brightness(${filters.brightness}%)`);
  }
  if (filters.contrast !== undefined && filters.contrast !== 100) {
    filterParts.push(`contrast(${filters.contrast}%)`);
  }
  if (filters.saturation !== undefined && filters.saturation !== 100) {
    filterParts.push(`saturate(${filters.saturation}%)`);
  }
  if (filters.grayscale !== undefined && filters.grayscale > 0) {
    filterParts.push(`grayscale(${filters.grayscale}%)`);
  }
  if (filters.invert !== undefined && filters.invert > 0) {
    filterParts.push(`invert(${filters.invert}%)`);
  }
  if (filters.sepia !== undefined && filters.sepia > 0) {
    filterParts.push(`sepia(${filters.sepia}%)`);
  }
  if (filters.blur !== undefined && filters.blur > 0) {
    filterParts.push(`blur(${filters.blur}px)`);
  }

  if (filterParts.length > 0) {
    ctx.filter = filterParts.join(' ');
  }
}

/**
 * Core image processing function
 * Performs resize, crop, rotation, filters, metadata stripping, and format encoding
 */
export async function processImage(
  source: File | Blob | string,
  options: ConversionOptions
): Promise<{ blob: Blob; width: number; height: number }> {
  const img = await loadImageElement(source);

  const origWidth = img.naturalWidth || img.width;
  const origHeight = img.naturalHeight || img.height;

  // Handle Crop first if specified
  let cropX = 0;
  let cropY = 0;
  let cropW = origWidth;
  let cropH = origHeight;

  if (options.crop) {
    cropX = Math.max(0, options.crop.x);
    cropY = Math.max(0, options.crop.y);
    cropW = Math.min(origWidth - cropX, options.crop.width);
    cropH = Math.min(origHeight - cropY, options.crop.height);
  }

  // Determine target dimensions
  let targetW = options.width || cropW;
  let targetH = options.height || cropH;

  if (options.maintainAspectRatio && (options.width || options.height)) {
    const ratio = cropW / cropH;
    if (options.width && !options.height) {
      targetH = Math.round(options.width / ratio);
    } else if (options.height && !options.width) {
      targetW = Math.round(options.height * ratio);
    } else if (options.width && options.height) {
      const wRatio = options.width / cropW;
      const hRatio = options.height / cropH;
      const fitRatio = Math.min(wRatio, hRatio);
      targetW = Math.round(cropW * fitRatio);
      targetH = Math.round(cropH * fitRatio);
    }
  }

  targetW = Math.max(1, Math.round(targetW));
  targetH = Math.max(1, Math.round(targetH));

  // Determine canvas size based on rotation
  const rotation = (options.rotation || 0) % 360;
  const isRotated90or270 = rotation === 90 || rotation === 270;
  const canvasW = isRotated90or270 ? targetH : targetW;
  const canvasH = isRotated90or270 ? targetW : targetH;

  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create 2D canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Apply filters if any
  applyCanvasFilters(ctx, options.filters);

  // Transformation matrix for rotation and flips
  ctx.save();
  ctx.translate(canvasW / 2, canvasH / 2);

  if (rotation !== 0) {
    ctx.rotate((rotation * Math.PI) / 180);
  }

  const scaleX = options.flipHorizontal ? -1 : 1;
  const scaleY = options.flipVertical ? -1 : 1;
  ctx.scale(scaleX, scaleY);

  // Draw image from crop coordinates into target dimensions
  ctx.drawImage(
    img,
    cropX, cropY, cropW, cropH,
    -targetW / 2, -targetH / 2, targetW, targetH
  );
  ctx.restore();

  // Format encoding
  const quality = Math.max(0.01, Math.min(1.0, (options.quality || 90) / 100));
  let finalBlob: Blob;

  switch (options.format) {
    case 'PNG': {
      finalBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG export failed'))), 'image/png');
      });
      break;
    }
    case 'JPG': {
      const jpgCanvas = document.createElement('canvas');
      jpgCanvas.width = canvasW;
      jpgCanvas.height = canvasH;
      const jpgCtx = jpgCanvas.getContext('2d');
      if (jpgCtx) {
        jpgCtx.fillStyle = '#FFFFFF';
        jpgCtx.fillRect(0, 0, canvasW, canvasH);
        jpgCtx.drawImage(canvas, 0, 0);
      }
      finalBlob = await new Promise<Blob>((resolve, reject) => {
        jpgCanvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('JPG export failed'))),
          'image/jpeg',
          quality
        );
      });
      break;
    }
    case 'WEBP': {
      finalBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('WebP export failed'))),
          'image/webp',
          quality
        );
      });
      break;
    }
    case 'AVIF': {
      if (isAvifEncodingSupported()) {
        finalBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error('AVIF export failed'))),
            'image/avif',
            quality
          );
        });
      } else {
        finalBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error('Export fallback failed'))),
            'image/webp',
            quality
          );
        });
      }
      break;
    }
    case 'BMP': {
      finalBlob = encodeCanvasToBMP(canvas);
      break;
    }
    case 'TIFF': {
      finalBlob = encodeCanvasToTIFF(canvas);
      break;
    }
    case 'SVG': {
      finalBlob = encodeCanvasToSVG(canvas);
      break;
    }
    case 'ICO': {
      finalBlob = await encodeCanvasToICO(canvas);
      break;
    }
    case 'GIF': {
      finalBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('GIF export failed'))),
          'image/gif'
        );
      });
      break;
    }
    default: {
      finalBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Image export failed'))), 'image/png');
      });
    }
  }

  return { blob: finalBlob, width: canvasW, height: canvasH };
}

/**
 * Batch download multiple converted images as a ZIP file
 */
export async function downloadBatchAsZip(
  items: ImageItem[],
  zipFilename = 'forma-converted-images.zip',
  onProgress?: (percent: number) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('forma-images') || zip;

  const validItems = items.filter((item) => item.status === 'done' && item.convertedBlob);
  if (validItems.length === 0) {
    throw new Error('No converted images available to download.');
  }

  validItems.forEach((item, index) => {
    const baseName = item.name.replace(/\.[^/.]+$/, '');
    const ext = item.targetFormat.toLowerCase();
    const filename = item.options.customOutputName 
      ? `${item.options.customOutputName}.${ext}` 
      : `${baseName}-forma.${ext}`;
    
    const uniqueFilename = `${index + 1}_${filename}`;
    folder.file(uniqueFilename, item.convertedBlob!);
  });

  const content = await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
    (metadata) => {
      if (onProgress) {
        onProgress(Math.round(metadata.percent));
      }
    }
  );

  triggerBlobDownload(content, zipFilename);
}

/**
 * Trigger file download directly in browser
 */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
