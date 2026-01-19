import React, { InputHTMLAttributes, ReactNode } from 'react'
import classNames from 'classnames'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  placeholder?: string
  error?: string
  helperText?: string
  icon?: ReactNode
  showPasswordToggle?: boolean
  fullWidth?: boolean
}

interface InputState {
  showPassword: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    placeholder,
    error,
    helperText,
    icon,
    showPasswordToggle = false,
    fullWidth = false,
    type = 'text',
    className,
    disabled,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    
    const inputType = showPasswordToggle && showPassword ? 'text' : type
    
    return (
      <div className={classNames('flex flex-col', fullWidth && 'w-full')}>
        {label && (
          <label className="text-sm font-medium text-neutral-700 mb-2">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            className={classNames(
              'w-full px-4 py-2.5 rounded-lg border-2 transition-colors duration-200',
              'focus:outline-none focus:ring-0',
              icon ? 'pl-10' : 'pl-4',
              showPasswordToggle && type === 'password' ? 'pr-10' : 'pr-4',
              error
                ? 'border-error focus:border-error'
                : 'border-neutral-200 focus:border-primary-500',
              disabled && 'bg-neutral-100 cursor-not-allowed text-neutral-500',
              !disabled && 'hover:border-neutral-300',
              className
            )}
            {...props}
          />
          
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        
        {error && <p className="text-sm text-error mt-1">{error}</p>}
        {helperText && !error && <p className="text-sm text-neutral-500 mt-1">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
