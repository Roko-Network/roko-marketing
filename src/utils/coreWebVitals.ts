/**
 * Core Web Vitals Optimization for ROKO Network
 * LCP, INP, and CLS optimization strategies
 */

interface LCPOptimizationConfig {
  preloadCriticalImages: boolean;
  optimizeHeroSection: boolean;
  inlineCriticalCSS: boolean;
  preconnectOrigins: string[];
  prioritizeAboveFold: boolean;
}

interface INPOptimizationConfig {
  debounceTime: number;
  enableOptimisticUI: boolean;
  batchUpdates: boolean;
  useTransition: boolean;
  minimizeMainThreadWork: boolean;
}

interface CLSOptimizationConfig {
  reserveSpace: boolean;
  preloadFonts: boolean;
  stabilizeImages: boolean;
  avoidDynamicContent: boolean;
  useTransform: boolean;
}

/**
 * Largest Contentful Paint (LCP) Optimizer
 */
export class LCPOptimizer {
  private config: LCPOptimizationConfig;
  private observer: IntersectionObserver | null = null;
  private preloadedImages: Set<string> = new Set();

  constructor(config?: Partial<LCPOptimizationConfig>) {
    this.config = {
      preloadCriticalImages: true,
      optimizeHeroSection: true,
      inlineCriticalCSS: true,
      preconnectOrigins: ['https://fonts.googleapis.com', 'https://api.roko.network'],
      prioritizeAboveFold: true,
      ...config
    };

    this.initialize();
  }

  private initialize(): void {
    if (this.config.preconnectOrigins.length > 0) {
      this.setupPreconnections();
    }

    if (this.config.preloadCriticalImages) {
      this.setupImagePreloading();
    }

    if (this.config.optimizeHeroSection) {
      this.optimizeHeroSection();
    }

    if (this.config.inlineCriticalCSS) {
      this.inlineCriticalStyles();
    }
  }

