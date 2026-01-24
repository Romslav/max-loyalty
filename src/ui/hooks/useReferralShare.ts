/**
 * useReferralShare Hook
 * 
 * Custom React hook for managing referral code sharing.
 * Handles clipboard operations, social sharing, and tracking.
 * Production-ready with error handling.
 */

import { useState, useCallback } from 'react'

interface UseReferralShareOptions {
  referralCode: string
  guestName: string
  shareUrl?: string
  onShare?: (platform: string) => void | Promise<void>
  onCopy?: () => void | Promise<void>
}

interface UseReferralShareReturn {
  referralLink: string
  isCopied: boolean
  copyToClipboard: (text: string) => Promise<boolean>
  shareViaEmail: () => Promise<void>
  shareViaWhatsApp: () => Promise<void>
  shareViaTelegram: () => Promise<void>
  shareViaWeb: () => Promise<void>
  trackShare: (platform: string) => Promise<void>
}

/**
 * Custom hook for referral sharing functionality
 */
export const useReferralShare = (options: UseReferralShareOptions): UseReferralShareReturn => {
  const [isCopied, setIsCopied] = useState(false)
  const referralLink = `${options.shareUrl || 'https://loyalty.example.com'}?ref=${options.referralCode}`

  const copyToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)
        await options.onCopy?.()
        setTimeout(() => setIsCopied(false), 2000)
        return true
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
        return false
      }
    },
    [options],
  )

  const shareViaEmail = useCallback(async () => {
    try {
      const subject = encodeURIComponent(`${options.guestName} пригласил вас в программу верности`)
      const body = encodeURIComponent(`
Привет!

${options.guestName} пригласил вас присоединиться к нашей программе верности и получить эксклюзивные награды!

Используйте мой реферальный код: ${options.referralCode}

Или перейдите по ссылке: ${referralLink}

Спасибо!
      `)
      window.location.href = `mailto:?subject=${subject}&body=${body}`
      await options.onShare?.('email')
      await trackShare('email')
    } catch (error) {
      console.error('Failed to share via email:', error)
      throw error
    }
  }, [options, referralLink])

  const shareViaWhatsApp = useCallback(async () => {
    try {
      const text = encodeURIComponent(
        `${options.guestName} пригласил вас в программу верности!\n\nМой реферальный код: ${options.referralCode}\n\nИли нажмите: ${referralLink}`,
      )
      window.open(`https://wa.me/?text=${text}`, '_blank')
      await options.onShare?.('whatsapp')
      await trackShare('whatsapp')
    } catch (error) {
      console.error('Failed to share via WhatsApp:', error)
      throw error
    }
  }, [options, referralLink])

  const shareViaTelegram = useCallback(async () => {
    try {
      const text = encodeURIComponent(
        `${options.guestName} пригласил вас в программу верности!\n\nМой реферальный код: ${options.referralCode}\n\nИли нажмите: ${referralLink}`,
      )
      window.open(`https://t.me/share/url?url=${referralLink}&text=${text}`, '_blank')
      await options.onShare?.('telegram')
      await trackShare('telegram')
    } catch (error) {
      console.error('Failed to share via Telegram:', error)
      throw error
    }
  }, [options, referralLink])

  const shareViaWeb = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Реферальный код',
          text: `Присоединитесь к программе верности используя мой код: ${options.referralCode}`,
          url: referralLink,
        })
        await options.onShare?.('web')
        await trackShare('web')
      } else {
        // Fallback to copying link
        await copyToClipboard(referralLink)
        await options.onShare?.('web')
        await trackShare('copy')
      }
    } catch (error) {
      console.error('Failed to share via Web Share API:', error)
      throw error
    }
  }, [options, referralLink, copyToClipboard])

  const trackShare = useCallback(async (platform: string): Promise<void> => {
    try {
      // Send analytics event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'referral_share', {
          referral_code: options.referralCode,
          platform,
          guest_name: options.guestName,
        })
      }
    } catch (error) {
      console.warn('Failed to track share:', error)
    }
  }, [options])

  return {
    referralLink,
    isCopied,
    copyToClipboard,
    shareViaEmail,
    shareViaWhatsApp,
    shareViaTelegram,
    shareViaWeb,
    trackShare,
  }
}

export default useReferralShare
