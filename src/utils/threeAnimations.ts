/**
 * ROKO Network Three.js Animation Integration
 *
 * Seamless integration between Framer Motion and Three.js,
 * providing synchronized animations for 3D elements
 */

import { useFrame, useThree } from '@react-three/fiber';
import { useSpring, useTransform, MotionValue, useMotionValue } from 'framer-motion';
import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

// Animation timing utilities
export const threeTimingFunctions = {
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeIn: (t: number) => t * t * t,
  elastic: (t: number) => t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI),
  bounce: (t: number) => {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  },
} as const;

// 3D Animation Types
export interface ThreeAnimationConfig {
  duration?: number;
  delay?: number;
  easing?: keyof typeof threeTimingFunctions;
  loop?: boolean;
  yoyo?: boolean;
  onComplete?: () => void;
  onUpdate?: (progress: number) => void;
}

export interface CameraAnimationConfig extends ThreeAnimationConfig {
  position?: THREE.Vector3;
  target?: THREE.Vector3;
  fov?: number;
  smooth?: boolean;
}

export interface ObjectAnimationConfig extends ThreeAnimationConfig {
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  scale?: THREE.Vector3;
  opacity?: number;
}

// Animation state manager
class ThreeAnimationManager {
  private animations = new Map<string, {
    startTime: number;
    config: ThreeAnimationConfig;
    initialValues: any;
    targetValues: any;
    object: THREE.Object3D | THREE.Camera;
    type: 'object' | 'camera';
  }>();

  private clock = new THREE.Clock();

  add(
    id: string,
    object: THREE.Object3D | THREE.Camera,
    targetValues: any,
    config: ThreeAnimationConfig,
    type: 'object' | 'camera' = 'object'
  ) {
    const initialValues = this.getInitialValues(object, targetValues, type);

    this.animations.set(id, {
      startTime: this.clock.getElapsedTime(),
      config: { duration: 1, easing: 'easeOut', ...config },
      initialValues,
      targetValues,
      object,
      type,
    });
  }

  remove(id: string) {
    const animation = this.animations.get(id);
    if (animation) {
      animation.config.onComplete?.();
      this.animations.delete(id);
    }
  }

  update() {
    const currentTime = this.clock.getElapsedTime();

    this.animations.forEach((animation, id) => {
      const { startTime, config, initialValues, targetValues, object, type } = animation;
      const elapsed = currentTime - startTime - (config.delay || 0);

      if (elapsed < 0) return; // Still in delay

      const progress = Math.min(elapsed / (config.duration || 1), 1);
      const easedProgress = config.easing
        ? threeTimingFunctions[config.easing](progress)
        : progress;

      this.applyValues(object, initialValues, targetValues, easedProgress, type);
      config.onUpdate?.(easedProgress);

      if (progress >= 1) {
        if (config.loop) {
          this.animations.set(id, {
            ...animation,
            startTime: currentTime,
          });
        } else {
          this.remove(id);
        }
      }
    });
  }

  private getInitialValues(object: THREE.Object3D | THREE.Camera, targetValues: any, type: string) {
    const initial: any = {};

    if ('position' in targetValues) {
      initial.position = object.position.clone();
    }
    if ('rotation' in targetValues) {
      initial.rotation = object.rotation.clone();
    }
    if ('scale' in targetValues && 'scale' in object) {
      initial.scale = (object as THREE.Object3D).scale.clone();
    }
    if ('fov' in targetValues && type === 'camera') {
      initial.fov = (object as THREE.PerspectiveCamera).fov;
    }
    if ('opacity' in targetValues && 'material' in object) {
      const material = (object as any).material;
      if (material) {
        initial.opacity = material.opacity || 1;
      }
    }

    return initial;
  }

