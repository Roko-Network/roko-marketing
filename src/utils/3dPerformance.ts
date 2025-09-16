/**
 * 3D Performance Optimization for ROKO Network
 * Advanced rendering optimizations for Three.js scenes
 */

import * as THREE from 'three';

interface GPUInfo {
  vendor: string;
  renderer: string;
  version: string;
  tier: 'low' | 'medium' | 'high';
  maxTextureSize: number;
  maxVertexUniformVectors: number;
  maxFragmentUniformVectors: number;
  supportsFloatTextures: boolean;
  supportsInstancedArrays: boolean;
}

interface PerformanceSettings {
  pixelRatio: number;
  shadowMapSize: number;
  antialias: boolean;
  shadowType: THREE.ShadowMapType;
  toneMapping: THREE.ToneMapping;
  enablePostProcessing: boolean;
  maxLights: number;
  lodLevels: number[];
  frustumCulling: boolean;
  instancedRendering: boolean;
}

interface LODConfig {
  distances: number[];
  geometryComplexity: number[];
  textureResolutions: number[];
  materialQuality: ('low' | 'medium' | 'high')[];
}

interface FrameRateMonitor {
  targetFPS: number;
  currentFPS: number;
  frameCount: number;
  lastTime: number;
  adaptiveQuality: boolean;
}

/**
 * GPU Detection and Performance Profiling
 */
export class GPUProfiler {
  private gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  private canvas: HTMLCanvasElement;
  private info: GPUInfo | null = null;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1;
    this.canvas.height = 1;

    try {
      this.gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl');
    } catch (e) {
      console.warn('WebGL not supported:', e);
    }
  }

  async detectGPU(): Promise<GPUInfo> {
    if (this.info) return this.info;

    if (!this.gl) {
      return {
        vendor: 'unknown',
        renderer: 'unknown',
        version: 'unknown',
        tier: 'low',
        maxTextureSize: 1024,
        maxVertexUniformVectors: 128,
        maxFragmentUniformVectors: 16,
        supportsFloatTextures: false,
        supportsInstancedArrays: false
      };
    }

    const debugInfo = this.gl.getExtension('WEBGL_debug_renderer_info');
    const vendor = debugInfo ? this.gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown';
    const renderer = debugInfo ? this.gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
    const version = this.gl.getParameter(this.gl.VERSION);

    // Performance benchmarking
    const maxTextureSize = this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE);
    const maxVertexUniformVectors = this.gl.getParameter(this.gl.MAX_VERTEX_UNIFORM_VECTORS);
    const maxFragmentUniformVectors = this.gl.getParameter(this.gl.MAX_FRAGMENT_UNIFORM_VECTORS);

    // Feature detection
    const floatTextures = !!(this.gl.getExtension('OES_texture_float') || this.gl.getExtension('EXT_color_buffer_float'));
    const instancedArrays = !!(this.gl.getExtension('ANGLE_instanced_arrays') || this.gl instanceof WebGL2RenderingContext);

    // GPU tier classification
    const tier = this.classifyGPUTier(renderer, maxTextureSize, maxVertexUniformVectors);

    this.info = {
      vendor,
      renderer,
      version,
      tier,
      maxTextureSize,
      maxVertexUniformVectors,
      maxFragmentUniformVectors,
      supportsFloatTextures: floatTextures,
      supportsInstancedArrays: instancedArrays
    };

    return this.info;
  }

  private classifyGPUTier(renderer: string, maxTextureSize: number, maxVertexUniformVectors: number): 'low' | 'medium' | 'high' {
    const rendererLower = renderer.toLowerCase();

    // High-end GPUs
    if (
      rendererLower.includes('rtx') ||
      rendererLower.includes('gtx 1080') ||
      rendererLower.includes('gtx 1070') ||
      rendererLower.includes('radeon rx') ||
      (maxTextureSize >= 16384 && maxVertexUniformVectors >= 1024)
    ) {
      return 'high';
    }

    // Medium GPUs
    if (
      rendererLower.includes('gtx') ||
      rendererLower.includes('radeon') ||
      rendererLower.includes('intel iris') ||
      (maxTextureSize >= 8192 && maxVertexUniformVectors >= 512)
    ) {
      return 'medium';
    }

    // Low-end or integrated GPUs
    return 'low';
  }

  getPerformanceProfile(): PerformanceSettings {
    if (!this.info) {
      throw new Error('GPU detection must be run first');
    }

    const baseSettings = {
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      shadowMapSize: 2048,
      antialias: true,
      shadowType: THREE.PCFSoftShadowMap,
      toneMapping: THREE.ACESFilmicToneMapping,
      enablePostProcessing: true,
      maxLights: 8,
      lodLevels: [10, 50, 100, 200],
      frustumCulling: true,
      instancedRendering: true
    };

    switch (this.info.tier) {
      case 'high':
        return {
          ...baseSettings,
          pixelRatio: Math.min(window.devicePixelRatio, 3),
          shadowMapSize: 4096,
          maxLights: 16,
          lodLevels: [20, 80, 150, 300]
        };

      case 'medium':
        return baseSettings;

      case 'low':
        return {
          ...baseSettings,
          pixelRatio: Math.min(window.devicePixelRatio, 1.5),
          shadowMapSize: 1024,
          antialias: false,
          shadowType: THREE.BasicShadowMap,
          enablePostProcessing: false,
          maxLights: 4,
          lodLevels: [5, 25, 75, 150]
        };

      default:
        return baseSettings;
    }
  }
}

