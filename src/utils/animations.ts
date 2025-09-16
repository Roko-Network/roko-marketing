/**
 * ROKO Network Animation System
 *
 * Comprehensive animation variants and utilities for the cyberpunk-inspired design
 * Built with Framer Motion and optimized for performance
 */

import { Variants, TargetAndTransition, AnimationProps } from 'framer-motion';

// ROKO Brand timing functions
export const timingFunctions = {
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  cyberGlitch: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Spring configurations for different interaction types
export const springConfigs = {
  gentle: { stiffness: 260, damping: 20, mass: 1 },
  bouncy: { stiffness: 400, damping: 17, mass: 1 },
  snappy: { stiffness: 500, damping: 30, mass: 1 },
  wobbly: { stiffness: 180, damping: 12, mass: 1 },
  cyberpunk: { stiffness: 300, damping: 25, mass: 0.8 },
} as const;

// Duration presets
export const durations = {
  instant: 0,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  leisurely: 1.2,
} as const;

/**
 * Page Transition Animations
 */
export const pageTransitions = {
  // Standard page fade
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      duration: durations.normal,
      ease: timingFunctions.easeInOut
    },
  },

  // Slide transitions
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: {
      duration: durations.normal,
      ease: timingFunctions.easeOut,
    },
  },

  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: {
      duration: durations.normal,
      ease: timingFunctions.easeOut,
    },
  },

  slideLeft: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: {
      duration: durations.normal,
      ease: timingFunctions.easeOut,
    },
  },

  slideRight: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
    transition: {
      duration: durations.normal,
      ease: timingFunctions.easeOut,
    },
  },

  // Scale transition
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: {
      type: 'spring',
      ...springConfigs.cyberpunk,
    },
  },

  // Cyberpunk glitch effect
  glitch: {
    initial: {
      opacity: 0,
      x: 0,
      filter: 'hue-rotate(0deg)',
      textShadow: '0 0 0 transparent',
    },
    animate: {
      opacity: 1,
      x: 0,
      filter: 'hue-rotate(0deg)',
      textShadow: '0 0 0 transparent',
    },
    exit: {
      opacity: 0,
      x: [0, -2, 2, -1, 1, 0] as any,
      filter: [
        'hue-rotate(0deg)',
        'hue-rotate(90deg)',
        'hue-rotate(-90deg)',
        'hue-rotate(0deg)'
      ] as any,
      textShadow: [
        '0 0 0 transparent',
        '2px 0 0 #00d4aa, -2px 0 0 #ff4757',
        '0 0 0 transparent'
      ] as any,
      transition: {
        duration: durations.normal,
        times: [0, 0.2, 0.4, 0.6, 0.8, 1] as any,
      },
    },
  },
} as const;

/**
 * Scroll-triggered Animations
 */
