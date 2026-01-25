export const TYPES = {
  Repositories: {
    IGuestRepository: Symbol.for('IGuestRepository'),
    IGuestRestaurantRepository: Symbol.for('IGuestRestaurantRepository'),
    ITransactionRepository: Symbol.for('ITransactionRepository'),
    ICardIdentifierRepository: Symbol.for('ICardIdentifierRepository'),
    IBalanceDetailRepository: Symbol.for('IBalanceDetailRepository'),
    ITierEventRepository: Symbol.for('ITierEventRepository'),
    ITierDefinitionRepository: Symbol.for('ITierDefinitionRepository'),
    IRestaurantRepository: Symbol.for('IRestaurantRepository'),
    IPhoneVerificationRepository: Symbol.for('IPhoneVerificationRepository'),
    IGuestChildrenRepository: Symbol.for('IGuestChildrenRepository'),
  },
  Services: {
    IGuestService: Symbol.for('IGuestService'),
    ITransactionService: Symbol.for('ITransactionService'),
    ICardService: Symbol.for('ICardService'),
    IRestaurantService: Symbol.for('IRestaurantService'),
  },
};
