import React, { useState, useRef } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { guestService } from '../services/guestService'
import { operationService } from '../services/operationService'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { ErrorAlert } from '../components/common/ErrorAlert'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { formatDate } from '../utils/dateUtils'

interface ScannedCard {
  cardId: string
  guestId: string
  guestName: string
  email: string
  phone: string
  currentPoints: number
  totalPoints: number
  tier: string
}

interface OperationFormData {
  type: 'earn' | 'redeem'
  points: number
  description: string
}

export const ScanCard: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [scannedCard, setScannedCard] = useState<ScannedCard | null>(null)
  const [showOperationModal, setShowOperationModal] = useState(false)
  const [operationData, setOperationData] = useState<OperationFormData>({
    type: 'earn',
    points: 100,
    description: '',
  })

  const addOperationMutation = useMutation({
    mutationFn: (data: OperationFormData) =>
      operationService.createOperation({
        guestId: scannedCard?.guestId || '',
        ...data,
      }),
    onSuccess: () => {
      setShowOperationModal(false)
      setOperationData({ type: 'earn', points: 100, description: '' })
      setScannedCard(null)
      inputRef.current?.focus()
    },
  })

  const handleScan = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cardId = (e.target as HTMLInputElement).value.trim()
      if (cardId) {
        try {
          const response = await guestService.getGuestByCardId(cardId)
          const guest = response.data
          setScannedCard({
            cardId,
            guestId: guest.id,
            guestName: guest.name,
            email: guest.email,
            phone: guest.phone,
            currentPoints: guest.points,
            totalPoints: guest.totalPoints,
            tier: guest.tier,
          })
          ;(e.target as HTMLInputElement).value = ''
        } catch (error: any) {
          alert(`Error: ${error?.response?.data?.message || 'Card not found'}`)
          ;(e.target as HTMLInputElement).value = ''
        }
      }
    }
  }

  const handleOperationSubmit = async () => {
    await addOperationMutation.mutateAsync(operationData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Scan Loyalty Card</h1>
          <p className="text-lg text-gray-600">
            Scan QR code or enter card ID to manage guest points
          </p>
        </div>

        {/* Scanner Input */}
        <Card className="mb-8 p-8 border-2 border-dashed border-teal-300">
          <div className="space-y-4">
            <label className="block text-center">
              <span className="text-sm font-semibold text-gray-700 block mb-3">
                📱 Scan Card or Enter Card ID
              </span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Place cursor here and scan..."
                onKeyPress={handleScan}
                autoFocus
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg text-center font-mono focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
              />
            </label>
            <p className="text-xs text-gray-500 text-center">
              Press Enter after scanning or typing card ID
            </p>
          </div>
        </Card>

        {/* Scanned Card Info */}
        {scannedCard && (
          <Card className="mb-8 bg-white shadow-lg">
            <div className="p-8">
              {/* Guest Header */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {scannedCard.guestName}
                </h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{scannedCard.email}</p>
                    <p className="text-sm text-gray-600">{scannedCard.phone}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-4 py-2 bg-teal-100 text-teal-800 rounded-full font-semibold">
                      {scannedCard.tier.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Points Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Available Points</p>
                  <p className="text-3xl font-bold text-green-600">
                    {scannedCard.currentPoints.toLocaleString()}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Total Earned</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {scannedCard.totalPoints.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Card ID */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Card ID</p>
                <p className="font-mono text-sm text-gray-900">{scannedCard.cardId}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowOperationModal(true)}
                  className="flex-1"
                >
                  💳 Add Points / Redeem
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setScannedCard(null)}
                  className="flex-1"
                >
                  Clear
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Instructions */}
        {!scannedCard && (
          <Card className="bg-blue-50 border border-blue-200">
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">How to use:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✅ Position cursor in the input field above</li>
                <li>✅ Scan the guest's loyalty card QR code</li>
                <li>✅ Or manually enter the card ID</li>
                <li>✅ Press Enter to load guest information</li>
                <li>✅ Add or redeem points as needed</li>
              </ul>
            </div>
          </Card>
        )}
      </div>

      {/* Operation Modal */}
      <Modal
        isOpen={showOperationModal}
        onClose={() => setShowOperationModal(false)}
        title="Add Points / Redeem"
      >
        <div className="space-y-4">
          {/* Operation Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operation Type
            </label>
            <div className="flex gap-2">
              {(['earn', 'redeem'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setOperationData({ ...operationData, type })
                  }
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                    operationData.type === type
                      ? type === 'earn'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {type === 'earn' ? '➕ Earn' : '➖ Redeem'}
                </button>
              ))}
            </div>
          </div>

          {/* Points Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points Amount
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                value={operationData.points}
                onChange={(e) =>
                  setOperationData({
                    ...operationData,
                    points: Number(e.target.value),
                  })
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <div className="flex gap-1">
                {[10, 50, 100, 500].map((amount) => (
                  <button
                    key={amount}
                    onClick={() =>
                      setOperationData({
                        ...operationData,
                        points: amount,
                      })
                    }
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-medium text-sm"
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Purchase at restaurant #5"
              value={operationData.description}
              onChange={(e) =>
                setOperationData({
                  ...operationData,
                  description: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Operation Summary:</p>
            <p className="font-semibold text-lg text-gray-900">
              {operationData.type === 'earn' ? '➕' : '➖'} {operationData.points} points -{' '}
              {operationData.type.toUpperCase()}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={() => setShowOperationModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleOperationSubmit}
              isLoading={addOperationMutation.isPending}
              className={`${
                operationData.type === 'earn'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {operationData.type === 'earn' ? '✅ Add Points' : '✅ Redeem Points'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
