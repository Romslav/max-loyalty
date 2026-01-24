/**
 * useGuestForm Hook
 * 
 * Custom React hook for managing guest form state and validation.
 * Handles field changes, validation, and error management.
 * Production-ready with TypeScript support.
 */

import { useState, useCallback, useMemo } from 'react'
import { GuestValidator, CreateGuestInput } from '../../application/validators/GuestValidator'

interface FormState extends CreateGuestInput {
  [key: string]: string
}

interface FormErrors {
  [key: string]: string
}

interface UseGuestFormOptions {
  initialValues?: Partial<CreateGuestInput>
  onSubmit?: (values: CreateGuestInput) => void | Promise<void>
  onError?: (errors: FormErrors) => void
}

interface UseGuestFormReturn {
  values: FormState
  errors: FormErrors
  touched: Set<string>
  isValid: boolean
  isDirty: boolean
  isSubmitting: boolean
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  resetForm: () => void
  setFieldValue: (field: string, value: string) => void
  setFieldError: (field: string, error: string) => void
}

/**
 * Custom hook for guest form management
 */
export const useGuestForm = (options: UseGuestFormOptions = {}): UseGuestFormReturn => {
  const validator = useMemo(() => new GuestValidator(), [])

  const initialValues: FormState = {
    email: options.initialValues?.email || '',
    phone: options.initialValues?.phone || '',
    firstName: options.initialValues?.firstName || '',
    lastName: options.initialValues?.lastName || '',
    referredBy: options.initialValues?.referredBy || '',
  }

  const [values, setValues] = useState<FormState>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isDirty = useMemo(
    () => Object.keys(values).some((key) => values[key] !== initialValues[key]),
    [values, initialValues],
  )

  const isValid = useMemo(() => {
    const validationErrors = validator.validate(values as CreateGuestInput)
    return validationErrors.length === 0
  }, [values, validator])

  const validateField = useCallback(
    (name: string, value: string): string => {
      if (!['email', 'phone', 'firstName', 'lastName', 'referredBy'].includes(name)) {
        return ''
      }

      const result = validator.validate({
        ...values,
        [name]: value,
      } as CreateGuestInput)

      const fieldError = result.find((err) => err.field === name)
      return fieldError?.message || ''
    },
    [values, validator],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setValues((prev) => ({ ...prev, [name]: value }))

      // Validate on change if field was touched
      if (touched.has(name)) {
        const error = validateField(name, value)
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }))
      }
    },
    [touched, validateField],
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setTouched((prev) => new Set([...prev, name]))

      const error = validateField(name, value)
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }))
    },
    [validateField],
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsSubmitting(true)

      try {
        // Validate all fields
        const validationResult = validator.validate(values as CreateGuestInput)
        const newErrors: FormErrors = {}

        validationResult.forEach((error) => {
          newErrors[error.field] = error.message
        })

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors)
          options.onError?.(newErrors)
          setIsSubmitting(false)
          return
        }

        // Call onSubmit if provided
        if (options.onSubmit) {
          await options.onSubmit(values as CreateGuestInput)
        }

        setIsSubmitting(false)
      } catch (error) {
        console.error('Form submission error:', error)
        setIsSubmitting(false)
        throw error
      }
    },
    [values, validator, options],
  )

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched(new Set())
    setIsSubmitting(false)
  }, [initialValues])

  const setFieldValue = useCallback((field: string, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }, [])

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }))
  }, [])

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  }
}

export default useGuestForm
