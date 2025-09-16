/**
 * LazyLoad Component for ROKO Network
 * Progressive enhancement with optimized loading strategies
 */

import React, {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  memo,
  ReactNode,
  LazyExoticComponent,
  ComponentType
} from 'react';
import { useInView } from 'react-intersection-observer';
import clsx from 'clsx';

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
  className?: string;
  minHeight?: number;
  placeholder?: ReactNode;
  onEnter?: () => void;
  onExit?: () => void;
  triggerOnce?: boolean;
  fadeIn?: boolean;
  delay?: number;
}

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  formats?: string[];
  sizes?: string;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: ReactNode;
}

interface LazyComponentProps<T = {}> {
  loader: () => Promise<{ default: ComponentType<T> }>;
  props?: T;
  fallback?: ReactNode;
  errorBoundary?: ComponentType<{ error: Error; retry: () => void }>;
  retryCount?: number;
  minHeight?: number;
}

/**
 * Base LazyLoad component for content that loads when in viewport
 */
export const LazyLoad = memo<LazyLoadProps>(({
  children,
  fallback = <div className="animate-pulse bg-gray-800 rounded-lg" />,
  rootMargin = '50px',
  threshold = 0.1,
  once = true,
  className,
  minHeight = 200,
  placeholder,
  onEnter,
  onExit,
  triggerOnce = true,
  fadeIn = true,
  delay = 0
}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { ref, inView } = useInView({
    rootMargin,
    threshold,
    triggerOnce,
    onChange: (inView, entry) => {
      if (inView && !hasLoaded) {
        setTimeout(() => {
          setHasLoaded(true);
          setIsVisible(true);
          onEnter?.();
        }, delay);
      } else if (!inView && hasLoaded && !once) {
        setIsVisible(false);
        onExit?.();
      }
    }
  });

  const containerClasses = clsx(
    'lazy-load-container',
    {
      'opacity-0': fadeIn && !isVisible,
      'opacity-100 transition-opacity duration-500 ease-in-out': fadeIn && isVisible,
    },
    className
  );

  return (
    <div
      ref={ref}
      className={containerClasses}
      style={{ minHeight: hasLoaded ? 'auto' : minHeight }}
    >
      {hasLoaded ? children : (placeholder || fallback)}
    </div>
  );
});

LazyLoad.displayName = 'LazyLoad';

/**
 * Optimized LazyImage component with format detection and responsive loading
 */
