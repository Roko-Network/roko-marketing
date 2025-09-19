// src/components/3d/Scene.tsx
import React, { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  // AdaptiveDpr, // removed to keep full native resolution
  AdaptiveEvents,
  Html,
  useProgress
} from '@react-three/drei';
import * as THREE from 'three';

import { TemporalFlowField } from './ParticleField';
import { detectWebGLCapabilities } from '../../utils/performance';

/* =============================================================================
   CONFIG
============================================================================= */
const CONFIG = {
  counts: { min: 2400, max: 6000, densityDiv: 2000 },

  // shapes
  torus: { R: 33, r: 6.6, swirl: 3.3, mousePull: 0.33, pinch: 0.66, pinchGain: 0.33 },
  tunnel: { xSpan: 36, widenBase: 9, widenGain: 23.5, widenPow: 1.58, radiusScale: 0.50 },

  dao: {
    radius: 20.0, thickness: 0.5,
    chords: {
      max: 110,
      spawnPerFrame: 12,
      fadeSec: 0.2,
      // colors will be overridden to gray per-vertex; keep as placeholders
      color: 0x000000,
      opacity: 0.36,
      segments: 33,

      // organic stretch & snap behavior
      snapStretch: 1.75,   // snap when current length > snapStretch * restLen
      minRestLen: 3.0,     // clamp rest so short links don’t instantly snap
      maxRestLen: 22.0,    // clamp very long ones
      springiness: 2.25,   // controls bulge of curve under tension
      snapRecoil: 0.8      // brief brighter flash at snap moment
    }
  },

  docs: { baseScale: 1.9, layers: [1.0, 2.2, 4.4], gridN: [9, 11, 13], zJitter: 0.9, swirl: 0.5 },

  forces: { form: 1.55, damp: 0.58, wiggle: 0.18, phiCouple: 0.12, phiAmp: 0.382, interference: 0.8 },
  waves: [
    { dir: [0.45, 0.00, 0.28], w: 0.70 },
    { dir: [-0.32, -0.26, 0.00], w: 0.53 },
    { dir: [0.00, -0.37, 0.23], w: 0.47 }
  ],

  sparks: {
    enabled: true,
    maxSegments: 160,
    spawnPerFrame: 30,
    maxDepth: 2,
    maxDist: 5.2,
    fadeSec: 0.45,
    color: 0x333333,   // gray
    opacity: 0.34,
    segments: 8
  },

  // particle-to-icosahedron spline links (grayscale)
  linkSplines: {
    enabled: true,
    count: 100,
    segments: 12,
    wiggleAmp: 0.5,
    wiggleFreq: 1.4,
    color: 0x555555,
    opacity: 0.22
  }
};

// “pages” for weights: [header, slider, dao, docs, bottom]
type Weights = [number, number, number, number, number];

const PHI = (1 + Math.sqrt(5)) / 2;
const G = PHI - 1;
function gauss() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

/* =============================================================================
   Types
============================================================================= */
export interface SceneParams {
  fieldOpacity?: number;
  pageIndex?: number;
  pageWeights?: number[];
  autoRotate?: boolean;
}

interface SceneProps {
  className?: string;
  enableControls?: boolean;
  autoRotate?: boolean;
  showStats?: boolean;
  performanceLevel?: 'high' | 'medium' | 'low';
  fallbackComponent?: React.ComponentType;
  children?: React.ReactNode;
  params?: SceneParams;
}

/* =============================================================================
   Loader
============================================================================= */
const SceneLoader: React.FC = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-white">
        <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-[#666] to-[#aaa] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm font-medium text-gray-300">Loading Field…</div>
      </div>
    </Html>
  );
};

/* =============================================================================
   Lighting (neutral/cool whites only)
============================================================================= */
const SceneLighting: React.FC<{ performanceLevel: 'high' | 'medium' | 'low' }> = ({ performanceLevel }) => {
  const k = performanceLevel === 'low' ? 0.75 : 1;
  return (
    <>
      <ambientLight intensity={0.25 * k} color="#cfd4da" />
      <directionalLight intensity={0.7 * k} color="#ffffff" position={[10, 10, 6]} />
      <directionalLight intensity={0.35 * k} color="#cfd4da" position={[-6, 5, -5]} />
      <pointLight intensity={0.25 * k} color="#ffffff" position={[0, 0, -12]} distance={24} decay={2} />
    </>
  );
};

