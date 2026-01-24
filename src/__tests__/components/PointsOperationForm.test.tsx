/**
 * PointsOperationForm Component Tests
 * 
 * Tests for form validation, submission, and error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PointsOperationForm } from '../../components/points/PointsOperationForm'

// Mock the hook
vi.mock('../../hooks/usePointsOperations', () => ({
  usePointsOperations: vi.fn(),
}))

const mockUsePointsOperations = vi.mocked(
  require('../../hooks/usePointsOperations').usePointsOperations,
)

const mockCreateOperation = vi.fn()
const mockFetchBalance = vi.fn()
const mockFetchHistory = vi.fn()

describe('PointsOperationForm', () => {
  beforeEach(() => {
    mockCreateOperation.mockResolvedValue({
      id: 'op-123',
      guestId: 'guest-1',
      operationType: 'add',
      amount: 100,
      status: 'completed',
      description: 'Test',
      createdAt: new Date(),
    })

    mockUsePointsOperations.mockReturnValue({
      balance: 5000,
      totalEarned: 5000,
      totalRedeemed: 0,
      history: [],
      loading: false,
      error: null,
      lastOperation: null,
      createOperation: mockCreateOperation,
      fetchBalance: mockFetchBalance,
      fetchHistory: mockFetchHistory,
      clearError: vi.fn(),
      resetStore: vi.fn(),
      availablePoints: 5000,
      operationsCount: 0,
      lastOperationTime: null,
      isLoading: false,
      hasError: false,
      isEmpty: true,
    })

    vi.clearAllMocks()
  })

  it('should render form with all inputs', () => {
    render(<PointsOperationForm guestId="guest-1" />)
    expect(screen.getByLabelText(/Тип операции/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Количество баллов/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Описание/i)).toBeInTheDocument()
  })

  it('should validate required amount field', async () => {
    const user = userEvent.setup()
    render(<PointsOperationForm guestId="guest-1" />)

    const submitButton = screen.getByRole('button', { name: /Сохранить/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Количество баллов обязательно/i)).toBeInTheDocument()
    })
  })

  it('should validate positive amount', async () => {
    const user = userEvent.setup()
    render(<PointsOperationForm guestId="guest-1" />)

    const amountInput = screen.getByLabelText(/Количество баллов/i)
    const submitButton = screen.getByRole('button', { name: /Сохранить/i })

    await user.type(amountInput, '-100')
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/Количество должно быть больше 0/i),
      ).toBeInTheDocument()
    })
  })

  it('should validate amount does not exceed balance for redeem', async () => {
    const user = userEvent.setup()
    render(<PointsOperationForm guestId="guest-1" operationType="redeem" />)

    const operationTypeSelect = screen.getByLabelText(/Тип операции/i)
    const amountInput = screen.getByLabelText(/Количество баллов/i)
    const submitButton = screen.getByRole('button', { name: /Сохранить/i })

    await user.selectOption(operationTypeSelect, 'redeem')
    await user.type(amountInput, '10000') // More than balance (5000)
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/Недостаточно баллов/i),
      ).toBeInTheDocument()
    })
  })

  it('should validate required description', async () => {
    const user = userEvent.setup()
    render(<PointsOperationForm guestId="guest-1" />)

    const submitButton = screen.getByRole('button', { name: /Сохранить/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/Описание обязательно/i),
      ).toBeInTheDocument()
    })
  })

  it('should validate description length', async () => {
    const user = userEvent.setup()
    render(<PointsOperationForm guestId="guest-1" />)

    const descriptionInput = screen.getByLabelText(/Описание/i)
    const submitButton = screen.getByRole('button', { name: /Сохранить/i })

    await user.type(descriptionInput, 'a'.repeat(501))
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/Описание не должно превышать 500 символов/i),
      ).toBeInTheDocument()
    })
  })

  it('should successfully submit valid add operation', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    render(<PointsOperationForm guestId="guest-1" onSuccess={onSuccess} />)

    const amountInput = screen.getByLabelText(/Количество баллов/i)
    const descriptionInput = screen.getByLabelText(/Описание/i)
    const submitButton = screen.getByRole('button', { name: /Сохранить/i })

    await user.type(amountInput, '100')
    await user.type(descriptionInput, 'Purchase bonus')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          guestId: 'guest-1',
          operationType: 'add',
          amount: 100,
          description: 'Purchase bonus',
        }),
      )
      expect(onSuccess).toHaveBeenCalledWith('op-123')
    })
  })

  it('should show transfer recipient field when operation type is transfer', async () => {
    const user = userEvent.setup()
    render(<PointsOperationForm guestId="guest-1" showRecipient={true} />)

    const operationTypeSelect = screen.getByLabelText(/Тип операции/i)
    await user.selectOption(operationTypeSelect, 'transfer')

    await waitFor(() => {
      expect(screen.getByLabelText(/Получатель/i)).toBeInTheDocument()
    })
  })

  it('should validate transfer recipient is required', async () => {
    const user = userEvent.setup()
    render(<PointsOperationForm guestId="guest-1" showRecipient={true} />)

    const operationTypeSelect = screen.getByLabelText(/Тип операции/i)
    const amountInput = screen.getByLabelText(/Количество баллов/i)
    const descriptionInput = screen.getByLabelText(/Описание/i)
    const submitButton = screen.getByRole('button', { name: /Сохранить/i })

    await user.selectOption(operationTypeSelect, 'transfer')
    await user.type(amountInput, '100')
    await user.type(descriptionInput, 'Transfer to friend')
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/Необходимо указать получателя/i),
      ).toBeInTheDocument()
    })
  })

  it('should show loading state during submission', async () => {
    const user = userEvent.setup()
    mockCreateOperation.mockImplementation(() => new Promise(() => {}))

    render(<PointsOperationForm guestId="guest-1" />)

    const amountInput = screen.getByLabelText(/Количество баллов/i)
    const descriptionInput = screen.getByLabelText(/Описание/i)
    const submitButton = screen.getByRole('button', { name: /Сохранить/i })

    await user.type(amountInput, '100')
    await user.type(descriptionInput, 'Test')
    await user.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toHaveAttribute('aria-busy', 'true')
    })
  })
})
