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
import Metrics from '../../components/sections/Metrics';
import Scene from '../../components/3d/Scene';

type SceneParams = {
  orbScale?: number;
  orbPosition?: [number, number, number];
  autoRotate?: boolean;
  fieldOpacity?: number;
  rotationSpeed?: number;
};

const TRANSITION_MS = 600;

// ─────────────────────────────────────────────────────────────────────────────
// ORIENTATION TOGGLE
// Set this to true for VERTICAL pagination (default), false for HORIZONTAL.
// You can override this locally in the file as needed.
const PAGINATE_VERTICAL = true;
// ─────────────────────────────────────────────────────────────────────────────

// Pull-to-paginate tuning (fractions of the active axis length)
const PULL_THRESHOLD_FRAC = 0.25;   // 25% of axis to snap
const PULL_MAX_FRAC = 0.35;         // max rubberband pull
const PULL_RELEASE_MS = 200;        // spring-back delay after last wheel/touch

const SCROLLBAR_EPS = 8;            // resize/overflow detection
const EDGE_EPS = 2;                 // runtime top/bottom checks (tighter)

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
    // returns 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip' (modern)
    return window.getComputedStyle(el).overflowY as string;
  } catch {
    return 'visible';
  }
};

/** Strict test: only elements with overflow-y: auto/scroll AND actual overflow count */
const isVertScrollable = (el: HTMLElement) => {
  if (!el) return false;
  const oy = getComputedOverflowY(el);
  if (oy !== 'auto' && oy !== 'scroll') return false; // ignore clip/hidden/visible
  return (el.scrollHeight - el.clientHeight) > EDGE_EPS;
};

const nearestScrollableAncestor = (start: EventTarget | null, stopEl?: HTMLElement | null) => {
  let node: any = start as Node | null;
  while (node && node !== document && node !== document.documentElement) {
    if (stopEl && node === stopEl) break; // don't climb past deck
    if (node instanceof HTMLElement) {
      if (isVertScrollable(node)) return node;
    }
    node = (node as any).parentNode || (node as any).host || null;
  }
  return null;
};

const canElScrollFurther = (el: HTMLElement, dy: number) => {
  if (!el) return false;
  const atTop = el.scrollTop <= EDGE_EPS;
  const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - EDGE_EPS;
  if (dy > 0) return !atBottom; // scrolling down
  if (dy < 0) return !atTop;    // scrolling up
  return false;
};

/** Normalize wheel delta to pixels across deltaMode variants */
const normalizeWheel = (e: WheelEvent) => {
  let px = e.deltaY;
  if (e.deltaMode === 1) px *= 16;                 // lines → px (approx)
  else if (e.deltaMode === 2) px *= window.innerHeight; // pages → px
  return px;
};

