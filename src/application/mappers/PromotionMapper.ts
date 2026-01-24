/**
 * Promotion Mapper
 * 
 * Responsible for converting between Promotion Entity and DTOs.
 * Implements DTO pattern for API contracts.
 */

import { Promotion, PromotionType, PromotionStatus } from '../../domain/entities/promotion/Promotion'

/**
 * Promotion Response DTO
 */
export interface PromotionResponseDTO {
  id: string
  code: string
  name: string
  description: string
  discountType: string
  discountValue: number
  status: string
  startDate: string // ISO 8601
  endDate: string // ISO 8601
  maxUsage: number
  currentUsage: number
  usageRate: number
  applicableTiers: string[]
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
  createdBy: string
}

/**
 * Promotion Summary DTO (for lists)
 */
export interface PromotionSummaryDTO {
  id: string
  code: string
  name: string
  discountValue: number
  status: string
  usageRate: number
  endsAt: string
}

/**
 * Promotion Mapper class
 */
export class PromotionMapper {
  /**
   * Convert Entity to Response DTO
   */
  static toResponseDTO(promotion: Promotion): PromotionResponseDTO {
    const usageRate = Math.round((promotion.rules.currentUsage / promotion.rules.maxUsage) * 100)

    return {
      id: promotion.id,
      code: promotion.code,
      name: promotion.name,
      description: promotion.description,
      discountType: promotion.discount.type,
      discountValue: promotion.discount.value,
      status: promotion.status,
      startDate: promotion.rules.startDate.toISOString(),
      endDate: promotion.rules.endDate.toISOString(),
      maxUsage: promotion.rules.maxUsage,
      currentUsage: promotion.rules.currentUsage,
      usageRate,
      applicableTiers: promotion.discount.applicableTiers,
      createdAt: promotion.createdAt.toISOString(),
      updatedAt: promotion.updatedAt.toISOString(),
      createdBy: promotion.createdBy,
    }
  }

  /**
   * Convert Entity to Summary DTO
   */
  static toSummaryDTO(promotion: Promotion): PromotionSummaryDTO {
    const usageRate = Math.round((promotion.rules.currentUsage / promotion.rules.maxUsage) * 100)

    return {
      id: promotion.id,
      code: promotion.code,
      name: promotion.name,
      discountValue: promotion.discount.value,
      status: promotion.status,
      usageRate,
      endsAt: promotion.rules.endDate.toISOString(),
    }
  }

  /**
   * Convert array of Entities to Response DTOs
   */
  static toResponseDTOs(promotions: Promotion[]): PromotionResponseDTO[] {
    return promotions.map((p) => this.toResponseDTO(p))
  }

  /**
   * Convert array of Entities to Summary DTOs
   */
  static toSummaryDTOs(promotions: Promotion[]): PromotionSummaryDTO[] {
    return promotions.map((p) => this.toSummaryDTO(p))
  }

  /**
   * Convert DTO to API response format
   */
  static toAPIResponse(promotion: Promotion) {
    return {
      success: true,
      data: this.toResponseDTO(promotion),
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Convert error to API response format
   */
  static toErrorResponse(error: Error, statusCode: number = 400) {
    return {
      success: false,
      error: {
        code: error.name,
        message: error.message,
        statusCode,
      },
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Convert list to paginated API response
   */
  static toPaginatedResponse(
    promotions: Promotion[],
    total: number,
    page: number,
    limit: number,
  ) {
    return {
      success: true,
      data: {
        items: this.toSummaryDTOs(promotions),
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      timestamp: new Date().toISOString(),
    }
  }
}

export default PromotionMapper
