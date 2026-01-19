import React, { useState } from 'react'
import { Plus, Download, Filter, AlertCircle } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import Input from '../common/Input'
import Table from '../common/Table'
import Badge from '../common/Badge'
import Modal from '../common/Modal'

const PointsOperations: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [newOperation, setNewOperation] = useState({
    guestName: '',
    amount: '',
    type: 'credit',
    reason: '',
  })

  const operations = [
    {
      date: '16.01.2026, 18:45',
      guest: 'Иван Петров',
      type: 'Начисление',
      amount: '+185 баллов',
      value: 185,
      reason: 'Заказ #45829',
      status: 'Завершено',
    },
    {
      date: '16.01.2026, 12:30',
      guest: 'Мария Сидорова',
      type: 'Начисление',
      amount: '+65 баллов',
      value: 65,
      reason: 'Заказ #45821',
      status: 'Завершено',
    },
    {
      date: '15.01.2026, 19:45',
      guest: 'Алексей Волков',
      type: 'Списание',
      amount: '-50 баллов',
      value: -50,
      reason: 'Возврат',
      status: 'Завершено',
    },
    {
      date: '15.01.2026, 14:20',
      guest: 'Елена Кузнецова',
      type: 'Начисление',
      amount: '+120 баллов',
      value: 120,
      reason: 'Заказ #45812',
      status: 'Завершено',
    },
  ]

  const columns = [
    { key: 'date', label: 'Дата', width: '15%' },
    { key: 'guest', label: 'Гость', width: '20%' },
    { key: 'type', label: 'Тип', width: '12%' },
    { key: 'amount', label: 'Сумма', width: '12%' },
    { key: 'reason', label: 'Причина', width: '25%' },
    {
      key: 'status',
      label: 'Статус',
      width: '16%',
      render: (value: string) => (
        <Badge color="green" text={value} size="sm" />
      ),
    },
  ]

  const filteredOperations = operations.filter(
    (op) => filterType === 'all' || op.type === filterType
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Операции с баллами
        </h1>
        <p className="text-neutral-600">
          Управление начислением и списанием баллов гостей
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <p className="text-sm text-neutral-600">Начислено сегодня</p>
          <p className="text-3xl font-bold mt-2">+1,620</p>
          <p className="text-xs text-green-600 mt-2">↑ +12.4%</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-600">Списано сегодня</p>
          <p className="text-3xl font-bold mt-2">-50</p>
          <p className="text-xs text-red-600 mt-2">↓ -5.2%</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-600">Баланс в системе</p>
          <p className="text-3xl font-bold mt-2">284,570</p>
          <p className="text-xs text-green-600 mt-2">↑ +1,570</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-600">Всего операций</p>
          <p className="text-3xl font-bold mt-2">3,847</p>
          <p className="text-xs text-green-600 mt-2">↑ +8.1%</p>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 border-2 border-neutral-200 rounded-lg focus:border-primary-500"
          >
            <option value="all">Все операции</option>
            <option value="Начисление">Начисления</option>
            <option value="Списание">Списания</option>
          </select>
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            icon={<Plus size={20} />}
          >
            Новая операция
          </Button>
          <Button variant="secondary" icon={<Download size={20} />}>
            Экспорт
          </Button>
        </div>
      </Card>

      {/* Alert */}
      <Card className="mb-8 border-l-4 border-warning">
        <div className="flex gap-3">
          <AlertCircle className="text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Все операции логируются</p>
            <p className="text-sm text-neutral-600">
              Каждая операция с баллами сохраняется в истории и не может быть
              отменена без подтверждения администратора.
            </p>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          data={filteredOperations}
          hoverable
          striped
        />
      </Card>

      {/* Add Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Новая операция"
        size="lg"
        footer={
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowAddModal(false)}
            >
              Отмена
            </Button>
            <Button variant="primary">Выполнить</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Имя гостя"
            placeholder="Введите имя"
            fullWidth
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-2 block">
                Тип операции
              </label>
              <select className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-lg">
                <option>Начисление</option>
                <option>Списание</option>
              </select>
            </div>
            <Input
              label="Кол-во баллов"
              type="number"
              placeholder="100"
            />
          </div>
          <Input
            label="Причина"
            placeholder="Заказ #12345"
            fullWidth
          />
        </div>
      </Modal>
    </div>
  )
}

export default PointsOperations
