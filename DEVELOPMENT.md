# Development Guide - MAX Loyalty v3.0

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm/yarn
- Docker & Docker Compose
- MySQL 8.0
- Redis

### Setup

```bash
# 1. Clone repository
git clone https://github.com/Romslav/max-loyalty.git
cd max-loyalty

# 2. Install dependencies
npm install

# 3. Start Docker services (MySQL, Redis)
docker-compose up -d

# 4. Create .env file
cp .env.example .env

# 5. Run database migrations
npm run db:migrate

# 6. Seed test data (optional)
npm run db:seed

# 7. Start development server
npm run dev
```

Server runs on `http://localhost:3000`

## 📁 Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed structure.

## 🏗️ Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/xyz-description
# Examples:
# feature/register-guest-telegram
# feature/process-sale-transaction
# feature/tier-upgrade-logic
```

### 2. Domain-First Development

**Step 1: Design domain entities** (Pure TypeScript, no DB)

```typescript
// backend/src/domain/entities/YourEntity.ts
export class YourEntity {
  constructor(
    readonly id: string,
    readonly field1: string,
    readonly field2: number,
  ) {}

  someBusinessLogic(): string {
    // Pure business logic
    return this.field1.toUpperCase();
  }
}
```

**Step 2: Define service interface**

```typescript
// backend/src/domain/services/YourService.ts
export interface IYourService {
  doSomething(input: Input): Promise<Output>;
}
```

**Step 3: Define repository interface**

```typescript
// backend/src/domain/repositories/index.ts
export interface IYourRepository {
  save(entity: YourEntity): Promise<void>;
  findById(id: string): Promise<YourEntity | null>;
}
```

**Step 4: Write use case** (Application layer)

```typescript
// backend/src/application/use-cases/YourUseCase.ts
export class YourUseCase {
  constructor(
    private readonly service: IYourService,
    private readonly repository: IYourRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    // Orchestrate domain + repository
    const entity = await this.repository.findById(input.id);
    if (!entity) throw new Error('Not found');
    return this.service.doSomething(entity);
  }
}
```

**Step 5: Unit tests** (Domain logic)

```typescript
// backend/tests/unit/domain/YourEntity.test.ts
describe('YourEntity', () => {
  it('should calculate business logic', () => {
    const entity = new YourEntity('1', 'hello', 42);
    expect(entity.someBusinessLogic()).toBe('HELLO');
  });
});
```

**Step 6: Implement repository** (Infrastructure)

```typescript
// backend/src/infrastructure/database/repositories/YourRepository.ts
@injectable()
export class YourRepositoryImpl implements IYourRepository {
  constructor(@inject(TYPES.Infrastructure.DatabaseConnection) private db: Database) {}

  async save(entity: YourEntity): Promise<void> {
    // DB query using TypeORM/Prisma
    await this.db.your_entities.insert({ ... });
  }
}
```

**Step 7: Implement service** (Infrastructure)

```typescript
// backend/src/infrastructure/services/YourServiceImpl.ts
@injectable()
export class YourServiceImpl implements IYourService {
  constructor(
    @inject(TYPES.Repositories.IYourRepository) private repo: IYourRepository,
  ) {}

  async doSomething(input: Input): Promise<Output> {
    // Use domain logic + repository
    const entity = await this.repo.findById(input.id);
    return { /* result */ };
  }
}
```

**Step 8: Register in DI container**

```typescript
// backend/src/config/inversify.config.ts
container
  .bind<IYourService>(TYPES.Services.IYourService)
  .to(YourServiceImpl)
  .inSingletonScope();
```

**Step 9: Create REST controller** (Presentation)

```typescript
// backend/src/presentation/api/v1/your.controller.ts
@controller('/api/v1/your')
export class YourController {
  constructor(
    @inject(TYPES.UseCases.YourUseCase) private useCase: YourUseCase,
  ) {}

