import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MessageCircle, AlertCircle, User, Mail, Phone, CheckCircle, Clock, XCircle } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

interface SupportTicket {
  id: string;
  number: number;
  subject: string;
  description: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  category: string;
  messages: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

const getStatusIcon = (status: TicketStatus) => {
  switch (status) {
    case 'open':
      return <AlertCircle className="text-red-500" size={18} />;
    case 'in_progress':
      return <Clock className="text-yellow-500" size={18} />;
    case 'resolved':
      return <CheckCircle className="text-green-500" size={18} />;
    case 'closed':
      return <XCircle className="text-gray-500" size={18} />;
  }
};

const getStatusLabel = (status: TicketStatus): Record<TicketStatus, string> => ({
  open: 'Открыт',
  in_progress: 'В работе',
  resolved: 'Решено',
  closed: 'Закрыто',
})[status];

const getPriorityColor = (priority: TicketPriority) => {
  switch (priority) {
    case 'low':
      return 'bg-blue-100 text-blue-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'urgent':
      return 'bg-red-100 text-red-800';
  }
};

const getPriorityLabel = (priority: TicketPriority): Record<TicketPriority, string> => ({
  low: 'Низкая',
  medium: 'Средняя',
  high: 'Высокая',
  urgent: 'Критичная',
})[priority];

export const SupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignedTo: '',
    search: '',
  });
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [staffMembers, setStaffMembers] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    fetchTickets();
    fetchStaffMembers();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/support-tickets', {
        params: {
          status: filters.status,
          priority: filters.priority,
          assignedTo: filters.assignedTo,
          search: filters.search,
        },
      });
      setTickets(response.data || []);
    } catch (error) {
      console.error('Failed to load tickets:', error);
      toast.error('Ошибка при загруждении тикетов');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffMembers = async () => {
    try {
      const response = await api.get('/admin/staff-members');
      setStaffMembers(response.data || []);
    } catch (error) {
      console.error('Failed to load staff:', error);
    }
  };

  const handleAssignTicket = async (ticketId: string, staffId: string) => {
    try {
      await api.patch(`/admin/support-tickets/${ticketId}/assign`, {
        assignedTo: staffId,
      });
      toast.success('Тикет переназначен');
      fetchTickets();
    } catch (error) {
      console.error('Failed to assign ticket:', error);
      toast.error('Ошибка при переназначении тикета');
    }
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: TicketStatus) => {
    try {
      await api.patch(`/admin/support-tickets/${ticketId}/status`, {
        status: newStatus,
      });
      toast.success('Статус обновлен');
      fetchTickets();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Ошибка при обновлении статуса');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      setSendingMessage(true);
      await api.post(`/admin/support-tickets/${selectedTicket.id}/messages`, {
        content: newMessage,
      });
      toast.success('Сообщение отправлено');
      setNewMessage('');
      const updated = await api.get(`/admin/support-tickets/${selectedTicket.id}`);
      setSelectedTicket(updated.data);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Ошибка при отправке сообщения');
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) =>
    filters.search
      ? ticket.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.customerName.toLowerCase().includes(filters.search.toLowerCase())
      : true
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Тикеты поддержки</h1>
        <p className="text-gray-600 mt-2">Открыт {filteredTickets.length} тикетов</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Поиск</label>
            <input
              type="text"
              placeholder="По теме или клиенту"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все статусы</option>
              <option value="open">Открытые</option>
              <option value="in_progress">В работе</option>
              <option value="resolved">Решеные</option>
              <option value="closed">Закрытые</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Приоритет</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все приоритеты</option>
              <option value="low">Низкая</option>
              <option value="medium">Средняя</option>
              <option value="high">Высокая</option>
              <option value="urgent">Критичная</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Назначено</label>
            <select
              value={filters.assignedTo}
              onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все</option>
              {staffMembers.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Загрузка тикетов...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Тикеты не найдены</div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">#{ticket.number}</span>
                    <span className="flex items-center gap-1 text-sm">
                      {getStatusIcon(ticket.status)}
                      <span className="text-gray-600">{getStatusLabel(ticket.status)}</span>
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {getPriorityLabel(ticket.priority)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{ticket.subject}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <User size={16} />
                      {ticket.customerName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail size={16} />
                      {ticket.customerEmail}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={16} />
                      {ticket.messages.length} сообщений
                    </span>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {format(new Date(ticket.createdAt), 'dd.MM.yyyy HH:mm')}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">#{selectedTicket.number}: {selectedTicket.subject}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    {getStatusIcon(selectedTicket.status)}
                    {getStatusLabel(selectedTicket.status)}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                    {getPriorityLabel(selectedTicket.priority)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3"Клиент</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-500" />
                    <span>{selectedTicket.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-500" />
                    <a href={`mailto:${selectedTicket.customerEmail}`} className="text-blue-600 hover:underline">
                      {selectedTicket.customerEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-500" />
                    {selectedTicket.customerPhone}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Действия</h4>
                <div className="flex gap-2">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value as TicketStatus)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="open">Открыт</option>
                    <option value="in_progress">В работе</option>
                    <option value="resolved">Решено</option>
                    <option value="closed">Закрыто</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Назначить сотруднику</label>
                  <select
                    value={selectedTicket.assignedTo?.id || ''}
                    onChange={(e) => handleAssignTicket(selectedTicket.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Не назначено</option>
                    {staffMembers.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Конверсация</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4 max-h-60 overflow-y-auto">
                  {selectedTicket.messages.map((msg) => (
                    <div key={msg.id} className="bg-white p-3 rounded border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-gray-900">{msg.author}</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(msg.timestamp), 'dd.MM.yyyy HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{msg.content}</p>
                    </div>
                  ))}
                </div>

                {/* Send Message */}
                <div className="flex gap-2">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Напишите сообщение..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {sendingMessage ? 'Отправка...' : 'Отправить'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