/**
 * Level of Detail (LOD) System
 */
export class LODManager {
  private lodGroups: Map<string, THREE.LOD> = new Map();
  private camera: THREE.Camera;
  private config: LODConfig;

  constructor(camera: THREE.Camera, config?: Partial<LODConfig>) {
    this.camera = camera;
    this.config = {
      distances: [0, 50, 100, 200],
      geometryComplexity: [1.0, 0.6, 0.3, 0.1],
      textureResolutions: [1024, 512, 256, 128],
      materialQuality: ['high', 'medium', 'low', 'low'],
      ...config
    };
  }

  createLODGroup(
    name: string,
    baseGeometry: THREE.BufferGeometry,
    baseMaterial: THREE.Material
  ): THREE.LOD {
    const lod = new THREE.LOD();

    this.config.distances.forEach((distance, index) => {
      const geometry = this.simplifyGeometry(baseGeometry, this.config.geometryComplexity[index]);
      const material = this.adaptMaterial(baseMaterial, this.config.materialQuality[index], this.config.textureResolutions[index]);
      const mesh = new THREE.Mesh(geometry, material);

      lod.addLevel(mesh, distance);
    });

    this.lodGroups.set(name, lod);
    return lod;
  }

  private simplifyGeometry(geometry: THREE.BufferGeometry, complexity: number): THREE.BufferGeometry {
    if (complexity >= 1.0) return geometry;

    // Simple decimation - in production, use a proper mesh simplification library
    const positions = geometry.attributes.position.array;
    const indices = geometry.index?.array;

    if (!indices) return geometry;

    const targetCount = Math.floor(indices.length * complexity);
    const step = Math.max(1, Math.floor(indices.length / targetCount));

    const newIndices = [];
    for (let i = 0; i < indices.length; i += step) {
      newIndices.push(indices[i]);
    }

    const newGeometry = geometry.clone();
    newGeometry.setIndex(newIndices);
    return newGeometry;
  }