export const scrollAnimations = {
  // Fade in from bottom
  fadeUp: {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: {
      duration: durations.slow,
      ease: timingFunctions.easeOut,
    },
  },

  // Fade in from different directions
  fadeDown: {
    initial: { opacity: 0, y: -40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: {
      duration: durations.slow,
      ease: timingFunctions.easeOut,
    },
  },

  fadeLeft: {
    initial: { opacity: 0, x: 40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: {
      duration: durations.slow,
      ease: timingFunctions.easeOut,
    },
  },

  fadeRight: {
    initial: { opacity: 0, x: -40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: {
      duration: durations.slow,
      ease: timingFunctions.easeOut,
    },
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, amount: 0.3 },
    transition: {
      type: 'spring',
      ...springConfigs.cyberpunk,
    },
  },

  // Rotation reveal
  rotateIn: {
    initial: { opacity: 0, rotate: -10 },
    whileInView: { opacity: 1, rotate: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: {
      duration: durations.slow,
      ease: timingFunctions.cyberGlitch,
    },
  },

  // Parallax effect (use with custom transform)
  parallax: {
    initial: { y: 0 },
    // Note: Parallax is handled via useTransform in components
  },
} as const;

/**
 * Hover Effects
 */
export const hoverEffects = {
  // Standard lift
  lift: {
    whileHover: {
      y: -2,
      transition: {
        type: 'spring',
        ...springConfigs.snappy,
      },
    },
  },

  // Scale on hover
  scale: {
    whileHover: {
      scale: 1.05,
      transition: {
        type: 'spring',
        ...springConfigs.gentle,
      },
    },
  },

  // Glow effect
  glow: {
    whileHover: {
      boxShadow: [
        '0 0 0 rgba(0, 212, 170, 0)',
        '0 0 20px rgba(0, 212, 170, 0.4)',
        '0 0 40px rgba(0, 212, 170, 0.6)',
      ] as any,
      transition: {
        duration: durations.normal,
        ease: timingFunctions.easeOut,
      },
    },
  },

  // Cyberpunk holographic shimmer
  shimmer: {
    whileHover: {
      background: [
        'linear-gradient(135deg, #00d4aa, #00ffcc)',
        'linear-gradient(135deg, #00ffcc, #00d4aa, #00ffcc)',
        'linear-gradient(135deg, #00d4aa, #00ffcc)',
      ] as any,
      transition: {
        duration: durations.leisurely,
        ease: timingFunctions.easeInOut,
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  },

  // Color shift
  colorShift: {
    whileHover: {
      filter: [
        'hue-rotate(0deg)',
        'hue-rotate(10deg)',
        'hue-rotate(-10deg)',
        'hue-rotate(0deg)',
      ] as any,
      transition: {
        duration: durations.slow,
        ease: timingFunctions.easeInOut,
      },
    },
  },

  // Morph effect
  morph: {
    whileHover: {
      borderRadius: ['8px', '16px', '8px'] as any,
      transition: {
        duration: durations.slow,
        ease: timingFunctions.cyberGlitch,
      },
    },
  },
} as const;

/**
 * Text Animations
 */
export const textAnimations = {
  // Typing effect
  typing: {
    initial: { width: 0, opacity: 0 },
    animate: { width: '100%', opacity: 1 },
    transition: {
      width: {
        duration: durations.leisurely,
        ease: timingFunctions.easeInOut,
      },
      opacity: {
        duration: durations.fast,
        delay: durations.fast,
      },
    },
  },

  // Character-by-character reveal
  reveal: (staggerDelay = 0.05) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: durations.normal,
      ease: timingFunctions.easeOut,
      delay: staggerDelay,
    },
  }),

  // Gradient animation
  gradientShift: {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] as any,
      transition: {
        duration: 3,
        ease: timingFunctions.easeInOut,
        repeat: Infinity,
      },
    },
  },

  // Glitch text effect
  glitchText: {
    whileHover: {
      x: [0, -2, 2, -1, 1, 0] as any,
      filter: [
        'hue-rotate(0deg)',
        'hue-rotate(90deg)',
        'hue-rotate(-90deg)',
        'hue-rotate(0deg)'
      ] as any,
      textShadow: [
        '0 0 0 transparent',
        '2px 0 0 #00d4aa, -2px 0 0 #ff4757',
        '0 0 0 transparent'
      ] as any,
      transition: {
        duration: durations.normal,
        times: [0, 0.2, 0.4, 0.6, 0.8, 1] as any,
      },
    },
  },

  // Pulse effect
  pulse: {
    animate: {
      opacity: [1, 0.7, 1] as any,
      scale: [1, 1.02, 1] as any,
      transition: {
        duration: 2,
        ease: timingFunctions.easeInOut,
        repeat: Infinity,
      },
    },
  },
} as const;

/**
 * Loading Animations
 */
export const loadingAnimations = {
  // Skeleton loading
  skeleton: {
    animate: {
      opacity: [0.4, 0.8, 0.4] as any,
      transition: {
        duration: 1.5,
        ease: timingFunctions.easeInOut,
        repeat: Infinity,
      },
    },
  },

  // Pulse loading
  pulse: {
    animate: {
      scale: [1, 1.05, 1] as any,
      opacity: [0.7, 1, 0.7] as any,
      transition: {
        duration: 1,
        ease: timingFunctions.easeInOut,
        repeat: Infinity,
      },
    },
  },

  // Spin loading
  spin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  },

  // Dots loading
  dots: (delay = 0) => ({
    animate: {
      y: [0, -10, 0] as any,
      opacity: [0.4, 1, 0.4] as any,
      transition: {
        duration: 0.6,
        ease: timingFunctions.easeInOut,
        repeat: Infinity,
        delay,
      },
    },
  }),

  // Progress bar
  progressBar: {
    initial: { width: 0 },
    animate: { width: '100%' },
    transition: {
      duration: durations.leisurely,
      ease: timingFunctions.easeOut,
    },
  },
} as const;

/**
 * Success/Error Animations
 */
