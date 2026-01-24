/**
 * GuestProfileCard Component Tests
 * 
 * Comprehensive test suite for guest profile card component.
 * Tests rendering, interactions, and accessibility.
 */

import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GuestProfileCard } from '../GuestProfileCard'
import { type GuestProfile } from '../../../../stores/guestStore'

const mockProfile: GuestProfile = {
  id: 'guest-123',
  email: 'john@example.com',
  phone: '+79991234567',
  firstName: 'John',
  lastName: 'Doe',
  status: 'active',
  tier: 'gold',
  referralCode: 'REF-ABCD1234',
  joinedAt: new Date('2024-01-01'),
  lastVisit: new Date('2024-01-20'),
  totalVisits: 15,
  totalSpent: 1500,
}

describe('GuestProfileCard Component', () => {
  it('should render profile information', () => {
    render(
      <GuestProfileCard
        profile={mockProfile}
        currentPoints={2500}
        maxPoints={3500}
      />,
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('+79991234567')).toBeInTheDocument()
  })

  it('should display tier badge', () => {
    render(
      <GuestProfileCard
        profile={mockProfile}
        currentPoints={2500}
        maxPoints={3500}
      />,
    )

    expect(screen.getByText('Gold')).toBeInTheDocument()
  })

  it('should display statistics', () => {
    render(
      <GuestProfileCard
        profile={mockProfile}
        currentPoints={2500}
        maxPoints={3500}
      />,
    )

    expect(screen.getByText('15')).toBeInTheDocument() // visits
    expect(screen.getByText('$1500.00')).toBeInTheDocument() // spent
  })

  it('should display referral code', () => {
    render(
      <GuestProfileCard
        profile={mockProfile}
        currentPoints={2500}
        maxPoints={3500}
      />,
    )

    expect(screen.getByDisplayValue('REF-ABCD1234')).toBeInTheDocument()
  })

  it('should display status badge', () => {
    render(
      <GuestProfileCard
        profile={mockProfile}
        currentPoints={2500}
        maxPoints={3500}
      />,
    )

    expect(screen.getByText('Активный')).toBeInTheDocument()
  })

  it('should show progress bar', () => {
    const { container } = render(
      <GuestProfileCard
        profile={mockProfile}
        currentPoints={2500}
        maxPoints={3500}
      />,
    )

    const progressBar = container.querySelector('[role="progressbar"]')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow', '2500')
    expect(progressBar).toHaveAttribute('aria-valuemax', '3500')
  })

  it('should call onEditClick when edit button is clicked', () => {
    const onEditClick = vi.fn()
    render(
      <GuestProfileCard
        profile={mockProfile}
        currentPoints={2500}
        maxPoints={3500}
        onEditClick={onEditClick}
      />,
    )

    const editButton = screen.getByRole('button', { name: /редактировать/i })
    fireEvent.click(editButton)

    expect(onEditClick).toHaveBeenCalledTimes(1)
  })

  it('should call onViewDetailsClick when details button is clicked', () => {
    const onViewDetailsClick = vi.fn()
    render(
      <GuestProfileCard
        profile={mockProfile}
        currentPoints={2500}
        maxPoints={3500}
        onViewDetailsClick={onViewDetailsClick}
      />,
    )

    const detailsButton = screen.getByRole('button', { name: /подробнее/i })
    fireEvent.click(detailsButton)

    expect(onViewDetailsClick).toHaveBeenCalledTimes(1)
  })

  it('should call onReferClick when share button is clicked', () => {
    const onReferClick = vi.fn()
    render(
      <GuestProfileCard
        profile={mockProfile}
        currentPoints={2500}
        maxPoints={3500}
        onReferClick={onReferClick}
      />,
    )

    const shareButton = screen.getByRole('button', { name: /поделиться/i })
    fireEvent.click(shareButton)

    expect(onReferClick).toHaveBeenCalledTimes(1)
  })

  it('should show loading state', () => {
    const { container } = render(
      <GuestProfileCard
        profile={mockProfile}
        currentPoints={2500}
        maxPoints={3500}
        loading={true}
      />,
    )

    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should display different statuses', () => {
    const inactiveProfile = { ...mockProfile, status: 'inactive' }
    const { rerender } = render(
      <GuestProfileCard profile={inactiveProfile} />,
    )

    expect(screen.getByText('Неактивный')).toBeInTheDocument()

    const blockedProfile = { ...mockProfile, status: 'blocked' }
    rerender(<GuestProfileCard profile={blockedProfile} />)
    expect(screen.getByText('Заблокирован')).toBeInTheDocument()
  })

  it('should handle missing lastVisit gracefully', () => {
    const profileWithoutLastVisit = { ...mockProfile, lastVisit: undefined }
    render(
      <GuestProfileCard
        profile={profileWithoutLastVisit}
        currentPoints={2500}
        maxPoints={3500}
      />,
    )

    expect(screen.getByText('—')).toBeInTheDocument()
  })
})
