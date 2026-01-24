/**
 * PromotionListPage Component
 * 
 * Main page for managing promotional campaigns.
 * Features: list, create, edit, analytics, code management.
 */

import React, { useState } from 'react'
import { PromotionForm, type PromotionFormData } from '../components/promotion/PromotionForm'
import { PromoCodeCard, type PromoCode } from '../components/promotion/PromoCodeCard'

interface PromotionItem {
  id: string
  name: string
  description: string
  discount: number
  discountType: 'percentage' | 'fixed'
  status: 'draft' | 'active' | 'paused' | 'ended' | 'archived'
  startDate: Date
  endDate: Date
  promoCodes: PromoCode[]
  usedCount: number
  totalCount: number
  createdAt: Date
}

interface PromotionListPageProps {
  onNavigate?: (path: string) => void
}

/**
 * PromotionListPage Component
 */
export const PromotionListPage: React.FC<PromotionListPageProps> = ({ onNavigate }) => {
  const [promotions, setPromotions] = useState<PromotionItem[]>([
    {
      id: 'promo_1',
      name: 'Летняя распродажа',
      description: 'Скидка 20% на все товары летней коллекции',
      discount: 20,
      discountType: 'percentage',
      status: 'active',
      startDate: new Date('2026-01-20'),
      endDate: new Date('2026-02-20'),
      promoCodes: [
        {
          code: 'PROMO20',
          discount: 20,
          discountType: 'percentage',
          used: 45,
          maxUses: 100,
          status: 'active',
          createdAt: new Date('2026-01-20'),
        },
      ],
      usedCount: 45,
      totalCount: 100,
      createdAt: new Date('2026-01-20'),
    },
    {
      id: 'promo_2',
      name: 'Новые клиенты',
      description: 'Скидка 50% для новых пользователей',
      discount: 50,
      discountType: 'percentage',
      status: 'active',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-03-31'),
      promoCodes: [
        {
          code: 'NEWUSER50',
          discount: 50,
          discountType: 'percentage',
          used: 128,
          maxUses: 500,
          status: 'active',
          createdAt: new Date('2026-01-01'),
        },
      ],
      usedCount: 128,
      totalCount: 500,
      createdAt: new Date('2026-01-01'),
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionItem | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'ended'>('all')

  const handleCreatePromotion = (data: PromotionFormData) => {
    const newPromotion: PromotionItem = {
      id: `promo_${Date.now()}`,
      name: data.name,
      description: data.description,
      discount: data.discountValue,
      discountType: data.discountType,
      status: 'draft',
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      promoCodes: [],
      usedCount: 0,
      totalCount: data.numCodes,
      createdAt: new Date(),
    }
    setPromotions([...promotions, newPromotion])
    setShowForm(false)
  }

  const filteredPromotions =
    filter === 'all' ? promotions : promotions.filter((p) => p.status === filter)

  const stats = {
    total: promotions.length,
    active: promotions.filter((p) => p.status === 'active').length,
    draft: promotions.filter((p) => p.status === 'draft').length,
    totalCodes: promotions.reduce((sum, p) => sum + p.totalCount, 0),
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎯 Управление промокодами</h1>
          <p className="mt-2 text-gray-600">Создавайте и управляйте акциями и скидками</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-teal-600 px-6 py-2 font-medium text-white transition-colors hover:bg-teal-700"
          >
            ➕ Новая кампания
          </button>
        )}
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Создать новую кампанию</h2>
          <PromotionForm
            onSubmit={handleCreatePromotion}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">📊 Всего кампаний</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">✅ Активные</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">📝 Черновики</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.draft}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">🔑 Всего кодов</p>
          <p className="mt-2 text-3xl font-bold text-teal-600">{stats.totalCodes}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {['all', 'active', 'draft', 'ended'].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption as typeof filter)}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === filterOption
                ? 'border-b-2 border-teal-600 text-teal-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {filterOption === 'all' && 'Все'}
            {filterOption === 'active' && 'Активные'}
            {filterOption === 'draft' && 'Черновики'}
            {filterOption === 'ended' && 'Завершённые'}
          </button>
        ))}
      </div>

      {/* Promotions List */}
      <div className="space-y-4">
        {filteredPromotions.map((promotion) => (
          <div
            key={promotion.id}
            className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-900">{promotion.name}</h3>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      promotion.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : promotion.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {promotion.status === 'active' && '✅ Active'}
                    {promotion.status === 'draft' && '📝 Draft'}
                    {promotion.status === 'ended' && '✓ Ended'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{promotion.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-teal-600">
                  {promotion.discountType === 'percentage'
                    ? `${promotion.discount}%`
                    : `₽${promotion.discount}`}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-600">📅 Период</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {promotion.startDate.toLocaleDateString('ru-RU')} —{' '}
                  {promotion.endDate.toLocaleDateString('ru-RU')}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-600">🔑 Промокоды</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {promotion.usedCount} / {promotion.totalCount} использовано
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-600">📊 Кодов активных</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {promotion.promoCodes.filter((c) => c.status === 'active').length} шт.
                </p>
              </div>
            </div>

            {/* Promo Codes */}
            {promotion.promoCodes.length > 0 && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="mb-3 text-sm font-medium text-gray-900">🎟 Активные промокоды:</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {promotion.promoCodes.slice(0, 4).map((promoCode) => (
                    <PromoCodeCard key={promoCode.code} code={promoCode} />
                  ))}
                </div>
                {promotion.promoCodes.length > 4 && (
                  <p className="mt-3 text-center text-sm text-gray-600">
                    +{promotion.promoCodes.length - 4} еще...
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50">
                ✏️ Редактировать
              </button>
              <button className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50">
                📊 Аналитика
              </button>
              <button className="flex-1 rounded-lg bg-teal-50 px-4 py-2 font-medium text-teal-700 transition-colors hover:bg-teal-100">
                🔑 Управлять кодами
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPromotions.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-lg text-gray-600">📭 Нет кампаний в этой категории</p>
          {!showForm && filter === 'draft' && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 rounded-lg bg-teal-600 px-4 py-2 font-medium text-white transition-colors hover:bg-teal-700"
            >
              Создать первую кампанию
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default PromotionListPage
