import React, { useState } from 'react'
import { Smartphone, Zap, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import Input from '../common/Input'
import Badge from '../common/Badge'
import Spinner from '../common/Spinner'

const ScanCard: React.FC = () => {
  const [scanCode, setScanCode] = useState('')
  const [scannedCard, setScannedCard] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Симуляция сканирования
  const handleScan = async () => {
    if (!scanCode) return

    setIsLoading(true)
    // Имитация API запроса
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (scanCode.match(/^[A-Z0-9]{6}$/)) {
      setScannedCard({
        cardNumber: scanCode,
        guestName: 'Иван Петров',
        level: 'gold',
        balance: 3850,
        visits: 28,
        lastVisit: '3 часа назад',
      })
      setStatus('success')
    } else {
      setStatus('error')
    }

    setIsLoading(false)
  }

  const handleReset = () => {
    setScanCode('')
    setScannedCard(null)
    setStatus('idle')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            Кассир 💳
          </h1>
          <p className="text-neutral-600">
            Сканирование карт и управление бонусами
          </p>
        </div>

        {/* Scanner Card */}
        <Card className="mb-8 border-2 border-primary-300">
          <div className="text-center">
            <Smartphone className="w-16 h-16 text-primary-500 mx-auto mb-4 opacity-20" />
            <h2 className="text-2xl font-bold mb-4">Сканирование карты</h2>
            <p className="text-neutral-600 mb-6">
              Отсканируйте QR-код или введите 6-значный номер карты
            </p>

            <div className="space-y-4">
              <Input
                placeholder="Введите код карты (например: 4A7K2B)"
                value={scanCode}
                onChange={(e) => setScanCode(e.target.value.toUpperCase())}
                fullWidth
                icon={<Smartphone size={20} />}
                disabled={isLoading}
              />

              <Button
                variant="primary"
                fullWidth
                onClick={handleScan}
                disabled={!scanCode || isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    Сканировать
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Result */}
        {status !== 'idle' && (
          <Card className={`mb-8 border-2 ${
            status === 'success' ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
          }`}>
            {status === 'success' && scannedCard ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-lg font-semibold text-green-700">
                    Карта успешно отсканирована!
                  </span>
                </div>

                <div className="bg-white p-6 rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-neutral-600">Номер карты</p>
                      <p className="text-2xl font-bold text-neutral-900 font-mono">
                        {scannedCard.cardNumber}
                      </p>
                    </div>
                    <Badge
                      color={
                        scannedCard.level === 'platinum'
                          ? 'platinum'
                          : scannedCard.level === 'gold'
                          ? 'gold'
                          : 'silver'
                      }
                      text={scannedCard.level.toUpperCase()}
                    />
                  </div>

                  <div className="border-t border-neutral-200 pt-4">
                    <p className="text-lg font-semibold text-neutral-900">
                      {scannedCard.guestName}
                    </p>
                    <p className="text-sm text-neutral-600">
                      Последний визит: {scannedCard.lastVisit}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-primary-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-neutral-600">Баланс</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {scannedCard.balance}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Визиты</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {scannedCard.visits}
                      </p>
                    </div>
                  </div>
                </div>

                <Button variant="primary" fullWidth>
                  Начислить бонусы
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <div>
                  <span className="text-lg font-semibold text-red-700">
                    Ошибка сканирования
                  </span>
                  <p className="text-sm text-red-600 mt-1">
                    Код должен быть 6 символов (например: 4A7K2B)
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-2">
              <Button
                variant="secondary"
                fullWidth
                onClick={handleReset}
                icon={<RefreshCw size={20} />}
              >
                Новое сканирование
              </Button>
            </div>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <p className="text-sm text-neutral-600">Сканировано сегодня</p>
            <p className="text-3xl font-bold mt-2">47</p>
            <p className="text-xs text-green-600 mt-2">↑ +12 с учётом</p>
          </Card>
          <Card>
            <p className="text-sm text-neutral-600">Всего начислено</p>
            <p className="text-3xl font-bold mt-2">4,785</p>
            <p className="text-xs text-green-600 mt-2">+478.5K₽</p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ScanCard
