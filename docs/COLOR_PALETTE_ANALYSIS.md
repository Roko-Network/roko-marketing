# ROKO Marketing Site - Color Palette Specification

## Executive Summary

This document defines the official color palette for the ROKO Network marketing site based on the Figma design artifacts. The design follows a cyberpunk-inspired aesthetic with high contrast between pure black backgrounds and bright teal/cyan accents.

---

## 1. Core Color System

### 1.1 Primary Brand Colors

```css
/* Brand Colors */
--roko-primary: #00d4aa;      /* Bright Teal - Main brand color */
--roko-primary-hover: #00ffcc; /* Bright Cyan - Hover states */
--roko-primary-dark: #00a084;  /* Dark Teal - Active/pressed states */
```

### 1.2 Secondary Colors

```css
/* Supporting Colors */
--roko-secondary: #6366f1;    /* Indigo - Secondary actions */
--roko-tertiary: #8b5cf6;     /* Purple - Premium features */
--roko-info: #3b82f6;         /* Blue - Information */
--roko-success: #10b981;      /* Emerald - Success states */
--roko-warning: #f59e0b;      /* Amber - Warnings */
--roko-error: #ef4444;        /* Red - Errors */
```

### 1.3 Background Colors

```css
/* Dark Theme Backgrounds */
--bg-primary: #000000;        /* Pure black - Main background */
--bg-secondary: #0a0a0a;      /* Near black - Panel background */
--bg-tertiary: #1a1a1a;       /* Dark gray - Card background */
--bg-elevated: #2a2a2a;       /* Elevated surfaces */
--bg-overlay: rgba(0, 0, 0, 0.95);  /* Modal overlay */
```

### 1.4 Text Colors

```css
/* Text Hierarchy */
--text-primary: #ffffff;      /* Primary text */
--text-secondary: #a0a0a0;    /* Secondary text */
--text-tertiary: #707070;     /* Muted text */
--text-accent: #00d4aa;       /* Accent text */
--text-link: #00ffcc;         /* Link hover state */
```

### 1.5 Gradients

```css
/* Gradient Definitions */
--gradient-hero: linear-gradient(135deg, #00d4aa 0%, #00ffcc 100%);
--gradient-accent: linear-gradient(135deg, #00d4aa 0%, #00a084 100%);
--gradient-dark: linear-gradient(180deg, #000000 0%, #0a0a0a 100%);
--gradient-glow: radial-gradient(circle, #00d4aa 0%, transparent 70%);
```

---

## 2. Color Usage Guidelines

### 2.1 Primary Teal (#00d4aa)

**Usage:**
- Primary CTAs ("Connect Wallet", "Start Building")
- Active navigation states
- Key interactive elements
- Success confirmations
- Brand moments

**Implementation:**
```css
.btn-primary {
  background: var(--roko-primary);
  color: var(--bg-primary);
  border: 2px solid transparent;
}

.btn-primary:hover {
  background: var(--roko-primary-hover);
  box-shadow: 0 0 20px rgba(0, 212, 170, 0.5);
}

.btn-primary:active {
  background: var(--roko-primary-dark);
}
```

### 2.2 Black Backgrounds (#000000)

**Usage:**
- Main page background
- Hero sections
- Creating high contrast
- Cyberpunk aesthetic

**Implementation:**
```css
body {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.hero {
  background: var(--gradient-dark);
}
```

### 2.3 Card & Panel Styling

**Implementation:**
```css
.card {
  background: var(--bg-tertiary);
  border: 1px solid rgba(0, 212, 170, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  border-color: var(--roko-primary);
  box-shadow: 0 0 30px rgba(0, 212, 170, 0.1);
}

.panel {
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
}
```

---

## 3. Accessibility Standards

### 3.1 Contrast Ratios

