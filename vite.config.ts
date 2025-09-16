import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

// Enhanced configuration with environment support
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  const isDevelopment = mode === 'development';

  return {

export default defineConfig({
  plugins: [
    react({
      // Use SWC for faster builds and better performance
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          // Remove console.log in production
          ...(process.env.NODE_ENV === 'production' ? [['babel-plugin-transform-remove-console']] : [])
        ]
      }
    }),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024,
      compressionOptions: {
        level: 11 // Maximum compression
      }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'ROKO Network - The Temporal Layer for Web3',
        short_name: 'ROKO',
        description: 'Build time-sensitive blockchain applications with nanosecond precision. IEEE 1588 PTP-grade synchronization for Web3.',
        theme_color: '#00d4aa', // ROKO teal
        background_color: '#181818', // ROKO dark
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'portrait-primary',
        categories: ['blockchain', 'web3', 'developer-tools'],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2,glb,gltf}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB for 3D models
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.roko\.network\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'roko-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|webp|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /\.(?:glb|gltf|bin)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: '3d-models-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          }
        ],
        // Skip waiting for faster updates
        skipWaiting: true,
        clientsClaim: true
      }
    })
  ],
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
      '@tests': path.resolve(__dirname, './tests')
    }
  },
  build: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        unsafe_arrows: true,
        unsafe_methods: true
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        // Enhanced chunk splitting strategy
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-3d';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-animation';
            }
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts';
            }
            if (id.includes('wagmi') || id.includes('viem') || id.includes('@rainbow-me')) {
              return 'vendor-web3';
            }
            if (id.includes('zustand') || id.includes('@tanstack/react-query')) {
              return 'vendor-state';
            }
            return 'vendor-misc';
          }

          // Feature-based chunks
          if (id.includes('/features/governance/')) {
            return 'feature-governance';
          }
          if (id.includes('/features/validators/')) {
            return 'feature-validators';
          }
          if (id.includes('/features/developers/')) {
            return 'feature-developers';
          }
          if (id.includes('/features/temporal/')) {
            return 'feature-temporal';
          }

          // 3D and shader chunks
          if (id.includes('/three/') || id.includes('.glsl') || id.includes('.vert') || id.includes('.frag')) {
            return 'chunk-3d';
          }
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').pop() || 'asset';
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(extType)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            return `fonts/[name]-[hash][extname]`;
          }
          if (/css/i.test(extType)) {
            return `css/[name]-[hash][extname]`;
          }
          if (/glb|gltf|bin/i.test(extType)) {
            return `models/[name]-[hash][extname]`;
          }
          if (/glsl|vert|frag/i.test(extType)) {
            return `shaders/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        // Optimize chunk loading
        inlineDynamicImports: false,
        preserveModules: false
      },
      // External dependencies for better caching
      external: (id) => {
        // Keep large libraries external for CDN loading if needed
        return false; // For now, bundle everything for better performance
      }
    },
    reportCompressedSize: true,
    chunkSizeWarningLimit: 40, // Reduced from 50KB
    cssCodeSplit: true,
    cssMinify: true,
    sourcemap: process.env.NODE_ENV === 'development' ? 'inline' : false,
    assetsInlineLimit: 4096, // Inline small assets
    emptyOutDir: true
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    cors: true,
    hmr: {
      overlay: true
    },
    // Proxy for development API calls
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/ws': {
        target: 'ws://localhost:3001',
        ws: true,
        changeOrigin: true
      }
    }
  },
  preview: {
    port: 4173,
    strictPort: true,
    host: true,
    cors: true,
    headers: {
      'Cache-Control': 'public, max-age=600' // 10 minutes for preview
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'zustand',
      'web-vitals'
    ],
    exclude: [
      // Exclude large dependencies that should be dynamically imported
      'wagmi',
      'viem',
      '@rainbow-me/rainbowkit'
    ]
  },
  // Define for environment variables
  define: {
    __DEV__: process.env.NODE_ENV === 'development',
    __PROD__: process.env.NODE_ENV === 'production',
    __VERSION__: JSON.stringify(process.env.npm_package_version || '0.1.0')
  }
    // Additional plugins for development and production
    ...(isProduction ? [
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true
      })
    ] : []),

    // Performance monitoring
    ...(isDevelopment ? [
      // Add development-specific plugins here
    ] : [])
  ];

});
});