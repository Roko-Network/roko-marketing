import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  AdaptiveDpr,
  AdaptiveEvents,
  Html,
  useProgress
} from '@react-three/drei';
// Note: PostProcessing effects disabled due to dependency constraints
// import {
//   EffectComposer,
//   Bloom,
//   ChromaticAberration,
//   Noise,
//   Vignette
// } from '@react-three/postprocessing';
// import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

import { TemporalOrb } from './TemporalOrb';
import { NetworkGlobe } from './NetworkGlobe';
import { TemporalFlowField } from './ParticleField';

interface SceneProps {
  className?: string;
  enableControls?: boolean;
  autoRotate?: boolean;
  showStats?: boolean;
  performanceLevel?: 'high' | 'medium' | 'low';
  fallbackComponent?: React.ComponentType;
}

// Loading component
const SceneLoader: React.FC = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-white">
        <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-[#00d4aa] to-[#BAC0CC] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm font-medium">Loading Temporal Field...</div>
      </div>
    </Html>
  );
};

// Cyberpunk lighting setup
const SceneLighting: React.FC<{ performanceLevel: 'high' | 'medium' | 'low' }> = ({
  performanceLevel
}) => {
  const lightIntensity = performanceLevel === 'low' ? 0.5 : 1;

  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.2 * lightIntensity} color="#BAC0CC" />

      {/* Key light - ROKO green accent */}
      <directionalLight
        intensity={0.8 * lightIntensity}
        color="#00d4aa"
        position={[10, 10, 5]}
        castShadow={performanceLevel === 'high'}
        shadow-mapSize-width={performanceLevel === 'high' ? 2048 : 1024}
        shadow-mapSize-height={performanceLevel === 'high' ? 2048 : 1024}
      />

      {/* Fill light - softer contrast */}
      <directionalLight
        intensity={0.3 * lightIntensity}
        color="#BAC0CC"
        position={[-5, 5, -5]}
      />

      {/* Rim light for dramatic effect */}
      <pointLight
        intensity={0.5 * lightIntensity}
        color="#00d4aa"
        position={[0, 0, -10]}
        distance={20}
        decay={2}
      />

      {/* Atmospheric spot light */}
      <spotLight
        intensity={0.4 * lightIntensity}
        color="#BCC1D1"
        position={[0, 15, 0]}
        angle={Math.PI / 6}
        penumbra={0.5}
        castShadow={performanceLevel === 'high'}
      />
    </>
  );
};

// Main scene content
const SceneContent: React.FC<{
  performanceLevel: 'high' | 'medium' | 'low';
  autoRotate: boolean;
}> = ({ performanceLevel, autoRotate }) => {
  const [hoveredOrb, setHoveredOrb] = useState(false);

  return (
    <>
      <SceneLighting performanceLevel={performanceLevel} />

      {/* Background particle field */}
      <TemporalFlowField
        count={performanceLevel === 'high' ? 2000 : performanceLevel === 'medium' ? 1000 : 500}
        spread={60}
        speed={0.3}
        opacity={0.4}
        performanceLevel={performanceLevel}
      />

      {/* Main temporal orb */}
      <group
        onPointerEnter={() => setHoveredOrb(true)}
        onPointerLeave={() => setHoveredOrb(false)}
      >
        <TemporalOrb
          position={[0, 0, 0]}
          scale={1}
          isHovered={hoveredOrb}
          performanceLevel={performanceLevel}
        />
      </group>

      {/* Network globe positioned to the side */}
      <NetworkGlobe
        position={[8, 2, -3]}
        scale={0.8}
        autoRotate={autoRotate}
        rotationSpeed={0.3}
        performanceLevel={performanceLevel}
      />

      {/* Additional atmospheric elements */}
      {performanceLevel !== 'low' && (
        <>
          {/* Floating energy rings */}
          <group position={[0, 0, 0]}>
            {[...Array(3)].map((_, i) => (
              <mesh
                key={i}
                rotation={[Math.PI / 2, 0, i * (Math.PI / 3)]}
                position={[0, 0, 0]}
              >
                <torusGeometry args={[3 + i * 0.5, 0.05, 8, 32]} />
                <meshBasicMaterial
                  color="#00d4aa"
                  transparent
                  opacity={0.1 - i * 0.02}
                  wireframe
                />
              </mesh>
            ))}
          </group>
        </>
      )}

      {/* HDR environment for reflections */}
      {performanceLevel === 'high' && (
        <Environment
          background={false}
          files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr"
        />
      )}
    </>
  );
};

// Post-processing effects (disabled due to dependency constraints)
// TODO: Add back when @react-three/postprocessing is compatible
const PostProcessing: React.FC<{ performanceLevel: 'high' | 'medium' | 'low' }> = () => {
  return null; // Disabled for now
};

import { detectWebGLCapabilities } from '../../utils/performance';

// Fallback component for unsupported devices
const SceneFallback: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
    <div className="text-center p-8">
      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#00d4aa] to-[#BAC0CC] animate-pulse" />
      <h3 className="text-xl font-bold text-white mb-4">ROKO Temporal Network</h3>
      <p className="text-gray-400 max-w-md">
        Your device doesn't support WebGL. The ROKO Network operates with nanosecond precision
        across global validator nodes, enabling instant and secure blockchain transactions.
      </p>
    </div>
  </div>
);

export const Scene: React.FC<SceneProps> = ({
  className = '',
  enableControls = true,
  autoRotate = true,
  showStats = false,
  performanceLevel,
  fallbackComponent: FallbackComponent = SceneFallback
}) => {
  const [detectedPerformance, setDetectedPerformance] = useState<'high' | 'medium' | 'low'>('medium');
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    const capabilities = detectWebGLCapabilities();
    if (capabilities === 'none') {
      setWebGLSupported(false);
    } else {
      setDetectedPerformance(capabilities);
    }
  }, []);

  const finalPerformanceLevel = performanceLevel || detectedPerformance;

  if (!webGLSupported) {
    return <FallbackComponent />;
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        gl={{
          antialias: finalPerformanceLevel !== 'low',
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        dpr={finalPerformanceLevel === 'high' ? [1, 2] : 1}
        camera={{ position: [0, 0, 12], fov: 45 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        {/* Adaptive performance optimization */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        {/* Camera setup */}
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />

        {/* Controls */}
        {enableControls && (
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            minDistance={8}
            maxDistance={20}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
          />
        )}

        {/* Scene content with loading */}
        <Suspense fallback={<SceneLoader />}>
          <SceneContent
            performanceLevel={finalPerformanceLevel}
            autoRotate={autoRotate}
          />
        </Suspense>

        {/* Post-processing effects */}
        <PostProcessing performanceLevel={finalPerformanceLevel} />

        {/* Stats overlay for development */}
        {showStats && process.env['NODE_ENV'] === 'development' && (
          <Html position={[-8, 6, 0]}>
            <div className="text-white text-xs bg-black/50 p-2 rounded">
              Performance: {finalPerformanceLevel}
            </div>
          </Html>
        )}
      </Canvas>
    </div>
  );
};

export default Scene;