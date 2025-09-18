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

// Pull-to-paginate tuning
const PULL_THRESHOLD_FRAC = 0.25;   // 25% of viewport width to snap
const PULL_MAX_FRAC = 0.35;         // max rubberband pull
const PULL_RELEASE_MS = 200;        // spring-back delay after last wheel tick
const WHEEL_PULL_SCALE = 0.85;      // dampen wheel delta applied to pull

const SCROLLBAR_EPS = 8;            // for overflow detection (resize observer)
const EDGE_EPS = 2;                 // for runtime top/bottom checks (tighter)

// Map each visible section to a particle "mode":
// 0=header, 1=slider, 2=dao, 3=docs, 4=bottom
const particleModeBySection: number[] = [
  0, // Hero
  1, // Features
  2, // Technology
  3, // Selfient
  1, // Fractional Robots
  2, // Tokenomics
  3, // Governance
  4, // Ecosystem
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

// ─────────────────────────────────────────────────────────────────────────────
// Scroll helpers
// ─────────────────────────────────────────────────────────────────────────────
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const getComputedOverflowY = (el: Element) => {
  try {
    return window.getComputedStyle(el).overflowY;
  } catch {
    return 'visible';
  }
};

const isVertScrollable = (el: HTMLElement) => {
  if (!el) return false;
  const overflowY = getComputedOverflowY(el);
  const tall = (el.scrollHeight - el.clientHeight) > EDGE_EPS;
  return tall || overflowY === 'auto' || overflowY === 'scroll';
};

const nearestScrollableAncestor = (start: EventTarget | null, stopEl?: HTMLElement | null) => {
  let node: any = start as Node | null;
  while (node && node !== document && node !== document.documentElement) {
    if (stopEl && node === stopEl) break;
    if (node instanceof HTMLElement) {
      if (isVertScrollable(node)) return node;
    }
    node = (node as any).parentNode || (node as any).host || null;
  }
  return null;
};

/** Apply some of `deltaY` to the scroll element; return the leftover (unapplied) delta */
const applyScrollAndReturnLeftover = (el: HTMLElement, deltaY: number): number => {
  if (!el || deltaY === 0) return deltaY;

  if (deltaY > 0) {
    // scrolling down → limit by remaining space to bottom
    const room = Math.max(0, el.scrollHeight - el.clientHeight - el.scrollTop);
    const applied = Math.min(room, deltaY);
    if (applied) el.scrollTop += applied;
    return deltaY - applied;
  } else {
    // scrolling up → limit by distance to top
    const room = Math.max(0, el.scrollTop);
    const applied = Math.min(room, Math.abs(deltaY));
    if (applied) el.scrollTop -= applied;
    return deltaY + applied; // deltaY is negative; add applied (positive) back
  }
};

/** Only allow horizontal pull if there is actually a neighbor page in that direction */
const canPullDeck = (dir: 1 | -1, curIndex: number, maxIndex: number) => {
  if (dir > 0) return curIndex < maxIndex; // trying to pull left (next)
  if (dir < 0) return curIndex > 0;        // trying to pull right (prev)
  return false;
};

const HomePage: React.FC = memo(() => {
  // Sections
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

  // Refs for deck/slides/content
  const deckRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<HTMLDivElement[]>([]);
  slideRefs.current = [];
  const contentRefs = useRef<HTMLElement[]>([]);
  contentRefs.current = [];

  const setSlideRef = useCallback((el: HTMLDivElement | null, i: number) => {
    if (el) slideRefs.current[i] = el;
  }, []);
  const setContentRef = useCallback((el: HTMLElement | null, i: number) => {
    if (el) contentRefs.current[i] = el;
  }, []);

  // Viewport width
  const vwRef = useRef<number>(typeof window !== 'undefined' ? window.innerWidth : 1280);
  useEffect(() => {
    const onRes = () => { vwRef.current = window.innerWidth || vwRef.current; };
    window.addEventListener('resize', onRes);
    return () => window.removeEventListener('resize', onRes);
  }, []);

  // Particle weights → Scene
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

  const doIndexChange = useCallback((next: number) => {
    const bounded = clamp(next, 0, sections.length - 1);
    if (bounded === index) return;

    animatingRef.current = true;

    const fromMode = particleModeBySection[index] ?? 0;
    const toMode = particleModeBySection[bounded] ?? 0;
    prevModeRef.current = fromMode;
    startBlend(fromMode, toMode);

    setIndex(bounded);

    window.setTimeout(() => {
      animatingRef.current = false;
    }, TRANSITION_MS);
  }, [index, sections.length, startBlend]);

  // Overflow detection (slide-level)
  const [isOverflowing, setIsOverflowing] = useState<boolean[]>(() => sections.map(() => false));

  useEffect(() => {
    const observers: ResizeObserver[] = [];
    sections.forEach((_, i) => {
      const slide = slideRefs.current[i];
      const content = contentRefs.current[i];
      if (!slide || !content) return;

      const ro = new ResizeObserver(() => {
        const parentH = slide.clientHeight || 0;
        const contentH = content.scrollHeight || 0;
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

  // Pull-to-paginate state
  const [deckTransitionMs, setDeckTransitionMs] = useState<number>(0);
  const [pullPx, _setPullPx] = useState<number>(0);
  const pullPxRef = useRef(0);
  const pullTimerRef = useRef<number | null>(null);

  const setPullPx = (v: number) => {
    pullPxRef.current = v;
    _setPullPx(v);
  };

  const clearPullTimer = () => {
    if (pullTimerRef.current != null) {
      window.clearTimeout(pullTimerRef.current);
      pullTimerRef.current = null;
    }
  };

  const schedulePullRelease = () => {
    clearPullTimer();
    pullTimerRef.current = window.setTimeout(() => {
      setDeckTransitionMs(TRANSITION_MS);
      setPullPx(0);
      pullTimerRef.current = null;
    }, PULL_RELEASE_MS);
  };

  const trySnapIfThreshold = (dir: 1 | -1) => {
    const vw = vwRef.current;
    const thresholdPx = vw * PULL_THRESHOLD_FRAC;

    if (Math.abs(pullPxRef.current) >= thresholdPx) {
      const target = dir > 0 ? index + 1 : index - 1;
      if (target < 0 || target > sections.length - 1) {
        setDeckTransitionMs(TRANSITION_MS);
        setPullPx(0);
        return;
      }
      setDeckTransitionMs(TRANSITION_MS);
      setPullPx(0);
      doIndexChange(target);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Wheel: delta-splitting (scroll nearest scrollable; leftover → horizontal pull)
  // ───────────────────────────────────────────────────────────────────────────
  const onWheel = useCallback(
    (e: WheelEvent) => {
      if (animatingRef.current) return;

      const dy = e.deltaY;
      if (dy === 0) return;

      const deckEl = deckRef.current;

      // Pick the scrollable under the pointer; fall back to the active slide
      const scrollEl =
        (nearestScrollableAncestor(e.target, deckEl) as HTMLElement | null) ||
        (slideRefs.current[index] as HTMLElement | null);

      // We handle the scroll ourselves to compute "leftover" precisely
      e.preventDefault();
      setDeckTransitionMs(0);

      let leftover = dy;
      if (scrollEl) {
        leftover = applyScrollAndReturnLeftover(scrollEl, dy);
      }

      if (leftover !== 0) {
        // Direction based on leftover after vertical consumption
        const dir: 1 | -1 = leftover > 0 ? 1 : -1;
        const maxIndex = sections.length - 1;

        // *** Block horizontal pull if no neighbor in that direction ***
        if (!canPullDeck(dir, index, maxIndex)) {
          // ensure any partial pull returns to rest
          setDeckTransitionMs(TRANSITION_MS);
          setPullPx(0);
          schedulePullRelease();
          return;
        }

        // Convert leftover into horizontal pull
        const vw = vwRef.current;
        const maxPx = vw * PULL_MAX_FRAC;
        const deltaPx = WHEEL_PULL_SCALE * leftover; // +down → left pull (negative px via subtraction below)
        const nextPx = clamp(pullPxRef.current - deltaPx, -maxPx, maxPx);
        setPullPx(nextPx);
        trySnapIfThreshold(dir);
      }

      schedulePullRelease();
    },
    [index, sections.length, doIndexChange]
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Touch: gesture-scoped delta-splitting (we take control for the gesture)
  // ───────────────────────────────────────────────────────────────────────────
  const tStartY = useRef<number | null>(null);
  const tPrevY = useRef<number | null>(null);
  const activeScrollElRef = useRef<HTMLElement | null>(null);
  const touchActiveRef = useRef(false);

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 1 || animatingRef.current) return;

    const deckEl = deckRef.current;
    activeScrollElRef.current = (nearestScrollableAncestor(e.target, deckEl) as HTMLElement | null)
      || (slideRefs.current[index] as HTMLElement | null);

    tStartY.current = e.touches[0].clientY;
    tPrevY.current = tStartY.current;
    clearPullTimer();
    setDeckTransitionMs(0);
    touchActiveRef.current = true;
  }, [index]);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (animatingRef.current || !touchActiveRef.current) return;
    if (tStartY.current == null) return;

    const y = e.touches[0].clientY;
    const prev = tPrevY.current ?? y;
    const dyMove = prev - y; // >0 finger up → scroll down
    tPrevY.current = y;

    // We handle the scroll + pull split ourselves
    e.preventDefault();
    setDeckTransitionMs(0);

    let leftover = dyMove;
    const scrollEl = activeScrollElRef.current;
    if (scrollEl) {
      leftover = applyScrollAndReturnLeftover(scrollEl, dyMove);
    }

    if (leftover !== 0) {
      const dir: 1 | -1 = leftover > 0 ? 1 : -1;
      const maxIndex = sections.length - 1;

      // *** Block horizontal pull if no neighbor in that direction ***
      if (!canPullDeck(dir, index, maxIndex)) {
        setDeckTransitionMs(TRANSITION_MS);
        setPullPx(0);
        return;
      }

      // Map leftover to horizontal pull
      const vw = vwRef.current;
      const maxPx = vw * PULL_MAX_FRAC;
      const nextPx = clamp(pullPxRef.current - leftover, -maxPx, maxPx);
      setPullPx(nextPx);

      trySnapIfThreshold(dir);
    }
  }, [index, sections.length]);

  const onTouchEnd = useCallback(() => {
    tStartY.current = null;
    tPrevY.current = null;
    activeScrollElRef.current = null;

    if (!touchActiveRef.current) return;
    touchActiveRef.current = false;

    setDeckTransitionMs(TRANSITION_MS);
    setPullPx(0);
  }, []);

  // Keyboard (immediate)
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (animatingRef.current) return;

      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        setDeckTransitionMs(TRANSITION_MS);
        setPullPx(0);
        doIndexChange(index + 1);
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        setDeckTransitionMs(TRANSITION_MS);
        setPullPx(0);
        doIndexChange(index - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setDeckTransitionMs(TRANSITION_MS);
        setPullPx(0);
        doIndexChange(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setDeckTransitionMs(TRANSITION_MS);
        setPullPx(0);
        doIndexChange(sections.length - 1);
      }
    },
    [index, doIndexChange, sections.length]
  );

  useEffect(() => {
    const passiveFalse: AddEventListenerOptions = { passive: false };
    window.addEventListener('wheel', onWheel, passiveFalse);
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel as any, false as any);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart as EventListener);
      window.removeEventListener('touchmove', onTouchMove as EventListener);
      window.removeEventListener('touchend', onTouchEnd as EventListener);
    };
  }, [onWheel, onKey, onTouchStart, onTouchMove, onTouchEnd]);

  // Styles
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: 'var(--color-calm, #fff)',
    touchAction: 'pan-y', // allow vertical pans; we intercept during gesture
  };

  const sceneParams = sceneParamsByPage[index] ?? sceneParamsByPage[0];

  // Compose transform: base index translate + pull (px)
  const deckTransform = `translate3d(calc(${-index * 100}vw + ${pullPx}px), 0, 0)`;

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
            pageWeights: sceneWeights,
          }}
        />
      </div>

      {/* HORIZONTAL RAIL OF FULL-PAGE SLIDES (with delta-splitting pull) */}
      <div
        ref={deckRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          transform: deckTransform,
          transition: `transform ${deckTransitionMs}ms cubic-bezier(.2,.8,.2,1)`,
          display: 'flex',
          flexDirection: 'row',
          width: `${sections.length * 100}vw`,
          height: '100vh',
          willChange: 'transform',
          overscrollBehavior: 'contain',
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
                background: 'transparent',
              }}
            >
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
