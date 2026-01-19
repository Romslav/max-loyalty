import React from 'react'
import classNames from 'classnames'

interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'gray' | 'gold' | 'silver'
  className?: string
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name = '?',
  size = 'md',
  color = 'primary',
  className,
}) => {
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-2xl',
  }

  const colors = {
    primary: 'bg-primary-500 text-white',
    gray: 'bg-neutral-300 text-neutral-900',
    gold: 'bg-yellow-500 text-white',
    silver: 'bg-gray-400 text-white',
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={classNames(
          'rounded-full object-cover',
          sizes[size],
          className
        )}
      />
    )
  }

  return (
    <div
      className={classNames(
        'flex items-center justify-center rounded-full font-semibold',
        sizes[size],
        colors[color],
        className
      )}
      title={name}
    >
      {initials}
    </div>
  )
}

export default Avatar
