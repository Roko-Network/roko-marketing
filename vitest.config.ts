import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    exclude: [
      'node_modules/',
      'dist/',
      '.git/',
      '.next/',
      'coverage/',
      '**/*.d.ts',
      '**/coverage/**',
      '**/*.config.{js,ts}',
      '**/playwright.config.ts',
      '**/e2e/**'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'text-summary'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.ts',
        '*.config.js',
        '.eslintrc.cjs',
        'dist/',
        'coverage/',
        'src/types/',
        '**/*.d.ts',
        '**/*.stories.tsx',
        '**/index.ts',
        'src/test-utils.ts',
        '**/mocks/**',
        '**/__tests__/**',
        '**/fixtures/**',
        'src/assets/**',
        'public/**',
        '.storybook/**',
        'storybook-static/**'
      ],
      include: [
        'src/**/*.{js,jsx,ts,tsx}'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
        perFile: true
      },
      all: true,
      clean: true,
      skipFull: false
    },
    css: {
      modules: {
        classNameStrategy: 'non-scoped'
      }
    },
    isolate: true,
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true,
        useAtomics: true
      }
    },
    reporters: [
      'verbose',
      'html',
      'json',
      ['junit', { outputFile: './coverage/junit.xml' }]
    ],
    outputFile: {
      html: './coverage/vitest-report.html',
      json: './coverage/vitest-results.json'
    },
    testTimeout: 15000,
    hookTimeout: 15000,
    teardownTimeout: 5000,
    retry: 2,
    bail: 0,
    passWithNoTests: false,
    logHeapUsage: true,
    experimentalVmThreads: true,
    typecheck: {
      enabled: true,
      tsconfig: './tsconfig.json'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@types': path.resolve(__dirname, './src/types'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@services': path.resolve(__dirname, './src/services'),
      '@tests': path.resolve(__dirname, './tests'),
      '@mocks': path.resolve(__dirname, './tests/mocks'),
      '@fixtures': path.resolve(__dirname, './tests/fixtures')
    }
  },
  esbuild: {
    target: 'node18'
  },
  define: {
    __TEST__: true
  }
});
