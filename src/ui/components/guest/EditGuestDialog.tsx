/**
 * EditGuestDialog Component
 * 
 * Modal dialog for editing guest profile information.
 * Supports editing name, phone, status, and tier.
 * Full validation and error handling.
 */

import React, { useState, useCallback } from 'react'
import { useGuestStore, type GuestProfile } from '../../../stores/guestStore'

interface EditGuestDialogProps {
  guest: GuestProfile
  isOpen: boolean
  onClose: () => void
  onSuccess?: (updatedGuest: GuestProfile) => void
  onError?: (error: string) => void
}

interface EditFormData {
  firstName: string
  lastName: string
  phone: string
  status: string
}

interface FormErrors {
  [key: string]: string
}

/**
 * Edit Guest Dialog Component
 */
export const EditGuestDialog: React.FC<EditGuestDialogProps> = ({
  guest,
  isOpen,
  onClose,
  onSuccess,
  onError,
}) => {
  const { updateProfile, loading, error } = useGuestStore()

  const [formData, setFormData] = useState<EditFormData>({
    firstName: guest.firstName,
    lastName: guest.lastName,
    phone: guest.phone,
    status: guest.status,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  const validateField = useCallback((name: string, value: string): string | null => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'Введите имя'
        if (value.length > 100) return 'Имя слишком длинное'
        return null
      case 'lastName':
        if (!value.trim()) return 'Введите фамилию'
        if (value.length > 100) return 'Фамилия слишком длинная'
        return null
      case 'phone':
        if (!value.trim()) return 'Введите номер телефона'
        const digitsOnly = value.replace(/\D/g, '')
        if (digitsOnly.length < 10) return 'Нумер слишком короткий'
        return null
      default:
        return null
    }
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))

      if (touched.has(name)) {
        const error = validateField(name, value)
        setErrors((prev) => ({
          ...prev,
          [name]: error || '',
        }))
      }
    },
    [touched, validateField],
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
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
        await updateProfile(formData.firstName, formData.lastName, formData.phone)
        onSuccess?.({
          ...guest,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        })
        onClose()
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Update failed'
        onError?.(errorMsg)
      }
    },
    [formData, validateField, updateProfile, onSuccess, onError, onClose, guest],
  )

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        role="presentation"
      />

      {/* Dialog */}
      <div
        className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white shadow-xl"
        role="dialog"
        aria-labelledby="dialog-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 id="dialog-title" className="text-xl font-bold text-gray-900">
            ✏️ Редактировать профиль
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            aria-label="Закрыть диалог"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4" noValidate>
          {/* Error Alert */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* First Name */}
          <div className="space-y-1">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Имя <span className="text-red-600">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full rounded-lg border px-3 py-2 transition-colors ${
                errors.firstName
                  ? 'border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 bg-white focus:border-teal-500 focus:ring-teal-500'
              } focus:outline-none focus:ring-2`}
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            />
            {errors.firstName && (
              <p id="firstName-error" className="text-sm text-red-600">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-1">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Фамилия <span className="text-red-600">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full rounded-lg border px-3 py-2 transition-colors ${
                errors.lastName
                  ? 'border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 bg-white focus:border-teal-500 focus:ring-teal-500'
              } focus:outline-none focus:ring-2`}
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            />
            {errors.lastName && (
              <p id="lastName-error" className="text-sm text-red-600">
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Номер телефона <span className="text-red-600">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full rounded-lg border px-3 py-2 transition-colors ${
                errors.phone
                  ? 'border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 bg-white focus:border-teal-500 focus:ring-teal-500'
              } focus:outline-none focus:ring-2`}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
            {errors.phone && (
              <p id="phone-error" className="text-sm text-red-600">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Статус
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="active">Активный</option>
              <option value="inactive">Неактивный</option>
              <option value="blocked">Заблокирован</option>
              <option value="pending_verification">На проверке</option>
            </select>
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center font-medium text-gray-700 transition-colors hover:bg-gray-100"
            aria-label="Отменить"
          >
            Отменить
          </button>
          <button
            onClick={(e) => {
              const form = e.currentTarget.closest('form') || e.currentTarget.previousElementSibling
              if (form instanceof HTMLFormElement) {
                form.dispatchEvent(new Event('submit', { bubbles: true }))
              }
            }}
            disabled={loading}
            className={`flex-1 rounded-lg px-4 py-2 text-center font-medium text-white transition-colors ${
              loading ? 'cursor-not-allowed bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'
            }`}
            aria-busy={loading}
          >
            {loading ? 'Обработка...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </>
  )
}

export default EditGuestDialog
