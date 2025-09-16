/**
 * ROKO Network Animated Card Component
 *
 * Card component with sophisticated hover effects, depth,
 * cyberpunk glow, and interactive micro-animations
 */

import React, { forwardRef, useState, useRef, useMemo } from 'react';
import { motion, useReducedMotion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { clsx } from 'clsx';
import { hoverEffects, durations, timingFunctions, shouldReduceMotion } from '@/utils/animations';

// Card variant types
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass' | 'cyberpunk';
export type CardSize = 'sm' | 'md' | 'lg' | 'xl';
export type CardHoverEffect = 'lift' | 'glow' | 'tilt' | 'scale' | 'morph' | 'none';

export interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
  hoverEffect?: CardHoverEffect;
  interactive?: boolean;
  glowColor?: string;
  borderGradient?: boolean;
  children: React.ReactNode;
  href?: string;
  as?: 'div' | 'article' | 'section';
  glowIntensity?: number;
  tiltStrength?: number;
}

// Size configurations
const sizeConfig = {
  sm: 'p-4 rounded-lg',
  md: 'p-6 rounded-xl',
  lg: 'p-8 rounded-2xl',
  xl: 'p-10 rounded-3xl',
} as const;

// Variant configurations
const variantConfig = {
  default: {
    base: 'bg-roko-dark/90 border border-roko-primary/10',
    backdrop: 'backdrop-blur-sm',
  },
  elevated: {
    base: 'bg-gradient-to-br from-roko-dark/95 to-roko-dark/90 border border-roko-primary/20 shadow-xl',
    backdrop: 'backdrop-blur-md',
  },
  outlined: {
    base: 'bg-transparent border-2 border-roko-primary/30',
    backdrop: '',
  },
  glass: {
    base: 'bg-roko-primary/5 border border-roko-primary/20',
    backdrop: 'backdrop-blur-xl',
  },
  cyberpunk: {
    base: 'bg-gradient-to-br from-roko-dark via-roko-dark/95 to-roko-primary/5 border border-roko-accent/30',
    backdrop: 'backdrop-blur-sm',
  },
} as const;

// Glow patterns
const glowPatterns = {
  default: 'rgba(0, 212, 170, 0.4)',
  accent: 'rgba(0, 212, 170, 0.6)',
  primary: 'rgba(186, 192, 204, 0.4)',
  success: 'rgba(34, 197, 94, 0.4)',
  warning: 'rgba(255, 165, 2, 0.4)',
  error: 'rgba(255, 71, 87, 0.4)',
} as const;

// Border effect component
const BorderGradientEffect: React.FC<{
  isActive: boolean;
  intensity?: number;
}> = ({ isActive, intensity = 1 }) => {
  return (
    <motion.div
      className="absolute inset-0 rounded-inherit overflow-hidden pointer-events-none"
      initial={false}
      animate={isActive ? 'active' : 'inactive'}
      variants={{
        inactive: { opacity: 0 },
        active: { opacity: intensity },
      }}
      transition={{ duration: durations.normal }}
    >
      <motion.div
        className="absolute inset-0 rounded-inherit"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(0, 212, 170, 0.3) 50%, transparent 70%)',
          backgroundSize: '200% 200%',
        }}
        animate={isActive ? {
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        } : {}}
        transition={{
          duration: 3,
          ease: 'linear',
          repeat: isActive ? Infinity : 0,
        }}
      />
    </motion.div>
  );
};

// Cyberpunk grid overlay
const CyberpunkGrid: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <motion.div
      className="absolute inset-0 rounded-inherit overflow-hidden pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 0.1 : 0 }}
      transition={{ duration: durations.normal }}
    >
      <svg
        className="w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <defs>
          <pattern
            id="cyberpunk-grid"
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="rgba(0, 212, 170, 0.3)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cyberpunk-grid)" />
      </svg>
    </motion.div>
  );
};

