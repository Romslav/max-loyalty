import React, { ReactNode, useEffect } from 'react'
import classNames from 'classnames'
import { X } from 'lucide-react'
import Button from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeButton?: boolean
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({
    open,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    closeButton = true,
  }, ref) => {
    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }
      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [open])

    if (!open) return null

    const sizes = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
    }

    return (
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div
            ref={ref}
            className={classNames(
              'bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-auto',
              'animate-slideIn',
              sizes[size]
            )}
          >
            {/* Header */}
            {(title || closeButton) && (
              <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
                {closeButton && (
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-neutral-100 rounded-lg transition"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>
            )}
            
            {/* Body */}
            <div className="p-6">
              {children}
            </div>
            
            {/* Footer */}
            {footer && (
              <div className="border-t border-neutral-200 p-6 bg-neutral-50">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)

Modal.displayName = 'Modal'

export default Modal
