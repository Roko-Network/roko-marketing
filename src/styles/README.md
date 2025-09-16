# ROKO Network Design System

A comprehensive cyberpunk-themed design system with nanosecond precision temporal aesthetics, built for the ROKO Network marketing site. Features glassmorphism effects, neon styling, and advanced accessibility compliance.

## 🎨 Design Philosophy

**"Cyberpunk Minimalism Meets Nanosecond Precision"**

- **Cyberpunk Aesthetics**: Dark interfaces with neon accents, holographic effects, and geometric patterns
- **Nanosecond Precision Theme**: Visual representations of temporal accuracy and atomic clock synchronization
- **Professional Enterprise Trust**: Institutional-grade reliability through sophisticated visual hierarchy
- **Accessibility First**: WCAG 2.2 AA compliance with comprehensive screen reader support

## 🚀 Quick Start

### 1. Setup Theme Provider

```tsx
import { ThemeProvider } from '@/styles';
import '@/styles/globals.css';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" defaultTemporalEffects={true}>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. Use Design Tokens

```tsx
import { tokens } from '@/styles/tokens';

// Access colors
const primaryColor = tokens.colors.primary; // #BAC0CC
const accentColor = tokens.colors.accent;   // #00d4aa

// Access typography
const displayFont = tokens.fonts.display;   // 'Rajdhani', sans-serif
const bodyFont = tokens.fonts.body;         // 'HK Guise', sans-serif

// Access spacing
const spacing = tokens.spacing[4];          // 1rem (16px)
```

### 3. Use Components

```tsx
import { Button, Card, NeonText, TemporalCounter } from '@/styles';

function Example() {
  return (
    <Card variant="holographic" glow temporal>
      <NeonText size="xl" animation="pulse" color="accent">
        Temporal Precision: 99.999%
      </NeonText>

      <TemporalCounter
        value={1234567890}
        format="nanoseconds"
        variant="atomic"
        showAccuracy
        accuracy={99.999}
      />

      <Button
        variant="primary"
        holographic
        temporal
        onClick={() => console.log('Temporal sync initiated')}
      >
        Initialize Sync
      </Button>
    </Card>
  );
}
```

## 🎨 Official Color Palette

### Primary Brand Colors
```css
--color-primary: #BAC0CC     /* Light Blue-Gray */
--color-secondary: #BCC1D1   /* Light Gray */
--color-tertiary: #D9DBE3    /* Lightest Gray */
--color-dark: #181818        /* Near Black */
```

### Accent Colors
```css
--color-accent: #00d4aa      /* Bright Teal - CTAs */
--color-accent-hover: #00ffcc /* Bright Cyan - Hover */
```

### System Colors
```css
--color-success: #10b981     /* Emerald */
--color-warning: #f59e0b     /* Amber */
--color-error: #ef4444       /* Red */
--color-info: #3b82f6        /* Blue */
```

## 🔤 Typography System

### Font Families
- **Display**: `Rajdhani` - Headlines and hero text
- **Body**: `HK Guise` - UI elements and body text
- **Accent**: `Aeonik TRIAL` - Special features
- **Mono**: `JetBrains Mono` - Code and technical content

### Type Scale (Major Third - 1.25 ratio)
```css
--text-hero: 4.75rem    /* 76px */
--text-h1: 3.5rem       /* 56px */
--text-h2: 3rem         /* 48px */
--text-h3: 2.25rem      /* 36px */
--text-h4: 1.75rem      /* 28px */
--text-body: 1.125rem   /* 18px */
```

## 🧩 Component Library

### Button Component

```tsx
<Button
  variant="primary" | "secondary" | "ghost" | "outline" | "temporal"
  size="sm" | "md" | "lg" | "xl"
  holographic={true}
  temporal={true}
  glitch={true}
  loading={false}
>
  Activate Protocol
</Button>
```

**Features:**
- Holographic shimmer effects
- Temporal glow animations
- Glitch effects on hover
- Loading states with spinners
- Full accessibility support

### Card Component

```tsx
<Card
  variant="default" | "elevated" | "outlined" | "temporal" | "holographic"
  size="sm" | "md" | "lg" | "xl"
  hoverable={true}
  glow={true}
  temporal={true}
>
  <CardHeader title="Temporal Sync" subtitle="Nanosecond Precision" />
  <CardBody>
    Content with glassmorphism background
  </CardBody>
  <CardFooter align="between">
    Footer actions
  </CardFooter>
</Card>
```

**Features:**
- Glassmorphism effects with backdrop blur
- Holographic border animations
- Temporal particle effects
- Responsive design patterns

### Neon Text Component

```tsx
<NeonText
  color="accent" | "primary" | "custom"
  intensity="subtle" | "normal" | "strong" | "extreme"
  animation="pulse" | "flicker" | "glitch" | "temporal"
  size="sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
  holographic={true}
>
  Temporal Synchronization Active
</NeonText>
```

**Features:**
- Multiple glow intensities
- Cyberpunk animations
- Holographic color shifting
- Screen reader friendly

### Temporal Counter Component

```tsx
<TemporalCounter
  value={1234567890}
  format="nanoseconds" | "microseconds" | "milliseconds" | "seconds"
  variant="default" | "atomic" | "quantum" | "precision"
  animation="count" | "pulse" | "drift" | "glitch"
  showAccuracy={true}
  accuracy={99.999}
  realTime={true}
