#!/usr/bin/env node

/**
 * Performance Budget Checker for ROKO Network
 * CI/CD integration for performance gates
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PerformanceChecker {
  constructor() {
    this.budgetPath = path.join(__dirname, '../.performance-budget.json');
    this.reportPath = path.join(__dirname, '../performance-report.json');
    this.lighthousePath = path.join(__dirname, '../lighthouse-report.json');
    this.bundleAnalysisPath = path.join(__dirname, '../dist/stats.json');

    this.budget = this.loadBudget();
    this.results = {
      timestamp: new Date().toISOString(),
      passed: true,
      violations: [],
      metrics: {},
      score: 100
    };
  }

  loadBudget() {
    try {
      const budgetContent = fs.readFileSync(this.budgetPath, 'utf8');
      return JSON.parse(budgetContent);
    } catch (error) {
      console.error('Failed to load performance budget:', error.message);
      process.exit(1);
    }
  }

  async runLighthouse(url = 'http://localhost:5173') {
    console.log('🔍 Running Lighthouse audit...');

    return new Promise((resolve, reject) => {
      const lighthouse = spawn('lighthouse', [
        url,
        '--output=json',
        '--output-path=' + this.lighthousePath,
        '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
        '--preset=desktop',
        '--throttling-method=devtools',
        '--disable-extensions'
      ]);

      let output = '';
      let error = '';

      lighthouse.stdout.on('data', (data) => {
        output += data.toString();
      });

      lighthouse.stderr.on('data', (data) => {
        error += data.toString();
      });

      lighthouse.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Lighthouse failed with code ${code}: ${error}`));
        }
      });
    });
  }

  async analyzeBundle() {
    console.log('📦 Analyzing bundle sizes...');

    const statsPath = path.join(__dirname, '../dist/stats.html');
    if (!fs.existsSync(statsPath)) {
      console.warn('Bundle analysis not found. Run build with --analyze flag.');
      return {};
    }

    // Parse bundle sizes from dist directory
    const distPath = path.join(__dirname, '../dist');
    const bundleSizes = {};

    if (fs.existsSync(distPath)) {
      const files = fs.readdirSync(distPath, { recursive: true });

      files.forEach(file => {
        const filePath = path.join(distPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
          const ext = path.extname(file);
          const isGzipped = file.endsWith('.gz');
          const size = stats.size;

          if (ext === '.js' || ext === '.css' || isGzipped) {
            bundleSizes[file] = {
              size,
              gzipped: isGzipped,
              type: ext === '.js' ? 'javascript' : ext === '.css' ? 'css' : 'other'
            };
          }
        }
      });
    }

    return bundleSizes;
  }

  async checkWebVitals() {
    console.log('⚡ Checking Web Vitals...');

    if (!fs.existsSync(this.lighthousePath)) {
      console.warn('Lighthouse report not found. Skipping Web Vitals check.');
      return {};
    }

    const lighthouse = JSON.parse(fs.readFileSync(this.lighthousePath, 'utf8'));
    const audits = lighthouse.audits;

    return {
      lcp: audits['largest-contentful-paint']?.numericValue || null,
      inp: audits['max-potential-fid']?.numericValue || null, // Approximation
      cls: audits['cumulative-layout-shift']?.numericValue || null,
      fcp: audits['first-contentful-paint']?.numericValue || null,
      ttfb: audits['server-response-time']?.numericValue || null,
      lighthouse_performance: lighthouse.categories.performance.score * 100,
      lighthouse_accessibility: lighthouse.categories.accessibility.score * 100,
      lighthouse_best_practices: lighthouse.categories['best-practices'].score * 100,
      lighthouse_seo: lighthouse.categories.seo.score * 100
    };
  }

  checkBudget(category, metric, value) {
    const budget = this.budget.budgets[category]?.[metric];
    if (!budget) return { passed: true, message: 'No budget defined' };

    const target = budget.target;
    const warning = budget.warning;
    const unit = budget.unit;

    let passed = true;
    let level = 'pass';
    let message = `${metric}: ${value}${unit} (target: ${target}${unit})`;

    if (value > target) {
      passed = false;
      level = 'fail';
      message = `❌ ${budget.description}: ${value}${unit} exceeds target of ${target}${unit}`;
    } else if (warning && value > warning) {
      level = 'warning';
      message = `⚠️  ${budget.description}: ${value}${unit} exceeds warning threshold of ${warning}${unit}`;
    } else {
      message = `✅ ${budget.description}: ${value}${unit} within budget`;
    }

    return { passed, level, message, value, target, unit };
  }

  async runChecks(url) {
    console.log('🚀 Starting performance checks...\n');

    try {
      // Run Lighthouse
      await this.runLighthouse(url);

      // Analyze bundle
      const bundleSizes = await this.analyzeBundle();

      // Check Web Vitals
      const webVitals = await this.checkWebVitals();

      // Check all budgets
      console.log('\n📊 Checking performance budgets...\n');

      // Core Web Vitals
      if (webVitals.lcp) {
        const result = this.checkBudget('core_web_vitals', 'lcp', webVitals.lcp);
        this.processResult('core_web_vitals', 'lcp', result);
      }

      if (webVitals.inp) {
        const result = this.checkBudget('core_web_vitals', 'inp', webVitals.inp);
        this.processResult('core_web_vitals', 'inp', result);
      }

      if (webVitals.cls) {
        const result = this.checkBudget('core_web_vitals', 'cls', webVitals.cls);
        this.processResult('core_web_vitals', 'cls', result);
      }

      if (webVitals.fcp) {
        const result = this.checkBudget('core_web_vitals', 'fcp', webVitals.fcp);
        this.processResult('core_web_vitals', 'fcp', result);
      }

      if (webVitals.ttfb) {
        const result = this.checkBudget('core_web_vitals', 'ttfb', webVitals.ttfb);
        this.processResult('core_web_vitals', 'ttfb', result);
      }

      // Lighthouse scores
      if (webVitals.lighthouse_performance) {
        const result = this.checkBudget('lighthouse', 'performance', webVitals.lighthouse_performance);
        this.processResult('lighthouse', 'performance', result);
      }

      if (webVitals.lighthouse_accessibility) {
        const result = this.checkBudget('lighthouse', 'accessibility', webVitals.lighthouse_accessibility);
        this.processResult('lighthouse', 'accessibility', result);
      }

      if (webVitals.lighthouse_best_practices) {
        const result = this.checkBudget('lighthouse', 'best_practices', webVitals.lighthouse_best_practices);
        this.processResult('lighthouse', 'best_practices', result);
      }

      if (webVitals.lighthouse_seo) {
        const result = this.checkBudget('lighthouse', 'seo', webVitals.lighthouse_seo);
        this.processResult('lighthouse', 'seo', result);
      }

      // Bundle sizes
      let totalJs = 0;
      let totalCss = 0;
      let initialJs = 0;

      Object.entries(bundleSizes).forEach(([filename, info]) => {
        if (info.type === 'javascript') {
          totalJs += info.size;
          if (filename.includes('index') || filename.includes('main')) {
            initialJs += info.size;
          }
        } else if (info.type === 'css') {
          totalCss += info.size;
        }
      });

      if (initialJs > 0) {
        const result = this.checkBudget('bundle_sizes', 'initial_js', initialJs);
        this.processResult('bundle_sizes', 'initial_js', result);
      }

      if (totalCss > 0) {
        const result = this.checkBudget('bundle_sizes', 'initial_css', totalCss);
        this.processResult('bundle_sizes', 'initial_css', result);
      }

      const totalInitial = initialJs + totalCss;
      if (totalInitial > 0) {
        const result = this.checkBudget('bundle_sizes', 'total_initial', totalInitial);
        this.processResult('bundle_sizes', 'total_initial', result);
      }

      const totalApp = totalJs + totalCss;
      if (totalApp > 0) {
        const result = this.checkBudget('bundle_sizes', 'total_app', totalApp);
        this.processResult('bundle_sizes', 'total_app', result);
      }

      // Save detailed metrics
      this.results.metrics = {
        webVitals,
        bundleSizes,
        totalSizes: {
          javascript: totalJs,
          css: totalCss,
          initial: totalInitial,
          total: totalApp
        }
      };

      // Generate report
      this.generateReport();

      return this.results;

    } catch (error) {
      console.error('❌ Performance check failed:', error.message);
      process.exit(1);
    }
  }

  processResult(category, metric, result) {
    console.log(result.message);

    if (!result.passed) {
      this.results.passed = false;
      this.results.violations.push({
        category,
        metric,
        value: result.value,
        target: result.target,
        unit: result.unit,
        level: result.level
      });
      this.results.score -= 10; // Deduct points for violations
    } else if (result.level === 'warning') {
      this.results.violations.push({
        category,
        metric,
        value: result.value,
        target: result.target,
        unit: result.unit,
        level: result.level
      });
      this.results.score -= 2; // Small deduction for warnings
    }
  }

  generateReport() {
    // Save JSON report
    fs.writeFileSync(this.reportPath, JSON.stringify(this.results, null, 2));

    // Generate markdown summary
    const mdReport = this.generateMarkdownReport();
    fs.writeFileSync(path.join(__dirname, '../performance-summary.md'), mdReport);

    console.log('\n📋 Performance Report Generated:');
    console.log(`   JSON: ${this.reportPath}`);
    console.log(`   Markdown: ${path.join(__dirname, '../performance-summary.md')}`);
  }

  generateMarkdownReport() {
    const { passed, violations, score, metrics } = this.results;

    let md = `# ROKO Network Performance Report\n\n`;
    md += `**Date**: ${new Date().toISOString()}\n`;
    md += `**Score**: ${score}/100\n`;
    md += `**Status**: ${passed ? '✅ PASSED' : '❌ FAILED'}\n\n`;

    if (violations.length > 0) {
      md += `## Budget Violations (${violations.length})\n\n`;

      violations.forEach(violation => {
        const icon = violation.level === 'fail' ? '❌' : '⚠️';
        md += `${icon} **${violation.category}.${violation.metric}**: ${violation.value}${violation.unit} (target: ${violation.target}${violation.unit})\n`;
      });
      md += '\n';
    }

    md += `## Core Web Vitals\n\n`;
    if (metrics.webVitals) {
      const wv = metrics.webVitals;
      md += `- **LCP**: ${wv.lcp || 'N/A'}ms\n`;
      md += `- **INP**: ${wv.inp || 'N/A'}ms\n`;
      md += `- **CLS**: ${wv.cls || 'N/A'}\n`;
      md += `- **FCP**: ${wv.fcp || 'N/A'}ms\n`;
      md += `- **TTFB**: ${wv.ttfb || 'N/A'}ms\n\n`;
    }

    md += `## Lighthouse Scores\n\n`;
    if (metrics.webVitals) {
      const wv = metrics.webVitals;
      md += `- **Performance**: ${wv.lighthouse_performance || 'N/A'}/100\n`;
      md += `- **Accessibility**: ${wv.lighthouse_accessibility || 'N/A'}/100\n`;
      md += `- **Best Practices**: ${wv.lighthouse_best_practices || 'N/A'}/100\n`;
      md += `- **SEO**: ${wv.lighthouse_seo || 'N/A'}/100\n\n`;
    }

    md += `## Bundle Analysis\n\n`;
    if (metrics.totalSizes) {
      const ts = metrics.totalSizes;
      md += `- **JavaScript**: ${this.formatBytes(ts.javascript)}\n`;
      md += `- **CSS**: ${this.formatBytes(ts.css)}\n`;
      md += `- **Initial Load**: ${this.formatBytes(ts.initial)}\n`;
      md += `- **Total App**: ${this.formatBytes(ts.total)}\n\n`;
    }

    md += `## Recommendations\n\n`;
    if (violations.length === 0) {
      md += `🎉 Excellent! All performance budgets are within targets.\n\n`;
    } else {
      md += `Consider the following optimizations:\n\n`;

      violations.forEach(violation => {
        md += `- Optimize ${violation.category}.${violation.metric} to reduce from ${violation.value}${violation.unit} to below ${violation.target}${violation.unit}\n`;
      });
    }

    return md;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const url = args[0] || 'http://localhost:5173';
  const failOnViolation = process.env.CI === 'true' || args.includes('--fail-on-violation');

  const checker = new PerformanceChecker();
  const results = await checker.runChecks(url);

  console.log('\n🎯 Performance Check Complete!');
  console.log(`Score: ${results.score}/100`);
  console.log(`Violations: ${results.violations.length}`);

  if (!results.passed && failOnViolation) {
    console.log('\n❌ Performance budget violations detected. Failing build.');
    process.exit(1);
  } else if (!results.passed) {
    console.log('\n⚠️  Performance budget violations detected, but not failing build.');
  } else {
    console.log('\n✅ All performance budgets passed!');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Performance check failed:', error);
    process.exit(1);
  });
}

export default PerformanceChecker;