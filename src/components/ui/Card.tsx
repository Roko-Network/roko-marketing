/**
 * ROKO Network Card Component
 *
 * Glassmorphism card with cyberpunk styling and temporal effects.
 * Supports various layouts and interactive states.
 */

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import styles from './Card.module.css';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card visual variant */
  variant?: 'default' | 'elevated' | 'outlined' | 'temporal' | 'holographic';
  /** Card size/padding */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Enable hover effects */
  hoverable?: boolean;
  /** Enable glow effect */
  glow?: boolean;
  /** Enable temporal animation */
  temporal?: boolean;
  /** Enable holographic border effect */
  holographic?: boolean;
  /** Card background blur intensity */
  blur?: 'light' | 'medium' | 'heavy';
  /** Custom className */
  className?: string;
  /** Children content */
  children: React.ReactNode;
}

// =============================================================================
// CARD COMPONENT
// =============================================================================

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      size = 'md',
      hoverable = false,
      glow = false,
      temporal = false,
      holographic = false,
      blur = 'medium',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const cardClasses = clsx(
      styles.card,
      styles[`card--${variant}`],
      styles[`card--${size}`],
      styles[`card--blur-${blur}`],
      {
        [styles['card--hoverable']]: hoverable,
        [styles['card--glow']]: glow,
        [styles['card--temporal']]: temporal,
        [styles['card--holographic']]: holographic,
      },
      className
    );

    return (
      <div ref={ref} className={cardClasses} {...props}>
        {children}

        {/* Holographic border effect */}
        {holographic && (
          <div className={styles.holographicBorder} aria-hidden="true" />
        )}

        {/* Temporal particles */}
        {temporal && (
          <div className={styles.temporalOverlay} aria-hidden="true">
            <div className={styles.temporalParticle} />
            <div className={styles.temporalParticle} />
            <div className={styles.temporalParticle} />
            <div className={styles.temporalParticle} />
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

// =============================================================================
// CARD HEADER COMPONENT
// =============================================================================

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header title */
  title?: string;
  /** Header subtitle */
  subtitle?: string;
  /** Action element (button, menu, etc.) */
  action?: React.ReactNode;
  /** Custom className */
  className?: string;
  /** Children content */
  children?: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, className, children, ...props }, ref) => {
    const headerClasses = clsx(styles.cardHeader, className);

    return (
      <div ref={ref} className={headerClasses} {...props}>
        {children || (
          <>
            <div className={styles.headerContent}>
              {title && <h3 className={styles.headerTitle}>{title}</h3>}
              {subtitle && <p className={styles.headerSubtitle}>{subtitle}</p>}
            </div>
            {action && <div className={styles.headerAction}>{action}</div>}
          </>
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// =============================================================================
// CARD BODY COMPONENT
// =============================================================================

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Custom padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
  /** Children content */
  children: React.ReactNode;
}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ padding = 'md', className, children, ...props }, ref) => {
    const bodyClasses = clsx(
      styles.cardBody,
      styles[`cardBody--padding-${padding}`],
      className
    );

    return (
      <div ref={ref} className={bodyClasses} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

// =============================================================================
// CARD FOOTER COMPONENT
// =============================================================================

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Footer alignment */
  align?: 'left' | 'center' | 'right' | 'between';
  /** Custom className */
  className?: string;
  /** Children content */
  children: React.ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ align = 'left', className, children, ...props }, ref) => {
    const footerClasses = clsx(
      styles.cardFooter,
      styles[`cardFooter--${align}`],
      className
    );

    return (
      <div ref={ref} className={footerClasses} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

// =============================================================================
// CARD IMAGE COMPONENT
// =============================================================================

export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Image position */
  position?: 'top' | 'bottom' | 'background';
  /** Image aspect ratio */
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto';
  /** Enable parallax effect */
  parallax?: boolean;
  /** Custom className */
  className?: string;
}

export const CardImage = forwardRef<HTMLImageElement, CardImageProps>(
  (
    {
      position = 'top',
      aspectRatio = 'auto',
      parallax = false,
      className,
      alt,
      ...props
    },
    ref
  ) => {
    const imageClasses = clsx(
      styles.cardImage,
      styles[`cardImage--${position}`],
      styles[`cardImage--aspect-${aspectRatio.replace('/', '-')}`],
      {
        [styles['cardImage--parallax']]: parallax,
      },
      className
    );

    const imageWrapperClasses = clsx(styles.cardImageWrapper);

    if (position === 'background') {
      return (
        <div
          className={imageWrapperClasses}
          style={{ backgroundImage: `url(${props.src})` }}
          role="img"
          aria-label={alt}
        />
      );
    }

    return (
      <div className={imageWrapperClasses}>
        <img ref={ref} className={imageClasses} alt={alt} {...props} />
      </div>
    );
  }
);

CardImage.displayName = 'CardImage';

// =============================================================================
// METRIC CARD COMPONENT
// =============================================================================

export interface MetricCardProps extends Omit<CardProps, 'children'> {
  /** Metric label */
  label: string;
  /** Metric value */
  value: string | number;
  /** Value prefix (e.g., $, %) */
  prefix?: string;
  /** Value suffix (e.g., %, ms, s) */
  suffix?: string;
  /** Change indicator */
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period?: string;
  };
  /** Icon for the metric */
  icon?: React.ReactNode;
  /** Custom value color */
  valueColor?: 'default' | 'accent' | 'success' | 'warning' | 'error';
}

export const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      label,
      value,
      prefix,
      suffix,
      change,
      icon,
      valueColor = 'default',
      className,
      ...cardProps
    },
    ref
  ) => {
    const metricClasses = clsx(styles.metricCard, className);
    const valueClasses = clsx(
      styles.metricValue,
      styles[`metricValue--${valueColor}`]
    );

    return (
      <Card ref={ref} className={metricClasses} {...cardProps}>
        <CardBody>
          <div className={styles.metricContent}>
            {icon && <div className={styles.metricIcon}>{icon}</div>}
            <div className={styles.metricData}>
              <div className={styles.metricLabel}>{label}</div>
              <div className={valueClasses}>
                {prefix && <span className={styles.metricPrefix}>{prefix}</span>}
                <span className={styles.metricNumber}>{value}</span>
                {suffix && <span className={styles.metricSuffix}>{suffix}</span>}
              </div>
              {change && (
                <div
                  className={clsx(
                    styles.metricChange,
                    styles[`metricChange--${change.type}`]
                  )}
                >
                  <span className={styles.changeValue}>
                    {change.type === 'increase' ? '+' : change.type === 'decrease' ? '-' : ''}
                    {Math.abs(change.value)}%
                  </span>
                  {change.period && (
                    <span className={styles.changePeriod}>{change.period}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
);

MetricCard.displayName = 'MetricCard';

// =============================================================================
// FEATURE CARD COMPONENT
// =============================================================================

export interface FeatureCardProps extends Omit<CardProps, 'children'> {
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Feature icon */
  icon?: React.ReactNode;
  /** Feature image */
  image?: string;
  /** Call-to-action */
  cta?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  /** Tags/badges */
  tags?: string[];
}

export const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  (
    {
      title,
      description,
      icon,
      image,
      cta,
      tags,
      className,
      ...cardProps
    },
    ref
  ) => {
    const featureClasses = clsx(styles.featureCard, className);

    return (
      <Card ref={ref} className={featureClasses} hoverable {...cardProps}>
        {image && <CardImage src={image} alt={title} aspectRatio="16/9" />}

        <CardBody>
          <div className={styles.featureContent}>
            {icon && <div className={styles.featureIcon}>{icon}</div>}
            <h3 className={styles.featureTitle}>{title}</h3>
            <p className={styles.featureDescription}>{description}</p>

            {tags && tags.length > 0 && (
              <div className={styles.featureTags}>
                {tags.map((tag, index) => (
                  <span key={index} className={styles.featureTag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardBody>

        {cta && (
          <CardFooter>
            {cta.href ? (
              <a href={cta.href} className={styles.featureCta}>
                {cta.text}
              </a>
            ) : (
              <button onClick={cta.onClick} className={styles.featureCta}>
                {cta.text}
              </button>
            )}
          </CardFooter>
        )}
      </Card>
    );
  }
);

FeatureCard.displayName = 'FeatureCard';

// =============================================================================
// EXPORTS
// =============================================================================

export default Card;