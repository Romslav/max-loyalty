/**
 * Promotion Mock Data
 * 
 * Mock data for development and testing.
 * Should only be used in development environments.
 */

import { PromotionType, PromotionStatus } from '../../domain/entities/promotion/Promotion'

export interface MockPromotion {
  id: string
  code: string
  name: string
  description: string
  discountType: PromotionType
  discountValue: number
  status: PromotionStatus
  startDate: Date
  endDate: Date
  usage: number
  maxUsage: number
  applicableTiers: string[]
}

/**
 * Default mock promotions for development
 */
export const MOCK_PROMOTIONS: MockPromotion[] = [
  {
    id: '1',
    code: 'SUMMER20',
    name: 'Летняя распродажа 20%',
    description: 'Получите скидку 20% на все товары с 1 по 31 августа',
    discountType: PromotionType.PERCENTAGE,
    discountValue: 20,
    status: PromotionStatus.ACTIVE,
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-08-31'),
    usage: 450,
    maxUsage: 1000,
    applicableTiers: ['silver', 'gold', 'platinum'],
  },
  {
    id: '2',
    code: 'VIPONLY',
    name: 'VIP Эксклюзив',
    description: 'Специальное предложение для членов VIP клуба',
    discountType: PromotionType.FIXED_AMOUNT,
    discountValue: 50,
    status: PromotionStatus.ACTIVE,
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-03-31'),
    usage: 150,
    maxUsage: 500,
    applicableTiers: ['vip'],
  },
  {
    id: '3',
    code: 'BIRTHDAY15',
    name: 'День рождения',
    description: 'Скидка 15% в день вашего рождения',
    discountType: PromotionType.PERCENTAGE,
    discountValue: 15,
    status: PromotionStatus.DRAFT,
    startDate: new Date('2026-02-01'),
    endDate: new Date('2026-12-31'),
    usage: 0,
    maxUsage: 10000,
    applicableTiers: ['bronze', 'silver', 'gold', 'platinum', 'vip'],
  },
  {
    id: '4',
    code: 'NEWYEAR2026',
    name: 'Новогодняя программа',
    description: 'Спецпредложение на Новый год 2026',
    discountType: PromotionType.POINTS_MULTIPLIER,
    discountValue: 3,
    status: PromotionStatus.EXPIRED,
    startDate: new Date('2025-12-25'),
    endDate: new Date('2026-01-10'),
    usage: 2340,
    maxUsage: 2000,
    applicableTiers: ['all'],
  },
  {
    id: '5',
    code: 'REFER50',
    name: 'Реферальная программа',
    description: 'Приведи друга - получи скидку 50 рублей',
    discountType: PromotionType.FIXED_AMOUNT,
    discountValue: 50,
    status: PromotionStatus.ACTIVE,
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-12-31'),
    usage: 890,
    maxUsage: 5000,
    applicableTiers: ['bronze', 'silver', 'gold', 'platinum', 'vip'],
  },
]

/**
 * Available tiers for UI
 */
export const AVAILABLE_TIERS = ['bronze', 'silver', 'gold', 'platinum', 'vip'] as const

/**
 * Default form values
 */
export const DEFAULT_FORM_VALUES = {
  name: '',
  description: '',
  code: '',
  discountType: PromotionType.PERCENTAGE,
  discountValue: 10,
  maxDiscount: undefined,
  minPurchase: undefined,
  maxUsesPerGuest: undefined,
  applicableTiers: ['bronze', 'silver', 'gold', 'platinum', 'vip'],
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  maxUsage: 1000,
  scope: 'unlimited' as const,
  requiresBirthday: false,
  requiresReferral: false,
} as const

export default {
  MOCK_PROMOTIONS,
  AVAILABLE_TIERS,
  DEFAULT_FORM_VALUES,
}
