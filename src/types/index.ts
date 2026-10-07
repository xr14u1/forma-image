export type SupportedFormat = 
  | 'PNG' 
  | 'JPG' 
  | 'JPEG' 
  | 'WEBP' 
  | 'AVIF' 
  | 'GIF' 
  | 'BMP' 
  | 'TIFF'
  | 'TIF'
  | 'ICO' 
  | 'SVG' 
  | 'HEIC' 
  | 'HEIF';

export type TargetFormat = 
  | 'PNG' 
  | 'JPG' 
  | 'WEBP' 
  | 'AVIF' 
  | 'GIF' 
  | 'BMP' 
  | 'TIFF'
  | 'ICO'
  | 'SVG';

export interface ImageFilterSettings {
  brightness: number; // 0 to 200, default 100
  contrast: number;   // 0 to 200, default 100
  saturation: number; // 0 to 200, default 100
  grayscale: number;  // 0 to 100, default 0
  invert: number;     // 0 to 100, default 0
  blur: number;       // 0 to 20, default 0
  sepia: number;      // 0 to 100, default 0
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ConversionOptions {
  format: TargetFormat;
  quality: number; // 10 to 100
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
  stripMetadata: boolean;
  rotation?: number; // 0, 90, 180, 270
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  crop?: CropRect;
  filters?: Partial<ImageFilterSettings>;
  customOutputName?: string;
}

export interface ImageItem {
  id: string;
  file: File;
  name: string;
  originalFormat: string;
  targetFormat: TargetFormat;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  targetWidth: number;
  targetHeight: number;
  maintainAspectRatio: boolean;
  quality: number;
  status: 'idle' | 'processing' | 'done' | 'error';
  progress: number;
  previewUrl: string;
  convertedBlob?: Blob;
  convertedUrl?: string;
  convertedSize?: number;
  savingsPercent?: number;
  errorMessage?: string;
  options: ConversionOptions;
}

export type ActiveTool = 
  | 'converter'
  | 'compress'
  | 'resize'
  | 'crop'
  | 'rotate'
  | 'optimize'
  | 'strip-metadata';

export interface PresetResolution {
  name: string;
  width: number;
  height: number;
  category: 'Social' | 'Display' | 'Standard';
  aspectRatio: string;
}
