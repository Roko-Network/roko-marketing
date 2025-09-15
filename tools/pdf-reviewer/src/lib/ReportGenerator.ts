import { writeFile } from 'fs/promises';
import path from 'path';

export class ReportGenerator {
  private data: any;

  constructor(data: any) {
    this.data = data;
  }

  async save(outputDir: string, format: string): Promise<void> {
    switch (format.toLowerCase()) {
      case 'json':
        await this.saveJSON(outputDir);
        break;
      case 'html':
        await this.saveHTML(outputDir);
        break;
      case 'markdown':
      case 'md':
        await this.saveMarkdown(outputDir);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private async saveJSON(outputDir: string): Promise<void> {
    const outputPath = path.join(outputDir, 'report.json');
    await writeFile(outputPath, JSON.stringify(this.data, null, 2));
  }

  private async saveHTML(outputDir: string): Promise<void> {
    const html = this.generateHTML();
    const outputPath = path.join(outputDir, 'report.html');
    await writeFile(outputPath, html);
  }

  private async saveMarkdown(outputDir: string): Promise<void> {
    const markdown = this.generateMarkdown();
    const outputPath = path.join(outputDir, 'report.md');
    await writeFile(outputPath, markdown);
  }

  private generateHTML(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF Review Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 2rem;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #6366f1;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #6366f1;
        }
        h2 {
            color: #14b8a6;
            margin-top: 2rem;
            margin-bottom: 1rem;
        }
        h3 {
            color: #666;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
        }
        .metric {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: #f0f0f0;
            border-radius: 4px;
            margin: 0.25rem;
        }
        .metric-label {
            font-weight: bold;
            color: #666;
        }
        .metric-value {
            color: #333;
            margin-left: 0.5rem;
        }
        .score {
            font-size: 2rem;
            font-weight: bold;
            color: #10b981;
        }
        .issue {
            background: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 0.75rem;
            margin: 0.5rem 0;
        }
        .warning {
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 0.75rem;
            margin: 0.5rem 0;
        }
        .success {
            background: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 0.75rem;
            margin: 0.5rem 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }
        th, td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #e5e5e5;
        }
        th {
            background: #f9f9f9;
            font-weight: 600;
        }
        .color-swatch {
            display: inline-block;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            margin-right: 0.5rem;
            vertical-align: middle;
            border: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="container">
        ${this.generateHTMLContent()}
    </div>
</body>
</html>`;
  }

  private generateHTMLContent(): string {
    let html = '<h1>PDF Review Report</h1>';

    if (this.data.file) {
      html += `<p><strong>File:</strong> ${this.data.file}</p>`;
    }

    if (this.data.timestamp) {
      html += `<p><strong>Generated:</strong> ${new Date(this.data.timestamp).toLocaleString()}</p>`;
    }

    // Metadata Section
    if (this.data.metadata) {
      html += '<h2>Document Information</h2>';
      html += '<div class="metrics">';
      html += `<span class="metric"><span class="metric-label">Pages:</span><span class="metric-value">${this.data.metadata.pageCount}</span></span>`;
      html += `<span class="metric"><span class="metric-label">Size:</span><span class="metric-value">${this.data.metadata.fileSize}</span></span>`;
      if (this.data.metadata.title) {
        html += `<span class="metric"><span class="metric-label">Title:</span><span class="metric-value">${this.data.metadata.title}</span></span>`;
      }
      html += '</div>';
    }

    // Design Analysis
    if (this.data.design) {
      html += '<h2>Design Analysis</h2>';
      html += `<div class="score">Score: ${this.data.design.score}/100</div>`;

      if (this.data.design.colors) {
        html += '<h3>Color Palette</h3>';
        html += '<div>';
        this.data.design.colors.primary?.forEach((color: string) => {
          html += `<span class="color-swatch" style="background-color: ${color}"></span>`;
        });
        html += '</div>';
      }

      if (this.data.design.typography) {
        html += '<h3>Typography</h3>';
        html += '<table>';
        html += '<tr><th>Font Families</th><td>' + this.data.design.typography.families.join(', ') + '</td></tr>';
        html += '<tr><th>Size Range</th><td>' + this.data.design.typography.sizeRange + '</td></tr>';
        html += '<tr><th>Consistency</th><td>' + this.data.design.typography.consistency + '%</td></tr>';
        html += '</table>';
      }
    }

    // Accessibility
    if (this.data.accessibility) {
      html += '<h2>Accessibility</h2>';
      html += `<div class="score">Score: ${this.data.accessibility.score}/100</div>`;

      if (this.data.accessibility.issues?.length > 0) {
        html += '<h3>Issues</h3>';
        this.data.accessibility.issues.forEach((issue: any) => {
          html += `<div class="issue">${issue.description}</div>`;
        });
      }

      if (this.data.accessibility.warnings?.length > 0) {
        html += '<h3>Warnings</h3>';
        this.data.accessibility.warnings.forEach((warning: any) => {
          html += `<div class="warning">${warning.description}</div>`;
        });
      }
    }

    // Recommendations
    if (this.data.recommendations?.length > 0) {
      html += '<h2>Recommendations</h2>';
      html += '<ul>';
      this.data.recommendations.forEach((rec: string) => {
        html += `<li>${rec}</li>`;
      });
      html += '</ul>';
    }

    return html;
  }

  private generateMarkdown(): string {
    let md = '# PDF Review Report\n\n';

    if (this.data.file) {
      md += `**File:** ${this.data.file}\n`;
    }

    if (this.data.timestamp) {
      md += `**Generated:** ${new Date(this.data.timestamp).toLocaleString()}\n\n`;
    }

    md += '---\n\n';

    // Metadata Section
    if (this.data.metadata) {
      md += '## Document Information\n\n';
      md += `- **Pages:** ${this.data.metadata.pageCount}\n`;
      md += `- **Size:** ${this.data.metadata.fileSize}\n`;
      if (this.data.metadata.title) {
        md += `- **Title:** ${this.data.metadata.title}\n`;
      }
      if (this.data.metadata.author) {
        md += `- **Author:** ${this.data.metadata.author}\n`;
      }
      md += '\n';
    }

    // Design Analysis
    if (this.data.design) {
      md += '## Design Analysis\n\n';
      md += `**Overall Score:** ${this.data.design.score}/100\n\n`;

      if (this.data.design.colors) {
        md += '### Color Palette\n\n';
        md += '**Primary Colors:**\n';
        this.data.design.colors.primary?.forEach((color: string) => {
          md += `- ${color}\n`;
        });
        md += '\n';

        if (this.data.design.colors.contrastIssues > 0) {
          md += `⚠️ **Contrast Issues:** ${this.data.design.colors.contrastIssues} found\n\n`;
        }
      }

      if (this.data.design.typography) {
        md += '### Typography\n\n';
        md += '| Property | Value |\n';
        md += '|----------|-------|\n';
        md += `| Font Families | ${this.data.design.typography.families.join(', ')} |\n`;
        md += `| Size Range | ${this.data.design.typography.sizeRange} |\n`;
        md += `| Consistency | ${this.data.design.typography.consistency}% |\n`;
        md += `| Hierarchy | ${this.data.design.typography.hierarchy ? '✓' : '✗'} |\n`;
        md += '\n';
      }

      if (this.data.design.layout) {
        md += '### Layout\n\n';
        md += `- **Grid System:** ${this.data.design.layout.hasGrid ? 'Yes' : 'No'}\n`;
        md += `- **Columns:** ${this.data.design.layout.columns}\n`;
        md += `- **Consistency:** ${this.data.design.layout.consistency}%\n`;
        md += `- **Alignment:** ${this.data.design.layout.alignment}\n`;
        md += '\n';
      }
    }

    // Accessibility
    if (this.data.accessibility) {
      md += '## Accessibility\n\n';
      md += `**Score:** ${this.data.accessibility.score}/100\n`;
      md += `**WCAG Level:** ${this.data.accessibility.wcagLevel || 'Not determined'}\n\n`;

      if (this.data.accessibility.issues?.length > 0) {
        md += '### Issues\n\n';
        this.data.accessibility.issues.forEach((issue: any) => {
          md += `- 🔴 **${issue.type}:** ${issue.description}\n`;
        });
        md += '\n';
      }

      if (this.data.accessibility.warnings?.length > 0) {
        md += '### Warnings\n\n';
        this.data.accessibility.warnings.forEach((warning: any) => {
          md += `- 🟡 **${warning.type}:** ${warning.description}\n`;
        });
        md += '\n';
      }

      if (this.data.accessibility.recommendations?.length > 0) {
        md += '### Accessibility Recommendations\n\n';
        this.data.accessibility.recommendations.forEach((rec: string) => {
          md += `- ${rec}\n`;
        });
        md += '\n';
      }
    }

    // Content Analysis
    if (this.data.content) {
      md += '## Content Analysis\n\n';
      md += `- **Word Count:** ${this.data.content.wordCount}\n`;
      md += `- **Reading Time:** ${this.data.content.readingTime} minutes\n`;
      md += `- **Language:** ${this.data.content.language}\n`;

      if (this.data.content.keywords?.length > 0) {
        md += '\n**Top Keywords:**\n';
        this.data.content.keywords.forEach((keyword: string) => {
          md += `- ${keyword}\n`;
        });
      }
      md += '\n';
    }

    // Performance
    if (this.data.performance) {
      md += '## Performance\n\n';
      md += `- **File Size:** ${this.formatBytes(this.data.performance.fileSize)}\n`;
      md += `- **Load Time (estimated):** ${this.data.performance.loadTime}ms\n`;
      md += `- **Optimization Potential:** ${this.data.performance.optimizationPotential}\n\n`;
    }

    // Recommendations
    if (this.data.recommendations?.length > 0) {
      md += '## Recommendations\n\n';
      this.data.recommendations.forEach((rec: string, index: number) => {
        md += `${index + 1}. ${rec}\n`;
      });
      md += '\n';
    }

    // Consistency Check
    if (this.data.consistency) {
      md += '## Consistency Check\n\n';
      md += `**Score:** ${this.data.consistency.score}/100\n\n`;

      if (this.data.consistency.issues?.length > 0) {
        md += '### Issues Found\n\n';
        this.data.consistency.issues.forEach((issue: string) => {
          md += `- ${issue}\n`;
        });
        md += '\n';
      }

      if (this.data.consistency.recommendations?.length > 0) {
        md += '### Consistency Recommendations\n\n';
        this.data.consistency.recommendations.forEach((rec: string) => {
          md += `- ${rec}\n`;
        });
        md += '\n';
      }
    }

    md += '---\n\n';
    md += '*Generated by ROKO PDF Reviewer*\n';

    return md;
  }

  private formatBytes(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}