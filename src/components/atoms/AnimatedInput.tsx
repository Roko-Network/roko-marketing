/**
 * ROKO Network Animated Input Component
 *
 * Form inputs with sophisticated focus animations,
 * cyberpunk styling, and micro-interactions
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { clsx } from 'clsx';
import { durations, timingFunctions, shouldReduceMotion } from '@/utils/animations';

// Input variant types
export type InputVariant = 'default' | 'cyberpunk' | 'glass' | 'outlined' | 'floating';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputState = 'default' | 'success' | 'error' | 'warning';

export interface AnimatedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  variant?: InputVariant;
  size?: InputSize;
  state?: InputState;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  glowOnFocus?: boolean;
  characterCount?: boolean;
  maxLength?: number;
}

// Size configurations
const sizeConfig = {
  sm: {
    input: 'px-3 py-2 text-sm',
    label: 'text-sm',
    icon: 'w-4 h-4',
    helper: 'text-xs',
  },
  md: {
    input: 'px-4 py-3 text-base',
    label: 'text-base',
    icon: 'w-5 h-5',
    helper: 'text-sm',
  },
  lg: {
    input: 'px-5 py-4 text-lg',
    label: 'text-lg',
    icon: 'w-6 h-6',
    helper: 'text-base',
  },
} as const;

// State configurations
const stateConfig = {
  default: {
    border: 'border-roko-primary/30',
    focus: 'focus:border-roko-accent',
    glow: 'rgba(0, 212, 170, 0.4)',
    text: 'text-roko-tertiary',
  },
  success: {
    border: 'border-roko-success/50',
    focus: 'focus:border-roko-success',
    glow: 'rgba(34, 197, 94, 0.4)',
    text: 'text-roko-success',
  },
  error: {
    border: 'border-roko-error/50',
    focus: 'focus:border-roko-error',
    glow: 'rgba(255, 71, 87, 0.4)',
    text: 'text-roko-error',
  },
  warning: {
    border: 'border-roko-warning/50',
    focus: 'focus:border-roko-warning',
    glow: 'rgba(255, 165, 2, 0.4)',
    text: 'text-roko-warning',
  },
} as const;

// Variant configurations
const variantConfig = {
  default: {
    base: 'bg-roko-dark/50 border rounded-lg',
    backdrop: 'backdrop-blur-sm',
  },
  cyberpunk: {
    base: 'bg-gradient-to-r from-roko-dark/90 to-roko-primary/5 border rounded-lg',
    backdrop: 'backdrop-blur-sm',
  },
  glass: {
    base: 'bg-roko-primary/5 border rounded-xl',
    backdrop: 'backdrop-blur-xl',
  },
  outlined: {
    base: 'bg-transparent border-2 rounded-lg',
    backdrop: '',
  },
  floating: {
    base: 'bg-roko-dark/50 border-b-2 border-t-0 border-x-0 rounded-none',
    backdrop: 'backdrop-blur-sm',
  },
} as const;

// Loading spinner component
const LoadingSpinner: React.FC<{ size: InputSize }> = ({ size }) => {
  const spinnerSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
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

// Scan line effect for cyberpunk variant
const ScanLine: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none"
      initial={false}
      animate={isActive ? 'active' : 'inactive'}
      variants={{
        inactive: { opacity: 0 },
        active: { opacity: 1 },
      }}
      transition={{ duration: durations.fast }}
    >
      <motion.div
        className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-roko-accent to-transparent"
        animate={isActive ? {
          y: ['0%', '100%', '0%'],
        } : {}}
        transition={{
          duration: 2,
          ease: 'linear',
          repeat: isActive ? Infinity : 0,
        }}
      />
    </motion.div>
  );
};

// Particle burst effect
const ParticleBurst: React.FC<{ isActive: boolean; trigger: number }> = ({ isActive, trigger }) => {
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    angle: (i * 60) * (Math.PI / 180),
    distance: 15,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none">
      {particles.map((particle, index) => (
        <motion.div
          key={`${particle.id}-${trigger}`}
          className="absolute w-1 h-1 bg-roko-accent rounded-full"
          style={{
            left: '50%',
            top: '50%',
          }}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={isActive ? {
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: Math.cos(particle.angle) * particle.distance,
            y: Math.sin(particle.angle) * particle.distance,
          } : {}}
          transition={{
            duration: 0.6,
            delay: index * 0.05,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

// Main input component
export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  (
    {
      label,
      variant = 'default',
      size = 'md',
      state = 'default',
      helperText,
      leftIcon,
      rightIcon,
      loading = false,
      glowOnFocus = true,
      characterCount = false,
      className,
      onFocus,
      onBlur,
      onChange,
      value,
      maxLength,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [particleTrigger, setParticleTrigger] = useState(0);
    const [charCount, setCharCount] = useState(0);

    const prefersReducedMotion = useReducedMotion();
    const shouldUseReducedMotion = prefersReducedMotion || shouldReduceMotion();

    const inputRef = useRef<HTMLInputElement>(null);

    // Motion values for glow effect
    const glowOpacity = useMotionValue(0);
    const glowScale = useMotionValue(1);

    // Get configurations
    const sizeStyles = sizeConfig[size];
    const stateStyles = stateConfig[state];
    const variantStyles = variantConfig[variant];

    // Handle focus
    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      setParticleTrigger(prev => prev + 1);

      if (!shouldUseReducedMotion && glowOnFocus) {
        glowOpacity.set(1);
        glowScale.set(1.02);
      }

      onFocus?.(event);
    };

    // Handle blur
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);

      if (!shouldUseReducedMotion && glowOnFocus) {
        glowOpacity.set(0);
        glowScale.set(1);
      }

      onBlur?.(event);
    };

    // Handle change
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setHasValue(newValue.length > 0);
      setCharCount(newValue.length);
      onChange?.(event);
    };

    // Check initial value
    useEffect(() => {
      const currentValue = value || (inputRef.current?.value) || '';
      setHasValue(String(currentValue).length > 0);
      setCharCount(String(currentValue).length);
    }, [value]);

    // Dynamic glow effect
    const glowEffect = useMotionTemplate`
      0 0 20px ${stateStyles.glow},
      0 0 40px ${stateStyles.glow}
    `;

    // Build class names
    const containerClasses = clsx(
      'relative w-full'
    );

    const inputWrapperClasses = clsx(
      'relative',
      'transition-all duration-300 ease-out',
      'overflow-hidden',
      variantStyles.base,
      variantStyles.backdrop,
      stateStyles.border,
      isFocused && stateStyles.focus,
      className
    );

    const inputClasses = clsx(
      'w-full bg-transparent',
      'text-roko-tertiary placeholder-roko-primary/50',
      'focus:outline-none',
      'transition-all duration-300 ease-out',
      sizeStyles.input,
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      loading && 'pr-10'
    );

    const labelClasses = clsx(
      'absolute transition-all duration-300 ease-out pointer-events-none',
      'text-roko-primary font-medium',
      sizeStyles.label,
      variant === 'floating' && (isFocused || hasValue)
        ? 'top-0 left-4 -translate-y-1/2 text-xs bg-roko-dark px-2 text-roko-accent'
        : variant === 'floating'
        ? 'top-1/2 left-4 -translate-y-1/2'
        : 'top-0 left-0 -translate-y-full mb-2',
      !isFocused && !hasValue && variant === 'floating' && 'text-roko-primary/70'
    );

    const helperClasses = clsx(
      'mt-2 transition-all duration-300',
      sizeStyles.helper,
      stateStyles.text
    );

    return (
      <div className={containerClasses}>
        {/* Label for non-floating variants */}
        {label && variant !== 'floating' && (
          <motion.label
            className={labelClasses}
            htmlFor={props.id}
            initial={false}
            animate={{
              color: isFocused ? stateStyles.glow : undefined,
            }}
            transition={{ duration: durations.fast }}
          >
            {label}
          </motion.label>
        )}

        {/* Input wrapper */}
        <motion.div
          className={inputWrapperClasses}
          style={{
            boxShadow: !shouldUseReducedMotion && glowOnFocus && isFocused
              ? glowEffect
              : undefined,
            scale: glowScale,
          }}
          animate={{
            borderColor: isFocused ? stateStyles.glow : undefined,
          }}
          transition={{ duration: durations.normal }}
        >
          {/* Background effects */}
          {!shouldUseReducedMotion && (
            <>
              {/* Cyberpunk scan line */}
              {variant === 'cyberpunk' && (
                <ScanLine isActive={isFocused} />
              )}

              {/* Particle burst effect */}
              <ParticleBurst
                isActive={isFocused && variant === 'cyberpunk'}
                trigger={particleTrigger}
              />

              {/* Glow overlay */}
              {glowOnFocus && (
                <motion.div
                  className="absolute inset-0 rounded-inherit"
                  style={{
                    background: `radial-gradient(circle, ${stateStyles.glow} 0%, transparent 70%)`,
                    opacity: glowOpacity,
                  }}
                />
              )}
            </>
          )}

          {/* Left icon */}
          {leftIcon && (
            <motion.div
              className={clsx(
                'absolute left-3 top-1/2 -translate-y-1/2 text-roko-primary',
                sizeStyles.icon
              )}
              animate={{
                color: isFocused ? stateStyles.glow : undefined,
                scale: isFocused ? 1.1 : 1,
              }}
              transition={{ duration: durations.fast }}
            >
              {leftIcon}
            </motion.div>
          )}

          {/* Floating label */}
          {label && variant === 'floating' && (
            <motion.label
              className={labelClasses}
              htmlFor={props.id}
              initial={false}
              animate={{
                color: isFocused ? stateStyles.glow : undefined,
                y: isFocused || hasValue ? -12 : 0,
                scale: isFocused || hasValue ? 0.85 : 1,
              }}
              transition={{ duration: durations.normal }}
            >
              {label}
            </motion.label>
          )}

          {/* Input field */}
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            className={inputClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            value={value}
            maxLength={maxLength}
            {...props}
          />

          {/* Right icon / Loading */}
          {(rightIcon || loading) && (
            <motion.div
              className={clsx(
                'absolute right-3 top-1/2 -translate-y-1/2',
                sizeStyles.icon,
                loading ? 'text-roko-accent' : 'text-roko-primary'
              )}
              animate={{
                color: !loading && isFocused ? stateStyles.glow : undefined,
                scale: isFocused ? 1.1 : 1,
              }}
              transition={{ duration: durations.fast }}
            >
              {loading ? <LoadingSpinner size={size} /> : rightIcon}
            </motion.div>
          )}
        </motion.div>

        {/* Helper text and character count */}
        {(helperText || characterCount) && (
          <div className="flex justify-between items-center">
            {helperText && (
              <motion.p
                className={helperClasses}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: durations.normal }}
              >
                {helperText}
              </motion.p>
            )}

            {characterCount && maxLength && (
              <motion.span
                className={clsx(
                  'text-xs transition-colors duration-300',
                  charCount > maxLength * 0.8
                    ? charCount === maxLength
                      ? 'text-roko-error'
                      : 'text-roko-warning'
                    : 'text-roko-primary'
                )}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: durations.normal }}
              >
                {charCount}/{maxLength}
              </motion.span>
            )}
          </div>
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = 'AnimatedInput';

// Convenience components for common input types
export const CyberpunkInput: React.FC<Omit<AnimatedInputProps, 'variant'>> = (props) => (
  <AnimatedInput variant="cyberpunk" glowOnFocus {...props} />
);

export const GlassInput: React.FC<Omit<AnimatedInputProps, 'variant'>> = (props) => (
  <AnimatedInput variant="glass" {...props} />
);

export const FloatingInput: React.FC<Omit<AnimatedInputProps, 'variant'>> = (props) => (
  <AnimatedInput variant="floating" {...props} />
);

export default AnimatedInput;