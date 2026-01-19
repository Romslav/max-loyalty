# 🚀 FIX EXECUTION PLAN - ALL 47 ISSUES

**Estimated Total Time:** 6-8 hours  
**Complexity:** Medium  
**Priority:** CRITICAL  

---

## 📢 PHASE 1: IMMEDIATE FIXES (30 min)

### 1.1: Install Missing Packages

```bash
# Terminal command
npm install zod socket.io-client @sentry/integrations vitest @vitest/coverage-v8 @testing-library/user-event husky lint-staged
```

**Verification:**
```bash
npm list zod socket.io-client @sentry/integrations
```

---

### 1.2: Update package.json Scripts

**Current (WRONG):**
```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint src --ext ts,tsx",
  "type-check": "tsc --noEmit",
  "format": "prettier --write 'src/**/*.{ts,tsx,css}'",
  "analyze": "vite-bundle-visualizer"
}
```

**Replace with:**
```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint src --ext ts,tsx",
  "lint:fix": "eslint src --ext ts,tsx --fix",
  "type-check": "tsc --noEmit",
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage",
  "format": "prettier --write 'src/**/*.{ts,tsx,css}'",
  "format:check": "prettier --check 'src/**/*.{ts,tsx,css}'",
  "analyze": "vite-bundle-visualizer",
  "prepare": "husky install"
}
```

---

## 🖤 PHASE 2: CONFIG FILES (45 min)

