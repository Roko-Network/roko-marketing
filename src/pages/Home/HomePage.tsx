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

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const HomePage: React.FC = memo(() => {
  // Sections (natural vertical flow)
  const sections = useMemo(
    () => [
      { key: 'hero', node: <Hero /> },
      { key: 'features', node: <Features /> },
      { key: 'technology', node: <Technology /> },
      { key: 'selfient', node: <SelfientPartnership /> },
      { key: 'fractional', node: <FractionalRobots /> },
      { key: 'metrics', node: <Metrics /> },
      { key: 'ecosystem', node: <Ecosystem /> },
      // { key: 'tokenomics', node: <Tokenomics /> },
      // { key: 'governance', node: <GovernanceProposals /> },
    ],
    []
  );

  const [index, setIndex] = useState(0);

  // SCROLL CONTAINER (the only scrollable area for the page content)
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // section refs
  const contentRefs = useRef<HTMLElement[]>([]);
  contentRefs.current = [];
  const setContentRef = useCallback((el: HTMLElement | null, i: number) => {
    if (el) contentRefs.current[i] = el;
  }, []);

  // header height tracking
  const [headerHeight, setHeaderHeight] = React.useState<number>(80);
  React.useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

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

    read();

    let ro: ResizeObserver | null = null;
    if (headerEl && 'ResizeObserver' in window) {
      ro = new ResizeObserver(read);
      ro.observe(headerEl);
    }

    window.addEventListener('resize', read);
    return () => {
      window.removeEventListener('resize', read);
      if (ro && headerEl) ro.unobserve(headerEl);
    };
  }, []);

  // Scene blending (uses current section index)
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

  const sceneParams = sceneParamsByPage[index] ?? sceneParamsByPage[0];

  // Helpers for scroll spy in the container
  const getRelativeTop = (el: HTMLElement, container: HTMLElement) => {
    const elRect = el.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    return elRect.top - cRect.top + container.scrollTop;
  };

  // PURE NATIVE SCROLL — no custom wheel/touch handlers at all.
  // Only a lightweight scroll spy that does NOT preventDefault or throttle input.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const viewportCenter = container.scrollTop + container.clientHeight / 2;

        let bestIdx = 0;
        let bestDist = Number.POSITIVE_INFINITY;

        for (let i = 0; i < sections.length; i++) {
          const el = contentRefs.current[i];
          if (!el) continue;
          const top = getRelativeTop(el, container);
          const center = top + el.offsetHeight / 2;
          const dist = Math.abs(center - viewportCenter);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        }

        if (bestIdx !== index) {
          const fromMode = particleModeBySection[index] ?? 0;
          const toMode = particleModeBySection[bestIdx] ?? 0;
          prevModeRef.current = fromMode;
          startBlend(fromMode, toMode);
          setIndex(bestIdx);
        }
        rafId = null;
      });
    };

    // Initial compute and attach listener to the SCROLL CONTAINER only
    onScroll();
    container.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', onScroll as any);
      window.removeEventListener('resize', onScroll as any);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [sections.length, index, startBlend]);

  // Smooth scroll to section inside container (programmatic only)
  const scrollToIndex = useCallback((i: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const bounded = clamp(i, 0, sections.length - 1);
    const el = contentRefs.current[bounded];
    if (!el) return;

    const top = getRelativeTop(el, container);
    container.scrollTo({ top, behavior: 'smooth' });
  }, [sections.length]);

  // Keyboard jumps (operate on container)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const container = scrollRef.current;
      if (!container) return;

      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        scrollToIndex(index + 1);
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        scrollToIndex(index - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToIndex(sections.length - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, scrollToIndex, sections.length]);

  // Outer container: not scrollable
  const pageStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    minHeight: `calc(100vh - ${headerHeight}px)`,
    background: 'var(--color-calm, #fff)',
  };

  // The ONLY scrollable div that contains all sections
  const scrollContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: `calc(100vh - ${headerHeight}px)`, // REQUIRED: viewport minus header
    overflowY: 'auto',                          // REQUIRED: enable native scrolling
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
    overscrollBehaviorY: 'auto',
    // IMPORTANT: do NOT set CSS `scroll-behavior: smooth` globally,
    // it can feel delayed; we only smooth-scroll programmatically.
    zIndex: 1,
  };

  // Top pagination layout — make the container ignore pointer events so it never eats wheel/scroll;
  // give each bar pointer events so clicks still work.
  const pagerContainerStyle: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    right: 0,
    top: `${headerHeight + 0}px`,
    zIndex: 10,
    padding: '0 0px',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    height: 1,
    pointerEvents: 'none', // ← avoids intercepting scroll
  };

  const pagerItemStyleBase: React.CSSProperties = {
    flex: 1,
    height: 5,
    border: 'none',
    borderRadius: 1,
    padding: 0,
    cursor: 'pointer',
    outline: 'none',
    transition: 'background 200ms ease',
    pointerEvents: 'auto', // ← allow clicks on each bar
  };

  return (
    <div style={pageStyle} aria-live="polite">
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

      {/* SCROLLABLE CONTENT WRAPPER (height = vh - header, overflow: auto) */}
      <div ref={scrollRef} style={scrollContainerStyle}>
        {sections.map((s, i) => (
          <section
            key={s.key}
            ref={(el) => setContentRef(el as HTMLElement, i)}
            aria-label={s.key}
            role="region"
            style={{
              // Natural height; ensure children don't set their own scroll containers
              overflow: 'visible',
              padding: 0,
              margin: 0,
            }}
          >
            {s.node}
          </section>
        ))}
      </div>

      {/* TOP PAGINATION BARS (fixed just below header; click = scrollToIndex) */}
      <div role="tablist" aria-label="Page navigation" style={pagerContainerStyle}>
        {sections.map((s, i) => {
          const isActive = i === index;
          return (
            <div
              key={s.key}
              onClick={() => scrollToIndex(i)}
              aria-selected={isActive}
              aria-label={`Go to ${s.key}`}
              style={{
                ...pagerItemStyleBase,
                background: isActive ? '#00000022' : '#00000011',
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
