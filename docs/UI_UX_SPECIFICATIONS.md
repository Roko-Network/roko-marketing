# ROKO Marketing Site - UI/UX Specifications

## Executive Summary
This comprehensive UI/UX specification document defines the enhanced design system for the ROKO Network marketing site, emphasizing cyberpunk aesthetics, nanosecond precision temporal themes, and exceptional user experience. The system combines cutting-edge visual design with strict accessibility compliance (WCAG 2.2 AA) and performance optimization for enterprise-grade Web3 infrastructure presentation.

**Key Enhancement Areas:**
- Enhanced cyberpunk aesthetic with temporal precision visual elements
- Comprehensive accessibility compliance (WCAG 2.2 AA)
- Advanced 3D visualization integration
- Mobile-first responsive design with touch optimization
- Dark/light theme system with preference detection
- Nanosecond precision theme implementation
- DAO governance UI components
- Performance-optimized component patterns

---

## 1. Visual Design Language

### 1.1 Design Philosophy
**"Cyberpunk Minimalism Meets Nanosecond Precision"**

The enhanced design system combines:
- **Cyberpunk Aesthetics**: Dark interfaces with neon accents, holographic effects, and geometric patterns inspired by Blade Runner meets Swiss Design
- **Nanosecond Precision Theme**: Visual representations of time granularity, atomic clock synchronization, and temporal accuracy down to nanosecond level
- **Temporal Blockchain Elements**: IEEE 1588 PTP visualization, OCP-TAP protocol representations, and real-time synchronization indicators
- **Professional Enterprise Trust**: Institutional-grade reliability through sophisticated visual hierarchy and clear information architecture
- **Web3 Innovation**: Next-generation blockchain visualization with 3D network topologies and real-time data flows
- **Accessibility First**: Universal design principles ensuring inclusive experiences for all users

### 1.2 Enhanced Cyberpunk Aesthetic Elements