  private applyValues(
    object: THREE.Object3D | THREE.Camera,
    initial: any,
    target: any,
    progress: number,
    type: string
  ) {
    if (initial.position && target.position) {
      object.position.lerpVectors(initial.position, target.position, progress);
    }

    if (initial.rotation && target.rotation) {
      object.rotation.setFromVector3(
        new THREE.Vector3().lerpVectors(
          new THREE.Vector3(initial.rotation.x, initial.rotation.y, initial.rotation.z),
          new THREE.Vector3(target.rotation.x, target.rotation.y, target.rotation.z),
          progress
        )
      );
    }

    if (initial.scale && target.scale && 'scale' in object) {
      (object as THREE.Object3D).scale.lerpVectors(initial.scale, target.scale, progress);
    }

    if (initial.fov !== undefined && target.fov !== undefined && type === 'camera') {
      (object as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(initial.fov, target.fov, progress);
      (object as THREE.PerspectiveCamera).updateProjectionMatrix();
    }

    if (initial.opacity !== undefined && target.opacity !== undefined && 'material' in object) {
      const material = (object as any).material;
      if (material) {
        material.opacity = THREE.MathUtils.lerp(initial.opacity, target.opacity, progress);
        material.transparent = material.opacity < 1;
      }
    }
  }

  clear() {
    this.animations.clear();
  }

  getRunningAnimations() {
    return Array.from(this.animations.keys());
  }
}

export const threeAnimationManager = new ThreeAnimationManager();

// Hook for Three.js animations
export const useThreeAnimation = () => {
  useFrame(() => {
    threeAnimationManager.update();
  });

  return {
    animateObject: (
      id: string,
      object: THREE.Object3D,
      targetValues: ObjectAnimationConfig,
      config?: ThreeAnimationConfig
    ) => {
      const { position, rotation, scale, opacity, ...animConfig } = targetValues;
      threeAnimationManager.add(id, object, { position, rotation, scale, opacity }, animConfig, 'object');
    },

    animateCamera: (
      id: string,
      camera: THREE.Camera,
      targetValues: CameraAnimationConfig,
      config?: ThreeAnimationConfig
    ) => {
      const { position, fov, ...animConfig } = targetValues;
      threeAnimationManager.add(id, camera, { position, fov }, animConfig, 'camera');
    },

    stopAnimation: (id: string) => {
      threeAnimationManager.remove(id);
    },

    clearAnimations: () => {
      threeAnimationManager.clear();
    },

    getRunningAnimations: () => {
      return threeAnimationManager.getRunningAnimations();
    },
  };
};

// Synchronized scroll animations for 3D objects
export const useScrollSync3D = (
  object: THREE.Object3D | null,
  scrollProgress: MotionValue<number>,
  config: {
    positionRange?: [THREE.Vector3, THREE.Vector3];
    rotationRange?: [THREE.Euler, THREE.Euler];
    scaleRange?: [THREE.Vector3, THREE.Vector3];
    opacityRange?: [number, number];
  }
) => {
  useFrame(() => {
    if (!object || !scrollProgress) return;

    const progress = scrollProgress.get();

    if (config.positionRange) {
      const [start, end] = config.positionRange;
      object.position.lerpVectors(start, end, progress);
    }

    if (config.rotationRange) {
      const [start, end] = config.rotationRange;
      object.rotation.setFromVector3(
        new THREE.Vector3().lerpVectors(
          new THREE.Vector3(start.x, start.y, start.z),
          new THREE.Vector3(end.x, end.y, end.z),
          progress
        )
      );
    }

    if (config.scaleRange) {
      const [start, end] = config.scaleRange;
      object.scale.lerpVectors(start, end, progress);
    }

    if (config.opacityRange && 'material' in object) {
      const [start, end] = config.opacityRange;
      const material = (object as any).material;
      if (material) {
        material.opacity = THREE.MathUtils.lerp(start, end, progress);
        material.transparent = material.opacity < 1;
      }
    }
  });
};

// Particle system animations
export const useParticleAnimation = (
  particleSystem: THREE.Points | null,
  config: {
    count: number;
    speed?: number;
    noiseStrength?: number;
    colorAnimation?: boolean;
  }
) => {
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!particleSystem || !particleSystem.geometry) return;

    timeRef.current += delta;

    const positions = particleSystem.geometry.attributes.position;
    const colors = particleSystem.geometry.attributes.color;

    for (let i = 0; i < config.count; i++) {
      const i3 = i * 3;

      // Animate positions with noise
      if (config.noiseStrength) {
        const noise = Math.sin(timeRef.current * (config.speed || 1) + i * 0.1) * (config.noiseStrength || 0.1);
        positions.setY(i, positions.getY(i) + noise * delta);
      }

      // Animate colors
      if (config.colorAnimation && colors) {
        const hue = (timeRef.current * 0.1 + i * 0.01) % 1;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        colors.setXYZ(i, color.r, color.g, color.b);
      }
    }

    positions.needsUpdate = true;
    if (colors) colors.needsUpdate = true;
  });
};

