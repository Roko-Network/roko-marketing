/**
 * Performance detection and optimization utilities for 3D graphics
 */

import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

export type PerformanceLevel = 'high' | 'medium' | 'low';

export interface PerformanceConfig {
  level: PerformanceLevel;
  devicePixelRatio: number;
  maxFPS: number;
  enableShadows: boolean;
  enablePostProcessing: boolean;
  particleCount: {
    temporal: number;
    network: number;
    background: number;
  };
  geometry: {
    orbDetail: number;
    globeSegments: number;
    arcSegments: number;
  };
}

/**
 * Detects WebGL capabilities and device performance characteristics
 */
export const detectWebGLCapabilities = (): PerformanceLevel | 'none' => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

    if (!gl) return 'none';

    // Get renderer info
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : '';

    // Check for mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // Check memory constraints
    const memory = (navigator as any).deviceMemory;
    const cores = navigator.hardwareConcurrency || 2;

    // Performance scoring
    let score = 0;

    // Mobile penalty
    if (isMobile) score -= 30;

    // GPU scoring
    if (renderer.toLowerCase().includes('nvidia')) score += 40;
    else if (renderer.toLowerCase().includes('amd')) score += 35;
    else if (renderer.toLowerCase().includes('intel')) score += 20;
    else score += 10;

    // Memory scoring
    if (memory >= 8) score += 20;
    else if (memory >= 4) score += 10;
    else if (memory >= 2) score += 5;

    // CPU scoring
    if (cores >= 8) score += 15;
    else if (cores >= 4) score += 10;
    else if (cores >= 2) score += 5;

    // Screen resolution penalty for high DPI
    const pixelRatio = window.devicePixelRatio || 1;
    if (pixelRatio > 2) score -= 10;
    else if (pixelRatio > 1.5) score -= 5;

    // Determine performance level
    if (score >= 60) return 'high';
    if (score >= 30) return 'medium';
    return 'low';

  } catch (error) {
    console.warn('WebGL detection failed:', error);
    return 'low';
  }
};

/**
 * Gets performance configuration based on detected or specified level
 */
export const getPerformanceConfig = (level?: PerformanceLevel): PerformanceConfig => {
  const detectedLevel = level || detectWebGLCapabilities();
  const actualLevel = detectedLevel === 'none' ? 'low' : detectedLevel;

  const configs: Record<PerformanceLevel, PerformanceConfig> = {
    high: {
      level: 'high',
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      maxFPS: 60,
      enableShadows: true,
      enablePostProcessing: true,
      particleCount: {
        temporal: 5000,
        network: 200,
        background: 2000
      },
      geometry: {
        orbDetail: 3,
        globeSegments: 64,
        arcSegments: 32
      }
    },
    medium: {
      level: 'medium',
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
      maxFPS: 60,
      enableShadows: false,
      enablePostProcessing: true,
      particleCount: {
        temporal: 3000,
        network: 100,
        background: 1000
      },
      geometry: {
        orbDetail: 2,
        globeSegments: 48,
        arcSegments: 24
      }
    },
    low: {
      level: 'low',
      devicePixelRatio: 1,
      maxFPS: 30,
      enableShadows: false,
      enablePostProcessing: false,
      particleCount: {
        temporal: 1000,
        network: 50,
        background: 500
      },
      geometry: {
        orbDetail: 1,
        globeSegments: 32,
        arcSegments: 16
      }
    }
  };

  return configs[actualLevel];
};

/**
 * Performance monitoring and FPS tracking
 */
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private averageFPS = 60;
  private frameHistory: number[] = [];
  private readonly maxHistory = 60;

  public getCurrentFPS(): number {
    return this.fps;
  }

  public getAverageFPS(): number {
    return this.averageFPS;
  }

  public update(): void {
    const now = performance.now();
    const delta = now - this.lastTime;

    this.frameCount++;

    if (delta >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / delta);
      this.frameHistory.push(this.fps);

      if (this.frameHistory.length > this.maxHistory) {
        this.frameHistory.shift();
      }

      this.averageFPS = Math.round(
        this.frameHistory.reduce((sum, fps) => sum + fps, 0) / this.frameHistory.length
      );

      this.frameCount = 0;
      this.lastTime = now;
    }
  }

  public shouldReduceQuality(): boolean {
    return this.averageFPS < 30 && this.frameHistory.length >= 10;
  }

  public shouldIncreaseQuality(): boolean {
    return this.averageFPS > 55 && this.frameHistory.length >= 30;
  }
}