  private setupPreconnections(): void {
    this.config.preconnectOrigins.forEach(origin => {
      if (!document.querySelector(`link[href="${origin}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = origin;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });
  }

  private setupImagePreloading(): void {
    // Preload hero images and critical above-the-fold images
    const criticalImages = document.querySelectorAll('img[data-priority="high"], .hero img, .above-fold img');

    criticalImages.forEach((img) => {
      const imgElement = img as HTMLImageElement;
      if (imgElement.src && !this.preloadedImages.has(imgElement.src)) {
        this.preloadImage(imgElement.src, {
          fetchpriority: 'high',
          as: 'image'
        });
        this.preloadedImages.add(imgElement.src);
      }
    });
  }

  private preloadImage(src: string, options: { fetchpriority?: string; as?: string } = {}): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = options.as || 'image';

    if (options.fetchpriority) {
      link.setAttribute('fetchpriority', options.fetchpriority);
    }

    document.head.appendChild(link);
  }

  private optimizeHeroSection(): void {
    // Find hero section and optimize its loading
    const heroSection = document.querySelector('.hero, [data-hero], .hero-section');
    if (heroSection) {
      // Ensure hero content is immediately visible
      const heroImages = heroSection.querySelectorAll('img');
      heroImages.forEach((img) => {
        img.loading = 'eager';
        img.decoding = 'sync';
        img.setAttribute('fetchpriority', 'high');
      });

      // Optimize hero text rendering
      const heroText = heroSection.querySelectorAll('h1, h2, .hero-title');
      heroText.forEach((element) => {
        // Font display should be set in CSS, but we can add will-change for performance
        (element as HTMLElement).style.willChange = 'contents';
      });
    }
  }

  private inlineCriticalStyles(): void {
    // This would typically be done at build time, but we can optimize runtime
    const criticalSelectors = [
      '.hero',
      '.above-fold',
      'header',
      '.navigation',
      '.container',
      'h1, h2, h3',
      '.btn-primary'
    ];

    const inlineStyles = document.createElement('style');
    inlineStyles.textContent = `
      /* Critical above-the-fold styles */
      .hero { min-height: 100vh; display: flex; align-items: center; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
      h1, h2, h3 { font-family: 'Rajdhani', sans-serif; font-weight: 600; }
      .btn-primary { background: #00d4aa; color: #000; padding: 12px 24px; border-radius: 6px; }
      .navigation { position: fixed; top: 0; width: 100%; z-index: 1000; }

      /* Prevent layout shifts */
      img { width: 100%; height: auto; }
      .loading-placeholder { background: #1f2937; min-height: 200px; }
    `;

    document.head.insertBefore(inlineStyles, document.head.firstChild);
  }

  public markLCPCandidate(element: HTMLElement): void {
    // Mark an element as a potential LCP candidate
    element.setAttribute('data-lcp-candidate', 'true');

    if (element.tagName === 'IMG') {
      const img = element as HTMLImageElement;
      img.loading = 'eager';
      img.decoding = 'sync';
      img.setAttribute('fetchpriority', 'high');

      if (img.src && !this.preloadedImages.has(img.src)) {
        this.preloadImage(img.src, { fetchpriority: 'high' });
        this.preloadedImages.add(img.src);
      }
    }
  }

  public optimizeResourceHints(): void {
    // Add resource hints for better LCP
    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//api.roko.network' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
    ];

    hints.forEach(hint => {
      if (!document.querySelector(`link[href="${hint.href}"]`)) {
        const link = document.createElement('link');
        link.rel = hint.rel;
        link.href = hint.href;
        if ('crossorigin' in hint) {
          link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
      }
    });
  }
}

/**
 * Interaction to Next Paint (INP) Optimizer
 */
export class INPOptimizer {
  private config: INPOptimizationConfig;
  private debouncedHandlers: Map<string, (...args: any[]) => void> = new Map();
  private scheduler: any; // For React 18+ concurrent features

  constructor(config?: Partial<INPOptimizationConfig>) {
    this.config = {
      debounceTime: 16, // ~60fps
      enableOptimisticUI: true,
      batchUpdates: true,
      useTransition: true,
      minimizeMainThreadWork: true,
      ...config
    };

    this.initialize();
  }

  private initialize(): void {
    if (this.config.batchUpdates) {
      this.setupBatchedUpdates();
    }

    if (this.config.minimizeMainThreadWork) {
      this.setupTaskScheduling();
    }
  }

  private setupBatchedUpdates(): void {
    // Batch DOM updates to minimize reflows
    let updateQueue: (() => void)[] = [];
    let isUpdateScheduled = false;

    (window as any).batchDOMUpdates = (callback: () => void) => {
      updateQueue.push(callback);

      if (!isUpdateScheduled) {
        isUpdateScheduled = true;
        requestAnimationFrame(() => {
          updateQueue.forEach(update => update());
          updateQueue = [];
          isUpdateScheduled = false;
        });
      }
    };
  }

  private setupTaskScheduling(): void {
    // Use postMessage or MessageChannel for task scheduling
    if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
      this.scheduler = (window as any).scheduler;
    } else {
      // Polyfill with MessageChannel
      this.setupMessageChannelScheduler();
    }
  }

  private setupMessageChannelScheduler(): void {
    const channel = new MessageChannel();
    const port1 = channel.port1;
    const port2 = channel.port2;

    let taskQueue: (() => void)[] = [];
    let isMessageLoopRunning = false;

    port2.onmessage = () => {
      if (taskQueue.length > 0) {
        const task = taskQueue.shift();
        task?.();

        if (taskQueue.length > 0) {
          port1.postMessage(null);
        } else {
          isMessageLoopRunning = false;
        }
      }
    };

    (window as any).scheduleTask = (callback: () => void, priority: 'user-blocking' | 'user-visible' | 'background' = 'user-visible') => {
      taskQueue.push(callback);

      if (!isMessageLoopRunning) {
        isMessageLoopRunning = true;
        port1.postMessage(null);
      }
    };
  }

  public createDebouncedHandler<T extends (...args: any[]) => void>(
    key: string,
    handler: T,
    delay?: number
  ): T {
    const debounceTime = delay || this.config.debounceTime;

    if (this.debouncedHandlers.has(key)) {
      return this.debouncedHandlers.get(key) as T;
    }

    let timeoutId: number;
    const debouncedFn = (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        handler(...args);
      }, debounceTime);
    };

    this.debouncedHandlers.set(key, debouncedFn);
    return debouncedFn as T;
  }

  public createThrottledHandler<T extends (...args: any[]) => void>(
    key: string,
    handler: T,
    delay?: number
  ): T {
    const throttleTime = delay || this.config.debounceTime;
    let lastCall = 0;

    const throttledFn = (...args: any[]) => {
      const now = Date.now();
      if (now - lastCall >= throttleTime) {
        lastCall = now;
        handler(...args);
      }
    };

    return throttledFn as T;
  }

  public optimizeEventHandlers(element: HTMLElement, eventType: string, handler: EventListener): void {
    const optimizedHandler = this.createDebouncedHandler(
      `${element.tagName}-${eventType}`,
      handler
    );

    // Use passive listeners where appropriate
    const passiveEvents = ['scroll', 'wheel', 'touchstart', 'touchmove', 'touchend'];
    const options = passiveEvents.includes(eventType) ? { passive: true } : false;

    element.addEventListener(eventType, optimizedHandler, options);
  }

  public scheduleNonUrgentWork(callback: () => void): void {
    if (this.scheduler && 'postTask' in this.scheduler) {
      this.scheduler.postTask(callback, { priority: 'background' });
    } else if ('scheduleTask' in window) {
      (window as any).scheduleTask(callback, 'background');
    } else {
      // Fallback to requestIdleCallback or setTimeout
      if ('requestIdleCallback' in window) {
        requestIdleCallback(callback);
      } else {
        setTimeout(callback, 0);
      }
    }
  }

  public wrapInTransition(callback: () => void): void {
    // For React 18+ startTransition
    if ('React' in window && (window as any).React.startTransition) {
      (window as any).React.startTransition(callback);
    } else {
      // Fallback to regular execution
      callback();
    }
  }
}

/**
 * Cumulative Layout Shift (CLS) Optimizer
 */
export class CLSOptimizer {
  private config: CLSOptimizationConfig;
  private observer: ResizeObserver | null = null;
  private fontLoadObserver: any | null = null;

  constructor(config?: Partial<CLSOptimizationConfig>) {
    this.config = {
      reserveSpace: true,
      preloadFonts: true,
      stabilizeImages: true,
      avoidDynamicContent: false,
      useTransform: true,
      ...config
    };

    this.initialize();
  }

  private initialize(): void {
    if (this.config.preloadFonts) {
      this.preloadFonts();
    }

    if (this.config.stabilizeImages) {
      this.stabilizeImages();
    }

    if (this.config.reserveSpace) {
      this.setupSpaceReservation();
    }

    this.setupFontLoadHandling();
  }

  private preloadFonts(): void {
    const fontUrls = [
      'https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap'
    ];

    fontUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = 'style';
      link.onload = () => {
        link.rel = 'stylesheet';
      };
      document.head.appendChild(link);
    });

    // Preload font files directly
    const fontFiles = [
      'https://fonts.gstatic.com/s/rajdhani/v15/LDI2apCSOBg7S-QT7q4AOeekWPI.woff2'
    ];

    fontFiles.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  private stabilizeImages(): void {
    const images = document.querySelectorAll('img:not([width]):not([height])');

    images.forEach((img) => {
      const imgElement = img as HTMLImageElement;

      // Set placeholder dimensions
      if (!imgElement.style.width && !imgElement.style.height) {
        imgElement.style.minHeight = '200px';
        imgElement.style.backgroundColor = '#1f2937';
      }

      // Use aspect ratio containers
      if (!imgElement.parentElement?.classList.contains('aspect-ratio-container')) {
        const container = document.createElement('div');
        container.className = 'aspect-ratio-container';
        container.style.cssText = `
          position: relative;
          width: 100%;
          height: 0;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          overflow: hidden;
        `;

        imgElement.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        `;

        imgElement.parentNode?.insertBefore(container, imgElement);
        container.appendChild(imgElement);
      }
    });
  }

  private setupSpaceReservation(): void {
    // Add CSS for space reservation
    const style = document.createElement('style');
    style.textContent = `
      /* CLS Prevention Styles */
      .skeleton {
        background: linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }

      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      .aspect-ratio-16-9 {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%;
      }

      .aspect-ratio-4-3 {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 75%;
      }

      .aspect-ratio-1-1 {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 100%;
      }

      /* Prevent layout shifts from dynamic content */
      .dynamic-content {
        min-height: 100px;
        transition: all 0.3s ease;
      }

      /* Font loading optimization */
      .font-loading {
        font-display: swap;
        visibility: hidden;
      }

      .font-loaded {
        visibility: visible;
      }
    `;
    document.head.appendChild(style);
  }

  private setupFontLoadHandling(): void {
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded');

        // Remove font loading placeholders
        const fontLoadingElements = document.querySelectorAll('.font-loading');
        fontLoadingElements.forEach(el => {
          el.classList.remove('font-loading');
          el.classList.add('font-loaded');
        });
      });
    }
  }

  public reserveSpace(element: HTMLElement, dimensions: { width?: number; height?: number }): void {
    if (dimensions.width) {
      element.style.width = `${dimensions.width}px`;
    }
    if (dimensions.height) {
      element.style.height = `${dimensions.height}px`;
    }
  }

  public createSkeletonLoader(
    targetElement: HTMLElement,
    config: { width?: string; height?: string; aspectRatio?: string } = {}
  ): HTMLElement {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton';
    skeleton.style.cssText = `
      width: ${config.width || '100%'};
      height: ${config.height || '200px'};
      border-radius: 8px;
      ${config.aspectRatio ? `aspect-ratio: ${config.aspectRatio};` : ''}
    `;

    targetElement.appendChild(skeleton);
    return skeleton;
  }

  public preventLayoutShift(callback: () => void): void {
    // Measure before change
    const beforeHeight = document.body.scrollHeight;

    callback();

    // Measure after change and adjust if needed
    const afterHeight = document.body.scrollHeight;
    const heightDiff = afterHeight - beforeHeight;

    if (heightDiff !== 0 && this.config.useTransform) {
      // Use transform to prevent layout shift
      document.body.style.transform = `translateY(${-heightDiff}px)`;

      requestAnimationFrame(() => {
        document.body.style.transform = '';
        document.body.style.transition = 'transform 0.3s ease';

        setTimeout(() => {
          document.body.style.transition = '';
        }, 300);
      });
    }
  }
}

/**
 * Combined Core Web Vitals Optimizer
 */
export class CoreWebVitalsOptimizer {
  private lcpOptimizer: LCPOptimizer;
  private inpOptimizer: INPOptimizer;
  private clsOptimizer: CLSOptimizer;

