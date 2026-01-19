import React, { useState } from 'react'
import QRCode from 'qrcode.react'
import { Copy, RefreshCw, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../common/Button'
import Progress from '../common/Progress'
import Badge from '../common/Badge'

interface LoyaltyCardProps {
  restaurantName: string
  guestName: string
  level: 'bronze' | 'silver' | 'gold' | 'platinum'
  balance: number
  cardNumber: string
  qrCode: string
  progress: number
  nextLevel: string
  needForNextLevel: number
  visits: number
  savings: number
  onRefresh?: () => Promise<void>
  onCopyCode?: () => void
}

const LoyaltyCard: React.FC<LoyaltyCardProps> = ({
  restaurantName,
  guestName,
  level,
  balance,
  cardNumber,
  qrCode,
  progress,
  nextLevel,
  needForNextLevel,
  visits,
  savings,
  onRefresh,
  onCopyCode,
}) => {
  const [refreshing, setRefreshing] = useState(false)
  const qrRef = React.useRef<HTMLDivElement>(null)

  const levelColors = {
    bronze: 'text-yellow-700 bg-yellow-50',
    silver: 'text-gray-600 bg-gray-50',
    gold: 'text-yellow-600 bg-yellow-50',
    platinum: 'text-purple-600 bg-purple-50',
  }

  const levelEmojis = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '👑',
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(cardNumber)
    toast.success(`Код ${cardNumber} скопирован!`)
    onCopyCode?.()
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await onRefresh?.()
      toast.success('✅ Данные синхронизированы')
    } catch (error) {
      toast.error('❌ Ошибка синхронизации')
    } finally {
      setRefreshing(false)
    }
  }

  const handleDownloadQR = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas')
      if (canvas) {
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = `${guestName}-loyalty-card.png`
        link.click()
        toast.success('QR код загружен!')
      }
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card Container */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-2xl p-6 text-white">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm opacity-90">🍽️ {restaurantName}</p>
            <h3 className="text-2xl font-bold mt-1">{guestName}</h3>
          </div>
          <Badge
            color={level}
            text={`${levelEmojis[level]} ${level.toUpperCase()}`}
          />
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-lg p-6 mb-6 flex justify-center" ref={qrRef}>
          <QRCode
            value={qrCode}
            size={300}
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Card Number */}
        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-80">Номер карты</p>
              <p className="text-3xl font-mono font-bold tracking-widest">
                {cardNumber}
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition"
              title="Скопировать код"
            >
              <Copy size={20} />
            </button>
          </div>
        </div>

        {/* Balance */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-sm opacity-80">💰 Баланс</p>
            <p className="text-3xl font-bold">{balance}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-sm opacity-80">📊 Уровень</p>
            <p className="text-lg font-semibold capitalize">{level}</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <p className="text-sm opacity-80">До {nextLevel}</p>
            <p className="text-sm font-semibold">{progress}%</p>
          </div>
          <Progress value={progress} max={100} color="primary" />
          <p className="text-xs opacity-80 mt-2">
            Нужно ещё: +{needForNextLevel} ₽
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="opacity-80">👤 Визитов</p>
            <p className="text-xl font-bold">{visits}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="opacity-80">💵 Экономия</p>
            <p className="text-xl font-bold">{savings}K ₽</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={handleRefresh}
            disabled={refreshing}
            icon={<RefreshCw size={16} />}
          >
            {refreshing ? 'Синхро...' : 'Обновить'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={handleDownloadQR}
            icon={<Download size={16} />}
          >
            Скачать
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LoyaltyCard
