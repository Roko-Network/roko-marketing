/**
 * Performance Monitoring and Web Vitals Tracking for ROKO Network
 * Real-time monitoring with nanosecond precision standards
 */

import { onCLS, onINP, onLCP, onFCP, onTTFB, onFID, Metric } from 'web-vitals';

interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null;
  inp: number | null;
  cls: number | null;

  // Additional metrics
  fcp: number | null;
  ttfb: number | null;
  fid: number | null;

  // Custom metrics
  domContentLoaded: number | null;
  firstPaint: number | null;

  // Resource timing
  resourceLoadTime: Record<string, number>;

  // Navigation timing
  navigationStart: number;
  loadComplete: number | null;

  // 3D performance
  threejsRenderTime: number | null;
  webglContextCreation: number | null;

  // Bundle metrics
  bundleSize: Record<string, number>;
  chunkLoadTimes: Record<string, number>;
}

interface PerformanceBudget {
  lcp: number;          // Largest Contentful Paint < 2.5s
  inp: number;          // Interaction to Next Paint < 200ms
  cls: number;          // Cumulative Layout Shift < 0.1
  fcp: number;          // First Contentful Paint < 1.8s
  ttfb: number;         // Time to First Byte < 600ms
  totalBundleSize: number; // Total bundle size < 250KB
  initialChunkSize: number; // Initial chunk < 50KB
  imageLoadTime: number;    // Image load time < 2s
  threejsInitTime: number;  // Three.js init < 1s
}

interface AlertConfig {
  email?: string;
  webhook?: string;
  console: boolean;
  localStorage: boolean;
}

/**
 * Core Web Vitals Monitor
 */
class WebVitalsMonitor {
  private metrics: PerformanceMetrics;
  private budget: PerformanceBudget;
  private alertConfig: AlertConfig;
  private sessionId: string;
  private startTime: number;
  private observers: Map<string, PerformanceObserver> = new Map();

  constructor(budget?: Partial<PerformanceBudget>, alertConfig?: Partial<AlertConfig>) {
    this.sessionId = this.generateSessionId();
    this.startTime = performance.now();

    this.metrics = {
      lcp: null,
      inp: null,
      cls: null,
      fcp: null,
      ttfb: null,
      fid: null,
      domContentLoaded: null,
      firstPaint: null,
      resourceLoadTime: {},
      navigationStart: performance.timeOrigin,
      loadComplete: null,
      threejsRenderTime: null,
      webglContextCreation: null,
      bundleSize: {},
      chunkLoadTimes: {}
    };

    this.budget = {
      lcp: 2500,
      inp: 200,
      cls: 0.1,
      fcp: 1800,
      ttfb: 600,
      totalBundleSize: 250000, // 250KB
      initialChunkSize: 50000,  // 50KB
      imageLoadTime: 2000,
      threejsInitTime: 1000,
      ...budget
    };

    this.alertConfig = {
      console: true,
      localStorage: true,
      ...alertConfig
    };

    this.initializeMonitoring();
  }

