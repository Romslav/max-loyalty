import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '../Pagination'

describe('Pagination Component', () => {
  const mockOnPageChange = vi.fn()

  beforeEach(() => {
    mockOnPageChange.mockClear()
  })

  it('should render pagination controls', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByText('← Previous')).toBeInTheDocument()
    expect(screen.getByText('Next →')).toBeInTheDocument()
    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument()
  })

  it('should disable previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const prevButton = screen.getByText('← Previous') as HTMLButtonElement
    expect(prevButton.disabled).toBe(true)
  })

  it('should disable next button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const nextButton = screen.getByText('Next →') as HTMLButtonElement
    expect(nextButton.disabled).toBe(true)
  })

  it('should call onPageChange when clicking page number', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const page2Button = screen.getByText('2')
    fireEvent.click(page2Button)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('should call onPageChange with next page when clicking next button', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const nextButton = screen.getByText('Next →')
    fireEvent.click(nextButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(3)
  })

  it('should call onPageChange with previous page when clicking previous button', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const prevButton = screen.getByText('← Previous')
    fireEvent.click(prevButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('should show all pages when total pages <= 5', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('should show ellipsis when there are many pages', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('⋮')).toBeInTheDocument()
  })

  it('should highlight current page', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const currentPageButton = screen.getByText('2')
    expect(currentPageButton).toHaveClass('bg-blue-600')
    expect(currentPageButton).toHaveClass('text-white')
  })

  it('should disable all buttons when disabled prop is true', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        disabled={true}
      />
    )

    const prevButton = screen.getByText('← Previous') as HTMLButtonElement
    const nextButton = screen.getByText('Next →') as HTMLButtonElement
    const page1Button = screen.getByText('1') as HTMLButtonElement

    expect(prevButton.disabled).toBe(true)
    expect(nextButton.disabled).toBe(true)
    expect(page1Button.disabled).toBe(true)
  })

  it('should handle large page numbers', () => {
    render(
      <Pagination
        currentPage={50}
        totalPages={100}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('Page 50 of 100')).toBeInTheDocument()
  })

  it('should render middle pages correctly', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    )

    // Should show current page and nearby pages
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