export const LazyImage = memo<LazyImageProps>(({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 80,
  formats = ['avif', 'webp', 'jpg'],
  sizes,
  blurDataURL,
  onLoad,
  onError,
  placeholder
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [optimalSrc, setOptimalSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  // Detect optimal format
  useEffect(() => {
    const detectFormat = async () => {
      // Check AVIF support
      const supportsAVIF = await new Promise<boolean>((resolve) => {
        const avif = new Image();
        avif.onload = () => resolve(avif.height === 2);
        avif.onerror = () => resolve(false);
        avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgS0AAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
      });

      // Check WebP support
      const supportsWebP = await new Promise<boolean>((resolve) => {
        const webp = new Image();
        webp.onload = () => resolve(webp.height === 2);
        webp.onerror = () => resolve(false);
        webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
      });

      // Determine optimal format
      let optimalFormat = 'jpg';
      for (const format of formats) {
        if (format === 'avif' && supportsAVIF) {
          optimalFormat = format;
          break;
        }
        if (format === 'webp' && supportsWebP) {
          optimalFormat = format;
          break;
        }
      }

      // Update src with optimal format
      const newSrc = src.replace(/\.(jpg|jpeg|png|webp|avif)(\?|$)/, `.${optimalFormat}$2`);
      setOptimalSrc(newSrc);
    };

    if (!priority) {
      detectFormat();
    }
  }, [src, formats, priority]);

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
  };

  // Preload critical images
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = src;
      link.as = 'image';
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [priority, src]);

  const imageClasses = clsx(
    'transition-all duration-300',
    {
      'opacity-0': !loaded && !error,
      'opacity-100': loaded,
      'filter blur-sm': !loaded && blurDataURL,
    },
    className
  );

  const placeholderElement = placeholder || (
    <div
      className="animate-pulse bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg"
      style={{
        width: width || '100%',
        height: height || 200,
        background: blurDataURL ? `url(${blurDataURL})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    />
  );

  if (priority) {
    return (
      <picture>
        <source type="image/avif" srcSet={optimalSrc.replace(/\.[^.]+$/, '.avif')} />
        <source type="image/webp" srcSet={optimalSrc.replace(/\.[^.]+$/, '.webp')} />
        <img
          ref={imgRef}
          src={optimalSrc}
          alt={alt}
          width={width}
          height={height}
          className={imageClasses}
          onLoad={handleLoad}
          onError={handleError}
          loading="eager"
          decoding="sync"
          sizes={sizes}
        />
      </picture>
    );
  }

  return (
    <LazyLoad
      minHeight={height || 200}
      placeholder={placeholderElement}
      className="relative overflow-hidden"
    >
      <picture>
        <source type="image/avif" srcSet={optimalSrc.replace(/\.[^.]+$/, '.avif')} />
        <source type="image/webp" srcSet={optimalSrc.replace(/\.[^.]+$/, '.webp')} />
        <img
          ref={imgRef}
          src={optimalSrc}
          alt={alt}
          width={width}
          height={height}
          className={imageClasses}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          sizes={sizes}
        />
      </picture>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400">
          <span className="text-sm">Failed to load image</span>
        </div>
      )}
    </LazyLoad>
  );
});

LazyImage.displayName = 'LazyImage';

/**
 * ErrorBoundary for lazy components
 */
class LazyComponentErrorBoundary extends React.Component<
  {
    children: ReactNode;
    fallback?: ComponentType<{ error: Error; retry: () => void }>;
    onError?: (error: Error) => void;
  },
  { hasError: boolean; error: Error | null; retryCount: number }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LazyComponent Error:', error, errorInfo);
    this.props.onError?.(error);
  }

  retry = () => {
    this.setState({
      hasError: false,
      error: null,
      retryCount: this.state.retryCount + 1
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback;
      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }

      return (
        <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
          <h3 className="font-medium mb-2">Component failed to load</h3>
          <p className="text-sm mb-3">{this.state.error.message}</p>
          <button
            onClick={this.retry}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm transition-colors"
          >
            Retry ({this.state.retryCount + 1})
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * LazyComponent for code-split components with error handling and retry logic
 */
export function LazyComponent<T = {}>({
  loader,
  props = {} as T,
  fallback = <div className="animate-pulse bg-gray-800 rounded-lg h-32" />,
  errorBoundary,
  retryCount = 3,
  minHeight = 200
}: LazyComponentProps<T>) {
  const [Component, setComponent] = useState<LazyExoticComponent<ComponentType<T>> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [attempts, setAttempts] = useState(0);

  const loadComponent = async () => {
    if (attempts >= retryCount) return;

    setLoading(true);
    setError(null);

    try {
      const LazyComp = lazy(loader);
      setComponent(LazyComp);
    } catch (err) {
      setError(err as Error);
      setAttempts(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComponent();
  }, [attempts]);

  const retry = () => {
    setAttempts(0);
    loadComponent();
  };

  if (error && attempts >= retryCount) {
    const ErrorComponent = errorBoundary;
    if (ErrorComponent) {
      return <ErrorComponent error={error} retry={retry} />;
    }

    return (
      <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
        <h3 className="font-medium mb-2">Failed to load component</h3>
        <p className="text-sm mb-3">{error.message}</p>
        <button
          onClick={retry}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <LazyLoad minHeight={minHeight}>
      <LazyComponentErrorBoundary fallback={errorBoundary}>
        <Suspense fallback={fallback}>
          {Component && <Component {...props} />}
        </Suspense>
      </LazyComponentErrorBoundary>
    </LazyLoad>
  );
}

/**
 * Higher-order component for lazy loading
 */
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  lazyOptions?: Omit<LazyLoadProps, 'children'>
) {
  const LazyWrappedComponent = (props: P) => (
    <LazyLoad {...lazyOptions}>
      <Component {...props} />
    </LazyLoad>
  );

  LazyWrappedComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;

  return memo(LazyWrappedComponent);
}

/**
 * Hook for progressive image enhancement
 */
export function useProgressiveImage(src: string, placeholderSrc?: string) {
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc || src);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setCurrentSrc(src);
      setLoading(false);
    };
    img.src = src;
  }, [src]);

  return { src: currentSrc, loading };
}

/**
 * Performance-optimized lazy loading utilities
 */
export const lazyLoadUtils = {
  LazyLoad,
  LazyImage,
  LazyComponent,
  withLazyLoading,
  useProgressiveImage
};

export default LazyLoad;