  @post('/')
  async create(@request() req: Request): Promise<ApiResponse<Output>> {
    const output = await this.useCase.execute(req.body);
    return { success: true, data: output };
  }
}
```

**Step 10: Integration tests**

```typescript
// backend/tests/integration/YourFeature.test.ts
describe('Your Feature', () => {
  let useCase: YourUseCase;

  beforeAll(async () => {
    const container = new Container();
    // Register all services
    useCase = container.get(TYPES.UseCases.YourUseCase);
  });

  it('should execute use case end-to-end', async () => {
    const output = await useCase.execute({ /* input */ });
    expect(output).toBeDefined();
  });
});
```

### 3. Write Tests (80%+ coverage)

**Unit Tests - Pure Domain Logic**

```bash
npm run test -- tests/unit/domain/
```

```typescript
// Test entity methods
test('PointsCalculator calculates DISCOUNT formula', () => {
  const result = PointsCalculator.calculatePointsAwarded(1500, 5);
  expect(result.basePoints).toBe(1500);
  expect(result.bonusPoints).toBe(75);
  expect(result.totalPoints).toBe(1575);
});
```

**Integration Tests - With Real DB**

```bash
npm run test:integration
```

```typescript
// Test full workflow
test('RegisterGuestUseCase registers guest in restaurant', async () => {
  const useCase = container.get(TYPES.UseCases.RegisterGuest);
  const output = await useCase.execute({
    phone: '+79991234567',
    name: 'Test Guest',
    restaurantId: 'rest_123',
    source: 'web',
  });
  expect(output.guestId).toBeDefined();
  expect(output.guestRestaurantId).toBeDefined();
});
```

**E2E Tests - Full API Flow**

```bash
npm run test:e2e
```

```typescript
// Test HTTP requests
test('POST /api/v1/guests/register registers guest', async () => {
  const response = await request(app)
    .post('/api/v1/guests/register')
    .send({
      phone: '+79991234567',
      name: 'Test Guest',
      restaurantId: 'rest_123',
    });
  expect(response.status).toBe(201);
  expect(response.body.data.guestId).toBeDefined();
});
```

### 4. Code Review Checklist

Before creating a PR, ensure:

- [ ] Domain layer has **zero external dependencies**
- [ ] All domain entities are **immutable** (readonly fields)
- [ ] Repository interfaces are **defined, not implemented** in domain
- [ ] Use cases are **thin orchestrators** (not business logic)
- [ ] All public methods have **JSDoc comments**
- [ ] Unit test coverage **≥ 80%**
- [ ] Tests include **happy path + error cases**
- [ ] No hardcoded values (use constants from `shared/constants.ts`)
- [ ] Database queries are **parameterized** (prevent SQL injection)
- [ ] Sensitive data (passwords, tokens) are **never logged**
- [ ] Error messages are **user-friendly** (no stack traces)
- [ ] Breaking API changes are **documented**

### 5. Commit Messages

Follow conventional commits:

```
feat: Add guest registration use case
fix: Calculate bonus points correctly for BRONZE tier
docs: Update architecture diagram
test: Add RegisterGuestUseCase tests
refactor: Extract PointsCalculator logic
chore: Update dependencies
```

### 6. Database Migrations

**Add migration** (never modify existing ones):

```bash
npm run db:create-migration -- add_new_field
```

**Edit** `backend/database/migrations/XXX_add_new_field.sql`:

```sql
ALTER TABLE guests ADD COLUMN new_field VARCHAR(255);
```

**Run migrations**:

```bash
npm run db:migrate
```

**Rollback (only in development)**:

```bash
npm run db:rollback
```

## 📊 Code Quality

### Linting

```bash
# Check code style
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Type Checking

```bash
# Check TypeScript types
npm run type-check
```

### Test Coverage

```bash
# Generate coverage report
npm run test:coverage

# View in browser
open coverage/index.html
```

## 🔍 Debugging

### VS Code Debugging

