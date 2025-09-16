# ROKO Marketing Site - Development Handover Document

## Executive Summary

This document provides a comprehensive handover package for the development team, consolidating all requirements, specifications, and implementation guidelines for the ROKO Network marketing site.

---

## 1. Project Overview

### 1.1 Scope
Build a high-performance marketing website for ROKO Network, featuring:
- Temporal blockchain technology showcase
- Developer documentation portal
- DAO governance interface
- Validator onboarding system
- White-label capabilities

### 1.2 Technology Stack
```javascript
{
  "frontend": {
    "framework": "React 18",
    "language": "TypeScript 5",
    "bundler": "Vite 5",
    "styling": "CSS Modules / Tailwind CSS",
    "state": "Zustand / React Query",
    "3d": "Three.js / React Three Fiber"
  },
  "web3": {
    "wallet": "RainbowKit / WalletConnect",
    "library": "Viem / Wagmi",
    "contracts": "TypeChain"
  },
  "testing": {
    "unit": "Vitest",
    "e2e": "Playwright",
    "visual": "Percy"
  }
}
```

---

## 2. Updated User Stories

### Epic 1: Landing Experience

#### US-1.1: Hero Section with Temporal Visualization
**As a** first-time visitor
**I want to** immediately understand ROKO's nanosecond precision advantage
**So that** I grasp the unique value proposition

