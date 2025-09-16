/**
 * Demo integration example for ROKO Network 3D components
 * This file shows how to integrate the 3D visualizations into your React application
 */

import React from 'react';
import { HeroScene, Scene, TemporalOrb, NetworkGlobe, TemporalFlowField } from './index';

// Example 1: Simple Hero Section Integration
export const SimpleHeroDemo = () => (
  <div className="h-screen bg-black relative overflow-hidden">
    <HeroScene
      className="absolute inset-0"
      enableInteraction={true}
      showPerformanceIndicator={false}
    />

    {/* Overlay content */}
    <div className="relative z-10 flex items-center justify-center h-full">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-[#00d4aa] bg-clip-text text-transparent">
          ROKO Network
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Temporal blockchain infrastructure with nanosecond precision
        </p>
      </div>
    </div>
  </div>
);

// Example 2: Custom Scene with Individual Components
export const CustomSceneDemo = () => {
  const [performanceLevel, setPerformanceLevel] = React.useState<'high' | 'medium' | 'low'>('high');

  return (
    <div className="h-screen bg-black">
      {/* Performance Controls */}
      <div className="absolute top-4 left-4 z-10 space-x-2">
        {['low', 'medium', 'high'].map((level) => (
          <button
            key={level}
            onClick={() => setPerformanceLevel(level as any)}
            className={`px-3 py-1 text-xs rounded ${
              performanceLevel === level
                ? 'bg-[#00d4aa] text-black'
                : 'bg-gray-700 text-white'
            }`}
          >
            {level.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Custom 3D Scene */}
      <Scene
        className="w-full h-full"
        performanceLevel={performanceLevel}
        enableControls={true}
        autoRotate={true}
      >
        {/* Background particles */}
        <TemporalFlowField
          performanceLevel={performanceLevel}
          count={performanceLevel === 'high' ? 2000 : 1000}
        />

        {/* Main temporal orb */}
        <TemporalOrb
          position={[0, 0, 0]}
          scale={1}
          performanceLevel={performanceLevel}
        />

        {/* Network globe */}
        <NetworkGlobe
          position={[6, 1, -2]}
          scale={0.6}
          autoRotate={true}
          performanceLevel={performanceLevel}
        />
      </Scene>
    </div>
  );
};

// Example 3: Responsive Integration with Breakpoints
export const ResponsiveHeroDemo = () => (
  <div className="h-screen bg-black">
    {/* Desktop/Tablet: Full 3D experience */}
    <div className="hidden md:block w-full h-full">
      <HeroScene
        enableInteraction={true}
        showPerformanceIndicator={false}
      />
    </div>

    {/* Mobile: Simplified fallback */}
    <div className="md:hidden w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="text-center p-8">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#00d4aa] to-[#BAC0CC] animate-pulse" />
        <h1 className="text-3xl font-bold text-white mb-4">ROKO Network</h1>
        <p className="text-gray-400">Temporal blockchain with nanosecond precision</p>
      </div>
    </div>
  </div>
);

// Example 4: Performance Monitoring Demo
export const PerformanceMonitorDemo = () => {
  const [stats, setStats] = React.useState({
    fps: 60,
    level: 'high' as const,
    memory: 0
  });

  React.useEffect(() => {
    // Simulate performance monitoring
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        fps: 50 + Math.random() * 20,
        memory: 40 + Math.random() * 20
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-black relative">
      <HeroScene
        showPerformanceIndicator={true}
        enableInteraction={true}
      />

      {/* Performance Dashboard */}
      <div className="absolute bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg font-mono text-sm">
        <div>FPS: {stats.fps.toFixed(1)}</div>
        <div>Level: {stats.level}</div>
        <div>Memory: {stats.memory.toFixed(1)}MB</div>
      </div>
    </div>
  );
};

// Example 5: Accessibility-First Implementation
export const AccessibleHeroDemo = () => {
  const [motionEnabled, setMotionEnabled] = React.useState(true);

  React.useEffect(() => {
    // Respect user's motion preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionEnabled(!mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMotionEnabled(!e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div className="h-screen bg-black relative">
      {motionEnabled ? (
        <HeroScene enableInteraction={true} />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
          <div className="text-center p-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-[#00d4aa] opacity-80" />
            <h1 className="text-4xl font-bold text-white mb-4">ROKO Network</h1>
            <p className="text-gray-400 max-w-lg">
              Experience nanosecond-precision blockchain technology with reduced motion interface.
            </p>
          </div>
        </div>
      )}

      {/* Motion toggle control */}
      <button
        onClick={() => setMotionEnabled(!motionEnabled)}
        className="absolute top-4 right-4 bg-[#00d4aa] text-black px-4 py-2 rounded-lg hover:bg-[#00b896] transition-colors"
        aria-label={motionEnabled ? 'Disable animations' : 'Enable animations'}
      >
        {motionEnabled ? 'Reduce Motion' : 'Enable Motion'}
      </button>
    </div>
  );
};

export default {
  SimpleHeroDemo,
  CustomSceneDemo,
  ResponsiveHeroDemo,
  PerformanceMonitorDemo,
  AccessibleHeroDemo
};