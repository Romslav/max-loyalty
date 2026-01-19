import React from 'react'
import classNames from 'classnames'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white'
  text?: string
  fullscreen?: boolean
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text,
  fullscreen = false,
}) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  }

  const colors = {
    primary: 'text-primary-500',
    white: 'text-white',
  }

  const spinner = (
    <div className={classNames('animate-spin', sizes[size], colors[color])}>
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        <div className="bg-white rounded-xl p-8 shadow-2xl">
          {spinner}
          {text && <p className="mt-4 text-center font-medium text-neutral-700">{text}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {spinner}
      {text && <p className="text-center font-medium text-neutral-700">{text}</p>}
    </div>
  )
}

export default Spinner
