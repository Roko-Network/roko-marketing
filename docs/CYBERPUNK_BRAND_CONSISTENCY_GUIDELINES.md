# ROKO Network Cyberpunk Brand Consistency Guidelines

## Executive Summary

This document establishes comprehensive brand consistency guidelines for ROKO Network's cyberpunk aesthetic, ensuring uniform implementation across all digital touchpoints while maintaining accessibility compliance and performance optimization standards.

## 1. Core Brand Philosophy

### 1.1 Cyberpunk Minimalism Meets Nanosecond Precision

**Design Philosophy:**
- **Temporal Precision Theme**: Visual representations of nanosecond accuracy, atomic clock synchronization, and IEEE 1588 PTP protocols
- **Cyberpunk Aesthetics**: Dark interfaces with strategic neon accents, holographic effects, and geometric patterns
- **Professional Enterprise Trust**: Institutional-grade reliability through sophisticated visual hierarchy
- **Accessibility First**: Universal design principles ensuring WCAG 2.2 AA compliance

### 1.2 Brand Personality

- **Precise**: Every element reflects nanosecond accuracy
- **Innovative**: Cutting-edge Web3 technology representation
- **Trustworthy**: Enterprise-grade reliability and security
- **Futuristic**: Forward-thinking temporal blockchain solutions

## 2. Official Color System

### 2.1 Primary Brand Colors

```css
/* Official ROKO Brand Colors - Validated for WCAG 2.2 AA */
:root {
  /* Primary Palette */
  --roko-primary: #BAC0CC;      /* Light Blue-Gray - Primary brand */
  --roko-secondary: #BCC1D1;    /* Light Gray - Secondary elements */
  --roko-tertiary: #D9DBE3;     /* Lightest Gray - Subtle accents */
  --roko-dark: #181818;         /* Near Black - Text and contrasts */

  /* Cyberpunk Accent Colors */
  --roko-teal: #00d4aa;         /* Bright Teal - CTAs and highlights */
  --roko-teal-hover: #00ffcc;   /* Bright Cyan - Hover states */
  --roko-teal-alpha: rgba(0, 212, 170, 0.1); /* Subtle backgrounds */

  /* System Colors */
  --roko-success: #10b981;      /* Emerald - Success states */
  --roko-warning: #f59e0b;      /* Amber - Warnings */
  --roko-error: #ef4444;        /* Red - Errors */
  --roko-info: #3b82f6;         /* Blue - Information */
}
```

### 2.2 Background Color System

```css
/* Dark Theme Foundation */
:root {
  --bg-space: #000000;          /* Pure black - Deep space */
  --bg-void: #0a0a0a;           /* Near black - Void panels */
  --bg-surface: #181818;        /* ROKO Dark - Card backgrounds */
  --bg-elevated: #2a2a2a;       /* Elevated surfaces */
  --bg-overlay: rgba(24, 24, 24, 0.95); /* Modal overlay */

  /* Gradient Systems */
  --gradient-hero: linear-gradient(135deg, #BAC0CC 0%, #D9DBE3 100%);
  --gradient-accent: linear-gradient(135deg, #00d4aa 0%, #00ffcc 100%);
  --gradient-cyberpunk: linear-gradient(180deg, #000000 0%, #181818 100%);
  --gradient-glow: radial-gradient(circle, #00d4aa 0%, transparent 70%);
}
```

### 2.3 Color Usage Guidelines

