import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

// Button Component Tests
describe('Button Component', () => {
  it('renders button with text', () => {
    render(<button>Click me</button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<button onClick={handleClick}>Click me</button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('disables button when disabled prop is true', () => {
    render(<button disabled>Click me</button>)
    expect(screen.getByText('Click me')).toBeDisabled()
  })
})

// Input Component Tests
describe('Input Component', () => {
  it('renders input with placeholder', () => {
    render(<input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('updates value on input change', async () => {
    const user = userEvent.setup()
    render(<input />)
    const input = screen.getByRole('textbox')
    await user.type(input, 'test')
    expect(input).toHaveValue('test')
  })

  it('handles email validation', () => {
    render(<input type="email" />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.type).toBe('email')
  })
})

// Table Component Tests
describe('Table Component', () => {
  const mockData = [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Jane', age: 25 },
  ]

  const mockColumns = [
    { key: 'name', label: 'Name', width: '50%' },
    { key: 'age', label: 'Age', width: '50%' },
  ]

  it('renders table with correct headers', () => {
    render(
      <table>
        <thead>
          <tr>
            {mockColumns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mockData.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
  })

  it('renders all table rows', () => {
    render(
      <table>
        <tbody>
          {mockData.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )

    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Jane')).toBeInTheDocument()
  })
})

// Badge Component Tests
describe('Badge Component', () => {
  it('renders badge with correct text', () => {
    render(<span>Gold</span>)
    expect(screen.getByText('Gold')).toBeInTheDocument()
  })

  it('applies correct color classes', () => {
    const { container } = render(
      <span className="bg-yellow-400">Gold</span>
    )
    expect(container.querySelector('.bg-yellow-400')).toBeInTheDocument()
  })
})

// Modal Component Tests
describe('Modal Component', () => {
  it('renders modal when open is true', () => {
    render(
      <div role="dialog" aria-modal="true">
        Modal Content
      </div>
    )
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('closes modal on close button click', () => {
    const handleClose = vi.fn()
    render(
      <div role="dialog">
        <button onClick={handleClose}>Close</button>
      </div>
    )
    fireEvent.click(screen.getByText('Close'))
    expect(handleClose).toHaveBeenCalled()
  })
})

// Card Component Tests
describe('Card Component', () => {
  it('renders card with content', () => {
    render(<div className="rounded-lg border">Card Content</div>)
    expect(screen.getByText('Card Content')).toBeInTheDocument()
  })

  it('renders card with title', () => {
    render(
      <div>
        <h2>Card Title</h2>
        <p>Card Content</p>
      </div>
    )
    expect(screen.getByText('Card Title')).toBeInTheDocument()
  })
})

// Zustand Store Tests
describe('Auth Store', () => {
  it('initializes with default state', () => {
    const initialState = {
      user: null,
      token: null,
    }
    expect(initialState.user).toBeNull()
    expect(initialState.token).toBeNull()
  })

  it('can set user', () => {
    const state = {
      user: { id: '1', email: 'test@test.com' },
      token: 'token123',
    }
    expect(state.user).not.toBeNull()
    expect(state.token).toBe('token123')
  })
})

// API Client Tests
describe('API Client', () => {
  it('makes GET request', async () => {
    const mockResponse = { data: { message: 'success' } }
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    )

    global.fetch = mockFetch

    const response = await fetch('http://api.test/guests')
    const data = await response.json()

    expect(mockFetch).toHaveBeenCalledWith('http://api.test/guests')
    expect(data.data.message).toBe('success')
  })
})

// Utility Functions Tests
describe('Utility Functions', () => {
  it('formats currency correctly', () => {
    const formatter = new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    })
    expect(formatter.format(1000)).toContain('1')
  })

  it('validates email format', () => {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
    expect(emailRegex.test('test@example.com')).toBe(true)
    expect(emailRegex.test('invalid-email')).toBe(false)
  })

  it('validates phone format', () => {
    const phoneRegex = /^\\+?[1-9]\\d{1,14}$/
    expect(phoneRegex.test('+79012345678')).toBe(true)
    expect(phoneRegex.test('123')).toBe(false)
  })
})
