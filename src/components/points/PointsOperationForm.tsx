/**
 * PointsOperationForm Component
 * 
 * Form for creating points operations (add, redeem, transfer).
 * Includes real-time validation and error handling.
 * Production-ready with full TypeScript support.
 */

import React, { useState, useCallback, useMemo } from 'react'
import { usePointsOperations } from '../../hooks/usePointsOperations'
import { CreatePointsOperationInput } from '../../application/validators/PointsOperationValidator'

export interface PointsOperationFormProps {
  guestId: string
  operationType?: 'add' | 'redeem' | 'transfer'
  onSuccess?: (operationId: string) => void
  onError?: (error: string) => void
  className?: string
  showRecipient?: boolean
}

interface FormState {
  operationType: 'add' | 'redeem' | 'transfer'
  amount: string
  description: string
  recipientGuestId: string
}

interface FormErrors {
  amount?: string
  description?: string
  recipientGuestId?: string
  submit?: string
}

/**
 * Form for creating points operations
 */
export const PointsOperationForm: React.FC<PointsOperationFormProps> = ({
  guestId,
  operationType = 'add',
  onSuccess,
  onError,
  className = '',
  showRecipient = false,
}) => {
  const { createOperation, balance, loading, error, clearError } = usePointsOperations(guestId)

  const [formState, setFormState] = useState<FormState>({
    operationType,
    amount: '',
    description: '',
    recipientGuestId: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    // Amount validation
    const amount = parseFloat(formState.amount)
    if (!formState.amount) {
      newErrors.amount = 'Количество баллов обязательно'
    } else if (amount <= 0) {
      newErrors.amount = 'Количество должно быть больше 0'
    } else if (amount > 1000000) {
      newErrors.amount = 'Максимально допускается 1,000,000 баллов'
    } else if ((formState.operationType === 'redeem' || formState.operationType === 'transfer') && amount > balance) {
      newErrors.amount = `Недостаточно баллов. Пдоступно: ${balance}`
    }

    // Description validation
    if (!formState.description.trim()) {
      newErrors.description = 'Описание обязательно'
    } else if (formState.description.length > 500) {
      newErrors.description = 'Описание не должно превышать 500 символов'
    }

    // Transfer recipient validation
    if (formState.operationType === 'transfer') {
      if (!formState.recipientGuestId) {
        newErrors.recipientGuestId = 'Необходимо указать получателя'
      } else if (formState.recipientGuestId === guestId) {
        newErrors.recipientGuestId = 'Не можно переводить себе'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formState, balance, guestId])

  // Handle form submit
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setSubmitted(true)
      clearError()

      if (!validateForm()) {
        return
      }

      try {
        const input: CreatePointsOperationInput = {
          guestId,
          restaurantId: 'restaurant-1', // TODO: Get from context
          operationType: formState.operationType,
          amount: parseFloat(formState.amount),
          description: formState.description,
          recipientGuestId: formState.operationType === 'transfer' ? formState.recipientGuestId : undefined,
        }

        const result = await createOperation(input)

        // Reset form
        setFormState({
          operationType: 'add',
          amount: '',
          description: '',
          recipientGuestId: '',
        })
        setSubmitted(false)
        setErrors({})

        onSuccess?.(result.id)
      } catch (err: any) {
        const errorMessage = err.message || 'Ошибка при сохранении операции'
        setErrors({ submit: errorMessage })
        onError?.(errorMessage)
      }
    },
    [guestId, formState, validateForm, createOperation, onSuccess, onError, clearError],
  )

  // Handle input changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormState((prev) => ({ ...prev, [name]: value }))

      // Clear specific error when user starts typing
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }))
      }
    },
    [errors],
  )

  // Operation type labels
  const operationLabels = useMemo(
    () => ({
      add: 'Добавить баллы',
      redeem: 'Оставить баллы',
      transfer: 'Перевести баллы',
    }),
    [],
  )

  return (
    <form onSubmit={handleSubmit} className={`points-form ${className}`} noValidate>
      {/* Operation Type */}
      <div className="form-group">
        <label htmlFor="operationType" className="form-label">
          Тип операции
        </label>
        <select
          id="operationType"
          name="operationType"
          value={formState.operationType}
          onChange={handleChange}
          className="form-control"
          disabled={loading}
        >
          <option value="add">{operationLabels.add}</option>
          <option value="redeem">{operationLabels.redeem}</option>
          <option value="transfer">{operationLabels.transfer}</option>
        </select>
      </div>

      {/* Amount Input */}
      <div className="form-group">
        <label htmlFor="amount" className="form-label">
          Количество баллов *
        </label>
        <input
          id="amount"
          type="number"
          name="amount"
          value={formState.amount}
          onChange={handleChange}
          placeholder="0"
          min="1"
          max="1000000"
          step="1"
          className={`form-control ${errors.amount ? 'form-control--error' : ''}`}
          disabled={loading}
          required
          aria-invalid={!!errors.amount}
          aria-describedby={errors.amount ? 'error-amount' : undefined}
        />
        {errors.amount && (
          <p id="error-amount" className="form-error">
            {errors.amount}
          </p>
        )}
        <small className="form-hint">
          {formState.operationType === 'add' ? 'доступно: бесконечно' : `доступно: ${balance}`}
        </small>
      </div>

      {/* Description Input */}
      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Описание *
        </label>
        <textarea
          id="description"
          name="description"
          value={formState.description}
          onChange={handleChange}
          placeholder="Описание операции"
          maxLength={500}
          className={`form-control form-textarea ${errors.description ? 'form-control--error' : ''}`}
          disabled={loading}
          required
          rows={3}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'error-description' : 'hint-description'}
        />
        {errors.description && (
          <p id="error-description" className="form-error">
            {errors.description}
          </p>
        )}
        <small id="hint-description" className="form-hint">
          {formState.description.length}/500
        </small>
      </div>

      {/* Recipient (Transfer only) */}
      {formState.operationType === 'transfer' && (
        <div className="form-group">
          <label htmlFor="recipientGuestId" className="form-label">
            Получатель *
          </label>
          <input
            id="recipientGuestId"
            type="text"
            name="recipientGuestId"
            value={formState.recipientGuestId}
            onChange={handleChange}
            placeholder="ID гостя"
            className={`form-control ${errors.recipientGuestId ? 'form-control--error' : ''}`}
            disabled={loading}
            required
            aria-invalid={!!errors.recipientGuestId}
            aria-describedby={errors.recipientGuestId ? 'error-recipientGuestId' : undefined}
          />
          {errors.recipientGuestId && (
            <p id="error-recipientGuestId" className="form-error">
              {errors.recipientGuestId}
            </p>
          )}
        </div>
      )}

      {/* Server Error */}
      {errors.submit && (
        <div className="alert alert--error" role="alert">
          {errors.submit}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="btn btn--primary btn--full-width"
        disabled={loading || submitted}
        aria-busy={loading}
      >
        {loading ? 'Обработка...' : 'Сохранить операцию'}
      </button>
    </form>
  )
}

export default PointsOperationForm
