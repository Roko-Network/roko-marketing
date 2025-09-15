import { readFile, mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import * as pdfParse from 'pdf-parse';
import { PDFAnalyzer } from './PDFAnalyzer.js';
import { ImageExtractor } from './ImageExtractor.js';
import { DesignReviewer } from './DesignReviewer.js';
import { ReportGenerator } from './ReportGenerator.js';

export interface PDFMetadata {
  pageCount: number;
  fileSize: string;
  title?: string;
  author?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
}

export interface QuickAnalysisResult {
  pageCount: number;
  fileSize: string;
  imageCount: number;
  textBlocks: number;
  primaryColors: string[];
  fonts: string[];
  hasAccessibilityTags: boolean;
}

export class PDFReviewer {
  private filePath: string;
  private outputDir: string;
  private pdfData: any;
  private analyzer: PDFAnalyzer;
  private imageExtractor: ImageExtractor;
  private designReviewer: DesignReviewer;
  private comments: Map<number, string[]> = new Map();
  private issues: Map<number, string[]> = new Map();

  constructor(filePath: string, outputDir: string = './pdf-output') {
    this.filePath = filePath;
    this.outputDir = outputDir;
    this.analyzer = new PDFAnalyzer(filePath);
    this.imageExtractor = new ImageExtractor(filePath, outputDir);
    this.designReviewer = new DesignReviewer(this.analyzer);
  }

  async load(): Promise<void> {
    const dataBuffer = await readFile(this.filePath);
    this.pdfData = await pdfParse(dataBuffer);
    await this.ensureOutputDir();
  }

  private async ensureOutputDir(): Promise<void> {
    if (!existsSync(this.outputDir)) {
      await mkdir(this.outputDir, { recursive: true });
    }
  }

  async quickAnalysis(): Promise<QuickAnalysisResult> {
    const metadata = await this.getMetadata();
    const textAnalysis = await this.analyzer.extractText();
    const colorAnalysis = await this.designReviewer.analyzeColors();
    const fontAnalysis = await this.analyzer.extractFonts();

    return {
      pageCount: metadata.pageCount,
      fileSize: metadata.fileSize,
      imageCount: await this.countImages(),
      textBlocks: this.countTextBlocks(textAnalysis),
      primaryColors: colorAnalysis.primary || [],
      fonts: fontAnalysis.map(f => f.name),
      hasAccessibilityTags: await this.hasAccessibilityTags(),
    };
  }

  async reviewDesign(): Promise<any> {
    const layout = await this.designReviewer.analyzeLayout();
    const typography = await this.designReviewer.analyzeTypography();
    const colors = await this.designReviewer.analyzeColors();
    const consistency = await this.designReviewer.checkConsistency();

    return {
      layout,
      typography,
      colors,
      consistency,
      score: this.calculateDesignScore({ layout, typography, colors, consistency }),
    };
  }

  async extract(types: string[]): Promise<void> {
    const extractAll = types.includes('All');

    if (extractAll || types.includes('Images')) {
      await this.imageExtractor.extractImages();
    }

    if (extractAll || types.includes('Text')) {
      const text = await this.analyzer.extractText();
      await this.analyzer.saveText(text, this.outputDir);
    }

    if (extractAll || types.includes('Fonts')) {
      const fonts = await this.analyzer.extractFonts();
      await this.analyzer.saveFonts(fonts, this.outputDir);
    }

    if (extractAll || types.includes('Colors')) {
      const colors = await this.designReviewer.analyzeColors();
      await this.saveColors(colors);
    }
  }

  async detailedAnalysis(): Promise<any> {
    const metadata = await this.getMetadata();
    const structure = await this.analyzer.analyzeStructure();
    const content = await this.analyzer.analyzeContent();
    const design = await this.reviewDesign();
    const accessibility = await this.checkAccessibility();
    const performance = await this.analyzePerformance();

    return {
      metadata,
      structure,
      content,
      design,
      accessibility,
      performance,
      recommendations: this.generateRecommendations({
        structure,
        design,
        accessibility,
        performance,
      }),
    };
  }

  async checkAccessibility(): Promise<any> {
    const issues: any[] = [];
    const warnings: any[] = [];

    // Check for text alternatives
    if (!await this.hasAltText()) {
      issues.push({
        type: 'MISSING_ALT_TEXT',
        severity: 'high',
        description: 'Images without alternative text',
      });
    }

    // Check color contrast
    const colors = await this.designReviewer.analyzeColors();
    if (colors.contrastIssues > 0) {
      issues.push({
        type: 'LOW_CONTRAST',
        severity: 'high',
        description: `${colors.contrastIssues} color contrast issues found`,
      });
    }

    // Check reading order
    if (!await this.hasReadingOrder()) {
      warnings.push({
        type: 'NO_READING_ORDER',
        severity: 'medium',
        description: 'Document lacks proper reading order tags',
      });
    }

    // Check font sizes
    const typography = await this.designReviewer.analyzeTypography();
    if (typography.minSize < 12) {
      warnings.push({
        type: 'SMALL_TEXT',
        severity: 'medium',
        description: `Text smaller than 12pt found (min: ${typography.minSize}pt)`,
      });
    }

    return {
      passed: issues.length === 0,
      score: this.calculateA11yScore(issues, warnings),
      issues,
      warnings,
      recommendations: this.generateA11yRecommendations(issues, warnings),
    };
  }

  async generateReport(format: string = 'markdown'): Promise<void> {
    const analysis = await this.detailedAnalysis();
    const reporter = new ReportGenerator(analysis);
    await reporter.save(this.outputDir, format);
  }

  async extractAllAssets(): Promise<void> {
    await this.extract(['All']);

    // Also extract page thumbnails
    for (let i = 1; i <= this.pdfData.numpages; i++) {
      await this.extractPageThumbnail(i);
    }
  }

  async reviewPage(pageNumber: number): Promise<any> {
    const pageContent = await this.analyzer.extractPageContent(pageNumber);
    const pageImages = await this.imageExtractor.extractPageImages(pageNumber);
    const pageColors = await this.designReviewer.analyzePageColors(pageNumber);

    return {
      pageNumber,
      elementCount: pageContent.elements?.length || 0,
      hasText: pageContent.text?.length > 0,
      imageCount: pageImages.length,
      dominantColors: pageColors.dominant || [],
      layout: pageContent.layout,
      comments: this.comments.get(pageNumber) || [],
      issues: this.issues.get(pageNumber) || [],
    };
  }

  async extractPage(pageNumber: number): Promise<void> {
    const pageDir = path.join(this.outputDir, `page-${pageNumber}`);
    await mkdir(pageDir, { recursive: true });

    // Extract page content
    const content = await this.analyzer.extractPageContent(pageNumber);
    await writeFile(
      path.join(pageDir, 'content.json'),
      JSON.stringify(content, null, 2)
    );

    // Extract page images
    await this.imageExtractor.extractPageImages(pageNumber, pageDir);

    // Generate page thumbnail
    await this.extractPageThumbnail(pageNumber, pageDir);
  }

  async addComment(pageNumber: number, comment: string): Promise<void> {
    if (!this.comments.has(pageNumber)) {
      this.comments.set(pageNumber, []);
    }
    this.comments.get(pageNumber)!.push(comment);
    await this.saveComments();
  }

  async flagIssue(pageNumber: number, issue: string): Promise<void> {
    if (!this.issues.has(pageNumber)) {
      this.issues.set(pageNumber, []);
    }
    this.issues.get(pageNumber)!.push(issue);
    await this.saveIssues();
  }

  async compare(other: PDFReviewer): Promise<any> {
    const thisAnalysis = await this.quickAnalysis();
    const otherAnalysis = await other.quickAnalysis();

    const similarity = this.calculateSimilarity(thisAnalysis, otherAnalysis);
    const differences = this.findDifferences(thisAnalysis, otherAnalysis);

    const thisDesign = await this.reviewDesign();
    const otherDesign = await other.reviewDesign();

    return {
      similarity,
      layoutMatch: this.compareLayouts(thisDesign.layout, otherDesign.layout),
      colorMatch: this.compareColors(thisDesign.colors, otherDesign.colors),
      typographyMatch: this.compareTypography(thisDesign.typography, otherDesign.typography),
      differences,
      recommendations: this.generateComparisonRecommendations(differences),
    };
  }

  async generateVisualDiff(other: PDFReviewer, outputPath: string): Promise<void> {
    // Implementation would use canvas or sharp to create visual diffs
    // This is a placeholder for the actual implementation
    console.log('Visual diff generation not yet implemented');
  }

  // Private helper methods
  private async getMetadata(): Promise<PDFMetadata> {
    const stats = await readFile(this.filePath);
    return {
      pageCount: this.pdfData.numpages,
      fileSize: this.formatFileSize(stats.length),
      title: this.pdfData.info?.Title,
      author: this.pdfData.info?.Author,
      creator: this.pdfData.info?.Creator,
      producer: this.pdfData.info?.Producer,
      creationDate: this.pdfData.info?.CreationDate,
      modificationDate: this.pdfData.info?.ModDate,
    };
  }

  private formatFileSize(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  private async countImages(): Promise<number> {
    // Placeholder - actual implementation would parse PDF structure
    return 0;
  }

  private countTextBlocks(text: string): number {
    return text.split('\n\n').filter(block => block.trim().length > 0).length;
  }

  private async hasAccessibilityTags(): Promise<boolean> {
    // Check for PDF/UA compliance or accessibility tags
    return this.pdfData.text.includes('/StructTreeRoot');
  }

  private async hasAltText(): Promise<boolean> {
    // Check for alternative text in images
    return false; // Placeholder
  }

  private async hasReadingOrder(): Promise<boolean> {
    // Check for proper reading order tags
    return false; // Placeholder
  }

  private calculateDesignScore(design: any): number {
    let score = 0;
    if (design.layout?.hasGrid) score += 25;
    if (design.typography?.consistency > 80) score += 25;
    if (design.colors?.contrastIssues === 0) score += 25;
    if (design.consistency?.score > 80) score += 25;
    return score;
  }

  private calculateA11yScore(issues: any[], warnings: any[]): number {
    let score = 100;
    score -= issues.length * 10;
    score -= warnings.length * 5;
    return Math.max(0, score);
  }

  private generateRecommendations(analysis: any): string[] {
    const recommendations = [];

    if (analysis.accessibility.score < 80) {
      recommendations.push('Improve accessibility by adding alt text and ensuring proper color contrast');
    }

    if (analysis.design.score < 70) {
      recommendations.push('Consider improving design consistency and layout structure');
    }

    if (analysis.performance.loadTime > 3000) {
      recommendations.push('Optimize PDF file size for better performance');
    }

    return recommendations;
  }

  private generateA11yRecommendations(issues: any[], warnings: any[]): string[] {
    const recommendations = [];

    issues.forEach(issue => {
      switch (issue.type) {
        case 'MISSING_ALT_TEXT':
          recommendations.push('Add alternative text to all images');
          break;
        case 'LOW_CONTRAST':
          recommendations.push('Increase color contrast to meet WCAG AA standards (4.5:1)');
          break;
      }
    });

    warnings.forEach(warning => {
      switch (warning.type) {
        case 'NO_READING_ORDER':
          recommendations.push('Add proper reading order tags for screen readers');
          break;
        case 'SMALL_TEXT':
          recommendations.push('Increase minimum font size to at least 12pt');
          break;
      }
    });

    return recommendations;
  }

  private async saveColors(colors: any): Promise<void> {
    await writeFile(
      path.join(this.outputDir, 'colors.json'),
      JSON.stringify(colors, null, 2)
    );
  }

  private async saveComments(): Promise<void> {
    const commentsObj = Object.fromEntries(this.comments);
    await writeFile(
      path.join(this.outputDir, 'comments.json'),
      JSON.stringify(commentsObj, null, 2)
    );
  }

  private async saveIssues(): Promise<void> {
    const issuesObj = Object.fromEntries(this.issues);
    await writeFile(
      path.join(this.outputDir, 'issues.json'),
      JSON.stringify(issuesObj, null, 2)
    );
  }

  private async extractPageThumbnail(pageNumber: number, outputDir?: string): Promise<void> {
    // Placeholder - would generate thumbnail using canvas or sharp
    console.log(`Extracting thumbnail for page ${pageNumber}`);
  }

  private calculateSimilarity(analysis1: any, analysis2: any): number {
    // Simple similarity calculation
    let similarity = 0;
    if (analysis1.pageCount === analysis2.pageCount) similarity += 20;
    if (analysis1.imageCount === analysis2.imageCount) similarity += 20;
    // Add more comparison logic
    return similarity;
  }

  private findDifferences(analysis1: any, analysis2: any): string[] {
    const differences = [];

    if (analysis1.pageCount !== analysis2.pageCount) {
      differences.push(`Page count: ${analysis1.pageCount} vs ${analysis2.pageCount}`);
    }

    if (analysis1.imageCount !== analysis2.imageCount) {
      differences.push(`Image count: ${analysis1.imageCount} vs ${analysis2.imageCount}`);
    }

    return differences;
  }

  private compareLayouts(layout1: any, layout2: any): number {
    // Compare layout structures
    return 80; // Placeholder
  }

  private compareColors(colors1: any, colors2: any): number {
    // Compare color palettes
    return 75; // Placeholder
  }

  private compareTypography(typo1: any, typo2: any): number {
    // Compare typography
    return 85; // Placeholder
  }

  private generateComparisonRecommendations(differences: string[]): string[] {
    const recommendations = [];

    if (differences.length > 5) {
      recommendations.push('Significant differences found - consider aligning designs');
    }

    return recommendations;
  }

  private async analyzePerformance(): Promise<any> {
    const stats = await readFile(this.filePath);
    return {
      fileSize: stats.length,
      loadTime: stats.length / 1024, // Simulated load time
      optimizationPotential: stats.length > 10485760 ? 'high' : 'low',
    };
  }
}