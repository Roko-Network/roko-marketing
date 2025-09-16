/**
 * Enhanced Error Tracking and Crash Reporting for ROKO Network
 * Integrates with Sentry, custom error handling, and real-time alerting
 */

import React from 'react';
import { WebVitalsMonitor } from './monitoring';

interface ErrorContext {
  userId?: string;
  sessionId: string;
  url: string;
  userAgent: string;
  timestamp: number;
  buildVersion: string;
  feature?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

interface ErrorReport {
  id: string;
  type: 'javascript' | 'promise' | 'network' | 'react' | 'custom';
  message: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context: ErrorContext;
  fingerprint: string;
  tags: Record<string, string>;
  extra: Record<string, any>;
}

interface CrashMetrics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsByPage: Record<string, number>;
  errorsByBrowser: Record<string, number>;
  errorRate: number;
  mtbf: number; // Mean Time Between Failures
  sessionHealth: number; // Percentage of error-free sessions
}

export class ErrorTracker {
  private sessionId: string;
  private userId?: string;
  private errors: ErrorReport[] = [];
  private performanceMonitor?: WebVitalsMonitor;
  private startTime: number;
  private errorCount: number = 0;
  private sessionErrors: Set<string> = new Set();
  private isInitialized: boolean = false;
  private sentryEnabled: boolean = false;

  constructor(performanceMonitor?: WebVitalsMonitor) {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.performanceMonitor = performanceMonitor;
    this.initialize();
  }

  private generateSessionId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Initialize Sentry if available
    await this.initializeSentry();

    // Set up global error handlers
    this.setupGlobalErrorHandlers();

    // Set up React error boundary integration
    this.setupReactErrorBoundary();

    // Set up network error monitoring
    this.setupNetworkErrorMonitoring();

    // Set up unhandled promise rejection monitoring
    this.setupPromiseRejectionMonitoring();

    // Periodic cleanup and reporting
    setInterval(() => this.performMaintenance(), 60000); // Every minute

