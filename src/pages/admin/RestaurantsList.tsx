import React, { useState } from 'react'
import { Search, Filter, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import Input from '../common/Input'
import Table from '../common/Table'
import Badge from '../common/Badge'
import Modal from '../common/Modal'

const RestaurantsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [restaurants, setRestaurants] = useState([
    {
      id: '1',
      name: '🍕 Пицца Ночная',
      owner: 'ООО "Пиццерия"',
      plan: 'PRO',
      guests: '2,847',
      income: '185,400₽',
      status: 'Активен',
      joined: '12.03.2023',
    },
    {
      id: '2',
      name: '🍔 Burger Dream',
      owner: 'ИП Иванов И.И.',
      plan: 'STANDARD',
      guests: '1,432',
      income: '98,760₽',
      status: 'Активен',
      joined: '15.04.2023',
    },
    {
      id: '3',
      name: '🍜 Азиатская Лапша',
      owner: 'ООО "Азия Гастро"',
      plan: 'ULTIMA',
      guests: '5,214',
      income: '342,680₽',
      status: 'Активен',
      joined: '08.02.2023',
    },
    {
      id: '4',
      name: '☕ Coffee House',
      owner: 'ООО "Кофейный Дом"',
      plan: 'STANDARD',
      guests: '892',
      income: '62,450₽',
      status: 'Заблокирован',
      joined: '20.05.2023',
    },
  ])

  const columns = [
    { key: 'name', label: 'Название', width: '20%' },
    { key: 'owner', label: 'Владелец', width: '20%' },
    {
      key: 'plan',
      label: 'Тариф',
      width: '12%',
      render: (value: string) => (
        <Badge
          color={
            value === 'PRO'
              ? 'gold'
              : value === 'ULTIMA'
              ? 'platinum'
              : 'silver'
          }
          text={value}
          size="sm"
        />
      ),
    },
    { key: 'guests', label: 'Гости', width: '12%' },
    { key: 'income', label: 'Доход', width: '15%' },
    {
      key: 'status',
      label: 'Статус',
      width: '12%',
      render: (value: string) => (
        <Badge
          color={value === 'Активен' ? 'green' : 'red'}
          text={value}
          size="sm"
        />
      ),
    },
    {
      key: 'id',
      label: 'Действия',
      width: '9%',
      render: (id: string) => (
        <div className="flex gap-1">
          <button className="p-1 hover:bg-neutral-100 rounded" title="Редактировать">
            <Edit2 size={16} className="text-blue-500" />
          </button>
          <button className="p-1 hover:bg-neutral-100 rounded" title="Удалить">
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>
      ),
    },
  ]

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedPlan || r.plan === selectedPlan)
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Рестораны</h1>
        <p className="text-neutral-600">
          Управление всеми ресторанами на платформе
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div>
            <p className="text-sm text-neutral-600">Всего ресторанов</p>
            <p className="text-3xl font-bold text-neutral-900 mt-2">24</p>
            <p className="text-xs text-green-600 mt-2">↑ +2 за месяц</p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm text-neutral-600">Активных</p>
            <p className="text-3xl font-bold text-neutral-900 mt-2">21</p>
            <p className="text-xs text-green-600 mt-2">87.5%</p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm text-neutral-600">Общий доход</p>
            <p className="text-3xl font-bold text-neutral-900 mt-2">1.33M₽</p>
            <p className="text-xs text-green-600 mt-2">↑ +18.2%</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Поиск по названию..."
            icon={<Search size={20} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="px-4 py-2.5 border-2 border-neutral-200 rounded-lg focus:border-primary-500"
          >
            <option value="">Все тарифы</option>
            <option value="FREE">FREE</option>
            <option value="STANDARD">STANDARD</option>
            <option value="PRO">PRO</option>
            <option value="ULTIMA">ULTIMA</option>
          </select>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus size={20} />
            Добавить
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table columns={columns} data={filteredRestaurants} hoverable striped />
      </Card>

      {/* Add Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Новый ресторан"
        size="lg"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Отмена
            </Button>
            <Button variant="primary">Создать</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Название ресторана" placeholder="Введите название" fullWidth />
          <Input label="Email" type="email" placeholder="email@example.com" fullWidth />
          <Input label="Телефон" type="tel" placeholder="+7 999 123-45-67" fullWidth />
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-2 block">
              Тариф
            </label>
            <select className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-lg">
              <option>STANDARD</option>
              <option>PRO</option>
              <option>ULTIMA</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default RestaurantsList