#### Core Visual Principles
- **Temporal Precision Indicators**: Nanosecond timing visualizations, atomic clock synchronization patterns
- **Holographic Interfaces**: Semi-transparent overlays with data stream effects
- **Geometric Cyberpunk Patterns**: Circuit board aesthetics, hexagonal grids, neural network visualizations
- **Neon Accent System**: Strategic use of teal (#00d4aa) as primary cyberpunk accent color
- **Dark Matter Backgrounds**: Deep space aesthetics with subtle particle effects
- **Blade Runner Inspired Typography**: Technical font combinations emphasizing precision and futurism

#### Temporal Theme Implementation
- **Clock Synchronization Visuals**: IEEE 1588 PTP network diagrams
- **Nanosecond Precision Counters**: Real-time temporal accuracy displays
- **Time Flow Animations**: Flowing particle systems representing temporal data
- **Atomic Clock Aesthetics**: Precision timing interface elements
- **Temporal Network Topology**: 3D visualizations of synchronized validator networks

---

## 2. Component Specifications

### 2.1 Navigation Components

#### Pre-Loader
**Specifications:**
- Duration: 2-3 seconds max
- Animation: Temporal wave pattern or clock synchronization visual
- Loading indicator: Percentage or progress bar
- Smooth transition to main content

#### Enhanced Navigation System
**Primary Navigation (Cyberpunk Styled):**
- Position: Fixed top header with glassmorphism effect
- Background: rgba(24, 24, 24, 0.95) with 10px backdrop blur
- Border: 1px solid rgba(186, 192, 204, 0.1) bottom border
- Height: 80px desktop / 64px mobile (increased for touch targets)
- Typography: HK Guise, 16px, font-weight 500, letter-spacing 0.025em
- Items: Technology, Governance, Developers, Ecosystem, Documentation
- Active state: Teal underline (#00d4aa) with 2px height, smooth grow animation
- Hover: Color transition to #00d4aa with 200ms ease, subtle glow effect
- Focus: 3px teal outline with 2px offset for keyboard navigation
- Mobile: Hamburger icon (24x24px) with slide-out menu animation

**Accessibility Enhancements:**
- Skip navigation link (hidden until focused)
- ARIA landmarks and labels
- Keyboard navigation support (Tab, Enter, Escape)
- Screen reader announcements for state changes
- Touch targets minimum 44x44px on mobile

#### Enhanced Micro-Interactions

**Cyberpunk Animation Patterns:**
- **Hover States**: 200ms cubic-bezier(0.4, 0, 0.2, 1) with subtle glow expansion
- **Click Feedback**: Holographic ripple effect with teal accent color
- **Scroll Triggers**: Intersection Observer-based animations with performance optimization
- **Loading States**: Cyberpunk-themed skeleton screens with scanning line animation
- **Focus States**: Neon glow effect matching brand teal color
- **State Transitions**: Smooth morphing between states with temporal precision timing

**Temporal Precision Effects:**
- **Clock Synchronization**: Pulsing animations at precise intervals
- **Data Stream Flows**: Particle systems representing nanosecond data flow
- **Network Pulse**: Synchronized breathing animations across validator nodes
- **Time Precision Counters**: Smooth incrementing animations for nanosecond displays

**Performance Considerations:**
- All animations respect prefers-reduced-motion
- Hardware acceleration for smooth 60fps performance
- Intersection Observer for scroll-based animations
- Will-change properties optimized for layer promotion

### 2.2 Layout Components

#### 404 Not Found Page
**Design Requirements:**
- Central illustration: Abstract temporal void or broken clock visualization
- Heading: "Lost in Time" or "Temporal Anomaly Detected"
- Message: Friendly, technical-themed error message
- CTA: "Return to Present" button linking to homepage
- Background: Animated particle field or matrix-style effect

#### Footer
**Structure:**
- **Top Section**:
  - Logo and tagline
  - Newsletter subscription
  - Social media links
- **Middle Section** (4 columns):
  - Product links
  - Developer resources
  - Company information
  - Community links
- **Bottom Section**:
  - Copyright notice
  - Legal links
  - Language selector

### 2.3 Interactive Elements

#### Enhanced CTA System

**Primary CTA (Cyberpunk Styled):**
```css
.btn-primary {
  /* Base styles */
  background: linear-gradient(135deg, #00d4aa 0%, #00ffcc 100%);
  color: #181818;
  padding: 16px 32px;
  border-radius: 8px;
  border: none;
  font-family: 'Rajdhani', sans-serif;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Cyberpunk glow effect */
  box-shadow: 0 4px 20px rgba(0, 212, 170, 0.3);

  /* Holographic shimmer effect */
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
    transform: rotate(45deg);
    transition: all 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 30px rgba(0, 212, 170, 0.4);
  }

  &:hover::before {
    animation: shimmer 0.5s ease;
  }

  &:focus {
    outline: 3px solid #00d4aa;
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}
```

**Secondary CTA (Ghost Styled):**
```css
.btn-secondary {
  background: transparent;
  color: #BAC0CC;
  border: 2px solid #BAC0CC;
  padding: 14px 30px; /* Adjusted for border */
  border-radius: 8px;
  font-family: 'HK Guise', sans-serif;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(186, 192, 204, 0.1);
    border-color: #00d4aa;
    color: #00d4aa;
    box-shadow: 0 0 20px rgba(0, 212, 170, 0.2);
  }

  &:focus {
    outline: 3px solid #00d4aa;
    outline-offset: 2px;
  }
}
```

**Accessibility Features:**
- Minimum 44x44px touch targets
- High contrast ratios (tested with color contrast analyzers)
- Focus indicators with 3px outline and 2px offset
- Screen reader friendly text and ARIA labels
- Keyboard activation support
- Loading states with aria-live announcements

#### Enhanced Page Transitions

**Cyberpunk Page Transitions:**
```css
/* Framer Motion variants */
const pageTransitions = {
  initial: {
    opacity: 0,
    y: 20,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: 'blur(10px)',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

const glitchEffect = {
  animate: {
    x: [0, -2, 2, -1, 1, 0],
    filter: [
      'hue-rotate(0deg)',
      'hue-rotate(90deg)',
      'hue-rotate(-90deg)',
      'hue-rotate(0deg)'
    ],
    transition: {
      duration: 0.3,
      repeat: 2
    }
  }
};
```

**Temporal Progress Loader:**
- Position: Fixed top, full width
- Height: 3px
- Background: Linear gradient with teal accent
- Animation: Smooth progress with nanosecond precision timing
- Accessibility: aria-live region with progress announcements

---

## 3. Governance UI Components

### 3.1 Governance Dashboard

#### Main Dashboard Layout
**Structure:**
- **Header**: Wallet connection status, network selector
- **Sidebar**: Navigation (Overview, Proposals, Staking, Delegation, Treasury)
- **Main Content**: Dynamic content area
- **Footer**: Network stats, gas prices

**Visual Design:**
- Background: Dark gradient (#0a0e27 to #12151a)
- Cards: Glass morphism effect with subtle borders
- Accent: Voting power visualization with radial gradient

#### Token Balance Card
**Specifications:**
- Size: 360px x 200px
- Background: Semi-transparent with blur
- Content:
  - ROKO balance (large display)
  - pwROKO balance (voting power)
  - Reputation multiplier badge
  - Quick stake/unstake buttons

#### Proposal Card
**Specifications:**
- Layout: Horizontal card with status indicator
- Elements:
  - Title (24px, semibold)
  - Status badge (Active/Passed/Failed/Pending)
  - Progress bar (votes cast)
  - Time remaining countdown
  - Vote buttons (For/Against/Abstain)
  - Quorum indicator

### 3.2 Staking Interface

#### Staking Modal
**Specifications:**
- Width: 480px max
- Steps: Amount input → Review → Confirm → Success
- Features:
  - Real-time gas estimation
  - APY display
  - Instant unstake option
  - Transaction history

**Visual Elements:**
- Input field with token selector
- Balance display with "Max" button
- Conversion preview (ROKO → pwROKO)
- Gas fee estimation
- Animated confirmation state

### 3.3 Voting Components

#### Voting Interface
**Layout:**
- Proposal details (expandable)
- Current results visualization
- Vote casting panel
- Delegation option

**Voting Visualization:**
- Donut chart for vote distribution
- Progress bar for quorum
- Real-time updates via WebSocket
- Animated transitions on vote cast

#### Delegation Modal
**Features:**
- Delegate search/selection
- Delegation history
- Revoke delegation option
- Delegate profile display

### 3.4 Treasury Visualization

#### Treasury Dashboard
**Components:**
- Total value locked (TVL) display
- Asset allocation pie chart
- Recent transactions table
- Budget allocation by working group

**Visual Style:**
- 3D pie chart with hover details
- Glassmorphism cards
- Animated value counters
- Color-coded asset types

### 3.5 Reputation System UI

#### Badge Gallery
**Layout:**
- Grid display (3-4 columns)
- Badge cards with:
  - NFT image
  - Title and description
  - Multiplier value
  - Rarity indicator
  - Achievement progress

**Interactive Elements:**
- Hover: 3D rotation effect
- Click: Detailed view modal
- Filter/sort options
- Progress indicators

### 3.6 Working Group Interface

#### Working Group Dashboard
**Sections:**
- Member list with roles
- Budget overview
- Active initiatives
- Funding requests
- Deliverables tracker

**Multi-sig Component:**
- Pending transactions list
- Signature status indicators
- Approve/reject buttons
- Transaction details panel

---

## 4. Design Elements

### 4.1 Enhanced 3D Visual Elements

#### Core 3D Assets for Cyberpunk Aesthetic

**1. Nanosecond Precision Temporal Orb:**
```javascript
// Three.js implementation specs
const temporalOrb = {
  geometry: 'IcosahedronGeometry',
  radius: 2.5,
  detail: 3,
  materials: {
    base: 'MeshPhysicalMaterial',
    color: '#181818',
    metalness: 0.8,
    roughness: 0.2,
    transmission: 0.1,
    emissive: '#00d4aa',
    emissiveIntensity: 0.1
  },
  animations: {
    rotation: 'continuous slow rotation around Y-axis',
    pulse: 'emission intensity breathing effect',
    particles: 'surrounding particle system with nanosecond timing'
  },
  performance: {
    LOD: 'multiple detail levels based on viewport size',
    culling: 'frustum culling enabled',
    shadows: 'optimized shadow mapping'
  }
};
```

**2. IEEE 1588 PTP Network Visualization:**
- Interactive 3D globe with validator nodes
- Real-time connection lines with data flow animation
- Nanosecond synchronization pulse effects
- Geographic accuracy for global validator distribution
- WebSocket integration for live network data

**3. Cyberpunk Geometric Patterns:**
- Hexagonal grid systems with neon glow effects
- Circuit board aesthetic with flowing data streams
- Holographic interface overlays
- Particle systems representing blockchain transactions
- Morphing geometric shapes with temporal precision timing

**4. Temporal Flow Visualizations:**
- Flowing ribbon structures representing time synchronization
- Clock mechanism 3D models with nanosecond precision indicators
- Data stream particles flowing between network nodes
- Atomic clock visualization with precise timing animations

#### Enhanced 3D Implementation Strategy

**Technology Stack:**
```javascript
// Enhanced Three.js setup
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useMemo } from 'react';
import {
  Environment,
  OrbitControls,
  useGLTF,
  Sparkles,
  Html,
  useProgress
} from '@react-three/drei';

// Performance optimization
const Scene = () => {
  const { viewport, camera } = useThree();

  // LOD implementation
  const meshDetail = useMemo(() => {
    const distance = camera.position.distanceTo(new Vector3(0, 0, 0));
    return distance > 10 ? 'low' : distance > 5 ? 'medium' : 'high';
  }, [camera.position]);

  return (
    <>
      <TemporalOrb detail={meshDetail} />
      <NetworkVisualization />
      <ParticleSystem count={1000} />
      <Environment preset="night" />
    </>
  );
};
```

**Performance Optimizations:**
- Automatic LOD system based on device capabilities
- Frustum culling for off-screen objects
- Instanced rendering for particle systems
- Compressed texture formats (ASTC, ETC2)
- WebGL 2.0 features with WebGL 1.0 fallback
- GPU-based particle systems using compute shaders
- Selective rendering for mobile devices

**Accessibility Considerations:**
- prefers-reduced-motion detection
- Static image fallbacks for motion-sensitive users
- Descriptive alt text for 3D visualizations
- Keyboard controls for interactive 3D elements
- Screen reader descriptions of 3D content

**Progressive Loading:**
- Lightweight placeholder models
- Streaming texture loading
- Progressive enhancement of detail levels
- Bandwidth-aware quality adjustment

### 4.2 Grid System & Layout

**Desktop Grid:**
- Container: 1440px max-width
- Columns: 12
- Gutter: 32px
- Margin: 80px

**Tablet Grid:**
- Container: 100% with 48px padding
- Columns: 8
- Gutter: 24px

**Mobile Grid:**
- Container: 100% with 24px padding
- Columns: 4
- Gutter: 16px

**Layout Patterns:**
- **Hero Sections**: Full-width with centered content
- **Content Sections**: Alternating left/right layouts
- **Card Grids**: 3-column (desktop), 2-column (tablet), 1-column (mobile)
- **Feature Showcases**: Z-pattern or F-pattern layouts

### 4.3 Imagery Style

**Photography Requirements:**
- **Style**: Futuristic, ethereal, high-tech
- **Color Treatment**: Cool blue/purple tones with cyan highlights
- **Subjects**:
  - Abstract architectural spaces
  - Human-technology interfaces
  - Geometric patterns and structures
  - Light trails and temporal effects

**AI-Generated Imagery Themes:**
1. Futuristic cityscapes with temporal elements
2. Human subjects with technological augmentation
3. Abstract representations of time and synchronization
4. Crystalline and geometric formations
5. Sacred geometry patterns

### 4.4 UI Icons

**Icon Style:**
- Type: Outlined with 2px stroke
- Size: 24x24px (standard), 16x16px (small), 32x32px (large)
- Corner radius: 2px for geometric consistency
- Animation: Subtle rotation or pulse on interaction

**Required Icon Set:**
- Navigation icons (menu, close, arrow, external link)
- Feature icons (clock, sync, blockchain, security, speed)
- Social media icons
- Technology icons (API, SDK, nodes, validators)
- Action icons (download, copy, share, expand)

---

## 5. Color System

### 5.1 Primary Palette

```css
/* Official ROKO Brand Colors */
--roko-primary: #BAC0CC;      /* Light Blue-Gray - Primary brand */
--roko-secondary: #BCC1D1;    /* Light Gray - Secondary elements */
--roko-tertiary: #D9DBE3;     /* Lightest Gray - Subtle accents */
--roko-dark: #181818;         /* Near Black - Text and contrasts */

/* Accent Colors (from Figma CTAs) */
--roko-teal: #00d4aa;         /* Bright Teal - CTAs and highlights */
--roko-teal-hover: #00ffcc;   /* Bright Cyan - Hover states */

/* System Colors */
--roko-success: #10b981;      /* Emerald - Success states */
--roko-warning: #f59e0b;      /* Amber - Warnings */
--roko-error: #ef4444;        /* Red - Errors */
--roko-info: #3b82f6;         /* Blue - Information */
```

### 5.2 Background Colors

```css
/* Dark Theme */
--bg-primary: #000000;        /* Pure black */
--bg-secondary: #0a0a0a;      /* Near black panels */
--bg-tertiary: #181818;       /* ROKO Dark - Card backgrounds */
--bg-elevated: #2a2a2a;       /* Elevated surfaces */
--bg-overlay: rgba(24, 24, 24, 0.95);  /* Modal overlay with ROKO dark */

/* Gradients */
--gradient-hero: linear-gradient(135deg, #BAC0CC 0%, #D9DBE3 100%);
--gradient-accent: linear-gradient(135deg, #00d4aa 0%, #00ffcc 100%);
--gradient-dark: linear-gradient(180deg, #000000 0%, #181818 100%);
--gradient-glow: radial-gradient(circle, #00d4aa 0%, transparent 70%);
```

### 5.3 Text Colors

```css
/* Text Hierarchy */
--text-primary: #ffffff;      /* Primary text on dark */
--text-secondary: #D9DBE3;    /* Secondary text - ROKO Light Gray */
--text-tertiary: #BCC1D1;     /* Muted text - ROKO Gray */
--text-accent: #00d4aa;       /* Accent text - Teal */
--text-dark: #181818;         /* Dark text on light backgrounds */
--text-link: #BAC0CC;         /* Link default - ROKO Primary */
--text-link-hover: #00d4aa;   /* Link hover - Teal */
```

---

## 6. Typography System

### 6.1 Font Families

**Primary Font Stack:**
```css
--font-primary: 'HK Guise', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-display: 'Rajdhani', 'HK Guise', sans-serif;
--font-accent: 'Aeonik TRIAL', 'HK Guise', sans-serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

**Font Roles:**
- **Rajdhani**: Display headings, hero text (Google Fonts - free)
- **HK Guise**: Body text, UI elements (Commercial license required)
- **Aeonik TRIAL**: Special accents, premium features (Trial version - upgrade needed)

### 6.2 Type Scale

```css
/* Desktop Typography */
--text-hero: 72px/1.1;        /* Hero headlines */
--text-h1: 56px/1.2;          /* Page titles */
--text-h2: 48px/1.2;          /* Section headers */
--text-h3: 36px/1.3;          /* Subsection headers */
--text-h4: 28px/1.4;          /* Card headers */
--text-h5: 24px/1.4;          /* Small headers */
--text-body-lg: 20px/1.6;     /* Large body text */
--text-body: 18px/1.6;        /* Regular body text */
--text-body-sm: 16px/1.5;     /* Small body text */
--text-caption: 14px/1.4;     /* Captions and labels */
--text-micro: 12px/1.4;       /* Micro text */
```

### 6.3 Font Weights

```css
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 7. Motion & Animation

### 7.1 Animation Principles

**Timing Functions:**
```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

**Duration Scale:**
```css
--duration-instant: 100ms;
--duration-fast: 200ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 800ms;
```

### 7.2 Animation Patterns

#### Entrance Animations
- **Fade Up**: Elements fade in while moving up 20px
- **Stagger**: Sequential animation with 100ms delay between items
- **Scale**: Elements scale from 0.95 to 1 with opacity fade

#### Scroll Animations
- **Parallax**: Background moves at 0.5x scroll speed
- **Reveal**: Elements animate in when 20% visible
- **Progress**: Timeline indicators fill based on scroll position

#### Hover Effects
- **Glow**: Soft box-shadow expansion
- **Lift**: TranslateY(-4px) with shadow increase
- **Morph**: Shape transformations on geometric elements

---

## 8. Required Assets & Resources

### 8.1 3D Assets to Create/Acquire

1. **Temporal Orb Model**
   - Format: GLTF/GLB
   - Complexity: Medium poly (5-10k vertices)
   - Materials: Metallic with emission maps
   - Animation: Rotating gears and particles

2. **Geometric Sphere Fragments**
   - Format: GLTF/GLB
   - Variants: 3-4 different fragmentations
   - Materials: Glass and metal combination
   - Animation: Assembly/disassembly sequence

3. **Network Node Visualization**
   - Format: Three.js procedural
   - Dynamic: Based on real network data
   - Style: Interconnected glowing nodes
   - Animation: Pulsing connections

4. **Clock Mechanism**
   - Format: GLTF/GLB or SVG animation
   - Details: Gears, hands, temporal indicators
   - Materials: Gold/bronze metallic
   - Animation: Continuous movement

### 8.2 Imagery Assets to Generate

#### AI Image Generation Prompts

1. **Hero Section Background**
   ```
   "Futuristic ethereal cathedral architecture with flowing light streams,
   temporal clock mechanisms integrated into structures, blue and purple
   color palette, volumetric lighting, 8k, octane render"
   ```

2. **Technology Section**
   ```
   "Abstract visualization of time synchronization, flowing data streams
   forming geometric patterns, holographic interfaces, nanosecond precision
   representation, cyan and indigo colors, highly detailed"
   ```

3. **Validator Network**
   ```
   "Global network visualization with interconnected nodes, earth globe
   with glowing connection points, real-time data flow, dark space
   background, teal accent lighting"
   ```

4. **Human-Technology Interface**
   ```
   "Professional figure interacting with holographic blockchain interface,
   temporal data visualization, futuristic office environment, clean minimal
   aesthetic, blue-purple lighting"
   ```

### 8.3 Icon Library Requirements

**Custom Icons Needed:**
- Temporal/Clock variations (10 icons)
- Blockchain/Network icons (8 icons)
- Speed/Performance indicators (6 icons)
- Security/Validation symbols (6 icons)
- Developer tools icons (12 icons)
- Navigation elements (8 icons)

**Sources:**
- Primary: Custom design in Figma
- Secondary: Feather Icons (modified)
- Specialized: Cryptocurrency icon set

### 8.4 Animation Libraries

**Required Libraries:**
- **Framer Motion**: Page transitions and component animations
- **Three.js**: 3D visualizations
- **React Three Fiber**: React integration for Three.js
- **Lottie**: Complex 2D animations
- **GSAP**: Advanced scroll animations (optional)

### 8.5 Font Files

**To Acquire:**
1. **Rajdhani** (Display Font)
   - Source: Google Fonts (Free)
   - Weights: 300, 400, 500, 600, 700
   - Format: WOFF2
   - Usage: Headlines, hero text, CTAs

2. **HK Guise** (Primary Font)
   - Source: Commercial license required
   - License: ~$200-500 for web use
   - Weights: 300, 400, 500, 600, 700
   - Format: WOFF2
   - Usage: Body text, UI elements

3. **Aeonik TRIAL** (Accent Font)
   - Source: Trial version (upgrade needed for production)
   - License: Contact foundry for pricing
   - Weights: 400, 500, 600, 700
   - Format: WOFF2
   - Usage: Special features, premium sections

4. **JetBrains Mono** (Code Font)
   - License: Open source
   - Weights: 400, 500
   - Format: WOFF2
   - Usage: Code blocks, technical content

---

## 9. Responsive Design Specifications

### 9.1 Breakpoints

```scss
$breakpoints: (
  'mobile': 320px,     // Minimum supported
  'mobile-lg': 480px,  // Large phones
  'tablet': 768px,     // Tablets portrait
  'tablet-lg': 1024px, // Tablets landscape
  'desktop': 1280px,   // Desktop minimum
  'desktop-lg': 1440px,// Desktop standard
  'wide': 1920px       // Wide screens
);
```

### 9.2 Responsive Behavior

#### Typography Scaling
- **Desktop**: 100% of defined sizes
- **Tablet**: 90% of desktop sizes
- **Mobile**: 80% of desktop sizes
- **Minimum sizes enforced for readability**

#### Layout Adaptations
- **Desktop**: Multi-column layouts, side-by-side content
- **Tablet**: Reduced columns, stacked layouts for complex sections
- **Mobile**: Single column, vertical stacking, hamburger menu

#### Image Handling
- **Art Direction**: Different crops for different viewports
- **Resolution**: 1x, 2x, 3x for retina displays
- **Format**: WebP with JPEG fallback
- **Loading**: Lazy loading with blur-up placeholder

---

## 10. Enhanced Accessibility Requirements (WCAG 2.2 AA)

### 10.1 Visual Accessibility
- **Color Contrast**: Minimum 4.5:1 for body text, 3:1 for large text
- **Focus Indicators**: Visible outline with 3px offset
- **Text Size**: Minimum 16px for body text
- **Touch Targets**: Minimum 44x44px

### 10.2 Motion Accessibility
- **Reduced Motion**: Respect prefers-reduced-motion
- **Pause Controls**: For auto-playing animations
- **Smooth Scrolling**: Optional based on user preference

### 10.3 Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: For interactive elements
- **Skip Links**: Navigation bypass options
- **Alt Text**: Descriptive text for all images

---

## 11. Enhanced Performance Guidelines

### 11.1 Asset Optimization
- **Images**: Max 200KB per image, WebP format
- **3D Models**: Max 500KB per model, compressed textures
- **Fonts**: Subset and preload critical glyphs
- **Icons**: SVG sprites or inline SVG

### 11.2 Loading Strategy
- **Critical CSS**: Inline above-the-fold styles
- **Code Splitting**: Route-based chunking
- **Lazy Loading**: Images, 3D models, and below-fold content
- **Preloading**: Critical fonts and hero images

### 11.3 Performance Targets
- **LCP**: < 2.5 seconds
- **FID/INP**: < 100ms
- **CLS**: < 0.1
- **Bundle Size**: < 200KB total, < 50KB initial

---

## 12. Enhanced Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Set up color system and typography
- [ ] Implement grid system and basic layouts
- [ ] Create navigation components
- [ ] Design and build hero section

### Phase 2: Core Components (Week 3-4)
- [ ] Develop CTA buttons and form elements
- [ ] Create card components and layouts
- [ ] Implement footer and 404 page
- [ ] Add basic animations and transitions

### Phase 3: Advanced Features (Week 5-6)
- [ ] Integrate 3D visualizations
- [ ] Add scroll animations and parallax
- [ ] Implement interactive demos
- [ ] Optimize performance and accessibility

### Phase 4: Polish (Week 7-8)
- [ ] Refine animations and micro-interactions
- [ ] Complete responsive adaptations
- [ ] Conduct accessibility audit
- [ ] Performance optimization

---

## 13. Enhanced Design Handoff Package

### Assets to Deliver
- [ ] Figma design file with components
- [ ] Exported SVG icons
- [ ] Image assets in multiple formats
- [ ] 3D model files
- [ ] Animation specifications
- [ ] Brand guidelines document

### Documentation
- [ ] Component specifications
- [ ] Interaction patterns
- [ ] Responsive behaviors
- [ ] Animation timings
- [ ] Color and typography tokens

### Development Resources
- [ ] CSS custom properties file
- [ ] Component library structure
- [ ] Animation library configurations
- [ ] Performance budget guidelines

---

## Enhanced Conclusion

This specification provides a comprehensive guide for implementing the ROKO Network marketing site. The design emphasizes temporal precision, futuristic aesthetics, and professional credibility while maintaining high performance and accessibility standards. The modular component system allows for efficient development and future scalability.

For questions or clarifications, refer to the original Figma files or contact the design team.