**Acceptance Criteria:**
- [ ] Hero loads with LCP < 2.5s
- [ ] Animated 3D temporal orb using Three.js
- [ ] Headline uses Rajdhani font, 72px
- [ ] Background gradient: #000000 to #181818
- [ ] Primary CTA in teal (#00d4aa) with hover (#00ffcc)
- [ ] Live network stats WebSocket connection
- [ ] Mobile responsive with touch gestures

**Technical Implementation:**
```typescript
interface HeroProps {
  stats: NetworkStats;
  onCTAClick: (action: 'build' | 'docs' | 'network') => void;
}

const Hero: FC<HeroProps> = ({ stats, onCTAClick }) => {
  // Three.js temporal orb
  // WebSocket for live stats
  // GSAP for text animations
}
```

#### US-1.2: Brand-Compliant Navigation
**As a** user navigating the site
**I want to** easily find information with clear visual hierarchy
**So that** I can explore features efficiently

**Acceptance Criteria:**
- [ ] Sticky header with glassmorphism effect
- [ ] Background: rgba(24, 24, 24, 0.95)
- [ ] Navigation text: HK Guise, 16px, #BCC1D1
- [ ] Active state: Teal (#00d4aa) with underline
- [ ] Mobile menu with slide-in animation
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] ARIA labels and roles

### Epic 2: Technology Deep Dive

#### US-2.1: Interactive Temporal Comparison
**As a** blockchain developer
**I want to** compare ROKO's temporal precision with other chains
**So that** I understand the performance benefits

**Acceptance Criteria:**
- [ ] D3.js animated comparison chart
- [ ] Real-time latency simulation
- [ ] Data export as CSV/JSON
- [ ] Touch-enabled for mobile
- [ ] Accessibility: keyboard navigation + screen reader support
- [ ] Colors: ROKO grays (#BAC0CC, #BCC1D1, #D9DBE3) for data viz

**Data Structure:**
```typescript
interface ChainComparison {
  chain: string;
  latency: number; // nanoseconds
  throughput: number; // TPS
  precision: 'nanosecond' | 'millisecond' | 'second';
  color: string; // Brand palette
}
```

#### US-2.2: 3D Network Visualization
**As a** potential validator
**I want to** see the global network topology
**So that** I understand the infrastructure scale

**Acceptance Criteria:**
- [ ] Three.js globe with real validator locations
- [ ] Animated connection lines in teal
- [ ] Click on node for validator details
- [ ] Performance: 60fps on mid-range devices
- [ ] Fallback: Static image for low-end devices
- [ ] WebGL detection and graceful degradation

### Epic 3: Developer Portal

#### US-3.1: Interactive Code Playground
**As a** developer
**I want to** test ROKO SDK functions in-browser
**So that** I can experiment before implementation

**Acceptance Criteria:**
- [ ] Monaco Editor integration
- [ ] JetBrains Mono font for code
- [ ] Syntax highlighting for TypeScript/Solidity
- [ ] Live execution in sandboxed environment
- [ ] Code sharing via URL
- [ ] Examples gallery with categories
- [ ] Dark theme matching brand (#000000 background)

#### US-3.2: API Documentation
**As a** developer
**I want to** comprehensive API documentation
**So that** I can integrate ROKO effectively

**Acceptance Criteria:**
- [ ] OpenAPI/Swagger integration
- [ ] Interactive request builder
- [ ] Code examples in multiple languages
- [ ] Search functionality with autocomplete
- [ ] Version selector
- [ ] Copy code button with confirmation

### Epic 4: DAO Governance Interface

#### US-4.1: Governance Dashboard
**As a** token holder
**I want to** view all governance activity
**So that** I can participate in decision-making

**Acceptance Criteria:**
- [ ] Connect wallet (MetaMask, WalletConnect, Coinbase)
- [ ] Display balances: ROKO, pwROKO, reputation NFTs
- [ ] Voting power calculator with multipliers
- [ ] Active proposals with countdown timers
- [ ] Treasury balance in multiple currencies
- [ ] Gas estimation for all transactions
- [ ] Mobile-responsive card layout

#### US-4.2: Staking Interface
**As a** ROKO holder
**I want to** stake tokens for voting power
**So that** I can participate in governance

**Acceptance Criteria:**
- [ ] Input validation with max button
- [ ] Real-time conversion preview
- [ ] Gas optimization suggestions
- [ ] Transaction status tracking
- [ ] Success/error notifications
- [ ] Staking history table
- [ ] APY display (if applicable)

### Epic 5: White-Label System

#### US-5.1: Theme Customization
**As a** enterprise client
**I want to** customize the site appearance
**So that** it matches our brand

**Acceptance Criteria:**
- [ ] CSS variable overrides
- [ ] Logo upload and placement
- [ ] Color palette customization
- [ ] Font selection (with fallbacks)
- [ ] Preview mode
- [ ] Export theme configuration
- [ ] A/B testing support

### Epic 6: Performance & Analytics

#### US-6.1: Analytics Dashboard
**As a** site administrator
**I want to** track user engagement
**So that** I can optimize content

**Acceptance Criteria:**
- [ ] Google Analytics 4 integration
- [ ] Custom events for Web3 interactions
- [ ] Heatmap integration (Hotjar/Clarity)
- [ ] Performance metrics (Core Web Vitals)
- [ ] Conversion funnel tracking
- [ ] GDPR-compliant cookie consent

---

## 3. Enhanced Non-Functional Requirements

### NFR-1: Performance Requirements (Updated)

#### NFR-1.1: Core Web Vitals
```yaml
metrics:
  LCP: < 2.5s    # Largest Contentful Paint
  INP: < 200ms   # Interaction to Next Paint (replaced FID)
  CLS: < 0.1     # Cumulative Layout Shift
  FCP: < 1.8s    # First Contentful Paint
  TTFB: < 800ms  # Time to First Byte
  TBT: < 200ms   # Total Blocking Time
```

#### NFR-1.2: Bundle Optimization
```javascript
{
  "budgets": {
    "initial": "50KB",
    "lazy": "20KB per route",
    "fonts": "100KB total",
    "images": "200KB above fold",
    "3d": "500KB for models"
  }
}
```

### NFR-2: Accessibility Requirements (WCAG 2.2 AA)

#### NFR-2.1: Visual Accessibility
- Color contrast: 4.5:1 minimum (verified for ROKO palette)
- Focus indicators: 3px teal outline (#00d4aa)
- Text sizing: Minimum 16px, scalable to 200%
- Animation: Respect prefers-reduced-motion

#### NFR-2.2: Keyboard Navigation
- Tab order: Logical flow
- Skip links: "Skip to content", "Skip to navigation"
- Escape key: Close modals/menus
- Arrow keys: Navigate menus and carousels

### NFR-3: Browser & Device Support

```yaml
browsers:
  chrome: ">= 90"
  firefox: ">= 88"
  safari: ">= 14"
  edge: ">= 90"

mobile:
  ios: ">= 13"
  android: ">= 8"

features:
  webgl: required (with fallback)
  websocket: required
  service-worker: optional
  webp: preferred (with fallback)
```

### NFR-4: Security Requirements

#### NFR-4.1: Web3 Security
- Input validation for all blockchain addresses
- Transaction simulation before execution
- Slippage protection
- MEV protection awareness
- Signature verification

#### NFR-4.2: Application Security
```javascript
{
  "headers": {
    "Content-Security-Policy": "strict",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Strict-Transport-Security": "max-age=31536000"
  },
  "practices": {
    "sanitization": "DOMPurify",
    "secrets": "Environment variables only",
    "dependencies": "Weekly audit with Snyk"
  }
}
```

### NFR-5: SEO & Meta Requirements

```html
<!-- Required Meta Tags -->
<meta name="description" content="ROKO Network - The Temporal Layer for Web3. Nanosecond precision blockchain infrastructure.">
<meta property="og:title" content="ROKO Network">
<meta property="og:image" content="/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">

<!-- Schema.org Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ROKO Network",
  "url": "https://roko.network"
}
</script>
```

---

## 4. Technical Implementation Guidelines

### 4.1 Enhanced System Architecture

#### 4.1.1 Layered Architecture Pattern
```typescript
// Enhanced component architecture with domain-driven design
src/
├── core/                     // Core business logic
│   ├── domain/              // Domain models and entities
│   │   ├── models/          // Data models
│   │   ├── services/        // Business services
│   │   └── repositories/    // Data access interfaces
│   ├── infrastructure/      // Technical implementations
│   │   ├── api/            // API clients
│   │   ├── blockchain/     // Web3 implementations
│   │   ├── websocket/      // Real-time connections
│   │   └── storage/        // Local storage abstractions
│   └── shared/             // Cross-cutting concerns
│       ├── events/         // Event bus implementation
│       ├── cache/          // Caching strategies
│       └── monitoring/     // Performance monitoring
├── features/                 // Feature modules (micro-frontends)
│   ├── temporal-showcase/   // Temporal precision features
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── stores/
│   │   └── tests/
│   ├── governance/          // DAO governance features
│   ├── validators/          // Validator management
│   ├── developers/          // Developer tools
│   └── analytics/           // Analytics and monitoring
├── presentation/            // Presentation layer
│   ├── components/         // Reusable UI components
│   │   ├── primitives/     // Base components (Button, Input)
│   │   ├── composite/      // Complex components (Modal, Form)
│   │   └── layout/         // Layout components
│   ├── three/             // 3D rendering components
│   │   ├── scenes/        // 3D scenes
│   │   ├── materials/     // Custom materials
│   │   ├── shaders/       // GLSL shaders
│   │   └── utils/         // 3D utilities
│   └── pages/             // Page components
└── shared/                // Shared utilities
    ├── hooks/             // Custom React hooks
    ├── utils/             // Pure utility functions
    ├── constants/         // Application constants
    ├── types/             // TypeScript type definitions
    └── config/            // Configuration files
```

#### 4.1.2 Performance Architecture Patterns
```typescript
// Performance-first architectural patterns
interface PerformanceArchitecture {
  rendering: {
    strategy: 'Concurrent rendering with Suspense';
    patterns: [
      'Component lazy loading',
      'Progressive hydration',
      'Virtual scrolling for large lists',
      'Intersection Observer for animations',
      'RequestIdleCallback for non-critical tasks'
    ];
  };
  bundling: {
    strategy: 'Route-based code splitting';
    optimization: [
      'Tree shaking for unused code',
      'Dynamic imports for features',
      'Preloading critical resources',
      'Service worker for offline support'
    ];
  };
  memory: {
    management: [
      'Object pooling for Three.js',
      'Garbage collection optimization',
      'Event listener cleanup',
      'Image lazy loading with cleanup'
    ];
  };
}
```

### 4.2 Advanced State Management Architecture

#### 4.2.1 Event-Driven State Management
```typescript
// Enhanced Zustand store with event-driven architecture
interface RootStore {
  // Application state
  app: AppState;
  // Web3 state with optimistic updates
  web3: Web3State;
  // Real-time temporal data
  temporal: TemporalState;
  // UI state for performance
  ui: UIState;
  // Analytics and monitoring
  analytics: AnalyticsState;
}

// Domain-specific stores
interface Web3State {
  // Connection state
  wallet: {
    address: string | null;
    chainId: number;
    connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
    supportedChains: Chain[];
  };
  // Contract interactions
  contracts: {
    roko: ContractState;
    pwRoko: ContractState;
    governance: ContractState;
  };
  // Transaction state with queuing
  transactions: {
    pending: Transaction[];
    confirmed: Transaction[];
    failed: Transaction[];
  };
  // Gas optimization
  gas: {
    prices: GasPrices;
    estimates: GasEstimate[];
    optimization: GasOptimizationStrategy;
  };
}

interface TemporalState {
  // Real-time network statistics
  stats: {
    currentTime: bigint; // nanosecond precision
    blockTime: number;
    networkLatency: number;
    synchronizationAccuracy: number;
    validatorCount: number;
  };
  // WebSocket connections
  connections: {
    primary: WebSocketConnection;
    fallbacks: WebSocketConnection[];
    reconnectionStrategy: ReconnectionConfig;
  };
  // Historical data for charts
  history: {
    latency: TimeSeriesData[];
    throughput: TimeSeriesData[];
    accuracy: TimeSeriesData[];
  };
}

// Performance-optimized UI state
interface UIState {
  // Viewport and device capabilities
  viewport: {
    width: number;
    height: number;
    devicePixelRatio: number;
    gpu: GPUTier;
    supportsWebGL: boolean;
  };
  // Animation preferences
  motion: {
    prefersReducedMotion: boolean;
    animationQuality: 'low' | 'medium' | 'high';
  };
  // Loading states
  loading: {
    global: boolean;
    features: Record<string, boolean>;
  };
  // Error boundaries
  errors: {
    global: Error | null;
    features: Record<string, Error | null>;
  };
}
```

#### 4.2.2 Event Bus Architecture
```typescript
// Centralized event management for loose coupling
class EventBus {
  private events = new Map<string, Set<EventHandler>>();

  // Domain events
  static readonly EVENTS = {
    // Web3 events
    WALLET_CONNECTED: 'wallet:connected',
    WALLET_DISCONNECTED: 'wallet:disconnected',
    TRANSACTION_INITIATED: 'transaction:initiated',
    TRANSACTION_CONFIRMED: 'transaction:confirmed',

    // Temporal events
    STATS_UPDATED: 'temporal:stats:updated',
    SYNC_ACCURACY_CHANGED: 'temporal:sync:accuracy:changed',
    NETWORK_LATENCY_WARNING: 'temporal:network:latency:warning',

    // Performance events
    PERFORMANCE_DEGRADED: 'performance:degraded',
    MEMORY_THRESHOLD_EXCEEDED: 'performance:memory:threshold',

    // Analytics events
    PAGE_VIEW: 'analytics:page:view',
    USER_INTERACTION: 'analytics:user:interaction',
    CONVERSION_EVENT: 'analytics:conversion'
  } as const;

  subscribe(event: string, handler: EventHandler): void;
  unsubscribe(event: string, handler: EventHandler): void;
  emit(event: string, payload?: any): void;
}
```

### 4.3 Design System Architecture

#### 4.3.1 Enhanced Design Tokens with Performance
```scss
// Performance-optimized design tokens
:root {
  // Brand colors (official ROKO palette)
  --roko-primary: #BAC0CC;
  --roko-secondary: #BCC1D1;
  --roko-tertiary: #D9DBE3;
  --roko-dark: #181818;
  --roko-black: #000000;
  --roko-teal: #00d4aa;
  --roko-teal-hover: #00ffcc;
  --roko-teal-alpha: rgba(0, 212, 170, 0.1);

  // Enhanced color system for accessibility
  --text-primary: var(--roko-tertiary);
  --text-secondary: var(--roko-secondary);
  --text-muted: var(--roko-primary);
  --text-inverse: var(--roko-dark);

  // Background gradients for cyberpunk aesthetic
  --bg-gradient-primary: linear-gradient(135deg, var(--roko-black) 0%, var(--roko-dark) 100%);
  --bg-gradient-card: linear-gradient(145deg, rgba(24, 24, 24, 0.8) 0%, rgba(24, 24, 24, 0.4) 100%);
  --bg-gradient-glow: radial-gradient(circle at center, var(--roko-teal-alpha) 0%, transparent 70%);

  // Typography system (official fonts)
  --font-display: 'Rajdhani', 'Inter', system-ui, sans-serif;
  --font-body: 'HK Guise', 'Inter', system-ui, sans-serif;
  --font-accent: 'Aeonik TRIAL', 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;

  // Font size scale (responsive)
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);
  --text-3xl: clamp(2rem, 1.7rem + 1.5vw, 3rem);
  --text-4xl: clamp(3rem, 2.5rem + 2.5vw, 4rem);

  // Spacing system (fluid design)
  --space-xs: clamp(0.25rem, 0.2rem + 0.25vw, 0.5rem);
  --space-sm: clamp(0.5rem, 0.4rem + 0.5vw, 1rem);
  --space-md: clamp(1rem, 0.8rem + 1vw, 2rem);
  --space-lg: clamp(2rem, 1.5rem + 2.5vw, 4rem);
  --space-xl: clamp(4rem, 3rem + 5vw, 8rem);

  // Animation system
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --easing-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  // Shadows and effects
  --shadow-sm: 0 1px 2px 0 rgba(0, 212, 170, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 212, 170, 0.1), 0 2px 4px -1px rgba(0, 212, 170, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 212, 170, 0.1), 0 4px 6px -2px rgba(0, 212, 170, 0.05);
  --shadow-glow: 0 0 20px rgba(0, 212, 170, 0.3);

  // Border radius system
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  // Z-index layers
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-toast: 1080;
}

// Performance optimizations
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 1ms;
    --duration-normal: 1ms;
    --duration-slow: 1ms;
  }
}

// High contrast mode support
@media (prefers-contrast: high) {
  :root {
    --text-primary: #ffffff;
    --text-secondary: #ffffff;
    --roko-teal: #00ffcc;
  }
}
```

#### 4.3.2 Component Architecture Patterns
```scss
// BEM + CSS Modules hybrid approach
.component {
  // Base styles
  &__element {
    // Element styles
  }

  &__element--modifier {
    // Modifier styles
  }

  // Responsive design patterns
  @media (min-width: 768px) {
    // Tablet styles
  }

  @media (min-width: 1024px) {
    // Desktop styles
  }
}

// Performance-critical animations
.animate-performance {
  // Use transform and opacity for GPU acceleration
  transform: translateZ(0); // Force GPU layer
  will-change: transform, opacity;

  &:hover {
    transform: translateY(-2px) translateZ(0);
  }
}

// 3D component styling
.three-container {
  // Container for Three.js canvas
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  canvas {
    display: block;
    max-width: 100%;
    height: auto;
  }

  // Loading state
  &--loading {
    background: var(--bg-gradient-primary);

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      border: 2px solid var(--roko-teal-alpha);
      border-top: 2px solid var(--roko-teal);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
```

### 4.4 Advanced Performance Architecture

#### 4.4.1 Multi-Layer Performance Strategy
```typescript
// Performance monitoring and optimization
class PerformanceManager {
  private metrics: PerformanceMetrics = new Map();
  private observer: PerformanceObserver;

  constructor() {
    this.initializeMonitoring();
    this.setupBudgets();
  }

  // Real-time performance monitoring
  private initializeMonitoring() {
    // Core Web Vitals monitoring
    this.observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.trackMetric(entry.name, entry.value);
        this.checkBudgets(entry.name, entry.value);
      }
    });

    this.observer.observe({ entryTypes: ['measure', 'navigation', 'largest-contentful-paint'] });
  }

  // Performance budgets enforcement
  private setupBudgets() {
    const budgets = {
      LCP: 2500, // milliseconds
      FID: 100,
      CLS: 0.1,
      TTFB: 800,
      bundleSize: 50 * 1024, // 50KB
      memoryUsage: 100 * 1024 * 1024 // 100MB
    };
  }
}

// GPU-aware component loading
const useGPUOptimization = () => {
  const [gpuTier, setGpuTier] = useState<GPUTier>(0);
  const [supportsWebGL, setSupportsWebGL] = useState(false);

  useEffect(() => {
    const detectGPU = async () => {
      try {
        const detector = await import('gpu-detect');
        const gpu = await detector.getGPUTier();
        setGpuTier(gpu.tier);
        setSupportsWebGL(gpu.type !== 'FALLBACK');
      } catch {
        setGpuTier(0);
        setSupportsWebGL(false);
      }
    };

    detectGPU();
  }, []);

  return { gpuTier, supportsWebGL };
};

// Adaptive component loading
const AdaptiveThreeComponent = ({ children }: { children: React.ReactNode }) => {
  const { gpuTier, supportsWebGL } = useGPUOptimization();
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      if (!supportsWebGL || gpuTier < 1) {
        // Load static fallback
        const { StaticVisualization } = await import('./StaticVisualization');
        setComponent(() => StaticVisualization);
      } else if (gpuTier < 2) {
        // Load low-quality 3D
        const { LowQualityOrb } = await import('./LowQualityOrb');
        setComponent(() => LowQualityOrb);
      } else {
        // Load full-quality 3D
        const { HighQualityOrb } = await import('./HighQualityOrb');
        setComponent(() => HighQualityOrb);
      }
    };

    loadComponent();
  }, [gpuTier, supportsWebGL]);

  if (!Component) {
    return <div className="loading-fallback">Loading visualization...</div>;
  }

  return <Component>{children}</Component>;
};

// Memory-efficient image loading
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 80
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate responsive image URLs
  const generateSrcSet = (baseSrc: string) => {
    const sizes = [320, 640, 768, 1024, 1280, 1536];
    return sizes.map(size =>
      `${baseSrc}?w=${size}&q=${quality} ${size}w`
    ).join(', ');
  };

  // WebP detection and fallback
  const getOptimizedSrc = (originalSrc: string) => {
    const supportsWebP = () => {
      const canvas = document.createElement('canvas');
      return canvas.toDataURL('image/webp').indexOf('webp') > -1;
    };

    if (supportsWebP()) {
      return originalSrc.replace(/\.(jpg|jpeg|png)$/, '.webp');
    }
    return originalSrc;
  };

  return (
    <picture>
      {/* WebP source */}
      <source
        srcSet={generateSrcSet(src.replace(/\.(jpg|jpeg|png)$/, '.webp'))}
        type="image/webp"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {/* Fallback source */}
      <source
        srcSet={generateSrcSet(src)}
        type="image/jpeg"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <img
        ref={imgRef}
        src={getOptimizedSrc(src)}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
    </picture>
  );
};

// Bundle optimization with dynamic imports
const FeatureRoute = ({ feature }: { feature: string }) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const loadFeature = async () => {
      try {
        switch (feature) {
          case 'governance':
            const { GovernanceModule } = await import('../features/governance');
            setComponent(() => GovernanceModule);
            break;
          case 'validators':
            const { ValidatorModule } = await import('../features/validators');
            setComponent(() => ValidatorModule);
            break;
          case 'developers':
            const { DeveloperModule } = await import('../features/developers');
            setComponent(() => DeveloperModule);
            break;
          default:
            const { DefaultModule } = await import('../features/default');
            setComponent(() => DefaultModule);
        }
      } catch (error) {
        console.error(`Failed to load feature: ${feature}`, error);
        // Load error boundary or fallback
      }
    };

    loadFeature();
  }, [feature]);

  if (!Component) {
    return (
      <div className="feature-loading">
        <div className="loading-spinner" />
        <span>Loading {feature}...</span>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading component...</div>}>
      <Component />
    </Suspense>
  );
};
```

---

## 5. Testing Requirements

### 5.1 Unit Testing Coverage

```javascript
// Required coverage
{
  "statements": 80,
  "branches": 75,
  "functions": 80,
  "lines": 80
}

// Critical paths requiring 100% coverage
- Wallet connections
- Transaction builders
- Vote calculations
- Data visualizations
```

### 5.2 E2E Test Scenarios

```typescript
// Playwright test example
test.describe('User Journey: Developer Onboarding', () => {
  test('complete quick start flow', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="cta-start-building"]');
    await page.waitForSelector('[data-testid="playground"]');

    // Test code execution
    await page.fill('[data-testid="code-editor"]', sampleCode);
    await page.click('[data-testid="run-code"]');

    await expect(page.locator('[data-testid="output"]'))
      .toContainText('Success');
  });
});
```

### 5.3 Visual Regression Testing

```yaml
percy:
  snapshots:
    - name: "Homepage - Desktop"
      url: "/"
      widths: [1440]
    - name: "Homepage - Mobile"
      url: "/"
      widths: [375]
    - name: "Governance Dashboard"
      url: "/governance"
      widths: [1440, 768, 375]
```

---

## 6. Deployment & Infrastructure

### 6.1 Build Pipeline

```yaml
# GitHub Actions workflow
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e

  build:
    needs: test
    steps:
      - run: npm run build
      - run: npm run optimize

  deploy:
    needs: build
    steps:
      - name: Deploy to Vercel
        run: vercel deploy --prod
```

### 6.2 Environment Variables

```bash
# .env.example
VITE_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
VITE_WS_URL=wss://roko-network.io/ws
VITE_WALLETCONNECT_PROJECT_ID=xxx
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 6.3 CDN & Caching Strategy

```nginx
# Cache headers
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location / {
  add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

---

## 7. Development Checklist

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup with Vite + React + TypeScript
- [ ] Install and configure design system
- [ ] Set up ROKO brand colors and fonts
- [ ] Implement responsive grid system
- [ ] Create base components (Button, Card, Modal)
- [ ] Set up routing and navigation

### Phase 2: Core Features (Week 3-4)
- [ ] Build hero section with Three.js orb
- [ ] Implement temporal comparison visualizer
- [ ] Create API documentation interface
- [ ] Add network statistics dashboard
- [ ] Integrate Web3 wallet connections

### Phase 3: Governance (Week 5-6)
- [ ] Build governance dashboard
- [ ] Implement staking interface
- [ ] Create proposal voting system
- [ ] Add delegation features
- [ ] Integrate smart contracts

### Phase 4: Polish & Optimization (Week 7-8)
- [ ] Performance optimization
- [ ] SEO implementation
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Security audit
- [ ] Documentation finalization

---

## 8. Quality Gates

Each phase must pass these gates before proceeding:

### Gate 1: Code Quality
- [ ] ESLint: 0 errors, 0 warnings
- [ ] TypeScript: Strict mode, no any
- [ ] Test coverage: > 80%
- [ ] Bundle size: Within budget

### Gate 2: Performance
- [ ] Lighthouse score: > 95
- [ ] Core Web Vitals: All green
- [ ] Load time: < 3s on 3G
- [ ] No memory leaks

### Gate 3: Accessibility
- [ ] WCAG 2.2 AA compliant
- [ ] Keyboard navigable
- [ ] Screen reader tested
- [ ] Color contrast verified

### Gate 4: Security
- [ ] No high/critical vulnerabilities
- [ ] CSP headers configured
- [ ] Input validation complete
- [ ] Secrets properly managed

---

## 9. Support & Resources

### Documentation
- [ROKO Brand Guidelines](./COLOR_PALETTE_ANALYSIS.md)
- [UI/UX Specifications](./UI_UX_SPECIFICATIONS.md)
- [DAO Governance Spec](./DAO_GOVERNANCE_SPECIFICATION.md)
- [Technical Architecture](./PROJECT_GOVERNANCE.md)

### Design Assets
- Figma files: [Request access]
- Brand assets: `/assets/brand/`
- 3D models: `/assets/3d/`
- Icons: `/assets/icons/`

### Contacts
- Technical Lead: [Contact]
- Design Lead: [Contact]
- Product Owner: [Contact]
- QA Lead: [Contact]

---

## 10. Risk Mitigation

### Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| 3D performance on mobile | High | Implement GPU detection and fallbacks |
| Web3 wallet compatibility | Medium | Test with multiple wallets, provide guides |
| Font loading performance | Low | Subset fonts, use font-display: swap |
| WebSocket connection stability | Medium | Implement reconnection logic |

### Timeline Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep | High | Strict change control process |
| Third-party dependencies | Medium | Pin versions, maintain fallbacks |
| Design revisions | Medium | Lock design after Phase 1 |

---

## Conclusion

This handover document provides comprehensive requirements and specifications for the ROKO Network marketing site. The development team should follow the phased approach, ensuring each quality gate is met before progression.

Key success factors:
1. **Performance first**: Every decision should consider performance impact
2. **Brand consistency**: Strict adherence to ROKO brand guidelines
3. **User experience**: Smooth, intuitive interactions
4. **Web3 integration**: Robust wallet and contract interactions
5. **Accessibility**: Inclusive design for all users

---

*Document Version: 1.0*
*Last Updated: January 2025*
*Status: Ready for Development*