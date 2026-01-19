import React, { ReactNode } from 'react'
import classNames from 'classnames'

interface CardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  onClick?: () => void
  className?: string
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  onClick,
  className,
}) => {
  return (
    <div
      className={classNames(
        'bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow',
        'border border-neutral-200',
        onClick && 'cursor-pointer hover:border-primary-500',
        className
      )}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="border-b border-neutral-200 p-6">
          {title && <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>}
          {subtitle && <p className="text-sm text-neutral-600 mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="p-6">
        {children}
      </div>

      {footer && (
        <div className="border-t border-neutral-200 p-6 bg-neutral-50">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card
