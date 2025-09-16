/**
 * ROKO Network Scroll Animation Hook
 *
 * Advanced scroll-based animations with intersection observer,
 * parallax effects, and performance optimization
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  MotionValue,
  useMotionValue,
  useAnimationFrame,
} from 'framer-motion';
import { shouldReduceMotion } from '@/utils/animations';

// Types for scroll animation configuration
export interface ScrollAnimationConfig {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
  delay?: number;
  duration?: number;
}

export interface ParallaxConfig {
  speed?: number;
  direction?: 'up' | 'down';
  range?: [number, number];
  spring?: boolean;
}

export interface ScrollProgressConfig {
  container?: React.RefObject<HTMLElement>;
  target?: React.RefObject<HTMLElement>;
  offset?: [string, string];
}

/**
 * Basic scroll animation hook using intersection observer
 */
export const useScrollAnimation = (config: ScrollAnimationConfig = {}) => {
  const {
    threshold = 0.3,
    triggerOnce = true,
    rootMargin = '0px 0px -10% 0px',
    delay = 0,
  } = config;

  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && !shouldReduceMotion();

  const { ref, inView, entry } = useInView({
    threshold,
    triggerOnce,
    rootMargin,
    delay,
  });

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (inView && shouldAnimate && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [inView, shouldAnimate, hasAnimated]);

  return {
    ref,
    inView: shouldAnimate ? inView : true,
    hasAnimated: shouldAnimate ? hasAnimated : true,
    entry,
    shouldAnimate,
  };
};

/**
 * Parallax scroll hook with performance optimization
 */
export const useParallax = (config: ParallaxConfig = {}) => {
  const {
    speed = 0.5,
    direction = 'up',
    range = [-100, 100],
    spring = false,
  } = config;

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && !shouldReduceMotion();

  // Calculate transform range based on direction and speed
  const transformRange = useMemo(() => {
    const multiplier = direction === 'up' ? -1 : 1;
    return [range[0] * speed * multiplier, range[1] * speed * multiplier];
  }, [speed, direction, range]);

  const y = useTransform(scrollYProgress, [0, 1], transformRange);
  const smoothY = spring ? useSpring(y, { stiffness: 100, damping: 30, mass: 0.1 }) : y;

  return {
    ref,
    y: shouldAnimate ? smoothY : useMotionValue(0),
    scrollYProgress,
    shouldAnimate,
  };
};

/**
 * Scroll progress indicator hook
 */
export const useScrollProgress = (config: ScrollProgressConfig = {}) => {
  const { container, target, offset = ['start end', 'end start'] } = config;

  const { scrollYProgress } = useScroll({
    container: container || undefined,
    target: target || undefined,
    offset: offset as any,
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      setProgress(latest);
    });

    return unsubscribe;
  }, [scrollYProgress]);

  return {
    progress,
    scrollYProgress,
  };
};

/**
 * Staggered reveal animation hook for lists
 */
export const useStaggeredReveal = (
  itemCount: number,
  config: ScrollAnimationConfig & { staggerDelay?: number } = {}
) => {
  const { staggerDelay = 0.1, ...scrollConfig } = config;
  const { ref, inView, shouldAnimate } = useScrollAnimation(scrollConfig);
  const [revealedItems, setRevealedItems] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );

  useEffect(() => {
    if (inView && shouldAnimate) {
      revealedItems.forEach((_, index) => {
        setTimeout(() => {
          setRevealedItems((prev) => {
            const newRevealed = [...prev];
            newRevealed[index] = true;
            return newRevealed;
          });
        }, index * staggerDelay * 1000);
      });
    }
  }, [inView, shouldAnimate, itemCount, staggerDelay]);

  return {
    ref,
    revealedItems,
    inView,
    shouldAnimate,
  };
};

/**
 * Scroll velocity hook for dynamic animations
 */
export const useScrollVelocity = () => {
  const { scrollY } = useScroll();
  const [velocity, setVelocity] = useState(0);
  const prevScrollY = useRef(0);
  const prevTime = useRef(Date.now());

  useAnimationFrame(() => {
    const currentTime = Date.now();
    const currentScrollY = scrollY.get();
    const timeDelta = currentTime - prevTime.current;
    const scrollDelta = currentScrollY - prevScrollY.current;

    if (timeDelta > 0) {
      const currentVelocity = scrollDelta / timeDelta;
      setVelocity(currentVelocity);
    }

    prevScrollY.current = currentScrollY;
    prevTime.current = currentTime;
  });

  return velocity;
};

