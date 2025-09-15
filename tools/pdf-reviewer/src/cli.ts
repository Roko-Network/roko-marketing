#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import ora from 'ora';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { PDFReviewer } from './lib/PDFReviewer.js';
import { PDFAnalyzer } from './lib/PDFAnalyzer.js';
import { ImageExtractor } from './lib/ImageExtractor.js';
import { DesignReviewer } from './lib/DesignReviewer.js';
import { ReportGenerator } from './lib/ReportGenerator.js';
import { version } from '../package.json';

// Display banner
console.log(
  chalk.cyan(
    figlet.textSync('PDF Reviewer', {
      font: 'Standard',
      horizontalLayout: 'default',
    })
  )
);

console.log(chalk.gray('ROKO Network - Design Review Tool\n'));

// Configure CLI
program
  .name('pdf-review')
  .description('CLI tool for reviewing PDF exports from Figma and design tools')
  .version(version);

// Review command
program
  .command('review <file>')
  .description('Review a PDF file with interactive analysis')
  .option('-o, --output <dir>', 'Output directory for extracted assets', './pdf-output')
  .option('-f, --format <type>', 'Report format (json|html|markdown)', 'markdown')
  .option('--extract-images', 'Extract all images from PDF', false)
  .option('--extract-text', 'Extract all text content', false)
  .option('--analyze-colors', 'Analyze color palette', false)
  .option('--check-accessibility', 'Check accessibility issues', false)
  .action(async (file: string, options) => {
    const spinner = ora('Loading PDF file...').start();

    try {
      // Validate file exists
      if (!existsSync(file)) {
        spinner.fail(chalk.red(`File not found: ${file}`));
        process.exit(1);
      }

      // Initialize reviewer
      const reviewer = new PDFReviewer(file, options.output);
      await reviewer.load();

      spinner.succeed('PDF loaded successfully');

      // Interactive menu
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: '📊 Quick Analysis', value: 'quick' },
            { name: '🎨 Design Review', value: 'design' },
            { name: '📝 Extract Content', value: 'extract' },
            { name: '🔍 Detailed Analysis', value: 'detailed' },
            { name: '♿ Accessibility Check', value: 'accessibility' },
            { name: '📋 Generate Report', value: 'report' },
            { name: '🖼️ Extract All Assets', value: 'assets' },
            { name: '🎯 Interactive Review', value: 'interactive' },
          ],
        },
      ]);

      await handleAction(action, reviewer, options);
    } catch (error) {
      spinner.fail(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Extract command
program
  .command('extract <file>')
  .description('Extract content from PDF')
  .option('-o, --output <dir>', 'Output directory', './pdf-output')
  .option('--images', 'Extract images only', false)
  .option('--text', 'Extract text only', false)
  .option('--fonts', 'Extract font information', false)
  .option('--pages <range>', 'Page range (e.g., 1-5, 1,3,5)', '')
  .action(async (file: string, options) => {
    const spinner = ora('Extracting content...').start();

    try {
      const extractor = new ImageExtractor(file, options.output);

      if (options.images || (!options.text && !options.fonts)) {
        const images = await extractor.extractImages(options.pages);
        spinner.succeed(chalk.green(`Extracted ${images.length} images`));
      }

      if (options.text) {
        const analyzer = new PDFAnalyzer(file);
        const text = await analyzer.extractText(options.pages);
        await analyzer.saveText(text, options.output);
        spinner.succeed(chalk.green('Text content extracted'));
      }

      if (options.fonts) {
        const analyzer = new PDFAnalyzer(file);
        const fonts = await analyzer.extractFonts();
        await analyzer.saveFonts(fonts, options.output);
        spinner.succeed(chalk.green(`Found ${fonts.length} fonts`));
      }
    } catch (error) {
      spinner.fail(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Analyze command
program
  .command('analyze <file>')
  .description('Analyze PDF design elements')
  .option('-o, --output <dir>', 'Output directory for report', './pdf-output')
  .option('--colors', 'Analyze color palette', false)
  .option('--typography', 'Analyze typography', false)
  .option('--layout', 'Analyze layout structure', false)
  .option('--consistency', 'Check design consistency', false)
  .action(async (file: string, options) => {
    const spinner = ora('Analyzing PDF...').start();

    try {
      const analyzer = new PDFAnalyzer(file);
      const designReviewer = new DesignReviewer(analyzer);

      const analysis: any = {
        file: path.basename(file),
        timestamp: new Date().toISOString(),
      };

      if (options.colors) {
        spinner.text = 'Analyzing colors...';
        analysis.colors = await designReviewer.analyzeColors();
      }

      if (options.typography) {
        spinner.text = 'Analyzing typography...';
        analysis.typography = await designReviewer.analyzeTypography();
      }

      if (options.layout) {
        spinner.text = 'Analyzing layout...';
        analysis.layout = await designReviewer.analyzeLayout();
      }

      if (options.consistency) {
        spinner.text = 'Checking consistency...';
        analysis.consistency = await designReviewer.checkConsistency();
      }

      // Generate report
      const reporter = new ReportGenerator(analysis);
      await reporter.save(options.output, 'json');

      spinner.succeed(chalk.green('Analysis complete'));
      console.log(chalk.cyan('\nAnalysis Summary:'));
      displayAnalysisSummary(analysis);
    } catch (error) {
      spinner.fail(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Compare command
program
  .command('compare <file1> <file2>')
  .description('Compare two PDF designs')
  .option('-o, --output <dir>', 'Output directory for comparison', './pdf-output')
  .option('--visual', 'Generate visual diff', false)
  .action(async (file1: string, file2: string, options) => {
    const spinner = ora('Comparing PDFs...').start();

    try {
      const reviewer1 = new PDFReviewer(file1, options.output);
      const reviewer2 = new PDFReviewer(file2, options.output);

      await Promise.all([reviewer1.load(), reviewer2.load()]);

      const comparison = await reviewer1.compare(reviewer2);

      if (options.visual) {
        spinner.text = 'Generating visual diff...';
        await reviewer1.generateVisualDiff(reviewer2, options.output);
      }

      spinner.succeed(chalk.green('Comparison complete'));
      displayComparison(comparison);
    } catch (error) {
      spinner.fail(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Batch command
program
  .command('batch <pattern>')
  .description('Process multiple PDFs (e.g., "*.pdf")')
  .option('-o, --output <dir>', 'Output directory', './pdf-output')
  .option('--action <type>', 'Action to perform (extract|analyze|report)', 'report')
  .action(async (pattern: string, options) => {
    const spinner = ora('Processing batch...').start();

    try {
      const glob = await import('glob');
      const files = await glob.glob(pattern);

      if (files.length === 0) {
        spinner.fail(chalk.yellow('No files found matching pattern'));
        process.exit(1);
      }

      spinner.text = `Found ${files.length} files`;

      for (const file of files) {
        spinner.text = `Processing ${path.basename(file)}...`;

        const reviewer = new PDFReviewer(file, options.output);
        await reviewer.load();

        switch (options.action) {
          case 'extract':
            await reviewer.extractAll();
            break;
          case 'analyze':
            await reviewer.analyze();
            break;
          case 'report':
            await reviewer.generateReport();
            break;
        }
      }

      spinner.succeed(chalk.green(`Processed ${files.length} files`));
    } catch (error) {
      spinner.fail(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Helper functions
async function handleAction(
  action: string,
  reviewer: PDFReviewer,
  options: any
): Promise<void> {
  const spinner = ora();

  switch (action) {
    case 'quick':
      spinner.start('Running quick analysis...');
      const quickAnalysis = await reviewer.quickAnalysis();
      spinner.succeed('Quick analysis complete');
      displayQuickAnalysis(quickAnalysis);
      break;

    case 'design':
      spinner.start('Reviewing design...');
      const designReview = await reviewer.reviewDesign();
      spinner.succeed('Design review complete');
      displayDesignReview(designReview);
      break;

    case 'extract':
      const { extractType } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'extractType',
          message: 'What to extract?',
          choices: ['Images', 'Text', 'Fonts', 'Colors', 'All'],
        },
      ]);
      spinner.start('Extracting content...');
      await reviewer.extract(extractType);
      spinner.succeed('Extraction complete');
      break;

    case 'detailed':
      spinner.start('Running detailed analysis...');
      const detailedAnalysis = await reviewer.detailedAnalysis();
      spinner.succeed('Detailed analysis complete');
      displayDetailedAnalysis(detailedAnalysis);
      break;

    case 'accessibility':
      spinner.start('Checking accessibility...');
      const a11y = await reviewer.checkAccessibility();
      spinner.succeed('Accessibility check complete');
      displayAccessibilityResults(a11y);
      break;

    case 'report':
      const { format } = await inquirer.prompt([
        {
          type: 'list',
          name: 'format',
          message: 'Report format?',
          choices: ['HTML', 'Markdown', 'JSON'],
        },
      ]);
      spinner.start('Generating report...');
      await reviewer.generateReport(format.toLowerCase());
      spinner.succeed(`Report saved to ${options.output}`);
      break;

    case 'assets':
      spinner.start('Extracting all assets...');
      await reviewer.extractAllAssets();
      spinner.succeed('All assets extracted');
      break;

    case 'interactive':
      await interactiveReview(reviewer);
      break;
  }
}

async function interactiveReview(reviewer: PDFReviewer): Promise<void> {
  let continueReview = true;

  while (continueReview) {
    const { page } = await inquirer.prompt([
      {
        type: 'input',
        name: 'page',
        message: 'Enter page number to review (or "q" to quit):',
        validate: (input) => {
          if (input === 'q') return true;
          const num = parseInt(input);
          return !isNaN(num) && num > 0 ? true : 'Please enter a valid page number';
        },
      },
    ]);

    if (page === 'q') {
      continueReview = false;
      continue;
    }

    const pageNum = parseInt(page);
    const pageReview = await reviewer.reviewPage(pageNum);
    displayPageReview(pageReview);

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'Extract this page',
          'Add comment',
          'Flag issue',
          'Next page',
          'Previous page',
          'Back to page selection',
        ],
      },
    ]);

    await handlePageAction(action, reviewer, pageNum);
  }
}

function displayQuickAnalysis(analysis: any): void {
  console.log(chalk.cyan('\n📊 Quick Analysis Results:'));
  console.log(chalk.white(`  Pages: ${analysis.pageCount}`));
  console.log(chalk.white(`  File Size: ${analysis.fileSize}`));
  console.log(chalk.white(`  Images: ${analysis.imageCount}`));
  console.log(chalk.white(`  Text Blocks: ${analysis.textBlocks}`));
  console.log(chalk.white(`  Primary Colors: ${analysis.primaryColors.join(', ')}`));
}

function displayDesignReview(review: any): void {
  console.log(chalk.cyan('\n🎨 Design Review:'));
  console.log(chalk.white('\n  Layout:'));
  console.log(`    Grid: ${review.layout.hasGrid ? '✓' : '✗'}`);
  console.log(`    Consistency: ${review.layout.consistency}%`);

  console.log(chalk.white('\n  Typography:'));
  console.log(`    Font Families: ${review.typography.families.join(', ')}`);
  console.log(`    Size Range: ${review.typography.sizeRange}`);

  console.log(chalk.white('\n  Colors:'));
  console.log(`    Palette Size: ${review.colors.paletteSize}`);
  console.log(`    Contrast Issues: ${review.colors.contrastIssues}`);
}

function displayDetailedAnalysis(analysis: any): void {
  console.log(chalk.cyan('\n🔍 Detailed Analysis:'));
  // Display comprehensive analysis results
  console.log(JSON.stringify(analysis, null, 2));
}

function displayAccessibilityResults(results: any): void {
  console.log(chalk.cyan('\n♿ Accessibility Check:'));

  if (results.issues.length === 0) {
    console.log(chalk.green('  ✓ No accessibility issues found'));
  } else {
    console.log(chalk.yellow(`  ⚠ Found ${results.issues.length} issues:`));
    results.issues.forEach((issue: any) => {
      console.log(`    - ${issue.type}: ${issue.description}`);
    });
  }
}

function displayAnalysisSummary(analysis: any): void {
  const Table = require('cli-table3');
  const table = new Table({
    head: ['Property', 'Value'],
    style: { head: ['cyan'] },
  });

  Object.entries(analysis).forEach(([key, value]) => {
    if (typeof value === 'object') {
      table.push([key, JSON.stringify(value, null, 2)]);
    } else {
      table.push([key, value]);
    }
  });

  console.log(table.toString());
}

function displayComparison(comparison: any): void {
  console.log(chalk.cyan('\n📊 Comparison Results:'));
  console.log(chalk.white(`  Similarity: ${comparison.similarity}%`));
  console.log(chalk.white(`  Layout Match: ${comparison.layoutMatch}%`));
  console.log(chalk.white(`  Color Match: ${comparison.colorMatch}%`));
  console.log(chalk.white('\n  Differences:'));
  comparison.differences.forEach((diff: string) => {
    console.log(`    - ${diff}`);
  });
}

function displayPageReview(review: any): void {
  console.log(chalk.cyan(`\n📄 Page ${review.pageNumber} Review:`));
  console.log(chalk.white(`  Elements: ${review.elementCount}`));
  console.log(chalk.white(`  Text: ${review.hasText ? 'Yes' : 'No'}`));
  console.log(chalk.white(`  Images: ${review.imageCount}`));
  console.log(chalk.white(`  Dominant Colors: ${review.dominantColors.join(', ')}`));
}

async function handlePageAction(
  action: string,
  reviewer: PDFReviewer,
  pageNum: number
): Promise<void> {
  switch (action) {
    case 'Extract this page':
      await reviewer.extractPage(pageNum);
      console.log(chalk.green('Page extracted successfully'));
      break;
    case 'Add comment':
      const { comment } = await inquirer.prompt([
        {
          type: 'input',
          name: 'comment',
          message: 'Enter your comment:',
        },
      ]);
      await reviewer.addComment(pageNum, comment);
      console.log(chalk.green('Comment added'));
      break;
    case 'Flag issue':
      const { issue } = await inquirer.prompt([
        {
          type: 'input',
          name: 'issue',
          message: 'Describe the issue:',
        },
      ]);
      await reviewer.flagIssue(pageNum, issue);
      console.log(chalk.yellow('Issue flagged'));
      break;
  }
}

// Parse arguments
program.parse(process.argv);

// Show help if no arguments
if (!process.argv.slice(2).length) {
  program.outputHelp();
}