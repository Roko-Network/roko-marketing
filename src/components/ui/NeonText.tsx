/**
 * ROKO Network Neon Text Component
 *
 * Cyberpunk-styled text with neon glow effects and temporal animations.
 * Supports various glow intensities and animation patterns.
 */

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import styles from './NeonText.module.css';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface NeonTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Text content */
  children: React.ReactNode;
  /** Neon color variant */
  color?: 'accent' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'custom';
  /** Custom color (when color is 'custom') */
  customColor?: string;
  /** Glow intensity */
  intensity?: 'subtle' | 'normal' | 'strong' | 'extreme';
  /** Animation type */
  animation?: 'none' | 'pulse' | 'flicker' | 'glitch' | 'temporal' | 'breathe';
  /** Animation speed */
  speed?: 'slow' | 'normal' | 'fast';
  /** Text size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  /** Font weight */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /** Text transform */
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Letter spacing */
  spacing?: 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
  /** Enable stroke effect */
  stroke?: boolean;
  /** Enable holographic effect */
  holographic?: boolean;
  /** Custom className */
  className?: string;
}

// =============================================================================
// NEON TEXT COMPONENT
// =============================================================================

export const NeonText = forwardRef<HTMLSpanElement, NeonTextProps>(
  (
    {
      children,
      color = 'accent',
      customColor,
      intensity = 'normal',
      animation = 'none',
      speed = 'normal',
      size = 'md',
      weight = 'normal',
      transform = 'none',
      spacing = 'normal',
      stroke = false,
      holographic = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const neonClasses = clsx(
      styles.neonText,
      styles[`neonText--color-${color}`],
      styles[`neonText--intensity-${intensity}`],
      styles[`neonText--animation-${animation}`],
      styles[`neonText--speed-${speed}`],
      styles[`neonText--size-${size}`],
      styles[`neonText--weight-${weight}`],
      styles[`neonText--transform-${transform}`],
      styles[`neonText--spacing-${spacing}`],
      {
        [styles['neonText--stroke']]: stroke,
        [styles['neonText--holographic']]: holographic,
      },
      className
    );

    const customStyle = customColor && color === 'custom'
      ? {
          '--custom-neon-color': customColor,
          ...style,
        }
      : style;

    return (
      <span
        ref={ref}
        className={neonClasses}
        style={customStyle}
        {...props}
      >
        {children}
        {holographic && (
          <span className={styles.holographicOverlay} aria-hidden="true">
            {children}
          </span>
        )}
      </span>
    );
  }
);

NeonText.displayName = 'NeonText';

// =============================================================================
// GLITCH TEXT COMPONENT
// =============================================================================

export interface GlitchTextProps extends Omit<NeonTextProps, 'animation'> {
  /** Glitch effect intensity */
  glitchIntensity?: 'subtle' | 'normal' | 'strong';
  /** Glitch frequency */
  frequency?: 'rare' | 'occasional' | 'frequent';
  /** Enable data corruption effect */
  dataCorruption?: boolean;
}

export const GlitchText = forwardRef<HTMLSpanElement, GlitchTextProps>(
  (
    {
      children,
      glitchIntensity = 'normal',
      frequency = 'occasional',
      dataCorruption = false,
      className,
      ...props
    },
    ref
  ) => {
    const glitchClasses = clsx(
      styles.glitchText,
      styles[`glitchText--intensity-${glitchIntensity}`],
      styles[`glitchText--frequency-${frequency}`],
      {
        [styles['glitchText--corruption']]: dataCorruption,
      },
      className
    );

    return (
      <NeonText
        ref={ref}
        className={glitchClasses}
        animation="glitch"
        {...props}
      >
        <span className={styles.glitchOriginal}>{children}</span>
        <span className={styles.glitchLayer1} aria-hidden="true">{children}</span>
        <span className={styles.glitchLayer2} aria-hidden="true">{children}</span>
        {dataCorruption && (
          <span className={styles.corruptionLayer} aria-hidden="true">
            {typeof children === 'string'
              ? children.replace(/./g, () => Math.random() > 0.7 ? '█' : '▓')
              : '████████'
            }
          </span>
        )}
      </NeonText>
    );
  }
);

GlitchText.displayName = 'GlitchText';

// =============================================================================
// TEMPORAL TEXT COMPONENT
// =============================================================================

export interface TemporalTextProps extends Omit<NeonTextProps, 'animation'> {
  /** Temporal effect type */
  effect?: 'sync' | 'drift' | 'precision' | 'quantum';
  /** Synchronization accuracy indicator */
  accuracy?: number; // 0-100 percentage
  /** Show nanosecond precision */
  showPrecision?: boolean;
}

export const TemporalText = forwardRef<HTMLSpanElement, TemporalTextProps>(
  (
    {
      children,
      effect = 'sync',
      accuracy = 100,
      showPrecision = false,
      className,
      ...props
    },
    ref
  ) => {
    const temporalClasses = clsx(
      styles.temporalText,
      styles[`temporalText--effect-${effect}`],
      {
        [styles['temporalText--precision']]: showPrecision,
      },
      className
    );

    const accuracyLevel = accuracy >= 95 ? 'high' : accuracy >= 80 ? 'medium' : 'low';

    return (
      <NeonText
        ref={ref}
        className={temporalClasses}
        animation="temporal"
        data-accuracy={accuracy}
        data-accuracy-level={accuracyLevel}
        {...props}
      >
        {children}
        {showPrecision && (
          <span className={styles.precisionIndicator} aria-hidden="true">
            <span className={styles.precisionDots}>...</span>
            <span className={styles.precisionValue}>{accuracy.toFixed(6)}%</span>
          </span>
        )}
        <span
          className={styles.syncIndicator}
          data-accuracy-level={accuracyLevel}
          aria-hidden="true"
        />
      </NeonText>
    );
  }
);

TemporalText.displayName = 'TemporalText';

// =============================================================================
// TYPING ANIMATION COMPONENT
// =============================================================================

export interface TypingTextProps extends Omit<NeonTextProps, 'animation' | 'children'> {
  /** Text to type */
  text: string;
  /** Typing speed (characters per minute) */
  speed?: number;
  /** Show cursor */
  cursor?: boolean;
  /** Cursor character */
  cursorChar?: string;
  /** Delay before starting */
  delay?: number;
  /** Loop the animation */
  loop?: boolean;
  /** Callback when typing is complete */
  onComplete?: () => void;
}

export const TypingText = forwardRef<HTMLSpanElement, TypingTextProps>(
  (
    {
      text,
      speed = 60,
      cursor = true,
      cursorChar = '|',
      delay = 0,
      loop = false,
      onComplete,
      className,
      ...props
    },
    ref
  ) => {
    const [displayedText, setDisplayedText] = React.useState('');
    const [isTyping, setIsTyping] = React.useState(false);
    const [showCursor, setShowCursor] = React.useState(true);

    const typingClasses = clsx(
      styles.typingText,
      {
        [styles['typingText--cursor']]: cursor && showCursor,
      },
      className
    );

    React.useEffect(() => {
      let timeoutId: NodeJS.Timeout;

      const startTyping = () => {
        setIsTyping(true);
        let currentIndex = 0;

        const typeCharacter = () => {
          if (currentIndex < text.length) {
            setDisplayedText(text.slice(0, currentIndex + 1));
            currentIndex++;
            timeoutId = setTimeout(typeCharacter, 60000 / speed);
          } else {
            setIsTyping(false);
            onComplete?.();

            if (loop) {
              timeoutId = setTimeout(() => {
                setDisplayedText('');
                startTyping();
              }, 2000);
            }
          }
        };

        typeCharacter();
      };

      if (delay > 0) {
        timeoutId = setTimeout(startTyping, delay);
      } else {
        startTyping();
      }

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }, [text, speed, delay, loop, onComplete]);

    // Cursor blinking effect
    React.useEffect(() => {
      if (!cursor) return;

      const blinkInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);

      return () => clearInterval(blinkInterval);
    }, [cursor]);

    return (
      <NeonText
        ref={ref}
        className={typingClasses}
        {...props}
      >
        {displayedText}
        {cursor && (
          <span
            className={clsx(styles.cursor, {
              [styles['cursor--visible']]: showCursor
            })}
            aria-hidden="true"
          >
            {cursorChar}
          </span>
        )}
      </NeonText>
    );
  }
);

TypingText.displayName = 'TypingText';

// =============================================================================
// EXPORTS
// =============================================================================

export default NeonText;