// Camera orbit animations
export const useCameraOrbit = (
  camera: THREE.Camera | null,
  target: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
  config: {
    radius?: number;
    speed?: number;
    autoRotate?: boolean;
    verticalAngle?: number;
  } = {}
) => {
  const {
    radius = 10,
    speed = 0.5,
    autoRotate = true,
    verticalAngle = 0,
  } = config;

  const angleRef = useRef(0);

  useFrame((_, delta) => {
    if (!camera || !autoRotate) return;

    angleRef.current += delta * speed;

    const x = target.x + radius * Math.cos(angleRef.current);
    const z = target.z + radius * Math.sin(angleRef.current);
    const y = target.y + radius * Math.sin(verticalAngle);

    camera.position.set(x, y, z);
    camera.lookAt(target);
  });

  return {
    setAngle: (angle: number) => {
      angleRef.current = angle;
    },
    getAngle: () => angleRef.current,
  };
};

// Mouse-based 3D interactions
export const useMouse3D = (
  object: THREE.Object3D | null,
  intensity: number = 0.1,
  smooth: boolean = true
) => {
  const mouse = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const targetRotationX = smooth ? useSpring(0, { stiffness: 100, damping: 20 }) : useMotionValue(0);
  const targetRotationY = smooth ? useSpring(0, { stiffness: 100, damping: 20 }) : useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      mouse.set(x);
      mouseY.set(y);

      targetRotationX.set(y * intensity);
      targetRotationY.set(x * intensity);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouse, mouseY, targetRotationX, targetRotationY, intensity]);

  useFrame(() => {
    if (!object) return;

    object.rotation.x = targetRotationX.get();
    object.rotation.y = targetRotationY.get();
  });

  return { mouse, mouseY };
};

// Shader animation utilities
export const createAnimatedShaderMaterial = (
  fragmentShader: string,
  vertexShader: string,
  uniforms: { [key: string]: { value: any } } = {}
) => {
  const timeUniform = { value: 0 };
  const material = new THREE.ShaderMaterial({
    fragmentShader,
    vertexShader,
    uniforms: {
      uTime: timeUniform,
      ...uniforms,
    },
  });

  // Return material and update function
  return {
    material,
    updateTime: (delta: number) => {
      timeUniform.value += delta;
    },
  };
};

// ROKO specific animations
export const rokoAnimations = {
  // Orb pulsing animation
  orbPulse: (orb: THREE.Mesh, intensity: number = 0.1) => {
    return {
      animate: () => {
        useFrame(({ clock }) => {
          const time = clock.getElapsedTime();
          const scale = 1 + Math.sin(time * 2) * intensity;
          orb.scale.setScalar(scale);

          // Glow effect via material
          if (orb.material && 'emissive' in orb.material) {
            const emissiveIntensity = 0.5 + Math.sin(time * 3) * 0.3;
            (orb.material as THREE.MeshStandardMaterial).emissiveIntensity = emissiveIntensity;
          }
        });
      },
    };
  },

  // Network visualization animation
  networkPulse: (lines: THREE.Line[], nodes: THREE.Mesh[], speed: number = 1) => {
    return {
      animate: () => {
        useFrame(({ clock }) => {
          const time = clock.getElapsedTime() * speed;

          lines.forEach((line, index) => {
            if (line.material && 'opacity' in line.material) {
              const opacity = 0.3 + Math.sin(time + index * 0.5) * 0.3;
              (line.material as THREE.Material).opacity = Math.max(0.1, opacity);
            }
          });

          nodes.forEach((node, index) => {
            const scale = 1 + Math.sin(time * 2 + index * 0.3) * 0.2;
            node.scale.setScalar(scale);
          });
        });
      },
    };
  },

  // Data stream effect
  dataStream: (particles: THREE.Points, direction: THREE.Vector3 = new THREE.Vector3(0, 1, 0)) => {
    return {
      animate: () => {
        useFrame((_, delta) => {
          if (!particles.geometry) return;

          const positions = particles.geometry.attributes.position;
          const particleCount = positions.count;

          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Move particles along direction
            positions.setX(i, positions.getX(i) + direction.x * delta);
            positions.setY(i, positions.getY(i) + direction.y * delta);
            positions.setZ(i, positions.getZ(i) + direction.z * delta);

            // Reset particles when they go out of bounds
            if (positions.getY(i) > 10) {
              positions.setY(i, -10);
            }
          }

          positions.needsUpdate = true;
        });
      },
    };
  },
};

export default {
  threeAnimationManager,
  useThreeAnimation,
  useScrollSync3D,
  useParticleAnimation,
  useCameraOrbit,
  useMouse3D,
  createAnimatedShaderMaterial,
  rokoAnimations,
  threeTimingFunctions,
};