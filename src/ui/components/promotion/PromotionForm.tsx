/**
 * PromotionForm Component
 * 
 * Form for creating and editing promotional campaigns.
 * Full validation and real-time feedback.
 */

import React, { useState, useCallback } from 'react'

export interface PromotionFormData {
  name: string
  description: string
  type: 'percentage' | 'fixed' | 'tiered' | 'buy_x_get_y' | 'birthday'
  discountValue: number
  discountType: 'percentage' | 'fixed'
  startDate: string
  endDate: string
  targetAudience: 'all' | 'tier' | 'new_users' | 'vip'
  numCodes: number
  minOrderAmount?: number
  maxDiscount?: number
}

interface PromotionFormProps {
  onSubmit: (data: PromotionFormData) => void
  onCancel: () => void
  isLoading?: boolean
  initialData?: Partial<PromotionFormData>
}

interface FormErrors {
  [key: string]: string
}

/**
 * PromotionForm Component
 */
export const PromotionForm: React.FC<PromotionFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}) => {
  const defaultFormData: PromotionFormData = {
    name: '',
    description: '',
    type: 'percentage',
    discountValue: 10,
    discountType: 'percentage',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    targetAudience: 'all',
    numCodes: 100,
  }

  const [formData, setFormData] = useState<PromotionFormData>({
    ...defaultFormData,
    ...initialData,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  const validateField = useCallback((name: string, value: any): string | null => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Название кампании обязательно'
        if (value.length > 100) return 'Название не должно превышать 100 символов'
        return null
      case 'description':
        if (!value.trim()) return 'Описание обязательно'
        if (value.length > 500) return 'Описание не должно превышать 500 символов'
        return null
      case 'discountValue':
        if (value <= 0) return 'Скидка должна быть больше 0'
        if (formData.discountType === 'percentage' && value > 100) {
          return 'Процент не должен превышать 100%'
        }
        return null
      case 'numCodes':
        if (value < 1) return 'Минимум 1 код'
        if (value > 10000) return 'Максимум 10000 кодов'
        return null
      case 'startDate':
        if (!value) return 'Дата начала обязательна'
        return null
      case 'endDate':
        if (!value) return 'Дата окончания обязательна'
        if (new Date(value) <= new Date(formData.startDate)) {
          return 'Дата окончания должна быть после даты начала'
        }
        return null
      case 'minOrderAmount':
        if (value && value < 0) return 'Сумма не должна быть отрицательной'
        return null
      case 'maxDiscount':
        if (value && value < 0) return 'Сумма не должна быть отрицательной'
        return null
      default:
        return null
    }
  }, [formData.discountType, formData.startDate])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      const newValue = name.includes('Value') || name.includes('Codes') || name.includes('Amount') || name.includes('Discount')
        ? value === ''
          ? 0
          : Number(value)
        : value

      setFormData((prev) => ({ ...prev, [name]: newValue }))

      if (touched.has(name)) {
        const error = validateField(name, newValue)
        setErrors((prev) => ({
          ...prev,
          [name]: error || '',
        }))
      }
    },
    [touched, validateField],
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setTouched((prev) => new Set([...prev, name]))

      const error = validateField(name, name.includes('Value') || name.includes('Codes') || name.includes('Amount') || name.includes('Discount') ? Number(value) : value)
      setErrors((prev) => ({
        ...prev,
        [name]: error || '',
      }))
    },
    [validateField],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      // Validate all fields
      const newErrors: FormErrors = {}
      Object.entries(formData).forEach(([key, value]) => {
        const error = validateField(key, value)
        if (error) newErrors[key] = error
      })

      setErrors(newErrors)
      setTouched(new Set(Object.keys(formData)))

      if (Object.keys(newErrors).length === 0) {
        onSubmit(formData)
      }
    },
    [formData, validateField, onSubmit],
  )

  const getInputClass = (fieldName: string) => `
    w-full rounded-lg border px-3 py-2 transition-colors focus:outline-none focus:ring-2
    ${
      errors[fieldName]
        ? 'border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 bg-white focus:border-teal-500 focus:ring-teal-500'
    }
  `

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Main Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">📋 Основная информация</h3>

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
            placeholder="Например: Летняя распродажа"
            className={getInputClass('name')}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-red-600">
              {errors.name}
            </p>
          )}
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
            placeholder="Описание кампании"
            rows={3}
            className={getInputClass('description')}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'description-error' : undefined}
          />
          {errors.description && (
            <p id="description-error" className="text-sm text-red-600">
              {errors.description}
            </p>
          )}
        </div>
      </div>

      {/* Discount Configuration */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-lg font-semibold text-gray-900">💰 Скидка</h3>

        <div className="grid gap-4 md:grid-cols-2">
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
              className={getInputClass('discountType')}
            >
              <option value="percentage">Процент (%)</option>
              <option value="fixed">Фиксированная сумма (₽)</option>
            </select>
          </div>

          {/* Discount Value */}
          <div className="space-y-1">
            <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
              Размер скидки <span className="text-red-600">*</span>
            </label>
            <input
              id="discountValue"
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              onBlur={handleBlur}
              min="1"
              max={formData.discountType === 'percentage' ? '100' : '999999'}
              className={getInputClass('discountValue')}
              aria-invalid={!!errors.discountValue}
            />
            {errors.discountValue && (
              <p className="text-sm text-red-600">{errors.discountValue}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Min Order Amount */}
          <div className="space-y-1">
            <label htmlFor="minOrderAmount" className="block text-sm font-medium text-gray-700">
              Минимальная сумма заказа (опционально)
            </label>
            <input
              id="minOrderAmount"
              type="number"
              name="minOrderAmount"
              value={formData.minOrderAmount || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              min="0"
              className={getInputClass('minOrderAmount')}
              aria-invalid={!!errors.minOrderAmount}
            />
            {errors.minOrderAmount && (
              <p className="text-sm text-red-600">{errors.minOrderAmount}</p>
            )}
          </div>

          {/* Max Discount */}
          <div className="space-y-1">
            <label htmlFor="maxDiscount" className="block text-sm font-medium text-gray-700">
              Максимальная скидка (опционально)
            </label>
            <input
              id="maxDiscount"
              type="number"
              name="maxDiscount"
              value={formData.maxDiscount || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              min="0"
              className={getInputClass('maxDiscount')}
              aria-invalid={!!errors.maxDiscount}
            />
            {errors.maxDiscount && (
              <p className="text-sm text-red-600">{errors.maxDiscount}</p>
            )}
          </div>
        </div>
      </div>

      {/* Campaign Period */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-lg font-semibold text-gray-900">📅 Период кампании</h3>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Start Date */}
          <div className="space-y-1">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Дата начала <span className="text-red-600">*</span>
            </label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClass('startDate')}
              aria-invalid={!!errors.startDate}
            />
            {errors.startDate && (
              <p className="text-sm text-red-600">{errors.startDate}</p>
            )}
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
              className={getInputClass('endDate')}
              aria-invalid={!!errors.endDate}
            />
            {errors.endDate && (
              <p className="text-sm text-red-600">{errors.endDate}</p>
            )}
          </div>
        </div>
      </div>

      {/* Codes Configuration */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-lg font-semibold text-gray-900">🔑 Промокоды</h3>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Number of Codes */}
          <div className="space-y-1">
            <label htmlFor="numCodes" className="block text-sm font-medium text-gray-700">
              Количество кодов <span className="text-red-600">*</span>
            </label>
            <input
              id="numCodes"
              type="number"
              name="numCodes"
              value={formData.numCodes}
              onChange={handleChange}
              onBlur={handleBlur}
              min="1"
              max="10000"
              className={getInputClass('numCodes')}
              aria-invalid={!!errors.numCodes}
            />
            {errors.numCodes && (
              <p className="text-sm text-red-600">{errors.numCodes}</p>
            )}
          </div>

          {/* Target Audience */}
          <div className="space-y-1">
            <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
              Целевая аудитория
            </label>
            <select
              id="targetAudience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              className={getInputClass('targetAudience')}
            >
              <option value="all">Все гости</option>
              <option value="tier">По уровню</option>
              <option value="new_users">Новые гости</option>
              <option value="vip">VIP гости</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-lg bg-teal-600 px-4 py-2 font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-busy={isLoading}
        >
          {isLoading ? 'Создание...' : 'Создать кампанию'}
        </button>
      </div>
    </form>
  )
}

export default PromotionForm
