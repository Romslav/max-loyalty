# MAX Loyalty Platform v3.0 - Clean Architecture

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                         │
│  (Web/Mobile UIs - React, Telegram Web App, Admin Dashboards)   │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER (Use Cases)                 │
│  RegisterGuest, ProcessSale, RedeemPoints, UpdateTier, etc.    │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER (Core Logic)                  │
│  • Entities: Guest, Transaction, Tier, Card, Restaurant         │
│  • Services: GuestService, TransactionService, CardService      │
│  • Repositories (Interfaces): IGuestRepository, etc.            │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                           │
│  • Database: MySQL 8.0 (23 tables)                              │
│  • ORM: TypeORM/Prisma                                          │
│  • Caching: Redis                                               │
│  • Messaging: RabbitMQ (async tasks)                            │
│  • APIs: Telegram Bot, SMS Gateway, POS Integration             │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── domain/                          # Domain Layer (Business Logic)
│   │   ├── entities/                    # Core business objects
│   │   │   ├── GuestEntity.ts
│   │   │   ├── TransactionEntity.ts
│   │   │   ├── TierEntity.ts
│   │   │   ├── CardEntity.ts
│   │   │   ├── RestaurantEntity.ts
│   │   │   └── index.ts                 # All entities exported
│   │   ├── services/                    # Domain Service Interfaces
│   │   │   ├── GuestService.ts          # Guest registration, verification
│   │   │   ├── TransactionService.ts    # Points, tiers, transactions
│   │   │   ├── CardService.ts           # QR tokens, 6-digit codes
│   │   │   └── RestaurantService.ts     # Business customization
│   │   └── repositories/                # Data Access Contracts
│   │       └── index.ts                 # All repository interfaces
│   │
│   ├── application/                     # Application Layer (Use Cases)
│   │   ├── use-cases/                   # Business workflows
│   │   │   ├── RegisterGuestUseCase.ts
│   │   │   ├── ProcessSaleTransactionUseCase.ts
│   │   │   ├── RedeemPointsUseCase.ts
│   │   │   ├── UpdateTierUseCase.ts
│   │   │   ├── HandleExpirationUseCase.ts
│   │   │   └── ... more use cases
│   │   ├── dtos/                        # Data Transfer Objects
│   │   │   ├── CreateGuestDTO.ts
│   │   │   └── ... more DTOs
│   │   └── services/                    # Application Services
│   │       └── CommandHandler.ts
│   │
│   ├── infrastructure/                  # Infrastructure Layer
│   │   ├── database/                    # Database implementations
│   │   │   ├── repositories/            # Repository implementations
│   │   │   │   ├── GuestRepository.ts
│   │   │   │   ├── TransactionRepository.ts
│   │   │   │   ├── CardRepository.ts
│   │   │   │   └── ...
│   │   │   ├── migrations/              # Database migrations
│   │   │   │   ├── 001_initial_schema.sql
│   │   │   │   └── 002_add_indexes.sql
│   │   │   └── connection.ts            # DB connection config
│   │   ├── services/                    # Framework-specific implementations
│   │   │   ├── GuestServiceImpl.ts
│   │   │   ├── TransactionServiceImpl.ts
│   │   │   └── ...
│   │   ├── integrations/                # External API integrations
│   │   │   ├── telegram/                # Telegram Bot API
│   │   │   ├── sms/                     # SMS Gateway (Twilio)
│   │   │   ├── pos/                     # POS Integration (iiko, R-Keeper)
│   │   │   └── payment/                 # Payment Gateway
│   │   ├── security/                    # Security utilities
│   │   │   ├── CardCryptography.ts      # HMAC-SHA256 for QR tokens
│   │   │   ├── JWTHandler.ts
│   │   │   └── PasswordHasher.ts
│   │   └── cache/                       # Redis cache layer
│   │       └── CacheManager.ts
│   │
│   ├── presentation/                    # Presentation Layer
│   │   ├── api/                         # REST API Controllers
│   │   │   ├── v1/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── guest.controller.ts
│   │   │   │   ├── transaction.controller.ts
│   │   │   │   ├── pos.controller.ts
│   │   │   │   └── restaurant.controller.ts
│   │   │   └── middleware/
│   │   ├── websockets/                  # Real-time updates
│   │   │   └── GatewayService.ts
│   │   └── responses/                   # Response formatters
│   │       ├── ApiResponse.ts
│   │       └── ErrorHandler.ts
│   │
│   ├── shared/                          # Shared utilities
│   │   ├── types/                       # Common TypeScript types
│   │   ├── utils/                       # Utility functions
│   │   ├── constants/                   # Constants
│   │   └── exceptions/                  # Custom exceptions
│   │
│   ├── config/                          # Configuration
│   │   ├── env.ts                       # Environment variables
│   │   ├── database.config.ts
│   │   └── inversify.config.ts          # Dependency injection
│   │
│   └── main.ts                          # Application entry point
│
├── database/
│   └── migrations/                      # SQL migration files
│       └── 001_initial_schema.sql
│
├── tests/                               # Test files
│   ├── unit/                            # Unit tests
│   │   └── domain/
│   ├── integration/                     # Integration tests
│   │   └── repositories/
│   └── e2e/                             # End-to-end tests
│
├── docker-compose.yml                   # Local development
├── Dockerfile                           # Production image
└── package.json
```

## 🎯 Core Concepts

### 1. **Domain Layer** (Pure Business Logic)

- **No dependencies** on frameworks, databases, or external services
- **Entities**: Core business objects with behavior (Guest, Transaction, Tier, Card)
- **Services**: Domain service interfaces defining contracts
- **Repositories**: Data access interfaces (NOT implementations)
- **Value Objects**: PointsCalculator, TierDefinition, etc.

**Example: PointsCalculator (Pure Domain Logic)**
```typescript
const { basePoints, bonusPoints, totalPoints } = 
  PointsCalculator.calculatePointsAwarded(1500, 5);
