#!/usr/bin/env node

/**
 * Health Check Script for ROKO Network Marketing Site
 * Validates application health across multiple endpoints and services
 */

import fetch from 'node-fetch';
import { performance } from 'perf_hooks';

const CONFIG = {
  timeout: 10000,
  retries: 3,
  endpoints: [
    { name: 'Homepage', url: 'https://roko.network' },
    { name: 'Technology Page', url: 'https://roko.network/technology' },
    { name: 'Developers Page', url: 'https://roko.network/developers' },
    { name: 'Governance Page', url: 'https://roko.network/governance' }
  ],
  apis: [
    { name: 'Main API', url: 'https://api.roko.network/health' },
    { name: 'WebSocket API', url: 'https://ws.roko.network/health' }
  ],
  performance: {
    maxLoadTime: 3000, // 3 seconds
    maxTTFB: 1000,     // 1 second
    maxLCP: 2500       // 2.5 seconds
  }
};

class HealthChecker {
  constructor() {
    this.results = [];
    this.errors = [];
  }

  async checkEndpoint(endpoint, retries = CONFIG.retries) {
    const startTime = performance.now();

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), CONFIG.timeout);

      const response = await fetch(endpoint.url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'ROKO-HealthCheck/1.0'
        }
      });

      clearTimeout(timeout);
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      const result = {
        name: endpoint.name,
        url: endpoint.url,
        status: response.status,
        ok: response.ok,
        responseTime: Math.round(responseTime),
        timestamp: new Date().toISOString()
      };

      // Check performance thresholds
      if (responseTime > CONFIG.performance.maxLoadTime) {
        result.warning = `Response time (${Math.round(responseTime)}ms) exceeds threshold (${CONFIG.performance.maxLoadTime}ms)`;
      }

      this.results.push(result);
      return result;

    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying ${endpoint.name} (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.checkEndpoint(endpoint, retries - 1);
      }

      const errorResult = {
        name: endpoint.name,
        url: endpoint.url,
        error: error.message,
        ok: false,
        timestamp: new Date().toISOString()
      };

      this.errors.push(errorResult);
      return errorResult;
    }
  }

  async checkSecurityHeaders(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });

      const requiredHeaders = [
        'x-frame-options',
        'x-content-type-options',
        'strict-transport-security',
        'content-security-policy'
      ];

      const headers = {};
      const missing = [];

      requiredHeaders.forEach(header => {
        const value = response.headers.get(header);
        if (value) {
          headers[header] = value;
        } else {
          missing.push(header);
        }
      });

      return {
        url,
        headers,
        missing,
        secure: missing.length === 0
      };

    } catch (error) {
      return {
        url,
        error: error.message,
        secure: false
      };
    }
  }

  async checkPerformance(url) {
    try {
      const startTime = performance.now();

      const response = await fetch(url);
      const ttfb = performance.now() - startTime;

      // Simple performance metrics
      const metrics = {
        url,
        ttfb: Math.round(ttfb),
        status: response.status,
        contentLength: response.headers.get('content-length'),
        cacheControl: response.headers.get('cache-control'),
        timestamp: new Date().toISOString()
      };

      // Performance warnings
      const warnings = [];
      if (ttfb > CONFIG.performance.maxTTFB) {
        warnings.push(`TTFB (${Math.round(ttfb)}ms) exceeds threshold (${CONFIG.performance.maxTTFB}ms)`);
      }

      if (warnings.length > 0) {
        metrics.warnings = warnings;
      }

      return metrics;

    } catch (error) {
      return {
        url,
        error: error.message
      };
    }
  }

  async runHealthCheck() {
    console.log('🔍 Starting ROKO Network Health Check...\n');

    // Check main endpoints
    console.log('📄 Checking main endpoints...');
    for (const endpoint of CONFIG.endpoints) {
      const result = await this.checkEndpoint(endpoint);

      if (result.ok) {
        console.log(`✅ ${result.name}: ${result.status} (${result.responseTime}ms)`);
      } else {
        console.log(`❌ ${result.name}: ${result.error || result.status}`);
      }
    }

    // Check API endpoints
    console.log('\n🔌 Checking API endpoints...');
    for (const api of CONFIG.apis) {
      const result = await this.checkEndpoint(api);

      if (result.ok) {
        console.log(`✅ ${result.name}: ${result.status} (${result.responseTime}ms)`);
      } else {
        console.log(`❌ ${result.name}: ${result.error || result.status}`);
      }
    }

    // Check security headers
    console.log('\n🔒 Checking security headers...');
    const securityCheck = await this.checkSecurityHeaders('https://roko.network');

    if (securityCheck.secure) {
      console.log('✅ All required security headers present');
    } else {
      console.log(`❌ Missing security headers: ${securityCheck.missing.join(', ')}`);
    }

    // Check performance
    console.log('\n⚡ Checking performance...');
    const perfCheck = await this.checkPerformance('https://roko.network');

    if (perfCheck.warnings) {
      console.log(`⚠️ Performance warnings: ${perfCheck.warnings.join(', ')}`);
    } else {
      console.log(`✅ Performance check passed (TTFB: ${perfCheck.ttfb}ms)`);
    }

    // Generate summary
    this.generateSummary();
  }

  generateSummary() {
    console.log('\n📊 Health Check Summary');
    console.log('========================');

    const totalChecks = this.results.length;
    const passedChecks = this.results.filter(r => r.ok).length;
    const failedChecks = this.errors.length;

    console.log(`Total Checks: ${totalChecks + failedChecks}`);
    console.log(`Passed: ${passedChecks}`);
    console.log(`Failed: ${failedChecks}`);
    console.log(`Success Rate: ${Math.round((passedChecks / (totalChecks + failedChecks)) * 100)}%`);

    if (failedChecks > 0) {
      console.log('\n❌ Failed Checks:');
      this.errors.forEach(error => {
        console.log(`  • ${error.name}: ${error.error}`);
      });
    }

    // Performance summary
    const avgResponseTime = this.results
      .filter(r => r.responseTime)
      .reduce((sum, r) => sum + r.responseTime, 0) / this.results.length;

    console.log(`\nAverage Response Time: ${Math.round(avgResponseTime)}ms`);

    // Exit with appropriate code
    process.exit(failedChecks > 0 ? 1 : 0);
  }

  async runContinuousMonitoring(interval = 60000) {
    console.log(`🔄 Starting continuous monitoring (${interval / 1000}s intervals)...\n`);

    setInterval(async () => {
      this.results = [];
      this.errors = [];
      await this.runHealthCheck();
    }, interval);
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const healthChecker = new HealthChecker();

  if (args.includes('--continuous')) {
    const interval = parseInt(args[args.indexOf('--interval') + 1]) || 60000;
    await healthChecker.runContinuousMonitoring(interval);
  } else {
    await healthChecker.runHealthCheck();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Health check failed:', error);
    process.exit(1);
  });
}

export default HealthChecker;