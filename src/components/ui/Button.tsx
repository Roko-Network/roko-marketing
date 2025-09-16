/**
 * ROKO Network Button Component
 *
 * Cyberpunk-styled button with holographic effects and accessibility features.
 * Implements the nanosecond precision temporal theme with advanced animations.
 */

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import styles from './Button.module.css';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button visual variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'temporal';
  /** Button size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Show loading state */
  loading?: boolean;
  /** Loading text (for screen readers) */
  loadingText?: string;
  /** Icon to display before text */
  iconLeft?: React.ReactNode;
  /** Icon to display after text */
  iconRight?: React.ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Enable holographic effect */
  holographic?: boolean;
  /** Enable temporal glow animation */
  temporal?: boolean;
  /** Cyberpunk glitch effect on hover */
  glitch?: boolean;
  /** Custom className */
  className?: string;
  /** Children content */
  children: React.ReactNode;
}

// =============================================================================
// BUTTON COMPONENT
// =============================================================================

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      loadingText = 'Loading...',
      iconLeft,
      iconRight,
      fullWidth = false,
      holographic = false,
      temporal = false,
      glitch = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const buttonClasses = clsx(
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      {
        [styles['button--loading']]: loading,
        [styles['button--disabled']]: isDisabled,
        [styles['button--full-width']]: fullWidth,
        [styles['button--holographic']]: holographic,
        [styles['button--temporal']]: temporal,
        [styles['button--glitch']]: glitch,
      },
      className
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-describedby={loading ? 'button-loading' : undefined}
        {...props}
      >
        {/* Loading Spinner */}
        {loading && (
          <span className={styles.loadingSpinner} aria-hidden="true">
            <svg
              className={styles.spinner}
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="32"
                strokeDashoffset="32"
              />
            </svg>
          </span>
        )}

        {/* Left Icon */}
        {iconLeft && !loading && (
          <span className={styles.iconLeft} aria-hidden="true">
            {iconLeft}
          </span>
        )}

        {/* Button Content */}
        <span className={styles.content}>
          {loading ? loadingText : children}
        </span>

        {/* Right Icon */}
        {iconRight && !loading && (
          <span className={styles.iconRight} aria-hidden="true">
            {iconRight}
          </span>
        )}

        {/* Holographic Effect */}
        {holographic && <span className={styles.holographicShine} aria-hidden="true" />}

        {/* Temporal Particles */}
        {temporal && (
          <div className={styles.temporalParticles} aria-hidden="true">
            <span className={styles.particle} />
            <span className={styles.particle} />
            <span className={styles.particle} />
          </div>
        )}

        {/* Screen Reader Loading Announcement */}
        {loading && (
          <span id="button-loading" className="sr-only">
            {loadingText}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// =============================================================================
// ICON BUTTON VARIANT
// =============================================================================

export interface IconButtonProps
  extends Omit<ButtonProps, 'iconLeft' | 'iconRight' | 'children'> {
  /** Icon content */
  icon: React.ReactNode;
  /** Accessibility label */
  'aria-label': string;
  /** Tooltip text */
  tooltip?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, tooltip, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={clsx(styles.iconButton, className)}
        title={tooltip}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

// =============================================================================
// BUTTON GROUP COMPONENT
// =============================================================================

export interface ButtonGroupProps {
  /** Button alignment */
  align?: 'left' | 'center' | 'right';
  /** Spacing between buttons */
  spacing?: 'sm' | 'md' | 'lg';
  /** Vertical stacking on mobile */
  stackOnMobile?: boolean;
  /** Custom className */
  className?: string;
  /** Children buttons */
  children: React.ReactNode;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  align = 'left',
  spacing = 'md',
  stackOnMobile = true,
  className,
  children,
}) => {
  const groupClasses = clsx(
    styles.buttonGroup,
    styles[`buttonGroup--${align}`],
    styles[`buttonGroup--spacing-${spacing}`],
    {
      [styles['buttonGroup--stack-mobile']]: stackOnMobile,
    },
    className
  );

  return <div className={groupClasses}>{children}</div>;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default Button;