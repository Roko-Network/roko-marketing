'use client';

import { FC, useMemo, useRef, useState, Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  CpuChipIcon,
  ArrowTopRightOnSquareIcon,
  BeakerIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
import styles from './FractionalRobots.module.css';

type EggModelProps = { hovered: boolean };

const EggModel: FC<EggModelProps> = ({ hovered }) => {
  // Load GLB from /public/egg.glb
  const { scene } = useGLTF('/assets/egg.glb') as unknown as { scene: THREE.Group };
  const group = useRef<THREE.Group>(null);

  // Clone so we can safely mutate materials/transforms
  const model = useMemo(() => scene.clone(true), [scene]);
  // Center and scale the model to a nice size inside the view (true XYZ pivot)
  useEffect(() => {
    // --- 1) Scale to target ---
    model.updateMatrixWorld(true);
    const preBox = new THREE.Box3().setFromObject(model);
    const preSize = new THREE.Vector3();
    preBox.getSize(preSize);
    const maxDim = Math.max(preSize.x, preSize.y, preSize.z) || 1;
    const targetSize = 1.5; // tune to taste
    const s = targetSize / maxDim;
    model.scale.setScalar(s);

    // --- 2) Recompute bounds and center in *parent* space ---
    model.updateMatrixWorld(true);

    // Inverse of parent world matrix lets us express world boxes in parent space
    const invParent = new THREE.Matrix4();
    if (model.parent) {
      invParent.copy(model.parent.matrixWorld).invert();
    } else {
      invParent.identity();
    }

    // Union mesh geometry AABBs transformed to parent space
    const boxP = new THREE.Box3();
    const tmp = new THREE.Box3();

    model.traverse((o: any) => {
      if (o.isMesh && o.geometry) {
        o.updateWorldMatrix(true, false);
        if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
        tmp.copy(o.geometry.boundingBox!)
          .applyMatrix4(o.matrixWorld)    // geom -> world
          .applyMatrix4(invParent);       // world -> parent
        boxP.union(tmp);
      }
    });

    const centerP = new THREE.Vector3();
    boxP.getCenter(centerP);

    // Shift the model so its parent-space center sits at (0,0,0)
    model.position.sub(centerP);

    // --- 3) Material tweaks (optional) ---
    model.traverse((o: any) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        const m = o.material as THREE.MeshStandardMaterial;
        if (m) {
          if (!m.emissive) m.emissive = new THREE.Color('#fff3d1');
          m.emissiveIntensity = 0.35;
          m.metalness = m.metalness ?? 0.2;
          m.roughness = m.roughness ?? 0.45;
        }
      }
    });
  }, [model]);


  // Cache emissive materials so we can pulse the glow without re-traversing
  const emissiveMats = useMemo(() => {
    const arr: THREE.MeshStandardMaterial[] = [];
    model.traverse((o: any) => {
      if (o.isMesh && o.material && 'emissiveIntensity' in o.material) {
        arr.push(o.material);
      }
    });
    return arr;
  }, [model]);

  // Slow rotation + gentle emissive pulse (hover = a bit brighter/faster)
  useFrame((state, dt) => {
    if (group.current) {
      group.current.rotation.y += dt * 0.35; // slow spin
    }
    const t = state.clock.getElapsedTime();
    const base = hovered ? 0.7 : 0.35;
    const amp = hovered ? 0.35 : 0.2;
    const k = base + amp * (0.5 + 0.5 * Math.sin(t * (hovered ? 2.0 : 1.2)));
    for (const m of emissiveMats) m.emissiveIntensity = k;
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={model} />
    </group>
  );
};

useGLTF.preload('/egg.glb');

