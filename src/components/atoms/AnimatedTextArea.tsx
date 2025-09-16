/**
 * ROKO Network Animated TextArea Component
 *
 * TextArea with sophisticated focus animations,
 * auto-resize, and cyberpunk styling
 */

import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { motion, useReducedMotion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { clsx } from 'clsx';
import { durations, timingFunctions, shouldReduceMotion } from '@/utils/animations';

// TextArea variant types
export type TextAreaVariant = 'default' | 'cyberpunk' | 'glass' | 'outlined';
export type TextAreaSize = 'sm' | 'md' | 'lg';
export type TextAreaState = 'default' | 'success' | 'error' | 'warning';

export interface AnimatedTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  variant?: TextAreaVariant;
  size?: TextAreaSize;
  state?: TextAreaState;
  helperText?: string;
  loading?: boolean;
  glowOnFocus?: boolean;
  characterCount?: boolean;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
}

// Size configurations
const sizeConfig = {
  sm: {
    textarea: 'px-3 py-2 text-sm',
    label: 'text-sm',
    helper: 'text-xs',
    minHeight: 'min-h-[80px]',
  },
  md: {
    textarea: 'px-4 py-3 text-base',
    label: 'text-base',
    helper: 'text-sm',
    minHeight: 'min-h-[100px]',
  },
  lg: {
    textarea: 'px-5 py-4 text-lg',
    label: 'text-lg',
    helper: 'text-base',
    minHeight: 'min-h-[120px]',
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
    base: 'bg-gradient-to-br from-roko-dark/90 to-roko-primary/5 border rounded-lg',
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
} as const;

// Loading spinner component
const LoadingSpinner: React.FC<{ size: TextAreaSize }> = ({ size }) => {
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

// Typing indicator for cyberpunk variant
const TypingIndicator: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <motion.div
      className="absolute bottom-2 right-2 flex space-x-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: durations.fast }}
    >
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-roko-accent rounded-full"
          animate={isActive ? {
            y: [0, -4, 0],
            opacity: [0.4, 1, 0.4],
          } : {}}
          transition={{
            duration: 0.6,
            delay: i * 0.2,
            repeat: isActive ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
};

// Data stream effect for cyberpunk variant
const DataStream: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const streamLines = Array.from({ length: 3 }, (_, i) => i);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none">
      {streamLines.map((line) => (
        <motion.div
          key={line}
          className="absolute w-px h-4 bg-gradient-to-b from-roko-accent to-transparent"
          style={{
            left: `${20 + line * 30}%`,
            top: 0,
          }}
          animate={isActive ? {
            y: ['0%', '200%'],
            opacity: [0, 1, 0],
          } : {}}
          transition={{
            duration: 1.5,
            delay: line * 0.3,
            repeat: isActive ? Infinity : 0,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

// Main textarea component
export const AnimatedTextArea = forwardRef<HTMLTextAreaElement, AnimatedTextAreaProps>(
  (
    {
      label,
      variant = 'default',
      size = 'md',
      state = 'default',
      helperText,
      loading = false,
      glowOnFocus = true,
      characterCount = false,
      autoResize = false,
      minRows = 3,
      maxRows = 8,
      className,
      onFocus,
      onBlur,
      onChange,
      value,
      maxLength,
      rows,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const [isTyping, setIsTyping] = useState(false);

    const prefersReducedMotion = useReducedMotion();
    const shouldUseReducedMotion = prefersReducedMotion || shouldReduceMotion();

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    // Motion values for glow effect
    const glowOpacity = useMotionValue(0);
    const glowScale = useMotionValue(1);

    // Get configurations
    const sizeStyles = sizeConfig[size];
    const stateStyles = stateConfig[state];
    const variantStyles = variantConfig[variant];

    // Auto-resize functionality
    const adjustHeight = useCallback(() => {
      if (!autoResize || !textareaRef.current) return;

      const textarea = textareaRef.current;
      textarea.style.height = 'auto';

      const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
      const minHeight = lineHeight * minRows;
      const maxHeight = lineHeight * maxRows;

      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);

      textarea.style.height = `${newHeight}px`;
    }, [autoResize, minRows, maxRows]);

    // Handle focus
    const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);

      if (!shouldUseReducedMotion && glowOnFocus) {
        glowOpacity.set(1);
        glowScale.set(1.01);
      }

      onFocus?.(event);
    };

    // Handle blur
    const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      setIsTyping(false);

      if (!shouldUseReducedMotion && glowOnFocus) {
        glowOpacity.set(0);
        glowScale.set(1);
      }

      onBlur?.(event);
    };

    // Handle change
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      setHasValue(newValue.length > 0);
      setCharCount(newValue.length);
      setIsTyping(true);

      // Clear previous typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to hide typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);

      adjustHeight();
      onChange?.(event);
    };

    // Check initial value and adjust height
    useEffect(() => {
      const currentValue = value || (textareaRef.current?.value) || '';
      setHasValue(String(currentValue).length > 0);
      setCharCount(String(currentValue).length);
      adjustHeight();
    }, [value, adjustHeight]);

    // Cleanup typing timeout on unmount
    useEffect(() => {
      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }, []);

    // Dynamic glow effect
    const glowEffect = useMotionTemplate`
      0 0 20px ${stateStyles.glow},
      0 0 40px ${stateStyles.glow}
    `;

    // Build class names
    const containerClasses = clsx('relative w-full');

    const textareaWrapperClasses = clsx(
      'relative',
      'transition-all duration-300 ease-out',
      'overflow-hidden',
      variantStyles.base,
      variantStyles.backdrop,
      stateStyles.border,
      isFocused && stateStyles.focus,
      className
    );

    const textareaClasses = clsx(
      'w-full bg-transparent resize-none',
      'text-roko-tertiary placeholder-roko-primary/50',
      'focus:outline-none',
      'transition-all duration-300 ease-out',
      sizeStyles.textarea,
      sizeStyles.minHeight,
      loading && 'pr-10'
    );

    const labelClasses = clsx(
      'block mb-2 transition-all duration-300 ease-out',
      'text-roko-primary font-medium',
      sizeStyles.label
    );

    const helperClasses = clsx(
      'mt-2 transition-all duration-300',
      sizeStyles.helper,
      stateStyles.text
    );

    return (
      <div className={containerClasses}>
        {/* Label */}
        {label && (
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

        {/* TextArea wrapper */}
        <motion.div
          className={textareaWrapperClasses}
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
              {/* Data stream for cyberpunk variant */}
              {variant === 'cyberpunk' && (
                <DataStream isActive={isFocused && hasValue} />
              )}

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

          {/* TextArea field */}
          <textarea
            ref={(node) => {
              textareaRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            className={textareaClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            value={value}
            maxLength={maxLength}
            rows={autoResize ? undefined : rows || minRows}
            {...props}
          />

          {/* Loading indicator */}
          {loading && (
            <motion.div
              className="absolute top-3 right-3 text-roko-accent"
              animate={{
                scale: isFocused ? 1.1 : 1,
              }}
              transition={{ duration: durations.fast }}
            >
              <LoadingSpinner size={size} />
            </motion.div>
          )}

          {/* Typing indicator for cyberpunk variant */}
          {variant === 'cyberpunk' && !loading && (
            <TypingIndicator isActive={isTyping && isFocused} />
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

AnimatedTextArea.displayName = 'AnimatedTextArea';

// Convenience components for common textarea types
export const CyberpunkTextArea: React.FC<Omit<AnimatedTextAreaProps, 'variant'>> = (props) => (
  <AnimatedTextArea variant="cyberpunk" glowOnFocus autoResize {...props} />
);

export const GlassTextArea: React.FC<Omit<AnimatedTextAreaProps, 'variant'>> = (props) => (
  <AnimatedTextArea variant="glass" autoResize {...props} />
);

export default AnimatedTextArea;