export const feedbackAnimations = {
  // Success checkmark
  success: {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1.2, 1] as any,
      opacity: 1,
      filter: [
        'drop-shadow(0 0 0 rgba(0, 212, 170, 0))',
        'drop-shadow(0 0 10px rgba(0, 212, 170, 0.8))',
        'drop-shadow(0 0 5px rgba(0, 212, 170, 0.4))',
      ] as any,
    },
    transition: {
      duration: durations.slow,
      ease: timingFunctions.cyberGlitch,
    },
  },

  // Error shake
  error: {
    animate: {
      x: [0, -10, 10, -10, 10, 0] as any,
      filter: [
        'drop-shadow(0 0 0 rgba(255, 71, 87, 0))',
        'drop-shadow(0 0 10px rgba(255, 71, 87, 0.8))',
        'drop-shadow(0 0 0 rgba(255, 71, 87, 0))',
      ] as any,
      transition: {
        duration: durations.slow,
        ease: timingFunctions.sharp,
      },
    },
  },

  // Warning pulse
  warning: {
    animate: {
      scale: [1, 1.05, 1] as any,
      filter: [
        'drop-shadow(0 0 0 rgba(255, 165, 2, 0))',
        'drop-shadow(0 0 8px rgba(255, 165, 2, 0.6))',
        'drop-shadow(0 0 0 rgba(255, 165, 2, 0))',
      ] as any,
      transition: {
        duration: 1,
        ease: timingFunctions.easeInOut,
        repeat: 3,
      },
    },
  },
} as const;

/**
 * Container Animations for Staggered Children
 */
export const containerAnimations = {
  // Stagger children with delay
  stagger: (staggerDelay = 0.1, delayChildren = 0) => ({
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  }),

  // Grid reveal animation
  gridReveal: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },

  // Wave effect
  wave: {
    animate: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: 1,
      },
    },
  },
} as const;

/**
 * 3D Integration Animations
 */
export const threeDAnimations = {
  // Camera movement sync
  cameraSync: {
    initial: { opacity: 0, z: -100 },
    animate: { opacity: 1, z: 0 },
    transition: {
      duration: durations.leisurely,
      ease: timingFunctions.easeOut,
    },
  },

  // Particle system sync
  particleSync: {
    animate: {
      opacity: [0.3, 1, 0.3] as any,
      scale: [1, 1.1, 1] as any,
      transition: {
        duration: 3,
        ease: timingFunctions.easeInOut,
        repeat: Infinity,
      },
    },
  },

  // Orb pulsing
  orbPulse: {
    animate: {
      scale: [1, 1.2, 1] as any,
      opacity: [0.8, 1, 0.8] as any,
      filter: [
        'drop-shadow(0 0 20px rgba(0, 212, 170, 0.4))',
        'drop-shadow(0 0 40px rgba(0, 212, 170, 0.8))',
        'drop-shadow(0 0 20px rgba(0, 212, 170, 0.4))',
      ] as any,
      transition: {
        duration: 2,
        ease: timingFunctions.easeInOut,
        repeat: Infinity,
      },
    },
  },
} as const;

/**
 * Utility Functions
 */

// Check if user prefers reduced motion
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Create reduced motion variant
export const withReducedMotion = (animation: any): any => {
  if (shouldReduceMotion()) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: durations.fast },
    };
  }
  return animation;
};

// Combine multiple animations
export const combineAnimations = (...animations: any[]): any => {
  return animations.reduce((combined, animation) => {
    return {
      ...combined,
      ...animation,
      transition: {
        ...combined.transition,
        ...animation.transition,
      },
    };
  }, {});
};

// Create staggered list animation
export const createStaggeredList = (
  itemAnimation: any,
  staggerDelay = 0.1,
  containerDelay = 0
) => ({
  container: {
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: containerDelay,
      },
    },
  },
  item: itemAnimation,
});

// Performance monitoring
export const animationPerformance = {
  startTime: 0,
  endTime: 0,

  start() {
    this.startTime = performance.now();
  },

  end() {
    this.endTime = performance.now();
    const duration = this.endTime - this.startTime;

    if (duration > 16.67) { // More than one frame at 60fps
      console.warn(`Animation took ${duration.toFixed(2)}ms (>16.67ms threshold)`);
    }

    return duration;
  },
};

// Export all animations as a grouped object
export const animations = {
  page: pageTransitions,
  scroll: scrollAnimations,
  hover: hoverEffects,
  text: textAnimations,
  loading: loadingAnimations,
  feedback: feedbackAnimations,
  container: containerAnimations,
  threeD: threeDAnimations,
} as const;

export default animations;