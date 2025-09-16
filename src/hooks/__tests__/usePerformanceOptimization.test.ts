/**
 * @fileoverview usePerformanceOptimization hook test suite
 * @author ROKO QA Team
 * @version 1.0.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import {
  usePerformanceOptimization,
  use3DPerformanceOptimization,
  useImageOptimization,
  useCoreWebVitalsOptimization
} from '../usePerformanceOptimization';

// Mock performance monitoring classes
const mockWebVitalsMonitor = {
  getMetrics: vi.fn(),
  trackCustomMetric: vi.fn(),
  trackThreeJSMetrics: vi.fn(),
  destroy: vi.fn(),
};

const mockPerformanceDashboard = {
  destroy: vi.fn(),
};

const mockCoreWebVitalsOptimizer = {
  optimizeLCP: {
    preloadCriticalResources: vi.fn(),
    optimizeImageLoading: vi.fn(),
  },
  optimizeINP: {
    debounceInteractions: vi.fn(),
    batchUpdates: vi.fn(),
  },
  optimizeCLS: {
    reserveSpace: vi.fn(),
    stabilizeImages: vi.fn(),
  },
};

const mockPerformance3DManager = {
  initialize: vi.fn().mockResolvedValue(undefined),
  update: vi.fn(),
  cullScene: vi.fn(),
  disposeObject: vi.fn(),
  getStats: vi.fn().mockReturnValue({
    fps: 60,
    quality: 1,
    memory: { geometries: 5, textures: 10 },
  }),
  cleanup: vi.fn(),
};

const mockImageOptimization = {
  detectAVIFSupport: vi.fn().mockResolvedValue(true),
  detectWebPSupport: vi.fn().mockResolvedValue(true),
  getOptimalFormat: vi.fn().mockResolvedValue('avif'),
  generateSrcSet: vi.fn().mockReturnValue('image-400.avif 400w, image-800.avif 800w'),
  generateSizes: vi.fn().mockReturnValue('(max-width: 400px) 400px, 800px'),
  createBlurDataURL: vi.fn().mockReturnValue('data:image/svg+xml;base64,'),
  preloadImage: vi.fn(),
};

// Mock external dependencies
vi.mock('@/utils/monitoring', () => ({
  WebVitalsMonitor: vi.fn().mockImplementation(() => mockWebVitalsMonitor),
  PerformanceDashboard: vi.fn().mockImplementation(() => mockPerformanceDashboard),
}));

vi.mock('@/utils/coreWebVitals', () => ({
  CoreWebVitalsOptimizer: vi.fn().mockImplementation(() => mockCoreWebVitalsOptimizer),
}));

vi.mock('@/utils/3dPerformance', () => ({
  Performance3DManager: vi.fn().mockImplementation(() => mockPerformance3DManager),
}));

vi.mock('@/utils/imageOptimization', () => ({
  imageOptimization: mockImageOptimization,
}));

// Mock performance API
Object.defineProperty(global, 'performance', {
  value: {
    now: vi.fn(() => 1000),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
  },
});

describe('usePerformanceOptimization Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset mock return values
    mockWebVitalsMonitor.getMetrics.mockReturnValue({
      lcp: 2000,
      inp: 150,
      cls: 0.05,
      fcp: 1500,
      ttfb: 400,
      bundleSize: { main: 150000, vendor: 80000 },
      resourceLoadTime: { 'hero-image.jpg': 800 },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Main usePerformanceOptimization Hook', () => {
    it('should initialize with default configuration', async () => {
      const { result } = renderHook(() => usePerformanceOptimization());
      
      expect(result.current.isOptimized).toBe(false);
      expect(result.current.metrics.webVitals.lcp).toBe(null);
      
      await waitFor(() => {
        expect(result.current.isOptimized).toBe(true);
      });
    });

    it('should initialize with custom configuration', async () => {
      const config = {
        enableMonitoring: true,
        enableDashboard: true,
        enable3DOptimization: false,
        enableImageOptimization: false,
        isDevelopment: true,
      };
      
      const { result } = renderHook(() => usePerformanceOptimization(config));
      
      await waitFor(() => {
        expect(result.current.isOptimized).toBe(true);
      });
      
      expect(result.current.optimizers.performance3D).toBe(null);
    });

    it('should update metrics periodically', async () => {
      const { result } = renderHook(() => usePerformanceOptimization({
        enableMonitoring: true,
      }));
      
      await waitFor(() => {
        expect(result.current.isOptimized).toBe(true);
      });
      
      // Wait for metrics update
      await waitFor(() => {
        expect(result.current.metrics.webVitals.lcp).toBe(2000);
        expect(result.current.metrics.webVitals.inp).toBe(150);
        expect(result.current.metrics.webVitals.cls).toBe(0.05);
      }, { timeout: 2000 });
    });

    it('should track custom metrics', async () => {
      const { result } = renderHook(() => usePerformanceOptimization());
      
      await waitFor(() => {
        expect(result.current.isOptimized).toBe(true);
      });
      
      act(() => {
        result.current.trackCustomMetric('custom_metric', 500, 1000);
      });
      
      expect(mockWebVitalsMonitor.trackCustomMetric).toHaveBeenCalledWith('custom_metric', 500, 1000);
    });

    it('should track Three.js metrics', async () => {
      const { result } = renderHook(() => usePerformanceOptimization());
      
      await waitFor(() => {
        expect(result.current.isOptimized).toBe(true);
      });
      
      act(() => {
        result.current.trackThreeJSMetrics(800, 16);
      });
      
      expect(mockWebVitalsMonitor.trackThreeJSMetrics).toHaveBeenCalledWith(800, 16);
    });

    it('should preload images', async () => {
      const { result } = renderHook(() => usePerformanceOptimization());
      
      await waitFor(() => {
        expect(result.current.isOptimized).toBe(true);
      });
      
      act(() => {
        result.current.preloadImage('/hero-image.jpg', { fetchpriority: 'high' });
      });
      
      expect(mockImageOptimization.preloadImage).toHaveBeenCalledWith('/hero-image.jpg', {
        fetchpriority: 'high',
      });
    });

    it('should create lazy image components', async () => {
      const { result } = renderHook(() => usePerformanceOptimization());
      
      await waitFor(() => {
        expect(result.current.isOptimized).toBe(true);
      });
      
      const lazyImage = result.current.createLazyImage('/image.jpg', 'Alt text');
      
      expect(mockImageOptimization.generateSrcSet).toHaveBeenCalledWith('/image.jpg', [400, 800, 1200]);
    });

    it('should cleanup on unmount', () => {
      const { unmount } = renderHook(() => usePerformanceOptimization());
      
      unmount();
      
      expect(mockWebVitalsMonitor.destroy).toHaveBeenCalled();
      expect(mockPerformanceDashboard.destroy).toHaveBeenCalled();
      expect(mockPerformance3DManager.cleanup).toHaveBeenCalled();
    });

    it('should handle initialization errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock an initialization error
      const mockConstructor = vi.mocked(require('@/utils/monitoring').WebVitalsMonitor);
      mockConstructor.mockImplementationOnce(() => {
        throw new Error('Initialization failed');
      });
      
      const { result } = renderHook(() => usePerformanceOptimization());
      
      // Should not crash
      expect(result.current.isOptimized).toBe(false);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to initialize performance optimizations:', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });

    it('should disable features in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const { result } = renderHook(() => usePerformanceOptimization({
        enableDashboard: true,
        isDevelopment: false,
      }));
      
      await waitFor(() => {
        expect(result.current.isOptimized).toBe(true);
      });
      
      // Dashboard should not be initialized in production
      const mockDashboardConstructor = vi.mocked(require('@/utils/monitoring').PerformanceDashboard);
      expect(mockDashboardConstructor).not.toHaveBeenCalled();
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('use3DPerformanceOptimization Hook', () => {
    const mockCamera = { position: { x: 0, y: 0, z: 5 } };

    it('should initialize 3D performance manager with camera', async () => {
      const { result } = renderHook(() => use3DPerformanceOptimization(mockCamera));
      
      expect(result.current.isInitialized).toBe(false);
      
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });
      
      expect(mockPerformance3DManager.initialize).toHaveBeenCalledWith(mockCamera);
    });

    it('should not initialize without camera', () => {
      const { result } = renderHook(() => use3DPerformanceOptimization(undefined));
      
      expect(result.current.isInitialized).toBe(false);
      expect(mockPerformance3DManager.initialize).not.toHaveBeenCalled();
    });

    it('should provide performance methods', async () => {
      const { result } = renderHook(() => use3DPerformanceOptimization(mockCamera));
      
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });
      
      // Test updatePerformance
      act(() => {
        result.current.updatePerformance();
      });
      expect(mockPerformance3DManager.update).toHaveBeenCalled();
      
      // Test cullScene
      const mockScene = { children: [] };
      act(() => {
        result.current.cullScene(mockScene);
      });
      expect(mockPerformance3DManager.cullScene).toHaveBeenCalledWith(mockScene);
      
      // Test disposeObject
      const mockObject = { geometry: {}, material: {} };
      act(() => {
        result.current.disposeObject(mockObject);
      });
      expect(mockPerformance3DManager.disposeObject).toHaveBeenCalledWith(mockObject);
      
      // Test getStats
      const stats = result.current.getStats();
      expect(stats).toEqual({
        fps: 60,
        quality: 1,
        memory: { geometries: 5, textures: 10 },
      });
    });

    it('should cleanup on unmount', async () => {
      const { result, unmount } = renderHook(() => use3DPerformanceOptimization(mockCamera));
      
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });
      
      unmount();
      
      expect(mockPerformance3DManager.cleanup).toHaveBeenCalled();
    });
  });

  describe('useImageOptimization Hook', () => {
    it('should detect format support on initialization', async () => {
      const { result } = renderHook(() => useImageOptimization());
      
      expect(result.current.formatSupport.avif).toBe(false);
      expect(result.current.formatSupport.webp).toBe(false);
      
      await waitFor(() => {
        expect(result.current.formatSupport.avif).toBe(true);
        expect(result.current.formatSupport.webp).toBe(true);
      });
      
      expect(mockImageOptimization.detectAVIFSupport).toHaveBeenCalled();
      expect(mockImageOptimization.detectWebPSupport).toHaveBeenCalled();
    });

    it('should get optimal format', async () => {
      const { result } = renderHook(() => useImageOptimization());
      
      await waitFor(() => {
        expect(result.current.formatSupport.avif).toBe(true);
      });
      
      const format = await result.current.getOptimalFormat(['avif', 'webp', 'jpg']);
      
      expect(format).toBe('avif');
      expect(mockImageOptimization.getOptimalFormat).toHaveBeenCalledWith(['avif', 'webp', 'jpg']);
    });

    it('should generate responsive image data', () => {
      const { result } = renderHook(() => useImageOptimization());
      
      const responsive = result.current.generateResponsiveImage('/hero.jpg', [400, 800, 1200]);
      
      expect(responsive.srcSet).toBe('image-400.avif 400w, image-800.avif 800w');
      expect(responsive.sizes).toBe('(max-width: 400px) 400px, 800px');
      expect(responsive.placeholder).toBe('data:image/svg+xml;base64,');
      
      expect(mockImageOptimization.generateSrcSet).toHaveBeenCalledWith('/hero.jpg', [400, 800, 1200]);
    });

    it('should preload critical images', () => {
      const { result } = renderHook(() => useImageOptimization());
      
      result.current.preloadCriticalImage('/critical-image.jpg');
      
      expect(mockImageOptimization.preloadImage).toHaveBeenCalledWith('/critical-image.jpg', {
        fetchpriority: 'high',
        as: 'image',
      });
    });
  });

  describe('useCoreWebVitalsOptimization Hook', () => {
    it('should initialize Core Web Vitals optimizer', () => {
      const { result } = renderHook(() => useCoreWebVitalsOptimization());
      
      expect(result.current.isReady).toBe(false);
      
      // Wait for initialization
      setTimeout(() => {
        expect(result.current.isReady).toBe(true);
        expect(result.current.optimizeLCP).toBeDefined();
        expect(result.current.optimizeINP).toBeDefined();
        expect(result.current.optimizeCLS).toBeDefined();
      }, 0);
    });

    it('should provide optimization methods', () => {
      const { result } = renderHook(() => useCoreWebVitalsOptimization());
      
      // Should have optimization objects (even if empty initially)
      expect(typeof result.current.optimizeLCP).toBe('object');
      expect(typeof result.current.optimizeINP).toBe('object');
      expect(typeof result.current.optimizeCLS).toBe('object');
    });
  });

  describe('Integration Tests', () => {
    it('should work together with all optimizations enabled', async () => {
      const mockCamera = { position: { x: 0, y: 0, z: 5 } };
      
      const { result: perfResult } = renderHook(() => usePerformanceOptimization({
        enableMonitoring: true,
        enable3DOptimization: true,
        enableImageOptimization: true,
        enableCoreWebVitals: true,
      }));
      
      const { result: threeDResult } = renderHook(() => use3DPerformanceOptimization(mockCamera));
      
      const { result: imageResult } = renderHook(() => useImageOptimization());
      
      const { result: cwvResult } = renderHook(() => useCoreWebVitalsOptimization());
      
      // Wait for all to initialize
      await waitFor(() => {
        expect(perfResult.current.isOptimized).toBe(true);
        expect(threeDResult.current.isInitialized).toBe(true);
        expect(imageResult.current.formatSupport.avif).toBe(true);
        expect(cwvResult.current.isReady).toBe(true);
      });
      
      // Test integrated functionality
      act(() => {
        perfResult.current.trackThreeJSMetrics(500, 16.7);
        perfResult.current.preloadImage('/hero.jpg');
        threeDResult.current.updatePerformance();
      });
      
      expect(mockWebVitalsMonitor.trackThreeJSMetrics).toHaveBeenCalledWith(500, 16.7);
      expect(mockImageOptimization.preloadImage).toHaveBeenCalledWith('/hero.jpg', {
        fetchpriority: 'high',
      });
      expect(mockPerformance3DManager.update).toHaveBeenCalled();
    });

    it('should handle performance degradation gracefully', async () => {
      // Mock poor performance conditions
      mockPerformance3DManager.getStats.mockReturnValue({
        fps: 30, // Low FPS
        quality: 0.5, // Reduced quality
        memory: { geometries: 100, textures: 200 }, // High memory usage
      });
      
      const mockCamera = { position: { x: 0, y: 0, z: 5 } };
      const { result } = renderHook(() => use3DPerformanceOptimization(mockCamera));
      
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });
      
      const stats = result.current.getStats();
      expect(stats?.fps).toBe(30);
      expect(stats?.quality).toBe(0.5);
    });

    it('should optimize based on device capabilities', async () => {
      // Mock low-end device
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        value: 2,
        configurable: true,
      });
      
      Object.defineProperty(navigator, 'deviceMemory', {
        value: 2,
        configurable: true,
      });
      
      const { result } = renderHook(() => usePerformanceOptimization({
        enable3DOptimization: true,
      }));
      
      await waitFor(() => {
        expect(result.current.isOptimized).toBe(true);
      });
      
      // Should still initialize but might use different settings
      expect(result.current.optimizers.performance3D).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle 3D initialization failures', async () => {
      mockPerformance3DManager.initialize.mockRejectedValue(new Error('WebGL not supported'));
      
      const mockCamera = { position: { x: 0, y: 0, z: 5 } };
      const { result } = renderHook(() => use3DPerformanceOptimization(mockCamera));
      
      // Should not throw and should remain uninitialized
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(false);
      });
    });

    it('should handle image optimization failures', async () => {
      mockImageOptimization.detectAVIFSupport.mockRejectedValue(new Error('Detection failed'));
      
      const { result } = renderHook(() => useImageOptimization());
      
      // Should handle gracefully and use fallback
      await waitFor(() => {
        expect(result.current.formatSupport.avif).toBe(false);
      });
    });

    it('should handle metrics collection failures', async () => {
      mockWebVitalsMonitor.getMetrics.mockImplementation(() => {
        throw new Error('Metrics collection failed');
      });
      
      const { result } = renderHook(() => usePerformanceOptimization());
      
      await waitFor(() => {
        expect(result.current.isOptimized).toBe(true);
      });
      
      // Should continue working despite metrics errors
      expect(result.current.metrics.webVitals.lcp).toBe(null);
    });
  });
});
