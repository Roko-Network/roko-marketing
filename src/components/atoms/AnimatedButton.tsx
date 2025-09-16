/**
 * ROKO Network Animated Button Component
 *
 * Interactive button with holographic shimmer effects,
 * cyberpunk styling, and advanced micro-interactions
 */

import React, { forwardRef, useState, useRef } from 'react';
import { motion, useReducedMotion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { clsx } from 'clsx';
import { hoverEffects, durations, timingFunctions, shouldReduceMotion } from '@/utils/animations';

// Button variant types
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type ButtonAnimation = 'shimmer' | 'glow' | 'pulse' | 'glitch' | 'morph' | 'none';

export interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  animation?: ButtonAnimation;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  glowIntensity?: number;
  shimmerSpeed?: number;
  customGradient?: string;
}

// Size configurations
const sizeConfig = {
  sm: {
    className: 'px-3 py-1.5 text-sm',
    iconSize: 'w-4 h-4',
  },
  md: {
    className: 'px-4 py-2 text-base',
    iconSize: 'w-5 h-5',
  },
  lg: {
    className: 'px-6 py-3 text-lg',
    iconSize: 'w-6 h-6',
  },
  xl: {
    className: 'px-8 py-4 text-xl',
    iconSize: 'w-7 h-7',
  },
} as const;

// Variant configurations
const variantConfig = {
  primary: {
    base: 'bg-gradient-to-r from-roko-accent to-roko-gradient-end text-roko-dark font-semibold',
    hover: 'hover:shadow-lg hover:shadow-roko-accent/30',
    active: 'active:scale-95',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
    glow: 'shadow-roko-accent',
  },
  secondary: {
    base: 'bg-roko-secondary/10 text-roko-tertiary border border-roko-secondary/20 font-medium',
    hover: 'hover:bg-roko-secondary/20 hover:border-roko-secondary/40',
    active: 'active:scale-95',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
    glow: 'shadow-roko-secondary',
  },
  ghost: {
    base: 'bg-transparent text-roko-tertiary font-medium',
    hover: 'hover:bg-roko-primary/10 hover:text-roko-accent',
    active: 'active:scale-95',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
    glow: 'shadow-roko-primary',
  },
  danger: {
    base: 'bg-gradient-to-r from-roko-error to-red-500 text-white font-semibold',
    hover: 'hover:shadow-lg hover:shadow-roko-error/30',
    active: 'active:scale-95',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
    glow: 'shadow-roko-error',
  },
  success: {
    base: 'bg-gradient-to-r from-roko-success to-green-400 text-roko-dark font-semibold',
    hover: 'hover:shadow-lg hover:shadow-roko-success/30',
    active: 'active:scale-95',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
    glow: 'shadow-roko-success',
  },
} as const;

// Loading spinner component
const LoadingSpinner: React.FC<{ size: ButtonSize }> = ({ size }) => {
  const spinnerSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  }[size];

  return (
    <motion.div
      className={clsx('border-2 border-current border-t-transparent rounded-full', spinnerSize)}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        ease: 'linear',
        repeat: Infinity,
      }}
    />
  );
};

// Holographic shimmer effect
const HolographicShimmer: React.FC<{ isActive: boolean; speed?: number }> = ({
  isActive,
  speed = 1.2,
}) => {
  return (
    <motion.div
      className="absolute inset-0 rounded-inherit overflow-hidden"
      initial={false}
      animate={isActive ? 'animate' : 'initial'}
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{
          background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
          transform: 'skewX(-20deg)',
        }}
        animate={{
          x: isActive ? ['0%', '200%'] : '0%',
        }}
        transition={{
          duration: speed,
          ease: 'easeInOut',
          repeat: isActive ? Infinity : 0,
          repeatDelay: 0.5,
        }}
      />
    </motion.div>
  );
};

// Glitch effect overlay
const GlitchEffect: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <motion.div
      className="absolute inset-0 rounded-inherit overflow-hidden pointer-events-none"
      initial={false}
      animate={isActive ? 'animate' : 'initial'}
      variants={{
        initial: { opacity: 0 },
        animate: {
          opacity: [0, 1, 0],
          x: [0, -2, 2, -1, 1, 0],
          filter: [
            'hue-rotate(0deg)',
            'hue-rotate(90deg)',
            'hue-rotate(-90deg)',
            'hue-rotate(0deg)',
          ],
        },
      }}
      transition={{
        duration: 0.3,
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        repeat: isActive ? 3 : 0,
        repeatDelay: 2,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-roko-accent/30 to-roko-error/30 mix-blend-screen" />
    </motion.div>
  );
};

