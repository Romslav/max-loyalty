# Max Loyalty - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# 1. Clone repository
git clone https://github.com/Romslav/max-loyalty.git
cd max-loyalty

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# 4. Setup Git hooks (Husky)
npm run prepare
```

### Development

```bash
# Start development server
npm run dev
# Open http://localhost:5173

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Analyze bundle size
npm run analyze
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and update:

```env
# API
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# Sentry (Error Tracking)
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
VITE_SENTRY_ENVIRONMENT=development

# WebSocket
VITE_WS_URL=ws://localhost:3000
VITE_WS_RECONNECT_INTERVAL=5000
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Generate coverage report
npm run test:coverage
```

## 🐛 Debugging

### Browser DevTools
- Open DevTools (F12)
- Console: View application logs
- Network: Inspect API calls
- Application: Check stored auth tokens

### Sentry Dashboard
- Monitor errors in production
- View performance metrics
- Track user sessions

## 📋 Project Structure

```
src/
├── components/         # React components
│   ├── ProtectedRoute.tsx
│   ├── CanAccess.tsx
│   ├── ErrorBoundary.tsx
│   └── ...
├── pages/              # Page components
├── stores/             # Zustand stores
├── services/           # API & utility services
│   ├── api.ts         # Axios instance
│   ├── errorService.ts
│   ├── loggerService.ts
│   ├── realtimeService.ts
│   └── ...
├── hooks/              # Custom React hooks
│   ├── usePermissions.ts
│   ├── useRealtime.ts
│   └── ...
├── types/              # TypeScript definitions
├── config/             # Configuration files
│   └── sentry.ts
└── main.tsx            # Application entry point
```

## 🔐 Security Features

✅ JWT Authentication with token refresh
✅ Role-Based Access Control (RBAC)
✅ XSS Protection (input sanitization)
✅ CSRF Protection
✅ Error tracking with Sentry
✅ Secure token storage
✅ API request interceptors
✅ Sensitive data logging redaction

## 📊 Monitoring

### Sentry
- Configure in `src/config/sentry.ts`
- Automatic error tracking
- Performance monitoring
- Session replay (on errors)

### Logging
- Use `logger` service from `src/services/loggerService.ts`
- Dev: logs to console
- Prod: logs to Sentry

```typescript
import { logger } from '@/services/loggerService';

logger.info('User logged in', { userId: 123 });
logger.error('API call failed', error);
```

## 🚢 Deployment

### Pre-deployment Checklist

```bash
# 1. Type checking
npm run type-check

# 2. Linting
npm run lint

# 3. Testing
npm run test

# 4. Build
npm run build

# 5. Security audit
npm audit
```

### Production Environment Variables

Set these in your deployment platform:
- `VITE_API_URL` - Production API URL
- `VITE_SENTRY_DSN` - Sentry production DSN
- `VITE_SENTRY_ENVIRONMENT` - production
- `VITE_WS_URL` - Production WebSocket URL

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Tests Fail
```bash
# Clear test cache
rm -rf .vitest
npm run test
```

### Type Errors
```bash
# Check TypeScript
npm run type-check

# Update all type definitions
npm install --save-dev @types/node@latest
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Sentry Documentation](https://docs.sentry.io)
- [Socket.IO Documentation](https://socket.io/docs)

## 📝 Git Workflow

Git hooks are configured to run before commits:
- Type checking (`tsc --noEmit`)
- Linting (`eslint --fix`)
- Formatting (`prettier --write`)

If hooks fail, fix the errors and try committing again:
```bash
npm run lint:fix
npm run format
git add .
git commit -m "fix: description"
```

## 📞 Support

For issues or questions:
1. Check the documentation
2. Search GitHub issues
3. Create a new GitHub issue with:
   - Description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment info (Node version, OS, etc.)

---

**Last Updated:** January 19, 2026
**Version:** 4.0.0