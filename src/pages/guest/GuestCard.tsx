import React from 'react'
import { ArrowUp, Share2, Download, Settings } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import Tabs from '../common/Tabs'
import LoyaltyCard from '../loyalty/LoyaltyCard'
import Badge from '../common/Badge'

const GuestCard: React.FC = () => {
  // Пример данных гостя
  const guestData = {
    name: 'Иван Петров',
    restaurant: 'Пиццерия Ночная',
    level: 'gold' as const,
    balance: 3850,
    cardNumber: '4A7K2B',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=4A7K2B',
    progress: 45,
    nextLevel: 'Platinum',
    needForNextLevel: 2750,
    visits: 28,
    savings: 12.7,
  }

  // История операций
  const operations = [
    {
      date: 'Сегодня, 18:45',
      type: 'Заказ #45829',
      amount: '1 850 ₽',
      bonus: '+185 баллов',
      items: ['Маргарита (средняя)', 'Колы (2 шт)', 'Десерт'],
    },
    {
      date: 'Вчера, 12:00',
      type: 'Заказ #45821',
      amount: '650 ₽',
      bonus: '+65 баллов',
      items: ['Капучино', 'Круассан'],
    },
    {
      date: '3 дня назад, 19:30',
      type: 'Заказ #45812',
      amount: '2 340 ₽',
      bonus: '+234 баллов',
      items: ['Паста Карбонара', 'Вино Chianti', 'Тирамису'],
    },
  ]

  // Достижения
  const achievements = [
    { icon: '🔥', label: '7-дневная серия', desc: 'Посещайте 7 дней подряд' },
    { icon: '👑', label: 'VIP статус', desc: 'Достигните уровня Platinum' },
    { icon: '💯', label: '100 визитов', desc: 'Посетите 100 раз' },
    { icon: '🎁', label: 'Реферрал звезда', desc: 'Приведите 5 друзей' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Привет, {guestData.name}! 👋
        </h1>
        <p className="text-neutral-600">
          Ваша карта лояльности в {guestData.restaurant}
        </p>
      </div>

      {/* Loyalty Card */}
      <div className="mb-8 max-w-md">
        <LoyaltyCard
          restaurantName={guestData.restaurant}
          guestName={guestData.name}
          level={guestData.level}
          balance={guestData.balance}
          cardNumber={guestData.cardNumber}
          qrCode={guestData.qrCode}
          progress={guestData.progress}
          nextLevel={guestData.nextLevel}
          needForNextLevel={guestData.needForNextLevel}
          visits={guestData.visits}
          savings={guestData.savings}
          onRefresh={async () => {
            console.log('Обновление карты...')
          }}
        />
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          {
            id: 'history',
            label: '📋 История',
            content: (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-6">Последние операции</h2>
                {operations.map((op, idx) => (
                  <Card key={idx}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-neutral-900">
                            {op.type}
                          </h3>
                          <span className="text-xs text-neutral-500">
                            {op.date}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mb-2">
                          {op.items.join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-neutral-900">
                          {op.amount}
                        </p>
                        <p className="text-sm text-green-600">{op.bonus}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ),
          },
          {
            id: 'achievements',
            label: '🏆 Достижения',
            content: (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-6">Ваши достижения</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((ach, idx) => (
                    <Card key={idx}>
                      <div className="text-center">
                        <div className="text-4xl mb-2">{ach.icon}</div>
                        <h3 className="font-semibold text-neutral-900">
                          {ach.label}
                        </h3>
                        <p className="text-sm text-neutral-600 mt-1">
                          {ach.desc}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ),
          },
          {
            id: 'referral',
            label: '👥 Реферрал',
            content: (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-6">Пригласить друзей</h2>
                <Card>
                  <div className="text-center py-6">
                    <div className="text-5xl mb-4">🎁</div>
                    <h3 className="text-xl font-semibold mb-2">
                      Получите 500 баллов!
                    </h3>
                    <p className="text-neutral-600 mb-6">
                      За каждого приглашённого друга, который первый раз
                      посетит ресторан
                    </p>
                    <div className="bg-primary-50 p-4 rounded-lg mb-6">
                      <p className="font-mono text-sm text-primary-900">
                        https://maxloyalty.ru/ref/IVAN12345
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      fullWidth
                      icon={<Share2 size={20} />}
                    >
                      Поделиться ссылкой
                    </Button>
                  </div>
                </Card>
                <Card title="Приглашённые друзья">
                  <p className="text-neutral-600">
                    Вы пока никого не пригласили. Поделитесь ссылкой выше!
                  </p>
                </Card>
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}

export default GuestCard
