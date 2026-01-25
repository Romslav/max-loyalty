import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../../shared/types';

import { GuestServiceImpl } from '../services/GuestServiceImpl';
import { TransactionServiceImpl } from '../services/TransactionServiceImpl';
import { CardServiceImpl } from '../services/CardServiceImpl';
import { RestaurantServiceImpl } from '../services/RestaurantServiceImpl';

import { GuestRepository } from '../repositories/GuestRepository';
import { GuestRestaurantRepository } from '../repositories/GuestRestaurantRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { CardIdentifierRepository } from '../repositories/CardIdentifierRepository';
import { BalanceDetailRepository } from '../repositories/BalanceDetailRepository';
import { TierEventRepository } from '../repositories/TierEventRepository';
import { TierDefinitionRepository } from '../repositories/TierDefinitionRepository';
import { RestaurantRepository } from '../repositories/RestaurantRepository';
import { PhoneVerificationRepository } from '../repositories/PhoneVerificationRepository';
import { GuestChildrenRepository } from '../repositories/GuestChildrenRepository';

const container = new Container();

// Register Repositories
container.bind(TYPES.Repositories.IGuestRepository).to(GuestRepository).inSingletonScope();
container.bind(TYPES.Repositories.IGuestRestaurantRepository).to(GuestRestaurantRepository).inSingletonScope();
container.bind(TYPES.Repositories.ITransactionRepository).to(TransactionRepository).inSingletonScope();
container.bind(TYPES.Repositories.ICardIdentifierRepository).to(CardIdentifierRepository).inSingletonScope();
container.bind(TYPES.Repositories.IBalanceDetailRepository).to(BalanceDetailRepository).inSingletonScope();
container.bind(TYPES.Repositories.ITierEventRepository).to(TierEventRepository).inSingletonScope();
container.bind(TYPES.Repositories.ITierDefinitionRepository).to(TierDefinitionRepository).inSingletonScope();
container.bind(TYPES.Repositories.IRestaurantRepository).to(RestaurantRepository).inSingletonScope();
container.bind(TYPES.Repositories.IPhoneVerificationRepository).to(PhoneVerificationRepository).inSingletonScope();
container.bind(TYPES.Repositories.IGuestChildrenRepository).to(GuestChildrenRepository).inSingletonScope();

// Register Services
container.bind(TYPES.Services.IGuestService).to(GuestServiceImpl).inSingletonScope();
container.bind(TYPES.Services.ITransactionService).to(TransactionServiceImpl).inSingletonScope();
container.bind(TYPES.Services.ICardService).to(CardServiceImpl).inSingletonScope();
container.bind(TYPES.Services.IRestaurantService).to(RestaurantServiceImpl).inSingletonScope();

export { container };
