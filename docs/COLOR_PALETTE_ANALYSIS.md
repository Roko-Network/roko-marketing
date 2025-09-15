# ROKO Marketing Site - Official Brand Guidelines

## Executive Summary

This document defines the official ROKO brand guidelines including typography and color palette as specified in the design system. The brand combines sophisticated gray tones with bright teal accents for a modern, professional Web3 aesthetic.

---

## 1. Official Color System

### 1.1 ROKO Brand Colors

```css
/* Official ROKO Palette */
--roko-primary: #BAC0CC;      /* Light Blue-Gray - Primary brand */
--roko-secondary: #BCC1D1;    /* Light Gray - Secondary elements */
--roko-tertiary: #D9DBE3;     /* Lightest Gray - Subtle accents */
--roko-dark: #181818;         /* Near Black - Text and contrasts */
```

### 1.2 Accent Colors

```css
/* Teal Accents (from Figma CTAs) */
--roko-teal: #00d4aa;         /* Bright Teal - CTAs and highlights */
--roko-teal-hover: #00ffcc;   /* Bright Cyan - Hover states */
--roko-teal-dark: #00a084;    /* Dark Teal - Active states */
```

### 1.3 System Colors

```css
/* Semantic Colors */
--roko-success: #10b981;      /* Emerald - Success states */
--roko-warning: #f59e0b;      /* Amber - Warnings */
--roko-error: #ef4444;        /* Red - Errors */
--roko-info: #3b82f6;         /* Blue - Information */
```

---

## 2. Typography System

### 2.1 Official Font Stack

```css
/* ROKO Typography */
--font-display: 'Rajdhani', sans-serif;      /* Headlines, Hero text */
--font-primary: 'HK Guise', sans-serif;      /* Body text, UI elements */
--font-accent: 'Aeonik TRIAL', sans-serif;   /* Special features */
--font-mono: 'JetBrains Mono', monospace;    /* Code blocks */
```

### 2.2 Font Specifications

#### Rajdhani (Google Fonts)
- **License**: Free, Open Source
- **Weights**: 300, 400, 500, 600, 700
- **Usage**: Display headings, hero sections, CTAs
- **Character**: Bold, technical, impactful

#### HK Guise
- **License**: Commercial (Required)
- **Weights**: 300, 400, 500, 600, 700
- **Usage**: Primary body text, UI components
- **Character**: Clean, modern, readable

#### Aeonik TRIAL
- **License**: Trial version (Production license needed)
- **Weights**: 400, 500, 600, 700
- **Usage**: Premium features, special accents
- **Character**: Sophisticated, distinctive

### 2.3 Typography Scale

```css
/* Display Sizes (Rajdhani) */
--text-hero: 72px/1.1;        /* Hero headlines */
--text-h1: 56px/1.2;          /* Page titles */
--text-h2: 48px/1.2;          /* Section headers */

/* Body Sizes (HK Guise) */
--text-body-lg: 20px/1.6;     /* Large body text */
--text-body: 18px/1.6;        /* Regular body text */
--text-body-sm: 16px/1.5;     /* Small body text */

/* UI Sizes (HK Guise) */
--text-button: 16px/1;        /* Button text */
--text-label: 14px/1.4;       /* Form labels */
--text-caption: 12px/1.4;     /* Captions */
```

---

## 3. Color Application

### 3.1 Background Hierarchy

```css
/* Dark Theme Backgrounds */
--bg-primary: #000000;        /* Main background */
--bg-secondary: #0a0a0a;      /* Panels */
--bg-tertiary: #181818;       /* Cards (ROKO Dark) */
--bg-elevated: #2a2a2a;       /* Elevated surfaces */
```

### 3.2 Text Hierarchy

```css
/* Text Colors */
--text-primary: #ffffff;      /* Primary text on dark */
--text-secondary: #D9DBE3;    /* Secondary (ROKO Light Gray) */
--text-tertiary: #BCC1D1;     /* Muted (ROKO Gray) */
--text-quaternary: #BAC0CC;   /* Subtle (ROKO Primary) */
--text-dark: #181818;         /* Dark text on light */
```

### 3.3 Interactive Elements

```css
/* CTAs and Buttons */
.btn-primary {
  background: var(--roko-teal);
  color: var(--bg-primary);
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
}

.btn-secondary {
  background: transparent;
  border: 2px solid var(--roko-primary);
  color: var(--roko-primary);
}

/* Links */
a {
  color: var(--roko-primary);
  transition: color 0.3s ease;
}

a:hover {
  color: var(--roko-teal);
}
```

---

## 4. Brand Gradients

```css
/* Official Gradients */
--gradient-brand: linear-gradient(135deg, #BAC0CC 0%, #D9DBE3 100%);
--gradient-teal: linear-gradient(135deg, #00d4aa 0%, #00ffcc 100%);
--gradient-dark: linear-gradient(180deg, #000000 0%, #181818 100%);
--gradient-subtle: linear-gradient(135deg, #181818 0%, #2a2a2a 100%);
```

---

## 5. Accessibility Compliance

### 5.1 Contrast Ratios

