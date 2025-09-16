/**
 * ROKO Network Temporal Counter Component
 *
 * High-precision temporal counter with nanosecond accuracy and atomic clock aesthetics.
 * Displays real-time temporal synchronization with cyberpunk styling.
 */

import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import styles from './TemporalCounter.module.css';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface TemporalCounterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Counter value */
  value: number;
  /** Target value for animation */
  targetValue?: number;
  /** Value format type */
  format?: 'nanoseconds' | 'microseconds' | 'milliseconds' | 'seconds' | 'custom';
  /** Custom format function */
  formatValue?: (value: number) => string;
  /** Precision level (decimal places) */
  precision?: number;
  /** Counter size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Visual style variant */
  variant?: 'default' | 'atomic' | 'quantum' | 'precision' | 'sync';
  /** Animation type */
  animation?: 'none' | 'count' | 'pulse' | 'drift' | 'glitch';
  /** Animation duration in milliseconds */
  duration?: number;
  /** Enable real-time updates */
  realTime?: boolean;
  /** Update interval for real-time (milliseconds) */
  updateInterval?: number;
  /** Show unit label */
  showUnit?: boolean;
  /** Custom unit label */
  unit?: string;
  /** Enable accuracy indicator */
  showAccuracy?: boolean;
  /** Accuracy percentage (0-100) */
  accuracy?: number;
  /** Enable synchronization status */
  showSyncStatus?: boolean;
  /** Synchronization status */
  syncStatus?: 'synced' | 'syncing' | 'drift' | 'error';
  /** Callback when count animation completes */
  onCountComplete?: () => void;
  /** Custom className */
  className?: string;
}

// =============================================================================
// TEMPORAL COUNTER COMPONENT
// =============================================================================

export const TemporalCounter = forwardRef<HTMLDivElement, TemporalCounterProps>(
  (
    {
      value,
      targetValue,
      format = 'nanoseconds',
      formatValue: customFormatValue,
      precision = 6,
      size = 'md',
      variant = 'default',
      animation = 'count',
      duration = 1000,
      realTime = false,
      updateInterval = 100,
      showUnit = true,
      unit,
      showAccuracy = false,
      accuracy = 100,
      showSyncStatus = false,
      syncStatus = 'synced',
      onCountComplete,
      className,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [isAnimating, setIsAnimating] = useState(false);
    const animationRef = useRef<number>();
    const intervalRef = useRef<NodeJS.Timeout>();

    // Format value based on type
    const formatValue = useCallback((val: number): string => {
      if (customFormatValue) {
        return customFormatValue(val);
      }

      const formattedNumber = val.toFixed(precision);

      switch (format) {
        case 'nanoseconds':
          return `${formattedNumber}`;
        case 'microseconds':
          return `${(val / 1000).toFixed(precision)}`;
        case 'milliseconds':
          return `${(val / 1000000).toFixed(precision)}`;
        case 'seconds':
          return `${(val / 1000000000).toFixed(precision)}`;
        default:
          return formattedNumber;
      }
    }, [customFormatValue, format, precision]);

    // Get unit label
    const getUnit = useCallback((): string => {
      if (unit) return unit;

      switch (format) {
        case 'nanoseconds':
          return 'ns';
        case 'microseconds':
          return 'μs';
        case 'milliseconds':
          return 'ms';
        case 'seconds':
          return 's';
        default:
          return '';
      }
    }, [unit, format]);

    // Animate counter value
    const animateToValue = useCallback((target: number) => {
      const startValue = displayValue;
      const difference = target - startValue;
      const startTime = Date.now();

      setIsAnimating(true);

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (difference * easeOutQuart);

        setDisplayValue(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          onCountComplete?.();
        }
      };

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      animate();
    }, [displayValue, duration, onCountComplete]);

    // Real-time counter
    useEffect(() => {
      if (realTime) {
        intervalRef.current = setInterval(() => {
          setDisplayValue(prev => prev + Math.random() * 1000);
        }, updateInterval);

        return () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        };
      }
      return undefined;
    }, [realTime, updateInterval]);

    // Handle value changes
    useEffect(() => {
      const target = targetValue ?? value;

      if (animation === 'count' && target !== displayValue && !realTime) {
        animateToValue(target);
      } else if (animation === 'none' || realTime) {
        setDisplayValue(target);
      }
    }, [value, targetValue, animation, animateToValue, displayValue, realTime]);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, []);

    const counterClasses = clsx(
      styles.temporalCounter,
      styles[`temporalCounter--${variant}`],
      styles[`temporalCounter--${size}`],
      styles[`temporalCounter--animation-${animation}`],
      {
        [styles['temporalCounter--animating']]: isAnimating,
        [styles['temporalCounter--real-time']]: realTime,
      },
      className
    );

    const accuracyLevel = accuracy >= 95 ? 'high' : accuracy >= 80 ? 'medium' : 'low';

    return (
      <div ref={ref} className={counterClasses} {...props}>
        {/* Main Counter Display */}
        <div className={styles.counterDisplay}>
          <span className={styles.counterValue}>
            {formatValue(displayValue)}
          </span>
          {showUnit && (
            <span className={styles.counterUnit}>
              {getUnit()}
            </span>
          )}
        </div>

        {/* Accuracy Indicator */}
        {showAccuracy && (
          <div className={styles.accuracyIndicator}>
            <div
              className={clsx(
                styles.accuracyBar,
                styles[`accuracyBar--${accuracyLevel}`]
              )}
            >
              <div
                className={styles.accuracyFill}
                style={{ width: `${accuracy}%` }}
              />
            </div>
            <span className={styles.accuracyValue}>
              {accuracy.toFixed(3)}% precision
            </span>
          </div>
        )}

        {/* Synchronization Status */}
        {showSyncStatus && (
          <div className={styles.syncStatus}>
            <div
              className={clsx(
                styles.syncIndicator,
                styles[`syncIndicator--${syncStatus}`]
              )}
            />
            <span className={styles.syncLabel}>
              {syncStatus === 'synced' && 'Synchronized'}
              {syncStatus === 'syncing' && 'Synchronizing...'}
              {syncStatus === 'drift' && 'Drift Detected'}
              {syncStatus === 'error' && 'Sync Error'}
            </span>
          </div>
        )}

        {/* Quantum Particles (for quantum variant) */}
        {variant === 'quantum' && (
          <div className={styles.quantumField} aria-hidden="true">
            <div className={styles.quantumParticle} />
            <div className={styles.quantumParticle} />
            <div className={styles.quantumParticle} />
            <div className={styles.quantumParticle} />
          </div>
        )}

        {/* Atomic Clock Hands (for atomic variant) */}
        {variant === 'atomic' && (
          <div className={styles.atomicClock} aria-hidden="true">
            <div className={styles.clockFace}>
              <div className={styles.clockHand} style={{ transform: `rotate(${(displayValue % 60) * 6}deg)` }} />
              <div className={styles.clockCenter} />
            </div>
          </div>
        )}

        {/* Precision Grid (for precision variant) */}
        {variant === 'precision' && (
          <div className={styles.precisionGrid} aria-hidden="true">
            <div className={styles.gridLines} />
          </div>
        )}
      </div>
    );
  }
);

