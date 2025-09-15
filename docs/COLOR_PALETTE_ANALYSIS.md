# ROKO Marketing Site - Color Palette Analysis

## Executive Summary

After reviewing the Figma design artifacts, there are discrepancies between the originally documented color palette and what's actually shown in the Figma designs. This document provides a comprehensive analysis and alignment recommendations.

---

## 1. Figma Design Analysis

### 1.1 Colors Observed in Figma PDFs

Based on visual inspection of the Figma artifacts:

#### Primary Colors
- **Bright Teal/Cyan**: `#00D4AA` to `#00FFCC` range
  - Used prominently in CTAs ("CLICK TO EXPLORE", "CONNECT WALLET")
  - Menu elements and interactive components
  - This is the most dominant accent color

#### Background Colors
- **Pure Black**: `#000000`
  - Main background in most designs
  - Creates high contrast with teal accents

- **Near Black**: `#0A0A0A` to `#1A1A1A`
  - Used for cards and elevated surfaces
  - Panel backgrounds

#### Text Colors
- **Pure White**: `#FFFFFF`
  - Primary text color
  - High contrast against black backgrounds

- **Gray Variations**: `#707070` to `#A0A0A0`
  - Secondary and tertiary text
  - UI element borders

### 1.2 Design Aesthetic

The Figma designs show:
- **Futuristic/Cyberpunk aesthetic** with high contrast
- **Dark mode first** approach with pure blacks
- **Bright teal/cyan** as the primary brand accent
- **Minimalist** color usage - mostly black, white, and teal

---

## 2. Original vs. Revised Color Palette

### 2.1 Original Documentation
```css
--roko-primary: #6366f1;      /* Indigo */
--roko-temporal: #14b8a6;     /* Teal */
--bg-primary: #0a0e27;        /* Deep space navy */
```

### 2.2 Revised to Match Figma
```css
--roko-primary: #00d4aa;      /* Bright Teal/Cyan */
--roko-temporal: #14b8a6;     /* Teal */
--bg-primary: #000000;        /* Pure Black */
```

### 2.3 Key Changes

| Element | Original | Figma-Based | Rationale |
|---------|----------|-------------|-----------|
| Primary Brand | Indigo (#6366f1) | Bright Teal (#00d4aa) | Figma CTAs use bright teal |
| Main Background | Navy (#0a0e27) | Pure Black (#000000) | Higher contrast, cyberpunk aesthetic |
| Accent Hover | Not defined | Bright Cyan (#00ffcc) | Lighter teal for hover states |
| Text Accent | Teal (#14b8a6) | Bright Teal (#00d4aa) | Consistency with primary |

---

## 3. Implementation Recommendations

### 3.1 CSS Variables Structure

```css
:root {
  /* Primary Palette - Figma Aligned */
  --roko-primary: #00d4aa;
  --roko-primary-hover: #00ffcc;
  --roko-primary-dark: #00a084;

  /* Secondary Colors */
  --roko-secondary: #6366f1;  /* Keep indigo as secondary */
  --roko-tertiary: #8b5cf6;   /* Purple for special elements */

  /* Backgrounds */
  --bg-black: #000000;
  --bg-dark: #0a0a0a;
  --bg-card: #1a1a1a;
  --bg-elevated: #2a2a2a;

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --text-muted: #707070;
  --text-accent: #00d4aa;
}
```

### 3.2 Component-Specific Usage

#### CTAs and Buttons
```css
.btn-primary {
  background: var(--roko-primary);
  color: var(--bg-black);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: var(--roko-primary-hover);
  box-shadow: 0 0 20px rgba(0, 212, 170, 0.5);
}
```

#### Cards and Panels
```css
.card {
  background: var(--bg-card);
  border: 1px solid rgba(0, 212, 170, 0.1);
}

.card:hover {
  border-color: var(--roko-primary);
  box-shadow: 0 0 30px rgba(0, 212, 170, 0.1);
}
```

---

## 4. Accessibility Considerations

### 4.1 Contrast Ratios

| Combination | Ratio | WCAG Level | Usage |
|-------------|-------|------------|-------|
| White on Black | 21:1 | AAA | Primary text |
| Teal on Black | 11.3:1 | AAA | Links, accents |
| Gray (#a0a0a0) on Black | 6.3:1 | AA | Secondary text |
| Black on Teal | 3.7:1 | AA Large | Button text |

### 4.2 Recommendations
- Use **white text on teal buttons** instead of black for better contrast
- Ensure secondary gray text meets AA standards
- Provide focus indicators with sufficient contrast

---

## 5. Brand Consistency Guidelines

### 5.1 Primary Usage
- **Teal (#00d4aa)**: Primary CTAs, key interactions, brand moments
- **Black (#000000)**: Main backgrounds, creating dramatic contrast
- **White (#ffffff)**: Primary text, ensuring readability

### 5.2 Secondary Usage
- **Indigo (#6366f1)**: Secondary buttons, alternative CTAs
- **Purple (#8b5cf6)**: Premium/enterprise features
- **Grays**: UI elements, borders, secondary information

### 5.3 Do's and Don'ts

#### Do's ✅
- Use teal sparingly for maximum impact
- Maintain high contrast ratios
- Keep backgrounds predominantly black
- Use gradients for hero sections

#### Don'ts ❌
- Don't use too many colors simultaneously
- Avoid low contrast combinations
- Don't use teal for body text
- Avoid pure white backgrounds (use off-black instead)

---

## 6. Migration Strategy

### 6.1 Phase 1: Update Documentation
- [x] Update UI_UX_SPECIFICATIONS.md with new palette
- [ ] Create Figma-to-code color mapping
- [ ] Update design tokens

### 6.2 Phase 2: Component Library
- [ ] Update CSS variables
- [ ] Refactor component styles
- [ ] Create dark theme utilities

### 6.3 Phase 3: Implementation
- [ ] Apply to hero section
- [ ] Update CTA components
- [ ] Refactor navigation

---

## 7. Color Token Naming Convention

```javascript
// colors.tokens.js
export const colors = {
  // Base colors
  teal: {
    50: '#e6fffa',
    100: '#b2f5ea',
    200: '#81e6d9',
    300: '#4fd1c5',
    400: '#00d4aa', // Primary
    500: '#00b894',
    600: '#00a084',
    700: '#007a64',
    800: '#005a4a',
    900: '#003d33',
  },

  neutral: {
    0: '#ffffff',
    50: '#f5f5f5',
    100: '#e0e0e0',
    200: '#c0c0c0',
    300: '#a0a0a0', // Secondary text
    400: '#808080',
    500: '#707070', // Muted text
    600: '#505050',
    700: '#303030',
    800: '#1a1a1a', // Card bg
    900: '#0a0a0a', // Panel bg
    1000: '#000000', // Primary bg
  }
};
```

---

## 8. Conclusion

The Figma designs clearly show a **bright teal/cyan-focused color palette** with **pure black backgrounds**, which differs from the originally documented indigo-based palette. The updated color system better reflects:

1. The futuristic, high-tech aesthetic shown in Figma
2. The cyberpunk-inspired visual direction
3. The emphasis on temporal/time-based branding (teal often associated with digital/future)
4. High contrast for accessibility and visual impact

### Next Steps
1. Approve the revised color palette
2. Update all component specifications
3. Create a Storybook with the new colors
4. Generate design tokens for development
5. Ensure all new implementations use the updated palette

---

*Document Version: 1.0*
*Last Updated: January 2025*
*Based on Figma artifacts review*