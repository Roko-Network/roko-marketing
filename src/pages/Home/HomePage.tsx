// src/components/pages/Home/HomePage.tsx
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Hero from '../../components/sections/Hero';
import Features from '../../components/sections/Features';
import Technology from '../../components/sections/Technology';
import SelfientPartnership from '../../components/sections/SelfientPartnership';
import FractionalRobots from '../../components/sections/FractionalRobots';
import Tokenomics from '../../components/sections/Tokenomics';
import GovernanceProposals from '../../components/GovernanceProposals/GovernanceProposals';
import Ecosystem from '../../components/sections/Ecosystem';

/**
 * Behavior
 * - Each child section is full-viewport (100vw x 100vh) with its own overflow (overflow:auto).
 * - Natural scrolling inside the active section until its top/bottom is reached.
 * - Scrolling past the edge triggers a page slide to next/prev section (right→left on down).
 */

const TRANSITION_MS = 600;

const HomePage: React.FC = memo(() => {
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

  const sectionRefs = useRef<HTMLDivElement[]>([]);
  sectionRefs.current = [];

  const setRef = useCallback((el: HTMLDivElement | null, i: number) => {
    if (el) sectionRefs.current[i] = el;
  }, []);

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  const jump = useCallback(
    (next: number) => {
      if (animatingRef.current) return;
      const bounded = clamp(next, 0, sections.length - 1);
      if (bounded === index) return;

      animatingRef.current = true;
      setIndex(bounded);

      window.setTimeout(() => {
        animatingRef.current = false;
      }, TRANSITION_MS);
    },
    [index, sections.length]
  );

  const canScrollFurther = (el: HTMLElement, dy: number) => {
    if (!el) return false;
    const atTop = el.scrollTop <= 0;
    const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;
    if (dy > 0) return !atBottom; // scrolling down
    if (dy < 0) return !atTop;    // scrolling up
    return false;
  };

  // Wheel
  const onWheel = useCallback(
    (e: WheelEvent) => {
      const activeEl = sectionRefs.current[index];
      if (!activeEl) return;

      const dy = e.deltaY;
      if (canScrollFurther(activeEl, dy)) return;

      e.preventDefault();
      if (dy > 0) jump(index + 1);
      else if (dy < 0) jump(index - 1);
    },
    [index, jump]
  );

  // Touch
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  }, []);

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      const startY = touchStartY.current;
      touchStartY.current = null;
      if (startY == null) return;

      const endY = (e.changedTouches && e.changedTouches[0]?.clientY) ?? startY;
      const delta = startY - endY; // >0 means swipe up (scroll down)
      const elapsed = Date.now() - touchStartTime.current;

      const abs = Math.abs(delta);
      if (abs > 40 && elapsed < 800) {
        const activeEl = sectionRefs.current[index];
        if (!activeEl) return;
        if (delta > 0) {
          if (!canScrollFurther(activeEl, +1)) jump(index + 1);
        } else {
          if (!canScrollFurther(activeEl, -1)) jump(index - 1);
        }
      }
    },
    [index, jump]
  );

  // Keyboard
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (animatingRef.current) return;
      const activeEl = sectionRefs.current[index];
      if (!activeEl) return;

      const key = e.key;
      if (['ArrowDown', 'PageDown', ' '].includes(key)) {
        if (canScrollFurther(activeEl, +1)) return;
        e.preventDefault();
        jump(index + 1);
      } else if (['ArrowUp', 'PageUp'].includes(key)) {
        if (canScrollFurther(activeEl, -1)) return;
        e.preventDefault();
        jump(index - 1);
      } else if (key === 'Home') {
        e.preventDefault();
        jump(0);
      } else if (key === 'End') {
        e.preventDefault();
        jump(sections.length - 1);
      }
    },
    [index, jump, sections.length]
  );

  useEffect(() => {
    const passiveFalse: AddEventListenerOptions = { passive: false };

    window.addEventListener('wheel', onWheel, passiveFalse);
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      // For removeEventListener, only the capture flag matters; use `false` for clarity.
      window.removeEventListener('wheel', onWheel, false);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart as EventListener);
      window.removeEventListener('touchend', onTouchEnd as EventListener);
    };
  }, [onWheel, onKey, onTouchStart, onTouchEnd]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden', // we control paging; inner sections handle their own overflow
    background: 'var(--page-bg, #fff)',
  };

  return (
    <div style={containerStyle} aria-live="polite">
      {/* Horizontal rail of full-page sections */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
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
              ref={(el) => setRef(el, i)}
              style={{
                width: '100vw',
                height: '100vh',
                overflow: 'auto',
                boxSizing: 'border-box',
                padding: 0,
                transform: `translateX(${offset}px)`,
                transition: `transform ${TRANSITION_MS}ms cubic-bezier(.2,.8,.2,1)`,
              }}
            >
              <div style={{ minHeight: '100vh' }}>{s.node}</div>
            </div>
          );
        })}
      </div>

      {/* Dots */}
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