// basePoints = 1500
// bonusPoints = 75
// totalPoints = 1575
```

### 2. **Application Layer** (Use Cases)

- **Orchestrates** domain services to fulfill business workflows
- **No database logic** - delegates to repositories
- **Input Validation**: DTOs ensure data quality
- **Output Formatting**: Consistent response structures
- **Transaction Management**: Ensures atomic operations

**Example: ProcessSaleTransactionUseCase**
```typescript
1. Validate guest & balance
2. Calculate points (domain logic)
3. Create transaction (atomic)
4. Update balance in DB (repository)
5. Check tier upgrade (domain logic)
6. Regenerate card identifiers (security)
7. Notify guest (async)
```

### 3. **Infrastructure Layer** (Implementations)

- **Repository Implementations**: Translate domain interfaces to DB queries
- **Service Implementations**: Framework-specific code
- **Integrations**: Telegram Bot, SMS Gateway, POS APIs
- **Security**: HMAC-SHA256 for QR tokens, JWT for auth
- **Caching**: Redis for performance

### 4. **Presentation Layer** (APIs)

- **REST Controllers**: Map HTTP requests to use cases
- **Middleware**: Authentication, validation, logging
- **WebSocket**: Real-time updates for dashboards
- **Error Handling**: Consistent error responses

## 🔄 Data Flow Example: Processing a Sale

### Request
```http
POST /api/v1/pos/transaction/sale
Content-Type: application/json
{
  "qrToken": "eyJhbGc...",
  "posId": "pos_123",
  "amountRubles": 1500,
  "chequeNumber": "CH-001234"
}
```

### Processing Flow

```
1. PRESENTATION LAYER (Controller)
   ↓
   Validates: QR token, amount, POS exists
   ↓
   Calls: ProcessSaleTransactionUseCase.execute()

2. APPLICATION LAYER (Use Case)
   ↓
   Validates: Guest exists, not blocked, balance sufficient
   Calls domain services in order:
   - CardService.validateQRToken()
   - TransactionService.createSaleTransaction()
   - TransactionService.updateGuestTier()
   - CardService.regenerateCardIdentifiers()

3. DOMAIN LAYER (Services)
   ↓
   Pure business logic:
   - PointsCalculator.calculatePointsAwarded()
   - TierEntity.isWithinRange()
   - Delegates to repositories for data

4. INFRASTRUCTURE LAYER (Repositories)
   ↓
   Database operations via TypeORM:
   - INSERT INTO transactions (...)
   - UPDATE guest_restaurants SET balance = ...
   - UPDATE card_identifiers SET ...
   - Caching via Redis

5. RESPONSE
   ↓
   {
     "transactionId": "tx_123",
     "pointsAwarded": 1575,
     "newBalance": 3500,
     "tierUpgraded": false,
     "newQRToken": "eyJhbGc...",
     "newSixDigitCode": "123456"
   }
