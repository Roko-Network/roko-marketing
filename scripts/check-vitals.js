#!/usr/bin/env node

/**
 * Core Web Vitals Checker for ROKO Network Marketing Site
 * Validates performance metrics against Web Vitals thresholds
 */

import fs from 'fs';
import path from 'path';

// Web Vitals thresholds (Google's recommended values)
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 },   // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
  INP: { good: 200, poor: 500 }    // Interaction to Next Paint
};

// Performance budgets for ROKO Network
const PERFORMANCE_BUDGETS = {
  totalPageSize: 2000, // KB
  jsSize: 800,         // KB
  cssSize: 200,        // KB
  imageSize: 1000,     // KB
  fontSize: 100,       // KB
  requests: 50         // Total number of requests
};

class WebVitalsChecker {
  constructor(vitalsFile) {
    this.vitalsFile = vitalsFile;
    this.results = {
      passed: [],
      warnings: [],
      failed: [],
      summary: {}
    };
  }

  async loadVitalsData() {
    try {
      const data = fs.readFileSync(this.vitalsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to load vitals data: ${error.message}`);
    }
  }

  evaluateMetric(name, value, threshold) {
    if (value <= threshold.good) {
      return 'good';
    } else if (value <= threshold.poor) {
      return 'needs-improvement';
    } else {
      return 'poor';
    }
  }

  checkWebVitals(vitals) {
    console.log('🔍 Checking Core Web Vitals...\n');

    const metrics = [
      { name: 'LCP', value: vitals.lcp, unit: 'ms', description: 'Largest Contentful Paint' },
      { name: 'FID', value: vitals.fid, unit: 'ms', description: 'First Input Delay' },
      { name: 'CLS', value: vitals.cls, unit: '', description: 'Cumulative Layout Shift' },
      { name: 'FCP', value: vitals.fcp, unit: 'ms', description: 'First Contentful Paint' },
      { name: 'TTFB', value: vitals.ttfb, unit: 'ms', description: 'Time to First Byte' },
      { name: 'INP', value: vitals.inp, unit: 'ms', description: 'Interaction to Next Paint' }
    ];

    metrics.forEach(metric => {
      if (metric.value !== undefined && metric.value !== null) {
        const threshold = THRESHOLDS[metric.name];
        const rating = this.evaluateMetric(metric.name, metric.value, threshold);

        const result = {
          name: metric.name,
          description: metric.description,
          value: metric.value,
          unit: metric.unit,
          rating,
          threshold
        };

        switch (rating) {
          case 'good':
            this.results.passed.push(result);
            console.log(`✅ ${metric.name} (${metric.description}): ${metric.value}${metric.unit} - Good`);
            break;
          case 'needs-improvement':
            this.results.warnings.push(result);
            console.log(`⚠️ ${metric.name} (${metric.description}): ${metric.value}${metric.unit} - Needs Improvement`);
            break;
          case 'poor':
            this.results.failed.push(result);
            console.log(`❌ ${metric.name} (${metric.description}): ${metric.value}${metric.unit} - Poor`);
            break;
        }
      }
    });
  }

  checkPerformanceBudget(vitals) {
    console.log('\n💰 Checking Performance Budget...\n');

    const budgetChecks = [
      {
        name: 'Total Page Size',
        value: vitals.transferSize / 1024, // Convert to KB
        budget: PERFORMANCE_BUDGETS.totalPageSize,
        unit: 'KB'
      },
      {
        name: 'JavaScript Size',
        value: vitals.jsSize / 1024,
        budget: PERFORMANCE_BUDGETS.jsSize,
        unit: 'KB'
      },
      {
        name: 'CSS Size',
        value: vitals.cssSize / 1024,
        budget: PERFORMANCE_BUDGETS.cssSize,
        unit: 'KB'
      },
      {
        name: 'Image Size',
        value: vitals.imageSize / 1024,
        budget: PERFORMANCE_BUDGETS.imageSize,
        unit: 'KB'
      },
      {
        name: 'Total Requests',
        value: vitals.requestCount,
        budget: PERFORMANCE_BUDGETS.requests,
        unit: ''
      }
    ];

    budgetChecks.forEach(check => {
      if (check.value !== undefined && check.value !== null) {
        const percentage = (check.value / check.budget) * 100;
        const status = check.value <= check.budget ? 'passed' : 'failed';

        const result = {
          name: check.name,
          value: Math.round(check.value),
          budget: check.budget,
          percentage: Math.round(percentage),
          unit: check.unit,
          status
        };

        if (status === 'passed') {
          console.log(`✅ ${check.name}: ${result.value}${check.unit} / ${check.budget}${check.unit} (${result.percentage}%)`);
        } else {
          console.log(`❌ ${check.name}: ${result.value}${check.unit} / ${check.budget}${check.unit} (${result.percentage}%) - Over budget!`);
        }
      }
    });
  }

  generateRecommendations() {
    console.log('\n💡 Performance Recommendations...\n');

    const recommendations = [];

    // LCP recommendations
    if (this.results.failed.some(r => r.name === 'LCP') || this.results.warnings.some(r => r.name === 'LCP')) {
      recommendations.push('🖼️ Optimize LCP: Compress images, use next-gen formats (WebP/AVIF), implement lazy loading');
    }

    // FID recommendations
    if (this.results.failed.some(r => r.name === 'FID') || this.results.warnings.some(r => r.name === 'FID')) {
      recommendations.push('⚡ Improve FID: Minimize JavaScript execution time, break up long tasks, use web workers');
    }

    // CLS recommendations
    if (this.results.failed.some(r => r.name === 'CLS') || this.results.warnings.some(r => r.name === 'CLS')) {
      recommendations.push('📐 Fix CLS: Set dimensions for images/videos, reserve space for ads, avoid dynamic content insertion');
    }

    // TTFB recommendations
    if (this.results.failed.some(r => r.name === 'TTFB') || this.results.warnings.some(r => r.name === 'TTFB')) {
      recommendations.push('🚀 Optimize TTFB: Use CDN, enable caching, optimize server response time');
    }

    if (recommendations.length === 0) {
      console.log('🎉 All metrics are performing well! Consider these advanced optimizations:');
      recommendations.push(
        '🔧 Enable Brotli compression for text assets',
        '📦 Implement service worker for offline functionality',
        '⚡ Consider HTTP/3 for faster connection establishment',
        '🎯 Implement resource hints (preload, prefetch, preconnect)'
      );
    }

    recommendations.forEach(rec => console.log(`  • ${rec}`));
  }

  generateSummary() {
    const total = this.results.passed.length + this.results.warnings.length + this.results.failed.length;
    const passRate = (this.results.passed.length / total) * 100;

    this.results.summary = {
      total,
      passed: this.results.passed.length,
      warnings: this.results.warnings.length,
      failed: this.results.failed.length,
      passRate: Math.round(passRate)
    };

    console.log('\n📊 Web Vitals Summary');
    console.log('=====================');
    console.log(`Total Metrics: ${total}`);
    console.log(`✅ Good: ${this.results.passed.length}`);
    console.log(`⚠️ Needs Improvement: ${this.results.warnings.length}`);
    console.log(`❌ Poor: ${this.results.failed.length}`);
    console.log(`Pass Rate: ${this.results.summary.passRate}%`);

    // Overall score
    if (this.results.summary.passRate >= 90) {
      console.log('\n🏆 Excellent performance! All Core Web Vitals are in good shape.');
    } else if (this.results.summary.passRate >= 70) {
      console.log('\n👍 Good performance with some room for improvement.');
    } else {
      console.log('\n⚠️ Performance needs attention. Consider prioritizing optimization efforts.');
    }
  }

  saveReport() {
    const reportPath = path.join(process.cwd(), 'vitals-report.json');

    const report = {
      timestamp: new Date().toISOString(),
      url: 'https://roko.network',
      results: this.results
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }

  async run() {
    try {
      const vitals = await this.loadVitalsData();

      console.log('🎯 ROKO Network Web Vitals Check');
      console.log('=================================\n');

      this.checkWebVitals(vitals);
      this.checkPerformanceBudget(vitals);
      this.generateRecommendations();
      this.generateSummary();
      this.saveReport();

      // Exit with error code if any metrics failed
      const shouldFail = this.results.failed.length > 0;
      process.exit(shouldFail ? 1 : 0);

    } catch (error) {
      console.error('❌ Web Vitals check failed:', error.message);
      process.exit(1);
    }
  }
}

// CLI interface
async function main() {
  const vitalsFile = process.argv[2];

  if (!vitalsFile) {
    console.error('Usage: node check-vitals.js <vitals-file.json>');
    process.exit(1);
  }

  if (!fs.existsSync(vitalsFile)) {
    console.error(`Vitals file not found: ${vitalsFile}`);
    process.exit(1);
  }

  const checker = new WebVitalsChecker(vitalsFile);
  await checker.run();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

export default WebVitalsChecker;