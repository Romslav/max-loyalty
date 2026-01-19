import React, { useState } from 'react'
import { BarChart3, Users, TrendingUp, Settings, Plus, Download } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import Table from '../common/Table'
import Tabs from '../common/Tabs'
import Badge from '../common/Badge'
import Progress from '../common/Progress'

const RestaurantDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month')

  // KPI Stats
  const stats = [
    {
      label: 'Активные гости',
      value: '2,847',
      change: '+5.2%',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      label: 'Месячный доход',
      value: '185,400₽',
      change: '+12.4%',
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      label: 'Все операции',
      value: '3,847',
      change: '+8.1%',
      icon: BarChart3,
      color: 'text-purple-500',
    },
  ]

  // Top Guests
  const topGuests = [
    {
      name: 'Иван Петров',
      level: 'Platinum',
      visits: 156,
      spent: '456,200₽',
      lastVisit: '3 часа назад',
    },
    {
      name: 'Мария Сидорова',
      level: 'Gold',
      visits: 47,
      spent: '127,400₽',
      lastVisit: '1 день назад',
    },
    {
      name: 'Алексей Волков',
      level: 'Silver',
      visits: 23,
      spent: '58,500₽',
      lastVisit: '5 дней назад',
    },
  ]

  // Recent Operations
  const operations = [
    {
      date: '16.01.2026',
      time: '18:45',
      guest: 'Иван Петров',
      amount: '1 850₽',
      bonus: '+185',
      type: 'Заказ',
    },
    {
      date: '16.01.2026',
      time: '12:30',
      guest: 'Мария Сидорова',
      amount: '650₽',
      bonus: '+65',
      type: 'Заказ',
    },
    {
      date: '15.01.2026',
      time: '19:45',
      guest: 'Алексей Волков',
      amount: '2 340₽',
      bonus: '+234',
      type: 'Заказ',
    },
  ]

  const operationColumns = [
    { key: 'date', label: 'Дата', width: '12%' },
    { key: 'time', label: 'Время', width: '10%' },
    { key: 'guest', label: 'Гость', width: '25%' },
    { key: 'amount', label: 'Сумма', width: '15%' },
    { key: 'bonus', label: 'Бонусы', width: '15%' },
    { key: 'type', label: 'Тип', width: '12%' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Ресторан Dashboard
        </h1>
        <p className="text-neutral-600">
          Управление программой лояльности вашего ресторана
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-neutral-600 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-neutral-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 mt-2">↑ {stat.change}</p>
                </div>
                <Icon className={`${stat.color} opacity-20 w-12 h-12`} />
              </div>
            </Card>
          )
        })}
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          {
            id: 'overview',
            label: '📊 Обзор',
            content: (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Guests */}
                <Card title="🌟 Топ гости">
                  <div className="space-y-4">
                    {topGuests.map((guest, idx) => (
                      <div key={idx} className="pb-4 border-b last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-neutral-900">
                              {guest.name}
                            </p>
                            <p className="text-xs text-neutral-600">
                              {guest.lastVisit}
                            </p>
                          </div>
                          <Badge
                            color={
                              guest.level === 'Platinum'
                                ? 'platinum'
                                : guest.level === 'Gold'
                                ? 'gold'
                                : 'silver'
                            }
                            text={guest.level}
                            size="sm"
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">
                            {guest.visits} визитов
                          </span>
                          <span className="font-semibold text-neutral-900">
                            {guest.spent}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Level Distribution */}
                <Card title="📈 Распределение по уровням">
                  <div className="space-y-4">
                    {[
                      { name: 'Platinum', count: 45, percent: 12 },
                      { name: 'Gold', count: 287, percent: 35 },
                      { name: 'Silver', count: 1240, percent: 42 },
                      { name: 'Bronze', count: 1275, percent: 11 },
                    ].map((level, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{level.name}</span>
                          <span className="text-sm text-neutral-600">
                            {level.count} гостей
                          </span>
                        </div>
                        <Progress value={level.percent} max={100} />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ),
          },
          {
            id: 'operations',
            label: '📝 Операции',
            content: (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Последние операции</h2>
                  <Button variant="primary" size="sm">
                    <Plus size={20} />
                    Новая операция
                  </Button>
                </div>
                <Card>
                  <Table columns={operationColumns} data={operations} hoverable striped />
                </Card>
              </div>
            ),
          },
          {
            id: 'loyalty',
            label: '🎁 Программа лояльности',
            content: (
              <div className="space-y-6">
                <Card title="Параметры программы">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-neutral-700">
                        Процент кэшбэка
                      </label>
                      <div className="flex items-center gap-4 mt-2">
                        <input
                          type="range"
                          min="1"
                          max="20"
                          defaultValue="10"
                          className="flex-1"
                        />
                        <span className="text-lg font-bold text-primary-500">
                          10%
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700">
                        Минимальная сумма для активации
                      </label>
                      <input
                        type="number"
                        defaultValue="500"
                        className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg mt-2"
                      />
                    </div>
                  </div>
                </Card>
                <div className="flex gap-4">
                  <Button variant="primary" fullWidth>
                    Сохранить
                  </Button>
                  <Button variant="secondary" fullWidth>
                    Отмена
                  </Button>
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}

export default RestaurantDashboard
