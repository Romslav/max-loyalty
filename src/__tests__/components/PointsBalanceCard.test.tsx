/**
 * PointsBalanceCard Component Tests
 * 
 * Tests for balance card display, calculations, and accessibility
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { PointsBalanceCard } from '../../components/points/PointsBalanceCard'
import * as pointsStore from '../../stores/pointsStore'

// Mock the hook
vi.mock('../../hooks/usePointsOperations', () => ({
  usePointsOperations: vi.fn(),
}))

const mockUsePointsOperations = vi.mocked(
  require('../../hooks/usePointsOperations').usePointsOperations,
)

describe('PointsBalanceCard', () => {
  beforeEach(() => {
    mockUsePointsOperations.mockReturnValue({
      balance: 1000,
      totalEarned: 2000,
      totalRedeemed: 1000,
      history: [],
      loading: false,
      error: null,
      lastOperation: null,
      createOperation: vi.fn(),
      fetchBalance: vi.fn(),
      fetchHistory: vi.fn(),
      clearError: vi.fn(),
      resetStore: vi.fn(),
      availablePoints: 1000,
      operationsCount: 0,
      lastOperationTime: null,
      isLoading: false,
      hasError: false,
      isEmpty: true,
    })
  })

  it('should render balance card with correct balance', () => {
    render(<PointsBalanceCard guestId="guest-1" />
    screen.getByText('Ваши баллы')
    expect(screen.getByLabelText('1000 баллов')).toBeInTheDocument()
  })

  it('should display earned and redeemed details', () => {
    render(<PointsBalanceCard guestId="guest-1" showDetails={true} />)
    expect(screen.getByText('+2 000')).toBeInTheDocument()
    expect(screen.getByText('-1 000')).toBeInTheDocument()
  })

  it('should calculate and display percentage used correctly', () => {
    render(<PointsBalanceCard guestId="guest-1" showDetails={true} />)
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('should show loading indicator when loading', () => {
    mockUsePointsOperations.mockReturnValue({
      balance: 1000,
      totalEarned: 2000,
      totalRedeemed: 1000,
      history: [],
      loading: true,
      error: null,
      lastOperation: null,
      createOperation: vi.fn(),
      fetchBalance: vi.fn(),
      fetchHistory: vi.fn(),
      clearError: vi.fn(),
      resetStore: vi.fn(),
      availablePoints: 1000,
      operationsCount: 0,
      lastOperationTime: null,
      isLoading: true,
      hasError: false,
      isEmpty: true,
    })

    render(<PointsBalanceCard guestId="guest-1" />)
    expect(screen.getByLabelText('Загрузка')).toBeInTheDocument()
  })

  it('should display error message when error occurs', () => {
    mockUsePointsOperations.mockReturnValue({
      balance: 0,
      totalEarned: 0,
      totalRedeemed: 0,
      history: [],
      loading: false,
      error: 'Failed to fetch balance',
      lastOperation: null,
      createOperation: vi.fn(),
      fetchBalance: vi.fn(),
      fetchHistory: vi.fn(),
      clearError: vi.fn(),
      resetStore: vi.fn(),
      availablePoints: 0,
      operationsCount: 0,
      lastOperationTime: null,
      isLoading: false,
      hasError: true,
      isEmpty: true,
    })

    render(<PointsBalanceCard guestId="guest-1" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Failed to fetch balance')).toBeInTheDocument()
  })

  it('should show operation count when showHistory is true', () => {
    mockUsePointsOperations.mockReturnValue({
      balance: 1000,
      totalEarned: 2000,
      totalRedeemed: 1000,
      history: [{}, {}, {}] as any,
      loading: false,
      error: null,
      lastOperation: null,
      createOperation: vi.fn(),
      fetchBalance: vi.fn(),
      fetchHistory: vi.fn(),
      clearError: vi.fn(),
      resetStore: vi.fn(),
      availablePoints: 1000,
      operationsCount: 3,
      lastOperationTime: null,
      isLoading: false,
      hasError: false,
      isEmpty: false,
    })

    render(<PointsBalanceCard guestId="guest-1" showHistory={true} />)
    expect(screen.getByText('Операций:', { exact: false })).toBeInTheDocument()
  })

  it('should handle zero earned points', () => {
    mockUsePointsOperations.mockReturnValue({
      balance: 0,
      totalEarned: 0,
      totalRedeemed: 0,
      history: [],
      loading: false,
      error: null,
      lastOperation: null,
      createOperation: vi.fn(),
      fetchBalance: vi.fn(),
      fetchHistory: vi.fn(),
      clearError: vi.fn(),
      resetStore: vi.fn(),
      availablePoints: 0,
      operationsCount: 0,
      lastOperationTime: null,
      isLoading: false,
      hasError: false,
      isEmpty: true,
    })

    render(<PointsBalanceCard guestId="guest-1" showDetails={true} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('should be accessible with ARIA labels', () => {
    render(<PointsBalanceCard guestId="guest-1" showDetails={true} />)

    // Check for ARIA labels
    expect(screen.getByLabelText('1000 баллов')).toHaveAttribute('aria-label')
    expect(screen.getByLabelText('50% баллов', { exact: false })).toHaveAttribute('aria-label')
  })

  it('should apply custom className', () => {
    const { container } = render(
      <PointsBalanceCard guestId="guest-1" className="custom-class" />,
    )
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })

  it('should display correct locale for numbers', () => {
    mockUsePointsOperations.mockReturnValue({
      balance: 1000000,
      totalEarned: 2000000,
      totalRedeemed: 1000000,
      history: [],
      loading: false,
      error: null,
      lastOperation: null,
      createOperation: vi.fn(),
      fetchBalance: vi.fn(),
      fetchHistory: vi.fn(),
      clearError: vi.fn(),
      resetStore: vi.fn(),
      availablePoints: 1000000,
      operationsCount: 0,
      lastOperationTime: null,
      isLoading: false,
      hasError: false,
      isEmpty: true,
    })

    render(<PointsBalanceCard guestId="guest-1" />)
    // Russian locale formatting with spaces
    expect(screen.getByText(/1\s*000\s*000/)).toBeInTheDocument()
  })
})
