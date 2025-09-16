# ROKO Network Testing Framework

## Overview

This document outlines the comprehensive testing framework implemented for the ROKO Network marketing website. Our testing strategy ensures high code quality, reliability, and user experience across all components and user journeys.

## Testing Strategy

### Quality Standards
- **Minimum Test Coverage**: 80%
- **Accessibility Compliance**: WCAG 2.2 Level AA
- **Performance Budget**: Core Web Vitals targets
- **Cross-browser Support**: Chrome, Firefox, Safari
- **Responsive Design**: Mobile, tablet, desktop

### Test Pyramid

```
    E2E Tests (Critical User Journeys)
         /\
        /  \
   Integration Tests (Component Interactions)
      /\
     /  \
Unit Tests (Components, Hooks, Utils)
```

## Test Types

### 1. Unit Tests (`src/**/*.test.tsx`)
- **Framework**: Vitest + React Testing Library
- **Coverage**: Components, hooks, utilities
- **Location**: Co-located with source files
- **Command**: `npm run test:unit`

**Example Test Structure**:
```typescript
describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<Component onClick={mockHandler} />);
    await user.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalled();
  });

  it('should be accessible', async () => {
    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 2. Integration Tests (`src/__tests__/integration/`)
- **Framework**: Vitest + React Testing Library
- **Coverage**: Component interactions, data flow
- **Focus**: Wallet connections, navigation flows
- **Command**: `npm run test:integration`

### 3. E2E Tests (`tests/e2e/`)
- **Framework**: Playwright
- **Coverage**: Critical user journeys
- **Browsers**: Chromium, Firefox, WebKit
- **Command**: `npm run test:e2e`

**Test Scenarios**:
- Homepage load and interaction
- Wallet connection flows
- Navigation between pages
- Mobile responsive behavior
- Accessibility compliance
- Performance metrics

### 4. Visual Regression Tests
- **Framework**: Percy (with Playwright)
- **Coverage**: Component appearance
- **Viewports**: Mobile, tablet, desktop
- **Command**: `npm run test:visual`

### 5. Accessibility Tests
- **Framework**: Pa11y, axe-core
- **Standard**: WCAG 2.2 Level AA
- **Coverage**: All pages and components
- **Command**: `npm run test:a11y`

### 6. Performance Tests
- **Framework**: Lighthouse CI
- **Metrics**: Core Web Vitals (LCP, INP, CLS)
- **Budget**: Performance budgets defined
- **Command**: `npm run perf:lighthouse`

## Test Configuration

### Vitest Configuration (`vitest.config.ts`)
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
        perFile: true
      }
    }
  }
});
```

### Playwright Configuration (`playwright.config.ts`)
```typescript
export default defineConfig({
  testDir: './tests/e2e',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } }
  ]
});
```

## Test Utilities (`src/test-utils.ts`)

### Custom Render Function
```typescript
export const render = (ui: ReactElement, options?: CustomRenderOptions) => {
  const Wrapper = ({ children }) => (
    <WagmiProvider config={testWagmiConfig}>
      <QueryClientProvider client={createTestQueryClient()}>
        <RainbowKitProvider>
          <MemoryRouter>
            {children}
          </MemoryRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );

  return {
    user: userEvent.setup(),
    ...renderRTL(ui, { wrapper: Wrapper, ...options })
  };
};
```

### Mock Data
```typescript
export const testData = {
  users: {
    alice: {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      balance: '1000000000000000000000',
      pwROKO: '500000000000000000000',
      ensName: 'alice.eth'
    }
  },
  proposals: [
    {
      id: 1,
      title: 'Increase staking rewards',
      status: 'active',
      votes: { for: 1000n, against: 200n }
    }
  ]
};
```

## Running Tests

### Development
```bash
# Run all tests in watch mode
npm run test

# Run unit tests with coverage
npm run test:unit

# Run E2E tests with UI
npm run test:e2e:ui

# Run accessibility tests
npm run test:a11y
```

### Comprehensive QA Suite
```bash
# Run complete QA test suite
npm run test:qa

# Generate detailed reports
npm run test:qa -- --report
```

### CI/CD Pipeline
```bash
# Run CI-optimized tests
npm run test:qa:ci
```

## Test Reports

### Coverage Reports
- **HTML Report**: `./coverage/index.html`
- **LCOV**: `./coverage/lcov.info`
- **JSON**: `./coverage/coverage-final.json`