  private generateSessionId(): string {
    return `roko_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeMonitoring(): void {
    // Core Web Vitals
    onLCP((metric) => this.handleMetric('lcp', metric));
    onINP((metric) => this.handleMetric('inp', metric));
    onCLS((metric) => this.handleMetric('cls', metric));
    onFCP((metric) => this.handleMetric('fcp', metric));
    onTTFB((metric) => this.handleMetric('ttfb', metric));
    onFID((metric) => this.handleMetric('fid', metric));

    // Navigation timing
    this.observeNavigationTiming();

    // Resource timing
    this.observeResourceTiming();

    // Paint timing
    this.observePaintTiming();

    // Layout shift tracking
    this.observeLayoutShifts();

    // Long task monitoring
    this.observeLongTasks();

    // Bundle size monitoring
    this.measureBundleSize();

    // Listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.sendBeacon();
      }
    });

    // Send beacon on page unload
    window.addEventListener('beforeunload', () => {
      this.sendBeacon();
    });
  }

  private handleMetric(name: keyof PerformanceMetrics, metric: Metric): void {
    (this.metrics as any)[name] = metric.value;

    this.checkBudget(name, metric.value);
    this.logMetric(name, metric);

    // Real-time reporting for critical metrics
    if (['lcp', 'inp', 'cls'].includes(name)) {
      this.reportMetric(name, metric);
    }
  }

  private observeNavigationTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          this.metrics.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart;
          this.metrics.loadComplete = navEntry.loadEventEnd - (navEntry.activationStart || navEntry.fetchStart);
        }
      });
    });

    observer.observe({ entryTypes: ['navigation'] });
    this.observers.set('navigation', observer);
  }

  private observeResourceTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          const loadTime = resourceEntry.responseEnd - resourceEntry.requestStart;

          // Track different resource types
          if (resourceEntry.name.includes('.js')) {
            this.metrics.chunkLoadTimes[this.getFilename(resourceEntry.name)] = loadTime;
          } else if (this.isImage(resourceEntry.name)) {
            this.metrics.resourceLoadTime[this.getFilename(resourceEntry.name)] = loadTime;

            // Alert if image takes too long
            if (loadTime > this.budget.imageLoadTime) {
              this.alert(`Image load time exceeded: ${resourceEntry.name} took ${loadTime}ms`);
            }
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
    this.observers.set('resource', observer);
  }

  private observePaintTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-paint') {
          this.metrics.firstPaint = entry.startTime;
        }
      });
    });

    observer.observe({ entryTypes: ['paint'] });
    this.observers.set('paint', observer);
  }

  private observeLayoutShifts(): void {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: PerformanceEntry[] = [];

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      entries.forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
          if (!firstSessionEntry || !lastSessionEntry) return;

          if (sessionValue === 0 ||
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += (entry as any).value;
            sessionEntries.push(entry);
          } else {
            clsValue = Math.max(clsValue, sessionValue);
            sessionValue = (entry as any).value;
            sessionEntries = [entry];
          }
        }
      });

      clsValue = Math.max(clsValue, sessionValue);
      this.metrics.cls = clsValue;
    });

    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.set('layout-shift', observer);
  }

  private observeLongTasks(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.duration > 50) { // Long task threshold
          this.alert(`Long task detected: ${entry.duration}ms`, {
            type: 'long-task',
            duration: entry.duration,
            startTime: entry.startTime
          });
        }
      });
    });

    observer.observe({ entryTypes: ['longtask'] });
    this.observers.set('longtask', observer);
  }

  private measureBundleSize(): void {
    // Estimate bundle sizes from loaded resources
    if (performance.getEntriesByType) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      let totalSize = 0;

      resources.forEach((resource) => {
        if (resource.name.includes('.js') || resource.name.includes('.css')) {
          const size = (resource as any).transferSize || (resource as any).encodedBodySize || 0;
          totalSize += size;
          this.metrics.bundleSize[this.getFilename(resource.name)] = size;
        }
      });

      if (totalSize > this.budget.totalBundleSize) {
        this.alert(`Total bundle size exceeded budget: ${totalSize} bytes`);
      }
    }
  }

  private checkBudget(metricName: string, value: number): void {
    const budgetValue = (this.budget as any)[metricName];
    if (budgetValue && value > budgetValue) {
      this.alert(`Performance budget exceeded: ${metricName} = ${value} (budget: ${budgetValue})`);
    }
  }

  private alert(message: string, data?: any): void {
    const alertData = {
      timestamp: Date.now(),
      sessionId: this.sessionId,
      message,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: { ...this.metrics }
    };

    if (this.alertConfig.console) {
      console.warn('ROKO Performance Alert:', alertData);
    }

    if (this.alertConfig.localStorage) {
      const alerts = JSON.parse(localStorage.getItem('roko_performance_alerts') || '[]');
      alerts.push(alertData);
      localStorage.setItem('roko_performance_alerts', JSON.stringify(alerts.slice(-50))); // Keep last 50
    }

    if (this.alertConfig.webhook) {
      fetch(this.alertConfig.webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData)
      }).catch(console.error);
    }
  }

  private logMetric(name: string, metric: Metric): void {
    const entry = {
      timestamp: Date.now(),
      sessionId: this.sessionId,
      name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      entries: metric.entries.map(e => ({
        name: e.name,
        startTime: e.startTime,
        duration: e.duration
      }))
    };

    // Store in session storage for debugging
    const logs = JSON.parse(sessionStorage.getItem('roko_performance_logs') || '[]');
    logs.push(entry);
    sessionStorage.setItem('roko_performance_logs', JSON.stringify(logs.slice(-100))); // Keep last 100
  }

  private reportMetric(name: string, metric: Metric): void {
    // Send to analytics if available
    if ('gtag' in window) {
      (window as any).gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(metric.value),
        custom_map: {
          metric_name: name,
          metric_value: metric.value,
          metric_rating: metric.rating
        }
      });
    }

    // Send to custom analytics endpoint
    this.sendToAnalytics(name, metric);
  }

  private sendToAnalytics(name: string, metric: Metric): void {
    const payload = {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      metric: {
        name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta
      },
      page: {
        url: window.location.href,
        referrer: document.referrer,
        title: document.title
      },
      device: {
        userAgent: navigator.userAgent,
        connection: (navigator as any).connection?.effectiveType || 'unknown',
        memory: (performance as any).memory ? {
          used: (performance as any).memory.usedJSHeapSize,
          total: (performance as any).memory.totalJSHeapSize,
          limit: (performance as any).memory.jsHeapSizeLimit
        } : null
      }
    };

    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/web-vitals', JSON.stringify(payload));
    } else {
      // Fallback to fetch
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {
        // Silently fail if analytics endpoint is not available
      });
    }
  }

  private sendBeacon(): void {
    const finalReport = {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      sessionDuration: performance.now() - this.startTime,
      metrics: { ...this.metrics },
      budget: this.budget,
      violations: this.getBudgetViolations()
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/session-end', JSON.stringify(finalReport));
    }
  }

  private getBudgetViolations(): Array<{ metric: string; value: number; budget: number }> {
    const violations: Array<{metric: string, value: number, budget: number}> = [];

    Object.entries(this.metrics).forEach(([key, value]) => {
      if (value !== null && typeof value === 'number') {
        const budgetValue = (this.budget as any)[key];
        if (budgetValue && value > budgetValue) {
          violations.push({ metric: key, value, budget: budgetValue });
        }
      }
    });

    return violations;
  }

  private getFilename(url: string): string {
    return url.split('/').pop()?.split('?')[0] || url;
  }

  private isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?|$)/i.test(url);
  }

  // Public API
  public trackCustomMetric(name: string, value: number, budget?: number): void {
    (this.metrics as any)[name] = value;

    if (budget && value > budget) {
      this.alert(`Custom metric budget exceeded: ${name} = ${value} (budget: ${budget})`);
    }

    this.logMetric(name, {
      name,
      value,
      rating: 'good', // Custom metrics don't have ratings
      delta: value,
      id: `custom-${name}-${Date.now()}`,
      entries: [],
      navigationType: 'navigate'
    } as Metric);
  }

  public trackThreeJSMetrics(initTime: number, renderTime: number): void {
    this.metrics.webglContextCreation = initTime;
    this.metrics.threejsRenderTime = renderTime;

    if (initTime > this.budget.threejsInitTime) {
      this.alert(`Three.js initialization time exceeded: ${initTime}ms`);
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getBudgetStatus(): { metric: string; value: number; budget: number; status: 'pass' | 'fail' }[] {
    return Object.entries(this.budget).map(([metric, budget]) => {
      const value = (this.metrics as any)[metric];
      return {
        metric,
        value: value || 0,
        budget,
        status: value !== null && value <= budget ? 'pass' : 'fail'
      };
    });
  }

  public destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.sendBeacon();
  }
}

/**
 * Performance Dashboard for Real-time Monitoring
 */
class PerformanceDashboard {
  private container: HTMLElement | null = null;
  private monitor: WebVitalsMonitor;
  private updateInterval: number;

  constructor(monitor: WebVitalsMonitor, containerId?: string) {
    this.monitor = monitor;
    this.updateInterval = window.setInterval(() => this.updateDisplay(), 1000);

    if (containerId) {
      this.container = document.getElementById(containerId);
      this.createDashboard();
    }
  }

  private createDashboard(): void {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="roko-performance-dashboard" style="
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.9);
        color: #00d4aa;
        padding: 16px;
        border-radius: 8px;
        font-family: 'Rajdhani', monospace;
        font-size: 12px;
        min-width: 200px;
        z-index: 10000;
        border: 1px solid #00d4aa;
      ">
        <div style="font-weight: bold; margin-bottom: 8px; color: #ffffff;">ROKO Performance</div>
        <div id="roko-metrics"></div>
        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #333;">
          <button id="roko-toggle-details" style="
            background: #00d4aa;
            color: #000;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 10px;
          ">Toggle Details</button>
        </div>
      </div>
    `;

    document.getElementById('roko-toggle-details')?.addEventListener('click', () => {
      this.toggleDetails();
    });
  }

