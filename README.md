# 🚀 MAX LOYALTY - Loyalty Management Platform

> A modern, production-ready loyalty management system for restaurants with real-time updates, analytics, and multi-role support.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff)](https://vitejs.dev/)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Core Features
- 🔐 **JWT Authentication** - Secure token-based authentication with refresh tokens
- 👥 **Role-Based Access Control (RBAC)** - Multi-role support (Admin, Restaurant, Cashier, Guest)
- 📊 **Real-Time Analytics** - Live dashboards with Socket.IO integration
- 💳 **Points Management** - Create, track, and redeem loyalty points
- 🏪 **Multi-Restaurant Support** - Manage multiple restaurants from single dashboard
- 🔔 **Push Notifications** - Desktop and in-app notifications
- 📱 **PWA Support** - Progressive Web App capabilities
- 🌍 **Telegram Bot Integration** - Interact via Telegram
- 📝 **Audit Logging** - Track all user actions
- 🛡️ **Error Tracking** - Sentry integration for error monitoring

### Pages & Functionality
- ✅ Admin Dashboard - System overview and controls
- ✅ Restaurants Management - CRUD operations for restaurants
- ✅ Guests Management - Guest profiles and history
- ✅ Points Operations - Create and manage point operations
- ✅ Billing Management - Invoice and payment tracking
- ✅ Analytics Page - Comprehensive analytics and reports
- ✅ Scan Card - QR code scanning for point operations
- ✅ Guest Settings - Profile and preference management
- ✅ Audit Logs - System activity tracking
- ✅ Support Tickets - Customer support management
- ✅ System Settings - Admin configuration

---

## 🛠 Tech Stack

### Frontend
- **React 18.2** - UI library
- **TypeScript 5.3** - Type safety
- **Vite 5.0** - Build tool
- **React Router v6** - Routing
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **Chart.js** - Data visualization
- **React Hot Toast** - Notifications

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Vitest** - Unit testing
- **Cypress** - E2E testing
- **TypeScript** - Type checking

### Services & Integration
- **Sentry** - Error tracking
- **Mixpanel** - Analytics
- **Telegram Bot API** - Chat integration
- **Dexie** - IndexedDB wrapper (offline support)
- **PWA Plugin** - Progressive Web App

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 16.x or higher
- **npm** 8.x or higher
- **Git** 2.x or higher

### Quick Start

#### Option 1: Using Quick Start Scripts

**Linux/Mac:**
```bash
chmod +x quick-start.sh
./quick-start.sh
```

**Windows:**
```bash
.\quick-start.bat
```

#### Option 2: Manual Setup

1. **Clone the repository**
```bash
git clone https://github.com/Romslav/max-loyalty.git
cd max-loyalty
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### First Login

Default demo credentials (development only):
```
Email: admin@example.com
Password: admin123

Email: restaurant@example.com
Password: restaurant123

Email: cashier@example.com
Password: cashier123

Email: guest@example.com
Password: guest123
```

> ⚠️ Change these credentials in production!

---

## 📁 Project Structure

```
max-loyalty/
├── src/
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin pages
│   │   ├── restaurant/     # Restaurant pages
│   │   ├── cashier/        # Cashier pages
│   │   ├── guest/          # Guest pages
│   │   └── ...             # Shared pages
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Common components (Button, Input, etc.)
│   │   └── ...             # Feature-specific components
│   ├── services/           # API and service layer
│   │   ├── api.ts          # Axios configuration
│   │   ├── errorService.ts # Error handling
│   │   ├── logger.ts       # Logging service
│   │   └── ...             # Domain services
│   ├── stores/             # Zustand state management
│   │   ├── authStore.ts    # Authentication state
│   │   └── ...             # Feature stores
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── schemas/            # Zod validation schemas
│   ├── types/              # TypeScript type definitions
│   ├── router/             # Route configuration
│   ├── config/             # App configuration
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── tests/                  # Test files
├── cypress/                # E2E tests
├── public/                 # Static assets
├── docs/                   # Documentation
├── .env.example            # Environment variables template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── package.json            # Dependencies
└── README.md               # This file
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local` from `.env.example` and configure:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# Application
VITE_APP_NAME=Max Loyalty
VITE_APP_VERSION=4.0.0
VITE_ENVIRONMENT=development

# Auth
VITE_JWT_ALGORITHM=HS256
VITE_TOKEN_EXPIRY=3600000  # 1 hour in ms

# Sentry
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
VITE_SENTRY_ENVIRONMENT=development

# WebSocket
VITE_WS_URL=ws://localhost:3000
VITE_WS_RECONNECT_INTERVAL=5000

# Telegram Bot
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
VITE_TELEGRAM_WEBHOOK_URL=https://yourdomain.com/api/webhook/telegram

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PUSH_NOTIFICATIONS=true
VITE_ENABLE_OFFLINE_MODE=false

# Logging
VITE_LOG_LEVEL=info
VITE_LOG_TO_CONSOLE=true
VITE_LOG_TO_SENTRY=false
```

### Role-Based Access Control

Roles and their permissions:

**Admin**
- Full system access
- User management
- Restaurant management
- Analytics access
- Audit logs
- System settings

**Restaurant**
- Manage own restaurant
- View guest list
- View analytics
- Manage staff

**Cashier**
- View guest information
- Create point operations
- Process payments

**Guest**
- View own profile
- View points balance
- View operation history
- Manage settings

---

## 🔨 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run unit tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Analyze bundle size
npm run analyze
```

### Code Style

This project uses:
- **ESLint** for linting
- **Prettier** for formatting
- **TypeScript** for type safety

Pre-commit hooks (via Husky) automatically lint and format staged files.

### Git Workflow

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit: `git commit -m "feat: add new feature"`
3. Push to origin: `git push origin feature/feature-name`
4. Create pull request
5. Merge after review

---

## 🧪 Testing

### Unit Tests

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Generate coverage
npm run test:coverage
```

Test files are located in `src/__tests__/` or `tests/`

### E2E Tests

```bash
# Run Cypress tests
npx cypress open

# Run tests in headless mode
npx cypress run
```

E2E tests are in `cypress/` directory

### Coverage Goals

- Services: 90%+
- Components: 80%+
- Stores: 85%+
- Overall: 85%+

---

## 📦 Deployment

### Production Build

```bash
# Build for production
npm run build

# This creates an optimized build in `dist/` directory
```

### Docker Deployment

```bash
# Build Docker image
docker build -t max-loyalty:latest .

# Run container
docker run -p 80:3000 max-loyalty:latest
```

### Environment-specific Configuration

**Development**
```
VITE_ENVIRONMENT=development
VITE_API_URL=http://localhost:3000/api
VITE_LOG_TO_SENTRY=false
```

**Staging**
```
VITE_ENVIRONMENT=staging
VITE_API_URL=https://staging-api.example.com/api
VITE_LOG_TO_SENTRY=true
VITE_SENTRY_DSN=<your-sentry-staging-dsn>
```

**Production**
```
VITE_ENVIRONMENT=production
VITE_API_URL=https://api.example.com/api
VITE_LOG_TO_SENTRY=true
VITE_SENTRY_DSN=<your-sentry-production-dsn>
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guide.

---

## 🏗️ Architecture

### State Management (Zustand)

```typescript
// Store example
const useAuthStore = create((set) => ({
  user: null,
  token: null,
  login: async (credentials) => { /* ... */ },
  logout: () => { /* ... */ },
}))
```

### API Layer

```typescript
// Interceptors handle:
// - Adding auth tokens
// - Error handling
// - Token refresh
// - Logging
```

### Error Handling

```typescript
// Centralized error handling
// - HTTP error codes mapping
// - User-friendly messages
// - Sentry integration
// - Toast notifications
```

### Real-Time Communication

```typescript
// Socket.IO events:
// - guests:updated
// - operations:completed
// - restaurants:stats:updated
// - messages:new
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Commit Message Format

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Build/config

---

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [Roadmap](./ROADMAP.md) - Project roadmap
- [Deployment Guide](./DEPLOYMENT.md) - Deployment instructions
- [Code Audit](./CODE_AUDIT_AND_FIXES.md) - Code audit findings
- [API Documentation](./docs/) - API reference

---

## 🐛 Known Issues

None currently. Please report issues via GitHub Issues.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support, email support@example.com or open an issue on GitHub.

---

## 🙏 Acknowledgments

- React team for the amazing library
- Vite for the incredible build tool
- All open-source contributors

---

**Made with ❤️ by Romslav** 🚀

Last updated: January 19, 2026