  private adaptMaterial(material: THREE.Material, quality: 'low' | 'medium' | 'high', textureRes: number): THREE.Material {
    const newMaterial = material.clone();

    // Adjust material properties based on quality
    switch (quality) {
      case 'low':
        if ('roughness' in newMaterial) newMaterial.roughness = 0.8;
        if ('metalness' in newMaterial) newMaterial.metalness = 0.1;
        break;
      case 'medium':
        if ('roughness' in newMaterial) newMaterial.roughness = 0.5;
        if ('metalness' in newMaterial) newMaterial.metalness = 0.3;
        break;
      case 'high':
        // Keep original values
        break;
    }

    // Downscale textures if needed
    if ('map' in newMaterial && newMaterial.map) {
      const texture = newMaterial.map as THREE.Texture;
      if (texture.image && (texture.image.width > textureRes || texture.image.height > textureRes)) {
        // In production, implement texture resizing
        console.log(`Would resize texture from ${texture.image.width}x${texture.image.height} to ${textureRes}x${textureRes}`);
      }
    }

    return newMaterial;
  }

  update() {
    this.lodGroups.forEach((lod) => {
      lod.update(this.camera);
    });
  }
}

/**
 * Frame Rate Monitor and Adaptive Quality System
 */
export class FrameRateMonitor {
  private targetFPS: number;
  private currentFPS: number = 60;
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private fpsHistory: number[] = [];
  private adaptiveQuality: boolean;
  private qualityLevel: number = 1.0;
  private callbacks: Set<(fps: number, quality: number) => void> = new Set();

  constructor(targetFPS: number = 60, adaptiveQuality: boolean = true) {
    this.targetFPS = targetFPS;
    this.adaptiveQuality = adaptiveQuality;
  }

  update(): void {
    this.frameCount++;
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    if (deltaTime >= 1000) { // Update every second
      this.currentFPS = (this.frameCount * 1000) / deltaTime;
      this.fpsHistory.push(this.currentFPS);

      // Keep only last 10 readings
      if (this.fpsHistory.length > 10) {
        this.fpsHistory.shift();
      }

      if (this.adaptiveQuality) {
        this.adjustQuality();
      }

      // Notify listeners
      this.callbacks.forEach(callback => callback(this.currentFPS, this.qualityLevel));

      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }

  private adjustQuality(): void {
    const avgFPS = this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length;
    const fpsRatio = avgFPS / this.targetFPS;

    if (fpsRatio < 0.8 && this.qualityLevel > 0.3) {
      // Reduce quality if FPS is too low
      this.qualityLevel = Math.max(0.3, this.qualityLevel - 0.1);
    } else if (fpsRatio > 1.1 && this.qualityLevel < 1.0) {
      // Increase quality if FPS is high
      this.qualityLevel = Math.min(1.0, this.qualityLevel + 0.05);
    }
  }

  onFPSChange(callback: (fps: number, quality: number) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  getCurrentFPS(): number {
    return this.currentFPS;
  }

  getQualityLevel(): number {
    return this.qualityLevel;
  }
}

/**
 * Memory Manager for 3D Assets
 */
export class MemoryManager {
  private disposedObjects: Set<THREE.Object3D> = new Set();
  private geometryCache: Map<string, THREE.BufferGeometry> = new Map();
  private materialCache: Map<string, THREE.Material> = new Map();
  private textureCache: Map<string, THREE.Texture> = new Map();
  private maxCacheSize: number;

  constructor(maxCacheSize: number = 100) {
    this.maxCacheSize = maxCacheSize;
  }

  disposeObject(object: THREE.Object3D): void {
    if (this.disposedObjects.has(object)) return;
    this.disposedObjects.add(object);

    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        this.disposeGeometry(child.geometry);
        this.disposeMaterial(child.material);
      }
    });

