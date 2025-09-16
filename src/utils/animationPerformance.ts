/**
 * ROKO Network Animation Performance Utilities
 *
 * Performance monitoring, optimization utilities, and reduced motion support
 * for maintaining 60fps and accessibility compliance
 */

import { MotionProps, useReducedMotion } from 'framer-motion';

// Performance monitoring interface
export interface PerformanceMetrics {
  fps: number;
  frameDrops: number;
  animationDuration: number;
  memoryUsage?: number;
  timestamp: number;
}

// Animation performance monitor
class AnimationPerformanceMonitor {
  private frames: number[] = [];
  private lastTime = performance.now();
  private frameDrops = 0;
  private isMonitoring = false;
  private callbacks: ((metrics: PerformanceMetrics) => void)[] = [];

  start() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.lastTime = performance.now();
    this.frames = [];
    this.frameDrops = 0;
    this.monitor();
  }

  stop() {
    this.isMonitoring = false;
  }

  subscribe(callback: (metrics: PerformanceMetrics) => void) {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  private monitor = () => {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    // Track frame timing
    this.frames.push(deltaTime);
    if (this.frames.length > 60) {
      this.frames.shift();
    }

    // Detect frame drops (>16.67ms = dropped frame at 60fps)
    if (deltaTime > 16.67) {
      this.frameDrops++;
    }

    // Calculate FPS
    const avgFrameTime = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
    const fps = 1000 / avgFrameTime;

    // Get memory usage if available
    let memoryUsage: number | undefined;
    if ('memory' in performance) {
      memoryUsage = (performance as any).memory.usedJSHeapSize;
    }

    // Notify subscribers
    const metrics: PerformanceMetrics = {
      fps,
      frameDrops: this.frameDrops,
      animationDuration: deltaTime,
      memoryUsage,
      timestamp: currentTime,
    };

    this.callbacks.forEach(callback => callback(metrics));

    this.lastTime = currentTime;
    requestAnimationFrame(this.monitor);
  };

  getMetrics(): PerformanceMetrics {
    const currentTime = performance.now();
    const avgFrameTime = this.frames.reduce((a, b) => a + b, 0) / this.frames.length || 16.67;
    const fps = 1000 / avgFrameTime;

    let memoryUsage: number | undefined;
    if ('memory' in performance) {
      memoryUsage = (performance as any).memory.usedJSHeapSize;
    }

    return {
      fps,
      frameDrops: this.frameDrops,
      animationDuration: avgFrameTime,
      memoryUsage,
      timestamp: currentTime,
    };
  }
}

// Global performance monitor instance
export const performanceMonitor = new AnimationPerformanceMonitor();

// Device capability detection
export interface DeviceCapabilities {
  isLowEndDevice: boolean;
  supportsHardwareAcceleration: boolean;
  maxAnimations: number;
  preferredQuality: 'low' | 'medium' | 'high';
}

export const detectDeviceCapabilities = (): DeviceCapabilities => {
  // Get device memory (if available)
  const deviceMemory = (navigator as any).deviceMemory || 4;

  // Get hardware concurrency
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;

  // Detect GPU info (basic check)
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  const supportsHardwareAcceleration = !!gl;

  // Check if it's a mobile device
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  // Determine if it's a low-end device
  const isLowEndDevice = deviceMemory < 4 || hardwareConcurrency < 4 || isMobile;

  // Set animation limits based on device
  const maxAnimations = isLowEndDevice ? 3 : supportsHardwareAcceleration ? 10 : 6;

  // Determine preferred quality
  let preferredQuality: 'low' | 'medium' | 'high' = 'medium';
  if (isLowEndDevice) {
    preferredQuality = 'low';
  } else if (supportsHardwareAcceleration && deviceMemory >= 8) {
    preferredQuality = 'high';
  }

  return {
    isLowEndDevice,
    supportsHardwareAcceleration,
    maxAnimations,
    preferredQuality,
  };
};

// Animation queue manager for performance
class AnimationQueue {
  private queue: (() => void)[] = [];
  private running: Set<string> = new Set();
  private capabilities = detectDeviceCapabilities();

  add(id: string, animation: () => void, priority: 'low' | 'medium' | 'high' = 'medium') {
    // Skip if already running
    if (this.running.has(id)) return;

    // Check if we're at the animation limit
    if (this.running.size >= this.capabilities.maxAnimations) {
      if (priority === 'low') return; // Skip low priority animations

      // Remove lowest priority animation if high priority
      if (priority === 'high') {
        const oldestId = Array.from(this.running)[0];
        this.remove(oldestId);
      }
    }

    this.running.add(id);

    const wrappedAnimation = () => {
      try {
        animation();
      } finally {
        this.running.delete(id);
      }
    };

    requestAnimationFrame(wrappedAnimation);
  }

  remove(id: string) {
    this.running.delete(id);
  }

  clear() {
    this.running.clear();
  }

  getRunningCount(): number {
    return this.running.size;
  }
}

export const animationQueue = new AnimationQueue();

// Reduced motion utilities
export const useAdvancedReducedMotion = () => {
  const prefersReducedMotion = useReducedMotion();

  return {
    shouldReduceMotion: prefersReducedMotion,
    shouldDisableParallax: prefersReducedMotion,
    shouldDisableAutoplay: prefersReducedMotion,
    shouldReduceAnimations: prefersReducedMotion || detectDeviceCapabilities().isLowEndDevice,
    maxAnimationDuration: prefersReducedMotion ? 0.2 : 1.0,
  };
};