  constructor(config?: {
    lcp?: Partial<LCPOptimizationConfig>;
    inp?: Partial<INPOptimizationConfig>;
    cls?: Partial<CLSOptimizationConfig>;
  }) {
    this.lcpOptimizer = new LCPOptimizer(config?.lcp);
    this.inpOptimizer = new INPOptimizer(config?.inp);
    this.clsOptimizer = new CLSOptimizer(config?.cls);
  }

  public optimizeLCP = {
    markCandidate: (element: HTMLElement) => this.lcpOptimizer.markLCPCandidate(element),
    optimizeResourceHints: () => this.lcpOptimizer.optimizeResourceHints()
  };

  public optimizeINP = {
    createDebouncedHandler: <T extends (...args: any[]) => void>(key: string, handler: T, delay?: number) =>
      this.inpOptimizer.createDebouncedHandler(key, handler, delay),
    createThrottledHandler: <T extends (...args: any[]) => void>(key: string, handler: T, delay?: number) =>
      this.inpOptimizer.createThrottledHandler(key, handler, delay),
    optimizeEventHandlers: (element: HTMLElement, eventType: string, handler: EventListener) =>
      this.inpOptimizer.optimizeEventHandlers(element, eventType, handler),
    scheduleNonUrgentWork: (callback: () => void) =>
      this.inpOptimizer.scheduleNonUrgentWork(callback),
    wrapInTransition: (callback: () => void) =>
      this.inpOptimizer.wrapInTransition(callback)
  };

  public optimizeCLS = {
    reserveSpace: (element: HTMLElement, dimensions: { width?: number; height?: number }) =>
      this.clsOptimizer.reserveSpace(element, dimensions),
    createSkeletonLoader: (
      targetElement: HTMLElement,
      config?: { width?: string; height?: string; aspectRatio?: string }
    ) => this.clsOptimizer.createSkeletonLoader(targetElement, config),
    preventLayoutShift: (callback: () => void) =>
      this.clsOptimizer.preventLayoutShift(callback)
  };
}

// Classes already exported at definition
export default CoreWebVitalsOptimizer;