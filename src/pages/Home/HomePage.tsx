// src/pages/Home/HomePage.tsx
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Hero from '../../components/sections/Hero';
import Features from '../../components/sections/Features';
import Technology from '../../components/sections/Technology';
import SelfientPartnership from '../../components/sections/SelfientPartnership';
import FractionalRobots from '../../components/sections/FractionalRobots';
import Tokenomics from '../../components/sections/Tokenomics';
import GovernanceProposals from '../../components/GovernanceProposals/GovernanceProposals';
import Ecosystem from '../../components/sections/Ecosystem';
import Scene from '../../components/3d/Scene';

type SceneParams = {
  orbScale?: number;
  orbPosition?: [number, number, number];
  autoRotate?: boolean;
  fieldOpacity?: number;
  rotationSpeed?: number;
};

const TRANSITION_MS = 600;
const EDGE_ARM_GAP_MS = 240;   // pause after first edge contact before allowing paginate
const SCROLLBAR_EPS = 8;       // content must exceed parent by this to be considered scrollable

// Map each visible section to a particle "mode":
// 0=header (torus), 1=slider (tunnel/sparks), 2=dao (ring/chords), 3=docs (hex lattice), 4=bottom (cloud)
const particleModeBySection: number[] = [
  0, // Hero → header
  1, // Features → slider
  2, // Technology → dao
  3, // Selfient → docs
  1, // Fractional Robots → slider (cool sparks)
  2, // Tokenomics → dao (chords accent)
  3, // Governance → docs
  4, // Ecosystem → bottom ambient
];

const sceneParamsByPage: SceneParams[] = [
  { orbScale: 1.2, orbPosition: [ 2, 0, 0], autoRotate: true,  fieldOpacity: 0.40, rotationSpeed: 0.3 }, // Hero
  { orbScale: 1.0, orbPosition: [ 0, 0, 0], autoRotate: false, fieldOpacity: 0.35, rotationSpeed: 0.0 }, // Features
  { orbScale: 1.4, orbPosition: [-1, 0, 0], autoRotate: true,  fieldOpacity: 0.45, rotationSpeed: 0.4 }, // Technology
  { orbScale: 0.9, orbPosition: [ 0,-0.5,0], autoRotate: false, fieldOpacity: 0.30, rotationSpeed: 0.0 }, // Selfient
  { orbScale: 1.3, orbPosition: [ 1, 0.2,0], autoRotate: true,  fieldOpacity: 0.50, rotationSpeed: 0.6 }, // Fractional Robots
  { orbScale: 1.1, orbPosition: [ 0, 0, 0], autoRotate: false, fieldOpacity: 0.35, rotationSpeed: 0.0 }, // Tokenomics
  { orbScale: 1.0, orbPosition: [ 0, 0, 0], autoRotate: true,  fieldOpacity: 0.25, rotationSpeed: 0.2 }, // Governance
  { orbScale: 1.2, orbPosition: [ 0, 0, 0], autoRotate: true,  fieldOpacity: 0.40, rotationSpeed: 0.3 }, // Ecosystem
];

const oneHot = (mode: number): number[] => {
  const w = [0, 0, 0, 0, 0];
  const i = Math.max(0, Math.min(4, mode | 0));
  w[i] = 1;
  return w;
};

const lerpWeights = (a: number[], b: number[], t: number): number[] =>
  a.map((av, i) => av * (1 - t) + (b[i] ?? 0) * t);