/** Only allow deck pull if neighbor page exists in that direction */
const canPullDeck = (dir: 1 | -1, curIndex: number, maxIndex: number) => {
  if (dir > 0) return curIndex < maxIndex; // next
  if (dir < 0) return curIndex > 0;        // prev
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
      { key: 'metrics', node: <Metrics /> },
      { key: 'ecosystem', node: <Ecosystem /> },
      //{ key: 'tokenomics', node: <Tokenomics /> },
      //{ key: 'governance', node: <GovernanceProposals /> },
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

  // Track the active axis size:
  //  - Horizontal mode uses viewport width
  //  - Vertical mode uses container height = (viewport height - headerHeight)
  const [headerHeight, setHeaderHeight] = React.useState<number>(80);
  const axisRef = useRef<number>(
    typeof window !== 'undefined'
      ? (PAGINATE_VERTICAL ? Math.max(0, window.innerHeight - 80) : window.innerWidth)
      : (PAGINATE_VERTICAL ? 720 : 1280)
  );

  useEffect(() => {
    const onRes = () => {
      if (PAGINATE_VERTICAL) {
        axisRef.current = Math.max(0, (window.innerHeight || 0) - headerHeight);
      } else {
        axisRef.current = window.innerWidth || axisRef.current;
      }
    };
    window.addEventListener('resize', onRes);
    onRes(); // initial
    return () => window.removeEventListener('resize', onRes);
  }, [headerHeight]);

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
    const axis = axisRef.current;
    const thresholdPx = axis * PULL_THRESHOLD_FRAC;

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
  // Wheel: let native vertical scroll run; at edge convert to PAGINATION pull
  // (horizontal or vertical depending on orientation).
  // Dynamic gain so ~3–4 detents cross threshold (no “freewheel” needed).
  // ───────────────────────────────────────────────────────────────────────────
  const onWheel = useCallback(
    (e: WheelEvent) => {
      if (animatingRef.current) return;

      const dyNorm = normalizeWheel(e);
      if (dyNorm === 0) return;

      const deckEl = deckRef.current;

      // nearest scrollable under pointer, else active slide
      const scrollEl =
        (nearestScrollableAncestor(e.target, deckEl) as HTMLElement | null) ||
        (slideRefs.current[index] as HTMLElement | null);

      // If vertical can still scroll, let it be native (no preventDefault — smoother)
      if (scrollEl && canElScrollFurther(scrollEl, dyNorm)) {
        if (pullPxRef.current !== 0) {
          setDeckTransitionMs(TRANSITION_MS);
          setPullPx(0);
        }
        return;
      }

      // Edge reached → pull the deck along the active axis
      e.preventDefault();
      setDeckTransitionMs(0);

      const dir: 1 | -1 = dyNorm > 0 ? 1 : -1; // +down = next
      const maxIndex = sections.length - 1;

      // Block pull past ends
      if (!canPullDeck(dir, index, maxIndex)) {
        setDeckTransitionMs(TRANSITION_MS);
        setPullPx(0);
        schedulePullRelease();
        return;
      }

      // Dynamic gain: ~3.5 detents to reach threshold
      const axis = axisRef.current;
      const thresholdPx = axis * PULL_THRESHOLD_FRAC;
      const perDetentTarget = thresholdPx / 3.5;
      const BASE_DETENT_PX = 120; // typical notch in px
      const gain = perDetentTarget / BASE_DETENT_PX;

      const maxPx = axis * PULL_MAX_FRAC;
      const deltaPx = gain * dyNorm; // +down → positive; subtract to move towards next page
      const nextPx = clamp(pullPxRef.current - deltaPx, -maxPx, maxPx);
      setPullPx(nextPx);

      trySnapIfThreshold(dir);
      schedulePullRelease();
    },
    [index, sections.length, doIndexChange]
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Touch: let native vertical scroll run; only start pull at vertical edge.
  // Works for both orientations (we always watch vertical content edges).
  // ───────────────────────────────────────────────────────────────────────────
  const tStartY = useRef<number | null>(null);
  const tPrevY = useRef<number | null>(null);
  const touchActiveRef = useRef(false);

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 1 || animatingRef.current) return;
    tStartY.current = e.touches[0].clientY;
    tPrevY.current = tStartY.current;
    clearPullTimer();
    setDeckTransitionMs(0);
    touchActiveRef.current = true;
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (animatingRef.current || !touchActiveRef.current) return;
    if (tStartY.current == null) return;

    const y = e.touches[0].clientY;
    const prev = tPrevY.current ?? y;
    const dyMove = prev - y; // >0 finger up → scroll down
    tPrevY.current = y;

    // Native vertical first
    const deckEl = deckRef.current;
    const scrollEl =
      (nearestScrollableAncestor(e.target, deckEl) as HTMLElement | null) ||
      (slideRefs.current[index] as HTMLElement | null);

    if (scrollEl && canElScrollFurther(scrollEl, dyMove)) {
      if (pullPxRef.current !== 0) {
        setDeckTransitionMs(TRANSITION_MS);
        setPullPx(0);
      }
      return; // no preventDefault → buttery iOS vertical scroll
    }

    // At vertical edge → pull deck along the active axis
    const dir: 1 | -1 = dyMove > 0 ? 1 : -1;
    const maxIndex = sections.length - 1;

    if (!canPullDeck(dir, index, maxIndex)) {
      setDeckTransitionMs(TRANSITION_MS);
      setPullPx(0);
      return;
    }

    e.preventDefault(); // now we control the deck
    setDeckTransitionMs(0);

    const axis = axisRef.current;
    const maxPx = axis * PULL_MAX_FRAC;

    const nextPx = clamp(pullPxRef.current - dyMove, -maxPx, maxPx);
    setPullPx(nextPx);

    trySnapIfThreshold(dir);
  }, [index, sections.length]);

  const onTouchEnd = useCallback(() => {
    tStartY.current = null;
    tPrevY.current = null;

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

  // Measure and watch the real header height (handles responsive & dynamic changes)
  React.useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Try a few common selectors; tweak to match your Header if needed
    const selectors = ['#site-header', 'header[role="banner"]', '.site-header', 'header'];
    let headerEl: HTMLElement | null = null;
    for (const sel of selectors) {
      const el = document.querySelector<HTMLElement>(sel);
      if (el) { headerEl = el; break; }
    }

    const read = () => {
      const h = headerEl?.getBoundingClientRect().height ?? 0;
      setHeaderHeight(Math.round(h));
    };

    // Initial read
    read();

    // Watch for size changes
    let ro: ResizeObserver | null = null;
    if (headerEl && 'ResizeObserver' in window) {
      ro = new ResizeObserver(read);
      ro.observe(headerEl);
    }

    // Also update on viewport resize (layout shifts)
    window.addEventListener('resize', read);

    return () => {
      window.removeEventListener('resize', read);
      if (ro && headerEl) ro.unobserve(headerEl);
    };
  }, []);

  // Styles
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: `calc(100vh - ${headerHeight}px)`,
    overflow: 'hidden',
    background: 'var(--color-calm, #fff)',
    touchAction: 'pan-y', // let vertical pans be native; we intercept only at edges
  };

  const sceneParams = sceneParamsByPage[index] ?? sceneParamsByPage[0];

  // Compose transform: base index translate + pull (px)
  const deckTransform = PAGINATE_VERTICAL
    // Move by container height (100vh - headerHeight) per page
    ? `translate3d(0, calc(${ -index } * (100vh - ${headerHeight}px) + ${pullPx}px), 0)`
    : `translate3d(calc(${ -index * 100 }vw + ${pullPx}px), 0, 0)`;

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

      {/* FULL-PAGE SLIDES: direction depends on PAGINATE_VERTICAL */}
      <div
        ref={deckRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          transform: deckTransform,
          transition: `transform ${deckTransitionMs}ms cubic-bezier(.2,.8,.2,1)`,
          display: 'flex',
          flexDirection: PAGINATE_VERTICAL ? 'column' : 'row',
          width: PAGINATE_VERTICAL ? '100%' : `${sections.length * 100}vw`,
          // For vertical mode, stack N slides tall relative to container height
          height: PAGINATE_VERTICAL ? `${sections.length * 100}%` : '100%',
          willChange: 'transform',
          overscrollBehavior: 'contain',
        }}
      >
        {sections.map((s, i) => {
          const isActive = i === index;
          const offset = isActive ? 0 : (i > index ? 15 : -15);
          const slideTransform = PAGINATE_VERTICAL
            ? `translateY(${offset}px)`
            : `translateX(${offset}px)`;

          return (
            <div
              key={s.key}
              ref={(el) => setSlideRef(el, i)}
              style={{
                width: PAGINATE_VERTICAL ? '100%' : '100vw',
                height: '100%',
                overflow: 'auto',
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch', // iOS momentum on slides
                boxSizing: 'border-box',
                transform: slideTransform,
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

      {/* Top pagination bars (1px below header) */}
      <div
        role="tablist"
        aria-label="Page navigation"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          top: `${headerHeight + 0}px`,
          zIndex: 10,
          padding: '0 0px',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pointerEvents: 'auto',
          height: 1,
        }}
      >
        {sections.map((s, i) => {
          const isActive = i === index;
          return (
            <div
              key={s.key}
              onClick={() => {
                setDeckTransitionMs(TRANSITION_MS);
                setPullPx(0);
                doIndexChange(i);
              }}
              aria-selected={isActive}
              aria-label={`Go to ${s.key}`}
              style={{
                flex: 1,
                height: 5,
                background: isActive ? '#00000022' : '#00000011',
                border: 'none',
                borderRadius: 1,
                padding: 0,
                cursor: 'pointer',
                outline: 'none',
                transition: 'background 200ms ease',
              }}
            />
          );
        })}
      </div>
    </div>
  );
});

HomePage.displayName = 'HomePage';
export default HomePage;
