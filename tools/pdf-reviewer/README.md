# ROKO PDF Reviewer

A powerful CLI tool for reviewing and analyzing PDF exports from Figma and other design tools. Perfect for design reviews, accessibility checks, and extracting assets from PDF documents.

## 🚀 Features

- **📊 Quick Analysis** - Get instant insights about your PDF (page count, images, text, colors)
- **🎨 Design Review** - Analyze typography, colors, layout, and consistency
- **📝 Content Extraction** - Extract text, images, fonts, and color palettes
- **♿ Accessibility Check** - Verify WCAG compliance and accessibility issues
- **🔍 Detailed Analysis** - Comprehensive analysis with recommendations
- **📋 Report Generation** - Export reports in JSON, HTML, or Markdown
- **🖼️ Asset Extraction** - Extract and optimize images from PDFs
- **🎯 Interactive Review** - Page-by-page review with commenting
- **⚖️ PDF Comparison** - Compare two PDFs for differences
- **📦 Batch Processing** - Process multiple PDFs at once

## 📦 Installation

### Global Installation
```bash
npm install -g roko-pdf-reviewer
```

### Local Installation
```bash
# Clone the repository
git clone https://github.com/Roko-Network/roko-marketing.git
cd roko-marketing/tools/pdf-reviewer

# Install dependencies
npm install

# Build the tool
npm run build

# Link globally (optional)
npm link
```

## 🎯 Quick Start

### Basic Usage
```bash
# Review a PDF file
pdf-review review design-export.pdf

# Extract all content
pdf-review extract design-export.pdf --images --text --fonts

# Analyze design elements
pdf-review analyze design-export.pdf --colors --typography --layout

# Compare two PDFs
pdf-review compare version1.pdf version2.pdf

# Batch process multiple PDFs
pdf-review batch "*.pdf" --action analyze
```

## 📚 Commands

### `review <file>`
Interactive review of a PDF file with multiple analysis options.

```bash
pdf-review review figma-export.pdf
```

**Options:**
- `-o, --output <dir>` - Output directory (default: `./pdf-output`)
- `-f, --format <type>` - Report format: json|html|markdown (default: `markdown`)
- `--extract-images` - Extract all images
- `--extract-text` - Extract all text content
- `--analyze-colors` - Analyze color palette
- `--check-accessibility` - Check accessibility issues

**Interactive Menu Options:**
1. **Quick Analysis** - Fast overview of PDF contents
2. **Design Review** - Analyze design consistency
3. **Extract Content** - Extract images, text, fonts
4. **Detailed Analysis** - Comprehensive analysis
5. **Accessibility Check** - WCAG compliance check
6. **Generate Report** - Create detailed report
7. **Extract All Assets** - Extract everything
8. **Interactive Review** - Page-by-page review

### `extract <file>`
Extract specific content from PDF files.

```bash
# Extract images only
pdf-review extract design.pdf --images

# Extract text only
pdf-review extract design.pdf --text

# Extract fonts
pdf-review extract design.pdf --fonts

# Extract specific pages
pdf-review extract design.pdf --images --pages "1-5,10,15"

# Extract everything
pdf-review extract design.pdf --images --text --fonts
```

**Options:**
- `-o, --output <dir>` - Output directory
- `--images` - Extract images only
- `--text` - Extract text only
- `--fonts` - Extract font information
- `--pages <range>` - Page range (e.g., "1-5", "1,3,5")

### `analyze <file>`
Analyze design elements in the PDF.

```bash
# Analyze all design aspects
pdf-review analyze design.pdf --colors --typography --layout --consistency

# Analyze colors only
pdf-review analyze design.pdf --colors

# Check design consistency
pdf-review analyze design.pdf --consistency
```

**Options:**
- `-o, --output <dir>` - Output directory for report
- `--colors` - Analyze color palette
- `--typography` - Analyze typography
- `--layout` - Analyze layout structure
- `--consistency` - Check design consistency

### `compare <file1> <file2>`
Compare two PDF files for differences.

```bash
# Basic comparison
pdf-review compare old-design.pdf new-design.pdf

# Generate visual diff
pdf-review compare old-design.pdf new-design.pdf --visual
```

**Options:**
- `-o, --output <dir>` - Output directory
- `--visual` - Generate visual diff

### `batch <pattern>`
Process multiple PDFs matching a pattern.

```bash
# Analyze all PDFs in directory
pdf-review batch "*.pdf" --action analyze

# Extract from all PDFs
pdf-review batch "exports/*.pdf" --action extract

# Generate reports for all
pdf-review batch "**/*.pdf" --action report
```

