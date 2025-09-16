#!/usr/bin/env node

/**
 * @fileoverview QA Test Execution Script
 * @author ROKO QA Team
 * @version 1.0.0
 * 
 * Comprehensive test execution with reporting and coverage analysis
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const Colors = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Red: '\x1b[31m',
  Green: '\x1b[32m',
  Yellow: '\x1b[33m',
  Blue: '\x1b[34m',
  Magenta: '\x1b[35m',
  Cyan: '\x1b[36m',
};

class QATestRunner {
  constructor() {
    this.results = {
      typeCheck: { status: 'pending', duration: 0, errors: [] },
      lint: { status: 'pending', duration: 0, errors: [] },
      unitTests: { status: 'pending', duration: 0, coverage: null, errors: [] },
      integrationTests: { status: 'pending', duration: 0, errors: [] },
      e2eTests: { status: 'pending', duration: 0, errors: [] },
      accessibilityTests: { status: 'pending', duration: 0, errors: [] },
      performanceTests: { status: 'pending', duration: 0, errors: [] },
      securityTests: { status: 'pending', duration: 0, errors: [] }
    };
    
    this.startTime = Date.now();
    this.reportDir = join(process.cwd(), 'qa-reports');
    
    // Ensure report directory exists
    if (!existsSync(this.reportDir)) {
      mkdirSync(this.reportDir, { recursive: true });
    }
  }

  log(message, color = Colors.Reset) {
    console.log(`${color}${message}${Colors.Reset}`);
  }

  logHeader(message) {
    this.log(`\n${'='.repeat(60)}`, Colors.Cyan);
    this.log(` ${message}`, Colors.Cyan + Colors.Bright);
    this.log(`${'='.repeat(60)}`, Colors.Cyan);
  }

  logStep(step, status = 'running') {
    const statusColors = {
      running: Colors.Blue,
      success: Colors.Green,
      error: Colors.Red,
      warning: Colors.Yellow
    };
    
    const statusSymbols = {
      running: '⏳',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    };
    
    this.log(`${statusSymbols[status]} ${step}`, statusColors[status]);
  }

  async runCommand(command, testName, options = {}) {
    const startTime = Date.now();
    this.logStep(`Running ${testName}...`, 'running');
    
    try {
      const result = execSync(command, {
        stdio: options.silent ? 'pipe' : 'inherit',
        encoding: 'utf8',
        ...options
      });
      
      const duration = Date.now() - startTime;
      this.results[testName].status = 'success';
      this.results[testName].duration = duration;
      
      this.logStep(`${testName} completed (${duration}ms)`, 'success');
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.results[testName].status = 'error';
      this.results[testName].duration = duration;
      this.results[testName].errors.push(error.message);
      
      this.logStep(`${testName} failed (${duration}ms)`, 'error');
      if (!options.continueOnError) {
        throw error;
      }
      return null;
    }
  }

  async runTypeCheck() {
    this.logHeader('Type Checking');
    await this.runCommand('npm run type-check', 'typeCheck');
  }

  async runLinting() {
    this.logHeader('Code Linting');
    await this.runCommand('npm run lint', 'lint');
  }

  async runUnitTests() {
    this.logHeader('Unit Tests');
    
    try {
      const result = await this.runCommand(
        'npm run test:unit -- --reporter=json --outputFile=./qa-reports/unit-test-results.json',
        'unitTests'
      );
      
      // Extract coverage information
      if (existsSync('./coverage/coverage-summary.json')) {
        const coverageData = JSON.parse(
          require('fs').readFileSync('./coverage/coverage-summary.json', 'utf8')
        );
        
        this.results.unitTests.coverage = {
          lines: coverageData.total.lines.pct,
          functions: coverageData.total.functions.pct,
          branches: coverageData.total.branches.pct,
          statements: coverageData.total.statements.pct
        };
        
        this.log(`\nCoverage Summary:`, Colors.Cyan);
        this.log(`  Lines: ${coverageData.total.lines.pct}%`, Colors.Blue);
        this.log(`  Functions: ${coverageData.total.functions.pct}%`, Colors.Blue);
        this.log(`  Branches: ${coverageData.total.branches.pct}%`, Colors.Blue);
        this.log(`  Statements: ${coverageData.total.statements.pct}%`, Colors.Blue);
        
        // Check coverage thresholds
        const threshold = 80;
        const belowThreshold = Object.values(coverageData.total)
          .some(metric => metric.pct < threshold);
        
        if (belowThreshold) {
          this.logStep('Coverage below 80% threshold', 'warning');
        }
      }
    } catch (error) {
      this.logStep('Unit tests failed', 'error');
    }
  }

  async runIntegrationTests() {
    this.logHeader('Integration Tests');
    
    if (existsSync('./src/__tests__/integration')) {
      await this.runCommand(
        'npm run test:integration',
        'integrationTests',
        { continueOnError: true }
      );
    } else {
      this.logStep('No integration tests found', 'warning');
      this.results.integrationTests.status = 'skipped';
    }
  }

  async runE2ETests() {
    this.logHeader('E2E Tests');
    
    try {
      // Start the application
      this.logStep('Building application...', 'running');
      await this.runCommand('npm run build', 'build', { silent: true });
      
      this.logStep('Starting application server...', 'running');
      const serverProcess = execSync('npm run preview &', { stdio: 'pipe' });
      
      // Wait for server to start
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      await this.runCommand(
        'npm run test:e2e -- --reporter=json --outputFile=./qa-reports/e2e-test-results.json',
        'e2eTests',
        { continueOnError: true }
      );
      
      // Clean up server process
      try {
        execSync('pkill -f "vite preview"', { stdio: 'ignore' });
      } catch (e) {
        // Ignore cleanup errors
      }
    } catch (error) {
      this.logStep('E2E tests setup failed', 'error');
    }
  }

  async runAccessibilityTests() {
    this.logHeader('Accessibility Tests');
    
    if (existsSync('./.pa11yci')) {
      await this.runCommand(
        'npm run test:a11y',
        'accessibilityTests',
        { continueOnError: true }
      );
    } else {
      this.logStep('Pa11y configuration not found', 'warning');
      this.results.accessibilityTests.status = 'skipped';
    }
  }

  async runPerformanceTests() {
    this.logHeader('Performance Tests');
    
    if (existsSync('./lighthouse.config.js')) {
      await this.runCommand(
        'npm run perf:check',
        'performanceTests',
        { continueOnError: true }
      );
    } else {
      this.logStep('Performance testing configuration not found', 'warning');
      this.results.performanceTests.status = 'skipped';
    }
  }

  async runSecurityTests() {
    this.logHeader('Security Tests');
    
    try {
      await this.runCommand(
        'npm audit --audit-level moderate --json > ./qa-reports/security-audit.json',
        'securityTests',
        { continueOnError: true }
      );
    } catch (error) {
      this.logStep('Security audit completed with warnings', 'warning');
    }
  }

  generateReport() {
    this.logHeader('Test Report Generation');
    
    const totalDuration = Date.now() - this.startTime;
    const successCount = Object.values(this.results)
      .filter(result => result.status === 'success').length;
    const totalTests = Object.keys(this.results).length;
    
    const report = {
      timestamp: new Date().toISOString(),
      duration: totalDuration,
      summary: {
        total: totalTests,
        passed: successCount,
        failed: Object.values(this.results).filter(r => r.status === 'error').length,
        skipped: Object.values(this.results).filter(r => r.status === 'skipped').length,
        warnings: Object.values(this.results).filter(r => r.status === 'warning').length
      },
      results: this.results,
      coverage: this.results.unitTests.coverage,
      recommendations: this.generateRecommendations()
    };
    
    // Write JSON report
    writeFileSync(
      join(this.reportDir, 'qa-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    // Write HTML report
    this.generateHTMLReport(report);
    
    this.logStep('Reports generated in ./qa-reports/', 'success');
    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Coverage recommendations
    if (this.results.unitTests.coverage) {
      const coverage = this.results.unitTests.coverage;
      Object.entries(coverage).forEach(([metric, value]) => {
        if (value < 80) {
          recommendations.push({
            type: 'coverage',
            severity: 'medium',
            message: `${metric} coverage (${value}%) is below 80% threshold`
          });
        }
      });
    }
    
    // Failed test recommendations
    Object.entries(this.results).forEach(([testName, result]) => {
      if (result.status === 'error') {
        recommendations.push({
          type: 'failure',
          severity: 'high',
          message: `${testName} failed and should be investigated`,
          errors: result.errors
        });
      }
    });
    
    // Performance recommendations
    if (this.results.performanceTests.status === 'skipped') {
      recommendations.push({
        type: 'setup',
        severity: 'low',
        message: 'Consider setting up performance testing with Lighthouse'
      });
    }
    
    return recommendations;
  }

  generateHTMLReport(report) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ROKO Network QA Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 6px; text-align: center; }
        .metric-value { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
        .metric-label { color: #666; font-size: 0.9em; }
        .success { color: #28a745; }
        .error { color: #dc3545; }
        .warning { color: #ffc107; }
        .skipped { color: #6c757d; }
        .test-results { margin-top: 30px; }
        .test-item { padding: 15px; border-left: 4px solid #dee2e6; margin-bottom: 10px; background: #f8f9fa; }
        .test-item.success { border-color: #28a745; }
        .test-item.error { border-color: #dc3545; }
        .test-item.warning { border-color: #ffc107; }
        .test-item.skipped { border-color: #6c757d; }
        .coverage-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .coverage-item { text-align: center; padding: 15px; background: #e9ecef; border-radius: 4px; }
        .recommendations { margin-top: 30px; }
        .recommendation { padding: 15px; margin-bottom: 10px; border-radius: 4px; }
        .recommendation.high { background: #f8d7da; border: 1px solid #f5c6cb; }
        .recommendation.medium { background: #fff3cd; border: 1px solid #ffeaa7; }
        .recommendation.low { background: #d1ecf1; border: 1px solid #bee5eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ROKO Network QA Report</h1>
            <p>Generated on ${new Date(report.timestamp).toLocaleString()}</p>
            <p>Total Duration: ${Math.round(report.duration / 1000)}s</p>
        </div>
        
        <div class="summary">
            <div class="metric">
                <div class="metric-value success">${report.summary.passed}</div>
                <div class="metric-label">Tests Passed</div>
            </div>
            <div class="metric">
                <div class="metric-value error">${report.summary.failed}</div>
                <div class="metric-label">Tests Failed</div>
            </div>
            <div class="metric">
                <div class="metric-value warning">${report.summary.warnings}</div>
                <div class="metric-label">Warnings</div>
            </div>
            <div class="metric">
                <div class="metric-value skipped">${report.summary.skipped}</div>
                <div class="metric-label">Skipped</div>
            </div>
        </div>
        
        ${report.coverage ? `
        <h2>Coverage Report</h2>
        <div class="coverage-grid">
            <div class="coverage-item">
                <strong>${report.coverage.lines}%</strong><br>Lines
            </div>
            <div class="coverage-item">
                <strong>${report.coverage.functions}%</strong><br>Functions
            </div>
            <div class="coverage-item">
                <strong>${report.coverage.branches}%</strong><br>Branches
            </div>
            <div class="coverage-item">
                <strong>${report.coverage.statements}%</strong><br>Statements
            </div>
        </div>
        ` : ''}
        
        <div class="test-results">
            <h2>Test Results</h2>
            ${Object.entries(report.results).map(([name, result]) => `
                <div class="test-item ${result.status}">
                    <h3>${name.charAt(0).toUpperCase() + name.slice(1)}</h3>
                    <p>Status: <strong>${result.status}</strong> | Duration: ${result.duration}ms</p>
                    ${result.errors.length > 0 ? `<p>Errors: ${result.errors.join(', ')}</p>` : ''}
                </div>
            `).join('')}
        </div>
        
        ${report.recommendations.length > 0 ? `
        <div class="recommendations">
            <h2>Recommendations</h2>
            ${report.recommendations.map(rec => `
                <div class="recommendation ${rec.severity}">
                    <strong>${rec.type.toUpperCase()}:</strong> ${rec.message}
                </div>
            `).join('')}
        </div>
        ` : ''}
    </div>
</body>
</html>`;

    writeFileSync(join(this.reportDir, 'qa-report.html'), html);
  }

  printSummary(report) {
    this.logHeader('QA Test Summary');
    
    this.log(`\nExecution Time: ${Math.round(report.duration / 1000)}s`, Colors.Cyan);
    this.log(`Tests Passed: ${report.summary.passed}/${report.summary.total}`, Colors.Green);
    
    if (report.summary.failed > 0) {
      this.log(`Tests Failed: ${report.summary.failed}`, Colors.Red);
    }
    
    if (report.summary.warnings > 0) {
      this.log(`Warnings: ${report.summary.warnings}`, Colors.Yellow);
    }
    
    if (report.coverage) {
      this.log(`\nOverall Coverage:`, Colors.Cyan);
      this.log(`  Lines: ${report.coverage.lines}%`, Colors.Blue);
      this.log(`  Functions: ${report.coverage.functions}%`, Colors.Blue);
      this.log(`  Branches: ${report.coverage.branches}%`, Colors.Blue);
      this.log(`  Statements: ${report.coverage.statements}%`, Colors.Blue);
    }
    
    this.log(`\nDetailed reports available in: ./qa-reports/`, Colors.Cyan);
    
    if (report.summary.failed > 0) {
      this.log(`\n❌ QA tests completed with failures`, Colors.Red);
      process.exit(1);
    } else {
      this.log(`\n✅ All QA tests completed successfully!`, Colors.Green);
    }
  }

  async run() {
    this.logHeader('ROKO Network QA Test Suite');
    this.log(`Starting comprehensive testing at ${new Date().toLocaleString()}`, Colors.Cyan);
    
    try {
      // Run all test suites
      await this.runTypeCheck();
      await this.runLinting();
      await this.runUnitTests();
      await this.runIntegrationTests();
      await this.runE2ETests();
      await this.runAccessibilityTests();
      await this.runPerformanceTests();
      await this.runSecurityTests();
      
      // Generate reports
      const report = this.generateReport();
      this.printSummary(report);
      
    } catch (error) {
      this.log(`\n❌ QA test suite failed: ${error.message}`, Colors.Red);
      process.exit(1);
    }
  }
}

// Run the QA test suite
const runner = new QATestRunner();
runner.run().catch(console.error);
