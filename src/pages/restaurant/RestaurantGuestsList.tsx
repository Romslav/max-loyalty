import React, { useState } from 'react'
import { Search, Filter, Download, Plus } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import Input from '../common/Input'
import Table from '../common/Table'
import Badge from '../common/Badge'
import Tabs from '../common/Tabs'

const RestaurantGuestsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')

  const guests = [
    {
      name: 'Иван Петров',
      phone: '+7 (901) 234-56-78',
      level: 'Platinum',
      visits: 156,
      lastVisit: '3 часа назад',
      totalSpent: '456,200₽',
      balance: '8,920₽',
    },
    {
      name: 'Мария Сидорова',
      phone: '+7 (921) 654-32-10',
      level: 'Gold',
      visits: 47,
      lastVisit: '1 день назад',
      totalSpent: '127,400₽',
      balance: '2,450₽',
    },
    {
      name: 'Алексей Волков',
      phone: '+7 (912) 345-67-89',
      level: 'Silver',
      visits: 23,
      lastVisit: '5 дней назад',
      totalSpent: '58,500₽',
      balance: '1,120₽',
    },
    {
      name: 'Елена Кузнецова',
      phone: '+7 (987) 654-32-10',
      level: 'Bronze',
      visits: 2,
      lastVisit: '2 недели назад',
      totalSpent: '5,200₽',
      balance: '100₽',
    },
  ]

  const columns = [
    { key: 'name', label: 'Имя', width: '20%' },
    {
      key: 'phone',
      label: 'Телефон',
      width: '18%',
      render: (value: string) => (
        <a href={`tel:${value}`} className="text-blue-500 hover:underline text-sm">
          {value}
        </a>
      ),
    },
    {
      key: 'level',
      label: 'Уровень',
      width: '12%',
      render: (value: string) => (
        <Badge
          color={
            value === 'Platinum'
              ? 'platinum'
              : value === 'Gold'
              ? 'gold'
              : value === 'Silver'
              ? 'silver'
              : 'bronze'
          }
          text={value}
          size="sm"
        />
      ),
    },
    { key: 'visits', label: 'Визиты', width: '10%' },
    { key: 'lastVisit', label: 'Последний визит', width: '15%' },
    { key: 'totalSpent', label: 'Потрачено', width: '12%' },
    { key: 'balance', label: 'Баланс', width: '13%' },
  ]

  const filteredGuests = guests.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedLevel || g.level === selectedLevel)
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Гости ресторана</h1>
        <p className="text-neutral-600">
          Управление гостями и их программой лояльности
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <p className="text-sm text-neutral-600">Всего гостей</p>
          <p className="text-3xl font-bold mt-2">2,847</p>
          <p className="text-xs text-green-600 mt-2">↑ +5.2% за месяц</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-600">VIP (Gold+)</p>
          <p className="text-3xl font-bold mt-2">203</p>
          <p className="text-xs text-green-600 mt-2">7.1%</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-600">Активные</p>
          <p className="text-3xl font-bold mt-2">2,401</p>
          <p className="text-xs text-green-600 mt-2">84.3%</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-600">Всего потрачено</p>
          <p className="text-3xl font-bold mt-2">647.3K₽</p>
          <p className="text-xs text-green-600 mt-2">↑ +8.7%</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Поиск по имени или телефону..."
            icon={<Search size={20} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2.5 border-2 border-neutral-200 rounded-lg focus:border-primary-500"
          >
            <option value="">Все уровни</option>
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
          </select>
          <Button variant="primary" icon={<Download size={20} />}>
            Экспорт
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table columns={columns} data={filteredGuests} hoverable striped />
      </Card>
    </div>
  )
}

export default RestaurantGuestsList