/>
```

**Features:**
- Atomic clock aesthetics
- Quantum particle effects
- Precision grid overlays
- Real-time updates
- Nanosecond precision display

## 🎭 Theme System

### Using the Theme Hook

```tsx
import { useTheme } from '@/styles';

function ThemeToggle() {
  const { theme, toggleTheme, toggleTemporalEffects } = useTheme();

  return (
    <div>
      <Button onClick={toggleTheme}>
        Switch to {theme.resolvedScheme === 'dark' ? 'Light' : 'Dark'}
      </Button>

      <Button onClick={toggleTemporalEffects}>
        {theme.temporalEffects ? 'Disable' : 'Enable'} Temporal Effects
      </Button>
    </div>
  );
}
```

### Custom CSS Properties

```tsx
const { setCustomProperty } = useTheme();

// Set custom neon color
setCustomProperty('--custom-neon-color', '#ff6b9d');
```

## ♿ Accessibility Features

### Focus Management

```tsx
import { useFocusTrap, createFocusTrap } from '@/styles';

function Modal({ isOpen }) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Automatic focus trap
  useFocusTrap(modalRef, isOpen);

  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      Modal content
    </div>
  );
}
```

### Screen Reader Announcements

```tsx
import { useAnnouncer } from '@/styles';

function Component() {
  const announce = useAnnouncer();

  const handleSync = () => {
    announce('Temporal synchronization initiated', 'assertive');
  };

  return <Button onClick={handleSync}>Sync</Button>;
}
```

### Keyboard Navigation

```tsx
import { useKeyboardNavigation } from '@/styles';

function Menu() {
  const menuRef = useRef<HTMLDivElement>(null);

  useKeyboardNavigation(menuRef, '[role="menuitem"]', {
    orientation: 'vertical',
    wrap: true
  });

  return (
    <div ref={menuRef} role="menu">
      <div role="menuitem" tabIndex={0}>Item 1</div>
      <div role="menuitem" tabIndex={-1}>Item 2</div>
    </div>
  );
}
```

## 📱 Responsive Design

### Breakpoint System

```css
/* Mobile-first breakpoints */
--breakpoint-sm: 640px    /* Small tablets */
--breakpoint-md: 768px    /* Tablets portrait */
--breakpoint-lg: 1024px   /* Small laptops */
--breakpoint-xl: 1280px   /* Desktops */
--breakpoint-2xl: 1536px  /* Large screens */
```

### Usage in CSS

```css
.component {
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .component {
    padding: var(--space-8);
  }
}
```

## 🎨 Animation System

### Cyberpunk Effects

```css
/* Neon pulse animation */
.neon-pulse {
  animation: neon-pulse 2s ease-in-out infinite alternate;
}

/* Holographic shimmer */
.holographic {
  position: relative;
  overflow: hidden;
}

.holographic::before {
  animation: shimmer 2s ease infinite;
}

/* Temporal sync animation */
.temporal-sync {
  animation: temporal-sync 3s linear infinite;
}
```

### Performance Optimizations

- Hardware acceleration with `will-change`
- Respects `prefers-reduced-motion`
- GPU-optimized transforms
- Efficient particle systems

## 🔧 Development

### File Structure

```
src/styles/
├── tokens.ts           # Design tokens
├── globals.css         # Global styles
├── index.ts           # Main exports
└── README.md          # Documentation

src/components/ui/
├── Button.tsx         # Button component
├── Button.module.css  # Button styles
├── Card.tsx           # Card component
├── Card.module.css    # Card styles
├── NeonText.tsx       # Neon text component
├── NeonText.module.css
├── TemporalCounter.tsx
├── TemporalCounter.module.css
└── index.ts           # Component exports

src/providers/
└── ThemeProvider.tsx  # Theme context

src/utils/
└── accessibility.ts   # A11y utilities
```

### Adding New Components

1. Create component file in `src/components/ui/`
2. Create corresponding CSS module
3. Export from `src/components/ui/index.ts`
4. Add to main export in `src/styles/index.ts`

### Design Token Usage

```tsx
// In TypeScript
import { tokens } from '@/styles/tokens';

const buttonStyle = {
  backgroundColor: tokens.colors.accent,
  padding: tokens.spacing[4],
  borderRadius: tokens.borderRadius.lg,
};

// In CSS
.button {
  background-color: var(--color-accent);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}
```

## 🎯 Best Practices

### Component Design
- Use semantic HTML elements
- Include proper ARIA attributes
- Support keyboard navigation
- Provide screen reader content
- Respect user preferences

### Performance
- Use CSS custom properties for theming
- Leverage hardware acceleration
- Optimize animations for 60fps
- Lazy load heavy effects
- Support reduced motion

### Accessibility
- Maintain WCAG 2.2 AA compliance
- Test with screen readers
- Ensure proper color contrast
- Provide alternative text
- Use semantic markup

## 🔍 Testing

### Accessibility Testing
```bash
# Run accessibility audit
npm run test:a11y

# Manual testing checklist
- Tab navigation works
- Screen reader announces content
- Color contrast passes WCAG AA
- Animations respect reduced motion
- Focus indicators are visible
```

### Visual Testing
```bash
# Run visual regression tests
npm run test:visual

# Cross-browser testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
```

## 📚 Resources

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

## 🤝 Contributing

1. Follow the established design tokens
2. Maintain accessibility standards
3. Test across devices and browsers
4. Document new components
5. Update this README for new features

---

**Built with precision. Designed for the future.**

*ROKO Network Design System v1.0*