### 2.1: Update tsconfig.json (Strict Mode)

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@services/*": ["src/services/*"],
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"],
      "@hooks/*": ["src/hooks/*"],
      "@stores/*": ["src/stores/*"],
      "@schemas/*": ["src/schemas/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"]
    },
    "types": ["vite/client", "vitest/globals"]
  },
  "include": ["src"],
  "exclude": ["node_modules"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

### 2.2: Create .eslintrc.json

**File:** `.eslintrc.json` (new file)

```json
{
  "root": true,
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "ignorePatterns": ["dist", ".eslintrc.cjs"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": ["react-refresh", "@typescript-eslint"],
  "rules": {
    "react-refresh/only-export-components": "warn",
    "@typescript-eslint/explicit-function-return-types": "error",
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-var-requires": "warn",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/jsx-uses-react": "off",
    "react/display-name": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-debugger": "warn"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

---

### 2.3: Create .prettierrc

**File:** `.prettierrc` (new file)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "jsxSingleQuote": false
}
```

---

### 2.4: Create .prettierignore

**File:** `.prettierignore` (new file)

```
node_modules
dist
build
coverage
.git
.next
out
*.lock
```

---

### 2.5: Create vitest.config.ts

**File:** `vitest.config.ts` (new file)

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'json-summary'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
      ],
      lines: 90,
      functions: 90,
      branches: 85,
      statements: 90,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@services': path.resolve(__dirname, './src/services'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@schemas': path.resolve(__dirname, './src/schemas'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
})
```

---

### 2.6: Create .env.example

**File:** `.env.example` (new file)

```bash
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_API_TIMEOUT=30000
VITE_RETRY_ATTEMPTS=3
VITE_RETRY_DELAY=1000

# App Configuration
VITE_APP_NAME=Max Loyalty
VITE_APP_VERSION=4.0.0
VITE_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_REAL_TIME=true
VITE_ENABLE_SENTRY=true

# Sentry Configuration
VITE_SENTRY_DSN=https://your-key@sentry.io/project-id
VITE_SENTRY_ENVIRONMENT=development
VITE_SENTRY_TRACES_SAMPLE_RATE=1.0

# WebSocket Configuration
VITE_WEBSOCKET_URL=ws://localhost:3001
VITE_WEBSOCKET_RECONNECT_INTERVAL=3000
VITE_WEBSOCKET_MAX_RECONNECT_ATTEMPTS=10

# Logging
VITE_LOG_LEVEL=debug
```

**Action:** Copy to `.env` for local development

```bash
cp .env.example .env
```

---

### 2.7: Update vite.config.ts (Optimization)

**File:** `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@services': path.resolve(__dirname, './src/services'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@schemas': path.resolve(__dirname, './src/schemas'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  build: {
    target: 'ES2020',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-state': ['zustand'],
          'vendor-validation': ['zod', 'react-hook-form'],
          'vendor-utils': ['axios', 'date-fns', 'lodash-es'],
          'vendor-ui': ['lucide-react', 'react-hot-toast', 'chart.js', 'react-chartjs-2'],
          'vendor-sentry': ['@sentry/react', '@sentry/tracing'],
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

---

## 🗣️ PHASE 3: CREATE MISSING SOURCE FILES (2 hours)

### 3.1: Create src/types/env.d.ts

**File:** `src/types/env.d.ts` (new file)

```typescript
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_RETRY_ATTEMPTS: string
  readonly VITE_RETRY_DELAY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ENVIRONMENT: 'development' | 'staging' | 'production'
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_NOTIFICATIONS: string
  readonly VITE_ENABLE_REAL_TIME: string
  readonly VITE_ENABLE_SENTRY: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_SENTRY_ENVIRONMENT: string
  readonly VITE_SENTRY_TRACES_SAMPLE_RATE: string
  readonly VITE_WEBSOCKET_URL: string
  readonly VITE_WEBSOCKET_RECONNECT_INTERVAL: string
  readonly VITE_WEBSOCKET_MAX_RECONNECT_ATTEMPTS: string
  readonly VITE_LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export {}
```

---

### 3.2: Create src/services/errorService.ts

**File:** `src/services/errorService.ts` (new file)

```typescript
export interface ApiError {
  code: string
  message: string
  statusCode: number
  details?: Record<string, unknown>
}

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as Record<string, unknown>).message)
  }
  return 'An unknown error occurred'
}

export const getErrorCode = (error: unknown): string => {
  if (error && typeof error === 'object' && 'code' in error) {
    return String((error as Record<string, unknown>).code)
  }
  return ERROR_CODES.UNKNOWN_ERROR
}

export const isRetryable = (statusCode: number): boolean => {
  return [408, 429, 500, 502, 503, 504].includes(statusCode)
}
```

---

### 3.3: Create src/services/axiosInstance.ts

**File:** `src/services/axiosInstance.ts` (new file)

```typescript
import axios from 'axios'
import { authStore } from '@stores/authStore'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
})

// Request interceptor: add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = authStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      authStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
```

---

### 3.4: Create src/components/ErrorBoundary.tsx

**File:** `src/components/ErrorBoundary.tsx` (new file)

```typescript
import React, { ReactNode } from 'react'
import toast from 'react-hot-toast'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo)
    toast.error('Something went wrong. Please try again.')
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-red-50 px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

---

### 3.5: Create src/components/ProtectedRoute.tsx

**File:** `src/components/ProtectedRoute.tsx` (new file)

```typescript
import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'

interface Props {
  children: ReactNode
  requiredRole?: string
}

export const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
```

---

### 3.6: Create src/hooks/usePermissions.ts

**File:** `src/hooks/usePermissions.ts` (new file)

```typescript
import { useAuth } from './useAuth'

const PERMISSIONS: Record<string, string[]> = {
  'user:read': ['admin', 'restaurant', 'cashier'],
  'user:write': ['admin'],
  'user:delete': ['admin'],
  'guest:read': ['admin', 'restaurant', 'cashier', 'guest'],
  'guest:write': ['admin', 'restaurant'],
  'guest:delete': ['admin'],
  'restaurant:read': ['admin', 'restaurant'],
  'restaurant:write': ['admin'],
  'restaurant:delete': ['admin'],
  'analytics:read': ['admin', 'restaurant'],
  'billing:read': ['admin'],
  'billing:write': ['admin'],
  'operations:read': ['admin', 'restaurant', 'cashier'],
  'operations:write': ['admin', 'restaurant', 'cashier'],
}

export const usePermissions = () => {
  const { user } = useAuth()

  const can = (permission: string): boolean => {
    if (!user) return false
    const allowedRoles = PERMISSIONS[permission] || []
    return allowedRoles.includes(user.role)
  }

  const canRead = (resource: string): boolean => can(`${resource}:read`)
  const canWrite = (resource: string): boolean => can(`${resource}:write`)
  const canDelete = (resource: string): boolean => can(`${resource}:delete`)

  return { can, canRead, canWrite, canDelete }
}
```

---

### 3.7: Create src/__tests__/setup.ts

**File:** `src/__tests__/setup.ts` (new file)

```typescript
import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock environment variables
vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_API_URL: 'http://localhost:3001/api',
      VITE_APP_VERSION: '4.0.0',
    },
  },
})
```

---

## 💋 PHASE 4: GIT HOOKS (30 min)

### 4.1: Create .lintstagedrc.json

**File:** `.lintstagedrc.json` (new file)

```json
{
  "src/**/*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "src/**/*.{css,json,md}": [
    "prettier --write"
  ]
}
```

---

### 4.2: Initialize Husky

```bash
# Install and setup husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