/**
 * Adaptive quality manager that adjusts settings based on performance
 */
export class AdaptiveQualityManager {
  private monitor = new PerformanceMonitor();
  private currentConfig: PerformanceConfig;
  private callbacks: Array<(config: PerformanceConfig) => void> = [];

  constructor(initialLevel?: PerformanceLevel) {
    this.currentConfig = getPerformanceConfig(initialLevel);
  }

  public getCurrentConfig(): PerformanceConfig {
    return this.currentConfig;
  }

  public onConfigChange(callback: (config: PerformanceConfig) => void): void {
    this.callbacks.push(callback);
  }

  public update(): void {
    this.monitor.update();

    const shouldReduce = this.monitor.shouldReduceQuality();
    const shouldIncrease = this.monitor.shouldIncreaseQuality();

    if (shouldReduce && this.currentConfig.level !== 'low') {
      this.reduceQuality();
    } else if (shouldIncrease && this.currentConfig.level !== 'high') {
      this.increaseQuality();
    }
  }

  private reduceQuality(): void {
    const newLevel: PerformanceLevel =
      this.currentConfig.level === 'high' ? 'medium' : 'low';

    this.currentConfig = getPerformanceConfig(newLevel);
    this.notifyCallbacks();
  }

  private increaseQuality(): void {
    const newLevel: PerformanceLevel =
      this.currentConfig.level === 'low' ? 'medium' : 'high';

    this.currentConfig = getPerformanceConfig(newLevel);
    this.notifyCallbacks();
  }

  private notifyCallbacks(): void {
    this.callbacks.forEach(callback => callback(this.currentConfig));
  }
}

/**
 * Device and browser capability detection
 */
export const getDeviceCapabilities = () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

  if (!gl) {
    return {
      webgl: false,
      webgl2: false,
      maxTextureSize: 0,
      maxCubeMapSize: 0,
      extensions: []
    };
  }

  const isWebGL2 = gl instanceof WebGL2RenderingContext;

  return {
    webgl: true,
    webgl2: isWebGL2,
    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
    maxCubeMapSize: gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),
    extensions: gl.getSupportedExtensions() || [],
    vendor: gl.getParameter(gl.VENDOR),
    renderer: gl.getParameter(gl.RENDERER),
    version: gl.getParameter(gl.VERSION),
    shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
  };
};

/**
 * Memory usage estimation for 3D assets
 */
export const estimateMemoryUsage = (config: PerformanceConfig): number => {
  const {
    particleCount: { temporal, network, background },
    geometry: { orbDetail, globeSegments }
  } = config;

  // Rough memory calculation in MB
  const particleMemory = (temporal + network + background) * 12 * 4; // position + color (bytes)
  const geometryMemory = (Math.pow(4, orbDetail) * 60 + globeSegments * globeSegments * 36) * 4;
  const textureMemory = config.enablePostProcessing ? 16 * 1024 * 1024 : 8 * 1024 * 1024;

  return (particleMemory + geometryMemory + textureMemory) / (1024 * 1024);
};

/**
 * Web Vitals reporting function
 */
export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onINP(onPerfEntry);
    onLCP(onPerfEntry);
    onFCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

/**
 * Simple timing utility for performance measurements
 */
export const timing = {
  timers: new Map<string, number>(),

  start(label: string): void {
    this.timers.set(label, performance.now());
  },

  end(label: string): number {
    const startTime = this.timers.get(label);
    if (!startTime) {
      console.warn(`Timer '${label}' was not started`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    this.timers.delete(label);

    console.log(`Timer '${label}': ${duration.toFixed(2)}ms`);
    return duration;
  },

  measure(label: string, fn: () => void | Promise<void>): Promise<number> {
    return new Promise(async (resolve) => {
      this.start(label);
      await fn();
      const duration = this.end(label);
      resolve(duration);
    });
  }
};

/**
 * Initialize performance monitoring
 */
export const initPerformanceMonitoring = (): void => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Mark app initialization
    performance.mark('app-init');

    // Set up navigation timing observer
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            console.log(`Performance entry: ${entry.name} - ${entry.duration?.toFixed(2)}ms`);
          });
        });

        observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
      } catch (error) {
        console.warn('Performance observer setup failed:', error);
      }
    }
  }
};

export default {
  detectWebGLCapabilities,
  getPerformanceConfig,
  PerformanceMonitor,
  AdaptiveQualityManager,
  getDeviceCapabilities,
  estimateMemoryUsage,
  reportWebVitals,
  timing,
  initPerformanceMonitoring
};