| Combination | Contrast Ratio | WCAG Level | Usage |
|-------------|---------------|------------|-------|
| White (#fff) on Black (#000) | 21:1 | AAA | Primary text |
| Teal (#00d4aa) on Black | 11.3:1 | AAA | Links, CTAs |
| Secondary Gray (#a0a0a0) on Black | 6.3:1 | AA | Secondary text |
| Tertiary Gray (#707070) on Black | 4.1:1 | AA (Large) | Muted text |
| White on Teal | 2.1:1 | Fail | Avoid - use black text |
| Black on Teal | 3.7:1 | AA (Large) | Button text (large only) |

### 3.2 Recommendations

- Always use white text on teal backgrounds for better contrast
- Ensure interactive elements have visible focus states
- Provide sufficient color contrast for all text elements
- Use color in combination with other indicators (icons, text)

---

## 4. Component-Specific Palettes

### 4.1 Navigation

```css
.nav {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--bg-tertiary);
}

.nav-link {
  color: var(--text-secondary);
}

.nav-link:hover {
  color: var(--text-primary);
}

.nav-link.active {
  color: var(--roko-primary);
}
```

### 4.2 Forms

```css
.input {
  background: var(--bg-secondary);
  border: 1px solid var(--bg-elevated);
  color: var(--text-primary);
}

.input:focus {
  border-color: var(--roko-primary);
  box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
}
```

### 4.3 Alerts & Notifications

```css
.alert-success {
  background: rgba(16, 185, 129, 0.1);
  border-color: var(--roko-success);
  color: var(--roko-success);
}

.alert-warning {
  background: rgba(245, 158, 11, 0.1);
  border-color: var(--roko-warning);
  color: var(--roko-warning);
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border-color: var(--roko-error);
  color: var(--roko-error);
}
```

---

## 5. Dark Mode Implementation

The entire design system is dark-mode first, with no light mode variant planned.

### 5.1 CSS Variables Structure

```css
:root {
  /* Colors are defined for dark mode by default */
  color-scheme: dark;

  /* All color variables here */
}

/* Ensure proper dark mode rendering */
html {
  background: var(--bg-primary);
  color: var(--text-primary);
}
```

### 5.2 Glassmorphism Effects

```css
.glass {
  background: rgba(26, 26, 26, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 212, 170, 0.1);
}
```

---

## 6. Color Token System

### 6.1 Design Tokens (JSON)

```json
{
  "color": {
    "brand": {
      "primary": {
        "value": "#00d4aa",
        "type": "color"
      },
      "primary-hover": {
        "value": "#00ffcc",
        "type": "color"
      },
      "primary-dark": {
        "value": "#00a084",
        "type": "color"
      }
    },
    "background": {
      "primary": {
        "value": "#000000",
        "type": "color"
      },
      "secondary": {
        "value": "#0a0a0a",
        "type": "color"
      },
      "tertiary": {
        "value": "#1a1a1a",
        "type": "color"
      }
    },
    "text": {
      "primary": {
        "value": "#ffffff",
        "type": "color"
      },
      "secondary": {
        "value": "#a0a0a0",
        "type": "color"
      },
      "accent": {
        "value": "#00d4aa",
        "type": "color"
      }
    }
  }
}
```

### 6.2 Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'roko-primary': '#00d4aa',
        'roko-primary-hover': '#00ffcc',
        'roko-primary-dark': '#00a084',
        'roko-secondary': '#6366f1',
        'roko-tertiary': '#8b5cf6',
        'bg-primary': '#000000',
        'bg-secondary': '#0a0a0a',
        'bg-tertiary': '#1a1a1a',
      }
    }
  }
}
```

---

## 7. Implementation Checklist

### 7.1 Development Setup
- [ ] Configure CSS variables in root
- [ ] Set up Tailwind color config
- [ ] Create color utility classes
- [ ] Implement dark mode by default

### 7.2 Component Updates
- [ ] Update button components
- [ ] Apply to navigation
- [ ] Style form elements
- [ ] Update card components
- [ ] Apply to modals/overlays

### 7.3 Quality Assurance
- [ ] Verify contrast ratios
- [ ] Test with color blindness simulators
- [ ] Validate against Figma designs
- [ ] Check hover/focus states

---

## 8. AI Image Generation Prompts

When generating images, use these color specifications:

```
Color palette: pure black background (#000000), bright teal/cyan accents
(#00d4aa, #00ffcc), minimal color usage, high contrast cyberpunk aesthetic,
dark atmosphere with glowing teal highlights
```

Example prompt structure:
```
"[Subject description], pure black background, bright teal/cyan lighting
(#00d4aa), cyberpunk aesthetic, high contrast, minimal color palette,
glowing accents, dark atmosphere"
```

---

## Conclusion

This color system creates a distinctive, futuristic brand identity for ROKO Network with:

- **High contrast** for excellent readability
- **Cyberpunk aesthetic** aligning with Web3/blockchain themes
- **Minimal palette** for consistency and impact
- **Accessibility compliance** meeting WCAG standards
- **Brand differentiation** through unique teal/black combination

The bright teal against pure black creates a striking visual identity that reflects ROKO's position as a cutting-edge temporal blockchain infrastructure.

---

*Document Version: 2.0*
*Last Updated: January 2025*
*Based on Figma Design Artifacts*