| Combination | Ratio | WCAG Level | Usage |
|-------------|-------|------------|-------|
| White on Black (#000) | 21:1 | AAA | Primary text |
| ROKO Light Gray (#D9DBE3) on Black | 16.8:1 | AAA | Secondary text |
| ROKO Gray (#BCC1D1) on Black | 13.5:1 | AAA | Tertiary text |
| ROKO Primary (#BAC0CC) on Black | 12.3:1 | AAA | Subtle text |
| Teal (#00d4aa) on Black | 11.3:1 | AAA | CTAs |
| Black on ROKO Primary | 1.7:1 | Fail | Do not use |
| White on Teal | 2.1:1 | Fail | Use black text instead |

### 5.2 Recommendations

- Use ROKO grays for text hierarchy on dark backgrounds
- Maintain teal for interactive elements only
- Ensure all text meets AA minimum (4.5:1)
- Test with color blindness simulators

---

## 6. Implementation Examples

### 6.1 Hero Section

```css
.hero {
  background: var(--gradient-dark);
  color: var(--text-primary);
}

.hero h1 {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: var(--text-hero);
  background: var(--gradient-brand);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p {
  font-family: 'HK Guise', sans-serif;
  color: var(--text-secondary);
}
```

### 6.2 Card Component

```css
.card {
  background: var(--bg-tertiary); /* #181818 */
  border: 1px solid var(--roko-primary); /* #BAC0CC */
  padding: 2rem;
}

.card:hover {
  border-color: var(--roko-teal);
  box-shadow: 0 0 30px rgba(0, 212, 170, 0.2);
}

.card-title {
  font-family: 'Rajdhani', sans-serif;
  color: var(--text-primary);
}

.card-description {
  font-family: 'HK Guise', sans-serif;
  color: var(--text-tertiary);
}
```

### 6.3 Navigation

```css
.nav {
  background: rgba(24, 24, 24, 0.95); /* ROKO Dark with transparency */
  backdrop-filter: blur(10px);
}

.nav-link {
  font-family: 'HK Guise', sans-serif;
  color: var(--roko-secondary);
  font-weight: 500;
}

.nav-link:hover {
  color: var(--text-primary);
}

.nav-link.active {
  color: var(--roko-teal);
  font-weight: 600;
}
```

---

## 7. Font Loading Strategy

### 7.1 Font Imports

```html
<!-- Rajdhani from Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- Self-hosted fonts -->
<link rel="preload" href="/fonts/HKGuise-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/HKGuise-Medium.woff2" as="font" type="font/woff2" crossorigin>
```

### 7.2 CSS Font-Face

```css
/* HK Guise */
@font-face {
  font-family: 'HK Guise';
  src: url('/fonts/HKGuise-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'HK Guise';
  src: url('/fonts/HKGuise-Medium.woff2') format('woff2');
  font-weight: 500;
  font-display: swap;
}

/* Aeonik TRIAL */
@font-face {
  font-family: 'Aeonik TRIAL';
  src: url('/fonts/AeonikTRIAL-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

---

## 8. Design Token Export

### 8.1 JSON Tokens

```json
{
  "color": {
    "roko": {
      "primary": "#BAC0CC",
      "secondary": "#BCC1D1",
      "tertiary": "#D9DBE3",
      "dark": "#181818"
    },
    "accent": {
      "teal": "#00d4aa",
      "teal-hover": "#00ffcc",
      "teal-dark": "#00a084"
    }
  },
  "typography": {
    "fontFamily": {
      "display": "Rajdhani, sans-serif",
      "body": "HK Guise, sans-serif",
      "accent": "Aeonik TRIAL, sans-serif",
      "mono": "JetBrains Mono, monospace"
    }
  }
}
```

### 8.2 Tailwind Configuration

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'roko': {
          'primary': '#BAC0CC',
          'secondary': '#BCC1D1',
          'tertiary': '#D9DBE3',
          'dark': '#181818',
        },
        'teal': {
          DEFAULT: '#00d4aa',
          'hover': '#00ffcc',
          'dark': '#00a084',
        }
      },
      fontFamily: {
        'display': ['Rajdhani', 'sans-serif'],
        'body': ['HK Guise', 'sans-serif'],
        'accent': ['Aeonik TRIAL', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      }
    }
  }
}
```

---

## 9. Budget Considerations

### 9.1 Font Licensing Costs

| Font | License Type | Estimated Cost | Priority |
|------|-------------|----------------|----------|
| Rajdhani | Google Fonts (Free) | $0 | Essential |
| HK Guise | Commercial Web License | $200-500 | Essential |
| Aeonik TRIAL | Production License | $300-800 | Optional |
| JetBrains Mono | Open Source | $0 | Essential |

**Total Budget Range**: $200-1,300

### 9.2 Recommendations

1. **Phase 1**: Use Rajdhani + system fonts fallback
2. **Phase 2**: Purchase HK Guise license
3. **Phase 3**: Evaluate need for Aeonik production license

---

## Conclusion

The ROKO brand combines sophisticated gray tones with vibrant teal accents, creating a professional yet modern identity perfect for Web3 infrastructure. The typography system, led by Rajdhani and HK Guise, provides both impact and readability across all touchpoints.

Key brand attributes:
- **Professional**: Sophisticated gray palette
- **Modern**: Clean typography and minimal design
- **Technical**: Rajdhani's bold character
- **Accessible**: High contrast ratios throughout
- **Distinctive**: Unique color combination for Web3 space

---

*Document Version: 3.0*
*Last Updated: January 2025*
*Based on Official ROKO Brand Guidelines*