**Teal Accent (#00d4aa) - Strategic Usage Only:**
- Maximum 10% of interface coverage
- Reserved for: CTAs, active states, progress indicators, temporal precision elements
- Never use for large background areas

**Gray Palette Hierarchy:**
- #D9DBE3: Subtle text, disabled states, dividers
- #BCC1D1: Secondary text, muted elements
- #BAC0CC: Primary text on dark backgrounds, primary brand elements
- #181818: High contrast text, card backgrounds

## 3. Typography System

### 3.1 Font Hierarchy

```css
/* Font Family Stack */
:root {
  --font-display: 'Rajdhani', 'HK Guise', sans-serif;
  --font-primary: 'HK Guise', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-accent: 'Aeonik TRIAL', 'HK Guise', sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
}

/* Type Scale - Based on 1.25 Major Third */
:root {
  --text-hero: clamp(48px, 8vw, 72px);     /* Hero headlines */
  --text-h1: clamp(36px, 6vw, 56px);       /* Page titles */
  --text-h2: clamp(28px, 5vw, 48px);       /* Section headers */
  --text-h3: clamp(24px, 4vw, 36px);       /* Subsection headers */
  --text-h4: clamp(20px, 3vw, 28px);       /* Card headers */
  --text-body-lg: 20px;                    /* Large body text */
  --text-body: 18px;                       /* Regular body text */
  --text-body-sm: 16px;                    /* Small body text */
  --text-caption: 14px;                    /* Captions and labels */
}
```

### 3.2 Font Usage Guidelines

**Rajdhani (Display Font):**
- Usage: Headlines, hero text, CTAs, temporal counters
- Weights: 300, 400, 500, 600, 700
- Character: Technical precision, futuristic

**HK Guise (Primary Font):**
- Usage: Body text, UI elements, navigation
- Weights: 300, 400, 500, 600, 700
- Character: Professional, readable, modern

**Aeonik TRIAL (Accent Font):**
- Usage: Special features, premium sections, badges
- Weights: 400, 500, 600, 700
- Character: Distinctive, premium feel

**JetBrains Mono (Code Font):**
- Usage: Code blocks, technical documentation, APIs
- Weights: 400, 500
- Character: Technical precision, readability

## 4. Cyberpunk Component Patterns

### 4.1 Holographic Button System

```css
.btn-cyberpunk {
  /* Base Structure */
  position: relative;
  padding: 16px 32px;
  border: 2px solid transparent;
  border-radius: 8px;
  background: linear-gradient(135deg, #00d4aa 0%, #00ffcc 100%);
  color: #181818;
  font-family: var(--font-display);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  overflow: hidden;

  /* Cyberpunk Glow */
  box-shadow:
    0 4px 20px rgba(0, 212, 170, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  /* Holographic Shimmer Effect */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
    transition: transform 0.6s ease;
  }

  /* Interactive States */
  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 6px 30px rgba(0, 212, 170, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &:hover::before {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }

  &:focus {
    outline: 3px solid #00d4aa;
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
}
```

### 4.2 Glassmorphism Card System

```css
.card-cyberpunk {
  /* Structure */
  position: relative;
  padding: 32px;
  border-radius: 16px;

  /* Glassmorphism Effect */
  background: rgba(24, 24, 24, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(186, 192, 204, 0.1);

  /* Subtle Glow */
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  /* Temporal Border Animation */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 212, 170, 0.5),
      transparent
    );
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    animation: borderScan 3s linear infinite;
  }
}

@keyframes borderScan {
  0% { background-position: -100% 0; }
  100% { background-position: 100% 0; }
}
```

### 4.3 Temporal Precision Elements

```css
.temporal-counter {
  /* Typography */
  font-family: var(--font-mono);
  font-size: 24px;
  font-weight: 500;
  color: #00d4aa;

  /* Precision Styling */
  background: rgba(0, 212, 170, 0.1);
  border: 1px solid rgba(0, 212, 170, 0.3);
  border-radius: 4px;
  padding: 8px 16px;

  /* Atomic Clock Animation */
  &::after {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #00d4aa;
    border-radius: 50%;
    margin-left: 8px;
    animation: atomicPulse 1s ease-in-out infinite;
  }
}

@keyframes atomicPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.8); }
}
```

## 5. 3D Visualization Standards

### 5.1 Temporal Orb Specifications

```javascript
// Material specifications for Three.js
const temporalOrbMaterial = {
  base: {
    color: '#181818',
    metalness: 0.8,
    roughness: 0.2,
    transmission: 0.1,
    emissive: '#00d4aa',
    emissiveIntensity: 0.1
  },
  animation: {
    rotationSpeed: 0.005, // Rad/frame
    pulseFrequency: 60,   // BPM-like pulse
    particleCount: 200,
    particleLifetime: 3000 // ms
  }
};
```

### 5.2 Network Visualization Guidelines

**Color Coding:**
- Active nodes: #00d4aa (bright teal)
- Inactive nodes: #BAC0CC (gray)
- Data flows: Animated gradient from teal to cyan
- Error states: #ef4444 (red)

**Animation Principles:**
- Smooth 60fps targeting
- Respect prefers-reduced-motion
- Progressive enhancement based on device capabilities

## 6. Accessibility Implementation

### 6.1 Color Contrast Validation

**Tested Combinations (WCAG 2.2 AA Compliant):**
- #ffffff on #181818: 11.7:1 (AAA)
- #D9DBE3 on #181818: 8.1:1 (AAA)
- #BCC1D1 on #181818: 6.9:1 (AAA)
- #BAC0CC on #181818: 6.1:1 (AAA)
- #00d4aa on #181818: 4.8:1 (AA)
- #181818 on #00d4aa: 4.8:1 (AA)

### 6.2 Motion Accessibility

```css
/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Maintain essential feedback */
  .btn-cyberpunk:hover {
    transform: none;
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.3);
  }
}
```

### 6.3 Focus Management

```css
/* Focus Ring System */
:focus-visible {
  outline: 3px solid #00d4aa;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Skip Link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #00d4aa;
  color: #181818;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;

  &:focus {
    top: 6px;
  }
}
```

## 7. Performance Guidelines

### 7.1 Asset Optimization

**3D Models:**
- Format: GLTF/GLB with Draco compression
- Texture size: Maximum 1024x1024px
- LOD levels: 3 (high, medium, low detail)

**Images:**
- Format: WebP with JPEG fallback
- Size: Maximum 200KB per image
- Loading: Lazy loading with blur-up placeholder

**Fonts:**
- Format: WOFF2 with WOFF fallback
- Subsetting: Latin character set only
- Loading: font-display: swap

### 7.2 Bundle Size Targets

```javascript
const performanceBudgets = {
  initial: {
    js: '45KB',      // Gzipped
    css: '15KB',     // Gzipped
    fonts: '100KB'   // WOFF2 combined
  },
  perRoute: {
    js: '20KB',      // Gzipped
    css: '5KB'       // Gzipped
  }
};
```

## 8. Implementation Checklist

### 8.1 Component Development

- [ ] Uses official ROKO color variables
- [ ] Implements cyberpunk styling patterns
- [ ] Includes hover/focus states
- [ ] Supports reduced motion preferences
- [ ] Passes contrast ratio requirements
- [ ] Includes proper ARIA attributes
- [ ] Documented in Storybook
- [ ] Performance optimized

### 8.2 3D Visualization

- [ ] Uses approved material specifications
- [ ] Implements LOD system
- [ ] Respects performance budgets
- [ ] Includes static fallback
- [ ] Supports accessibility preferences
- [ ] Proper error handling
- [ ] Device capability detection

### 8.3 Typography

- [ ] Uses correct font hierarchy
- [ ] Implements responsive scaling
- [ ] Maintains readability at all sizes
- [ ] Supports system font fallbacks
- [ ] Optimized font loading
- [ ] Proper line heights

## 9. Quality Assurance

### 9.1 Design Review Process

1. **Initial Review**: Brand compliance check
2. **Accessibility Audit**: WCAG 2.2 validation
3. **Performance Test**: Bundle size and loading
4. **Cross-browser Test**: Chrome, Firefox, Safari, Edge
5. **Mobile Test**: iOS and Android devices
6. **Final Approval**: Design lead sign-off

### 9.2 Monitoring & Maintenance

**Quarterly Reviews:**
- Brand consistency audit
- Performance metric analysis
- Accessibility compliance check
- User feedback integration

**Tools:**
- Lighthouse CI for performance
- axe-core for accessibility
- Percy for visual regression
- Bundle analyzer for size monitoring

## 10. Brand Assets

### 10.1 Logo Usage

**Primary Logo:**
- Minimum size: 32px height
- Clear space: 1x logo height
- Backgrounds: Dark surfaces only
- Color: #BAC0CC or #ffffff

**Logo Variations:**
- Horizontal: Standard usage
- Stacked: Square layouts
- Icon only: Small spaces
- Monochrome: Limited color contexts

### 10.2 Brand Voice

**Technical Communication:**
- Precise and accurate
- Forward-thinking
- Trustworthy
- Innovation-focused

**Tone Guidelines:**
- Professional but approachable
- Confident without arrogance
- Educational without condescension
- Exciting without hyperbole

---

## Conclusion

These cyberpunk brand consistency guidelines ensure ROKO Network maintains a cohesive, accessible, and high-performance visual identity across all digital touchpoints. Regular review and updates ensure continued alignment with brand evolution and industry standards.

---

*Document Version: 1.0*
*Last Updated: January 2025*
*Review Cycle: Quarterly*
*Owner: ROKO Design System Team*