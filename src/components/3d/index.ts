/**
 * 3D Components for ROKO Network Marketing Site
 *
 * Temporal blockchain visualization components using Three.js and React Three Fiber
 * Optimized for performance across devices with adaptive quality settings
 */

export { TemporalOrb } from './TemporalOrb';
export { NetworkGlobe } from './NetworkGlobe';
export { ParticleField, TemporalFlowField } from './ParticleField';
export { Scene } from './Scene';
export { AccessibilityFallback } from './AccessibilityFallback';
export { HeroScene } from './HeroScene';

// Re-export performance utilities for convenience
export {
  detectWebGLCapabilities,
  getPerformanceConfig,
  PerformanceMonitor,
  AdaptiveQualityManager,
  getDeviceCapabilities,
  estimateMemoryUsage
} from '../../utils/performance';

export type {
  PerformanceLevel,
  PerformanceConfig
} from '../../utils/performance';