**.vscode/launch.json**:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/dist/main.js",
      "preLaunchTask": "npm: dev",
      "console": "integratedTerminal"
    }
  ]
}
```

### Database Debugging

```bash
# Access MySQL CLI
docker exec -it mysql mysql -uroot -ppassword -Dloyalty

# Query examples
SELECT * FROM guests WHERE phone = '+79991234567';
SELECT * FROM transactions WHERE guest_id = 'guest_123' ORDER BY created_at DESC LIMIT 10;
```

### Logs

```bash
# View application logs
npm run logs

# View specific service
npm run logs -- --service=mysql
```

## 🚀 Performance Optimization

### Query Optimization

- Always use **indexes** for frequently queried fields
- Use **EXPLAIN** to analyze query plans:
  ```sql
  EXPLAIN SELECT * FROM transactions WHERE restaurant_id = 'rest_123';
  ```
- Avoid **N+1 queries** (use joins)
- Paginate results (limit 1000)

### Caching Strategy

```typescript
// Cache guest profile for 1 hour
const guest = await cacheManager.remember(
  `guest:${guestId}`,
  3600, // 1 hour
  () => guestRepository.findById(guestId),
);
```

### Redis Keys Pattern

```
guest:{guestId} - Guest profile
guest:restaurant:{guestRestaurantId} - Guest in restaurant
card:qr:{qrToken} - QR token to guest mapping
transaction:{transactionId} - Transaction details
```

## 📚 Documentation

### Code Comments

```typescript
/**
 * Calculates points awarded for a sale transaction using DISCOUNT formula.
 *
 * Formula: basePoints + (basePoints * discountPercent / 100)
 *
 * @param amountRubles - Purchase amount in rubles
 * @param discountPercent - Tier discount percentage (5-25%)
 * @returns Points breakdown (base, bonus, total)
 *
 * @example
 * const result = PointsCalculator.calculatePointsAwarded(1500, 5);
 * // { basePoints: 1500, bonusPoints: 75, totalPoints: 1575 }
 */
static calculatePointsAwarded(
  amountRubles: number,
  discountPercent: number,
): CalculatePointsResult {
  // ...
}
```

### README Template for Features

```markdown
# Feature: Guest Registration

## Overview
Allows guests to register via Telegram, Web, QR code, or SMS.

## Flows
1. User scans QR code
2. Opens registration form
3. Enters phone number
4. Receives SMS verification code
5. Verifies and creates account
6. Gets personal QR code + 6-digit code

## API Endpoints
- `POST /api/v1/guests/register` - Register guest
- `POST /api/v1/guests/verify` - Verify phone

## Database Changes
- New table: `guests`
- New table: `phone_verification`

## Security Considerations
- Phone numbers verified via SMS
- QR tokens use HMAC-SHA256
- Rate limiting on verification (3 attempts, 10 min)

## Testing
- Unit tests: Entity logic
- Integration tests: Use case + repositories
- E2E tests: HTTP API
```

## 🐛 Troubleshooting

### MySQL Connection Error

```bash
# Check if MySQL is running
docker ps | grep mysql

# Start MySQL
docker-compose up -d mysql

# Test connection
mysql -h127.0.0.1 -uroot -ppassword -e "SELECT 1"
```

### Dependency Injection Error

```
Error: No matching bindings found for service identifier: Symbol(IYourService)
```

**Solution**: Register service in `inversify.config.ts`

### Database Migration Failed

```bash
# Check migration status
npm run db:status

# Rollback to previous state
npm run db:rollback

# Rerun migrations
npm run db:migrate
```

### Test Timeout

```typescript
// Increase Jest timeout for integration tests
jest.setTimeout(10000); // 10 seconds
```

## 📖 Resources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [MySQL Performance](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- [Jest Testing](https://jestjs.io/docs/getting-started)

## 🆘 Getting Help

- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for design overview
- Search existing issues: `github.com/Romslav/max-loyalty/issues`
- Ask in team Slack channel: `#max-loyalty-dev`
- Contact tech lead: @Romslav
