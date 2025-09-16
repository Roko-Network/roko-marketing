/**
 * @fileoverview Comprehensive test utilities for ROKO Network marketing website
 * @author ROKO QA Team
 * @version 1.0.0
 */

import * as React from 'react';
import type { ReactElement, ReactNode } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import type { UserEvent } from '@testing-library/user-event';

// Test data and fixtures
export const testData = {
  users: {
    alice: {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1' as `0x${string}`,
      balance: '1000000000000000000000', // 1000 ETH in wei
      pwROKO: '500000000000000000000', // 500 ROKO in wei
      ensName: 'alice.eth'
    },
    bob: {
      address: '0x8ba1f109551bD432803012645Hac136c60143d0' as `0x${string}`,
      balance: '500000000000000000000', // 500 ETH in wei
      pwROKO: '250000000000000000000', // 250 ROKO in wei
      ensName: null
    }
  },
  proposals: [
    {
      id: 1,
      title: 'Increase staking rewards',
      description: 'Proposal to increase staking rewards from 5% to 7% APY',
      status: 'active' as const,
      votes: { for: BigInt(1000), against: BigInt(200) },
      startTime: Date.now() - 86400000, // 1 day ago
      endTime: Date.now() + 86400000 * 6, // 6 days from now
      creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1'
    },
    {
      id: 2,
      title: 'Network upgrade proposal',
      description: 'Proposal for network upgrade to improve performance',
      status: 'pending' as const,
      votes: { for: BigInt(0), against: BigInt(0) },
      startTime: Date.now() + 86400000, // 1 day from now
      endTime: Date.now() + 86400000 * 7, // 7 days from now
      creator: '0x8ba1f109551bD432803012645Hac136c60143d0'
    }
  ],
  transactions: [
    {
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      status: 'success' as const,
      type: 'stake',
      amount: '100000000000000000000', // 100 ROKO
      timestamp: Date.now() - 3600000 // 1 hour ago
    }
  ]
};

// Query client for React Query
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Custom render function with all providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  queryClient?: QueryClient;
  user?: UserEvent;
}

interface AllTheProvidersProps {
  children: ReactNode;
  initialEntries?: string[];
  queryClient?: QueryClient;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({
  children,
  initialEntries = ['/'],
  queryClient = createTestQueryClient(),
}) => {
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(
      MemoryRouter,
      { initialEntries },
      children
    )
  );
};

export const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult & { user: ReturnType<typeof userEvent.setup> } => {
  const {
    initialEntries,
    queryClient,
    user = userEvent.setup(),
    ...renderOptions
  } = options;

  const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) =>
    React.createElement(AllTheProviders, {
      initialEntries,
      queryClient,
      children
    });

  return {
    user,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };

// Mock data factories
export const createMockProposal = (overrides: Partial<typeof testData.proposals[0]> = {}) => ({
  ...testData.proposals[0],
  ...overrides,
});

export const createMockTransaction = (overrides: Partial<typeof testData.transactions[0]> = {}) => ({
  ...testData.transactions[0],
  ...overrides,
});

export const createMockUser = (overrides: Partial<typeof testData.users.alice> = {}) => ({
  ...testData.users.alice,
  ...overrides,
});

// Test helpers for animations and performance
export const waitForAnimation = (duration = 1000) =>
  new Promise((resolve) => setTimeout(resolve, duration));

export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });
  window.IntersectionObserver = mockIntersectionObserver;
  return mockIntersectionObserver;
};

export const mockResizeObserver = () => {
  const mockResizeObserver = vi.fn();
  mockResizeObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });
  window.ResizeObserver = mockResizeObserver;
  return mockResizeObserver;
};

// Accessibility testing utilities
export const mockAxeCore = () => {
  return vi.fn().mockResolvedValue({
    violations: [],
    passes: [],
    incomplete: [],
    inapplicable: [],
  });
};

// Performance testing utilities
export const mockWebVitals = () => {
  const mockCLS = vi.fn();
  const mockFCP = vi.fn();
  const mockFID = vi.fn();
  const mockINP = vi.fn();
  const mockLCP = vi.fn();
  const mockTTFB = vi.fn();

  return {
    getCLS: mockCLS,
    getFCP: mockFCP,
    getFID: mockFID,
    getINP: mockINP,
    getLCP: mockLCP,
    getTTFB: mockTTFB,
  };
};

// Error boundary testing
export class TestErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Test Error Boundary caught an error:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback || React.createElement('div', 
        { 'data-testid': 'error-boundary' }, 
        'Something went wrong.'
      );
    }

    return this.props.children;
  }
}

// Custom test matchers (extend expect)
declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toHaveAccessibleName(name: string): T;
      toBeInTheViewport(): T;
      toHaveLoadedWithoutErrors(): T;
    }
  }
}

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    length: Object.keys(store).length,
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
};

// Mock sessionStorage
export const mockSessionStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    length: Object.keys(store).length,
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
};

// Mock fetch for API testing
export const mockFetch = (response: any, status = 200) => {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(response),
    text: vi.fn().mockResolvedValue(JSON.stringify(response)),
    headers: new Headers(),
    redirected: false,
    statusText: 'OK',
    type: 'basic',
    url: '',
  });
};

// Cleanup utilities
export const cleanupMocks = () => {
  vi.clearAllMocks();
  vi.resetAllMocks();
  vi.restoreAllMocks();
};

// Test environment setup
export const setupTestEnvironment = () => {
  // Mock console methods to avoid noise in tests
  const originalError = console.error;
  console.error = vi.fn((message, ...args) => {
    // Still log real errors but filter out React warnings in tests
    if (typeof message === 'string' && message.includes('Warning:')) {
      return;
    }
    originalError(message, ...args);
  });

  // Setup global mocks
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage(),
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage(),
  });

  mockIntersectionObserver();
  mockResizeObserver();

  return () => {
    console.error = originalError;
    cleanupMocks();
  };
};

// Export default render as named export for convenience
export default customRender;