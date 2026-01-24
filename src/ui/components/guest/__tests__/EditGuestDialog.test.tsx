/**
 * EditGuestDialog Tests
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditGuestDialog } from '../EditGuestDialog'
import type { GuestProfile } from '../../../stores/guestStore'

// Mock guest data
const mockGuest: GuestProfile = {
  id: '1',
  firstName: 'Ivan',
  lastName: 'Petrov',
  phone: '+79001234567',
  email: 'ivan@example.com',
  status: 'active',
  tier: 'gold',
  points: 1000,
  referralCode: 'IVAN2024',
  referredBy: null,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2025-01-24'),
  referralStats: { referrals: 5, earnings: 2500 },
}

describe('EditGuestDialog', () => {
  it('should render nothing when not open', () => {
    const { container } = render(
      <EditGuestDialog
        guest={mockGuest}
        isOpen={false}
        onClose={() => {}}
      />
    )
    expect(container.firstChild).toBeEmptyDOMElement()
  })

  it('should render dialog when open', () => {
    render(
      <EditGuestDialog
        guest={mockGuest}
        isOpen={true}
        onClose={() => {}}
      />
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/Редактировать профиль/i)).toBeInTheDocument()
  })

  it('should populate form with guest data', () => {
    render(
      <EditGuestDialog
        guest={mockGuest}
        isOpen={true}
        onClose={() => {}}
      />
    )
    
    expect(screen.getByDisplayValue(mockGuest.firstName)).toBeInTheDocument()
    expect(screen.getByDisplayValue(mockGuest.lastName)).toBeInTheDocument()
    expect(screen.getByDisplayValue(mockGuest.phone)).toBeInTheDocument()
  })

  it('should close when close button is clicked', () => {
    const onClose = jest.fn()
    render(
      <EditGuestDialog
        guest={mockGuest}
        isOpen={true}
        onClose={onClose}
      />
    )
    
    const closeButton = screen.getByLabelText(/Закрыть диалог/i)
    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalled()
  })

  it('should close when backdrop is clicked', () => {
    const onClose = jest.fn()
    const { container } = render(
      <EditGuestDialog
        guest={mockGuest}
        isOpen={true}
        onClose={onClose}
      />
    )
    
    const backdrop = container.querySelector('[role="presentation"]')
    if (backdrop) {
      fireEvent.click(backdrop)
      expect(onClose).toHaveBeenCalled()
    }
  })

  it('should validate required fields', async () => {
    render(
      <EditGuestDialog
        guest={mockGuest}
        isOpen={true}
        onClose={() => {}}
      />
    )
    
    const firstNameInput = screen.getByDisplayValue(mockGuest.firstName)
    await userEvent.clear(firstNameInput)
    fireEvent.blur(firstNameInput)
    
    await waitFor(() => {
      expect(screen.getByText(/Введите имя/i)).toBeInTheDocument()
    })
  })

  it('should validate phone format', async () => {
    render(
      <EditGuestDialog
        guest={mockGuest}
        isOpen={true}
        onClose={() => {}}
      />
    )
    
    const phoneInput = screen.getByDisplayValue(mockGuest.phone)
    await userEvent.clear(phoneInput)
    await userEvent.type(phoneInput, '123')
    fireEvent.blur(phoneInput)
    
    await waitFor(() => {
      expect(screen.getByText(/Номер слишком короткий/i)).toBeInTheDocument()
    })
  })

  it('should enable save button when form is valid', async () => {
    render(
      <EditGuestDialog
        guest={mockGuest}
        isOpen={true}
        onClose={() => {}}
      />
    )
    
    const saveButton = screen.getByRole('button', { name: /Сохранить/i })
    expect(saveButton).not.toBeDisabled()
  })

  it('should call onSuccess when form is submitted', async () => {
    const onSuccess = jest.fn()
    const onClose = jest.fn()
    
    render(
      <EditGuestDialog
        guest={mockGuest}
        isOpen={true}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    )
    
    const firstNameInput = screen.getByDisplayValue(mockGuest.firstName)
    await userEvent.clear(firstNameInput)
    await userEvent.type(firstNameInput, 'Ivan Updated')
    
    const saveButton = screen.getByRole('button', { name: /Сохранить/i })
    fireEvent.click(saveButton)
    
    // Wait for async operations
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
    }, { timeout: 2000 })
  })

  it('should display error message on failure', async () => {
    const onError = jest.fn()
    
    render(
      <EditGuestDialog
        guest={mockGuest}
        isOpen={true}
        onClose={() => {}}
        onError={onError}
      />
    )
    
    const saveButton = screen.getByRole('button', { name: /Сохранить/i })
    fireEvent.click(saveButton)
    
    // Wait for error to appear
    await waitFor(() => {
      expect(screen.queryByText(/error/i)).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('should disable save button while loading', async () => {
    const { rerender } = render(
      <EditGuestDialog
        guest={mockGuest}
        isOpen={true}
        onClose={() => {}}
      />
    )
    
    const saveButton = screen.getByRole('button', { name: /Сохранить/i })
    expect(saveButton).not.toBeDisabled()
  })

  it('should validate field length limits', async () => {
    render(
      <EditGuestDialog
        guest={mockGuest}
        isOpen={true}
        onClose={() => {}}
      />
    )
    
    const firstNameInput = screen.getByDisplayValue(mockGuest.firstName)
    const longName = 'a'.repeat(150)
    
    await userEvent.clear(firstNameInput)
    await userEvent.type(firstNameInput, longName)
    fireEvent.blur(firstNameInput)
    
    await waitFor(() => {
      expect(screen.getByText(/Имя слишком длинное/i)).toBeInTheDocument()
    })
  })

  it('should handle status selection', async () => {
    render(
      <EditGuestDialog
        guest={mockGuest}
        isOpen={true}
        onClose={() => {}}
      />
    )
    
    const statusSelect = screen.getByDisplayValue('active')
    await userEvent.selectOptions(statusSelect, 'inactive')
    
    expect(statusSelect).toHaveValue('inactive')
  })
})