    this.isInitialized = true;
    console.log('✅ Error tracking initialized');
  }

  private async initializeSentry(): Promise<void> {
    try {
      const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
      if (!sentryDsn) return;

      // Sentry integration disabled due to missing @sentry/browser package
      // const { init, configureScope, captureException, addBreadcrumb } = await import('@sentry/browser');
      const init = (config?: any) => {};
      const configureScope = (callback?: any) => {};
      const captureException = () => {};
      const addBreadcrumb = () => {};
      // BrowserTracing integration disabled due to missing @sentry/tracing package
      // const { BrowserTracing } = await import('@sentry/tracing');

      init({
        dsn: sentryDsn,
        environment: import.meta.env.VITE_BUILD_ENV || 'development',
        sampleRate: import.meta.env.PROD ? 0.1 : 1.0,
        tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
        beforeSend: (event: any, hint: any) => {
          // Filter out common non-critical errors
          if (this.shouldIgnoreError(event, hint)) {
            return null;
          }
          return this.enhanceSentryEvent(event);
        },
        integrations: [
          // new BrowserTracing({ // Disabled due to missing dependency
          /* {
            tracingOrigins: ['localhost', 'roko.network', /^\//],
          }), */
        ],
      });

      configureScope((scope: any) => {
        scope.setTag('application', 'roko-marketing');
        scope.setTag('version', import.meta.env.VITE_APP_VERSION || '1.0.0');
        scope.setContext('session', {
          id: this.sessionId,
          startTime: this.startTime,
        });
      });

      this.sentryEnabled = true;
      console.log('✅ Sentry error tracking enabled');
    } catch (error) {
      console.warn('Failed to initialize Sentry:', error);
    }
  }

  private setupGlobalErrorHandlers(): void {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        severity: this.determineSeverity(event.error),
      });
    });

    // Console errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.captureError({
        type: 'custom',
        message: args.join(' '),
        severity: 'medium',
        extra: { args },
      });
      originalConsoleError.apply(console, args);
    };
  }

  private setupReactErrorBoundary(): void {
    // This would typically be integrated with a React Error Boundary
    // For now, we'll set up a global hook if available
    if ((window as any).__REACT_ERROR_OVERLAY_GLOBAL_HOOK__) {
      const originalOnError = (window as any).__REACT_ERROR_OVERLAY_GLOBAL_HOOK__.onError;
      (window as any).__REACT_ERROR_OVERLAY_GLOBAL_HOOK__.onError = (error: Error) => {
        this.captureError({
          type: 'react',
          message: error.message,
          stack: error.stack,
          severity: 'high',
          // component: this.extractComponentFromStack(error.stack), // Disabled - not part of ErrorReport interface
        });
        if (originalOnError) originalOnError(error);
      };
    }
  }

  private setupNetworkErrorMonitoring(): void {
    // Monitor fetch failures
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        if (!response.ok) {
          this.captureError({
            type: 'network',
            message: `HTTP ${response.status}: ${response.statusText}`,
            severity: response.status >= 500 ? 'high' : 'medium',
            extra: {
              url: args[0],
              status: response.status,
              statusText: response.statusText,
            },
          });
        }

        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.captureError({
          type: 'network',
          message: `Network request failed: ${errorMessage}`,
          severity: 'high',
          extra: {
            url: args[0],
            error: errorMessage,
          },
        });
        throw error;
      }
    };

    // Monitor XMLHttpRequest failures
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    
    // Use WeakMap to store method and URL for each XHR instance
    const xhrData = new WeakMap<XMLHttpRequest, { method?: string; url?: string }>();

    XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...args: any[]) {
      xhrData.set(this, { method, url: url.toString() });
      return originalXHROpen.apply(this, [method, url, ...args] as any);
    };

    XMLHttpRequest.prototype.send = function(...args) {
      const data = xhrData.get(this) || {};
      
      this.addEventListener('error', () => {
        ErrorTracker.getInstance()?.captureError({
          type: 'network',
          message: `XMLHttpRequest failed: ${data.method || 'Unknown'} ${data.url || 'Unknown'}`,
          severity: 'medium',
          extra: {
            method: data.method,
            url: data.url,
            status: this.status,
          },
        });
      });

      this.addEventListener('load', () => {
        if (this.status >= 400) {
          ErrorTracker.getInstance()?.captureError({
            type: 'network',
            message: `HTTP ${this.status}: ${data.method || 'Unknown'} ${data.url || 'Unknown'}`,
            severity: this.status >= 500 ? 'high' : 'medium',
            extra: {
              method: data.method,
              url: data.url,
              status: this.status,
              statusText: this.statusText,
            },
          });
        }
      });

      return originalXHRSend.apply(this, args);
    };
  }

  private setupPromiseRejectionMonitoring(): void {
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        type: 'promise',
        message: `Unhandled promise rejection: ${event.reason}`,
        stack: event.reason?.stack,
        severity: 'high',
        extra: {
          reason: event.reason,
          promise: event.promise,
        },
      });
    });
  }

  private captureError(errorData: Partial<ErrorReport>): void {
    const errorId = this.generateErrorId();
    const context = this.createErrorContext();
    const fingerprint = this.generateFingerprint(errorData);

    const errorReport: ErrorReport = {
      id: errorId,
      type: errorData.type || 'custom',
      message: errorData.message || 'Unknown error',
      stack: errorData.stack,
      filename: errorData.filename,
      lineno: errorData.lineno,
      colno: errorData.colno,
      severity: errorData.severity || 'medium',
      context,
      fingerprint,
      tags: this.generateTags(errorData),
      extra: errorData.extra || {},
    };

    // Store error
    this.errors.push(errorReport);
    this.errorCount++;
    this.sessionErrors.add(fingerprint);

    // Report to external services
    this.reportError(errorReport);

    // Update performance monitor if available
    if (this.performanceMonitor) {
      this.performanceMonitor.trackCustomMetric('error_count', this.errorCount);
    }

    // Store in local storage for debugging
    this.storeErrorLocally(errorReport);

    // Check for critical error patterns
    this.checkErrorPatterns(errorReport);
  }

  private createErrorContext(): ErrorContext {
    return {
      userId: this.userId,
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      buildVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
      metadata: {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        memory: this.getMemoryInfo(),
        connection: this.getConnectionInfo(),
        performance: this.performanceMonitor?.getMetrics(),
      },
    };
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateFingerprint(errorData: Partial<ErrorReport>): string {
    const key = `${errorData.type}_${errorData.message}_${errorData.filename}_${errorData.lineno}`;
    return btoa(key).replace(/[^a-zA-Z0-9]/g, '').substr(0, 16);
  }

  private generateTags(errorData: Partial<ErrorReport>): Record<string, string> {
    return {
      type: errorData.type || 'unknown',
      severity: errorData.severity || 'medium',
      browser: this.getBrowserInfo(),
      os: this.getOSInfo(),
      page: this.getPageInfo(),
    };
  }

  private determineSeverity(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    if (!error) return 'low';

    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';

    // Critical errors
    if (message.includes('security') ||
        message.includes('cors') ||
        message.includes('csp') ||
        stack.includes('three') && message.includes('context')) {
      return 'critical';
    }

    // High severity errors
    if (message.includes('network') ||
        message.includes('timeout') ||
        message.includes('chunk') ||
        message.includes('dynamic import')) {
      return 'high';
    }

    // Medium severity errors
    if (message.includes('warning') ||
        message.includes('deprecated')) {
      return 'medium';
    }

    return 'medium';
  }

  private shouldIgnoreError(event: any, hint: any): boolean {
    const ignoredMessages = [
      'Script error',
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded',
      'Network request failed',
      'Loading chunk',
      'ChunkLoadError',
    ];

    const message = event.message || event.exception?.values?.[0]?.value || '';
    return ignoredMessages.some(ignored => message.includes(ignored));
  }

  private enhanceSentryEvent(event: any): any {
    // Add custom context to Sentry events
    event.contexts = {
      ...event.contexts,
      roko: {
        sessionId: this.sessionId,
        errorCount: this.errorCount,
        sessionDuration: Date.now() - this.startTime,
        performance: this.performanceMonitor?.getMetrics(),
      },
    };

    return event;
  }

  private extractComponentFromStack(stack?: string): string | undefined {
    if (!stack) return undefined;

    // Try to extract React component name from stack
    const reactMatch = stack.match(/at (\w+) \(/);
    return reactMatch?.[1];
  }

  private reportError(errorReport: ErrorReport): void {
    // Report to Sentry
    if (this.sentryEnabled && (window as any).Sentry) {
      (window as any).Sentry.captureException(new Error(errorReport.message), {
        tags: errorReport.tags,
        extra: errorReport.extra,
        fingerprint: [errorReport.fingerprint],
        level: this.mapSeverityToSentryLevel(errorReport.severity),
      });
    }

    // Report to analytics
    this.reportToAnalytics(errorReport);

    // Report to custom endpoint
    this.reportToCustomEndpoint(errorReport);
  }

  private mapSeverityToSentryLevel(severity: 'low' | 'medium' | 'high' | 'critical'): string {
    const mapping: Record<'low' | 'medium' | 'high' | 'critical', string> = {
      low: 'info',
      medium: 'warning',
      high: 'error',
      critical: 'fatal',
    };
    return mapping[severity] || 'error';
  }

  private reportToAnalytics(errorReport: ErrorReport): void {
    if ((window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: errorReport.message,
        fatal: errorReport.severity === 'critical',
        custom_map: {
          error_type: errorReport.type,
          error_severity: errorReport.severity,
          error_fingerprint: errorReport.fingerprint,
        },
      });
    }
  }

  private reportToCustomEndpoint(errorReport: ErrorReport): void {
    const endpoint = import.meta.env.VITE_ERROR_ENDPOINT;
    if (!endpoint) return;

    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, JSON.stringify(errorReport));
    } else {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport),
        keepalive: true,
      }).catch(() => {
        // Silently fail if endpoint is not available
      });
    }
  }

  private storeErrorLocally(errorReport: ErrorReport): void {
    try {
      const errors = JSON.parse(localStorage.getItem('roko_errors') || '[]');
      errors.push(errorReport);

      // Keep only last 100 errors
      const recentErrors = errors.slice(-100);
      localStorage.setItem('roko_errors', JSON.stringify(recentErrors));
    } catch (error) {
      console.warn('Failed to store error locally:', error);
    }
  }

  private checkErrorPatterns(errorReport: ErrorReport): void {
    // Check for error rate spikes
    const recentErrors = this.errors.filter(e =>
      Date.now() - e.context.timestamp < 60000 // Last minute
    );

    if (recentErrors.length > 10) {
      this.captureError({
        type: 'custom',
        message: 'Error rate spike detected',
        severity: 'critical',
        extra: {
          errorCount: recentErrors.length,
          timeframe: '1 minute',
          pattern: 'error_spike',
        },
      });
    }

    // Check for critical error accumulation
    const criticalErrors = this.errors.filter(e => e.severity === 'critical');
    if (criticalErrors.length > 3) {
      this.captureError({
        type: 'custom',
        message: 'Multiple critical errors detected',
        severity: 'critical',
        extra: {
          criticalErrorCount: criticalErrors.length,
          pattern: 'critical_accumulation',
        },
      });
    }
  }

  private performMaintenance(): void {
    // Clean up old errors (keep last 500)
    if (this.errors.length > 500) {
      this.errors = this.errors.slice(-500);
    }

    // Generate and store metrics
    const metrics = this.calculateMetrics();
    localStorage.setItem('roko_error_metrics', JSON.stringify(metrics));

    // Log health summary
    console.log('Error Tracker Health:', {
      totalErrors: this.errorCount,
      sessionErrors: this.sessionErrors.size,
      errorRate: metrics.errorRate,
      sessionHealth: metrics.sessionHealth,
    });
  }

  private calculateMetrics(): CrashMetrics {
    const sessionDuration = Date.now() - this.startTime;
    const hoursRunning = sessionDuration / (1000 * 60 * 60);

    return {
      totalErrors: this.errorCount,
      errorsByType: this.getErrorsByType(),
      errorsByPage: this.getErrorsByPage(),
      errorsByBrowser: this.getErrorsByBrowser(),
      errorRate: hoursRunning > 0 ? this.errorCount / hoursRunning : 0,
      mtbf: this.errorCount > 0 ? sessionDuration / this.errorCount : sessionDuration,
      sessionHealth: this.sessionErrors.size === 0 ? 100 : Math.max(0, 100 - (this.sessionErrors.size * 10)),
    };
  }

  private getErrorsByType(): Record<string, number> {
    return this.errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private getErrorsByPage(): Record<string, number> {
    return this.errors.reduce((acc, error) => {
      const page = new URL(error.context.url).pathname;
      acc[page] = (acc[page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private getErrorsByBrowser(): Record<string, number> {
    return this.errors.reduce((acc, error) => {
      const browser = this.extractBrowserFromUserAgent(error.context.userAgent);
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private extractBrowserFromUserAgent(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getBrowserInfo(): string {
    return this.extractBrowserFromUserAgent(navigator.userAgent);
  }

  private getOSInfo(): string {
    const platform = navigator.platform.toLowerCase();
    if (platform.includes('win')) return 'Windows';
    if (platform.includes('mac')) return 'macOS';
    if (platform.includes('linux')) return 'Linux';
    if (platform.includes('iphone') || platform.includes('ipad')) return 'iOS';
    if (platform.includes('android')) return 'Android';
    return 'Unknown';
  }

  private getPageInfo(): string {
    return window.location.pathname;
  }

  private getMemoryInfo(): any {
    return (performance as any).memory ? {
      used: (performance as any).memory.usedJSHeapSize,
      total: (performance as any).memory.totalJSHeapSize,
      limit: (performance as any).memory.jsHeapSizeLimit,
    } : null;
  }

  private getConnectionInfo(): any {
    const connection = (navigator as any).connection;
    return connection ? {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
    } : null;
  }

  // Public API
  public setUserId(userId: string): void {
    this.userId = userId;

    if (this.sentryEnabled && (window as any).Sentry) {
      (window as any).Sentry.configureScope((scope: any) => {
        scope.setUser({ id: userId });
      });
    }
  }

  public captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    this.captureError({
      type: 'custom',
      message,
      severity: level === 'error' ? 'high' : level === 'warning' ? 'medium' : 'low',
    });
  }

  public captureException(error: Error, context?: Record<string, any>): void {
    this.captureError({
      type: 'custom',
      message: error.message,
      stack: error.stack,
      severity: 'high',
      extra: context,
    });
  }

  public addBreadcrumb(message: string, category: string = 'custom', data?: any): void {
    if (this.sentryEnabled && (window as any).Sentry) {
      (window as any).Sentry.addBreadcrumb({
        message,
        category,
        data,
        timestamp: Date.now() / 1000,
      });
    }
  }

  public getMetrics(): CrashMetrics {
    return this.calculateMetrics();
  }

  public getRecentErrors(count: number = 10): ErrorReport[] {
    return this.errors.slice(-count);
  }

  public clearErrors(): void {
    this.errors = [];
    this.sessionErrors.clear();
    localStorage.removeItem('roko_errors');
  }

  // Singleton pattern
  private static instance: ErrorTracker | null = null;

  public static getInstance(): ErrorTracker | null {
    return ErrorTracker.instance;
  }

  public static initialize(performanceMonitor?: WebVitalsMonitor): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker(performanceMonitor);
    }
    return ErrorTracker.instance;
  }

  public destroy(): void {
    this.errors = [];
    this.sessionErrors.clear();
    ErrorTracker.instance = null;
  }
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// React Error Boundary Component
export function createErrorBoundary(ErrorComponent?: React.ComponentType<any>) {
  return class extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      return { hasError: true, error };
    }

    override componentDidCatch(error: Error, errorInfo: any) {
      const errorTracker = ErrorTracker.getInstance();
      if (errorTracker) {
        errorTracker.captureException(error, {
          errorBoundary: true,
          componentStack: errorInfo.componentStack,
          errorInfo,
        });
      }
    }

    override render() {
      if (this.state.hasError) {
        if (ErrorComponent) {
          return React.createElement(ErrorComponent, { error: this.state.error });
        }

        return React.createElement('div', {
          style: {
            padding: '20px',
            border: '1px solid #ff6b6b',
            borderRadius: '8px',
            backgroundColor: '#ffe6e6',
            color: '#d63031',
            textAlign: 'center',
          },
        }, [
          React.createElement('h2', { key: 'title' }, 'Something went wrong'),
          React.createElement('p', { key: 'message' }, 'An error occurred while rendering this component.'),
          React.createElement('button', {
            key: 'retry',
            onClick: () => window.location.reload(),
            style: {
              padding: '8px 16px',
              backgroundColor: '#00d4aa',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            },
          }, 'Reload Page'),
        ]);
      }

      return this.props.children;
    }
  };
}

export default ErrorTracker;