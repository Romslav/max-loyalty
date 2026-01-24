/**
 * PromotionForm Component
 * 
 * Form for creating and editing promotions.
 * Full validation and multi-step workflow.
 * Production-ready with error handling.
 */

import React, { useState, useCallback } from 'react'
import { PromotionType } from '../../../domain/entities/promotion/Promotion'

interface PromotionFormData {
  name: string
  description: string
  code: string
  discountType: PromotionType
  discountValue: number
  maxDiscount?: number
  minPurchase?: number
  maxUsesPerGuest?: number
  applicableTiers: string[]
  startDate: string
  endDate: string
  maxUsage: number
  scope: 'single_use' | 'per_guest' | 'unlimited'
  requiresBirthday?: boolean
  requiresReferral?: boolean
}

interface PromotionFormProps {
  onSubmit: (data: PromotionFormData) => Promise<void>
  isLoading?: boolean
  error?: string
  onError?: (error: string) => void
  onSuccess?: () => void
}

interface FormErrors {
  [key: string]: string
}

/**
 * PromotionForm Component
 */
export const PromotionForm: React.FC<PromotionFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
  onError,
  onSuccess,
}) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<PromotionFormData>({
    name: '',
    description: '',
    code: '',
    discountType: PromotionType.PERCENTAGE,
    discountValue: 10,
    maxDiscount: undefined,
    minPurchase: undefined,
    maxUsesPerGuest: undefined,
    applicableTiers: ['all'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    maxUsage: 1000,
    scope: 'unlimited',
    requiresBirthday: false,
    requiresReferral: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  const validateField = useCallback((name: string, value: any): string | null => {
    switch (name) {
      case 'name':
        if (!value?.trim()) return 'Промо-имя обязательно'
        if (value.length > 200) return 'Максимум 200 символов'
        return null
      case 'description':
        if (!value?.trim()) return 'Описание обязательно'
        if (value.length > 1000) return 'Максимум 1000 символов'
        return null
      case 'discountValue':
        if (value <= 0) return 'Значение должно быть > 0'
        if (formData.discountType === PromotionType.PERCENTAGE && value > 100) {
          return 'Процент не может быть > 100'
        }
        return null
      case 'maxUsage':
        if (value <= 0) return 'Максимум использований должно быть > 0'
        return null
      case 'endDate':
        if (new Date(value) <= new Date(formData.startDate)) {
          return 'Дата окончания должна быть позже даты начала'
        }
        return null
      default:
        return null
    }
  }, [formData.discountType, formData.startDate])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target
      const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

      setFormData((prev) => ({ ...prev, [name]: finalValue }))

      if (touched.has(name)) {
        const error = validateField(name, finalValue)
        setErrors((prev) => ({
          ...prev,
          [name]: error || '',
        }))
      }
    },
    [touched, validateField],
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setTouched((prev) => new Set([...prev, name]))

      const error = validateField(name, value)
      setErrors((prev) => ({
        ...prev,
        [name]: error || '',
      }))
    },
    [validateField],
  )

  const handleTierToggle = useCallback((tier: string) => {
    setFormData((prev) => {
      const tiers = prev.applicableTiers.includes(tier)
        ? prev.applicableTiers.filter((t) => t !== tier)
        : [...prev.applicableTiers, tier]
      return { ...prev, applicableTiers: tiers.length > 0 ? tiers : ['all'] }
    })
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Validate all fields
      const newErrors: FormErrors = {}
      Object.entries(formData).forEach(([key, value]) => {
        const error = validateField(key, value)
        if (error) newErrors[key] = error
      })

      setErrors(newErrors)

      if (Object.keys(newErrors).length > 0) {
        onError?.('Please fix validation errors')
        return
      }

      try {
        await onSubmit(formData)
        onSuccess?.()
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Submission failed'
        onError?.(errorMsg)
      }
    },
    [formData, validateField, onSubmit, onError, onSuccess],
  )

  const tiers = ['bronze', 'silver', 'gold', 'platinum', 'vip']

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Error Alert */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">📝 Основная информация</h2>

          {/* Name */}
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Название <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full rounded-lg border px-3 py-2 transition-colors ${
                errors.name
                  ? 'border-red-500 bg-red-50 text-red-900'
                  : 'border-gray-300 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500'
              } focus:outline-none`}
              placeholder="Летняя скидка"
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Описание <span className="text-red-600">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={3}
              className={`w-full rounded-lg border px-3 py-2 transition-colors ${
                errors.description
                  ? 'border-red-500 bg-red-50 text-red-900'
                  : 'border-gray-300 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500'
              } focus:outline-none`}
              placeholder="Опишите условия промоакции"
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Code */}
          <div className="space-y-1">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Код (оставьте пусто для автогенерации)
            </label>
            <input
              id="code"
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 uppercase tracking-widest focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="SUMMER20 или оставьте пусто"
            />
          </div>
        </div>
      )}

      {/* Step 2: Discount Configuration */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">💰 Конфигурация скидки</h2>

          {/* Discount Type */}
          <div className="space-y-1">
            <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">
              Тип скидки
            </label>
            <select
              id="discountType"
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value={PromotionType.PERCENTAGE}>📊 Процент</option>
              <option value={PromotionType.FIXED_AMOUNT}>💵 Фиксированная сумма</option>
              <option value={PromotionType.TIER_BASED}>📈 На основе уровня</option>
              <option value={PromotionType.POINTS_MULTIPLIER}>⭐ Множитель очков</option>
            </select>
          </div>

          {/* Discount Value */}
          <div className="space-y-1">
            <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
              Значение скидки <span className="text-red-600">*</span>
            </label>
            <input
              id="discountValue"
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full rounded-lg border px-3 py-2 transition-colors ${
                errors.discountValue
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500'
              } focus:outline-none`}
              min="0.01"
              step="0.01"
            />
            {errors.discountValue && <p className="text-sm text-red-600">{errors.discountValue}</p>}
            <p className="text-xs text-gray-500">
              {formData.discountType === PromotionType.PERCENTAGE ? '0-100%' : 'Валюта'}
            </p>
          </div>

          {/* Max Discount */}
          <div className="space-y-1">
            <label htmlFor="maxDiscount" className="block text-sm font-medium text-gray-700">
              Максимальная скидка
            </label>
            <input
              id="maxDiscount"
              type="number"
              name="maxDiscount"
              value={formData.maxDiscount || ''}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              min="0.01"
              step="0.01"
              placeholder="Оставьте пусто для без ограничений"
            />
          </div>

          {/* Min Purchase */}
          <div className="space-y-1">
            <label htmlFor="minPurchase" className="block text-sm font-medium text-gray-700">
              Минимальная покупка
            </label>
            <input
              id="minPurchase"
              type="number"
              name="minPurchase"
              value={formData.minPurchase || ''}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              min="0.01"
              step="0.01"
              placeholder="Оставьте пусто для без ограничений"
            />
          </div>
        </div>
      )}

      {/* Step 3: Applicability */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">🎯 Применимость</h2>

          {/* Applicable Tiers */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Применимые уровни</p>
            <div className="flex flex-wrap gap-2">
              {tiers.map((tier) => (
                <label key={tier} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.applicableTiers.includes(tier)}
                    onChange={() => handleTierToggle(tier)}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600"
                  />
                  <span className="text-sm capitalize text-gray-700">{tier}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Scope */}
          <div className="space-y-1">
            <label htmlFor="scope" className="block text-sm font-medium text-gray-700">
              Область применения
            </label>
            <select
              id="scope"
              name="scope"
              value={formData.scope}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="single_use">🔐 Одноразовое использование</option>
              <option value="per_guest">👤 Один раз на гостя</option>
              <option value="unlimited">♾️ Неограниченное</option>
            </select>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="requiresBirthday"
                checked={formData.requiresBirthday}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-teal-600"
              />
              <span className="text-sm text-gray-700">🎂 Требует день рождения</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="requiresReferral"
                checked={formData.requiresReferral}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-teal-600"
              />
              <span className="text-sm text-gray-700">👥 Требует реферала</span>
            </label>
          </div>
        </div>
      )}

      {/* Step 4: Schedule */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">📅 Расписание</h2>

          {/* Start Date */}
          <div className="space-y-1">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Дата начала
            </label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* End Date */}
          <div className="space-y-1">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Дата окончания <span className="text-red-600">*</span>
            </label>
            <input
              id="endDate"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full rounded-lg border px-3 py-2 transition-colors ${
                errors.endDate
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500'
              } focus:outline-none`}
            />
            {errors.endDate && <p className="text-sm text-red-600">{errors.endDate}</p>}
          </div>

          {/* Max Usage */}
          <div className="space-y-1">
            <label htmlFor="maxUsage" className="block text-sm font-medium text-gray-700">
              Максимальное использование <span className="text-red-600">*</span>
            </label>
            <input
              id="maxUsage"
              type="number"
              name="maxUsage"
              value={formData.maxUsage}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full rounded-lg border px-3 py-2 transition-colors ${
                errors.maxUsage
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500'
              } focus:outline-none`}
              min="1"
              step="1"
            />
            {errors.maxUsage && <p className="text-sm text-red-600">{errors.maxUsage}</p>}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ← Назад
        </button>
        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="flex-1 rounded-lg bg-teal-600 px-4 py-2 font-medium text-white transition-colors hover:bg-teal-700"
          >
            Далее →
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 rounded-lg bg-teal-600 px-4 py-2 font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Создание...' : '✅ Создать промоакцию'}
          </button>
        )}
      </div>

      {/* Step Indicator */}
      <div className="flex gap-2 justify-center text-xs text-gray-500">
        {Array.from({ length: 4 }).map((_, i) => (
          <button
            key={i + 1}
            type="button"
            onClick={() => setStep(i + 1)}
            className={`h-2 w-2 rounded-full transition-colors ${
              step === i + 1 ? 'bg-teal-600' : 'bg-gray-300'
            }`}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>
    </form>
  )
}

export default PromotionForm
