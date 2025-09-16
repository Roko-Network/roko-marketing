import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// import { compression } from 'vite-plugin-compression2';
// import { VitePWA } from 'vite-plugin-pwa';
// import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

// Enhanced configuration with environment support
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  const isDevelopment = mode === 'development';

  const config = {
    plugins: [
      react({
        // Use SWC for faster builds and better performance
        jsxRuntime: 'automatic',
        babel: isProduction ? {
          plugins: [
            // Remove console.log in production
            ['babel-plugin-transform-remove-console']
          ]
        } : undefined
      }),
      // compression({
      //   algorithm: 'brotliCompress',
      //   exclude: [/\.(br)$/, /\.(gz)$/],
      //   threshold: 1024,
      //   compressionOptions: {
      //     level: 11 // Maximum compression
      //   }
      // }),
      // PWA and compression disabled for now to fix core issues
      // VitePWA({ ... }),
      // visualizer({ ... })

      // Performance monitoring
      ...(isDevelopment ? [
        // Add development-specific plugins here
      ] : [])
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@types': path.resolve(__dirname, './src/types'),
        '@config': path.resolve(__dirname, './src/config'),
        '@lib': path.resolve(__dirname, './src/lib'),
        '@services': path.resolve(__dirname, './src/services'),
        '@store': path.resolve(__dirname, './src/store'),
        '@tests': path.resolve(__dirname, './tests'),
        // Fix for ua-parser-js export issue
        'ua-parser-js': 'ua-parser-js/dist/ua-parser.min.js'
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
          manualChunks: {
            // Keep React in its own chunk to prevent undefined errors
            'vendor-react': ['react', 'react-dom'],
            'vendor-router': ['react-router-dom'],
            'vendor-3d': ['three', '@react-three/fiber', '@react-three/drei', '@react-spring/three'],
            'vendor-animation': ['framer-motion'],
            'vendor-charts': ['recharts'],
            'vendor-state': ['zustand', '@tanstack/react-query'],
            'vendor-utils': ['clsx', 'web-vitals', 'react-intersection-observer']
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
        // Ensure proper externalization
        external: []
      },
      reportCompressedSize: true,
      chunkSizeWarningLimit: 50, // 50KB limit for optimal performance
      cssCodeSplit: true,
      cssMinify: 'lightningcss', // Faster CSS minification
      sourcemap: isProduction ? 'hidden' : 'inline', // Hidden sourcemaps for prod debugging
      assetsInlineLimit: 4096, // Inline small assets
      emptyOutDir: true,
      // Performance optimizations
      modulePreload: {
        polyfill: false // Reduce bundle size by skipping polyfill
      }
    },
    server: {
      port: 5173,
      strictPort: true,
      host: true,
      cors: true,
      hmr: {
        overlay: true
      },
      fs: {
        // Restrict file system access to prevent errors from external directories
        strict: true,
        // Allow serving files from these directories
        allow: [
          '..',
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'public')
        ]
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
        'web-vitals',
        'clsx',
        'react-intersection-observer'
      ],
      exclude: [
        // Exclude external project directories
        'roko-info-site',
        'roko_network', 
        'nexus-marketing',
        'awesome-claude-code-subagents'
      ],
      // Enable dependency pre-bundling optimizations
      force: false,
      // Optimize for ESM
      esbuildOptions: {
        target: 'es2020'
      }
    },

    // Experimental features for better performance
    experimental: {
      renderBuiltUrl(filename, { hostType }) {
        if (hostType === 'js') {
          // Use relative URLs for better CDN support
          return { relative: true };
        }
        return { relative: true };
      }
    },

    // CSS preprocessing optimizations
    css: {
      devSourcemap: isDevelopment,
      lightningcss: {
        targets: {
          chrome: 87,
          firefox: 78,
          safari: 14,
          edge: 88
        }
      },
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: isProduction ? '[hash:base64:8]' : '[name]__[local]___[hash:base64:5]'
      }
    },
    // Define for environment variables
    define: {
      __DEV__: isDevelopment,
      __PROD__: isProduction,
      __VERSION__: JSON.stringify(env.npm_package_version || '0.1.0'),
      // Ensure React is properly defined in production
      'process.env.NODE_ENV': JSON.stringify(mode)
    }
  };

  return config;
});