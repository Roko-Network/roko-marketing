# ROKO Marketing Site - UI/UX Specifications

## Executive Summary
Based on the Figma design artifacts review, this document provides detailed UI/UX specifications for the ROKO Network marketing site. The design language emphasizes futuristic technology, temporal precision, and Web3 innovation through a sophisticated visual system.

---

## 1. Visual Design Language

### 1.1 Design Philosophy
**"Temporal Precision Meets Futuristic Innovation"**

The design system combines:
- **Futuristic Aesthetics**: Clean, modern interfaces with advanced technology feel
- **Temporal Elements**: Visual representations of time, synchronization, and precision
- **Web3 Innovation**: Blockchain and decentralized technology visualization
- **Professional Enterprise**: Trust and reliability for institutional users

### 1.2 Moodboard Themes
- **Futuristic Architecture**: Grand, ethereal structures suggesting advanced civilization
- **Human-AI Synthesis**: Imagery blending human elements with technological enhancement
- **Sacred Geometry**: Mathematical precision and geometric patterns
- **Temporal Flow**: Visual representations of time and synchronization

---

## 2. Component Specifications

### 2.1 Navigation Components

#### Pre-Loader
**Specifications:**
- Duration: 2-3 seconds max
- Animation: Temporal wave pattern or clock synchronization visual
- Loading indicator: Percentage or progress bar
- Smooth transition to main content

#### Menu Navigation
**Primary Navigation:**
- Position: Fixed top header
- Background: Semi-transparent with blur effect (#0a0e27 @ 95% opacity)
- Height: 80px desktop / 60px mobile
- Items: Platform, Technology, Solutions, Developers, Ecosystem, Resources
- Active state: Underline animation with temporal glow effect
- Hover: Color transition to primary accent

#### Micro-Interactions
- **Hover States**: Smooth 300ms transitions
- **Click Feedback**: Ripple effect emanating from click point
- **Scroll Triggers**: Parallax effects on key sections
- **Loading States**: Skeleton screens with pulse animation

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

#### CTAs (Call-to-Action Buttons)
**Primary CTA:**
- Background: Linear gradient (#6366f1 to #14b8a6)
- Padding: 16px 32px
- Border-radius: 8px
- Font: 16px semibold
- Hover: Glow effect + slight scale (1.05)
- Active: Scale (0.98) with ripple

**Secondary CTA:**
- Background: Transparent
- Border: 2px solid #6366f1
- Hover: Background fill animation

#### Page Transitions
- **Type**: Smooth fade with slight vertical movement
- **Duration**: 400-600ms
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Loader**: Temporal progress bar at top of viewport

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

### 4.1 2D/3D Visual Elements

#### 3D Objects Required
1. **Geometric Spheres**:
   - Fragmented/exploding hexagonal patterns
   - Metallic and glass materials
   - Animation: Slow rotation and reassembly

2. **Temporal Orbs**:
   - Golden/bronze intricate mechanical spheres
   - Clock-like internal mechanisms
   - Holographic data streams

3. **Abstract Shapes**:
   - Flowing ribbon-like structures
   - Crystalline formations
   - Particle systems for backgrounds

#### Implementation
- **Technology**: Three.js with React Three Fiber
- **Performance**: LOD (Level of Detail) system for optimization
- **Fallback**: Static images for low-performance devices

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
/* Core Brand Colors */
--roko-primary: #00d4aa;      /* Bright Teal/Cyan - Main CTA color */
--roko-primary-hover: #00ffcc; /* Bright Cyan - Hover states */
--roko-primary-dark: #00a084;  /* Darker Teal - Active states */

/* Extended Palette */
--roko-secondary: #6366f1;    /* Indigo - Secondary elements */
--roko-tertiary: #8b5cf6;     /* Purple - Premium features */
--roko-info: #3b82f6;         /* Blue - Information */
--roko-success: #10b981;      /* Emerald - Success states */
--roko-warning: #f59e0b;      /* Amber - Warnings */
--roko-error: #ef4444;        /* Red - Errors */
```

### 5.2 Background Colors

```css
/* Dark Theme */
--bg-primary: #000000;        /* Pure black */
--bg-secondary: #0a0a0a;      /* Near black panels */
--bg-tertiary: #1a1a1a;       /* Card backgrounds */
--bg-elevated: #2a2a2a;       /* Elevated surfaces */
--bg-overlay: rgba(0, 0, 0, 0.95);  /* Modal overlay */

/* Gradients */
--gradient-hero: linear-gradient(135deg, #00d4aa 0%, #00ffcc 100%);
--gradient-accent: linear-gradient(135deg, #00d4aa 0%, #00a084 100%);
--gradient-dark: linear-gradient(180deg, #000000 0%, #0a0a0a 100%);
--gradient-glow: radial-gradient(circle, #00d4aa 0%, transparent 70%);
```

### 5.3 Text Colors

```css
/* Text Hierarchy */
--text-primary: #ffffff;      /* Primary text */
--text-secondary: #a0a0a0;    /* Secondary text */
--text-tertiary: #707070;     /* Muted text */
--text-accent: #00d4aa;       /* Accent text */
--text-link: #00ffcc;         /* Link hover */
```

---

## 6. Typography System

### 6.1 Font Families

**Primary Font Stack:**
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-display: 'Space Grotesk', 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

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
1. **Inter Variable Font**
   - License: Open source
   - Weights: 300-700
   - Format: WOFF2

2. **Space Grotesk**
   - License: Open source
   - Weights: 400, 500, 700
   - Format: WOFF2

3. **JetBrains Mono**
   - License: Open source
   - Weights: 400, 500
   - Format: WOFF2

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

## 10. Accessibility Requirements

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

## 11. Performance Guidelines

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

## 12. Implementation Priority

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

## 13. Design Handoff Checklist

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

## Conclusion

This specification provides a comprehensive guide for implementing the ROKO Network marketing site. The design emphasizes temporal precision, futuristic aesthetics, and professional credibility while maintaining high performance and accessibility standards. The modular component system allows for efficient development and future scalability.

For questions or clarifications, refer to the original Figma files or contact the design team.