```

## 🔐 Security Architecture

### QR Token Security

```typescript
// Generation (at registration & after each transaction)
const qrToken = generateQRToken(guestRestaurantId, restaurantId, timestamp);
// Uses HMAC-SHA256 with server secret
// Format: base64(hmac_sha256(payload, SECRET))

// Validation (when QR scanned)
const isValid = verifyQRToken(token, SECRET);
// Must be current active token (checked against DB)
```

### 6-Digit Code Security

```typescript
// Generation (unique per restaurant)
const code = generate6DigitCode();
// Uniqueness guaranteed by UNIQUE constraint (restaurant_id, code)
// Regenerated after each transaction

// Validation (when input manually)
const result = validateSixDigitCode(code, restaurantId);
// Must be active (not invalidated by prior transaction)
```

### SMS Verification

```typescript
// Rate limiting: max 3 attempts, 10 min expiry
const verification = await sendVerificationCode(phone);

// Validation
const isValid = await verifyPhoneNumber(phone, code);
// Code must match, not expired, attempts < 3
```

## 📊 Database Schema (23 Tables)

### LAYER 1: Identity & Verification
- `guests` - Guest profiles
- `guest_children` - Children info for marketing
- `guest_restaurants` - Guest-network relationship
- `phone_verification` - SMS verification queue
- `card_identifiers` - QR & 6-digit codes

### LAYER 2: Transactions & Points
- `transactions` - Complete audit log
- `balance_detail` - Points breakdown
- `tier_events` - Tier progression history

### LAYER 3: Business & Customization
- `restaurants` - Network records
- `points_of_sale` - Individual locations
- `loyalty_customization` - Program settings
- `tier_definitions` - Tier configurations
- `staff_restaurants` - Manager assignments

### Support Tables
- `users` - Auth accounts
- `sessions` - Active sessions
- `promotions` - Marketing campaigns
- `promotion_applications` - Guest promo tracking
- `referrals` - Referral program
- `audit_logs` - Compliance logging
- `subscriptions` - Billing
- `invoices` - Payment records
- `notifications` - Push queue
- `system_settings` - Global config

## 🧪 Testing Strategy

### Unit Tests
- **Domain Layer**: PointsCalculator, TierEntity, etc.
- **Use Cases**: RegisterGuestUseCase, ProcessSaleUseCase
- Mocked repositories & services

### Integration Tests
- **Repositories**: Actual DB queries
- **Services**: With real database
- Docker-based test database

### E2E Tests
- **Full workflows**: Registration → Sale → Tier Upgrade
- **POS API**: QR token validation, transaction processing
- **Telegram**: Bot commands, Web App messages

## 🚀 Deployment

### Docker
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM node:18-alpine
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
CMD ["node", "dist/main.js"]
```

### Environment Variables
```env
# Database
DATABASE_URL=mysql://user:pass@mysql:3306/loyalty
REDIS_URL=redis://redis:6379

# Services
TELEGRAM_BOT_TOKEN=...
SMS_PROVIDER=twilio
SMS_ACCOUNT_SID=...

# Security
JWT_SECRET=...
QR_TOKEN_SECRET=...

# POS Integration
IIKO_API_KEY=...
RKEEPER_API_KEY=...
```

## 📝 Development Workflow

1. **Create feature branch**: `git checkout -b feature/xyz`
2. **Implement domain first**: Entity → Service interfaces
3. **Add repositories**: Data access contracts
4. **Write use case**: Application logic
5. **Implement services**: Actual business logic
6. **Add controller**: REST endpoint
7. **Write tests**: Unit, integration, E2E
8. **Create PR**: Code review
9. **Merge to main**: Deploy

## 🔗 Integration Points

### Telegram Bot
- `/start` - Registration
- Web App - Personal cabinet
- Notifications - Points awarded, tier upgrade

### POS APIs
- iiko - Get menu, accept orders
- R-Keeper - Sync transactions, inventory
- Custom REST - Generic POS support

### SMS Gateway
- Twilio - Phone verification, marketing messages
- Alternative: SMS.ru, Vonage

### Payment
- YooKassa - Subscription billing
- Stripe - International payments

## 📚 Additional Resources

- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design (Eric Evans)](https://www.domainlanguage.com/ddd/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
