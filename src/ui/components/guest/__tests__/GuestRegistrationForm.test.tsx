/**
 * GuestRegistrationForm Component Tests
 * 
 * Comprehensive test suite for guest registration form.
 * Tests validation, form submission, and error handling.
 */

import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GuestRegistrationForm } from '../GuestRegistrationForm'
import { useGuestStore } from '../../../../stores/guestStore'

vi.mock('../../../../stores/guestStore', () => ({
  useGuestStore: vi.fn(),
}))

describe('GuestRegistrationForm Component', () => {
  const mockCreateGuest = vi.fn()
  const mockUseGuestStore = useGuestStore as any

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseGuestStore.mockReturnValue({
      createGuest: mockCreateGuest,
      loading: false,
      error: null,
    })
  })

  it('should render form fields', () => {
    render(<GuestRegistrationForm />)

    expect(screen.getByLabelText(/\u0438мя/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/фамилия/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/номер/i)).toBeInTheDocument()
  })

  it('should show validation error for empty email', async () => {
    const user = userEvent.setup()
    render(<GuestRegistrationForm />)

    const submitButton = screen.getByRole('button', { name: /регистрироваться/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/введите email/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for invalid email', async () => {
    const user = userEvent.setup()
    render(<GuestRegistrationForm />)

    const emailInput = screen.getByPlaceholderText('john@example.com')
    await user.type(emailInput, 'invalid-email')

    const submitButton = screen.getByRole('button', { name: /регистрироваться/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/неверный формат email/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for short phone', async () => {
    const user = userEvent.setup()
    render(<GuestRegistrationForm />)

    const phoneInput = screen.getByPlaceholderText(/\+7 999/)
    await user.type(phoneInput, '123456789')

    const submitButton = screen.getByRole('button', { name: /регистрироваться/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/нумер слишком короткий/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for empty name fields', async () => {
    const user = userEvent.setup()
    render(<GuestRegistrationForm />)

    const submitButton = screen.getByRole('button', { name: /регистрироваться/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/введите имя/i)).toBeInTheDocument()
      expect(screen.getByText(/введите фамилию/i)).toBeInTheDocument()
    })
  })

  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    mockCreateGuest.mockResolvedValue({ id: 'guest-123' })

    render(<GuestRegistrationForm onSuccess={onSuccess} />)

    await user.type(screen.getByPlaceholderText('John'), 'John')
    await user.type(screen.getByPlaceholderText('Doe'), 'Doe')
    await user.type(screen.getByPlaceholderText('john@example.com'), 'john@example.com')
    await user.type(screen.getByPlaceholderText(/\+7 999/), '+79991234567')

    const submitButton = screen.getByRole('button', { name: /регистрироваться/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateGuest).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+79991234567',
        }),
      )
      expect(onSuccess).toHaveBeenCalledWith('guest-123')
    })
  })

  it('should submit form with referral code', async () => {
    const user = userEvent.setup()
    mockCreateGuest.mockResolvedValue({ id: 'guest-123' })

    render(<GuestRegistrationForm showReferralField={true} />)

    await user.type(screen.getByPlaceholderText('John'), 'John')
    await user.type(screen.getByPlaceholderText('Doe'), 'Doe')
    await user.type(screen.getByPlaceholderText('john@example.com'), 'john@example.com')
    await user.type(screen.getByPlaceholderText(/\+7 999/), '+79991234567')
    await user.type(screen.getByPlaceholderText('REF-XXXXXXXX'), 'REF-ABCD1234')

    const submitButton = screen.getByRole('button', { name: /регистрироваться/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateGuest).toHaveBeenCalledWith(
        expect.objectContaining({
          referredBy: 'REF-ABCD1234',
        }),
      )
    })
  })

  it('should disable submit button while loading', () => {
    mockUseGuestStore.mockReturnValue({
      createGuest: mockCreateGuest,
      loading: true,
      error: null,
    })

    render(<GuestRegistrationForm />)

    const submitButton = screen.getByRole('button', { name: /обработка/i })
    expect(submitButton).toBeDisabled()
  })

  it('should show error alert when API fails', () => {
    mockUseGuestStore.mockReturnValue({
      createGuest: mockCreateGuest,
      loading: false,
      error: 'Email already exists',
    })

    render(<GuestRegistrationForm />)

    expect(screen.getByText(/email already exists/i)).toBeInTheDocument()
  })

  it('should handle onError callback', async () => {
    const user = userEvent.setup()
    const onError = vi.fn()

    render(<GuestRegistrationForm onError={onError} />)

    const submitButton = screen.getByRole('button', { name: /регистрироваться/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(onError).toHaveBeenCalled()
    })
  })

  it('should validate on blur', async () => {
    const user = userEvent.setup()
    render(<GuestRegistrationForm />)

    const emailInput = screen.getByPlaceholderText('john@example.com')
    await user.type(emailInput, 'invalid')
    fireEvent.blur(emailInput)

    await waitFor(() => {
      expect(screen.getByText(/неверный формат/i)).toBeInTheDocument()
    })
  })

  it('should accept initial values', () => {
    render(
      <GuestRegistrationForm
        initialValues={{
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          phone: '+79999999999',
        }}
      />,
    )

    expect((screen.getByPlaceholderText('John') as HTMLInputElement).value).toBe('Jane')
    expect((screen.getByPlaceholderText('Doe') as HTMLInputElement).value).toBe('Smith')
  })
})
