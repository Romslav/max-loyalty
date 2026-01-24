/**
 * GuestBulkActionsToolbar Component
 * 
 * Toolbar for performing bulk operations on selected guests.
 * Supports status changes, tier upgrades, deletions, exports.
 * Secure with confirmation dialogs.
 */

import React, { useCallback, useState } from 'react'

export interface BulkAction {
  id: string
  label: string
  icon: string
  color: 'danger' | 'primary' | 'secondary'
  confirmRequired?: boolean
  confirmMessage?: string
  onExecute: (guestIds: string[]) => Promise<void>
}

interface GuestBulkActionsToolbarProps {
  selectedGuestIds: string[]
  actions: BulkAction[]
  onAction?: (actionId: string, guestIds: string[]) => void
  isLoading?: boolean
  className?: string
}

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  isDangerous?: boolean
  isLoading?: boolean
}

/**
 * Bulk Actions Toolbar Component
 */
export const GuestBulkActionsToolbar: React.FC<GuestBulkActionsToolbarProps> = ({
  selectedGuestIds,
  actions,
  onAction,
  isLoading = false,
  className = '',
}) => {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    action?: BulkAction
    title?: string
    message?: string
  }>({
    isOpen: false,
  })
  const [actionLoading, setActionLoading] = useState(false)

  const handleActionClick = useCallback(
    async (action: BulkAction) => {
      if (action.confirmRequired) {
        setConfirmDialog({
          isOpen: true,
          action,
          title: `Подтвердите ${action.label.toLowerCase()}`,
          message: action.confirmMessage || `Вы уверены?`,
        })
      } else {
        await executeAction(action)
      }
    },
    [],
  )

  const executeAction = useCallback(
    async (action: BulkAction) => {
      setActionLoading(true)
      try {
        await action.onExecute(selectedGuestIds)
        onAction?.(action.id, selectedGuestIds)
      } catch (error) {
        console.error(`Action ${action.id} failed:`, error)
      } finally {
        setActionLoading(false)
        setConfirmDialog({ isOpen: false })
      }
    },
    [selectedGuestIds, onAction],
  )

  if (selectedGuestIds.length === 0) {
    return null
  }

  const buttonColorClass = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    primary: 'bg-teal-600 hover:bg-teal-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
  }

  return (
    <>
      {/* Toolbar */}
      <div
        className={`sticky bottom-0 left-0 right-0 border-t border-gray-200 bg-white shadow-lg ${className}`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="select-all"
              className="h-5 w-5 cursor-pointer rounded border-gray-300 text-teal-600"
              disabled
              checked
              aria-label="Все выбраны"
            />
            <label htmlFor="select-all" className="cursor-pointer text-sm font-medium text-gray-900">
              Выбрано {selectedGuestIds.length} гостей
            </label>
          </div>

          <div className="flex items-center gap-3">
            {/* Actions */}
            <div className="flex gap-2">
              {actions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  disabled={isLoading || actionLoading}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    buttonColorClass[action.color]
                  }`}
                  aria-label={action.label}
                >
                  <span>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog.action && (
        <ConfirmationDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title || ''}
          message={confirmDialog.message || ''}
          isDangerous={confirmDialog.action.color === 'danger'}
          isLoading={actionLoading}
          onConfirm={() => executeAction(confirmDialog.action!)}
          onCancel={() => setConfirmDialog({ isOpen: false })}
        />
      )}
    </>
  )
}

/**
 * Confirmation Dialog Component
 */
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isDangerous = false,
  isLoading = false,
}) => {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onCancel}
        role="presentation"
      />

      {/* Dialog */}
      <div
        className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white shadow-xl"
        role="alertdialog"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        {/* Header */}
        <div className={`border-b ${isDangerous ? 'border-red-200 bg-red-50' : 'border-gray-200'} px-6 py-4`}>
          <h2 id="dialog-title" className={`text-lg font-bold ${
            isDangerous ? 'text-red-900' : 'text-gray-900'
          }`}>
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p id="dialog-description" className="text-gray-600">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed"
          >
            Отменить
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 rounded-lg px-4 py-2 text-center font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-teal-600 hover:bg-teal-700'
            }`}
          >
            {isLoading ? 'Обработка...' : 'Подтвердить'}
          </button>
        </div>
      </div>
    </>
  )
}

export default GuestBulkActionsToolbar
