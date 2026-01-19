import React, { useState } from 'react'
import { Calendar, Download, TrendingUp, BarChart3 } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import Input from '../common/Input'
import Tabs from '../common/Tabs'
import Progress from '../common/Progress'

const AnalyticsPage: React.FC = () => {
  const [dateFrom, setDateFrom] = useState('2026-01-01')
  const [dateTo, setDateTo] = useState('2026-01-16')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Аналитика</h1>
        <p className="text-neutral-600">
          Детальная статистика и показатели платформы
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            label="От"
          />
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            label="До"
          />
          <div className="flex items-end gap-2">
            <Button variant="primary">
              <TrendingUp size={20} />
              Обновить
            </Button>
            <Button variant="secondary">
              <Download size={20} />
              Экспорт
            </Button>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Новых гостей', value: '847', change: '+12.4%' },
          { label: 'Активных', value: '12,847', change: '+5.2%' },
          { label: 'Доход', value: '2.34M₽', change: '+18.2%' },
          { label: 'Операций', value: '48,392', change: '+8.1%' },
        ].map((kpi, idx) => (
          <Card key={idx}>
            <p className="text-sm text-neutral-600">{kpi.label}</p>
            <p className="text-3xl font-bold mt-2">{kpi.value}</p>
            <p className="text-xs text-green-600 mt-2">↑ {kpi.change}</p>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics */}
      <Tabs
        tabs={[
          {
            id: 'distribution',
            label: '📊 Распределение',
            content: (
              <div className="space-y-8">
                <Card title="По уровням лояльности">
                  {[
                    { name: 'Platinum', count: 345, percent: 12 },
                    { name: 'Gold', count: 2847, percent: 42 },
                    { name: 'Silver', count: 5214, percent: 38 },
                    { name: 'Bronze', count: 4441, percent: 8 },
                  ].map((level, idx) => (
                    <div key={idx} className="mb-6 last:mb-0">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{level.name}</span>
                        <span className="text-sm text-neutral-600">
                          {level.count} гостей ({level.percent}%)
                        </span>
                      </div>
                      <Progress value={level.percent} max={100} />
                    </div>
                  ))}
                </Card>

                <Card title="По ресторанам">
                  {[
                    { name: '🍕 Пицца Ночная', value: 2847, percent: 35 },
                    { name: '🍔 Burger Dream', value: 1432, percent: 22 },
                    { name: '🍜 Азиатская', value: 5214, percent: 40 },
                    { name: '☕ Coffee', value: 892, percent: 3 },
                  ].map((restaurant, idx) => (
                    <div key={idx} className="mb-6 last:mb-0">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{restaurant.name}</span>
                        <span className="text-sm text-neutral-600">
                          {restaurant.value} гостей
                        </span>
                      </div>
                      <Progress value={restaurant.percent} max={100} />
                    </div>
                  ))}
                </Card>
              </div>
            ),
          },
          {
            id: 'trends',
            label: '📈 Тренды',
            content: (
              <Card>
                <div className="space-y-6">
                  {[
                    { metric: 'Средний доход на гостя', trend: '+8.3%', value: '97.5K₽' },
                    { metric: 'Активизация карт', trend: '+3.1%', value: '23.4%' },
                    { metric: 'Средний чек', trend: '+5.7%', value: '2,847₽' },
                    { metric: 'Повторные визиты', trend: '+4.2%', value: '67.2%' },
                  ].map((item, idx) => (
                    <div key={idx} className="pb-6 border-b last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.metric}</p>
                          <p className="text-2xl font-bold mt-1">{item.value}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-600 font-semibold">{item.trend}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ),
          },
        ]}
      />
    </div>
  )
}

export default AnalyticsPage
