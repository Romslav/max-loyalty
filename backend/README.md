# MaxLoyalty Backend API

A comprehensive loyalty program management system built with NestJS, PostgreSQL, and Telegram integration.

## 🚀 Features

- **Guest Card Management** - Create and manage loyalty cards for customers
- **QR Code Rotation** - Secure rotating QR codes with HMAC signing (rotates every 5 minutes)
- **Telegram Bot Integration** - Users manage cards through Telegram
- **Points System** - Earn points on purchases, automatic tier upgrades
- **Transaction Processing** - Staff scans QR codes to record purchases and award points
- **Restaurant Owner Dashboard** - View analytics, manage cards, set loyalty tiers
- **Real-time Notifications** - Points earned, tier upgrades, promotions
- **HMAC Security** - Signed QR codes prevent fraud

## 📋 Prerequisites

- Node.js >= 18.0
- PostgreSQL >= 14
- Telegram Bot Token (from @BotFather)
- Redis (optional, for caching)

## ⚙️ Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/max_loyalty_db"
JWT_SECRET="your-secret-key"
TELEGRAM_BOT_TOKEN="your-telegram-token"
```

### 3. Database Setup

```bash
# Create database
creatdb max_loyalty_db

# Run migrations
npm run migrate

# Generate Prisma client
npm run generate
```

## 🏃 Running the Application

### Development

```bash
npm run start:dev
```

Server will start on `http://localhost:3000`

### Production

```bash
npm run build
npm run start:prod
```

## 📚 API Documentation

Swagger docs available at: `http://localhost:3000/api/docs`

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

### Guest Cards

- `GET /api/cards` - Get user's cards
- `POST /api/cards` - Create new card
- `GET /api/cards/:cardId` - Get card details
- `POST /api/cards/validate` - Validate QR code
- `GET /api/cards/:cardId/qr-code` - Get active QR code
- `GET /api/cards/:cardId/transactions` - Get card transactions
- `GET /api/cards/:cardId/points` - Get points history

### Transactions

- `POST /api/transactions` - Create transaction (staff scans QR)
- `GET /api/transactions/:transactionId` - Get transaction details
- `GET /api/transactions/staff/:staffId` - Get staff transactions

### Restaurant Owner

- `GET /api/owner/restaurants` - Get owned restaurants
- `GET /api/owner/restaurants/:id/guest-cards` - Get restaurant cards
- `GET /api/owner/restaurants/:id/guest-cards/:cardId` - Get card details
- `PUT /api/owner/restaurants/:id/guest-cards/:cardId/suspend` - Suspend card
- `POST /api/owner/restaurants/:id/guest-cards/:cardId/add-bonus` - Add bonus points
- `GET /api/owner/restaurants/:id/analytics` - Get analytics
- `POST /api/owner/restaurants/:id/rotate-qr-codes` - Rotate all QR codes

### Telegram Bot

- `POST /telegram/webhook` - Telegram webhook

## 🔐 Security Features

### QR Code Security

1. **Rotating Codes** - QR codes automatically rotate every 5 minutes
2. **HMAC Signatures** - All codes are signed with HMAC-SHA256
3. **Code Deactivation** - Old codes are immediately deactivated when rotated
4. **Fraud Detection** - Multiple scans within 1 minute trigger alert
5. **Code History** - Full audit trail of all codes

### Authentication

- JWT tokens for API authentication
- Bearer token in Authorization header
- Refresh token rotation
- Role-based access control (ADMIN, OWNER, STAFF, USER)

### Data Protection

- Password hashing with bcrypt
- Database connection pooling
- Request validation and sanitization
- Helmet.js for HTTP security headers
- CORS protection

## 📊 Database Schema

### Key Tables

- **User** - System users (customers, staff, owners)
- **Restaurant** - Restaurant information and settings
- **GuestCard** - Loyalty cards for customers
- **CardIdentifier** - QR codes and rotating codes (CRITICAL)
- **Transaction** - Purchase transactions
- **PointLog** - Points ledger and audit trail
- **LoyaltyTier** - Loyalty tiers (Standard, Silver, Gold, etc.)
- **Notification** - User notifications
- **Analytics** - Daily analytics for restaurants

## 🤖 Telegram Bot Commands

- `/start` - Welcome and quick start
- `/register` - Create loyalty card
- `/card` - View current card
- `/points` - Check points balance
- `/restaurants` - Browse restaurants
- `/help` - Show help

## 📈 Points System

### Points Calculation

```
Base Points = Purchase Amount × (Points Per Purchase / 100)
Final Points = Base Points × Tier Multiplier
```

### Loyalty Tiers

- **Standard** - 1.0x multiplier
- **Silver** - 1.1x multiplier (after 100 points)
- **Gold** - 1.2x multiplier (after 500 points)
- **Platinum** - 1.5x multiplier (after 1000 points)

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 📝 Environment Variables

See `.env.example` for all available variables.

## 🚢 Deployment

### Docker

```bash
# Build
docker build -t max-loyalty-backend .

# Run
docker run -p 3000:3000 --env-file .env max-loyalty-backend
```

### Cloud Deployment

The application supports deployment to:
- AWS EC2 / ECS
- Google Cloud Run
- Heroku
- Digital Ocean
- Azure Container Instances

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
psql -U postgres

# Verify DATABASE_URL in .env
echo $DATABASE_URL
```

### Telegram Bot Not Working

1. Verify bot token in `.env`
2. Check webhook URL is publicly accessible
3. View bot logs: `npm run start:dev`

### QR Code Rotation Not Working

1. Ensure cron job is running
2. Check database connection
3. Verify restaurant has QR rotation enabled

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@maxloyalty.com

## 📄 License

MIT
