#!/usr/bin/env node

/**
 * Asset Optimization Script for ROKO Network Marketing Site
 * Optimizes images, generates WebP versions, and validates asset sizes
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  inputDir: path.join(__dirname, '../dist'),
  outputDir: path.join(__dirname, '../dist-optimized'),
  imageFormats: ['.jpg', '.jpeg', '.png', '.gif', '.svg'],
  webpQuality: 85,
  jpegQuality: 90,
  pngQuality: 90,
  maxImageSize: 1024 * 1024, // 1MB
  gzipAssets: ['.js', '.css', '.html', '.json', '.xml'],
  brotliAssets: ['.js', '.css', '.html', '.json', '.xml']
};

class AssetOptimizer {
  constructor() {
    this.stats = {
      processed: 0,
      optimized: 0,
      errors: 0,
      totalSizeBefore: 0,
      totalSizeAfter: 0
    };
  }

  async ensureDirectoryExists(dir) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  async getFileSize(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch {
      return 0;
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async optimizeImage(inputPath, outputPath) {
    const ext = path.extname(inputPath).toLowerCase();
    const baseName = path.basename(inputPath, ext);
    const outputDir = path.dirname(outputPath);

    try {
      // Ensure output directory exists
      await this.ensureDirectoryExists(outputDir);

      const sizeBefore = await this.getFileSize(inputPath);

      if (ext === '.svg') {
        // Optimize SVG with SVGO
        try {
          execSync(`npx svgo "${inputPath}" -o "${outputPath}"`, { stdio: 'pipe' });
        } catch {
          // Fallback to copy if SVGO fails
          await fs.copyFile(inputPath, outputPath);
        }
      } else if (['.jpg', '.jpeg'].includes(ext)) {
        // Optimize JPEG
        try {
          execSync(`npx imagemin "${inputPath}" --out-dir="${outputDir}" --plugin=imagemin-mozjpeg --plugin.quality=${CONFIG.jpegQuality}`, { stdio: 'pipe' });
        } catch {
          await fs.copyFile(inputPath, outputPath);
        }

        // Generate WebP version
        const webpPath = path.join(outputDir, `${baseName}.webp`);
        try {
          execSync(`npx imagemin "${inputPath}" --out-dir="${outputDir}" --plugin=imagemin-webp --plugin.quality=${CONFIG.webpQuality}`, { stdio: 'pipe' });
        } catch (error) {
          console.warn(`Failed to generate WebP for ${inputPath}: ${error.message}`);
        }
      } else if (ext === '.png') {
        // Optimize PNG
        try {
          execSync(`npx imagemin "${inputPath}" --out-dir="${outputDir}" --plugin=imagemin-pngquant --plugin.quality=[0.6,${CONFIG.pngQuality/100}]`, { stdio: 'pipe' });
        } catch {
          await fs.copyFile(inputPath, outputPath);
        }

        // Generate WebP version
        const webpPath = path.join(outputDir, `${baseName}.webp`);
        try {
          execSync(`npx imagemin "${inputPath}" --out-dir="${outputDir}" --plugin=imagemin-webp --plugin.quality=${CONFIG.webpQuality}`, { stdio: 'pipe' });
        } catch (error) {
          console.warn(`Failed to generate WebP for ${inputPath}: ${error.message}`);
        }
      } else {
        // Copy other image formats as-is
        await fs.copyFile(inputPath, outputPath);
      }

      const sizeAfter = await this.getFileSize(outputPath);
      const savings = sizeBefore - sizeAfter;
      const savingsPercent = sizeBefore > 0 ? ((savings / sizeBefore) * 100).toFixed(1) : 0;

      this.stats.totalSizeBefore += sizeBefore;
      this.stats.totalSizeAfter += sizeAfter;

      console.log(`📷 ${path.basename(inputPath)}: ${this.formatBytes(sizeBefore)} → ${this.formatBytes(sizeAfter)} (${savingsPercent}% saved)`);

      return { sizeBefore, sizeAfter, savings };

    } catch (error) {
      console.error(`❌ Failed to optimize ${inputPath}: ${error.message}`);
      this.stats.errors++;

      // Fallback to copy
      try {
        await fs.copyFile(inputPath, outputPath);
      } catch (copyError) {
        console.error(`❌ Failed to copy ${inputPath}: ${copyError.message}`);
      }

      return null;
    }
  }

  async compressTextAsset(inputPath, outputPath) {
    try {
      // Copy original file
      await fs.copyFile(inputPath, outputPath);

      const ext = path.extname(inputPath).toLowerCase();
      const sizeBefore = await this.getFileSize(inputPath);

      // Generate Gzip version
      if (CONFIG.gzipAssets.includes(ext)) {
        try {
          execSync(`gzip -9 -c "${outputPath}" > "${outputPath}.gz"`, { stdio: 'pipe' });
        } catch (error) {
          console.warn(`Failed to create Gzip for ${inputPath}: ${error.message}`);
        }
      }

      // Generate Brotli version
      if (CONFIG.brotliAssets.includes(ext)) {
        try {
          execSync(`brotli -q 11 -o "${outputPath}.br" "${outputPath}"`, { stdio: 'pipe' });
        } catch (error) {
          console.warn(`Failed to create Brotli for ${inputPath}: ${error.message}`);
        }
      }

      const gzipSize = await this.getFileSize(`${outputPath}.gz`);
      const brotliSize = await this.getFileSize(`${outputPath}.br`);

      console.log(`📄 ${path.basename(inputPath)}: ${this.formatBytes(sizeBefore)} (gz: ${this.formatBytes(gzipSize)}, br: ${this.formatBytes(brotliSize)})`);

      this.stats.totalSizeBefore += sizeBefore;
      this.stats.totalSizeAfter += sizeBefore; // Text assets aren't reduced in size, just compressed

      return { sizeBefore, gzipSize, brotliSize };

    } catch (error) {
      console.error(`❌ Failed to compress ${inputPath}: ${error.message}`);
      this.stats.errors++;
      return null;
    }
  }

  async processDirectory(inputDir, outputDir) {
    try {
      const entries = await fs.readdir(inputDir, { withFileTypes: true });

      for (const entry of entries) {
        const inputPath = path.join(inputDir, entry.name);
        const outputPath = path.join(outputDir, entry.name);

        if (entry.isDirectory()) {
          await this.ensureDirectoryExists(outputPath);
          await this.processDirectory(inputPath, outputPath);
        } else {
          this.stats.processed++;
          const ext = path.extname(entry.name).toLowerCase();

          if (CONFIG.imageFormats.includes(ext)) {
            const result = await this.optimizeImage(inputPath, outputPath);
            if (result) this.stats.optimized++;
          } else if (CONFIG.gzipAssets.includes(ext) || CONFIG.brotliAssets.includes(ext)) {
            const result = await this.compressTextAsset(inputPath, outputPath);
            if (result) this.stats.optimized++;
          } else {
            // Copy other files as-is
            await this.ensureDirectoryExists(path.dirname(outputPath));
            await fs.copyFile(inputPath, outputPath);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Failed to process directory ${inputDir}: ${error.message}`);
    }
  }

  async validateAssets() {
    console.log('\n🔍 Validating optimized assets...\n');

    const issues = [];

    try {
      const checkLargeAssets = async (dir, currentPath = '') => {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relativePath = path.join(currentPath, entry.name);

          if (entry.isDirectory()) {
            await checkLargeAssets(fullPath, relativePath);
          } else {
            const size = await this.getFileSize(fullPath);
            const ext = path.extname(entry.name).toLowerCase();

            // Check image sizes
            if (CONFIG.imageFormats.includes(ext) && size > CONFIG.maxImageSize) {
              issues.push({
                type: 'large-image',
                file: relativePath,
                size: this.formatBytes(size),
                limit: this.formatBytes(CONFIG.maxImageSize)
              });
            }

            // Check for missing WebP versions
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
              const webpPath = fullPath.replace(ext, '.webp');
              try {
                await fs.access(webpPath);
              } catch {
                issues.push({
                  type: 'missing-webp',
                  file: relativePath,
                  expected: relativePath.replace(ext, '.webp')
                });
              }
            }

            // Check for missing compression
            if (CONFIG.gzipAssets.includes(ext)) {
              try {
                await fs.access(`${fullPath}.gz`);
              } catch {
                issues.push({
                  type: 'missing-gzip',
                  file: relativePath
                });
              }
            }
          }
        }
      };

      await checkLargeAssets(CONFIG.outputDir);

      if (issues.length === 0) {
        console.log('✅ All assets pass validation checks');
      } else {
        console.log('⚠️ Asset validation issues found:');
        issues.forEach(issue => {
          switch (issue.type) {
            case 'large-image':
              console.log(`  • Large image: ${issue.file} (${issue.size} > ${issue.limit})`);
              break;
            case 'missing-webp':
              console.log(`  • Missing WebP: ${issue.expected}`);
              break;
            case 'missing-gzip':
              console.log(`  • Missing Gzip: ${issue.file}.gz`);
              break;
          }
        });
      }

      return issues;

    } catch (error) {
      console.error(`❌ Asset validation failed: ${error.message}`);
      return [];
    }
  }

  generateReport() {
    const totalSavings = this.stats.totalSizeBefore - this.stats.totalSizeAfter;
    const savingsPercent = this.stats.totalSizeBefore > 0
      ? ((totalSavings / this.stats.totalSizeBefore) * 100).toFixed(1)
      : 0;

    console.log('\n📊 Asset Optimization Summary');
    console.log('==============================');
    console.log(`Files Processed: ${this.stats.processed}`);
    console.log(`Files Optimized: ${this.stats.optimized}`);
    console.log(`Errors: ${this.stats.errors}`);
    console.log(`Total Size Before: ${this.formatBytes(this.stats.totalSizeBefore)}`);
    console.log(`Total Size After: ${this.formatBytes(this.stats.totalSizeAfter)}`);
    console.log(`Total Savings: ${this.formatBytes(totalSavings)} (${savingsPercent}%)`);
  }

  async run() {
    console.log('🎨 ROKO Network Asset Optimization');
    console.log('===================================\n');

    try {
      // Check if input directory exists
      await fs.access(CONFIG.inputDir);
    } catch {
      console.error(`❌ Input directory not found: ${CONFIG.inputDir}`);
      console.log('Run "npm run build" first to generate the dist directory.');
      process.exit(1);
    }

    // Clean output directory
    try {
      await fs.rm(CONFIG.outputDir, { recursive: true, force: true });
    } catch {
      // Directory doesn't exist, that's fine
    }

    await this.ensureDirectoryExists(CONFIG.outputDir);

    console.log(`📁 Processing assets from: ${CONFIG.inputDir}`);
    console.log(`📁 Output directory: ${CONFIG.outputDir}\n`);

    // Process all assets
    await this.processDirectory(CONFIG.inputDir, CONFIG.outputDir);

    // Validate optimized assets
    const issues = await this.validateAssets();

    // Generate report
    this.generateReport();

    // Exit with error if there were issues
    const hasErrors = this.stats.errors > 0 || issues.length > 0;
    process.exit(hasErrors ? 1 : 0);
  }
}

// CLI interface
async function main() {
  const optimizer = new AssetOptimizer();
  await optimizer.run();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Asset optimization failed:', error);
    process.exit(1);
  });
}

export default AssetOptimizer;