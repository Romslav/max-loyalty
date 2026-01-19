# 🚀 MAX LOYALTY - START HERE!

## ⚡ Quick Start (5 minutes)

### 1️⃣ Install Node.js
```bash
# Download from https://nodejs.org (LTS version)
# Then verify:
node --version
npm --version
```

### 2️⃣ Download Project
```bash
git clone https://github.com/Romslav/max-loyalty.git
cd max-loyalty
git checkout feat/auth-system
```

### 3️⃣ Install Dependencies
```bash
npm install
# ⏳ Wait 2-5 minutes
```

### 4️⃣ Start Server
```bash
npm run dev
# You'll see: http://localhost:5173/
```

### 5️⃣ Open Browser
```
http://localhost:5173/login
```

### 6️⃣ Login with Test Account
```
Email:    admin@test.com
Password: admin123
```

**Done! 🎉**

---

## 📖 Documentation

| Document | For What |
|----------|----------|
| **[QUICKSTART.md](./QUICKSTART.md)** | Full step-by-step guide for beginners |
| **[SETUP_AUTH.md](./SETUP_AUTH.md)** | How auth system works + all features |
| **[PROGRESS_TRACKER.md](./PROGRESS_TRACKER.md)** | 24-day roadmap status |
| **[GETTING_STARTED.html](./GETTING_STARTED.html)** | Interactive visual guide (open in browser) |

---

## 🔓 Test Accounts

```
🔑 Admin
   Email: admin@test.com
   Password: admin123

🏠 Restaurant Manager
   Email: restaurant@test.com
   Password: restaurant123

💳 Cashier
   Email: cashier@test.com
   Password: cashier123

👤 Guest
   Email: guest@test.com
   Password: guest123
```

**Or create your own** on registration page!

---

## ✨ What You Get

✅ Production-ready JWT authentication
✅ Protected routes with role-based access
✅ 4 user roles (Admin, Restaurant, Cashier, Guest)  
✅ User registration & login
✅ Modern UI with Tailwind CSS
✅ Local data persistence
✅ Mock API (no backend needed)
✅ Full documentation

---

## 🆘 Help

**Issue:** "command not found: npm"
- Make sure Node.js is installed: https://nodejs.org

**Issue:** "Port 5173 is already in use"
- Use different port: `npm run dev -- --port 5174`

**Issue:** Page won't load
- Check if terminal shows: `Local: http://localhost:5173/`
- Keep terminal open while running

**More help:** See [QUICKSTART.md](./QUICKSTART.md) troubleshooting section

---

## 📁 Project Structure

```
src/
├── pages/              # UI Pages
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── DashboardPage.tsx
├── components/         # React Components
│   └── ProtectedRoute.tsx
├── services/          # Backend APIs
│   ├── authService.ts
│   ├── apiClient.ts
│   └── mockAuthService.ts
├── hooks/             # React Hooks
│   └── useAuth.ts
├── stores/            # State Management
│   └── authStore.ts
├── router/            # Routing
│   └── index.tsx
└── App.tsx            # Main App
```

---

## 🎯 Features

### ✅ Complete
- JWT token authentication
- Automatic token refresh on 401
- Protected routes
- Role-based access control
- User registration
- Login/logout
- Mock API for development
- Test accounts pre-loaded

### 📅 Coming Next (Phase 2)
- Real API integration
- Form validation with Zod
- Error handling with Sentry
- WebSocket real-time updates
- Push notifications
- E2E testing
- Performance optimization
- Security audit

---

## 🔗 Links

- **GitHub:** https://github.com/Romslav/max-loyalty
- **PR #1:** https://github.com/Romslav/max-loyalty/pull/1
- **Branch:** `feat/auth-system`

---

## 📊 Status

```
✅ Phase 1: Authentication (Days 1-2)
   ✅ Day 1: Complete
   📅 Day 2: Coming Next

📅 Phase 2: API Integration (Days 2-3)
📅 Phase 3: Validation (Days 3-4)
📅 Phase 4: Components (Days 4-5)
📅 Phase 5: Real-time (Days 5-6)
📅 Phase 6: Testing (Days 6-7)
```

**Timeline:** 24 days | **Budget:** 90-100 person-days | **Target:** v4.0.0

---

## ❓ Questions?

1. Read [QUICKSTART.md](./QUICKSTART.md) - most comprehensive
2. Check [SETUP_AUTH.md](./SETUP_AUTH.md) - technical details
3. Open [GETTING_STARTED.html](./GETTING_STARTED.html) in browser - visual guide
4. Check GitHub issues - common problems

---

## 🎓 What You Learn

By running this project, you'll understand:

- ✅ How JWT authentication works
- ✅ React hooks and state management
- ✅ Protected routes in React Router
- ✅ Role-based access control
- ✅ Modern web development workflow
- ✅ Frontend + Backend integration patterns

---

**Ready? Start with Step 1 above! 🚀**

Questions? Open an issue on GitHub!
