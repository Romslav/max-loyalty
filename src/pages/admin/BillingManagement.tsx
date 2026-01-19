import React, { useState } from 'react'
import { Download, Plus, Filter, TrendingUp } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import Table from '../common/Table'
import Badge from '../common/Badge'
import Progress from '../common/Progress'
import Tabs from '../common/Tabs'

const BillingManagement: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month')

  // Данные биллинга по ресторанам
  const billingData = [
    {
      restaurant: '🍕 Пицца Ночная',
      plan: 'PRO',
      status: 'Оплачено',
      amount: '67,000₽',
      date: '15.01.2026',
      nextPayment: '15.02.2026',
    },
    {
      restaurant: '🍔 Burger Dream',
      plan: 'STANDARD',
      status: 'Просрочено',
      amount: '36,900₽',
      date: '10.01.2026',
      nextPayment: '10.02.2026',
    },
    {
      restaurant: '🍜 Азиатская Лапша',
      plan: 'ULTIMA',
      status: 'Ожидание',
      amount: '98,900₽',
      date: '18.01.2026',
      nextPayment: '18.02.2026',
    },
  ]

  const columns = [
    { key: 'restaurant', label: 'Ресторан', width: '25%' },
    { key: 'plan', label: 'Тариф', width: '15%' },
    {
      key: 'status',
      label: 'Статус',
      width: '15%',
      render: (value: string) => (
        <Badge
          color={
            value === 'Оплачено'
              ? 'green'
              : value === 'Просрочено'
              ? 'red'
              : 'warning'
          }
          text={value}
          size="sm"
        />
      ),
    },
    { key: 'amount', label: 'Сумма', width: '12%' },
    { key: 'date', label: 'Дата платежа', width: '15%' },
    { key: 'nextPayment', label: 'Следующий платёж', width: '18%' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Биллинг</h1>
        <p className="text-neutral-600">Управление платежами и подписками</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <p className="text-sm text-neutral-600">Месячный доход</p>
          <p className="text-3xl font-bold mt-2">2.34M₽</p>
          <p className="text-xs text-green-600 mt-2">↑ +12.4%</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-600">Оплачено</p>
          <p className="text-3xl font-bold mt-2">23 рест</p>
          <p className="text-xs text-green-600 mt-2">95.8%</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-600">Просрочено</p>
          <p className="text-3xl font-bold mt-2">1 рест</p>
          <p className="text-xs text-red-600 mt-2">36,900₽</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-600">MRR</p>
          <p className="text-3xl font-bold mt-2">2.34M₽</p>
          <p className="text-xs text-green-600 mt-2">↑ +8.1%</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          {
            id: 'invoices',
            label: '📄 Счета',
            content: (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Список счетов</h2>
                  <Button variant="primary" size="sm">
                    <Download size={20} />
                    Экспорт
                  </Button>
                </div>
                <Card>
                  <Table columns={columns} data={billingData} hoverable striped />
                </Card>
              </div>
            ),
          },
          {
            id: 'tariffs',
            label: '💰 Тарифы',
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'FREE', price: '0₽', features: 2 },
                    { name: 'STANDARD', price: '36,900₽', features: 5 },
                    { name: 'PRO', price: '67,000₽', features: 8 },
                    { name: 'ULTIMA', price: '98,900₽', features: 12 },
                  ].map((tariff, idx) => (
                    <Card key={idx}>
                      <h3 className="font-semibold text-lg mb-2">
                        {tariff.name}
                      </h3>
                      <p className="text-2xl font-bold text-primary-500 mb-4">
                        {tariff.price}
                      </p>
                      <p className="text-sm text-neutral-600 mb-4">
                        {tariff.features} возможностей
                      </p>
                      <Button variant="outline" fullWidth size="sm">
                        Настроить
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            ),
          },
          {
            id: 'analytics',
            label: '📊 Аналитика',
            content: (
              <div className="space-y-6">
                <Card>
                  <h3 className="font-semibold mb-4">Распределение по тарифам</h3>
                  {[
                    { name: 'FREE', count: 2, revenue: '0₽' },
                    { name: 'STANDARD', count: 8, revenue: '295.2K₽' },
                    { name: 'PRO', count: 10, revenue: '670K₽' },
                    { name: 'ULTIMA', count: 4, revenue: '395.6K₽' },
                  ].map((item, idx) => (
                    <div key={idx} className="mb-4 last:mb-0">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-neutral-600">
                          {item.count} ресторанов → {item.revenue}
                        </span>
                      </div>
                      <Progress
                        value={(item.count / 24) * 100}
                        max={100}
                      />
                    </div>
                  ))}
                </Card>
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}

export default BillingManagement