// Particle effect for enhanced interactions
const ParticleEffect: React.FC<{
  isActive: boolean;
  mouseX: number;
  mouseY: number;
}> = ({ isActive, mouseX, mouseY }) => {
  const particles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      angle: (i * 45) * (Math.PI / 180),
      distance: 20 + Math.random() * 30,
      delay: i * 0.1,
    }));
  }, []);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 rounded-inherit overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-roko-accent rounded-full"
          style={{
            left: mouseX,
            top: mouseY,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: Math.cos(particle.angle) * particle.distance,
            y: Math.sin(particle.angle) * particle.distance,
          }}
          transition={{
            duration: 0.8,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

// Main card component
export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  (
    {
      variant = 'default',
      size = 'md',
      hoverEffect = 'lift',
      interactive = true,
      glowColor = 'default',
      borderGradient = false,
      children,
      href,
      as: Component = 'div',
      glowIntensity = 1,
      tiltStrength = 10,
      className,
      onMouseEnter,
      onMouseLeave,
      onMouseMove,
      onClick,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const prefersReducedMotion = useReducedMotion();
    const shouldUseReducedMotion = prefersReducedMotion || shouldReduceMotion();

    const cardRef = useRef<HTMLDivElement>(null);

    // Motion values for advanced effects
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });

    // Dynamic gradient based on mouse position
    const backgroundGradient = useMotionTemplate`
      radial-gradient(
        circle at ${mouseX}px ${mouseY}px,
        ${glowPatterns[glowColor as keyof typeof glowPatterns] || glowPatterns.default} 0%,
        transparent 50%
      )
    `;

    // Handle mouse movement for tilt and glow effects
    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || shouldUseReducedMotion) {
        onMouseMove?.(event);
        return;
      }

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseXPercent = (event.clientX - centerX) / (rect.width / 2);
      const mouseYPercent = (event.clientY - centerY) / (rect.height / 2);

      // Update motion values
      mouseX.set(event.clientX - rect.left);
      mouseY.set(event.clientY - rect.top);

      // Set mouse position for particle effects
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });

      // Apply tilt effect
      if (hoverEffect === 'tilt') {
        rotateX.set(-mouseYPercent * tiltStrength);
        rotateY.set(mouseXPercent * tiltStrength);
      }

      onMouseMove?.(event);
    };

    // Handle mouse enter
    const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(true);
      onMouseEnter?.(event);
    };

    // Handle mouse leave
    const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(false);

      // Reset tilt
      if (hoverEffect === 'tilt' && !shouldUseReducedMotion) {
        rotateX.set(0);
        rotateY.set(0);
      }

      onMouseLeave?.(event);
    };

    // Get configuration
    const sizeStyles = sizeConfig[size];
    const variantStyles = variantConfig[variant];

    // Determine if effects should be active
    const isEffectActive = (isHovered || isFocused) && interactive;

    // Build class names
    const cardClasses = clsx(
      // Base styles
      'relative',
      'transition-all duration-300 ease-out',
      'focus:outline-none focus:ring-2 focus:ring-roko-accent/50 focus:ring-offset-2 focus:ring-offset-roko-dark',
      'overflow-hidden isolate',

      // Size styles
      sizeStyles,

      // Variant styles
      variantStyles.base,
      variantStyles.backdrop,

      // Interactive styles
      interactive && 'cursor-pointer',
      interactive && !shouldUseReducedMotion && 'transform-gpu',

      // Custom classes
      className
    );

    // Animation variants
    const cardVariants = shouldUseReducedMotion
      ? {}
      : {
          hover: {
            y: hoverEffect === 'lift' ? -8 : 0,
            scale: hoverEffect === 'scale' ? 1.02 : 1,
            boxShadow: hoverEffect === 'glow'
              ? `0 20px 40px ${glowPatterns[glowColor as keyof typeof glowPatterns] || glowPatterns.default}`
              : undefined,
            transition: {
              type: 'spring',
              stiffness: 400,
              damping: 25,
            },
          },
          tap: {
            scale: 0.98,
            transition: {
              duration: 0.1,
            },
          },
        };

    // 3D transform style for tilt effect
    const transform3D = shouldUseReducedMotion
      ? {}
      : {
          transform: hoverEffect === 'tilt'
            ? useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
            : undefined,
        };

    const CardComponent = href ? motion.a : motion[Component];

    return (
      <CardComponent
        ref={(node: HTMLDivElement) => {
          cardRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cardClasses}
        style={transform3D}
        variants={cardVariants}
        whileHover={interactive ? "hover" : undefined}
        whileTap={interactive ? "tap" : undefined}
        whileFocus={interactive ? "hover" : undefined}
        href={href}
        tabIndex={interactive ? 0 : undefined}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClick={onClick}
        {...props}
      >
        {/* Background effects */}
        {!shouldUseReducedMotion && interactive && (
          <>
            {/* Dynamic gradient overlay */}
            <motion.div
              className="absolute inset-0 rounded-inherit opacity-0"
              style={{
                background: backgroundGradient,
              }}
              animate={{
                opacity: isEffectActive ? glowIntensity * 0.3 : 0,
              }}
              transition={{ duration: durations.normal }}
            />

            {/* Border gradient effect */}
            {borderGradient && (
              <BorderGradientEffect
                isActive={isEffectActive}
                intensity={glowIntensity}
              />
            )}

            {/* Cyberpunk grid for cyberpunk variant */}
            {variant === 'cyberpunk' && (
              <CyberpunkGrid isActive={isEffectActive} />
            )}

            {/* Particle effect */}
            {hoverEffect === 'glow' && (
              <ParticleEffect
                isActive={isEffectActive}
                mouseX={mousePosition.x}
                mouseY={mousePosition.y}
              />
            )}

            {/* Morph effect background */}
            {hoverEffect === 'morph' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-roko-accent/10 to-roko-gradient-end/10 rounded-inherit"
                initial={{ opacity: 0, borderRadius: '0.75rem' }}
                animate={{
                  opacity: isEffectActive ? 1 : 0,
                  borderRadius: isEffectActive ? ['0.75rem', '1.5rem', '0.75rem'] : '0.75rem',
                }}
                transition={{
                  duration: durations.leisurely,
                  ease: timingFunctions.cyberGlitch,
                }}
              />
            )}
          </>
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Focus indicator */}
        {isFocused && !shouldUseReducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-inherit border-2 border-roko-accent/50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: durations.fast }}
          />
        )}
      </CardComponent>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';

// Convenience components for common card types
export const FeatureCard: React.FC<Omit<AnimatedCardProps, 'variant'>> = (props) => (
  <AnimatedCard variant="elevated" hoverEffect="lift" borderGradient {...props} />
);

export const GlassCard: React.FC<Omit<AnimatedCardProps, 'variant'>> = (props) => (
  <AnimatedCard variant="glass" hoverEffect="glow" {...props} />
);

export const CyberpunkCard: React.FC<Omit<AnimatedCardProps, 'variant'>> = (props) => (
  <AnimatedCard variant="cyberpunk" hoverEffect="tilt" borderGradient {...props} />
);

export const InteractiveCard: React.FC<Omit<AnimatedCardProps, 'interactive'>> = (props) => (
  <AnimatedCard interactive hoverEffect="lift" {...props} />
);

export default AnimatedCard;