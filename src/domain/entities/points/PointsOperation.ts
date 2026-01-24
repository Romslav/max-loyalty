/**
 * PointsOperation Entity
 * 
 * Represents a points transaction in the loyalty system.
 * Supports add, redeem, and transfer operations with full audit trail.
 */

export type OperationType = 'add' | 'redeem' | 'transfer'
export type OperationStatus = 'pending' | 'completed' | 'failed' | 'cancelled'

export interface PointsOperationProps {
  id: string
  guestId: string
  restaurantId: string
  operationType: OperationType
  amount: number
  description: string
  status: OperationStatus
  recipientGuestId?: string // For transfer operations
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

/**
 * Domain entity for points operations
 * Encapsulates all business rules and invariants
 */
export class PointsOperation {
  private readonly props: PointsOperationProps

  private constructor(props: PointsOperationProps) {
    this.props = {
      ...props,
      updatedAt: props.updatedAt || new Date(),
    }
  }

  // Getters
  get id(): string {
    return this.props.id
  }

  get guestId(): string {
    return this.props.guestId
  }

  get restaurantId(): string {
    return this.props.restaurantId
  }

  get operationType(): OperationType {
    return this.props.operationType
  }

  get amount(): number {
    return this.props.amount
  }

  get description(): string {
    return this.props.description
  }

  get status(): OperationStatus {
    return this.props.status
  }

  get recipientGuestId(): string | undefined {
    return this.props.recipientGuestId
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  get completedAt(): Date | undefined {
    return this.props.completedAt
  }

  // Business methods
  complete(): PointsOperation {
    return new PointsOperation({
      ...this.props,
      status: 'completed',
      completedAt: new Date(),
      updatedAt: new Date(),
    })
  }

  fail(reason?: string): PointsOperation {
    return new PointsOperation({
      ...this.props,
      status: 'failed',
      metadata: { ...this.props.metadata, failureReason: reason },
      updatedAt: new Date(),
    })
  }

  cancel(): PointsOperation {
    return new PointsOperation({
      ...this.props,
      status: 'cancelled',
      updatedAt: new Date(),
    })
  }

  // Factory methods
  static create(props: PointsOperationProps): PointsOperation {
    return new PointsOperation({
      ...props,
      updatedAt: new Date(),
    })
  }

  static createAdd(
    id: string,
    guestId: string,
    restaurantId: string,
    amount: number,
    description: string,
  ): PointsOperation {
    return new PointsOperation({
      id,
      guestId,
      restaurantId,
      operationType: 'add',
      amount,
      description,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static createRedeem(
    id: string,
    guestId: string,
    restaurantId: string,
    amount: number,
    description: string,
  ): PointsOperation {
    return new PointsOperation({
      id,
      guestId,
      restaurantId,
      operationType: 'redeem',
      amount,
      description,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static createTransfer(
    id: string,
    guestId: string,
    recipientGuestId: string,
    restaurantId: string,
    amount: number,
    description: string,
  ): PointsOperation {
    return new PointsOperation({
      id,
      guestId,
      recipientGuestId,
      restaurantId,
      operationType: 'transfer',
      amount,
      description,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  // Conversion to DTO
  toDTO(): PointsOperationProps {
    return { ...this.props }
  }
}
