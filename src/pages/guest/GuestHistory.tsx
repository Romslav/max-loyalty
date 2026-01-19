import React, { useState } from 'react'
import { Calendar, LogOut, MessageSquare, AlertCircle } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import Table from '../common/Table'
import Badge from '../common/Badge'
import Tabs from '../common/Tabs'

const GuestHistory: React.FC = () => {
  const [filterType, setFilterType] = useState('all')

  const history = [
    {
      date: '16.01.2026, 18:45',
      type: 'Заказ',
      restaurant: '🍕 Пицца Ночная',
      amount: '1 850₽',
      bonus: '+185',
      status: 'Завершено',
    },
    {
      date: '16.01.2026, 12:30',
      type: 'Заказ',
      restaurant: '☕ Coffee House',
      amount: '650₽',
      bonus: '+65',
      status: 'Завершено',
    },
    {
      date: '15.01.2026, 19:45',
      type: 'Заказ',
      restaurant: '🍜 Азиатская Лапша',
      amount: '2 340₽',
      bonus: '+234',
      status: 'Завершено',
    },
    {
      date: '14.01.2026, 14:20',
      type: 'Возврат',
      restaurant: '🍕 Пицца Ночная',
      amount: '-500₽',
      bonus: '-50',
      status: 'Завершено',
    },
    {
      date: '13.01.2026, 11:00',
      type: 'Заказ',
      restaurant: '🍔 Burger Dream',
      amount: '1 200₽',
      bonus: '+120',
      status: 'Завершено',
    },
  ]

  const columns = [
    { key: 'date', label: 'Дата', width: '18%' },
    { key: 'type', label: 'Тип', width: '12%' },
    { key: 'restaurant', label: 'Ресторан', width: '30%' },
    { key: 'amount', label: 'Сумма', width: '12%' },
    { key: 'bonus', label: 'Бонусы', width: '12%' },
    {
      key: 'status',
      label: 'Статус',
      width: '16%',
      render: (value: string) => (
        <Badge
          color="green"
          text={value}
          size="sm"
        />
      ),
    },
  ]

  const filteredHistory = history.filter(
    (h) => filterType === 'all' || h.type === filterType
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">История</h1>
        <p className="text-neutral-600">
          Полная история всех операций и транзакций
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <p className="text-sm text-neutral-600">Всего операций</p>
          <p className="text-3xl font-bold mt-2">247</p>
          <p className="text-xs text-green-600 mt-2">↑ +28 за месяц</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-600">Всего потрачено</p>
          <p className="text-3xl font-bold mt-2">127,400₽</p>
          <p className="text-xs text-green-600 mt-2">↑ +18.2%</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-600">Получено баллов</p>
          <p className="text-3xl font-bold mt-2">12,740</p>
          <p className="text-xs text-green-600 mt-2">↑ +10.3%</p>
        </Card>
      </div>

      {/* Filters & Table */}
      <Tabs
        tabs={[
          {
            id: 'all',
            label: `📋 Все (${history.length})`,
            content: (
              <Card>
                <Table columns={columns} data={filteredHistory} hoverable striped />
              </Card>
            ),
          },
          {
            id: 'orders',
            label: `🛒 Заказы (${history.filter((h) => h.type === 'Заказ').length})`,
            content: (
              <Card>
                <Table
                  columns={columns}
                  data={history.filter((h) => h.type === 'Заказ')}
                  hoverable
                  striped
                />
              </Card>
            ),
          },
          {
            id: 'returns',
            label: `↩️ Возвраты (${history.filter((h) => h.type === 'Возврат').length})`,
            content: (
              <Card>
                <Table
                  columns={columns}
                  data={history.filter((h) => h.type === 'Возврат')}
                  hoverable
                  striped
                />
              </Card>
            ),
          },
        ]}
      />
    </div>
  )
}

export default GuestHistory
