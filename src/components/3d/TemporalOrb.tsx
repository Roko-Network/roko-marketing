import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

interface TemporalOrbProps {
  position?: [number, number, number];
  scale?: number;
  isHovered?: boolean;
  performanceLevel?: 'high' | 'medium' | 'low';
}

export const TemporalOrb: React.FC<TemporalOrbProps> = ({
  position = [0, 0, 0],
  scale = 1,
  isHovered = false,
  performanceLevel = 'high'
}) => {
  const orbRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const particleSystemRef = useRef<THREE.BufferGeometry>(null);

  // Performance-based configuration
  const config = useMemo(() => {
    switch (performanceLevel) {
      case 'low':
        return {
          orbDetail: 1,
          particleCount: 1000,
          animationSpeed: 0.5
        };
      case 'medium':
        return {
          orbDetail: 2,
          particleCount: 3000,
          animationSpeed: 0.75
        };
      default:
        return {
          orbDetail: 3,
          particleCount: 5000,
          animationSpeed: 1
        };
    }
  }, [performanceLevel]);

  // Particle system setup
  const { positions, colors, velocities } = useMemo(() => {
    const positions = new Float32Array(config.particleCount * 3);
    const colors = new Float32Array(config.particleCount * 3);
    const velocities = new Float32Array(config.particleCount * 3);

    const brandColors = [
      new THREE.Color('#00d4aa'), // Primary ROKO green
      new THREE.Color('#BAC0CC'), // Secondary light
      new THREE.Color('#181818')  // Dark base
    ];

    for (let i = 0; i < config.particleCount; i++) {
      const i3 = i * 3;

      // Spherical distribution around orb
      const radius = 2.5 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Random velocities for orbital motion
      velocities[i3] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

      // Color variation
      const colorIndex = Math.floor(Math.random() * brandColors.length);
      const color = brandColors[colorIndex];
      if (color) {
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }
    }

    return { positions, colors, velocities };
  }, [config.particleCount]);

  // Orb material with emission and metallic properties
  const orbMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#181818',
      metalness: 0.8,
      roughness: 0.2,
      transmission: 0.8,
      thickness: 0.5,
      ior: 1.5,
      emissive: '#00d4aa',
      emissiveIntensity: 0.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
  }, []);

  // Particle material
  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
  }, []);

  // Spring animation for hover effects
  const { orbScale } = useSpring({
    orbScale: isHovered ? scale * 1.1 : scale,
    emissiveIntensity: isHovered ? 0.6 : 0.3,
    config: { tension: 300, friction: 30 }
  });

  // Animation loop
  useFrame((state, delta) => {
    if (!orbRef.current || !particlesRef.current || !particleSystemRef.current) return;

    const adjustedDelta = delta * config.animationSpeed;

    // Rotate orb
    orbRef.current.rotation.x += 0.001 * adjustedDelta * 60;
    orbRef.current.rotation.y += 0.002 * adjustedDelta * 60;

    // Pulsate emission
    const time = state.clock.elapsedTime;
    const pulsation = 0.3 + 0.2 * Math.sin(time * 2);
    orbMaterial.emissiveIntensity = pulsation * (isHovered ? 2 : 1);

    // Animate particles
    const positionAttribute = particleSystemRef.current.attributes['position'];
    if (!positionAttribute) return;
    const positions = positionAttribute.array as Float32Array;
    const velocities = particlesRef.current.userData?.['velocities'] as Float32Array;
    if (!velocities) return;

    for (let i = 0; i < config.particleCount; i++) {
      const i3 = i * 3;

      // Orbital motion around orb
      const x = positions[i3] || 0;
      const y = positions[i3 + 1] || 0;
      const z = positions[i3 + 2] || 0;

      // Calculate orbital velocity
      const distance = Math.sqrt(x * x + y * y + z * z);
      const orbitalSpeed = 0.001 / distance;

      // Apply orbital motion
      positions[i3] += velocities[i3] + (-y * orbitalSpeed * adjustedDelta * 60);
      positions[i3 + 1] += velocities[i3 + 1] + (x * orbitalSpeed * adjustedDelta * 60);
      positions[i3 + 2] += velocities[i3 + 2];

      // Boundary check - respawn particles that drift too far
      if (distance > 8) {
        const radius = 2.5 + Math.random() * 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
      }
    }

    const positionAttr = particleSystemRef.current.attributes['position'];
    if (positionAttr) {
      positionAttr.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      {/* Main temporal orb */}
      <animated.mesh
        ref={orbRef}
        scale={orbScale}
        material={orbMaterial}
      >
        <icosahedronGeometry args={[2, config.orbDetail]} />
      </animated.mesh>

      {/* Particle system */}
      <points
        ref={particlesRef}
        material={particleMaterial}
        userData={{ velocities }}
      >
        <bufferGeometry
          ref={particleSystemRef}
          attributes={{
            position: new THREE.BufferAttribute(positions, 3),
            color: new THREE.BufferAttribute(colors, 3)
          }}
        />
      </points>

      {/* Inner glow effect */}
      <mesh scale={scale * 0.8}>
        <icosahedronGeometry args={[2, 1]} />
        <meshBasicMaterial
          color="#00d4aa"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer energy field */}
      <mesh scale={scale * 1.3}>
        <icosahedronGeometry args={[2, 0]} />
        <meshBasicMaterial
          color="#00d4aa"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          wireframe
        />
      </mesh>
    </group>
  );
};

export default TemporalOrb;