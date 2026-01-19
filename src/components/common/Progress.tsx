import React from 'react'
import classNames from 'classnames'

interface ProgressProps {
  value: number
  max?: number
  showLabel?: boolean
  color?: 'primary' | 'success' | 'error' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  showLabel = false,
  color = 'primary',
  size = 'md',
  animated = true,
  className,
}) => {
  const percentage = Math.min((value / max) * 100, 100)

  const colors = {
    primary: 'bg-primary-500',
    success: 'bg-success',
    error: 'bg-error',
    warning: 'bg-warning',
  }

  const sizes = {
    sm: 'h-1',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div className={classNames('w-full', className)}>
      <div
        className={classNames(
          'w-full bg-neutral-200 rounded-full overflow-hidden',
          sizes[size]
        )}
      >
        <div
          className={classNames(
            colors[color],
            'h-full transition-all duration-500 rounded-full',
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs font-medium text-neutral-600">
          {value} / {max} ({Math.round(percentage)}%)
        </div>
      )}
    </div>
  )
}

export default Progress
