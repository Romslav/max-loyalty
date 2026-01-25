// Dependency Injection Configuration (Inversify IoC Container)
// Wires all domain services, application use cases, and infrastructure implementations

import { Container, interfaces } from 'inversify';
import { TYPES } from '../shared/types';

// Domain Service Interfaces
import { IGuestService } from '../domain/services/GuestService';
import { ITransactionService } from '../domain/services/TransactionService';
import { ICardService } from '../domain/services/CardService';
import { IRestaurantService } from '../domain/services/RestaurantService';

// Domain Repositories
import {
  IGuestRepository,
  IGuestRestaurantRepository,
  ITransactionRepository,
  ICardRepository,
  ITierRepository,
  IRestaurantRepository,
  IPhoneVerificationRepository,
  IBalanceDetailRepository,
  IPointOfSaleRepository,
  ITierEventRepository,
} from '../domain/repositories';

// Infrastructure Implementations
import { GuestRepositoryImpl } from '../infrastructure/database/repositories/GuestRepository';
import { GuestRestaurantRepositoryImpl } from '../infrastructure/database/repositories/GuestRestaurantRepository';
import { TransactionRepositoryImpl } from '../infrastructure/database/repositories/TransactionRepository';
import { CardRepositoryImpl } from '../infrastructure/database/repositories/CardRepository';
import { TierRepositoryImpl } from '../infrastructure/database/repositories/TierRepository';
import { RestaurantRepositoryImpl } from '../infrastructure/database/repositories/RestaurantRepository';
import { PhoneVerificationRepositoryImpl } from '../infrastructure/database/repositories/PhoneVerificationRepository';
import { BalanceDetailRepositoryImpl } from '../infrastructure/database/repositories/BalanceDetailRepository';
import { PointOfSaleRepositoryImpl } from '../infrastructure/database/repositories/PointOfSaleRepository';
import { TierEventRepositoryImpl } from '../infrastructure/database/repositories/TierEventRepository';

// Domain Service Implementations
import { GuestServiceImpl } from '../infrastructure/services/GuestServiceImpl';
import { TransactionServiceImpl } from '../infrastructure/services/TransactionServiceImpl';
import { CardServiceImpl } from '../infrastructure/services/CardServiceImpl';
import { RestaurantServiceImpl } from '../infrastructure/services/RestaurantServiceImpl';

// Application Use Cases
import { RegisterGuestUseCase } from '../application/use-cases/RegisterGuestUseCase';
import { ProcessSaleTransactionUseCase } from '../application/use-cases/ProcessSaleTransactionUseCase';
// ... more use cases to be added

// Infrastructure Services
import { CardCryptographyImpl } from '../infrastructure/security/CardCryptography';
import { JWTHandlerImpl } from '../infrastructure/security/JWTHandler';
import { PasswordHasherImpl } from '../infrastructure/security/PasswordHasher';
import { CacheManagerImpl } from '../infrastructure/cache/CacheManager';
import { DatabaseConnection } from '../infrastructure/database/connection';

const container = new Container();

// ============ REPOSITORIES ============

container
  .bind<IGuestRepository>(TYPES.Repositories.IGuestRepository)
  .to(GuestRepositoryImpl)
  .inSingletonScope();

container
  .bind<IGuestRestaurantRepository>(TYPES.Repositories.IGuestRestaurantRepository)
  .to(GuestRestaurantRepositoryImpl)
  .inSingletonScope();

container
  .bind<ITransactionRepository>(TYPES.Repositories.ITransactionRepository)
  .to(TransactionRepositoryImpl)
  .inSingletonScope();

container
  .bind<ICardRepository>(TYPES.Repositories.ICardRepository)
  .to(CardRepositoryImpl)
  .inSingletonScope();

container
  .bind<ITierRepository>(TYPES.Repositories.ITierRepository)
  .to(TierRepositoryImpl)
  .inSingletonScope();

container
  .bind<IRestaurantRepository>(TYPES.Repositories.IRestaurantRepository)
  .to(RestaurantRepositoryImpl)
  .inSingletonScope();

container
  .bind<IPhoneVerificationRepository>(TYPES.Repositories.IPhoneVerificationRepository)
  .to(PhoneVerificationRepositoryImpl)
  .inSingletonScope();

container
  .bind<IBalanceDetailRepository>(TYPES.Repositories.IBalanceDetailRepository)
  .to(BalanceDetailRepositoryImpl)
  .inSingletonScope();

container
  .bind<IPointOfSaleRepository>(TYPES.Repositories.IPointOfSaleRepository)
  .to(PointOfSaleRepositoryImpl)
  .inSingletonScope();

container
  .bind<ITierEventRepository>(TYPES.Repositories.ITierEventRepository)
  .to(TierEventRepositoryImpl)
  .inSingletonScope();

// ============ DOMAIN SERVICES ============

container
  .bind<IGuestService>(TYPES.Services.IGuestService)
  .to(GuestServiceImpl)
  .inSingletonScope();

container
  .bind<ITransactionService>(TYPES.Services.ITransactionService)
  .to(TransactionServiceImpl)
  .inSingletonScope();

container
  .bind<ICardService>(TYPES.Services.ICardService)
  .to(CardServiceImpl)
  .inSingletonScope();

container
  .bind<IRestaurantService>(TYPES.Services.IRestaurantService)
  .to(RestaurantServiceImpl)
  .inSingletonScope();

// ============ INFRASTRUCTURE SERVICES ============

container
  .bind(TYPES.Infrastructure.CardCryptography)
  .to(CardCryptographyImpl)
  .inSingletonScope();

container
  .bind(TYPES.Infrastructure.JWTHandler)
  .to(JWTHandlerImpl)
  .inSingletonScope();

container
  .bind(TYPES.Infrastructure.PasswordHasher)
  .to(PasswordHasherImpl)
  .inSingletonScope();

container
  .bind(TYPES.Infrastructure.CacheManager)
  .to(CacheManagerImpl)
  .inSingletonScope();

container
  .bind(TYPES.Infrastructure.DatabaseConnection)
  .toConstantValue(new DatabaseConnection())
  .inSingletonScope();

// ============ APPLICATION USE CASES ============

container
  .bind(TYPES.UseCases.RegisterGuest)
  .to(RegisterGuestUseCase)
  .inTransientScope();

container
  .bind(TYPES.UseCases.ProcessSaleTransaction)
  .to(ProcessSaleTransactionUseCase)
  .inTransientScope();

// ... more use cases to be registered

export { container };
