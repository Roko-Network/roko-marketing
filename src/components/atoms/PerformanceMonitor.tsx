import { FC, useEffect, useState } from 'react';
import styles from './PerformanceMonitor.module.css';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  loadTime: number;
  lcp: number;
  fid: number;
  cls: number;
}

export const PerformanceMonitor: FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: 0,
    loadTime: 0,
    lcp: 0,
    fid: 0,
    cls: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrame: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;

        setMetrics(prev => ({ ...prev, fps }));
      }

      animationFrame = requestAnimationFrame(measureFPS);
    };

    measureFPS();

    // Memory monitoring
    const measureMemory = () => {
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        const memory = Math.round(memoryInfo.usedJSHeapSize / 1048576); // MB
        setMetrics(prev => ({ ...prev, memory }));
      }
    };

    // Web Vitals monitoring
    const measureWebVitals = () => {
      // Load time
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = Math.round(navigation.loadEventEnd - navigation.fetchStart);
        setMetrics(prev => ({ ...prev, loadTime }));
      }

      // Core Web Vitals (simplified)
      if ('PerformanceObserver' in window) {
        try {
          // LCP
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            const lcp = Math.round(lastEntry.startTime);
            setMetrics(prev => ({ ...prev, lcp }));
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // FID
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              const fid = Math.round(entry.processingStart - entry.startTime);
              setMetrics(prev => ({ ...prev, fid }));
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // CLS
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            setMetrics(prev => ({ ...prev, cls: Math.round(clsValue * 1000) / 1000 }));
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          console.warn('Performance observation not supported:', error);
        }
      }
    };

    const memoryInterval = setInterval(measureMemory, 1000);
    measureWebVitals();

    // Keyboard shortcut to toggle visibility
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearInterval(memoryInterval);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (!isVisible) {
    return (
      <button
        className={styles.toggle}
        onClick={() => setIsVisible(true)}
        title="Show Performance Monitor (Ctrl+Shift+P)"
      >
        ⚡
      </button>
    );
  }

  const getMetricColor = (metric: string, value: number) => {
    switch (metric) {
      case 'fps':
        return value >= 55 ? '#00d4aa' : value >= 30 ? '#f59e0b' : '#ef4444';
      case 'lcp':
        return value <= 2500 ? '#00d4aa' : value <= 4000 ? '#f59e0b' : '#ef4444';
      case 'fid':
        return value <= 100 ? '#00d4aa' : value <= 300 ? '#f59e0b' : '#ef4444';
      case 'cls':
        return value <= 0.1 ? '#00d4aa' : value <= 0.25 ? '#f59e0b' : '#ef4444';
      default:
        return '#BAC0CC';
    }
  };

  return (
    <div className={styles.monitor}>
      <div className={styles.header}>
        <span>Performance Monitor</span>
        <button
          className={styles.close}
          onClick={() => setIsVisible(false)}
          title="Hide Performance Monitor (Ctrl+Shift+P)"
        >
          ×
        </button>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={styles.label}>FPS:</span>
          <span
            className={styles.value}
            style={{ color: getMetricColor('fps', metrics.fps) }}
          >
            {metrics.fps}
          </span>
        </div>

        <div className={styles.metric}>
          <span className={styles.label}>Memory:</span>
          <span className={styles.value}>{metrics.memory} MB</span>
        </div>

        <div className={styles.metric}>
          <span className={styles.label}>Load:</span>
          <span className={styles.value}>{metrics.loadTime} ms</span>
        </div>

        <div className={styles.metric}>
          <span className={styles.label}>LCP:</span>
          <span
            className={styles.value}
            style={{ color: getMetricColor('lcp', metrics.lcp) }}
          >
            {metrics.lcp} ms
          </span>
        </div>

        <div className={styles.metric}>
          <span className={styles.label}>FID:</span>
          <span
            className={styles.value}
            style={{ color: getMetricColor('fid', metrics.fid) }}
          >
            {metrics.fid} ms
          </span>
        </div>

        <div className={styles.metric}>
          <span className={styles.label}>CLS:</span>
          <span
            className={styles.value}
            style={{ color: getMetricColor('cls', metrics.cls) }}
          >
            {metrics.cls}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;