/**
 * Vite Configuration for Production Optimization
 * - Code splitting per route
 * - Lazy loading
 * - Minification
 * - Compression
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    // Bundle analysis
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
    // Compression plugin
    compression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],

  build: {
    // Target
    target: 'esnext',
    minify: 'terser',

    // Optimization
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },

    // Output options
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: 4096,

    // Chunk size warnings
    chunkSizeWarningLimit: 150,

    // Rollup options for code splitting
    rollupOptions: {
      output: {
        // Main bundle size target: ~100KB
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-state': ['zustand'],
          'vendor-utils': ['axios', 'socket.io-client'],
          'vendor-validation': ['zod'],

          // Feature-specific chunks
          'chunk-auth': [
            'src/pages/auth/LoginPage',
            'src/pages/auth/RegisterPage',
            'src/services/authService',
          ],
          'chunk-admin': [
            'src/pages/AdminDashboard',
            'src/pages/AuditLogs',
            'src/pages/SystemSettings',
          ],
          'chunk-guests': [
            'src/pages/GuestsList',
            'src/services/guestService',
          ],
          'chunk-operations': [
            'src/pages/PointsOperations',
            'src/pages/ScanCard',
            'src/services/operationService',
          ],
          'chunk-analytics': [
            'src/pages/AnalyticsPage',
            'src/services/analyticsService',
          ],

          // Common chunk for utilities
          'chunk-common': [
            'src/services/errorService',
            'src/services/loggerService',
            'src/utils/toast',
          ],
        },

        // Optimize chunk naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop().split('.')[0]
            : 'chunk'
          return `js/[name]-[hash].js`
        },

        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`
          } else if (/woff|woff2|ttf|otf|eot/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`
          } else if (ext === 'css') {
            return `css/[name]-[hash][extname]`
          }
          return `[name]-[hash][extname]`
        },
      },
    },
  },

  // Optimization hints
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'axios',
      'zod',
      'socket.io-client',
    ],
  },

  // Server
  server: {
    middlewareMode: false,
    hmr: {
      host: 'localhost',
      port: 5173,
    },
  },
})