### QA Reports
- **Comprehensive Report**: `./qa-reports/qa-report.html`
- **JSON Data**: `./qa-reports/qa-report.json`
- **Test Results**: `./qa-reports/`

### Performance Reports
- **Lighthouse**: `./lighthouse-report.html`
- **Bundle Analysis**: `./bundle-analyzer-report.html`

## Mocking Strategy

### Web3 Mocking
```typescript
// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: vi.fn(() => ({ 
    address: testData.users.alice.address,
    isConnected: true 
  })),
  useBalance: vi.fn(() => ({ 
    data: { value: BigInt(testData.users.alice.balance) }
  }))
}));
```

### API Mocking
```typescript
// Mock API calls with MSW
const handlers = [
  rest.get('/api/proposals', (req, res, ctx) => {
    return res(ctx.json(testData.proposals));
  })
];

const server = setupServer(...handlers);
```

### 3D Components Mocking
```typescript
// Mock Three.js for testing
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, ...props }) => (
    <div data-testid="three-canvas" {...props}>
      {children}
    </div>
  )
}));
```

## Best Practices

### Test Organization
1. **Co-location**: Unit tests next to source files
2. **Descriptive Names**: Clear test descriptions
3. **AAA Pattern**: Arrange, Act, Assert
4. **Single Responsibility**: One concept per test

### Test Data Management
1. **Factories**: Create test data programmatically
2. **Fixtures**: Reusable test data sets
3. **Isolation**: Tests don't depend on each other
4. **Cleanup**: Reset state between tests

### Accessibility Testing
1. **Automated Checks**: axe-core in every component test
2. **Manual Testing**: Screen reader validation
3. **Keyboard Navigation**: Tab order and interactions
4. **Color Contrast**: Sufficient contrast ratios

### Performance Testing
1. **Core Web Vitals**: LCP, INP, CLS monitoring
2. **Bundle Size**: Track and limit bundle growth
3. **Load Testing**: Simulate realistic user loads
4. **Memory Leaks**: Monitor component cleanup

## Debugging Tests

### Debug Commands
```bash
# Debug unit tests
npm run test:unit -- --reporter=verbose

# Debug E2E tests
npm run test:e2e:debug

# Run tests with UI
npm run test:ui
npm run test:e2e:ui
```

### Debug Configuration
```typescript
// Add to vitest.config.ts for debugging
test: {
  logHeapUsage: true,
  reporters: ['verbose'],
  bail: 1, // Stop on first failure
  retry: 0 // No retries for debugging
}
```

## Continuous Integration

### GitHub Actions Pipeline
- **Code Quality**: Linting, type checking
- **Unit Tests**: All Node.js versions
- **E2E Tests**: All browsers, parallel execution
- **Accessibility**: Pa11y validation
- **Performance**: Lighthouse CI
- **Security**: npm audit, Snyk scanning

### Quality Gates
All tests must pass before merge:
- ✅ 80% test coverage
- ✅ All E2E tests pass
- ✅ No accessibility violations
- ✅ Performance budget met
- ✅ Security scan clean

## Troubleshooting

### Common Issues

**Tests failing in CI but passing locally:**
- Check Node.js version consistency
- Verify environment variables
- Review timing-sensitive tests

**Flaky E2E tests:**
- Add proper wait conditions
- Use `page.waitForLoadState('networkidle')`
- Increase timeouts for slow operations

**Memory issues in tests:**
- Check for memory leaks in components
- Ensure proper cleanup in `afterEach`
- Monitor test isolation

**Coverage gaps:**
- Review excluded files in vitest.config.ts
- Add tests for utility functions
- Test error boundaries and edge cases

## Maintenance

### Regular Tasks
- **Weekly**: Review test coverage reports
- **Monthly**: Update test dependencies
- **Quarterly**: Review and update test strategy
- **Release**: Full QA suite execution

### Metrics Tracking
- Test execution time trends
- Coverage percentage over time
- Flaky test identification
- Performance regression detection

## Contributing

### Writing New Tests
1. Follow existing patterns and conventions
2. Include accessibility tests for new components
3. Add E2E tests for new user journeys
4. Update test documentation

### Code Review Checklist
- [ ] Tests cover happy path and error cases
- [ ] Accessibility tests included
- [ ] Performance impact considered
- [ ] Mock usage appropriate
- [ ] Test descriptions are clear

---

For questions or issues with the testing framework, please contact the QA team or create an issue in the repository.