**Options:**
- `-o, --output <dir>` - Output directory
- `--action <type>` - Action: extract|analyze|report

## 📊 Output Examples

### Quick Analysis Output
```
📊 Quick Analysis Results:
  Pages: 12
  File Size: 3.4 MB
  Images: 24
  Text Blocks: 48
  Primary Colors: #6366f1, #14b8a6, #f59e0b
```

### Design Review Output
```
🎨 Design Review:

  Layout:
    Grid: ✓
    Consistency: 85%

  Typography:
    Font Families: Inter, Roboto
    Size Range: 12pt - 48pt

  Colors:
    Palette Size: 7
    Contrast Issues: 0
```

### Accessibility Check Output
```
♿ Accessibility Check:

  Score: 85/100
  WCAG Level: AA

  Issues:
    - LOW_CONTRAST: 2 color contrast issues found
    - SMALL_TEXT: Text smaller than 12pt found (min: 10pt)

  Recommendations:
    - Increase color contrast to meet WCAG AA standards (4.5:1)
    - Increase minimum font size to at least 12pt
```

## 📁 Output Structure

The tool creates organized output directories:

```
pdf-output/
├── report.md                 # Analysis report
├── report.html               # HTML report
├── report.json              # JSON data
├── extracted-text.txt       # Extracted text
├── fonts.json              # Font information
├── colors.json             # Color palette
├── images/                 # Extracted images
│   ├── page-1-img-1.png
│   ├── page-1-img-2.png
│   └── ...
├── thumbnails/             # Page thumbnails
│   ├── page-1-thumb.png
│   └── ...
├── comments.json          # Review comments
└── issues.json           # Flagged issues
```

## 🎨 Report Formats

### Markdown Report
Clean, readable format perfect for documentation:
- Structured sections
- Tables for data
- Emoji indicators
- Easy to read in any text editor

### HTML Report
Beautiful, styled report with:
- Interactive elements
- Color swatches
- Responsive design
- Print-friendly layout

### JSON Report
Machine-readable format with:
- Complete data structure
- Easy integration with other tools
- Programmable access

## 🔧 Configuration

Create a `.pdf-reviewer.json` file in your project root:

```json
{
  "output": "./design-reviews",
  "format": "markdown",
  "extract": {
    "images": true,
    "text": true,
    "fonts": true
  },
  "analyze": {
    "colors": true,
    "typography": true,
    "layout": true,
    "accessibility": true
  },
  "report": {
    "includeMetadata": true,
    "includeRecommendations": true,
    "generateThumbnails": true
  }
}
```

## 🤖 Programmatic Usage

```javascript
import { PDFReviewer } from 'roko-pdf-reviewer';

async function reviewPDF() {
  const reviewer = new PDFReviewer('design.pdf', './output');
  await reviewer.load();

  // Quick analysis
  const quick = await reviewer.quickAnalysis();
  console.log('Pages:', quick.pageCount);
  console.log('Colors:', quick.primaryColors);

  // Design review
  const design = await reviewer.reviewDesign();
  console.log('Design Score:', design.score);

  // Accessibility check
  const a11y = await reviewer.checkAccessibility();
  console.log('Accessibility Score:', a11y.score);

  // Generate report
  await reviewer.generateReport('markdown');
}

reviewPDF();
```

## 🎯 Use Cases

### Design Review Workflow
```bash
# 1. Quick analysis to get overview
pdf-review review design-v2.pdf

# 2. Extract assets for implementation
pdf-review extract design-v2.pdf --images --fonts

# 3. Check accessibility compliance
pdf-review analyze design-v2.pdf --check-accessibility

# 4. Generate report for team
pdf-review review design-v2.pdf --format html
```

### Batch Design Audit
```bash
# Analyze all designs in exports folder
pdf-review batch "exports/*.pdf" --action analyze

# Generate reports for all
pdf-review batch "exports/*.pdf" --action report
```

### Version Comparison
```bash
# Compare two versions
pdf-review compare v1.pdf v2.pdf --visual

# Review differences interactively
pdf-review review v2.pdf
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev review sample.pdf

# Run tests
npm test

# Build for production
npm run build

# Format code
npm run format

# Lint code
npm run lint
```

## 📝 License

MIT © ROKO Network

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Issues

Found a bug? Please [open an issue](https://github.com/Roko-Network/roko-marketing/issues) with details.

## 📚 Resources

- [PDF.js Documentation](https://mozilla.github.io/pdf.js/)
- [Sharp Image Processing](https://sharp.pixelplumbing.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Figma Export Best Practices](https://help.figma.com/hc/en-us/articles/360040028114)

---

Built with ❤️ by ROKO Network Team