import React, { useState, useEffect } from 'react';
import { Scene } from './Scene';
import { AccessibilityFallback } from './AccessibilityFallback';
import { detectWebGLCapabilities, getPerformanceConfig } from '../../utils/performance';

interface HeroSceneProps {
  className?: string;
  enableInteraction?: boolean;
  showPerformanceIndicator?: boolean;
}

/**
 * Hero Scene component specifically configured for the marketing page hero section
 * Automatically detects device capabilities and provides appropriate fallbacks
 */
export const HeroScene: React.FC<HeroSceneProps> = ({
  className = '',
  enableInteraction = true,
  showPerformanceIndicator = false
}) => {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('medium');

  useEffect(() => {
    // Detect capabilities on mount
    const capabilities = detectWebGLCapabilities();

    if (capabilities === 'none') {
      setWebglSupported(false);
    } else {
      setWebglSupported(true);
      setPerformanceLevel(capabilities);
    }
  }, []);

  // Show loading state while detecting capabilities
  if (webglSupported === null) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-black ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Initializing Temporal Field...</p>
        </div>
      </div>
    );
  }

  // Render fallback for unsupported devices
  if (!webglSupported) {
    return (
      <AccessibilityFallback
        className={className}
        title="ROKO Temporal Network"
        description="Experience the future of blockchain with nanosecond-precision temporal consensus. Global validator network ensuring instant, secure transactions."
      />
    );
  }

  const config = getPerformanceConfig(performanceLevel);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Main 3D Scene */}
      <Scene
        className="absolute inset-0"
        enableControls={enableInteraction}
        autoRotate={true}
        performanceLevel={performanceLevel}
        fallbackComponent={() => (
          <AccessibilityFallback
            title="ROKO Network"
            description="Temporal blockchain infrastructure with nanosecond precision"
          />
        )}
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Performance indicator for development */}
        {showPerformanceIndicator && process.env['NODE_ENV'] === 'development' && (
          <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded text-xs font-mono">
            <div>Performance: {performanceLevel}</div>
            <div>Particles: {config.particleCount.temporal}</div>
            <div>DPR: {config.devicePixelRatio}</div>
            <div>FPS Target: {config.maxFPS}</div>
          </div>
        )}

        {/* Interactive Hints */}
        {enableInteraction && (
          <div className="absolute bottom-4 right-4 text-white/60 text-sm pointer-events-auto">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#00d4aa] rounded-full animate-pulse" />
              <span>Drag to explore • Scroll to zoom</span>
            </div>
          </div>
        )}

        {/* Accessibility Controls */}
        <div className="absolute top-4 right-4 pointer-events-auto">
          <button
            className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            onClick={() => {
              const canvas = document.querySelector('canvas');
              if (canvas) {
                canvas.style.display = canvas.style.display === 'none' ? 'block' : 'none';
              }
            }}
            aria-label="Toggle 3D animation"
            title="Pause/Resume 3D animation"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Reduced Motion Alternative */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          canvas {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroScene;