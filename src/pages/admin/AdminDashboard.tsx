import React, { useState } from 'react'
import { BarChart3, Users, Building2, TrendingUp, AlertCircle } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import Table from '../common/Table'
import Tabs from '../common/Tabs'
import Badge from '../common/Badge'
import Progress from '../common/Progress'

const AdminDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('month')

  // Статистика
  const stats = [
    {
      label: 'Всего ресторанов',
      value: '24',
      change: '+2',
      icon: Building2,
      color: 'text-blue-500',
    },
    {
      label: 'Активные гости',
      value: '12,847',
      change: '+5.2%',
      icon: Users,
      color: 'text-green-500',
    },
    {
      label: 'Месячный доход',
      value: '2.34M₽',
      change: '+12.4%',
      icon: TrendingUp,
      color: 'text-purple-500',
    },
    {
      label: 'Всего операций',
      value: '48,392',
      change: '+8.1%',
      icon: BarChart3,
      color: 'text-orange-500',
    },
  ]

  // Таблица ресторанов
  const restaurantsData = [
    {
      id: 1,
      name: '🍕 Пицца Ночная',
      plan: 'PRO',
      guests: '2,847',
      income: '185,400₽',
      status: 'Активен',
    },
    {
      id: 2,
      name: '🍔 Burger Dream',
      plan: 'STANDARD',
      guests: '1,432',
      income: '98,760₽',
      status: 'Активен',
    },
    {
      id: 3,
      name: '🍜 Азиатская Лапша',
      plan: 'ULTIMA',
      guests: '5,214',
      income: '342,680₽',
      status: 'Активен',
    },
    {
      id: 4,
      name: '☕ Coffee House',
      plan: 'STANDARD',
      guests: '892',
      income: '62,450₽',
      status: 'Заблокирован',
    },
    {
      id: 5,
      name: '🥩 Steakhouse Prime',
      plan: 'PRO',
      guests: '3,567',
      income: '248,910₽',
      status: 'Активен',
    },
  ]

  const restaurantsColumns = [
    { key: 'name', label: 'Ресторан', width: '30%' },
    { key: 'plan', label: 'Тариф', width: '15%' },
    { key: 'guests', label: 'Гости', width: '15%' },
    { key: 'income', label: 'Доход (мес)', width: '20%' },
    {
      key: 'status',
      label: 'Статус',
      width: '20%',
      render: (value: string) => (
        <Badge
          color={value === 'Активен' ? 'green' : 'red'}
          text={value}
          size="sm"
        />
      ),
    },
  ]

  // Таблица тарифов
  const tariffsData = [
    {
      name: '🆓 FREE',
      restaurants: '2',
      price: 'Бесплатно',
      limit: '∞ точек, ∞ гостей',
      revenue: '0₽',
    },
    {
      name: '📊 STANDARD',
      restaurants: '8',
      price: '36,900₽',
      limit: '2 точки, 2K гостей',
      revenue: '295.2K₽',
    },
    {
      name: '📈 PRO',
      restaurants: '10',
      price: '67,000₽',
      limit: '5 точек, 5K гостей',
      revenue: '670K₽',
    },
    {
      name: '🚀 ULTIMA',
      restaurants: '4',
      price: '98,900₽',
      limit: '10 точек, ∞ гостей',
      revenue: '367.8K₽',
    },
  ]

  const tariffsColumns = [
    { key: 'name', label: 'Тариф', width: '20%' },
    { key: 'restaurants', label: 'Рестораны', width: '15%' },
    { key: 'price', label: 'Цена/месяц', width: '20%' },
    { key: 'limit', label: 'Лимиты', width: '25%' },
    { key: 'revenue', label: 'Доход', width: '20%' },
  ]

  // Последние активности
  const activities = [
    {
      time: '10 мин назад',
      user: 'Администратор',
      action: '✅ Вход в систему',
      object: 'System',
    },
    {
      time: '1 час назад',
      user: 'Менеджер',
      action: '➕ Создание ресторана',
      object: '🍕 Пицца Ночная',
    },
    {
      time: '3 часа назад',
      user: 'Администратор',
      action: '✏️ Редактирование тарифа',
      object: 'STANDARD',
    },
    {
      time: '1 день назад',
      user: 'Менеджер',
      action: '📥 Экспорт отчета',
      object: 'Analytics_Q4',
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-neutral-600">
          Управление платформой Max Loyalty
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Уведомления */}
      <div className="mb-8 grid gap-4">
        <Card className="border-l-4 border-warning">
          <div className="flex gap-4">
            <AlertCircle className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-neutral-900">
                ⚠️ Проблема с платежом
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                ☕ Coffee House имеет задолженность. Требуется внимание.
              </p>
            </div>
            <Button size="sm" variant="outline" className="flex-shrink-0">
              Решить
            </Button>
          </div>
        </Card>
      </div>

      {/* Табы */}
      <Tabs
        tabs={[
          {
            id: 'restaurants',
            label: '🏢 Рестораны',
            content: (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Список ресторанов</h2>
                  <Button variant="primary" size="sm">
                    + Добавить ресторан
                  </Button>
                </div>
                <Card>
                  <Table
                    columns={restaurantsColumns}
                    data={restaurantsData}
                    hoverable
                    striped
                  />
                </Card>
              </div>
            ),
          },
          {
            id: 'tariffs',
            label: '💰 Тарифы',
            content: (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Управление тарифами</h2>
                  <Button variant="primary" size="sm">
                    + Новый тариф
                  </Button>
                </div>
                <Card>
                  <Table
                    columns={tariffsColumns}
                    data={tariffsData}
                    hoverable
                    striped
                  />
                </Card>
              </div>
            ),
          },
          {
            id: 'analytics',
            label: '📊 Аналитика',
            content: (
              <div className="space-y-6">
                <Card title="Распределение по тарифам">
                  <div className="space-y-4">
                    {[
                      {
                        name: 'STANDARD',
                        percent: 40,
                        count: 8,
                        color: 'bg-blue-500',
                      },
                      {
                        name: 'PRO',
                        percent: 45,
                        count: 10,
                        color: 'bg-green-500',
                      },
                      {
                        name: 'ULTIMA',
                        percent: 12,
                        count: 4,
                        color: 'bg-purple-500',
                      },
                      {
                        name: 'FREE',
                        percent: 3,
                        count: 2,
                        color: 'bg-gray-500',
                      },
                    ].map((item) => (
                      <div key={item.name}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-neutral-600">
                            {item.count} рестораны
                          </span>
                        </div>
                        <Progress value={item.percent} max={100} />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Топ 5 метрик">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-neutral-50 rounded-lg">
                      <p className="text-sm text-neutral-600">Ср. доход</p>
                      <p className="text-2xl font-bold">97.5K₽</p>
                      <p className="text-xs text-green-600">↑ 8.3%</p>
                    </div>
                    <div className="text-center p-4 bg-neutral-50 rounded-lg">
                      <p className="text-sm text-neutral-600">Активация</p>
                      <p className="text-2xl font-bold">23.4%</p>
                      <p className="text-xs text-green-600">↑ 3.1%</p>
                    </div>
                    <div className="text-center p-4 bg-neutral-50 rounded-lg">
                      <p className="text-sm text-neutral-600">Ср. чек</p>
                      <p className="text-2xl font-bold">2,847₽</p>
                      <p className="text-xs text-green-600">↑ 5.7%</p>
                    </div>
                    <div className="text-center p-4 bg-neutral-50 rounded-lg">
                      <p className="text-sm text-neutral-600">Повторные</p>
                      <p className="text-2xl font-bold">67.2%</p>
                      <p className="text-xs text-green-600">↑ 4.2%</p>
                    </div>
                  </div>
                </Card>
              </div>
            ),
          },
        ]}
      />

      {/* Последние активности */}
      <div className="mt-8">
        <Card title="📝 Последние активности">
          <div className="space-y-4">
            {activities.map((activity, idx) => (
              <div key={idx} className="flex gap-4 pb-4 border-b last:border-0">
                <div className="text-sm text-neutral-600 min-w-[80px]">
                  {activity.time}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">
                    {activity.user}
                  </p>
                  <p className="text-sm text-neutral-600">{activity.action}</p>
                </div>
                <Badge color="blue" text={activity.object} size="sm" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
