/**
 * ReferralDialog Component
 * 
 * Modal dialog for sharing referral codes.
 * Supports copy to clipboard, email sharing, and social sharing.
 * Fully accessible dialog with keyboard support.
 */

import React, { useState, useCallback } from 'react'

interface ReferralDialogProps {
  referralCode: string
  guestName: string
  isOpen: boolean
  onClose: () => void
  shareUrl?: string
}

/**
 * Referral Dialog Component
 */
export const ReferralDialog: React.FC<ReferralDialogProps> = ({
  referralCode,
  guestName,
  isOpen,
  onClose,
  shareUrl = 'https://loyalty.example.com',
}) => {
  const [copied, setCopied] = useState(false)
  const referralLink = `${shareUrl}?ref=${referralCode}`

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [referralCode])

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [referralLink])

  const handleEmailShare = useCallback(() => {
    const subject = encodeURIComponent(`${guestName} пригласил вас в программу верности`)
    const body = encodeURIComponent(`
    Привет!
    
    ${guestName} пригласил вас присоединиться к нашей программе верности и получить эксклюзивные награды!
    
    Используйте мой реферальный код: ${referralCode}
    
    Или перейдите по ссылке: ${referralLink}
    
    Спасибо!
  `)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }, [referralCode, referralLink, guestName])

  const handleWhatsAppShare = useCallback(() => {
    const text = encodeURIComponent(
      `${guestName} пригласил вас в программу верности!\n\nМой реферальный код: ${referralCode}\n\nИли нажмите: ${referralLink}`,
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }, [referralCode, referralLink, guestName])

  const handleTelegramShare = useCallback(() => {
    const text = encodeURIComponent(
      `${guestName} пригласил вас в программу верности!\n\nМой реферальный код: ${referralCode}\n\nИли нажмите: ${referralLink}`,
    )
    window.open(`https://t.me/share/url?url=${referralLink}&text=${text}`, '_blank')
  }, [referralCode, referralLink, guestName])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        role="presentation"
      />

      {/* Dialog */}
      <div
        className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white shadow-xl"
        role="dialog"
        aria-labelledby="dialog-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 id="dialog-title" className="text-xl font-bold text-gray-900">
            📱 Поделиться реферальным кодом
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            aria-label="Закрыть диалог"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 px-6 py-4">
          {/* Referral Code Section */}
          <div>
            <p className="mb-2 text-sm text-gray-600">Ваш реферальный код:</p>
            <div className="flex gap-2">
              <div className="flex-1 rounded-lg bg-gray-100 px-4 py-3 font-mono font-bold text-gray-900">
                {referralCode}
              </div>
              <button
                onClick={handleCopyCode}
                className={`rounded-lg px-4 py-3 font-medium transition-colors ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-label="Копировать реферальный код"
              >
                {copied ? '✓ Скопировано' : '📋 Копировать'}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">или</span>
            </div>
          </div>

          {/* Referral Link Section */}
          <div>
            <p className="mb-2 text-sm text-gray-600">Реферальная ссылка:</p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600"
              />
              <button
                onClick={handleCopyLink}
                className="rounded-lg bg-teal-600 px-4 py-3 font-medium text-white hover:bg-teal-700"
                aria-label="Копировать ссылку"
              >
                🔗 Копировать
              </button>
            </div>
          </div>

          {/* Social Share Section */}
          <div>
            <p className="mb-3 text-sm text-gray-600">Поделиться через:</p>
            <div className="grid grid-cols-2 gap-3">
              <ShareButton
                icon="✉️"
                label="Email"
                onClick={handleEmailShare}
              />
              <ShareButton
                icon="💬"
                label="WhatsApp"
                onClick={handleWhatsAppShare}
              />
              <ShareButton
                icon="📨"
                label="Telegram"
                onClick={handleTelegramShare}
              />
              <ShareButton
                icon="📤"
                label="Web Share"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Реферальный код',
                      text: `Присоединитесь к программе верности используя мой код: ${referralCode}`,
                      url: referralLink,
                    })
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <p className="mb-3 text-xs text-gray-600">
            💡 <strong>Совет:</strong> За каждого приглашенного друга вы получите награду!
          </p>
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white transition-colors hover:bg-gray-800"
          >
            Закрыть
          </button>
        </div>
      </div>
    </>
  )
}

interface ShareButtonProps {
  icon: string
  label: string
  onClick: () => void
}

const ShareButton: React.FC<ShareButtonProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 transition-all hover:border-teal-500 hover:bg-teal-50"
    aria-label={`Поделиться через ${label}`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-xs font-medium text-gray-700">{label}</span>
  </button>
)

interface ReferralBannerProps {
  referralCode: string
  guestName: string
  onShareClick: () => void
}

/**
 * Compact referral banner for quick access
 */
export const ReferralBanner: React.FC<ReferralBannerProps> = ({
  referralCode,
  guestName,
  onShareClick,
}) => (
  <div className="rounded-lg bg-gradient-to-r from-teal-50 to-blue-50 p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-900">👥 Пригласите друзей</p>
        <p className="mt-1 text-xs text-gray-600">Используйте код: <span className="font-mono font-bold text-teal-600">{referralCode}</span></p>
      </div>
      <button
        onClick={onShareClick}
        className="ml-4 whitespace-nowrap rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
        aria-label="Поделиться реферальным кодом"
      >
        Поделиться
      </button>
    </div>
  </div>
)

export default ReferralDialog