/* =============================================================================
   Circle Points Shader (smoky grayscale discs)
============================================================================= */
const circlePointsMaterial = () => {
  const vertex = `
    attribute float aSize;
    varying float vDepth;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vDepth = -mvPosition.z;
      float size = aSize;
      gl_PointSize = size * (100.0 / vDepth);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
  const fragment = `
    precision mediump float;
    varying float vDepth;
    void main() {
      vec2 c = gl_PointCoord - vec2(0.5);
      float r = length(c);
      float edge = smoothstep(0.5, 0.42, r);     // soft circular edge
      float core = smoothstep(0.28, 0.0, r);     // subtle brighter core
      float depthFog = clamp(1.0 - vDepth * 0.06, 0.2, 1.0);
      float alpha = edge * 0.65 * depthFog;
      if (alpha <= 0.001) discard;
      vec3 smoke = mix(vec3(0.15), vec3(0.85), core * 0.75); // smoky grayscale
      gl_FragColor = vec4(smoke, alpha);
    }
  `;
  return new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
};

/* =============================================================================
   Particles System with Curved Gray Links + Organic Snap Chords
============================================================================= */
const ParticlesSystem: React.FC<{
  performanceLevel: 'high' | 'medium' | 'low';
  weights: Weights;
  orbSampleRadius: number;
  orbDetail: number;
}> = ({ performanceLevel, weights, orbSampleRadius, orbDetail }) => {
  const { size, camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Count heuristic like original (based on viewport area)
  const viewportArea = size.width * size.height;
  const count = useMemo(() => {
    const N = Math.max(CONFIG.counts.min, Math.min(CONFIG.counts.max, Math.floor(viewportArea / CONFIG.counts.densityDiv)));
    if (performanceLevel === 'low') return Math.floor(N * 0.6);
    if (performanceLevel === 'medium') return Math.floor(N * 0.85);
    return N;
  }, [viewportArea, performanceLevel]);

  // Buffers
  const pos = useMemo(() => new Float32Array(count * 3), [count]);
  const vel = useMemo(() => new Float32Array(count * 3), [count]);
  const phase = useMemo(() => new Float32Array(count), [count]);
  const sizeAttr = useMemo(() => new Float32Array(count), [count]);

  const tgtHeader = useMemo(() => new Float32Array(count * 3), [count]);
  const tgtSlider = useMemo(() => new Float32Array(count * 3), [count]);
  const tgtDAO = useMemo(() => new Float32Array(count * 3), [count]);
  const tgtDocs = useMemo(() => new Float32Array(count * 3), [count]);
  const tgtBottom = useMemo(() => new Float32Array(count * 3), [count]);

  // Points
  const pointsGeomRef = useRef<THREE.BufferGeometry>(null);
  const pointsMatRef = useRef<THREE.ShaderMaterial>();
  if (!pointsMatRef.current) pointsMatRef.current = circlePointsMaterial();

  // ---- Curved SPARKS (slider) ----
  const sparks = CONFIG.sparks;
  const MAX_SPARKS = sparks.maxSegments;
  const sparkSegments = sparks.segments;
  const sparkStride = sparkSegments * 3;
  const sparkPos = useMemo(() => new Float32Array(MAX_SPARKS * sparkStride), [MAX_SPARKS, sparkStride]);
  const sparkCol = useMemo(() => new Float32Array(MAX_SPARKS * sparkStride), [MAX_SPARKS, sparkStride]);
  const sparkLife = useMemo(() => new Float32Array(MAX_SPARKS).fill(0), [MAX_SPARKS]);
  const sparkIdxA = useMemo(() => new Uint32Array(MAX_SPARKS).fill(0), [MAX_SPARKS]);
  const sparkIdxB = useMemo(() => new Uint32Array(MAX_SPARKS).fill(0), [MAX_SPARKS]);
  const sparkGeomRef = useRef<THREE.BufferGeometry>(null);
  const sparkMat = useMemo(
    () => new THREE.LineBasicMaterial({
      color: CONFIG.sparks.color,
      transparent: true,
      opacity: CONFIG.sparks.opacity,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    }),
    []
  );

  // ---- Curved DAO CHORDS (organic stretch + snap) ----
  const D = CONFIG.dao.chords;
  const MAX_CHORDS = D.max;
  const chordSegments = D.segments;
  const chordStride = chordSegments * 3;
  const chordPos = useMemo(() => new Float32Array(MAX_CHORDS * chordStride), [MAX_CHORDS, chordStride]);
  const chordCol = useMemo(() => new Float32Array(MAX_CHORDS * chordStride), [MAX_CHORDS, chordStride]);
  const chordLife = useMemo(() => new Float32Array(MAX_CHORDS).fill(0), [MAX_CHORDS]);
  const chordIdxA = useMemo(() => new Uint32Array(MAX_CHORDS).fill(0), [MAX_CHORDS]);
  const chordIdxB = useMemo(() => new Uint32Array(MAX_CHORDS).fill(0), [MAX_CHORDS]);
  const chordRestLen = useMemo(() => new Float32Array(MAX_CHORDS).fill(0), [MAX_CHORDS]); // rest length at spawn
  const chordGeomRef = useRef<THREE.BufferGeometry>(null);
  const chordMat = useMemo(
    () => new THREE.LineBasicMaterial({
      color: 0x888888,
      transparent: true,
      opacity: D.opacity,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    }),
    []
  );

  // ---- PARTICLE -> ICOSAHEDRON VERTEX SPLINES (grayscale) ----
  const linkCfg = CONFIG.linkSplines;
  const LINK_COUNT = linkCfg.count;
  const LINK_SEG = linkCfg.segments;
  const linkStride = LINK_SEG * 3;
  const linkPos = useMemo(() => new Float32Array(LINK_COUNT * linkStride), [LINK_COUNT, linkStride]);
  const linkCol = useMemo(() => new Float32Array(LINK_COUNT * linkStride), [LINK_COUNT, linkStride]);
  const linkLife = useMemo(() => new Float32Array(LINK_COUNT).fill(1), [LINK_COUNT]);
  const linkIdxParticle = useMemo(() => new Uint32Array(LINK_COUNT).fill(0), [LINK_COUNT]);
  const linkIdxVertex = useMemo(() => new Uint32Array(LINK_COUNT).fill(0), [LINK_COUNT]);
  const linkPhase = useMemo(() => new Float32Array(LINK_COUNT).fill(0).map(() => Math.random() * Math.PI * 2), [LINK_COUNT]);
  const linkGeomRef = useRef<THREE.BufferGeometry>(null);
  const linkMat = useMemo(
    () => new THREE.LineBasicMaterial({
      color: linkCfg.color,
      transparent: true,
      opacity: linkCfg.opacity,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    }),
    []
  );

  // Icosahedron vertices to connect to
  const icoVertices = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(orbSampleRadius, Math.max(0, Math.min(3, orbDetail | 0)));
    const posArr = geo.getAttribute('position') as THREE.BufferAttribute;
    const verts: THREE.Vector3[] = [];
    for (let i = 0; i < posArr.count; i++) {
      verts.push(new THREE.Vector3(posArr.getX(i), posArr.getY(i), posArr.getZ(i)));
    }
    geo.dispose();
    return verts;
  }, [orbSampleRadius, orbDetail]);

  // init Gaussian cloud + phases + sizes
  useMemo(() => {
    const sigma = 12;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = gauss() * sigma;
      pos[i * 3 + 1] = gauss() * sigma * 0.95;
      pos[i * 3 + 2] = gauss() * sigma * 0.95;
      phase[i] = Math.random() * Math.PI * 2;
      sizeAttr[i] = 0.1 + Math.random() * 0.7; // (px) noticeably smoky but subtle
    }
  }, [count, pos, phase, sizeAttr]);

  // Fill target shapes
  useMemo(() => {
    // HEADER torus
    {
      const { R, r, pinchGain } = CONFIG.torus;
      for (let i = 0; i < count; i++) {
        const u = (i / count) * Math.PI * 2;
        const v = ((i * G) % 1) * Math.PI * 2;
        const y = r * Math.sin(v);
        const rr = (R - CONFIG.torus.pinch * Math.tanh(Math.abs(y) * pinchGain)) + r * Math.cos(v);
        const x = rr * Math.cos(u), z = rr * Math.sin(u);
        const idx = i * 3;
        tgtHeader[idx] = x; tgtHeader[idx + 1] = y; tgtHeader[idx + 2] = z;
      }
    }
    // SLIDER tunnel
    {
      const X = CONFIG.tunnel.xSpan, rb = CONFIG.tunnel.widenBase, rg = CONFIG.tunnel.widenGain, rp = CONFIG.tunnel.widenPow, k = CONFIG.tunnel.radiusScale;
      for (let i = 0; i < count; i++) {
        const s = (i / (count - 1)) * 2 - 1;
        const u = ((i * G) % 1) * Math.PI * 2;
        const w = rb + rg * Math.pow(Math.abs(s), rp);
        const x = s * X, y = w * k * Math.sin(u), z = w * k * Math.cos(u);
        const idx = i * 3;
        tgtSlider[idx] = x; tgtSlider[idx + 1] = y; tgtSlider[idx + 2] = z;
      }
    }
    // DAO ring
    {
      const R = CONFIG.dao.radius, t = CONFIG.dao.thickness;
      for (let i = 0; i < count; i++) {
        const a = 2 * Math.PI * ((i * G) % 1);
        const x = (R + Math.sin(phase[i]) * t * 0.3) * Math.cos(a);
        const y = (R + Math.cos(phase[i]) * t * 0.3) * Math.sin(a);
        const z = Math.sin(a * 3 + phase[i]) * t * 0.6;
        const idx = i * 3;
        tgtDAO[idx] = x; tgtDAO[idx + 1] = y; tgtDAO[idx + 2] = z;
      }
    }
    // DOCS hex lattice
    function hexToCartesian(u: number, v: number, s: number): [number, number] { return [s * (u + v / 2), s * (Math.sqrt(3) / 2) * v]; }
    {
      const { baseScale, layers, gridN, zJitter } = CONFIG.docs;
      for (let i = 0; i < count; i++) {
        const L = i % layers.length;
        const s = baseScale * layers[L];
        const n = gridN[L];
        const u = ((Math.abs(Math.sin((i + 1) * 1.234)) * n) | 0) - ((n / 2) | 0);
        const v = ((Math.abs(Math.sin((i + 1) * 2.468)) * n) | 0) - ((n / 2) | 0);
        const [x, y] = hexToCartesian(u, v, s);
        const z = (Math.sin(i * 0.13) + Math.cos(i * 0.07)) * 0.5 * zJitter;
        const idx = i * 3;
        tgtDocs[idx] = x; tgtDocs[idx + 1] = y; tgtDocs[idx + 2] = z;
      }
    }
    // BOTTOM cloud
    {
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        tgtBottom[idx] = gauss() * 14.0;
        tgtBottom[idx + 1] = gauss() * 9.0;
        tgtBottom[idx + 2] = gauss() * 9.0;
      }
    }
  }, [count, phase, tgtHeader, tgtSlider, tgtDAO, tgtDocs, tgtBottom]);

  // mouse to world plane
  const mouseWorld = useRef(new THREE.Vector3());
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const W = window.innerWidth, H = window.innerHeight;
      const ndc = new THREE.Vector3((e.clientX / W) * 2 - 1, -(e.clientY / H) * 2 + 1, 0.5).unproject(camera);
      const dir = ndc.sub((camera as THREE.PerspectiveCamera).position).normalize();
      const t = -((camera as THREE.PerspectiveCamera).position.z) / dir.z;
      mouseWorld.current.copy((camera as THREE.PerspectiveCamera).position.clone().add(dir.multiplyScalar(t)));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [camera]);

  // build points geometry attributes once
  useEffect(() => {
    if (!pointsGeomRef.current) return;
    pointsGeomRef.current.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pointsGeomRef.current.setAttribute('aSize', new THREE.BufferAttribute(sizeAttr, 1));
  }, [pos, sizeAttr]);

  // sparks/chords/link attribute setup once
  useEffect(() => {
    sparkGeomRef.current?.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    sparkGeomRef.current?.setAttribute('color', new THREE.BufferAttribute(sparkCol, 3));
    chordGeomRef.current?.setAttribute('position', new THREE.BufferAttribute(chordPos, 3));
    chordGeomRef.current?.setAttribute('color', new THREE.BufferAttribute(chordCol, 3));
    linkGeomRef.current?.setAttribute('position', new THREE.BufferAttribute(linkPos, 3));
    linkGeomRef.current?.setAttribute('color', new THREE.BufferAttribute(linkCol, 3));
  }, [sparkPos, sparkCol, chordPos, chordCol, linkPos, linkCol]);

  // simple spatial hash for sparks
  const grid = useRef<Map<number, number[]>>(new Map());
  const cellSize = 5.2;
  const cellKey = (ix: number, iy: number) => (ix << 16) + (iy & 0xffff);
  const rebuildHash = () => {
    const g = grid.current; g.clear();
    for (let i = 0; i < count; i++) {
      const x = pos[i * 3], y = pos[i * 3 + 1];
      const ix = Math.floor(x / cellSize), iy = Math.floor(y / cellSize);
      const key = cellKey(ix, iy);
      if (!g.has(key)) g.set(key, []);
      g.get(key)!.push(i);
    }
  };
  const neighbors = (i: number) => {
    const x = pos[i * 3], y = pos[i * 3 + 1];
    const ix = Math.floor(x / cellSize), iy = Math.floor(y / cellSize);
    const near: number[] = [];
    const g = grid.current;
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      const key = cellKey(ix + dx, iy + dy);
      const arr = g.get(key); if (arr) near.push(...arr);
    }
    return near;
  };

  // helper: write quadratic bezier polyline to buffers with grayscale color
  const writeBezier = (
    out: Float32Array,
    base: number,
    segments: number,
    a: THREE.Vector3,
    b: THREE.Vector3,
    control: THREE.Vector3,
    gray: number,
    colOut?: Float32Array,
    brightness = 1
  ) => {
    const rgb = new THREE.Color(0, 0, 0);
    const r = rgb.r * brightness, g = rgb.g * brightness, bl = rgb.b * brightness;
    for (let s = 0; s < segments; s++) {
      const t = s / (segments - 1), mt = 1 - t;
      const x = mt * mt * a.x + 2 * mt * t * control.x + t * t * b.x;
      const y = mt * mt * a.y + 2 * mt * t * control.y + t * t * b.y;
      const z = mt * mt * a.z + 2 * mt * t * control.z + t * t * b.z;
      const i3 = base + s * 3;
      out[i3] = x; out[i3 + 1] = y; out[i3 + 2] = z;
      if (colOut) { colOut[i3] = r; colOut[i3 + 1] = g; colOut[i3 + 2] = bl; }
    }
  };

  // curved sparks
  const spawnSparkFrom = (i: number, depth: number, maxDepth: number) => {
    if (depth > maxDepth) return;
    const near = neighbors(i);
    let best = -1, bestD2 = Infinity;
    for (const j of near) {
      if (j === i) continue;
      const dx = pos[j * 3] - pos[i * 3];
      const dy = pos[j * 3 + 1] - pos[i * 3 + 1];
      const dz = pos[j * 3 + 2] - pos[i * 3 + 2];
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < CONFIG.sparks.maxDist * CONFIG.sparks.maxDist && d2 < bestD2) { best = j; bestD2 = d2; }
    }
    if (best >= 0) {
      let k = -1;
      for (let s = 0; s < MAX_SPARKS; s++) { if (sparkLife[s] <= 0) { k = s; break; } }
      if (k >= 0) {
        sparkIdxA[k] = i; sparkIdxB[k] = best; sparkLife[k] = CONFIG.sparks.fadeSec;
        const a = new THREE.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
        const b = new THREE.Vector3(pos[best * 3], pos[best * 3 + 1], pos[best * 3 + 2]);
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const dir = b.clone().sub(a).normalize();
        const normal = new THREE.Vector3(-dir.y, dir.x, dir.z).normalize().multiplyScalar(0.7 + Math.random() * 0.6);
        const control = mid.add(normal);
        const base = k * sparkStride;
        writeBezier(sparkPos, base, sparkSegments, a, b, control, 0.65, sparkCol);
        sparkGeomRef.current?.setDrawRange(0, (countActiveSparks()) * sparkSegments);
        if (Math.random() < 0.6) spawnSparkFrom(best, depth + 1, maxDepth);
      }
    }
  };
  const countActiveSparks = () => { let c = 0; for (let s = 0; s < MAX_SPARKS; s++) if (sparkLife[s] > 0) c++; return c; };

  // chords spawn (with rest length)
  const spawnChord = () => {
    let k = -1; for (let s = 0; s < MAX_CHORDS; s++) { if (chordLife[s] <= 0) { k = s; break; } }
    if (k < 0) return;
    const i = (Math.random() * count) | 0;
    const offset = ((count * 0.45) | 0) + ((Math.random() * count * 0.1) | 0);
    const j = (i + offset) % count;

    chordIdxA[k] = i; chordIdxB[k] = j; chordLife[k] = D.fadeSec;
    const ax = pos[i * 3], ay = pos[i * 3 + 1], az = pos[i * 3 + 2];
    const bx = pos[j * 3], by = pos[j * 3 + 1], bz = pos[j * 3 + 2];
    const rest = Math.min(D.maxRestLen, Math.max(D.minRestLen, Math.hypot(bx - ax, by - ay, bz - az)));
    chordRestLen[k] = rest;

    // write initial curve
    const a = new THREE.Vector3(ax, ay, az);
    const b = new THREE.Vector3(bx, by, bz);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const dir = b.clone().sub(a).normalize();
    const control = mid.add(new THREE.Vector3(-dir.y, dir.x, dir.z).normalize().multiplyScalar(1.0));
    const base = k * chordStride;
    writeBezier(chordPos, base, chordSegments, a, b, control, 0.70, chordCol);
    chordGeomRef.current?.setDrawRange(0, (countActiveChords()) * chordSegments);
  };
  const countActiveChords = () => { let c = 0; for (let s = 0; s < MAX_CHORDS; s++) if (chordLife[s] > 0) c++; return c; };

  // initialize particle->icosahedron links
  useMemo(() => {
    const linkCfg = CONFIG.linkSplines;
    if (!linkCfg.enabled) return;
    for (let k = 0; k < linkCfg.count; k++) {
      linkIdxParticle[k] = (Math.random() * count) | 0;
      linkIdxVertex[k] = (Math.random() * icoVertices.length) | 0;
      linkLife[k] = 1;
    }
  }, [count, icoVertices.length]);

  // waves (interference)
  const waves = useMemo(() => CONFIG.waves.map(w => ({ k: new THREE.Vector3(...w.dir).normalize(), w: w.w })), []);

  // Animation
  const lastRef = useRef(performance.now());
  const frameCounter = useRef(0);

  useFrame(() => {
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastRef.current) / 100) || 0.016;
    lastRef.current = now;
    frameCounter.current++;

    const [wHeader, wSlider, wDao, wDocs, wBottom] = weights as Weights;
    const denom = (wHeader + wSlider + wDao + wDocs + wBottom) || 1;

    const kForm = CONFIG.forces.form, kDamp = CONFIG.forces.damp, kWig = CONFIG.forces.wiggle, kInterf = CONFIG.forces.interference;
    const swirl = CONFIG.torus.swirl * wHeader;
    const kMouse = CONFIG.torus.mousePull * wHeader;

    const docsAngle = wDocs ? now * 0.0005 : 0;
    const cA = Math.cos(docsAngle), sA = Math.sin(docsAngle);

    if (wSlider > 0.12 && (frameCounter.current % 3) === 0) rebuildHash();

    sparkMat.opacity = CONFIG.sparks.enabled ? CONFIG.sparks.opacity * wSlider : 0;
    chordMat.opacity = CONFIG.dao.chords.opacity * (0.8 + 0.2 * Math.sin(now * 0.001)); // gentle breathing

    // integrate particles
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const px = pos[i3], py = pos[i3 + 1], pz = pos[i3 + 2];

      // docs rotated target
      const dx = tgtDocs[i3], dy = tgtDocs[i3 + 1], dz = tgtDocs[i3 + 2];
      const rdx = cA * dx - sA * dy, rdy = sA * dx + cA * dy, rdz = dz;

      const tx = (tgtHeader[i3] * wHeader + tgtSlider[i3] * wSlider + tgtDAO[i3] * wDao + rdx * wDocs + tgtBottom[i3] * wBottom) / denom;
      const ty = (tgtHeader[i3 + 1] * wHeader + tgtSlider[i3 + 1] * wSlider + tgtDAO[i3 + 1] * wDao + rdy * wDocs + tgtBottom[i3 + 1] * wBottom) / denom;
      const tz = (tgtHeader[i3 + 2] * wHeader + tgtSlider[i3 + 2] * wSlider + tgtDAO[i3 + 2] * wDao + rdz * wDocs + tgtBottom[i3 + 2] * wBottom) / denom;

      let ax = (tx - px) * kForm, ay = (ty - py) * kForm, az = (tz - pz) * kForm;

      if (wHeader > 1e-4) {
        const m = mouseWorld.current;
        ax += (m.x - px) * kMouse;
        ay += (m.y - py) * kMouse;
        az += (m.z - pz) * kMouse;
        const tangX = -pz, tangZ = px;
        vel[i3] += tangX * swirl * 0.03;
        vel[i3 + 2] += tangZ * swirl * 0.03;
      }

      if (kInterf > 0) {
        for (let w = 0; w < waves.length; w++) {
          const kk = waves[w].k, om = waves[w].w;
          const th = kk.x * px + kk.y * py + kk.z * pz + om * now * 0.001;
          const g = Math.cos(th);
          ax += kk.x * g * kInterf; ay += kk.y * g * kInterf; az += kk.z * g * kInterf;
        }
      }

      // PHI pairing
      const partner = ((i * (PHI - 1)) % 1) * count | 0; const j3 = partner * 3;
      ax += (pos[j3] - px) * CONFIG.forces.phiCouple * (1 + CONFIG.forces.phiAmp * Math.sin(now * 0.0012 * PHI + phase[i]));
      ay += (pos[j3 + 1] - py) * CONFIG.forces.phiCouple * (1 + CONFIG.forces.phiAmp * Math.cos(now * 0.0010 * PHI + phase[i]));
      az += (pos[j3 + 2] - pz) * CONFIG.forces.phiCouple * (1 + CONFIG.forces.phiAmp * Math.sin(now * 0.0008 * PHI + phase[i]));

      ax += Math.sin(phase[i] + now * 0.0014) * kWig * 0.025;
      ay += Math.cos(phase[i] + now * 0.0016) * kWig * 0.025;

      vel[i3] = (vel[i3] + ax * dt) * kDamp;
      vel[i3 + 1] = (vel[i3 + 1] + ay * dt) * kDamp;
      vel[i3 + 2] = (vel[i3 + 2] + az * dt) * kDamp;

      pos[i3] = px + vel[i3] * dt;
      pos[i3 + 1] = py + vel[i3 + 1] * dt;
      pos[i3 + 2] = pz + vel[i3 + 2] * dt;
    }

    // CURVED SPARKS
    if (CONFIG.sparks.enabled && wSlider > 0.15) {
      for (let s = 0; s < CONFIG.sparks.spawnPerFrame; s++) {
        const i = (Math.random() * count) | 0; spawnSparkFrom(i, 0, CONFIG.sparks.maxDepth);
      }
    }
    let drawnS = 0;
    for (let s = 0; s < MAX_SPARKS; s++) {
      if (sparkLife[s] > 0) {
        sparkLife[s] -= dt;
        if (sparkLife[s] <= 0) continue;
        const iA = sparkIdxA[s], iB = sparkIdxB[s];
        const a = new THREE.Vector3(pos[iA * 3], pos[iA * 3 + 1], pos[iA * 3 + 2]);
        const b = new THREE.Vector3(pos[iB * 3], pos[iB * 3 + 1], pos[iB * 3 + 2]);
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const dir = b.clone().sub(a).normalize();
        const wig = Math.sin((now * 0.002) + s) * 0.6;
        const normal = new THREE.Vector3(-dir.y, dir.x, dir.z).normalize().multiplyScalar(0.8 + wig);
        const control = mid.add(normal);
        const base = drawnS * sparkStride;
        const age = sparkLife[s] / CONFIG.sparks.fadeSec;
        writeBezier(sparkPos, base, sparkSegments, a, b, control, 0.62, sparkCol, 0.8 + 0.2 * age);
        drawnS++;
      }
    }
    if (sparkGeomRef.current) {
      sparkGeomRef.current.setDrawRange(0, drawnS * sparkSegments);
      if (drawnS) {
        sparkGeomRef.current.attributes.position.needsUpdate = true;
        sparkGeomRef.current.attributes.color.needsUpdate = true;
      }
    }

    // ORGANIC CHORDS: stretch & snap
    if (wDao > 0.15) { for (let s = 0; s < D.spawnPerFrame; s++) spawnChord(); }
    let drawnC = 0;
    for (let s = 0; s < MAX_CHORDS; s++) {
      if (chordLife[s] > 0) {
        chordLife[s] -= dt;
        if (chordLife[s] <= 0) continue;

        const iA = chordIdxA[s], iB = chordIdxB[s];
        const a = new THREE.Vector3(pos[iA * 3], pos[iA * 3 + 1], pos[iA * 3 + 2]);
        const b = new THREE.Vector3(pos[iB * 3], pos[iB * 3 + 1], pos[iB * 3 + 2]);

        const dist = a.distanceTo(b);
        const rest = chordRestLen[s] || dist;
        const tension = Math.max(0, (dist - rest) / rest);                // 0 = slack, >0 stretched
        const bulge = (1 + tension * D.springiness);                       // push control outward with tension
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const dir = b.clone().sub(a).normalize();
        const normal = new THREE.Vector3(-dir.y, dir.x, dir.z).normalize().multiplyScalar(bulge);
        const wig = Math.cos((now * 0.0018) + s * 1.3) * 0.45 * (1 + tension); // extra wiggle when stretched
        const control = mid.add(normal.multiplyScalar(1.0 + wig));

        // snap if overstretched
        if (dist > D.snapStretch * rest) {
          // quick “recoil flash” by brightening momentarily
          const base = drawnC * chordStride;
          writeBezier(chordPos, base, chordSegments, a, b, control, 0.85, chordCol, 1.0 + D.snapRecoil);
          chordLife[s] = 0; // snap (remove next frame)
          drawnC++;
          continue;
        }

        // normal draw (brightness increases slightly with tension)
        const base = drawnC * chordStride;
        const bright = 0.8 + 0.6 * Math.min(1, tension);
        writeBezier(chordPos, base, chordSegments, a, b, control, 0.75, chordCol, bright);
        drawnC++;
      }
    }
    if (chordGeomRef.current) {
      chordGeomRef.current.setDrawRange(0, drawnC * chordSegments);
      if (drawnC) {
        chordGeomRef.current.attributes.position.needsUpdate = true;
        chordGeomRef.current.attributes.color.needsUpdate = true;
      }
    }

    // PARTICLE -> ICOSAHEDRON GRAY LINKS
    if (CONFIG.linkSplines.enabled) {
      let written = 0;
      for (let k = 0; k < LINK_COUNT; k++) {
        if (linkLife[k] <= 0) continue;
        const iP = linkIdxParticle[k] % count;
        const iV = linkIdxVertex[k] % icoVertices.length;
        const a = new THREE.Vector3(pos[iP * 3], pos[iP * 3 + 1], pos[iP * 3 + 2]);
        const b = icoVertices[iV];
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const dir = b.clone().sub(a).normalize();
        const t = now * 0.0015 + linkPhase[k];
        const amp = CONFIG.linkSplines.wiggleAmp * (0.6 + 0.4 * Math.sin(t * CONFIG.linkSplines.wiggleFreq + k));
        const perp = new THREE.Vector3(-dir.y, dir.x, dir.z).normalize().multiplyScalar(amp);
        const control = mid.add(perp);
        const base = written * linkStride;
        writeBezier(linkPos, base, LINK_SEG, a, b, control, 0.7, linkCol, 1.0);
        written++;
      }
      if (linkGeomRef.current) {
        linkGeomRef.current.setDrawRange(0, written * LINK_SEG);
        if (written) {
          linkGeomRef.current.attributes.position.needsUpdate = true;
          linkGeomRef.current.attributes.color.needsUpdate = true;
        }
      }
    }

    // push particle position updates
    if (pointsGeomRef.current) {
      (pointsGeomRef.current.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Smoky circle particles */}
      <points material={pointsMatRef.current!}>
        <bufferGeometry ref={pointsGeomRef} />
      </points>

      {/* Curved gray sparks */}
      {/* @ts-ignore - TypeScript doesn't recognize line primitive */}
      <line>
        <primitive object={sparkMat} attach="material" />
        <bufferGeometry ref={sparkGeomRef} />
      </line>

      {/* Organic gray chords (stretch & snap) */}
      {/* @ts-ignore - TypeScript doesn't recognize line primitive */}
      <line>
        <primitive object={chordMat} attach="material" />
        <bufferGeometry ref={chordGeomRef} />
      </line>

      {/* Gray particle→icosahedron links */}
      {CONFIG.linkSplines.enabled && (
        // @ts-ignore - TypeScript doesn't recognize line primitive
        <line>
          <primitive object={linkMat} attach="material" />
          <bufferGeometry ref={linkGeomRef} />
        </line>
      )}
    </group>
  );
};

/* =============================================================================
   Param-driven content
============================================================================= */
const SceneContent: React.FC<{
  performanceLevel: 'high' | 'medium' | 'low';
  params: SceneParams;
}> = ({ performanceLevel, params }) => {
  const {
    fieldOpacity = 0.35,
    pageIndex,
    pageWeights
  } = params;

  // weights
  const weights = useMemo<Weights>(() => {
    if (Array.isArray(pageWeights) && pageWeights.length === 5) {
      const sum = pageWeights.reduce((a, b) => a + b, 0) || 1;
      return [
        pageWeights[0] / sum,
        pageWeights[1] / sum,
        pageWeights[2] / sum,
        pageWeights[3] / sum,
        pageWeights[4] / sum
      ] as Weights;
    }
    const i = Math.max(0, Math.min(4, pageIndex ?? 0));
    const w: number[] = [0, 0, 0, 0, 0]; w[i] = 1;
    return w as Weights;
  }, [pageIndex, pageWeights]);

  // proxy detail for icosahedron links (perf dependent)
  const orbDetail = performanceLevel === 'high' ? 3 : performanceLevel === 'medium' ? 2 : 1;
  const orbSampleRadius = 2; // stable radius for the vertex link targets

  return (
    <>
      <SceneLighting performanceLevel={performanceLevel} />

      {/* Particles + gray links + organic chords */}
      <ParticlesSystem
        performanceLevel={performanceLevel}
        weights={weights}
        orbSampleRadius={orbSampleRadius}
        orbDetail={orbDetail}
      />

      {/* Subtle background flow (also grayscale via opacity) */}
      <TemporalFlowField
        count={performanceLevel === 'high' ? 1400 : performanceLevel === 'medium' ? 800 : 400}
        spread={60}
        speed={0.28}
        opacity={fieldOpacity}
        performanceLevel={performanceLevel}
      />

      {performanceLevel === 'high' && (
        <Environment
          background={false}
          files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr"
        />
      )}
    </>
  );
};

// Post-processing placeholder (disabled)
const PostProcessing: React.FC<{ performanceLevel: 'high' | 'medium' | 'low' }> = () => null;

// Fallback for no WebGL
const SceneFallback: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black to-[#0b0b0b]">
    <div className="text-center p-8">
      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#444] to-[#999] animate-pulse" />
      <h3 className="text-xl font-bold text-white mb-4">Temporal Field</h3>
      <p className="text-gray-400 max-w-md">Your device doesn’t support WebGL.</p>
    </div>
  </div>
);

/* =============================================================================
   Hook: native device pixel ratio (updates on resize/orientation)
============================================================================= */
const MAX_DPR = 4; // safety cap; raise if you want to go beyond 4x
const useNativeDPR = () => {
  const get = () =>
    (typeof window !== 'undefined'
      ? Math.max(1, Math.min(MAX_DPR, window.devicePixelRatio || 1))
      : 1);
  const [dpr, setDpr] = useState<number>(get);
  useEffect(() => {
    const update = () => setDpr(get());
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);
  return dpr;
};

export const Scene: React.FC<SceneProps> = ({
  className = '',
  enableControls = true,
  autoRotate = true,
  showStats = false,
  performanceLevel,
  fallbackComponent: FallbackComponent = SceneFallback,
  children,
  params = {},
}) => {
  const [detectedPerformance, setDetectedPerformance] = useState<'high' | 'medium' | 'low'>('medium');
  const [webGLSupported, setWebGLSupported] = useState(true);
  const nativeDpr = useNativeDPR();

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
    <div
      className={`w-full h-full ${className}`}
      style={{
        width: '100%',
        height: '100%',
        // allow OrbitControls to receive input when enabled
        pointerEvents: enableControls ? 'auto' : 'none'
      }}
    >
      <Canvas
        // Full resolution: render at the device's native DPR
        dpr={nativeDpr}
        gl={{
          antialias: true, // keep crisp at hi-dpi
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        camera={{ position: [0, 0, 30], fov: 90 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Removed <AdaptiveDpr /> so DPR never downscales; keep adaptive events */}
        <AdaptiveEvents />

        <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={90} />

        {enableControls && (
          <OrbitControls
            enableZoom
            enablePan={false}
            enableRotate
            autoRotate={params.autoRotate ?? autoRotate}
            autoRotateSpeed={0.25}
            minDistance={10}
            maxDistance={40}
          />
        )}

        <Suspense fallback={<SceneLoader />}>
          {children || (
            <SceneContent
              performanceLevel={finalPerformanceLevel}
              params={params}
            />
          )}
        </Suspense>

        <PostProcessing performanceLevel={finalPerformanceLevel} />

        {showStats && process.env['NODE_ENV'] === 'development' && (
          <Html position={[-8, 6, 0]}>
            <div className="text-white text-xs bg-black/50 p-2 rounded">
              Performance: {finalPerformanceLevel} — DPR: {nativeDpr.toFixed(2)}
            </div>
          </Html>
        )}
      </Canvas>
    </div>
  );
};

export default Scene;
