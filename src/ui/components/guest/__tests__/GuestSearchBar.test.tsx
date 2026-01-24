/**
 * GuestSearchBar Tests
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GuestSearchBar } from '../GuestSearchBar'

describe('GuestSearchBar', () => {
  it('should render search input', () => {
    render(<GuestSearchBar onSearch={jest.fn()} />)
    expect(screen.getByPlaceholderText(/Поиск гостя/i)).toBeInTheDocument()
  })

  it('should call onSearch with query', async () => {
    const onSearch = jest.fn()
    render(<GuestSearchBar onSearch={onSearch} debounceMs={0} />)
    
    const input = screen.getByPlaceholderText(/Поиск гостя/i)
    await userEvent.type(input, 'Ivan')
    
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('Ivan', {})
    })
  })

  it('should debounce search input', async () => {
    const onSearch = jest.fn()
    render(<GuestSearchBar onSearch={onSearch} debounceMs={100} />)
    
    const input = screen.getByPlaceholderText(/Поиск гостя/i)
    
    await userEvent.type(input, 'Ivan')
    expect(onSearch).not.toHaveBeenCalled()
    
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('Ivan', {})
    }, { timeout: 200 })
  })

  it('should expand filter panel when button clicked', async () => {
    render(<GuestSearchBar onSearch={jest.fn()} />)
    
    const filterButton = screen.getByRole('button', { name: /Фильтры/i })
    fireEvent.click(filterButton)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Уровень/i)).toBeInTheDocument()
    })
  })

  it('should filter by tier', async () => {
    const onSearch = jest.fn()
    render(<GuestSearchBar onSearch={onSearch} debounceMs={0} />)
    
    const filterButton = screen.getByRole('button', { name: /Фильтры/i })
    fireEvent.click(filterButton)
    
    const tierSelect = screen.getByLabelText(/Уровень/i)
    await userEvent.selectOptions(tierSelect, 'gold')
    
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('', { tier: 'gold' })
    })
  })

  it('should filter by status', async () => {
    const onSearch = jest.fn()
    render(<GuestSearchBar onSearch={onSearch} debounceMs={0} />)
    
    const filterButton = screen.getByRole('button', { name: /Фильтры/i })
    fireEvent.click(filterButton)
    
    const statusSelect = screen.getByLabelText(/Статус/i)
    await userEvent.selectOptions(statusSelect, 'active')
    
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('', { status: 'active' })
    })
  })

  it('should show clear button when filters applied', async () => {
    const onSearch = jest.fn()
    render(<GuestSearchBar onSearch={onSearch} debounceMs={0} />)
    
    const input = screen.getByPlaceholderText(/Поиск гостя/i)
    await userEvent.type(input, 'Ivan')
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Очистить/i })).toBeInTheDocument()
    })
  })

  it('should clear search and filters', async () => {
    const onSearch = jest.fn()
    const onClear = jest.fn()
    render(<GuestSearchBar onSearch={onSearch} onClear={onClear} debounceMs={0} />)
    
    const input = screen.getByPlaceholderText(/Поиск гостя/i)
    await userEvent.type(input, 'Ivan')
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Очистить/i })).toBeInTheDocument()
    })
    
    const clearButton = screen.getByRole('button', { name: /Очистить/i })
    fireEvent.click(clearButton)
    
    expect(input).toHaveValue('')
    expect(onClear).toHaveBeenCalled()
  })

  it('should display active filters summary', async () => {
    const onSearch = jest.fn()
    render(<GuestSearchBar onSearch={onSearch} debounceMs={0} />)
    
    const filterButton = screen.getByRole('button', { name: /Фильтры/i })
    fireEvent.click(filterButton)
    
    const input = screen.getByPlaceholderText(/Поиск гостя/i)
    await userEvent.type(input, 'test')
    
    await waitFor(() => {
      expect(screen.getByText(/Поиск: test/i)).toBeInTheDocument()
    })
  })

  it('should accept custom placeholder', () => {
    render(<GuestSearchBar onSearch={jest.fn()} placeholder="Custom placeholder" />)
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <GuestSearchBar onSearch={jest.fn()} className="custom-class" />
    )
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })

  it('should combine search and tier filter', async () => {
    const onSearch = jest.fn()
    render(<GuestSearchBar onSearch={onSearch} debounceMs={0} />)
    
    const filterButton = screen.getByRole('button', { name: /Фильтры/i })
    fireEvent.click(filterButton)
    
    const input = screen.getByPlaceholderText(/Поиск гостя/i)
    await userEvent.type(input, 'Ivan')
    
    const tierSelect = screen.getByLabelText(/Уровень/i)
    await userEvent.selectOptions(tierSelect, 'gold')
    
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('Ivan', { tier: 'gold' })
    })
  })

  it('should toggle filter panel visibility', async () => {
    render(<GuestSearchBar onSearch={jest.fn()} />)
    
    const filterButton = screen.getByRole('button', { name: /Фильтры/i })
    
    // First click - expand
    fireEvent.click(filterButton)
    await waitFor(() => {
      expect(screen.getByLabelText(/Уровень/i)).toBeInTheDocument()
    })
    
    // Second click - collapse
    fireEvent.click(filterButton)
    await waitFor(() => {
      expect(screen.queryByLabelText(/Уровень/i)).not.toBeInTheDocument()
    })
  })
})
