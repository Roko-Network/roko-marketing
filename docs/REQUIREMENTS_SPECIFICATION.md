# ROKO Marketing Site - Requirements Specification

## Table of Contents
1. [Non-Functional Requirements](#non-functional-requirements)
2. [Functional Requirements - User Stories](#functional-requirements---user-stories)
3. [Testing Strategy](#testing-strategy)
4. [CI/CD Pipeline Specification](#cicd-pipeline-specification)
5. [SEO Requirements](#seo-requirements)

---

## Non-Functional Requirements

### NFR-1: Performance Requirements

#### NFR-1.1: Load Time
- **Initial Load**: < 2 seconds on 3G connection
- **Subsequent Navigation**: < 200ms route changes
- **Time to Interactive (TTI)**: < 3 seconds
- **First Contentful Paint (FCP)**: < 1 second
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

**Measurement**: Lighthouse CI, Web Vitals monitoring

#### NFR-1.2: Bundle Size
- **Initial Bundle**: < 50KB gzipped
- **Per-Route Chunk**: < 20KB gzipped
- **Total Application**: < 200KB gzipped
- **Images**: Lazy loaded, WebP with fallback
- **Fonts**: Subset, preloaded critical glyphs

**Measurement**: Webpack Bundle Analyzer, size-limit

### NFR-2: Scalability Requirements

#### NFR-2.1: Traffic Handling
- **Concurrent Users**: Support 10,000+ simultaneous visitors
- **CDN Distribution**: Global edge locations
- **Static Assets**: Infinite scalability via CDN
- **API Calls**: Rate limited, cached responses

**Measurement**: Load testing with k6/Artillery

### NFR-3: Availability Requirements

#### NFR-3.1: Uptime
- **Target**: 99.9% uptime (< 8.76 hours downtime/year)
- **Deployment**: Zero-downtime deployments
- **Failover**: Automatic CDN failover
- **Monitoring**: Real-time alerting

**Measurement**: Uptime monitoring, incident tracking

### NFR-4: Security Requirements

#### NFR-4.1: Application Security
- **CSP Headers**: Strict Content Security Policy
- **HTTPS**: Enforced everywhere
- **XSS Protection**: Input sanitization
- **Dependencies**: Automated vulnerability scanning
- **Secrets**: Environment variables, never in code

**Measurement**: Security audits, OWASP compliance

### NFR-5: Browser Compatibility

#### NFR-5.1: Support Matrix
- **Chrome**: Last 2 versions
- **Firefox**: Last 2 versions
- **Safari**: Last 2 versions
- **Edge**: Last 2 versions
- **Mobile**: iOS 13+, Android 8+

**Measurement**: Cross-browser testing suite

### NFR-6: Accessibility Requirements

#### NFR-6.1: WCAG Compliance
- **Level**: WCAG 2.1 AA
- **Screen Readers**: Full support
- **Keyboard Navigation**: Complete functionality
- **Color Contrast**: 4.5:1 minimum
- **Focus Indicators**: Visible and clear

**Measurement**: axe-core automated testing, manual audits

### NFR-7: Development Requirements

#### NFR-7.1: Build Performance
- **Development Build**: < 5 seconds
- **Production Build**: < 30 seconds
- **Hot Reload**: < 500ms
- **CI Pipeline**: < 5 minutes total

**Measurement**: Build time monitoring

### NFR-8: Blockchain Integration Requirements

#### NFR-8.1: Web3 Connectivity
- **Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet, Rainbow
- **Network Support**: Ethereum Mainnet, Arbitrum, Base, Polygon
- **RPC Fallback**: Multiple RPC endpoints with automatic failover
- **Transaction Retry**: Automatic retry with exponential backoff
- **Gas Optimization**: EIP-1559 support, gas estimation, batch transactions

**Measurement**: Transaction success rate, connection reliability, gas efficiency

#### NFR-8.2: Smart Contract Interaction
- **ABI Management**: TypeChain generated types
- **Event Listening**: Real-time updates via WebSocket with reconnection
- **Error Handling**: User-friendly blockchain error messages
- **Signature Standards**: EIP-712 typed data signing
- **Account Abstraction**: ERC-4337 support for gasless transactions
- **Multi-sig Support**: Gnosis Safe integration

**Measurement**: Contract call success rate, event subscription reliability

### NFR-9: Design System Requirements

#### NFR-9.1: Brand Compliance
- **Colors**: Official ROKO palette (#BAC0CC, #BCC1D1, #D9DBE3, #181818)
- **Typography**: Rajdhani (display), HK Guise (body), Aeonik TRIAL (accent)
- **Spacing**: 8px grid system
- **Border Radius**: 8px standard, 16px for cards
- **Shadows**: Consistent elevation system

**Measurement**: Design system audit score, brand consistency check

#### NFR-9.2: Component Library
- **Storybook**: All components documented
- **Props Validation**: TypeScript interfaces for all props
- **Theming**: CSS variables for customization
- **Accessibility**: ARIA compliant components
- **Testing**: Visual regression tests for all states

**Measurement**: Component coverage, documentation completeness

---

## Functional Requirements - User Stories

### Epic 1: Core Site Experience

#### US-1.1: Homepage Hero Section
**As a** visitor
**I want to** immediately understand ROKO's value proposition
**So that** I can decide if it's relevant to my needs

**Acceptance Criteria:**
- [ ] Hero displays within 1 second
- [ ] Headline in Rajdhani font, 72px, color #D9DBE3
- [ ] Tagline: "The Temporal Layer for Web3" in HK Guise
- [ ] Animated temporal orb with #00d4aa glow effects
- [ ] CTAs with teal background (#00d4aa), hover (#00ffcc)
- [ ] Background gradient: #000000 to #181818
- [ ] Live network stats in ROKO gray (#BCC1D1)
- [ ] Stats update every 5 seconds via WebSocket

**Test Cases:**
```javascript
describe('Homepage Hero', () => {
  it('displays hero content within 1 second')
  it('shows animated timeline visualization')
  it('updates network stats every 5 seconds')
  it('CTAs navigate to correct destinations')
})
```

#### US-1.2: Navigation System
**As a** user
**I want to** easily navigate between sections
**So that** I can find relevant information quickly

**Acceptance Criteria:**
- [ ] Sticky navigation with glassmorphism (rgba(24, 24, 24, 0.95))
- [ ] Navigation text in HK Guise, 16px, #BCC1D1
- [ ] Active link in teal (#00d4aa) with underline animation
- [ ] Mobile hamburger menu with slide animation
- [ ] Keyboard accessible (Tab, Enter, Escape)
- [ ] ARIA labels for accessibility
- [ ] Logo area with ROKO branding

**Test Cases:**
```javascript
describe('Navigation', () => {
  it('remains sticky on scroll')
  it('highlights active section')
  it('supports keyboard navigation')
  it('toggles mobile menu')
})
```

### Epic 2: Technology Showcase

#### US-2.1: Temporal Precision Visualizer
**As a** developer
**I want to** see ROKO's timing precision compared to other blockchains
**So that** I understand the technical advantage

**Acceptance Criteria:**
- [ ] Interactive comparison chart
- [ ] Real-time latency simulation
- [ ] Toggleable blockchain comparisons
- [ ] Export comparison data
- [ ] Mobile responsive visualization

**Test Cases:**
```javascript
describe('Precision Visualizer', () => {
  it('loads visualization data')
  it('updates in real-time')
  it('allows blockchain selection')
  it('exports comparison data')
  it('renders on mobile devices')
})
```

#### US-2.2: Technical Specifications
**As a** validator operator
**I want to** review detailed technical requirements
**So that** I can prepare appropriate infrastructure

**Acceptance Criteria:**
- [ ] Hardware requirements table
- [ ] Network requirements
- [ ] Synchronization specifications
- [ ] Downloadable PDF specs
- [ ] Cost calculator

**Test Cases:**
```javascript
describe('Technical Specs', () => {
  it('displays hardware requirements')
  it('calculates estimated costs')
  it('generates PDF download')
  it('shows network topology')
})
```

### Epic 3: Developer Experience

#### US-3.1: Quick Start Guide
**As a** developer
**I want to** quickly start building on ROKO
**So that** I can prototype my application

**Acceptance Criteria:**
- [ ] Copy-paste code snippets
- [ ] Language selector (JS/Python/Rust)
- [ ] Interactive code playground
- [ ] Step-by-step tutorial
- [ ] Progress tracking

**Test Cases:**
```javascript
describe('Quick Start', () => {
  it('provides copyable code snippets')
  it('switches between languages')
  it('runs code in playground')
  it('tracks tutorial progress')
})
```

#### US-3.2: SDK Documentation
**As a** developer
**I want to** access comprehensive SDK documentation
**So that** I can integrate ROKO into my application

**Acceptance Criteria:**
- [ ] Searchable API reference
- [ ] Code examples for each method
- [ ] Version selector
- [ ] Dark mode toggle
- [ ] Offline documentation download

**Test Cases:**
```javascript
describe('SDK Documentation', () => {
  it('searches API methods')
  it('displays code examples')
  it('switches versions')
  it('toggles dark mode')
  it('generates offline bundle')
})
```

### Epic 4: White-Label Capabilities

#### US-4.1: Industry Template Preview
**As an** enterprise decision maker
**I want to** preview industry-specific customizations
**So that** I can visualize ROKO for my use case

**Acceptance Criteria:**
- [ ] Industry selector (Finance/Gaming/IoT/Healthcare)
- [ ] Live preview with industry branding
- [ ] Feature comparison matrix
- [ ] ROI calculator
- [ ] Demo request form

**Test Cases:**
```javascript
describe('Industry Templates', () => {
  it('switches between industries')
  it('updates branding dynamically')
  it('calculates ROI projections')
  it('submits demo requests')
})
```

#### US-4.2: White-Label Configurator
**As a** potential partner
**I want to** customize ROKO's appearance and features
**So that** I can see how it fits my brand

**Acceptance Criteria:**
- [ ] Brand color picker
- [ ] Logo upload
- [ ] Feature toggles
- [ ] Export configuration
- [ ] Share preview link

**Test Cases:**
```javascript
describe('White-Label Config', () => {
  it('updates colors in real-time')
  it('uploads and displays logo')
  it('toggles features on/off')
  it('exports configuration JSON')
  it('generates shareable link')
})
```

### Epic 5: Community Engagement

#### US-5.1: Ecosystem Showcase
**As a** visitor
**I want to** see projects built on ROKO
**So that** I can understand real-world usage

**Acceptance Criteria:**
- [ ] Project cards with descriptions
- [ ] Filter by category
- [ ] Search functionality
- [ ] External links to projects
- [ ] Submit project form

**Test Cases:**
```javascript
describe('Ecosystem Showcase', () => {
  it('displays project cards')
  it('filters by category')
  it('searches projects')
  it('validates submission form')
})
```

#### US-5.2: Network Statistics Dashboard
**As a** network participant
**I want to** monitor real-time network health
**So that** I can make informed decisions

**Acceptance Criteria:**
- [ ] Live validator count
- [ ] Average block time
- [ ] Synchronization accuracy
- [ ] Transaction throughput
- [ ] Historical charts

**Test Cases:**
```javascript
describe('Network Stats', () => {
  it('connects to WebSocket feed')
  it('updates metrics in real-time')
  it('renders historical charts')
  it('handles connection failures')
})
```

### Epic 6: SEO & Performance

#### US-6.1: SEO Optimization
**As a** marketing team
**I want** the site to rank well in search engines
**So that** we attract organic traffic

**Acceptance Criteria:**
- [ ] Meta tags on all pages
- [ ] Structured data markup
- [ ] XML sitemap generation
- [ ] Canonical URLs
- [ ] Social media cards

**Test Cases:**
```javascript
describe('SEO', () => {
  it('includes meta tags')
  it('generates structured data')
  it('creates valid sitemap')
  it('sets canonical URLs')
  it('renders social cards')
})
```

### Epic 7: DAO Governance Integration

#### US-7.1: Governance Dashboard
**As a** token holder
**I want to** view and participate in governance
**So that** I can influence the protocol's direction

**Acceptance Criteria:**
- [ ] Connect wallet (MetaMask/WalletConnect)
- [ ] Display token balances (ROKO, pwROKO)
- [ ] Show voting power with multipliers
- [ ] List active proposals with status
- [ ] Display treasury information
- [ ] View delegation status

**Test Cases:**
```javascript
describe('Governance Dashboard', () => {
  it('connects to Web3 wallet')
  it('displays token balances')
  it('calculates voting power')
  it('shows active proposals')
  it('displays treasury balance')
})
```

#### US-7.2: Staking Interface
**As a** ROKO holder
**I want to** stake tokens for voting power
**So that** I can participate in governance

**Acceptance Criteria:**
- [ ] Stake ROKO to receive pwROKO 1:1
- [ ] Display staking rewards/benefits
- [ ] Instant unstaking capability
- [ ] Delegation management
- [ ] Transaction history
- [ ] Gas estimation display

**Test Cases:**
```javascript
describe('Staking', () => {
  it('stakes ROKO tokens')
  it('mints pwROKO tokens')
  it('allows instant unstaking')
  it('manages delegation')
  it('estimates gas costs')
})
```

#### US-7.3: Proposal Voting
**As a** pwROKO holder
**I want to** vote on proposals
**So that** I can participate in decision-making

**Acceptance Criteria:**
- [ ] View proposal details and discussion
- [ ] Cast votes (for/against/abstain)
- [ ] Delegate voting power
- [ ] View voting history
- [ ] See real-time voting results
- [ ] Support different voting strategies

**Test Cases:**
```javascript
describe('Voting', () => {
  it('displays proposal details')
  it('casts votes with signature')
  it('delegates voting power')
  it('shows voting results')
  it('handles quadratic voting')
})
```

#### US-7.4: Working Group Interface
**As a** working group member
**I want to** manage group activities
**So that** I can execute approved initiatives

**Acceptance Criteria:**
- [ ] View working group members
- [ ] Submit funding requests
- [ ] Track budget allocation
- [ ] Report on deliverables
- [ ] Multi-sig transaction management

**Test Cases:**
```javascript
describe('Working Groups', () => {
  it('displays member list')
  it('submits funding requests')
  it('tracks budget usage')
  it('manages multi-sig approvals')
})
```

#### US-7.5: Reputation System
**As a** community contributor
**I want to** earn reputation badges
**So that** I get increased voting power

**Acceptance Criteria:**
- [ ] Display reputation NFTs
- [ ] Show achievement progress
- [ ] Calculate voting multipliers
- [ ] Leaderboard rankings
- [ ] Badge gallery view

**Test Cases:**
```javascript
describe('Reputation', () => {
  it('displays NFT badges')
  it('tracks achievements')
  it('calculates multipliers')
  it('shows leaderboard')
})
```

### Epic 8: 3D Visualizations & Animations

#### US-8.1: Temporal Orb Hero Animation
**As a** visitor
**I want to** see an impressive 3D temporal orb
**So that** I'm engaged by the futuristic technology

**Acceptance Criteria:**
- [ ] Three.js temporal orb with rotating gears
- [ ] Particle effects around the orb
- [ ] Mouse/touch interaction for rotation
- [ ] Performance: 60fps on mid-range devices
- [ ] Fallback: Static image for low-end devices
- [ ] Loading state while model loads

**Test Cases:**
```javascript
describe('Temporal Orb', () => {
  it('loads 3D model successfully')
  it('responds to mouse movement')
  it('maintains 60fps performance')
  it('shows fallback on WebGL error')
  it('displays loading indicator')
})
```

#### US-8.2: Network Globe Visualization
**As a** user
**I want to** see global network activity
**So that** I understand ROKO's worldwide presence

**Acceptance Criteria:**
- [ ] Interactive 3D globe with validator nodes
- [ ] Real-time connection animations
- [ ] Click on node for details
- [ ] Zoom and rotate controls
- [ ] Mobile touch gestures
- [ ] Data updates via WebSocket

**Test Cases:**
```javascript
describe('Network Globe', () => {
  it('renders globe with nodes')
  it('handles user interactions')
  it('updates data in real-time')
  it('supports touch gestures')
})
```

#### US-8.3: Scroll-Triggered Animations
**As a** user scrolling the page
**I want to** see smooth animations trigger
**So that** the experience feels premium

**Acceptance Criteria:**
- [ ] GSAP ScrollTrigger implementation
- [ ] Stagger animations for lists
- [ ] Parallax effects on images
- [ ] Text reveal animations
- [ ] Respect prefers-reduced-motion
- [ ] No layout shift (CLS < 0.1)

**Test Cases:**
```javascript
describe('Scroll Animations', () => {
  it('triggers at correct scroll positions')
  it('respects reduced motion preference')
  it('maintains performance while scrolling')
  it('no cumulative layout shift')
})
```

### Epic 9: Documentation Portal

#### US-9.1: Interactive API Explorer
**As a** developer
**I want to** test API endpoints interactively
**So that** I can understand the API quickly

**Acceptance Criteria:**
- [ ] Swagger/OpenAPI integration
- [ ] Try it out functionality
- [ ] Authentication handling
- [ ] Request/response examples
- [ ] Code generation for multiple languages
- [ ] Search and filter endpoints

**Test Cases:**
```javascript
describe('API Explorer', () => {
  it('loads API specification')
  it('sends test requests')
  it('displays responses')
  it('generates code snippets')
  it('handles authentication')
})
```

#### US-9.2: Code Playground
**As a** developer
**I want to** write and test code in-browser
**So that** I can experiment without setup

**Acceptance Criteria:**
- [ ] Monaco editor with TypeScript support
- [ ] Syntax highlighting and autocomplete
- [ ] Run code in sandboxed environment
- [ ] Share code via URL
- [ ] Save code snippets
- [ ] Import npm packages

**Test Cases:**
```javascript
describe('Code Playground', () => {
  it('executes code safely')
  it('provides autocomplete')
  it('shares via URL')
  it('handles errors gracefully')
  it('imports packages')
})
```

### Epic 10: Analytics & Monitoring

#### US-10.1: User Analytics Dashboard
**As a** site administrator
**I want to** track user behavior
**So that** I can optimize the user experience

**Acceptance Criteria:**
- [ ] Google Analytics 4 integration
- [ ] Custom events for key actions
- [ ] Conversion funnel tracking
- [ ] Real-time user count
- [ ] Geographic distribution
- [ ] Device and browser breakdown

**Test Cases:**
```javascript
describe('Analytics', () => {
  it('tracks page views')
  it('records custom events')
  it('respects DNT header')
  it('handles cookie consent')
})
```

#### US-10.2: Performance Monitoring
**As a** technical administrator
**I want to** monitor site performance
**So that** I can maintain optimal speed

**Acceptance Criteria:**
- [ ] Core Web Vitals tracking
- [ ] Error logging with Sentry
- [ ] Uptime monitoring
- [ ] API response times
- [ ] WebSocket connection stability
- [ ] Alert thresholds

**Test Cases:**
```javascript
describe('Performance Monitoring', () => {
  it('captures Web Vitals')
  it('logs errors to Sentry')
  it('tracks API latency')
  it('monitors WebSocket health')
})
```

---

## Testing Strategy

### Unit Testing
```javascript
// Framework: Vitest
// Coverage Target: 80%

// Example Test Structure
describe('Component: HeroSection', () => {
  describe('Rendering', () => {
    it('renders headline text')
    it('displays CTA buttons')
    it('shows network stats')
  })

  describe('Interactions', () => {
    it('handles CTA clicks')
    it('updates stats via WebSocket')
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels')
    it('supports keyboard navigation')
  })
})
```

### Integration Testing
```javascript
// Framework: Playwright
// Test Scenarios: User journeys

describe('Developer Journey', () => {
  it('navigates from landing to documentation')
  it('copies code snippet and tests in playground')
  it('completes quick start tutorial')
})
```

### Performance Testing
```javascript
// Framework: Lighthouse CI
// Metrics: Core Web Vitals

module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      url: ['/', '/developers', '/technology']
    },
    assert: {
      assertions: {
        'first-contentful-paint': ['error', {maxNumericValue: 1000}],
        'interactive': ['error', {maxNumericValue: 3000}],
        'speed-index': ['error', {maxNumericValue: 2000}],
        'total-blocking-time': ['error', {maxNumericValue: 100}]
      }
    }
  }
}
```

### Accessibility Testing
```javascript
// Framework: axe-core + Pa11y
// Standard: WCAG 2.1 AA

describe('Accessibility', () => {
  it('passes WCAG 2.1 AA standards')
  it('supports screen readers')
  it('maintains focus management')
  it('provides skip links')
})
```

---

## CI/CD Pipeline Specification

### Pipeline Architecture
```yaml
name: ROKO Marketing Site CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20.x'
  CACHE_VERSION: v1

jobs:
  # Stage 1: Quality Checks
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci --prefer-offline

      - name: Lint Code
        run: npm run lint

      - name: Type Check
        run: npm run type-check

      - name: Format Check
        run: npm run format:check

  # Stage 2: Build & Test
  build-test:
    needs: quality
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci --prefer-offline

      - name: Build Application
        run: |
          npm run build
          npm run build:analyze
        env:
          NODE_ENV: production

      - name: Run Unit Tests
        run: npm run test:unit -- --shard=${{ matrix.shard }}/4

      - name: Upload Build Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-output-${{ matrix.shard }}
          path: dist/
          retention-days: 1

  # Stage 3: Performance & Accessibility
  performance:
    needs: build-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Download Build
        uses: actions/download-artifact@v3
        with:
          name: build-output-1
          path: dist/

      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: ./lighthouse.config.js
          uploadArtifacts: true
          temporaryPublicStorage: true

      - name: Bundle Size Check
        run: |
          npm run size
          npm run size:why

      - name: Accessibility Audit
        run: npm run test:a11y

  # Stage 4: E2E Testing
  e2e:
    needs: build-test
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.40.0-focal
    steps:
      - uses: actions/checkout@v4

      - name: Download Build
        uses: actions/download-artifact@v3
        with:
          name: build-output-1
          path: dist/

      - name: Run E2E Tests
        run: |
          npm run test:e2e
        env:
          CI: true

      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  # Stage 5: Security Scanning
  security:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Security Audit
        run: npm audit --audit-level=moderate

      - name: OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'ROKO-Marketing'
          path: '.'
          format: 'HTML'

      - name: CodeQL Analysis
        uses: github/codeql-action/analyze@v2

  # Stage 6: Preview Deployment
  preview:
    if: github.event_name == 'pull_request'
    needs: [performance, e2e, security]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Download Build
        uses: actions/download-artifact@v3
        with:
          name: build-output-1
          path: dist/

      - name: Deploy to Vercel Preview
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./dist

      - name: Comment PR with Preview URL
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 Preview deployed to: ${process.env.VERCEL_URL}`
            })

  # Stage 7: Production Deployment
  deploy:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    needs: [performance, e2e, security]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Download All Builds
        uses: actions/download-artifact@v3
        with:
          path: dist/

      - name: Optimize Assets
        run: |
          # Compress HTML
          npx html-minifier-terser dist/**/*.html \
            --collapse-whitespace \
            --remove-comments \
            --minify-css true \
            --minify-js true

          # Optimize images
          npx imagemin dist/images/* --out-dir=dist/images

          # Generate WebP versions
          npx cwebp dist/images/*.{jpg,png} -o dist/images/

          # Create Brotli compression
          find dist -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" \) \
            -exec brotli {} \;

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: roko-marketing
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}

      - name: Deploy to AWS S3 + CloudFront
        run: |
          # Sync to S3
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} \
            --delete \
            --cache-control "public, max-age=31536000, immutable" \
            --metadata-directive REPLACE

          # Invalidate CloudFront
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_ID }} \
            --paths "/*"
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: us-east-1

      - name: Purge CDN Cache
        run: |
          # Purge Cloudflare cache
          curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CF_ZONE_ID }}/purge_cache" \
            -H "Authorization: Bearer ${{ secrets.CF_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            --data '{"purge_everything":true}'

      - name: Update DNS Records
        run: |
          # Update A record for zero-downtime deployment
          echo "Updating DNS records..."

  # Stage 8: Post-Deployment Validation
  validate:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - name: Health Check
        run: |
          for i in {1..5}; do
            STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://roko.network)
            if [ $STATUS -eq 200 ]; then
              echo "Site is live!"
              exit 0
            fi
            sleep 10
          done
          exit 1

      - name: Run Smoke Tests
        run: |
          npx playwright test tests/smoke/ --project=chromium

      - name: Monitor Core Web Vitals
        run: |
          npx web-vitals https://roko.network --json > vitals.json
          node scripts/check-vitals.js vitals.json

      - name: Notify Success
        uses: 8398a7/action-slack@v3
        with:
          status: custom
          custom_payload: |
            {
              text: "✅ ROKO Marketing Site Deployed Successfully",
              attachments: [{
                color: 'good',
                text: `Version ${process.env.GITHUB_SHA} is now live at https://roko.network`
              }]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

  # Rollback Strategy
  rollback:
    if: failure() && needs.validate.result == 'failure'
    needs: validate
    runs-on: ubuntu-latest
    steps:
      - name: Rollback Deployment
        run: |
          # Revert to previous version
          aws s3 sync s3://${{ secrets.S3_BUCKET }}-backup/ s3://${{ secrets.S3_BUCKET }} --delete
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"

      - name: Notify Rollback
        uses: 8398a7/action-slack@v3
        with:
          status: custom
          custom_payload: |
            {
              text: "⚠️ Deployment Failed - Rolled Back",
              attachments: [{
                color: 'warning',
                text: 'Previous stable version restored'
              }]
            }
```

### Build Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.roko\.network\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          }
        ]
      }
    }),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'animations': ['framer-motion', 'three'],
          'charts': ['recharts']
        }
      }
    },
    reportCompressedSize: true,
    chunkSizeWarningLimit: 50
  }
})
```

---

## SEO Requirements

### Technical SEO

#### Meta Tags Structure
```html
<!-- Primary Meta Tags -->
<title>ROKO Network - The Temporal Layer for Web3</title>
<meta name="title" content="ROKO Network - The Temporal Layer for Web3">
<meta name="description" content="Build time-sensitive blockchain applications with nanosecond precision. IEEE 1588 PTP-grade synchronization for Web3.">
<meta name="keywords" content="temporal blockchain, nanosecond precision, IEEE 1588, OCP-TAP, Web3 infrastructure">
<meta name="robots" content="index, follow">
<meta name="language" content="English">
<link rel="canonical" href="https://roko.network/">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://roko.network/">
<meta property="og:title" content="ROKO Network - The Temporal Layer for Web3">
<meta property="og:description" content="Build time-sensitive blockchain applications with nanosecond precision.">
<meta property="og:image" content="https://roko.network/og-image.png">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://roko.network/">
<meta property="twitter:title" content="ROKO Network - The Temporal Layer for Web3">
<meta property="twitter:description" content="Build time-sensitive blockchain applications with nanosecond precision.">
<meta property="twitter:image" content="https://roko.network/twitter-image.png">
```

#### Structured Data
```javascript
// JSON-LD Schema
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ROKO Network",
  "url": "https://roko.network",
  "logo": "https://roko.network/logo.png",
  "description": "Temporal blockchain infrastructure with nanosecond precision",
  "sameAs": [
    "https://twitter.com/rokonetwork",
    "https://github.com/rokonetwork",
    "https://discord.gg/rokonetwork"
  ],
  "foundingDate": "2024",
  "knowsAbout": [
    "Blockchain Technology",
    "Distributed Systems",
    "Time Synchronization",
    "IEEE 1588 PTP"
  ]
}
```

### Content SEO Strategy

#### URL Structure
```
/                           # Homepage
/technology                 # Technology overview
/technology/temporal        # Temporal architecture
/technology/synchronization # Time synchronization
/developers                 # Developer hub
/developers/quick-start     # Quick start guide
/developers/sdk             # SDK documentation
/solutions                  # Industry solutions
/solutions/finance          # Financial markets
/solutions/gaming           # Gaming & metaverse
/ecosystem                  # Ecosystem overview
/ecosystem/validators       # Validator information
/resources                  # Resources hub
/resources/papers           # Technical papers
/blog                      # Blog posts
/blog/[slug]               # Individual posts
```

#### Sitemap Generation
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://roko.network/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://roko.network/technology</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- Additional URLs -->
</urlset>
```

### Performance SEO

#### Resource Hints
```html
<!-- DNS Prefetch -->
<link rel="dns-prefetch" href="//api.roko.network">
<link rel="dns-prefetch" href="//cdn.roko.network">

<!-- Preconnect -->
<link rel="preconnect" href="https://api.roko.network">
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- Preload Critical Resources -->
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/css/critical.css" as="style">
<link rel="preload" href="/js/app.js" as="script">

<!-- Prefetch Next Pages -->
<link rel="prefetch" href="/technology">
<link rel="prefetch" href="/developers">
```

#### Image Optimization
```html
<!-- Responsive Images with WebP -->
<picture>
  <source srcset="/hero.webp" type="image/webp">
  <source srcset="/hero.jpg" type="image/jpeg">
  <img src="/hero.jpg"
       alt="ROKO Network Temporal Blockchain"
       loading="lazy"
       width="1920"
       height="1080">
</picture>
```

### Monitoring & Analytics

#### Core Web Vitals Tracking
```javascript
// web-vitals.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to Google Analytics
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    event_category: 'Web Vitals',
    event_label: metric.id,
    non_interaction: true,
  });

  // Send to custom monitoring
  fetch('/api/metrics', {
    method: 'POST',
    body: JSON.stringify(metric),
    headers: { 'Content-Type': 'application/json' }
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (unit, integration, e2e)
- [ ] Lighthouse score > 95
- [ ] Bundle size under limits
- [ ] Security audit passed
- [ ] Accessibility audit passed
- [ ] SEO checklist complete
- [ ] Content reviewed and approved
- [ ] Legal/compliance review
- [ ] Performance budget validated

### Deployment
- [ ] DNS configured correctly
- [ ] SSL certificates valid
- [ ] CDN configured
- [ ] Monitoring enabled
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Backup created
- [ ] Rollback plan ready

### Post-Deployment
- [ ] Smoke tests passed
- [ ] Core Web Vitals monitored
- [ ] 404 errors checked
- [ ] Search Console verified
- [ ] Social media cards tested
- [ ] Mobile experience verified
- [ ] Cross-browser testing complete
- [ ] Team notified

## Conclusion

This specification provides a complete blueprint for building a high-performance, SEO-optimized, and fully tested ROKO marketing site with enterprise-grade CI/CD pipeline. The focus on small bundle sizes, pre-compilation, and static delivery ensures optimal performance while maintaining rich functionality through progressive enhancement.
