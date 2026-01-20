import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SearchInput } from '../SearchInput'

describe('SearchInput Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('should render input field', () => {
    const mockOnChange = vi.fn()
    render(
      <SearchInput
        placeholder="Search items..."
        value=""
        onChange={mockOnChange}
      />
    )

    const input = screen.getByPlaceholderText('Search items...')
    expect(input).toBeInTheDocument()
  })

  it('should use default placeholder', () => {
    const mockOnChange = vi.fn()
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
      />
    )

    const input = screen.getByPlaceholderText('Search...')
    expect(input).toBeInTheDocument()
  })

  it('should update local input value immediately on typing', () => {
    const mockOnChange = vi.fn()
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
      />
    )

    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'test' } })

    expect(input.value).toBe('test')
  })

  it('should debounce onChange callback', () => {
    const mockOnChange = vi.fn()
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        debounceMs={500}
      />
    )

    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'test' } })

    // Should not be called immediately
    expect(mockOnChange).not.toHaveBeenCalled()

    // Advance time by debounce delay
    vi.advanceTimersByTime(500)

    // Should be called after debounce
    expect(mockOnChange).toHaveBeenCalledWith('test')
  })

  it('should cancel previous debounce on quick typing', () => {
    const mockOnChange = vi.fn()
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        debounceMs={500}
      />
    )

    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement

    fireEvent.change(input, { target: { value: 'te' } })
    vi.advanceTimersByTime(200)

    fireEvent.change(input, { target: { value: 'tes' } })
    vi.advanceTimersByTime(200)

    fireEvent.change(input, { target: { value: 'test' } })
    vi.advanceTimersByTime(500)

    // Should only call once with the final value
    expect(mockOnChange).toHaveBeenCalledTimes(1)
    expect(mockOnChange).toHaveBeenCalledWith('test')
  })

  it('should show clear button when input has value', () => {
    const mockOnChange = vi.fn()
    render(
      <SearchInput
        value="test"
        onChange={mockOnChange}
      />
    )

    const clearButton = screen.getByLabelText('Clear search')
    expect(clearButton).toBeInTheDocument()
  })

  it('should not show clear button when input is empty', () => {
    const mockOnChange = vi.fn()
    const { queryByLabelText } = render(
      <SearchInput
        value=""
        onChange={mockOnChange}
      />
    )

    const clearButton = queryByLabelText('Clear search')
    expect(clearButton).not.toBeInTheDocument()
  })

  it('should clear input when clicking clear button', () => {
    const mockOnChange = vi.fn()
    render(
      <SearchInput
        value="test"
        onChange={mockOnChange}
      />
    )

    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement
    const clearButton = screen.getByLabelText('Clear search')

    fireEvent.click(clearButton)

    expect(input.value).toBe('')
  })

  it('should call onChange with empty string when clearing', () => {
    const mockOnChange = vi.fn()
    render(
      <SearchInput
        value="test"
        onChange={mockOnChange}
      />
    )

    const clearButton = screen.getByLabelText('Clear search')
    fireEvent.click(clearButton)

    vi.advanceTimersByTime(500)

    expect(mockOnChange).toHaveBeenCalledWith('')
  })

  it('should update input when value prop changes', () => {
    const mockOnChange = vi.fn()
    const { rerender } = render(
      <SearchInput
        value="initial"
        onChange={mockOnChange}
      />
    )

    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement
    expect(input.value).toBe('initial')

    rerender(
      <SearchInput
        value="updated"
        onChange={mockOnChange}
      />
    )

    expect(input.value).toBe('updated')
  })

  it('should render search icon', () => {
    const mockOnChange = vi.fn()
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
      />
    )

    expect(screen.getByText('🔍')).toBeInTheDocument()
  })

  it('should respect custom debounce delay', () => {
    const mockOnChange = vi.fn()
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        debounceMs={1000}
      />
    )

    const input = screen.getByPlaceholderText('Search...')
    fireEvent.change(input, { target: { value: 'test' } })

    // Should not be called at 500ms
    vi.advanceTimersByTime(500)
    expect(mockOnChange).not.toHaveBeenCalled()

    // Should be called at 1000ms
    vi.advanceTimersByTime(500)
    expect(mockOnChange).toHaveBeenCalledWith('test')
  })
})