// Performance-optimized animation props
export const withPerformanceOptimization = (
  props: MotionProps,
  id?: string,
  priority: 'low' | 'medium' | 'high' = 'medium'
): MotionProps => {
  const capabilities = detectDeviceCapabilities();
  const { shouldReduceAnimations, maxAnimationDuration } = useAdvancedReducedMotion();

  // Return simplified animations for low-end devices or reduced motion
  if (shouldReduceAnimations) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: Math.min(maxAnimationDuration, 0.3) },
    };
  }

  // Optimize animations based on device capabilities
  const optimizedProps = { ...props };

  if (optimizedProps.transition) {
    // Limit animation duration for low-end devices
    if (capabilities.isLowEndDevice && typeof optimizedProps.transition === 'object') {
      const transition = optimizedProps.transition as any;
      transition.duration = Math.min(
        transition.duration || 0.5,
        0.5
      );
    }

    // Disable complex springs on low-end devices
    if (capabilities.isLowEndDevice && typeof optimizedProps.transition === 'object') {
      if (optimizedProps.transition.type === 'spring') {
        optimizedProps.transition = {
          duration: 0.3,
          ease: 'easeOut',
        };
      }
    }
  }

  // Add performance monitoring if ID provided
  if (id) {
    const originalOnAnimationStart = optimizedProps.onAnimationStart;
    const originalOnAnimationComplete = optimizedProps.onAnimationComplete;

    optimizedProps.onAnimationStart = (definition: any) => {
      animationQueue.add(id, () => {}, priority);
      originalOnAnimationStart?.(definition);
    };

    optimizedProps.onAnimationComplete = (definition: any) => {
      animationQueue.remove(id);
      originalOnAnimationComplete?.(definition);
    };
  }

  return optimizedProps;
};

// Animation budget tracker
class AnimationBudget {
  private budget = 16.67; // 60fps budget in ms
  private used = 0;
  private frameStart = 0;

  startFrame() {
    this.frameStart = performance.now();
    this.used = 0;
  }

  endFrame() {
    const frameTime = performance.now() - this.frameStart;
    this.used = frameTime;
  }

  canAfford(estimatedTime: number): boolean {
    return (this.used + estimatedTime) <= this.budget;
  }

  getRemainingBudget(): number {
    return Math.max(0, this.budget - this.used);
  }

  isOverBudget(): boolean {
    return this.used > this.budget;
  }
}

export const animationBudget = new AnimationBudget();

// Debounced animation utility
export const createDebouncedAnimation = (
  animationFn: () => void,
  delay: number = 16
) => {
  let timeoutId: NodeJS.Timeout;

  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(animationFn, delay);
  };
};

// Throttled animation utility
export const createThrottledAnimation = (
  animationFn: () => void,
  limit: number = 16
) => {
  let inThrottle: boolean;

  return () => {
    if (!inThrottle) {
      animationFn();
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Intersection Observer for viewport-based optimizations
export const createViewportObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Animation preloader for better performance
export const preloadAnimations = async (animationUrls: string[]) => {
  const promises = animationUrls.map(url => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'fetch';
      link.href = url;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  });

  try {
    await Promise.all(promises);
    console.log('Animations preloaded successfully');
  } catch (error) {
    console.warn('Failed to preload some animations:', error);
  }
};

// CSS Animation utilities
export const cssAnimationUtils = {
  // Create optimized CSS transforms
  createTransform: (transforms: Record<string, string | number>) => {
    return Object.entries(transforms)
      .map(([key, value]) => `${key}(${value})`)
      .join(' ');
  },

  // Create optimized CSS transitions
  createTransition: (properties: string[], duration: number, easing = 'ease-out') => {
    return properties
      .map(property => `${property} ${duration}s ${easing}`)
      .join(', ');
  },

  // Force GPU acceleration
  forceGPU: {
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden' as const,
    perspective: '1000px',
  },

  // Optimized will-change property
  optimizeWillChange: (properties: string[]) => {
    const optimized = [...new Set(properties)]; // Remove duplicates
    return optimized.length > 4 ? 'auto' : optimized.join(', ');
  },
};

// Performance profiler for animations
export class AnimationProfiler {
  private profiles: Map<string, number[]> = new Map();

  start(name: string) {
    if (!this.profiles.has(name)) {
      this.profiles.set(name, []);
    }
    this.profiles.get(name)!.push(performance.now());
  }

  end(name: string) {
    const times = this.profiles.get(name);
    if (!times || times.length === 0) return;

    const startTime = times[times.length - 1];
    const duration = performance.now() - startTime;

    console.log(`Animation "${name}" took ${duration.toFixed(2)}ms`);

    if (duration > 16.67) {
      console.warn(`Animation "${name}" exceeded 60fps budget (${duration.toFixed(2)}ms > 16.67ms)`);
    }
  }

  getProfile(name: string) {
    return this.profiles.get(name) || [];
  }

  clear(name?: string) {
    if (name) {
      this.profiles.delete(name);
    } else {
      this.profiles.clear();
    }
  }
}

export const animationProfiler = new AnimationProfiler();

// Export all utilities
export default {
  performanceMonitor,
  detectDeviceCapabilities,
  animationQueue,
  useAdvancedReducedMotion,
  withPerformanceOptimization,
  animationBudget,
  createDebouncedAnimation,
  createThrottledAnimation,
  createViewportObserver,
  preloadAnimations,
  cssAnimationUtils,
  animationProfiler,
};