// Main button component
export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      animation = 'shimmer',
      loading = false,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      children,
      glowIntensity = 1,
      shimmerSpeed = 1.2,
      customGradient,
      className,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      disabled,
      onAnimationStart,
      onAnimationEnd,
      onAnimationIteration,
      onDrag,
      onDragStart,
      onDragEnd,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const prefersReducedMotion = useReducedMotion();
    const shouldUseReducedMotion = prefersReducedMotion || shouldReduceMotion();

    // Mouse tracking for gradient effects
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Dynamic gradient based on mouse position
    const backgroundGradient = useMotionTemplate`
      radial-gradient(
        circle at ${mouseX}px ${mouseY}px,
        rgba(0, 212, 170, ${glowIntensity * 0.1}) 0%,
        transparent 50%
      )
    `;

    // Handle mouse movement for gradient effect
    const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current || shouldUseReducedMotion) return;

      const rect = buttonRef.current.getBoundingClientRect();
      mouseX.set(event.clientX - rect.left);
      mouseY.set(event.clientY - rect.top);
    };

    // Event handlers
    const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(true);
      onMouseEnter?.(event);
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(false);
      setIsPressed(false);
      onMouseLeave?.(event);
    };

    const handleFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLButtonElement>) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    // Get configuration
    const sizeStyles = sizeConfig[size];
    const variantStyles = variantConfig[variant];

    // Determine if effects should be active
    const isEffectActive = (isHovered || isFocused) && !disabled && !loading;

    // Build class names
    const buttonClasses = clsx(
      // Base styles
      'relative inline-flex items-center justify-center',
      'rounded-lg font-display tracking-wider',
      'transition-all duration-300 ease-out',
      'focus:outline-none focus:ring-2 focus:ring-roko-accent/50 focus:ring-offset-2 focus:ring-offset-roko-dark',
      'overflow-hidden isolate',

      // Size styles
      sizeStyles.className,

      // Variant styles
      variantStyles.base,
      variantStyles.hover,
      variantStyles.active,
      variantStyles.disabled,

      // Full width
      fullWidth && 'w-full',

      // Custom gradient override
      customGradient && 'bg-none',

      // Custom classes
      className
    );

    // Animation variants
    const buttonVariants = shouldUseReducedMotion
      ? undefined
      : {
          hover: {
            y: -2,
            scale: isPressed ? 0.98 : 1.02,
            boxShadow: animation === 'glow'
              ? `0 10px 25px rgba(0, 212, 170, ${0.2 * glowIntensity})`
              : undefined,
            transition: {
              type: 'spring',
              stiffness: 400,
              damping: 25,
            },
          },
          tap: {
            scale: 0.95,
            transition: {
              duration: 0.1,
            },
          },
        };

    return (
      <motion.button
        ref={(node: HTMLButtonElement | null) => {
          if (buttonRef) {
            (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          }
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          }
        }}
        className={buttonClasses}
        style={{
          background: customGradient || undefined,
        }}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        whileFocus="hover"
        disabled={disabled || loading}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onAnimationStart={onAnimationStart as any}
        onAnimationEnd={onAnimationEnd as any}
        onAnimationIteration={onAnimationIteration as any}
        {...props}
      >
        {/* Background effects */}
        {!shouldUseReducedMotion && (
          <>
            {/* Dynamic gradient overlay */}
            <motion.div
              className="absolute inset-0 rounded-inherit"
              style={{
                background: backgroundGradient,
              }}
            />

            {/* Holographic shimmer */}
            {animation === 'shimmer' && (
              <HolographicShimmer isActive={isEffectActive} speed={shimmerSpeed} />
            )}

            {/* Glitch effect */}
            {animation === 'glitch' && <GlitchEffect isActive={isEffectActive} />}

            {/* Pulse effect */}
            {animation === 'pulse' && (
              <motion.div
                className="absolute inset-0 rounded-inherit bg-current opacity-0"
                animate={
                  isEffectActive
                    ? {
                        opacity: [0, 0.1, 0],
                        scale: [1, 1.05, 1],
                      }
                    : {}
                }
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
          </>
        )}

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center space-x-2">
          {/* Loading spinner */}
          {loading && <LoadingSpinner size={size} />}

          {/* Left icon */}
          {icon && iconPosition === 'left' && !loading && (
            <span className={clsx('flex-shrink-0', sizeStyles.iconSize)}>{icon}</span>
          )}

          {/* Button text */}
          {!loading && (
            <span className="whitespace-nowrap">{children}</span>
          )}

          {/* Right icon */}
          {icon && iconPosition === 'right' && !loading && (
            <span className={clsx('flex-shrink-0', sizeStyles.iconSize)}>{icon}</span>
          )}
        </span>

        {/* Focus ring */}
        {isFocused && !shouldUseReducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-inherit border-2 border-roko-accent/50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: durations.fast }}
          />
        )}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

// Convenience components for common button types
export const PrimaryButton: React.FC<Omit<AnimatedButtonProps, 'variant'>> = (props) => (
  <AnimatedButton variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<AnimatedButtonProps, 'variant'>> = (props) => (
  <AnimatedButton variant="secondary" {...props} />
);

export const GhostButton: React.FC<Omit<AnimatedButtonProps, 'variant'>> = (props) => (
  <AnimatedButton variant="ghost" {...props} />
);

export const DangerButton: React.FC<Omit<AnimatedButtonProps, 'variant'>> = (props) => (
  <AnimatedButton variant="danger" {...props} />
);

export const SuccessButton: React.FC<Omit<AnimatedButtonProps, 'variant'>> = (props) => (
  <AnimatedButton variant="success" {...props} />
);

export default AnimatedButton;