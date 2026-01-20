import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Eye, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, unknown>;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
}

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    dateTo: new Date(),
    action: '',
    status: '',
  });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0 });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    fetchAuditLogs();
  }, [filters, pagination.page]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/audit-logs', {
        params: {
          from: filters.dateFrom.toISOString(),
          to: filters.dateTo.toISOString(),
          action: filters.action,
          status: filters.status,
          page: pagination.page,
          pageSize: pagination.pageSize,
        },
      });
      setLogs(response.data.logs || []);
      setPagination((prev) => ({ ...prev, total: response.data.total || 0 }));
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      toast.error('Ошибка при загрузке логов');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/admin/audit-logs/export', {
        params: {
          from: filters.dateFrom.toISOString(),
          to: filters.dateTo.toISOString(),
          format: 'csv',
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit-logs-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentElement?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Логи экспортированы');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Ошибка при экспорте логов');
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Логи аудита</h1>
        <p className="text-gray-600 mt-2">Отслеживание всех действий в системе</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2 text-gray-900">
            <Filter size={18} />
            Фильтры
          </h3>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={logs.length === 0}
          >
            <Download size={18} />
            Экспорт CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">От даты</label>
            <input
              type="date"
              value={filters.dateFrom.toISOString().split('T')[0]}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dateFrom: new Date(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">До даты</label>
            <input
              type="date"
              value={filters.dateTo.toISOString().split('T')[0]}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dateTo: new Date(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Действие</label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все действия</option>
              <option value="CREATE">Создание</option>
              <option value="UPDATE">Обновление</option>
              <option value="DELETE">Удаление</option>
              <option value="LOGIN">Вход</option>
              <option value="EXPORT">Экспорт</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все статусы</option>
              <option value="success">Успешно</option>
              <option value="failed">Ошибка</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Загрузка логов...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Логи не найдены</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Время</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Пользователь</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Действие</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Сущность</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Статус</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Детали</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {format(new Date(log.timestamp), 'dd.MM.yyyy HH:mm:ss')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{log.userName}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {log.entityType} #{log.entityId.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          log.status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {log.status === 'success' ? 'Успешно' : 'Ошибка'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setSelectedLog(log)}
                        title="Просмотреть детали"
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
          <button
            onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
            disabled={pagination.page === 1}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={18} />
            Назад
          </button>
          <span className="text-sm text-gray-600">
            Страница {pagination.page} из {totalPages}
          </span>
          <button
            onClick={() => setPagination({ ...pagination, page: Math.min(totalPages, pagination.page + 1) })}
            disabled={pagination.page >= totalPages}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Далее
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Детали записи</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID записи</label>
                <p className="text-sm text-gray-600 mt-1 font-mono break-all">{selectedLog.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Пользователь</label>
                <p className="text-sm text-gray-600 mt-1">{selectedLog.userName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Действие</label>
                <p className="text-sm text-gray-600 mt-1">{selectedLog.action}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Сущность</label>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedLog.entityType} #{selectedLog.entityId}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">IP адрес</label>
                <p className="text-sm text-gray-600 mt-1 font-mono">{selectedLog.ipAddress}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Время</label>
                <p className="text-sm text-gray-600 mt-1">
                  {format(new Date(selectedLog.timestamp), 'dd.MM.yyyy HH:mm:ss')}
                </p>
              </div>
              {Object.keys(selectedLog.changes).length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Изменения</label>
                  <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto max-h-40">
                    {JSON.stringify(selectedLog.changes, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedLog(null)}
              className="w-full mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