const HomePage: React.FC = memo(() => {
  // Sections content
  const sections = useMemo(
    () => [
      { key: 'hero', node: <Hero /> },
      { key: 'features', node: <Features /> },
      { key: 'technology', node: <Technology /> },
      { key: 'selfient', node: <SelfientPartnership /> },
      { key: 'fractional', node: <FractionalRobots /> },
      { key: 'tokenomics', node: <Tokenomics /> },
      { key: 'governance', node: <GovernanceProposals /> },
      { key: 'ecosystem', node: <Ecosystem /> },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const animatingRef = useRef(false);

  // Scroll containers (slides) we monitor for scrollability/overflow
  const slideRefs = useRef<HTMLDivElement[]>([]);
  slideRefs.current = [];

  // Content elements for measuring overflow
  const contentRefs = useRef<HTMLElement[]>([]);
  contentRefs.current = [];

  const setSlideRef = useCallback((el: HTMLDivElement | null, i: number) => {
    if (el) slideRefs.current[i] = el;
  }, []);
  const setContentRef = useCallback((el: HTMLElement | null, i: number) => {
    if (el) contentRefs.current[i] = el;
  }, []);

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  // ── Particle weights blending control for Scene ─────────────────────────────
  const blendRAF = useRef<number | null>(null);
  const blendStart = useRef<number>(0);
  const prevModeRef = useRef<number>(particleModeBySection[0] ?? 0);
  const [sceneWeights, setSceneWeights] = useState<number[]>(oneHot(prevModeRef.current));

  const startBlend = useCallback((fromMode: number, toMode: number) => {
    if (blendRAF.current != null) {
      cancelAnimationFrame(blendRAF.current);
      blendRAF.current = null;
    }
    const A = oneHot(fromMode);
    const B = oneHot(toMode);
    blendStart.current = performance.now();

    const step = () => {
      const t = Math.min(1, (performance.now() - blendStart.current) / TRANSITION_MS);
      setSceneWeights(lerpWeights(A, B, t));
      if (t < 1) {
        blendRAF.current = requestAnimationFrame(step);
      } else {
        blendRAF.current = null;
      }
    };
    step();
  }, []);

  useEffect(() => {
    return () => {
      if (blendRAF.current != null) cancelAnimationFrame(blendRAF.current);
    };
  }, []);

  const jump = useCallback(
    (next: number) => {
      if (animatingRef.current) return;
      const bounded = clamp(next, 0, sections.length - 1);
      if (bounded === index) return;

      animatingRef.current = true;

      // trigger particle form blend based on section→mode mapping
      const fromMode = particleModeBySection[index] ?? 0;
      const toMode = particleModeBySection[bounded] ?? 0;
      prevModeRef.current = fromMode;
      startBlend(fromMode, toMode);

      setIndex(bounded);
      resetEdgeLatch();

      window.setTimeout(() => {
        animatingRef.current = false;
      }, TRANSITION_MS);
    },
    [index, sections.length, startBlend]
  );

  // ── Overflow detection ──────────────────────────────────────────────────────
  const [isOverflowing, setIsOverflowing] = useState<boolean[]>(() => sections.map(() => false));

  useEffect(() => {
    const observers: ResizeObserver[] = [];
    sections.forEach((_, i) => {
      const slide = slideRefs.current[i];
      const content = contentRefs.current[i];
      if (!slide || !content) return;

      const ro = new ResizeObserver(() => {
        const parentH = slide.clientHeight || 0;     // 100vh
        const contentH = content.scrollHeight || 0;  // actual content height
        const overflow = contentH - parentH > SCROLLBAR_EPS;
        setIsOverflowing(prev => {
          const next = prev.slice();
          next[i] = overflow;
          return next;
        });
      });

      ro.observe(content);
      ro.observe(slide);
      observers.push(ro);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [sections.length]);

  const canScrollFurther = (el: HTMLElement, dy: number) => {
    if (!el) return false;
    const atTop = el.scrollTop <= 0;
    const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;
    if (dy > 0) return !atBottom; // scrolling down
    if (dy < 0) return !atTop;    // scrolling up
    return false;
  };

  // ── Edge buffer / dual-threshold latch ──────────────────────────────────────
  const edgeArmedRef = useRef(false);
  const edgeReadyRef = useRef(false);
  const edgeDirRef = useRef<1 | -1 | 0>(0);
  const edgeTimerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (edgeTimerRef.current != null) {
      window.clearTimeout(edgeTimerRef.current);
      edgeTimerRef.current = null;
    }
  };
  const resetEdgeLatch = () => {
    edgeArmedRef.current = false;
    edgeReadyRef.current = false;
    edgeDirRef.current = 0;
    clearTimer();
  };
  const armOrExtendEdge = (dir: 1 | -1) => {
    if (!edgeArmedRef.current || edgeDirRef.current !== dir) {
      edgeArmedRef.current = true;
      edgeReadyRef.current = false;
      edgeDirRef.current = dir;
    }
    clearTimer();
    edgeTimerRef.current = window.setTimeout(() => {
      edgeReadyRef.current = true; // user “let up”
      edgeTimerRef.current = null;
    }, EDGE_ARM_GAP_MS);
  };
  const tryPaginateWithEdge = (dir: 1 | -1, perform: () => void) => {
    if (!edgeArmedRef.current) {
      armOrExtendEdge(dir);           // first edge contact → arm
      return false;
    }
    if (edgeDirRef.current !== dir) {
      armOrExtendEdge(dir);           // changed direction → re-arm
      return false;
    }
    if (!edgeReadyRef.current) {
      armOrExtendEdge(dir);           // continuous scroll → wait
      return false;
    }
    perform();                        // armed + ready + same direction → go
    resetEdgeLatch();
    return true;
  };

  // ── Wheel (mouse) ───────────────────────────────────────────────────────────
  const onWheel = useCallback(
    (e: WheelEvent) => {
      const el = slideRefs.current[index];
      if (!el) return;

      const dy = e.deltaY;
      if (dy === 0) return;

      if (isOverflowing[index] && canScrollFurther(el, dy)) {
        resetEdgeLatch(); // still scrolling inside
        return;
      }

      e.preventDefault();
      const dir: 1 | -1 = dy > 0 ? 1 : -1;

      if (!isOverflowing[index]) {
        dir === 1 ? jump(index + 1) : jump(index - 1); // single threshold
        return;
      }

      tryPaginateWithEdge(dir, () => {
        dir === 1 ? jump(index + 1) : jump(index - 1);
      });
    },
    [index, jump, isOverflowing]
  );

  // ── Touch (swipe) ───────────────────────────────────────────────────────────
  const tStartY = useRef<number | null>(null);
  const tStartT = useRef<number>(0);

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    tStartY.current = e.touches[0].clientY;
    tStartT.current = Date.now();
  }, []);

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      const startY = tStartY.current;
      tStartY.current = null;
      if (startY == null) return;

      const endY = (e.changedTouches && e.changedTouches[0]?.clientY) ?? startY;
      const delta = startY - endY; // >0 = swipe up (scroll down)
      const elapsed = Date.now() - tStartT.current;

      if (Math.abs(delta) <= 40 || elapsed >= 800) return;

      const el = slideRefs.current[index];
      if (!el) return;

      const dir: 1 | -1 = delta > 0 ? 1 : -1;

      if (isOverflowing[index] && canScrollFurther(el, dir)) {
        resetEdgeLatch();
        return;
      }

      if (!isOverflowing[index]) {
        dir === 1 ? jump(index + 1) : jump(index - 1);
        return;
      }

      tryPaginateWithEdge(dir, () => {
        dir === 1 ? jump(index + 1) : jump(index - 1);
      });
    },
    [index, jump, isOverflowing]
  );

  // ── Keyboard (immediate at edges) ───────────────────────────────────────────
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (animatingRef.current) return;
      const el = slideRefs.current[index];
      if (!el) return;

      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        if (isOverflowing[index] && canScrollFurther(el, +1)) {
          resetEdgeLatch();
          return;
        }
        e.preventDefault();
        jump(index + 1);
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        if (isOverflowing[index] && canScrollFurther(el, -1)) {
          resetEdgeLatch();
          return;
        }
        e.preventDefault();
        jump(index - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        jump(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        jump(sections.length - 1);
      }
    },
    [index, jump, sections.length, isOverflowing]
  );

  useEffect(() => {
    const passiveFalse: AddEventListenerOptions = { passive: false };
    window.addEventListener('wheel', onWheel, passiveFalse);
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel, false);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart as EventListener);
      window.removeEventListener('touchend', onTouchEnd as EventListener);
    };
  }, [onWheel, onKey, onTouchStart, onTouchEnd]);

  // viewport locked to 100vh
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: 'var(--page-bg, #fff)',
  };

  const sceneParams = sceneParamsByPage[index] ?? sceneParamsByPage[0];

  return (
    <div style={containerStyle} aria-live="polite">
      {/* PERSISTENT BACKGROUND SCENE */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Scene
          className="w-full h-full sceneData"
          enableControls={false}
          autoRotate={sceneParams.autoRotate ?? true}
          params={{
            ...sceneParams,
            // drive the particle shapes with our blended weights across all sections
            pageWeights: sceneWeights,
          }}
        />
      </div>

      {/* HORIZONTAL RAIL OF FULL-PAGE SLIDES */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          transform: `translateX(${-index * 100}vw)`,
          transition: `transform ${TRANSITION_MS}ms cubic-bezier(.2,.8,.2,1)`,
          display: 'flex',
          flexDirection: 'row',
          width: `${sections.length * 100}vw`,
          height: '100vh',
          willChange: 'transform',
        }}
      >
        {sections.map((s, i) => {
          const isActive = i === index;
          const offset = isActive ? 0 : (i > index ? 15 : -15);
          return (
            <div
              key={s.key}
              ref={(el) => setSlideRef(el, i)}
              style={{
                width: '100vw',
                height: '100vh',
                overflow: 'auto',
                overscrollBehavior: 'contain',
                boxSizing: 'border-box',
                transform: `translateX(${offset}px)`,
                transition: `transform ${TRANSITION_MS}ms cubic-bezier(.2,.8,.2,1)`,
                background: 'transparent', // let scene show through
              }}
            >
              {/* Parent div to monitor scrollability — NO nested min-height wrapper */}
              <section
                ref={(el) => setContentRef(el as HTMLElement, i)}
                aria-label={s.key}
                role="region"
                style={{ height: 'auto' }}
              >
                {s.node}
              </section>
            </div>
          );
        })}
      </div>

      {/* Pagination dots */}
      <div
        style={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        {sections.map((_, i) => (
          <div
            key={i}
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: i === index ? 'black' : 'rgba(0,0,0,0.25)',
              opacity: 0.9,
            }}
          />
        ))}
      </div>
    </div>
  );
});

HomePage.displayName = 'HomePage';
export default HomePage;
