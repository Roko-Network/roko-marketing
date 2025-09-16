/**
 * Image Optimization Utilities for ROKO Network
 * Implements advanced image loading strategies for optimal Core Web Vitals
 */

interface ImageOptimizationConfig {
  formats: string[];
  sizes: number[];
  quality: number;
  blurDataURL?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
}

interface ResponsiveImageOptions {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  formats?: string[];
  sizes?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Default configuration for different image types
 */
export const imageConfigs: Record<string, ImageOptimizationConfig> = {
  hero: {
    formats: ['avif', 'webp', 'jpg'],
    sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    quality: 85,
    priority: true,
    loading: 'eager'
  },
  feature: {
    formats: ['avif', 'webp', 'jpg'],
    sizes: [400, 600, 800, 1200],
    quality: 80,
    priority: false,
    loading: 'lazy'
  },
  avatar: {
    formats: ['avif', 'webp', 'jpg'],
    sizes: [64, 128, 256],
    quality: 85,
    priority: false,
    loading: 'lazy'
  },
  icon: {
    formats: ['svg', 'webp', 'png'],
    sizes: [24, 32, 48, 64],
    quality: 90,
    priority: false,
    loading: 'lazy'
  }
};

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  baseSrc: string,
  sizes: number[],
  format?: string
): string {
  return sizes
    .map(size => {
      const src = format
        ? baseSrc.replace(/\.[^.]+$/, `.${format}`)
        : baseSrc;
      return `${src}?w=${size}&q=80 ${size}w`;
    })
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(breakpoints?: Record<string, string>): string {
  const defaultBreakpoints = {
    '(max-width: 640px)': '100vw',
    '(max-width: 1024px)': '50vw',
    '(max-width: 1280px)': '33vw',
    'default': '25vw'
  };

  const bp = breakpoints || defaultBreakpoints;

  return Object.entries(bp)
    .filter(([key]) => key !== 'default')
    .map(([media, size]) => `${media} ${size}`)
    .concat(bp.default || '25vw')
    .join(', ');
}

/**
 * Create a blur data URL for placeholder
 */
export function createBlurDataURL(
  width: number = 10,
  height: number = 10,
  color: string = '#1f2937'
): string {
  const canvas = typeof window !== 'undefined'
    ? document.createElement('canvas')
    : null;

  if (!canvas) {
    // Fallback SVG blur placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}"/>
        <filter id="blur">
          <feGaussianBlur stdDeviation="2"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#blur)" fill="${color}" opacity="0.8"/>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL();
}

/**
 * Detect WebP support
 */
export function detectWebPSupport(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * Detect AVIF support
 */
export function detectAVIFSupport(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgS0AAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
}

/**
 * Get optimal image format based on browser support
 */
export async function getOptimalFormat(
  preferredFormats: string[] = ['avif', 'webp', 'jpg']
): Promise<string> {
  const [supportsAVIF, supportsWebP] = await Promise.all([
    detectAVIFSupport(),
    detectWebPSupport()
  ]);

  for (const format of preferredFormats) {
    if (format === 'avif' && supportsAVIF) return format;
    if (format === 'webp' && supportsWebP) return format;
    if (['jpg', 'jpeg', 'png'].includes(format)) return format;
  }

  return 'jpg'; // Fallback
}

/**
 * Preload critical images
 */
export function preloadImage(
  src: string,
  options: {
    as?: 'image';
    crossorigin?: 'anonymous' | 'use-credentials';
    fetchpriority?: 'high' | 'low' | 'auto';
  } = {}
): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = src;
  link.as = options.as || 'image';

  if (options.crossorigin) {
    link.crossOrigin = options.crossorigin;
  }

  if (options.fetchpriority) {
    link.setAttribute('fetchpriority', options.fetchpriority);
  }

  document.head.appendChild(link);
}

/**
 * Image loading performance observer
 */
export class ImagePerformanceObserver {
  private observer: IntersectionObserver | null = null;
  private loadTimes: Map<string, number> = new Map();

  constructor() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          rootMargin: '50px 0px',
          threshold: 0.1
        }
      );
    }
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const startTime = performance.now();

        img.onload = () => {
          const loadTime = performance.now() - startTime;
          this.loadTimes.set(img.src, loadTime);

          // Report to analytics if available
          if ('gtag' in window) {
            (window as any).gtag('event', 'image_load_time', {
              custom_parameter_1: img.src,
              custom_parameter_2: loadTime
            });
          }
        };

        this.observer?.unobserve(img);
      }
    });
  }

  observe(img: HTMLImageElement) {
    this.observer?.observe(img);
  }

  getLoadTimes() {
    return new Map(this.loadTimes);
  }

  destroy() {
    this.observer?.disconnect();
    this.loadTimes.clear();
  }
}

/**
 * Image compression utility for client-side optimization
 */
export function compressImage(
  file: File,
  quality: number = 0.8,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * CDN URL builder for optimized images
 */
export function buildCDNUrl(
  baseSrc: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  } = {}
): string {
  // This would integrate with your CDN (Cloudinary, ImageKit, etc.)
  // For now, return a mock implementation
  const params = new URLSearchParams();

  if (options.width) params.set('w', options.width.toString());
  if (options.height) params.set('h', options.height.toString());
  if (options.quality) params.set('q', options.quality.toString());
  if (options.format) params.set('f', options.format);
  if (options.fit) params.set('fit', options.fit);

  const paramString = params.toString();
  return paramString ? `${baseSrc}?${paramString}` : baseSrc;
}

/**
 * Image optimization hooks and utilities for React components
 */
export const imageOptimization = {
  generateSrcSet,
  generateSizes,
  createBlurDataURL,
  detectWebPSupport,
  detectAVIFSupport,
  getOptimalFormat,
  preloadImage,
  compressImage,
  buildCDNUrl,
  ImagePerformanceObserver,
  configs: imageConfigs
};

export default imageOptimization;