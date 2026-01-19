import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { guestService } from '../services/guestService'
import { authService } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { ErrorAlert } from '../components/common/ErrorAlert'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'

interface GuestProfile {
  id: string
  name: string
  email: string
  phone: string
  tier: string
  points: number
  totalPoints: number
  joinedDate: string
  lastActivity: string
  preferences: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    newsletter: boolean
  }
}

interface PasswordChange {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export const GuestSettings: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [passwordData, setPasswordData] = useState<PasswordChange>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  // Fetch guest profile
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['guest-profile', user?.id],
    queryFn: () => guestService.getProfile(user?.id || ''),
  })

  const profile = profileData?.data as GuestProfile

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: (updates: Partial<GuestProfile>) =>
      guestService.updateProfile(user?.id || '', updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-profile'] })
    },
  })

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: PasswordChange) =>
      authService.changePassword(data),
    onSuccess: () => {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setShowPasswordModal(false)
      setPasswordError('')
    },
  })

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: () => guestService.deleteProfile(user?.id || ''),
    onSuccess: () => {
      authService.logout()
      navigate('/login')
    },
  })

  const handlePreferenceChange = (
    key: keyof GuestProfile['preferences']
  ) => {
    if (profile) {
      updateMutation.mutate({
        preferences: {
          ...profile.preferences,
          [key]: !profile.preferences[key],
        },
      })
    }
  }

  const handlePasswordSubmit = () => {
    setPasswordError('')

    if (!passwordData.currentPassword) {
      setPasswordError('Current password is required')
      return
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters')
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    changePasswordMutation.mutate(passwordData)
  }

  if (isLoading) return <LoadingSpinner />
  if (!profile) return <ErrorAlert error={new Error('Profile not found')} />

  const tierBadgeColor: Record<string, string> = {
    bronze: 'bg-amber-100 text-amber-800',
    silver: 'bg-gray-100 text-gray-800',
    gold: 'bg-yellow-100 text-yellow-800',
    platinum: 'bg-blue-100 text-blue-800',
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-600">Manage your profile and preferences</p>
      </div>

      {/* Profile Card */}
      <Card className="mb-6 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h2>
            <p className="text-gray-600">{profile.email}</p>
          </div>
          <span className={`px-4 py-2 rounded-full font-semibold text-sm ${
            tierBadgeColor[profile.tier] || tierBadgeColor.bronze
          }`}>
            {profile.tier.toUpperCase()}
          </span>
        </div>

        {/* Points Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Available Points</p>
            <p className="text-2xl font-bold text-green-600">
              {profile.points.toLocaleString()}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Total Earned</p>
            <p className="text-2xl font-bold text-blue-600">
              {profile.totalPoints.toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-gray-600 mb-1">Member Since</p>
            <p className="text-sm font-medium text-purple-600">
              {new Date(profile.joinedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  updateMutation.mutate({ phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="mb-6 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
        <div className="space-y-4">
          {[
            {
              key: 'emailNotifications' as const,
              label: '📧 Email Notifications',
              description: 'Receive updates via email',
            },
            {
              key: 'smsNotifications' as const,
              label: '📱 SMS Notifications',
              description: 'Receive updates via SMS',
            },
            {
              key: 'pushNotifications' as const,
              label: '🔔 Push Notifications',
              description: 'Receive browser notifications',
            },
            {
              key: 'newsletter' as const,
              label: '📰 Newsletter',
              description: 'Subscribe to our weekly newsletter',
            },
          ].map((pref) => (
            <div
              key={pref.key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{pref.label}</p>
                <p className="text-sm text-gray-600">{pref.description}</p>
              </div>
              <input
                type="checkbox"
                checked={profile.preferences[pref.key]}
                onChange={() => handlePreferenceChange(pref.key)}
                className="w-6 h-6 text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Security Section */}
      <Card className="mb-6 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Security</h2>
        <div className="space-y-4">
          <Button
            variant="secondary"
            onClick={() => setShowPasswordModal(true)}
            className="w-full"
          >
            🔐 Change Password
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50 p-8">
        <h2 className="text-xl font-bold text-red-900 mb-6">Danger Zone</h2>
        <p className="text-sm text-red-800 mb-4">
          Deleting your account is permanent and cannot be undone. All your data will be erased.
        </p>
        <Button
          variant="danger"
          onClick={() => setShowDeleteModal(true)}
          className="w-full"
        >
          🗑️ Delete Account
        </Button>
      </Card>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              placeholder="At least 8 characters"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {passwordError && (
            <ErrorAlert error={new Error(passwordError)} />
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordSubmit}
              isLoading={changePasswordMutation.isPending}
            >
              Update Password
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              ⚠️ This action is permanent and cannot be undone. All your data, points, and history will be permanently deleted.
            </p>
          </div>

          <p className="text-gray-600">
            Type your email to confirm deletion:
          </p>

          <input
            type="email"
            placeholder={profile.email}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteAccountMutation.mutate()}
              isLoading={deleteAccountMutation.isPending}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