  private updateDisplay(): void {
    const metricsContainer = document.getElementById('roko-metrics');
    if (!metricsContainer) return;

    // const metrics = this.monitor.getMetrics();
    // const budgetStatus = this.monitor.getBudgetStatus();

    const statusData = this.monitor.getBudgetStatus() || [];
    metricsContainer.innerHTML = statusData
      .filter(({ value }: any) => value > 0)
      .map(({ metric, value, budget, status }: any) => {
        const color = status === 'pass' ? '#00d4aa' : '#ff6b6b';
        const unit = metric.includes('Size') ? 'B' : 'ms';
        return `
          <div style="display: flex; justify-content: space-between; margin: 2px 0;">
            <span>${metric.toUpperCase()}:</span>
            <span style="color: ${color};">${value.toFixed(1)}${unit}</span>
          </div>
        `;
      })
      .join('');
  }

  private toggleDetails(): void {
    const logs = JSON.parse(sessionStorage.getItem('roko_performance_logs') || '[]');
    console.group('ROKO Performance Details');
    console.table(logs.slice(-10)); // Last 10 entries
    console.log('Current Metrics:', this.monitor.getMetrics());
    console.log('Budget Status:', this.monitor.getBudgetStatus());
    console.groupEnd();
  }

  destroy(): void {
    clearInterval(this.updateInterval);
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

/**
 * Performance Utilities
 */
export const performanceUtils = {
  // Mark performance milestones
  mark: (name: string) => {
    performance.mark(name);
  },

  // Measure performance between marks
  measure: (name: string, startMark: string, endMark?: string) => {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name, 'measure')[0];
    return measure ? measure.duration : 0;
  },

  // Get memory usage (if available)
  getMemoryUsage: () => {
    if ('memory' in performance) {
      return {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      };
    }
    return null;
  },

  // Check if the page is in a slow connection
  isSlowConnection: () => {
    const connection = (navigator as any).connection;
    if (!connection) return false;

    return connection.effectiveType === 'slow-2g' ||
           connection.effectiveType === '2g' ||
           connection.downlink < 1.5;
  }
};

export { WebVitalsMonitor, PerformanceDashboard };
export default WebVitalsMonitor;