/**
 * Performance Optimization Hook for ROKO Network
 * Integrates all performance optimizations into React app
 */

import { useEffect, useRef, useState } from 'react';
import { WebVitalsMonitor, PerformanceDashboard } from '@/utils/monitoring';
import { CoreWebVitalsOptimizer } from '@/utils/coreWebVitals';
import { Performance3DManager } from '@/utils/3dPerformance';
import { imageOptimization } from '@/utils/imageOptimization';

interface PerformanceConfig {
  enableMonitoring?: boolean;
  enableDashboard?: boolean;
  enable3DOptimization?: boolean;
  enableImageOptimization?: boolean;
  enableCoreWebVitals?: boolean;
  dashboardContainerId?: string;
  isDevelopment?: boolean;
}

interface PerformanceMetrics {
  webVitals: {
    lcp: number | null;
    inp: number | null;
    cls: number | null;
    fcp: number | null;
    ttfb: number | null;
  };
  performance3D: {
    fps: number;
    quality: number;
    memory: any;
  } | null;
  bundleSize: Record<string, number>;
  imageLoadTimes: Record<string, number>;
}

interface PerformanceHook {
  metrics: PerformanceMetrics;
  isOptimized: boolean;
  optimizers: {
    webVitals: CoreWebVitalsOptimizer | null;
    performance3D: Performance3DManager | null;
    imageOptimization: typeof imageOptimization;
  };
  trackCustomMetric: (name: string, value: number, budget?: number) => void;
  trackThreeJSMetrics: (initTime: number, renderTime: number) => void;
  preloadImage: (src: string, options?: any) => void;
  createLazyImage: (src: string, alt: string, options?: any) => string;
}

/**
 * Main performance optimization hook
 */
export function usePerformanceOptimization(config: PerformanceConfig = {}): PerformanceHook {
  const {
    enableMonitoring = true,
    enableDashboard = false,
    enable3DOptimization = true,
    enableImageOptimization = true,
    enableCoreWebVitals = true,
    dashboardContainerId = 'performance-dashboard',
    isDevelopment = process.env.NODE_ENV === 'development'
  } = config;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    webVitals: {
      lcp: null,
      inp: null,
      cls: null,
      fcp: null,
      ttfb: null
    },
    performance3D: null,
    bundleSize: {},
    imageLoadTimes: {}
  });

  const [isOptimized, setIsOptimized] = useState(false);

  const monitorRef = useRef<WebVitalsMonitor | null>(null);
  const dashboardRef = useRef<PerformanceDashboard | null>(null);
  const coreWebVitalsRef = useRef<CoreWebVitalsOptimizer | null>(null);
  const performance3DRef = useRef<Performance3DManager | null>(null);

  // Initialize performance optimizations
  useEffect(() => {
    let metricsInterval: NodeJS.Timeout | null = null;
    
    const initializeOptimizations = async (): Promise<void> => {
      try {
        // Initialize Web Vitals monitoring
        if (enableMonitoring) {
          monitorRef.current = new WebVitalsMonitor(
            {
              lcp: 2500,
              inp: 200,
              cls: 0.1,
              fcp: 1800,
              ttfb: 600,
              totalBundleSize: 250000,
              initialChunkSize: 50000,
              imageLoadTime: 2000,
              threejsInitTime: 1000
            },
            {
              console: isDevelopment,
              localStorage: true,
              webhook: !isDevelopment ? '/api/analytics/performance' : undefined
            }
          );

          // Subscribe to metrics updates
          const updateMetrics = () => {
            if (monitorRef.current) {
              const currentMetrics = monitorRef.current.getMetrics();
              setMetrics(prev => ({
                ...prev,
                webVitals: {
                  lcp: currentMetrics.lcp,
                  inp: currentMetrics.inp,
                  cls: currentMetrics.cls,
                  fcp: currentMetrics.fcp,
                  ttfb: currentMetrics.ttfb
                },
                bundleSize: currentMetrics.bundleSize,
                imageLoadTimes: currentMetrics.resourceLoadTime
              }));
            }
          };

          // Update metrics every second
          metricsInterval = setInterval(updateMetrics, 1000);
        }

        // Initialize performance dashboard (development only)
        if (enableDashboard && isDevelopment && monitorRef.current) {
          dashboardRef.current = new PerformanceDashboard(
            monitorRef.current,
            dashboardContainerId
          );
        }

        // Initialize Core Web Vitals optimizer
        if (enableCoreWebVitals) {
          coreWebVitalsRef.current = new CoreWebVitalsOptimizer({
            lcp: {
              preloadCriticalImages: true,
              optimizeHeroSection: true,
              inlineCriticalCSS: true,
              preconnectOrigins: [
                'https://fonts.googleapis.com',
                'https://api.roko.network',
                'https://rpc.roko.network'
              ]
            },
            inp: {
              debounceTime: 16,
              enableOptimisticUI: true,
              batchUpdates: true,
              useTransition: true
            },
            cls: {
              reserveSpace: true,
              preloadFonts: true,
              stabilizeImages: true,
              useTransform: true
            }
          });
        }

        // Initialize 3D performance manager
        if (enable3DOptimization) {
          performance3DRef.current = new Performance3DManager();
          // Note: Camera initialization happens when 3D scene is created
        }

        // Setup image optimization
        if (enableImageOptimization) {
          // Pre-detect format support for faster loading
          const formatSupport = await Promise.all([
            imageOptimization.detectAVIFSupport(),
            imageOptimization.detectWebPSupport()
          ]);

          console.log('Image format support:', {
            avif: formatSupport[0],
            webp: formatSupport[1]
          });
        }

        setIsOptimized(true);

        // Mark performance initialization complete
        if (monitorRef.current) {
          monitorRef.current.trackCustomMetric('performance_init_complete', performance.now());
        }

      } catch (error) {
        console.error('Failed to initialize performance optimizations:', error);
      }
    };

    initializeOptimizations();

    // Cleanup on unmount
    return () => {
      if (metricsInterval) {
        clearInterval(metricsInterval);
      }
      monitorRef.current?.destroy();
      dashboardRef.current?.destroy();
      performance3DRef.current?.cleanup();
    };
  }, [
    enableMonitoring,
    enableDashboard,
    enable3DOptimization,
    enableImageOptimization,
    enableCoreWebVitals,
    isDevelopment,
    dashboardContainerId
  ]);

  // Update 3D metrics
  useEffect(() => {
    if (performance3DRef.current) {
      const updateInterval = setInterval(() => {
        const stats = performance3DRef.current?.getStats();
        if (stats) {
          setMetrics(prev => ({
            ...prev,
            performance3D: stats
          }));
        }
      }, 1000);

      return () => clearInterval(updateInterval);
    }
    return undefined;
  }, [isOptimized]);

  // Track custom metrics
  const trackCustomMetric = (name: string, value: number, budget?: number) => {
    monitorRef.current?.trackCustomMetric(name, value, budget);
  };

  // Track Three.js specific metrics
  const trackThreeJSMetrics = (initTime: number, renderTime: number) => {
    monitorRef.current?.trackThreeJSMetrics(initTime, renderTime);
  };

  // Preload critical images
  const preloadImage = (src: string, options: any = {}) => {
    imageOptimization.preloadImage(src, {
      fetchpriority: 'high',
      ...options
    });
  };

  // Create optimized lazy image component
  const createLazyImage = (src: string, alt: string, options: any = {}) => {
    // This would return a lazy image component
    // Implementation depends on your component structure
    return imageOptimization.generateSrcSet(src, [400, 800, 1200]);
  };

  return {
    metrics,
    isOptimized,
    optimizers: {
      webVitals: coreWebVitalsRef.current,
      performance3D: performance3DRef.current,
      imageOptimization
    },
    trackCustomMetric,
    trackThreeJSMetrics,
    preloadImage,
    createLazyImage
  };
}