export const FractionalRobots: FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [isEggHovered, setIsEggHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  return (
    <section
      ref={ref}
      className={styles.fractionalRobots}
      role="region"
      aria-label="Fractional Robots and The Egg"
    >
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <h2 className={styles.title}>
            <span className={styles.gradientText}>Fractional Robots</span>
            <br />
            <span style={{ color: '#000000' }}>Featuring The Egg</span>
          </h2>
          <p className={styles.subtitle}>
            Meet the revolutionary maker bot creator that's transforming how we build and deploy robotic systems
          </p>
        </motion.div>

        <motion.div
          className={styles.content}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* The Egg Showcase */}
          <motion.div className={styles.eggShowcase} variants={itemVariants}>
            <motion.div
              className={styles.eggVisual}

            >
              <div className={styles.eggContainer}>
                <div
                  className={styles.egg}
                  style={{
                    // ensure the canvas fills; tweak if your CSS already sizes this
                    width: '100%',
                    height: '100%',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                    position: 'relative',
                    background:
                      'radial-gradient(120% 120% at 50% 30%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.05) 40%, rgba(0,0,0,0.0) 60%)'
                  }}
                >
                  {/* Three.js Canvas */}
                  {inView && (
                    <Canvas
                      shadows
                      dpr={[1, 2]}
                      camera={{ position: [0, 0, 2.2], fov: 35 }}
                      gl={{ antialias: true, alpha: true }}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <ambientLight intensity={3} />
                      <spotLight position={[5, 5, 4]} intensity={22} />
                      <spotLight position={[-3, -5, -5]} intensity={10} />
                      <spotLight position={[3, -2, -5]} intensity={10} />
                      <Suspense fallback={null}>
                        <EggModel hovered={isEggHovered} />
                        <OrbitControls
                          enablePan={false}
                          enableZoom={false}
                          autoRotate
                          autoRotateSpeed={isEggHovered ? 1.0 : 0.35}
                        />
                      </Suspense>
                    </Canvas>
                  )}

                  {/* Soft outer CSS glow overlay (keeps your existing vibe) */}
                  <div className={styles.eggGlow} />
                </div>

                {/* Keep particles overlay if you want the same effect */}
                <div className={styles.particles}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={styles.particle} />
                  ))}
                </div>
              </div>
            </motion.div>

            <div className={styles.eggContent}>
              <h3 className={styles.eggTitle}>The Egg</h3>
              <div className={styles.eggBadge}>Experimental Generalized Gateway</div>
              <p className={styles.eggDescription}>
                The Egg is an experimental open source hardware assembly produced in collaboration with 
                fractional robots, a global open source robotics organization. This platform features an AGX Orin, 
                E-Con Systems Imager array, boasting 6 4k CCD's, A re-speaker AEC DOA enabled microphone, and and 
                stereo vibration speakers, as well as a 360 WattHour onboard UPS. This unique form factor enables portability, 
                prominence in human spaces, sparking intrique and ensuring awareness of its capabilities for transparency, and allows for 
                development of an array of interactive applications using the various transducers present.
              </p>

              <div className={styles.eggFeatures}>
                <div className={styles.eggFeature}>
                  <CpuChipIcon className={styles.featureIcon} />
                  <span>High Fidelity Multimodal Input Streams</span>
                </div>
                <div className={styles.eggFeature}>
                  <BeakerIcon className={styles.featureIcon} />
                  <span>275 TOPS of compute for local inference</span>
                </div>
                <div className={styles.eggFeature}>
                  <CommandLineIcon className={styles.featureIcon} />
                  <span>Open Source BOM and Demo Software</span>
                </div>
              </div>

              <a
                href="https://docs.roko.network/in-development/egg"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.learnMoreLink}
              >
                Explore The Egg Documentation
                <ArrowTopRightOnSquareIcon className={styles.linkIcon} />
              </a>
            </div>
          </motion.div>

          {/* Robit Process */}
          <motion.div className={styles.robitProcess} variants={itemVariants}>
            <h3>The Robit Creation Process</h3>
            <p className={styles.processDescription}>
              Watch as The Egg orchestrates the creation of specialized robotic agents,
              each designed with unique capabilities and purposes within the ROKO ecosystem.
            </p>

            <div className={styles.processSteps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <h4>Initialization</h4>
                <p>The Egg analyzes requirements and initializes the creation matrix</p>
              </div>
              <div className={styles.stepConnector} />
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <h4>Configuration</h4>
                <p>Neural pathways and behavioral patterns are configured for the specific task</p>
              </div>
              <div className={styles.stepConnector} />
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <h4>Deployment</h4>
                <p>The new Robit is deployed to the network with full autonomous capabilities</p>
              </div>
            </div>
          </motion.div>

          {/* Fun Facts */}
          <motion.div className={styles.funFacts} variants={itemVariants}>
            <h3>Fun Facts About The Egg</h3>
            <div className={styles.factsGrid}>
              <div className={styles.fact}>
                <div className={styles.factEmoji}>🥚</div>
                <p>The Egg never sleeps - it's creating new Robits 24/7</p>
              </div>
              <div className={styles.fact}>
                <div className={styles.factEmoji}>🤖</div>
                <p>Each Robit inherits unique traits from The Egg's vast knowledge base</p>
              </div>
              <div className={styles.fact}>
                <div className={styles.factEmoji}>🧬</div>
                <p>The Egg evolves its creation patterns based on network feedback</p>
              </div>
              <div className={styles.fact}>
                <div className={styles.factEmoji}>🌟</div>
                <p>Over 1,000 unique Robit configurations have been generated to date</p>
              </div>
            </div>
          </motion.div>

          {/* Interactive Demo */}
          <motion.div className={styles.interactiveSection} variants={itemVariants}>
            <h3>Experience The Magic</h3>
            <p className={styles.interactiveDescription}>
              The Egg represents the future of autonomous system creation - a self-sustaining
              ecosystem where intelligent agents are born, learn, and evolve to meet the
              ever-changing needs of the ROKO Network.
            </p>
            <div className={styles.ctaButtons}>
              <motion.button
                className={styles.primaryButton}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('https://docs.roko.network/in-development/egg', '_blank')}
              >
                Meet The Egg
              </motion.button>
              <motion.button
                className={styles.secondaryButton}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('https://fractionalrobots.com', '_blank')}
              >
                Visit Fractional Robots
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.circuitPattern} />
        <div className={styles.floatingOrbs} />
      </div>
    </section>
  );
};

export default FractionalRobots;
