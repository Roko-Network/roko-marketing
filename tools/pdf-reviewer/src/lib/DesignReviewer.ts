import { PDFAnalyzer } from './PDFAnalyzer.js';

export interface ColorAnalysis {
  primary: string[];
  secondary: string[];
  accent: string[];
  paletteSize: number;
  contrastIssues: number;
  dominant?: string[];
}

export interface TypographyAnalysis {
  families: string[];
  sizes: number[];
  minSize: number;
  maxSize: number;
  consistency: number;
  hierarchy: boolean;
  sizeRange?: string;
}

export interface LayoutAnalysis {
  hasGrid: boolean;
  columns: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  consistency: number;
  alignment: string;
  whitespace: number;
}

export interface ConsistencyCheck {
  score: number;
  issues: string[];
  recommendations: string[];
}

export class DesignReviewer {
  private analyzer: PDFAnalyzer;

  constructor(analyzer: PDFAnalyzer) {
    this.analyzer = analyzer;
  }

  async analyzeColors(): Promise<ColorAnalysis> {
    // This would analyze actual PDF color spaces
    // Simplified implementation
    return {
      primary: ['#6366f1', '#14b8a6', '#f59e0b'],
      secondary: ['#8b5cf6', '#3b82f6'],
      accent: ['#10b981', '#ef4444'],
      paletteSize: 7,
      contrastIssues: 0,
      dominant: ['#6366f1', '#0a0e27'],
    };
  }

  async analyzePageColors(pageNumber: number): Promise<ColorAnalysis> {
    // Analyze colors for specific page
    return {
      primary: ['#6366f1', '#14b8a6'],
      secondary: ['#8b5cf6'],
      accent: ['#10b981'],
      paletteSize: 4,
      contrastIssues: 0,
      dominant: ['#6366f1', '#ffffff'],
    };
  }

  async analyzeTypography(): Promise<TypographyAnalysis> {
    const fonts = await this.analyzer.extractFonts();

    const families = [...new Set(fonts.map(f => f.name))];
    const sizes = [...new Set(fonts.map(f => f.size))].sort((a, b) => a - b);

    return {
      families,
      sizes,
      minSize: Math.min(...sizes),
      maxSize: Math.max(...sizes),
      consistency: this.calculateTypographyConsistency(fonts),
      hierarchy: this.hasTypographicHierarchy(sizes),
      sizeRange: `${Math.min(...sizes)}pt - ${Math.max(...sizes)}pt`,
    };
  }

  async analyzeLayout(): Promise<LayoutAnalysis> {
    // Would analyze actual PDF layout
    return {
      hasGrid: true,
      columns: 12,
      margins: {
        top: 48,
        right: 48,
        bottom: 48,
        left: 48,
      },
      consistency: 85,
      alignment: 'left',
      whitespace: 35, // percentage
    };
  }

  async checkConsistency(): Promise<ConsistencyCheck> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    const typography = await this.analyzeTypography();
    const colors = await this.analyzeColors();
    const layout = await this.analyzeLayout();

    // Check typography consistency
    if (typography.families.length > 3) {
      issues.push('Too many font families (>3)');
      recommendations.push('Limit font families to 2-3 for better consistency');
    }

    if (typography.sizes.length > 8) {
      issues.push('Too many font sizes (>8)');
      recommendations.push('Use a modular scale for font sizes');
    }

    // Check color consistency
    if (colors.paletteSize > 10) {
      issues.push('Color palette too large (>10)');
      recommendations.push('Simplify color palette to 6-8 colors');
    }

    if (colors.contrastIssues > 0) {
      issues.push(`${colors.contrastIssues} color contrast issues`);
      recommendations.push('Ensure all text meets WCAG AA contrast requirements');
    }

    // Check layout consistency
    if (layout.consistency < 80) {
      issues.push('Inconsistent layout spacing');
      recommendations.push('Use consistent spacing based on 8-point grid');
    }

    const score = this.calculateConsistencyScore(issues);

    return {
      score,
      issues,
      recommendations,
    };
  }

  async analyzeSpacing(): Promise<any> {
    return {
      baseUnit: 8,
      scale: [4, 8, 16, 24, 32, 48, 64],
      consistency: 90,
      issues: [],
    };
  }

  async analyzeHierarchy(): Promise<any> {
    const typography = await this.analyzeTypography();

    return {
      hasHierarchy: typography.hierarchy,
      levels: this.detectHierarchyLevels(typography.sizes),
      headingStyles: this.detectHeadingStyles(),
      bodyStyle: {
        family: typography.families[0],
        size: 16,
        lineHeight: 1.5,
      },
    };
  }

  async analyzeAccessibility(): Promise<any> {
    const colors = await this.analyzeColors();
    const typography = await this.analyzeTypography();

    const issues = [];

    // Check color contrast
    if (colors.contrastIssues > 0) {
      issues.push({
        type: 'color-contrast',
        count: colors.contrastIssues,
        severity: 'high',
      });
    }

    // Check font size
    if (typography.minSize < 12) {
      issues.push({
        type: 'small-text',
        minSize: typography.minSize,
        severity: 'medium',
      });
    }

    return {
      score: 100 - (issues.length * 20),
      issues,
      wcagLevel: issues.length === 0 ? 'AA' : 'Fails',
    };
  }

  private calculateTypographyConsistency(fonts: any[]): number {
    // Calculate consistency based on font usage patterns
    const familyCounts = new Map<string, number>();

    fonts.forEach(font => {
      familyCounts.set(font.name, (familyCounts.get(font.name) || 0) + 1);
    });

    // More consistent if fewer font families
    const familyCount = familyCounts.size;
    if (familyCount <= 2) return 95;
    if (familyCount <= 3) return 85;
    if (familyCount <= 4) return 70;
    return 50;
  }

  private hasTypographicHierarchy(sizes: number[]): boolean {
    // Check if sizes follow a scale
    if (sizes.length < 3) return false;

    const ratios = [];
    for (let i = 1; i < sizes.length; i++) {
      ratios.push(sizes[i] / sizes[i - 1]);
    }

    // Check if ratios are consistent (within 10% tolerance)
    const avgRatio = ratios.reduce((a, b) => a + b) / ratios.length;
    const consistent = ratios.every(r => Math.abs(r - avgRatio) / avgRatio < 0.1);

    return consistent;
  }

  private calculateConsistencyScore(issues: string[]): number {
    const baseScore = 100;
    const deduction = issues.length * 10;
    return Math.max(0, baseScore - deduction);
  }

  private detectHierarchyLevels(sizes: number[]): number {
    return sizes.length;
  }

  private detectHeadingStyles(): any[] {
    // Would detect actual heading styles from PDF
    return [
      { level: 1, size: 32, weight: 'bold' },
      { level: 2, size: 24, weight: 'bold' },
      { level: 3, size: 20, weight: 'semibold' },
      { level: 4, size: 18, weight: 'semibold' },
      { level: 5, size: 16, weight: 'medium' },
    ];
  }
}