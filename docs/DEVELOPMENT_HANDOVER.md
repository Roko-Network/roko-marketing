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

### 4.1 Component Architecture

```typescript
// Component structure
src/
├── components/
│   ├── common/          // Shared components
│   │   ├── Button/
│   │   ├── Card/
│   │   └── Modal/
│   ├── layout/          // Layout components
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Navigation/
│   ├── features/        // Feature-specific
│   │   ├── Hero/
│   │   ├── Governance/
│   │   └── Validator/
│   └── three/          // 3D components
│       ├── TemporalOrb/
│       └── NetworkGlobe/
```

### 4.2 State Management Pattern

```typescript
// Zustand store example
interface AppStore {
  // Theme
  theme: 'dark'; // Dark only for now
  colors: BrandColors;

  // Network
  networkStats: NetworkStats;
  wsConnection: WebSocket | null;

  // Wallet
  address: string | null;
  chainId: number;

  // Actions
  connectWallet: () => Promise<void>;
  updateStats: (stats: NetworkStats) => void;
}
```

### 4.3 CSS Architecture

```scss
// Design tokens
:root {
  // Brand colors (from official palette)
  --roko-primary: #BAC0CC;
  --roko-secondary: #BCC1D1;
  --roko-tertiary: #D9DBE3;
  --roko-dark: #181818;
  --roko-teal: #00d4aa;

  // Typography (official fonts)
  --font-display: 'Rajdhani', sans-serif;
  --font-body: 'HK Guise', sans-serif;
  --font-accent: 'Aeonik TRIAL', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  // Spacing (8px grid)
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 2rem;
  --space-lg: 3rem;
  --space-xl: 4rem;
}
```

### 4.4 Performance Optimization

```javascript
// Lazy loading strategy
const Hero = lazy(() => import('./Hero'));
const Governance = lazy(() =>
  import(/* webpackChunkName: "governance" */ './Governance')
);

// Image optimization
<Image
  src="/hero-bg.webp"
  fallback="/hero-bg.jpg"
  loading="lazy"
  decoding="async"
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// 3D optimization
const TemporalOrb = () => {
  const { gpu } = useDetectGPU();

  if (gpu.tier < 2) {
    return <StaticOrb />; // Fallback
  }

  return <DynamicOrb quality={gpu.tier} />;
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