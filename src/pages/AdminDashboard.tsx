import { useQuery } from '../hooks/useQuery'
import { usePermissions } from '../hooks/usePermissions'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorAlert } from '../components/ErrorAlert'
import { Card } from '../components/Card'
import { CanAccess } from '../components/CanAccess'

interface DashboardStats {
  totalUsers: number
  totalRestaurants: number
  activeGuests: number
  totalRevenue: number
  pendingOperations: number
  systemHealth: number
  apiStatus: string
  dbStatus: string
}

interface RecentActivity {
  id: string
  action: string
  user: string
  resource: string
  timestamp: string
}

interface AdminData {
  stats: DashboardStats
  recentActivity: RecentActivity[]
}

// Mock сервис
const adminService = {
  async getDashboard(): Promise<AdminData> {
    return Promise.resolve({
      stats: {
        totalUsers: 542,
        totalRestaurants: 48,
        activeGuests: 15234,
        totalRevenue: 850000,
        pendingOperations: 23,
        systemHealth: 99.8,
        apiStatus: 'online',
        dbStatus: 'connected',
      },
      recentActivity: [
        {
          id: '1',
          action: 'Установка сертификата SSL',
          user: 'admin@example.com',
          resource: 'SSL Config',
          timestamp: '2026-01-19 17:00',
        },
        {
          id: '2',
          action: 'Обновление API',
          user: 'system',
          resource: 'API Server',
          timestamp: '2026-01-19 16:30',
        },
        {
          id: '3',
          action: 'Бекап базы данных',
          user: 'system',
          resource: 'Database',
          timestamp: '2026-01-19 15:00',
        },
      ],
    })
  },
}

const AdminDashboard = () => {
  const { hasPermission } = usePermissions()
  const { data, loading, error, refetch } = useQuery(
    () => adminService.getDashboard(),
    {
      retryCount: 3,
      retryDelay: 1000,
    }
  )

  // ⏳ Лоадинг
  if (loading && !data) {
    return <LoadingSpinner text={"📊 Оптимизирую данные..."} />
  }

  // ❌ Ошибка
  if (error && !data) {
    return (
      <ErrorAlert
        error={error}
        title="Ошибка при загрузке контрольной панели"
        onRetry={refetch}
      />
    )
  }

  const stats = data?.stats

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📊 Контрольная панель</h1>
              <p className="text-gray-600 mt-1">Обзор системы MAX LOYALTY</p>
            </div>
            <CanAccess permission="settings:write">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                ⚙️ Настройки
              </button>
            </CanAccess>
          </div>
        </div>
      </div>

      {/* Математические карточки */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Основные метрики */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Пользователи */}
          <Card className="p-6">
            <div>
              <p className="text-gray-600 text-sm font-medium">👥 Пользователи</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalUsers || 0}
              </p>
              <p className="text-sm text-blue-600 mt-2">🌐 Всего</p>
            </div>
          </Card>

          {/* Рестораны */}
          <Card className="p-6">
            <div>
              <p className="text-gray-600 text-sm font-medium">🍴 Рестораны</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalRestaurants || 0}
              </p>
              <p className="text-sm text-green-600 mt-2">✅ Активные</p>
            </div>
          </Card>

          {/* Гости */}
          <Card className="p-6">
            <div>
              <p className="text-gray-600 text-sm font-medium">👤 Гости</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {(stats?.activeGuests || 0).toLocaleString()}
              </p>
              <p className="text-sm text-purple-600 mt-2">📈 На сайте</p>
            </div>
          </Card>

          {/* Доход */}
          <Card className="p-6">
            <div>
              <p className="text-gray-600 text-sm font-medium">💰 Доход</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${(stats?.totalRevenue || 0).toLocaleString()}
              </p>
              <p className="text-sm text-emerald-600 mt-2">📈 +12% этом месяце</p>
            </div>
          </Card>
        </div>

        {/* Системные метрики */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Здоровье системы */}
          <Card className="p-6">
            <div>
              <p className="text-gray-600 text-sm font-medium">🏥 Здоровье системы</p>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">API</span>
                  <span className="text-xs font-bold text-green-600">🌟 Online</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Database</span>
                  <span className="text-xs font-bold text-green-600">Connected</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Ожидающие операции */}
          <Card className="p-6">
            <div>
              <p className="text-gray-600 text-sm font-medium">⏳ Ожидающие</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {stats?.pendingOperations || 0}
              </p>
              <p className="text-sm text-gray-600 mt-2">требуют внимания</p>
            </div>
          </Card>

          {/* Уровень отказов */}
          <Card className="p-6">
            <div>
              <p className="text-gray-600 text-sm font-medium">System Health</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats?.systemHealth || 0}%
              </p>
              <p className="text-sm text-gray-600 mt-2">All systems nominal</p>
            </div>
          </Card>
        </div>

        {/* Недавняя активность */}
        <CanAccess permission="audit:read">
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">📊 Недавняя активность</h2>
              <div className="space-y-3">
                {data?.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {activity.user} · {activity.resource}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </CanAccess>
      </div>
    </div>
  )
}

export default AdminDashboard