# Add pre-push hook
npx husky add .husky/pre-push "npm run type-check && npm run lint && npm run test"
```

---

### 4.3: Create .gitignore Additions

**Append to `.gitignore`:**

```
# Environment
.env
.env.local
.env.*.local

# Testing
.vitest
coverage
.nyc_output

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea
*.swp
*.swo
*~
.DS_Store

# Build
/dist
/build
.turbo
```

---

## ✅ PHASE 5: VERIFICATION (1 hour)

### 5.1: Run All Checks

```bash
# Install dependencies
npm install

# Type checking
npm run type-check
# Expected: 0 errors

# Linting
npm run lint
# Expected: 0 errors

# Format check
npm run format:check
# Expected: All files formatted

# Build
npm run build
# Expected: Build successful, dist/ folder created

# Run tests (if any)
npm run test
# Expected: Tests pass or 0 tests
```

### 5.2: Verification Checklist

```
✅ npm install - All dependencies installed
✅ npm run type-check - 0 TypeScript errors
✅ npm run lint - 0 ESLint errors
✅ npm run format:check - Code properly formatted
✅ npm run build - Build successful
✅ .env file exists and configured
✅ All new files created and properly formatted
✅ Git hooks installed and functional
✅ VSCode shows no errors
✅ No red squiggly lines in imports
```

---

## 📧 FINAL STEPS

### 6.1: Commit Changes

```bash
# Stage all changes
git add .

# This will trigger pre-commit hook
git commit -m "fix: resolve all 47 code audit issues

- Add missing dependencies (zod, socket.io-client, etc.)
- Enable TypeScript strict mode
- Add ESLint and Prettier configuration
- Create test setup with Vitest
- Create missing critical components
- Add environment type safety
- Setup Git hooks with Husky
- Fix build configuration
- Add missing services and utilities"
```

### 6.2: Verify Git Hooks

```bash
# Test pre-commit hook
git add src/App.tsx
git commit -m "test: verify hooks working"

# If hooks block, fix linting issues
npm run lint:fix
npm run format
git add .
git commit -m "fix: format and lint issues from git hooks"
```

---

## 📊 SUMMARY

| Phase | Tasks | Time | Status |
|-------|-------|------|--------|
| 1 | Packages + Scripts | 30 min | 🚀 |  
| 2 | Config Files | 45 min | 🚀 |
| 3 | Source Files | 2 hours | 🚀 |
| 4 | Git Hooks | 30 min | 🚀 |
| 5 | Verification | 1 hour | 🚀 |
| **TOTAL** | **47 Fixes** | **5-6 hours** | **✅ COMPLETE** |

---

**Status: 🚀 READY TO EXECUTE - All steps documented and actionable**

**Next Action: Follow Phase 1 through Phase 5 sequentially**
