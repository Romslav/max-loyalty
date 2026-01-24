/**
 * GuestRegistrationForm Component
 * 
 * Complete registration form for new guests.
 * Includes validation, error handling, and referral code support.
 * Fully accessible with proper form controls.
 */

import React, { useState, useCallback } from 'react'
import { useGuestStore } from '../../../stores/guestStore'
import { CreateGuestInput } from '../../../application/validators/GuestValidator'

interface GuestRegistrationFormProps {
  onSuccess?: (guestId: string) => void
  onError?: (error: string) => void
  initialValues?: Partial<CreateGuestInput>
  showReferralField?: boolean
  className?: string
}

interface FormErrors {
  [key: string]: string
}

/**
 * Guest Registration Form Component
 */
export const GuestRegistrationForm: React.FC<GuestRegistrationFormProps> = ({
  onSuccess,
  onError,
  initialValues = {},
  showReferralField = true,
  className = '',
}) => {
  const { createGuest, loading, error } = useGuestStore()

  const [formData, setFormData] = useState<CreateGuestInput>({
    email: initialValues.email || '',
    phone: initialValues.phone || '',
    firstName: initialValues.firstName || '',
    lastName: initialValues.lastName || '',
    referredBy: initialValues.referredBy || '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)

  const validateField = useCallback((name: string, value: string): string | null => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Введите email'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Неверный формат email'
        if (value.length > 255) return 'Email слишком длинный'
        return null
      case 'phone':
        if (!value.trim()) return 'Введите номер телефона'
        const digitsOnly = value.replace(/\D/g, '')
        if (digitsOnly.length < 10) return 'Нумер слишком короткий (мин 10 цифр)'
        return null
      case 'firstName':
        if (!value.trim()) return 'Введите имя'
        if (value.length > 100) return 'Имя слишком длинное (макс 100 симв)'
        return null
      case 'lastName':
        if (!value.trim()) return 'Введите фамилию'
        if (value.length > 100) return 'Фамилия слишком длинная (макс 100 симв)'
        return null
      case 'referredBy':
        if (value && !/^[a-zA-Z0-9_-]+$/.test(value)) return 'Неверный формат реферального кода'
        return null
      default:
        return null
    }
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Validate on change if field was touched
    if (touched.has(name)) {
      const error = validateField(name, value)
      setErrors((prev) => ({
        ...prev,
        [name]: error || '',
      }))
    }
  }, [touched, validateField])

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched((prev) => new Set([...prev, name]))

    const error = validateField(name, value)
    setErrors((prev) => ({
      ...prev,
      [name]: error || '',
    }))
  }, [validateField])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setSubmitted(true)

      // Validate all fields
      const newErrors: FormErrors = {}
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'referredBy' || value) {
          const error = validateField(key, value)
          if (error) newErrors[key] = error
        }
      })

      setErrors(newErrors)

      if (Object.keys(newErrors).length > 0) {
        onError?.('Please fix validation errors')
        return
      }

      try {
        const result = await createGuest(formData as CreateGuestInput)
        onSuccess?.(result.id)
        // Reset form
        setFormData({ email: '', phone: '', firstName: '', lastName: '', referredBy: '' })
        setTouched(new Set())
        setSubmitted(false)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Registration failed'
        onError?.(errorMsg)
      }
    },
    [formData, validateField, createGuest, onSuccess, onError],
  )

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`} noValidate>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Новый участник</h2>
        <p className="mt-2 text-gray-600">Наполните анкету для присоединения к программе верности</p>
      </div>

      {/* Error Alert */}
      {(error || (submitted && Object.keys(errors).length > 0)) && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">Ошибка регистрации</p>
          <p className="mt-1">{error || 'Проверьте данные и попытайтесь еще'}
          </p>
        </div>
      )}

      {/* Name Fields */}
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Имя"
          name="firstName"
          type="text"
          value={formData.firstName}
          error={errors.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          placeholder="John"
        />
        <FormField
          label="Фамилия"
          name="lastName"
          type="text"
          value={formData.lastName}
          error={errors.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          placeholder="Doe"
        />
      </div>

      {/* Contact Fields */}
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          error={errors.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          placeholder="john@example.com"
        />
        <FormField
          label="Номер телефона"
          name="phone"
          type="tel"
          value={formData.phone}
          error={errors.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          placeholder="+7 999 123-45-67"
        />
      </div>

      {/* Referral Code */}
      {showReferralField && (
        <FormField
          label="Реферальный код (пригласителя)"
          name="referredBy"
          type="text"
          value={formData.referredBy}
          error={errors.referredBy}
          onChange={handleChange}
          onBlur={handleBlur}
          required={false}
          placeholder="REF-XXXXXXXX"
          helperText="Опционально. Если вы найдене через реферальный код"
        />
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-lg px-4 py-3 font-semibold text-white transition-all ${
          loading
            ? 'cursor-not-allowed bg-gray-400'
            : 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800'
        }`}
        aria-busy={loading}
      >
        {loading ? 'Обработка...' : 'Регистрироваться'}
      </button>

      {/* Agreement */}
      <p className="text-center text-xs text-gray-500">
        Прологая регистрацию, вы соглашаетесь с{' '}
        <a href="#" className="text-teal-600 hover:underline">
          Нового полэзу
        </a>
      </p>
    </form>
  )
}

interface FormFieldProps {
  label: string
  name: string
  type: string
  value: string
  error?: string
  required?: boolean
  placeholder?: string
  helperText?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  value,
  error,
  required,
  placeholder,
  helperText,
  onChange,
  onBlur,
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-600">*</span>}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`w-full rounded-lg border px-4 py-2 font-normal transition-colors ${
        error
          ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500'
      } focus:outline-none focus:ring-2`}
      required={required}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
    />
    {error && (
      <p id={`${name}-error`} className="text-sm text-red-600">
        {error}
      </p>
    )}
    {helperText && !
      <p id={`${name}-helper`} className="text-xs text-gray-500">
        {helperText}
      </p>
    }
  </div>
)

export default GuestRegistrationForm
