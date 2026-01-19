import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { guestService } from '../services/guestService'
import { operationService } from '../services/operationService'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { ErrorAlert } from '../components/common/ErrorAlert'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

interface FormData {
  guestId: string
  type: 'earn' | 'redeem'
  points: number
  description: string
}

interface Guest {
  id: string
  name: string
  email: string
  points: number
}

export const PointsOperationForm: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    guestId: '',
    type: 'earn',
    points: 100,
    description: '',
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})

  // Fetch guests for dropdown
  const { data: guestsData, isLoading: guestsLoading } = useQuery({
    queryKey: ['guests-all'],
    queryFn: () => guestService.getAllGuests(),
  })

  // Create operation mutation
  const createMutation = useMutation({
    mutationFn: (data: FormData) => operationService.createOperation(data),
    onSuccess: () => {
      navigate('/operations', {
        state: { message: 'Operation created successfully!' },
      })
    },
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'points' ? Number(value) : value,
    }))
    // Clear error for this field
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.guestId) {
      newErrors.guestId = 'Guest is required'
    }
    if (formData.points <= 0) {
      newErrors.points = 'Points must be greater than 0'
    }
    if (formData.points > 100000) {
      newErrors.points = 'Points cannot exceed 100,000'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      await createMutation.mutateAsync(formData)
    }
  }

  const selectedGuest = guestsData?.data?.find(
    (guest: Guest) => guest.id === formData.guestId
  )

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Points Operation</h1>
        <p className="text-gray-600">
          Add or redeem loyalty points for a guest
        </p>
      </div>

      {/* Form Card */}
      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Guest Selection */}
          <div>
            <label htmlFor="guestId" className="block text-sm font-medium text-gray-700 mb-2">
              Guest <span className="text-red-500">*</span>
            </label>
            {guestsLoading ? (
              <div className="flex items-center justify-center py-2">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <select
                  id="guestId"
                  name="guestId"
                  value={formData.guestId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition ${
                    errors.guestId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a guest...</option>
                  {guestsData?.data?.map((guest: Guest) => (
                    <option key={guest.id} value={guest.id}>
                      {guest.name} ({guest.email}) - {guest.points} pts
                    </option>
                  ))}
                </select>
                {errors.guestId && (
                  <p className="mt-2 text-sm text-red-600">{errors.guestId}</p>
                )}
              </>
            )}
          </div>

          {/* Guest Info Preview */}
          {selectedGuest && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{selectedGuest.name}</p>
                  <p className="text-sm text-gray-600">{selectedGuest.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Current Points</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedGuest.points.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Operation Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Operation Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['earn', 'redeem'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`px-4 py-3 rounded-lg font-medium transition text-center ${
                    formData.type === type
                      ? type === 'earn'
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-red-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'earn' ? (
                    <>
                      <span className="text-lg">🎁</span> Earn Points
                    </>
                  ) : (
                    <>
                      <span className="text-lg">💳</span> Redeem Points
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Points Amount */}
          <div>
            <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-2">
              Points Amount <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <input
                type="number"
                id="points"
                name="points"
                min="1"
                max="100000"
                value={formData.points}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg text-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition ${
                  errors.points ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.points && (
                <p className="text-sm text-red-600">{errors.points}</p>
              )}

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[10, 50, 100, 500].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, points: amount })
                    }
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-medium text-sm transition"
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Points Preview */}
          <div className={`rounded-lg p-4 ${
            formData.type === 'earn'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className="text-sm text-gray-600 mb-1">Operation Preview</p>
            <p className={`text-xl font-bold ${
              formData.type === 'earn' ? 'text-green-600' : 'text-red-600'
            }`}>
              {formData.type === 'earn' ? '+' : '-'}{formData.points.toLocaleString()} points
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Purchase at restaurant #5, Birthday bonus, etc."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Error Alert */}
          {createMutation.isError && (
            <ErrorAlert error={createMutation.error} />
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/operations')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={createMutation.isPending}
              disabled={!formData.guestId || formData.points <= 0}
              className="flex-1"
            >
              {formData.type === 'earn' ? '✅ Add Points' : '✅ Redeem Points'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
