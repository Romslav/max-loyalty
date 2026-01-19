import React from 'react'
import classNames from 'classnames'

interface BadgeProps {
  color?: 'gold' | 'silver' | 'bronze' | 'platinum' | 'green' | 'red' | 'blue'
  size?: 'sm' | 'md' | 'lg'
  text: string
  icon?: React.ReactNode
  className?: string
}

const Badge: React.FC<BadgeProps> = ({
  color = 'blue',
  size = 'md',
  text,
  icon,
  className,
}) => {
  const colors = {
    gold: 'bg-accent-gold/20 text-yellow-700 border border-accent-gold/50',
    silver: 'bg-accent-silver/20 text-gray-700 border border-accent-silver/50',
    bronze: 'bg-accent-bronze/20 text-orange-700 border border-accent-bronze/50',
    platinum: 'bg-accent-platinum/20 text-purple-700 border border-accent-platinum/50',
    green: 'bg-success/20 text-green-700 border border-success/50',
    red: 'bg-error/20 text-red-700 border border-error/50',
    blue: 'bg-info/20 text-blue-700 border border-info/50',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        colors[color],
        sizes[size],
        className
      )}
    >
      {icon}
      {text}
    </span>
  )
}

export default Badge