TemporalCounter.displayName = 'TemporalCounter';

// =============================================================================
// COUNTDOWN TIMER COMPONENT
// =============================================================================

export interface CountdownTimerProps extends Omit<TemporalCounterProps, 'value' | 'targetValue' | 'realTime'> {
  /** Target date/time */
  targetDate: Date;
  /** Callback when countdown reaches zero */
  onComplete?: () => void;
  /** Show individual time units */
  showUnits?: {
    days?: boolean;
    hours?: boolean;
    minutes?: boolean;
    seconds?: boolean;
    milliseconds?: boolean;
  };
}

export const CountdownTimer = forwardRef<HTMLDivElement, CountdownTimerProps>(
  (
    {
      targetDate,
      onComplete,
      showUnits = { days: true, hours: true, minutes: true, seconds: true },
      className,
      ...props
    },
    ref
  ) => {
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
      const updateTimer = () => {
        const now = new Date().getTime();
        const target = targetDate.getTime();
        const remaining = Math.max(0, target - now);

        setTimeRemaining(remaining);

        if (remaining === 0 && !isComplete) {
          setIsComplete(true);
          onComplete?.();
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 100);

      return () => clearInterval(interval);
    }, [targetDate, onComplete, isComplete]);

    const timeUnits = {
      days: Math.floor(timeRemaining / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((timeRemaining % (1000 * 60)) / 1000),
      milliseconds: Math.floor(timeRemaining % 1000),
    };

    const timerClasses = clsx(styles.countdownTimer, className);

    return (
      <div ref={ref} className={timerClasses} {...props}>
        <div className={styles.timerUnits}>
          {showUnits.days && timeUnits.days > 0 && (
            <div className={styles.timerUnit}>
              <TemporalCounter
                value={timeUnits.days}
                format="custom"
                formatValue={(val) => val.toString().padStart(2, '0')}
                animation="none"
                size="md"
                unit="days"
                {...props}
              />
            </div>
          )}
          {showUnits.hours && (
            <div className={styles.timerUnit}>
              <TemporalCounter
                value={timeUnits.hours}
                format="custom"
                formatValue={(val) => val.toString().padStart(2, '0')}
                animation="none"
                size="md"
                unit="hours"
                {...props}
              />
            </div>
          )}
          {showUnits.minutes && (
            <div className={styles.timerUnit}>
              <TemporalCounter
                value={timeUnits.minutes}
                format="custom"
                formatValue={(val) => val.toString().padStart(2, '0')}
                animation="none"
                size="md"
                unit="min"
                {...props}
              />
            </div>
          )}
          {showUnits.seconds && (
            <div className={styles.timerUnit}>
              <TemporalCounter
                value={timeUnits.seconds}
                format="custom"
                formatValue={(val) => val.toString().padStart(2, '0')}
                animation="none"
                size="md"
                unit="sec"
                {...props}
              />
            </div>
          )}
          {showUnits.milliseconds && (
            <div className={styles.timerUnit}>
              <TemporalCounter
                value={timeUnits.milliseconds}
                format="custom"
                formatValue={(val) => val.toString().padStart(3, '0')}
                animation="none"
                size="sm"
                unit="ms"
                {...props}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

CountdownTimer.displayName = 'CountdownTimer';

// =============================================================================
// EXPORTS
// =============================================================================

export default TemporalCounter;