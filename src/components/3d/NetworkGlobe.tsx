import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface ValidatorNode {
  id: string;
  position: THREE.Vector3;
  country: string;
  city: string;
  status: 'active' | 'pending' | 'offline';
  connections: string[];
  performance: number; // 0-1
}

interface NetworkGlobeProps {
  position?: [number, number, number];
  scale?: number;
  autoRotate?: boolean;
  rotationSpeed?: number;
  showTooltips?: boolean;
  performanceLevel?: 'high' | 'medium' | 'low';
}

export const NetworkGlobe: React.FC<NetworkGlobeProps> = ({
  position = [0, 0, 0],
  scale = 1,
  autoRotate = true,
  rotationSpeed = 0.5,
  showTooltips = true,
  performanceLevel = 'high'
}) => {
  const globeRef = useRef<THREE.Mesh>(null);
  const nodesGroupRef = useRef<THREE.Group>(null);
  const arcsGroupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Performance configuration
  const config = useMemo(() => {
    switch (performanceLevel) {
      case 'low':
        return {
          globeSegments: 32,
          nodeCount: 50,
          maxConnections: 3,
          arcSegments: 16
        };
      case 'medium':
        return {
          globeSegments: 48,
          nodeCount: 100,
          maxConnections: 5,
          arcSegments: 24
        };
      default:
        return {
          globeSegments: 64,
          nodeCount: 200,
          maxConnections: 8,
          arcSegments: 32
        };
    }
  }, [performanceLevel]);

  // Generate validator nodes with geographic distribution
  const validatorNodes = useMemo(() => {
    const nodes: ValidatorNode[] = [];
    const cities = [
      { name: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060 },
      { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278 },
      { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
      { name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198 },
      { name: 'Frankfurt', country: 'Germany', lat: 50.1109, lon: 8.6821 },
      { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
      { name: 'São Paulo', country: 'Brazil', lat: -23.5505, lon: -46.6333 },
      { name: 'Mumbai', country: 'India', lat: 19.0760, lon: 72.8777 },
      { name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708 },
      { name: 'Toronto', country: 'Canada', lat: 43.6532, lon: -79.3832 }
    ];

    for (let i = 0; i < config.nodeCount; i++) {
      const city = cities[i % cities.length];

      // Add some randomization to coordinates for multiple nodes per city
      const latOffset = (Math.random() - 0.5) * 10;
      const lonOffset = (Math.random() - 0.5) * 10;
      const lat = (city.lat + latOffset) * (Math.PI / 180);
      const lon = (city.lon + lonOffset) * (Math.PI / 180);

      // Convert lat/lon to 3D position on sphere
      const radius = 1.02; // Slightly above globe surface
      const x = radius * Math.cos(lat) * Math.cos(lon);
      const y = radius * Math.sin(lat);
      const z = radius * Math.cos(lat) * Math.sin(lon);

      const status = Math.random() > 0.1 ? 'active' : Math.random() > 0.5 ? 'pending' : 'offline';

      nodes.push({
        id: `node-${i}`,
        position: new THREE.Vector3(x, y, z),
        country: city.country,
        city: city.name,
        status,
        connections: [],
        performance: Math.random()
      });
    }

    // Generate connections between nodes
    nodes.forEach(node => {
      const connectionCount = Math.floor(Math.random() * config.maxConnections) + 1;
      const availableNodes = nodes.filter(n => n.id !== node.id && !node.connections.includes(n.id));

      for (let i = 0; i < Math.min(connectionCount, availableNodes.length); i++) {
        const randomIndex = Math.floor(Math.random() * availableNodes.length);
        const targetNode = availableNodes[randomIndex];

        if (!node.connections.includes(targetNode.id)) {
          node.connections.push(targetNode.id);
          // Make connections bidirectional
          if (!targetNode.connections.includes(node.id)) {
            targetNode.connections.push(node.id);
          }
        }

        availableNodes.splice(randomIndex, 1);
      }
    });

    return nodes;
  }, [config.nodeCount, config.maxConnections]);

  // Globe material with earth-like appearance
  const globeMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: '#181818',
      transparent: true,
      opacity: 0.8,
      emissive: '#001122',
      emissiveIntensity: 0.1,
      shininess: 100
    });
  }, []);

  // Node materials based on status
  const nodeMaterials = useMemo(() => ({
    active: new THREE.MeshBasicMaterial({
      color: '#00d4aa',
      transparent: true,
      opacity: 0.9
    }),
    pending: new THREE.MeshBasicMaterial({
      color: '#BCC1D1',
      transparent: true,
      opacity: 0.7
    }),
    offline: new THREE.MeshBasicMaterial({
      color: '#666666',
      transparent: true,
      opacity: 0.5
    })
  }), []);

  // Create connection arcs geometry
  const connectionArcs = useMemo(() => {
    const arcs: { geometry: THREE.BufferGeometry; material: THREE.Material }[] = [];

    validatorNodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const targetNode = validatorNodes.find(n => n.id === connectionId);
        if (!targetNode) return;

        // Create arc between nodes
        const start = node.position;
        const end = targetNode.position;

        // Calculate arc height and control point
        const distance = start.distanceTo(end);
        const arcHeight = Math.min(distance * 0.5, 0.3);

        const midPoint = new THREE.Vector3()
          .addVectors(start, end)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(1 + arcHeight);

        // Create quadratic bezier curve
        const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
        const points = curve.getPoints(config.arcSegments);

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: node.status === 'active' ? '#00d4aa' : '#BAC0CC',
          transparent: true,
          opacity: 0.6,
          linewidth: 2
        });

        arcs.push({ geometry, material });
      });
    });

    return arcs;
  }, [validatorNodes, config.arcSegments]);

  // Animation spring for hover effects
  const { globeScale } = useSpring({
    globeScale: hoveredNode ? scale * 1.05 : scale,
    config: { tension: 300, friction: 30 }
  });

  // Animation loop
  useFrame((state, delta) => {
    if (!globeRef.current) return;

    // Auto-rotate globe
    if (autoRotate) {
      globeRef.current.rotation.y += delta * rotationSpeed * 0.1;
    }

    // Animate node pulsing
    if (nodesGroupRef.current) {
      nodesGroupRef.current.children.forEach((nodeChild, index) => {
        const node = validatorNodes[index];
        if (node?.status === 'active') {
          const mesh = nodeChild as THREE.Mesh;
          const time = state.clock.elapsedTime;
          const pulseFactor = 1 + 0.3 * Math.sin(time * 3 + index * 0.5);
          mesh.scale.setScalar(pulseFactor * 0.02);
        }
      });
    }

    // Animate connection arcs
    if (arcsGroupRef.current) {
      arcsGroupRef.current.children.forEach((arcChild, index) => {
        const line = arcChild as THREE.Line;
        const time = state.clock.elapsedTime;
        const flowSpeed = 2;

        // Create flowing effect by modulating opacity
        const material = line.material as THREE.LineBasicMaterial;
        material.opacity = 0.3 + 0.3 * Math.sin(time * flowSpeed + index * 0.8);
      });
    }
  });

  return (
    <group position={position}>
      {/* Main globe */}
      <animated.mesh
        ref={globeRef}
        scale={globeScale}
        material={globeMaterial}
      >
        <sphereGeometry args={[1, config.globeSegments, config.globeSegments]} />
      </animated.mesh>

      {/* Validator nodes */}
      <group ref={nodesGroupRef} scale={scale}>
        {validatorNodes.map((node) => (
          <mesh
            key={node.id}
            position={[node.position.x, node.position.y, node.position.z]}
            material={nodeMaterials[node.status]}
            onPointerEnter={() => setHoveredNode(node.id)}
            onPointerLeave={() => setHoveredNode(null)}
          >
            <sphereGeometry args={[0.02, 8, 8]} />

            {/* Tooltip on hover */}
            {showTooltips && hoveredNode === node.id && (
              <Html distanceFactor={10}>
                <div className="bg-black/80 text-white p-2 rounded text-xs pointer-events-none">
                  <div className="font-semibold">{node.city}, {node.country}</div>
                  <div>Status: {node.status}</div>
                  <div>Performance: {(node.performance * 100).toFixed(1)}%</div>
                  <div>Connections: {node.connections.length}</div>
                </div>
              </Html>
            )}
          </mesh>
        ))}
      </group>

      {/* Connection arcs */}
      <group ref={arcsGroupRef} scale={scale}>
        {connectionArcs.map((arc, index) => (
          <primitive key={index} object={new THREE.Line(arc.geometry, arc.material)} />
        ))}
      </group>

      {/* Globe atmosphere effect */}
      <mesh scale={scale * 1.1}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#00d4aa"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

export default NetworkGlobe;