import React, { useState } from 'react'
import classNames from 'classnames'
import { ChevronDown } from 'lucide-react'

interface Option {
  value: string | number
  label: string
}

interface SelectProps {
  options: Option[]
  value?: string | number
  onChange?: (value: string | number) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  fullWidth?: boolean
  searchable?: boolean
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Выберите...',
  label,
  error,
  disabled = false,
  fullWidth = false,
  searchable = false,
}) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selected = options.find((opt) => opt.value === value)
  const filtered = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : options

  return (
    <div className={classNames('flex flex-col', fullWidth && 'w-full')}>
      {label && (
        <label className="text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
          className={classNames(
            'w-full px-4 py-2.5 rounded-lg border-2 text-left',
            'flex items-center justify-between',
            'focus:outline-none focus:ring-0 transition-colors',
            error
              ? 'border-error focus:border-error'
              : 'border-neutral-200 focus:border-primary-500',
            disabled && 'bg-neutral-100 cursor-not-allowed text-neutral-500'
          )}
        >
          <span>{selected?.label || placeholder}</span>
          <ChevronDown
            size={20}
            className={classNames(
              'transition-transform',
              open && 'transform rotate-180'
            )}
          />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-neutral-200 rounded-lg shadow-lg z-10">
            {searchable && (
              <input
                type="text"
                placeholder="Поиск..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border-b-2 border-neutral-200 focus:outline-none"
              />
            )}
            <div className="max-h-48 overflow-y-auto">
              {filtered.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange?.(option.value)
                    setOpen(false)
                    setSearch('')
                  }}
                  className={classNames(
                    'w-full px-4 py-2 text-left hover:bg-primary-50 transition',
                    value === option.value && 'bg-primary-100 text-primary-700'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-error mt-1">{error}</p>}
    </div>
  )
}

export default Select