/**
 * Sticky scroll animation hook
 */
export const useStickyScroll = (
  stickyHeight: number = 100,
  config: ScrollAnimationConfig = {}
) => {
  const { threshold = 0.1 } = config;
  const ref = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', `end-${stickyHeight}px start`] as any,
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, threshold, 1 - threshold, 1],
    [0, 1, 1, 0]
  );

  const scale = useTransform(
    scrollYProgress,
    [0, threshold, 1 - threshold, 1],
    [0.8, 1, 1, 0.8]
  );

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      setIsSticky(latest > threshold && latest < 1 - threshold);
    });

    return unsubscribe;
  }, [scrollYProgress, threshold]);

  return {
    ref,
    isSticky,
    opacity,
    scale,
    scrollYProgress,
  };
};

/**
 * Mouse-based parallax hook for interactive elements
 */
export const useMouseParallax = (
  strength: number = 0.1,
  springConfig = { stiffness: 150, damping: 15 }
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const x = useSpring(mousePosition.x * strength, springConfig);
  const y = useSpring(mousePosition.y * strength, springConfig);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setMousePosition({
      x: (event.clientX - centerX) / (rect.width / 2),
      y: (event.clientY - centerY) / (rect.height / 2),
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && !shouldReduceMotion();

  return {
    ref,
    x: shouldAnimate ? x : useMotionValue(0),
    y: shouldAnimate ? y : useMotionValue(0),
    shouldAnimate,
  };
};

/**
 * Scroll-triggered counter animation
 */
export const useScrollCounter = (
  endValue: number,
  duration: number = 2000,
  config: ScrollAnimationConfig = {}
) => {
  const { inView } = useScrollAnimation(config);
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (inView && !isAnimating) {
      setIsAnimating(true);

      const startTime = Date.now();
      const startValue = 0;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutCubic);

        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [inView, endValue, duration, isAnimating]);

  return {
    count,
    isAnimating,
    inView,
  };
};

/**
 * Reveal on scroll with custom easing
 */
export const useRevealOnScroll = (
  elements: number,
  config: ScrollAnimationConfig & {
    staggerDelay?: number;
    easingFunction?: (t: number) => number;
  } = {}
) => {
  const {
    staggerDelay = 100,
    easingFunction = (t: number) => t * (2 - t), // ease-out quad
    ...scrollConfig
  } = config;

  const { ref, inView } = useScrollAnimation(scrollConfig);
  const [revealStates, setRevealStates] = useState<boolean[]>(
    new Array(elements).fill(false)
  );

  useEffect(() => {
    if (inView) {
      for (let i = 0; i < elements; i++) {
        setTimeout(() => {
          setRevealStates((prev) => {
            const newStates = [...prev];
            newStates[i] = true;
            return newStates;
          });
        }, easingFunction(i / elements) * staggerDelay * elements);
      }
    }
  }, [inView, elements, staggerDelay, easingFunction]);

  return {
    ref,
    revealStates,
    inView,
  };
};

/**
 * Performance-optimized scroll animation with intersection observer
 */
export const useOptimizedScrollAnimation = (
  animationCallback: (progress: number) => void,
  config: ScrollAnimationConfig & { debounceMs?: number } = {}
) => {
  const { debounceMs = 16, ...scrollConfig } = config; // ~60fps
  const { ref: inViewRef, inView } = useScrollAnimation(scrollConfig);
  const scrollRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef });

  const lastCallTime = useRef(0);

  useEffect(() => {
    if (!inView) return;

    const unsubscribe = scrollYProgress.onChange((progress) => {
      const now = Date.now();
      if (now - lastCallTime.current >= debounceMs) {
        animationCallback(progress);
        lastCallTime.current = now;
      }
    });

    return unsubscribe;
  }, [scrollYProgress, inView, animationCallback, debounceMs]);

  return { ref: inViewRef, scrollRef, inView, scrollYProgress };
};

export default {
  useScrollAnimation,
  useParallax,
  useScrollProgress,
  useStaggeredReveal,
  useScrollVelocity,
  useStickyScroll,
  useMouseParallax,
  useScrollCounter,
  useRevealOnScroll,
  useOptimizedScrollAnimation,
};