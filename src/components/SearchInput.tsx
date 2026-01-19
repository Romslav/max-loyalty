import { useState, useEffect } from 'react'

interface SearchInputProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  debounceMs?: number
}

/**
 * 🔍 Search Input Component
 * Input field with debounced search
 */
export const SearchInput = ({
  placeholder = 'Search...',
  value,
  onChange,
  debounceMs = 500,
}: SearchInputProps) => {
  const [input, setInput] = useState(value)

  // Debounce the onChange call
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(input)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [input, onChange, debounceMs])

  // Update input when value prop changes
  useEffect(() => {
    setInput(value)
  }, [value])

  const handleClear = () => {
    setInput('')
    onChange('')
  }

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {/* Search icon */}
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        🔍
      </span>
      {/* Clear button */}
      {input && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  )
}