/**
 * Hook for 3D performance optimization
 */
export function use3DPerformanceOptimization(camera?: any) {
  const [manager, setManager] = useState<Performance3DManager | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (camera && !manager) {
      const perfManager = new Performance3DManager();
      perfManager.initialize(camera).then(() => {
        setManager(perfManager);
        setIsInitialized(true);
      });

      return () => {
        perfManager.cleanup();
      };
    }
    return undefined;
  }, [camera, manager]);

  const updatePerformance = () => {
    manager?.update();
  };

  const cullScene = (scene: any) => {
    manager?.cullScene(scene);
  };

  const disposeObject = (object: any) => {
    manager?.disposeObject(object);
  };

  const getStats = () => {
    return manager?.getStats() || null;
  };

  return {
    isInitialized,
    updatePerformance,
    cullScene,
    disposeObject,
    getStats
  };
}

/**
 * Hook for image optimization
 */
export function useImageOptimization() {
  const [formatSupport, setFormatSupport] = useState({
    avif: false,
    webp: false
  });

  useEffect(() => {
    const detectSupport = async () => {
      const [avif, webp] = await Promise.all([
        imageOptimization.detectAVIFSupport(),
        imageOptimization.detectWebPSupport()
      ]);

      setFormatSupport({ avif, webp });
    };

    detectSupport();
  }, []);

  const getOptimalFormat = async (formats: string[] = ['avif', 'webp', 'jpg']) => {
    return await imageOptimization.getOptimalFormat(formats);
  };

  const generateResponsiveImage = (src: string, sizes: number[] = [400, 800, 1200]) => {
    return {
      srcSet: imageOptimization.generateSrcSet(src, sizes),
      sizes: imageOptimization.generateSizes(),
      placeholder: imageOptimization.createBlurDataURL()
    };
  };

  const preloadCriticalImage = (src: string) => {
    imageOptimization.preloadImage(src, {
      fetchpriority: 'high',
      as: 'image'
    });
  };

  return {
    formatSupport,
    generateResponsiveImage,
    preloadCriticalImage,
    ...imageOptimization
  };
}

/**
 * Hook for Core Web Vitals optimization
 */
export function useCoreWebVitalsOptimization() {
  const [optimizer, setOptimizer] = useState<CoreWebVitalsOptimizer | null>(null);

  useEffect(() => {
    const cwvOptimizer = new CoreWebVitalsOptimizer();
    setOptimizer(cwvOptimizer);
  }, []);

  const optimizeLCP = optimizer?.optimizeLCP || {};
  const optimizeINP = optimizer?.optimizeINP || {};
  const optimizeCLS = optimizer?.optimizeCLS || {};

  return {
    optimizeLCP,
    optimizeINP,
    optimizeCLS,
    isReady: optimizer !== null
  };
}

export default usePerformanceOptimization;