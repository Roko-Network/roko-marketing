import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  size?: number;
  spread?: number;
  speed?: number;
  opacity?: number;
  performanceLevel?: 'high' | 'medium' | 'low';
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 2000,
  size = 0.01,
  spread = 50,
  speed = 0.5,
  opacity = 0.6,
  performanceLevel = 'high'
}) => {
  const particlesRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  // Performance-based configuration
  const config = useMemo(() => {
    let actualCount = count;
    let actualSize = size;

    switch (performanceLevel) {
      case 'low':
        actualCount = Math.min(count, 500);
        actualSize = size * 1.5; // Larger particles for lower count
        break;
      case 'medium':
        actualCount = Math.min(count, 1000);
        actualSize = size * 1.2;
        break;
    }

    return { count: actualCount, size: actualSize };
  }, [count, size, performanceLevel]);

  // Generate particle system
  const { positions, colors, velocities, phases } = useMemo(() => {
    const positions = new Float32Array(config.count * 3);
    const colors = new Float32Array(config.count * 3);
    const velocities = new Float32Array(config.count * 3);
    const phases = new Float32Array(config.count);

    // Brand colors for particles
    const brandColors = [
      new THREE.Color('#00d4aa'), // Primary ROKO green
      new THREE.Color('#BAC0CC'), // Secondary light
      new THREE.Color('#BCC1D1'), // Tertiary
      new THREE.Color('#181818')  // Dark base
    ];

    for (let i = 0; i < config.count; i++) {
      const i3 = i * 3;

      // Random position within spread
      positions[i3] = (Math.random() - 0.5) * spread;
      positions[i3 + 1] = (Math.random() - 0.5) * spread;
      positions[i3 + 2] = (Math.random() - 0.5) * spread;

      // Temporal flow velocities - creating streams and eddies
      const flowPattern = Math.sin((positions[i3] || 0) * 0.1) * Math.cos((positions[i3 + 2] || 0) * 0.1);
      velocities[i3] = (Math.random() - 0.5) * 0.02 + flowPattern * 0.01;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02 + flowPattern * 0.01;

      // Color assignment with weighted distribution
      let colorIndex;
      const rand = Math.random();
      if (rand < 0.4) {
        colorIndex = 0; // More green particles
      } else if (rand < 0.7) {
        colorIndex = 1; // Light particles
      } else if (rand < 0.9) {
        colorIndex = 2; // Tertiary
      } else {
        colorIndex = 3; // Dark particles
      }

      const color = brandColors[colorIndex];
      if (color) {
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }

      // Phase for wave animations
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, colors, velocities, phases };
  }, [config.count, spread]);

  // Particle material with additive blending
  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: config.size,
      vertexColors: true,
      transparent: true,
      opacity: opacity,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      alphaTest: 0.001
    });
  }, [config.size, opacity]);

  // Animation loop for temporal flow effects
  useFrame((state, delta) => {
    if (!particlesRef.current || !geometryRef.current) return;

    const time = state.clock.elapsedTime;
    const positionAttribute = geometryRef.current.attributes['position'];
    if (!positionAttribute) return;
    const positions = positionAttribute.array as Float32Array;

    for (let i = 0; i < config.count; i++) {
      const i3 = i * 3;

      // Apply velocities with temporal wave modulation
      const phase = phases?.[i] ?? 0;
      const waveOffset = Math.sin(time * 2 + phase) * 0.005;

      if (velocities[i3] !== undefined && positions[i3] !== undefined) positions[i3] += velocities[i3] * speed * delta * 60 + waveOffset;
      if (velocities[i3 + 1] !== undefined && positions[i3 + 1] !== undefined) positions[i3 + 1] += velocities[i3 + 1] * speed * delta * 60;
      if (velocities[i3 + 2] !== undefined && positions[i3 + 2] !== undefined) positions[i3 + 2] += velocities[i3 + 2] * speed * delta * 60 + waveOffset;

      // Boundary wrapping for infinite effect
      const halfSpread = spread / 2;

      if (positions[i3] !== undefined) {
        if (positions[i3] > halfSpread) positions[i3] = -halfSpread;
        if (positions[i3] < -halfSpread) positions[i3] = halfSpread;
      }

      if (positions[i3 + 1] !== undefined) {
        if (positions[i3 + 1] !== undefined && positions[i3 + 1] > halfSpread) positions[i3 + 1] = -halfSpread;
        if (positions[i3 + 1] !== undefined && positions[i3 + 1] < -halfSpread) positions[i3 + 1] = halfSpread;
      }

      if (positions[i3 + 2] !== undefined) {
        if (positions[i3 + 2] !== undefined && positions[i3 + 2] > halfSpread) positions[i3 + 2] = -halfSpread;
        if (positions[i3 + 2] !== undefined && positions[i3 + 2] < -halfSpread) positions[i3 + 2] = halfSpread;
      }
    }

    const positionAttr = geometryRef.current.attributes['position'];
    if (positionAttr) {
      positionAttr.needsUpdate = true;
    }

    // Subtle rotation for overall field movement
    particlesRef.current.rotation.y += delta * 0.05;
  });

  return (
    <points ref={particlesRef} material={material}>
      <bufferGeometry
        ref={geometryRef}
        attributes={{
          position: new THREE.BufferAttribute(positions, 3),
          color: new THREE.BufferAttribute(colors, 3)
        }}
      />
    </points>
  );
};

// Specialized temporal flow component for hero section
export const TemporalFlowField: React.FC<ParticleFieldProps> = (props) => {
  return (
    <group>
      {/* Primary flow layer */}
      <ParticleField
        {...props}
        count={props.count || 1500}
        size={0.008}
        speed={0.3}
        opacity={0.8}
      />

      {/* Secondary drift layer */}
      <ParticleField
        {...props}
        count={props.count ? props.count * 0.3 : 500}
        size={0.012}
        speed={0.1}
        opacity={0.4}
        spread={(props.spread || 50) * 1.5}
      />

      {/* Accent sparkle layer */}
      <ParticleField
        {...props}
        count={props.count ? props.count * 0.1 : 200}
        size={0.02}
        speed={0.05}
        opacity={0.6}
        spread={(props.spread || 50) * 0.8}
      />
    </group>
  );
};

export default ParticleField;