    object.removeFromParent();
  }

  private disposeGeometry(geometry: THREE.BufferGeometry): void {
    geometry.dispose();
  }

  private disposeMaterial(material: THREE.Material | THREE.Material[]): void {
    const materials = Array.isArray(material) ? material : [material];
    materials.forEach((mat) => {
      if ('map' in mat && mat.map) mat.map.dispose();
      if ('normalMap' in mat && mat.normalMap) mat.normalMap.dispose();
      if ('roughnessMap' in mat && mat.roughnessMap) mat.roughnessMap.dispose();
      if ('metalnessMap' in mat && mat.metalnessMap) mat.metalnessMap.dispose();
      mat.dispose();
    });
  }

  cacheGeometry(key: string, geometry: THREE.BufferGeometry): void {
    if (this.geometryCache.size >= this.maxCacheSize) {
      const firstKey = this.geometryCache.keys().next().value;
      const oldGeometry = this.geometryCache.get(firstKey);
      oldGeometry?.dispose();
      this.geometryCache.delete(firstKey);
    }
    this.geometryCache.set(key, geometry);
  }

  getGeometry(key: string): THREE.BufferGeometry | undefined {
    return this.geometryCache.get(key);
  }

  getMemoryUsage(): {
    geometries: number;
    materials: number;
    textures: number;
    total: number;
  } {
    const info = {
      geometries: this.geometryCache.size,
      materials: this.materialCache.size,
      textures: this.textureCache.size,
      total: 0
    };
    info.total = info.geometries + info.materials + info.textures;
    return info;
  }

  cleanup(): void {
    this.geometryCache.forEach((geometry) => geometry.dispose());
    this.materialCache.forEach((material) => material.dispose());
    this.textureCache.forEach((texture) => texture.dispose());

    this.geometryCache.clear();
    this.materialCache.clear();
    this.textureCache.clear();
    this.disposedObjects.clear();
  }
}

/**
 * Frustum Culling Optimization
 */
export class FrustumCuller {
  private camera: THREE.Camera;
  private frustum: THREE.Frustum = new THREE.Frustum();
  private matrix: THREE.Matrix4 = new THREE.Matrix4();

  constructor(camera: THREE.Camera) {
    this.camera = camera;
  }

  update(): void {
    this.matrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
    this.frustum.setFromProjectionMatrix(this.matrix);
  }

  isVisible(object: THREE.Object3D): boolean {
    if (!object.geometry) return true;

    const geometry = object.geometry as THREE.BufferGeometry;
    if (!geometry.boundingSphere) {
      geometry.computeBoundingSphere();
    }

    if (!geometry.boundingSphere) return true;

    const sphere = geometry.boundingSphere.clone();
    sphere.applyMatrix4(object.matrixWorld);

    return this.frustum.intersectsSphere(sphere);
  }

  cullScene(scene: THREE.Scene): void {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.visible = this.isVisible(object);
      }
    });
  }
}

/**
 * Main 3D Performance Manager
 */
export class Performance3DManager {
  private gpuProfiler: GPUProfiler;
  private lodManager: LODManager | null = null;
  private frameMonitor: FrameRateMonitor;
  private memoryManager: MemoryManager;
  private frustumCuller: FrustumCuller | null = null;
  private settings: PerformanceSettings | null = null;

  constructor() {
    this.gpuProfiler = new GPUProfiler();
    this.frameMonitor = new FrameRateMonitor();
    this.memoryManager = new MemoryManager();
  }

  async initialize(camera: THREE.Camera): Promise<PerformanceSettings> {
    await this.gpuProfiler.detectGPU();
    this.settings = this.gpuProfiler.getPerformanceProfile();

    this.lodManager = new LODManager(camera);
    this.frustumCuller = new FrustumCuller(camera);

    return this.settings;
  }

  update(): void {
    this.frameMonitor.update();
    this.lodManager?.update();
    this.frustumCuller?.update();
  }

  cullScene(scene: THREE.Scene): void {
    this.frustumCuller?.cullScene(scene);
  }

  disposeObject(object: THREE.Object3D): void {
    this.memoryManager.disposeObject(object);
  }

  getStats() {
    return {
      fps: this.frameMonitor.getCurrentFPS(),
      quality: this.frameMonitor.getQualityLevel(),
      memory: this.memoryManager.getMemoryUsage(),
      settings: this.settings
    };
  }

  cleanup(): void {
    this.memoryManager.cleanup();
  }
}

export const performance3D = {
  GPUProfiler,
  LODManager,
  FrameRateMonitor,
  MemoryManager,
  FrustumCuller,
  Performance3DManager
};

export default Performance3DManager;