# ROKO Marketing Site

The official marketing website for ROKO Network - The Temporal Layer for Web3.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Roko-Network/roko-marketing.git
cd roko-marketing

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to see the application.

## 📁 Project Structure

```
roko-marketing/
├── .github/              # GitHub Actions CI/CD workflows
├── docs/                 # Project documentation
│   ├── INITIAL_SPEC.md
│   ├── PROJECT_GOVERNANCE.md
│   ├── REQUIREMENTS_SPECIFICATION.md
│   └── ROKO_FRONTEND_PLAN.md
├── src/                  # Source code
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript definitions
│   ├── utils/           # Utility functions
│   └── constants/       # Constants and config
├── tests/               # Test suites
│   ├── unit/           # Unit tests
│   ├── e2e/            # End-to-end tests
│   └── setup.ts        # Test configuration
├── public/              # Static assets
└── dist/               # Production build

```

## 🧪 Testing

### Test-Driven Development (TDD)

This project follows TDD practices. Write tests before implementing features.

```bash
# Run all tests
npm test

# Run unit tests with coverage
npm run test:unit

# Run E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test -- --watch

# Run accessibility tests
npm run test:a11y
```

### Test Coverage Requirements

- **Minimum Coverage**: 80% for all metrics
- **Critical Paths**: 100% coverage required
- **Performance**: Tests must complete in < 10s

## 📝 Development Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format with Prettier
npm run type-check      # TypeScript checking

# Testing
npm test                # Run Vitest
npm run test:unit       # Unit tests with coverage
npm run test:e2e        # Playwright E2E tests
npm run test:a11y       # Accessibility tests
npm run test:visual     # Percy visual tests

# Performance
npm run size            # Check bundle size
npm run size:why        # Analyze bundle
npm run lighthouse      # Run Lighthouse audit

# Documentation
npm run storybook       # Start Storybook
npm run build:storybook # Build Storybook
```

## 🏗️ Architecture

### Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS + CSS Modules
- **Animation**: Framer Motion
- **3D Graphics**: Three.js + React Three Fiber
- **Charts**: Recharts
- **Testing**: Vitest + Playwright
- **Documentation**: Storybook

### Performance Requirements

- **Initial Bundle**: < 50KB gzipped
- **LCP**: < 2.5 seconds
- **INP**: < 200ms
- **CLS**: < 0.1
- **Lighthouse Score**: > 95

### Accessibility Standards

- **WCAG 2.2 Level AA** compliance
- Full keyboard navigation
- Screen reader support
- Reduced motion support

## 🔒 Security

### Content Security Policy

```javascript
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.roko.network wss://ws.roko.network;
```

### Security Scanning

- Automated dependency scanning with Snyk
- OWASP dependency check in CI/CD
- CodeQL analysis for vulnerabilities

## 🚢 Deployment

### Environments

- **Development**: http://localhost:5173
- **Preview**: https://pr-*.roko-preview.dev
- **Staging**: https://staging.roko.network
- **Production**: https://roko.network

### CI/CD Pipeline

The project uses GitHub Actions for automated testing and deployment:

1. **Quality Checks**: Linting, formatting, type checking
2. **Build & Test**: Unit tests, coverage reporting
3. **Performance**: Lighthouse CI, bundle analysis
4. **E2E Testing**: Cross-browser testing
5. **Security**: Vulnerability scanning
6. **Deployment**: Automated to Cloudflare Pages & AWS

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist/

# Deploy to AWS S3
aws s3 sync dist/ s3://roko-marketing --delete
aws cloudfront create-invalidation --distribution-id ABCDEF --paths "/*"
```

## 📊 Monitoring

### Performance Monitoring

- Core Web Vitals tracking
- Real User Monitoring (RUM)
- Error tracking with Sentry
- Analytics with Google Analytics 4

### Health Checks

- Uptime monitoring
- SSL certificate monitoring
- DNS resolution checks
- API endpoint monitoring

## 🤝 Contributing

### Development Workflow

1. Create feature branch from `develop`
2. Write tests first (TDD)
3. Implement feature
4. Ensure all tests pass
5. Submit PR with description
6. Wait for review and CI checks

### Code Standards

- Follow ESLint configuration
- Use Prettier for formatting
- Write JSDoc comments for public APIs
- Keep functions under 50 lines
- Maintain < 10 cyclomatic complexity

### Commit Convention

```
<type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
```

Example: `feat(hero): add animated timeline visualization`

## 📚 Documentation

- [Initial Specification](docs/INITIAL_SPEC.md)
- [Frontend Plan](docs/ROKO_FRONTEND_PLAN.md)
- [Requirements Specification](docs/REQUIREMENTS_SPECIFICATION.md)
- [Project Governance](docs/PROJECT_GOVERNANCE.md)

## 🆘 Support

- **Documentation**: [docs.roko.network](https://docs.roko.network)
- **Discord**: [discord.gg/roko](https://discord.gg/roko)
- **GitHub Issues**: [Report bugs](https://github.com/Roko-Network/roko-marketing/issues)

## 📄 License

Copyright © 2025 ROKO Network. All rights reserved.

---

Built with precision timing ⏱️ by the ROKO team