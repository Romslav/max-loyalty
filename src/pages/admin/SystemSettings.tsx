import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Bell, Lock, Zap, Eye, EyeOff } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';

interface SystemSetting {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json';
  label: string;
  description: string;
  category: string;
}

interface Category {
  name: string;
  icon: React.ReactNode;
  color: string;
}

const categories: Record<string, Category> = {
  general: { name: 'Общие', icon: <Settings size={20} />, color: 'bg-blue-100' },
  notifications: { name: 'Оувещения', icon: <Bell size={20} />, color: 'bg-yellow-100' },
  security: { name: 'Безопасность', icon: <Lock size={20} />, color: 'bg-red-100' },
  performance: { name: 'Производительность', icon: <Zap size={20} />, color: 'bg-green-100' },
};

export const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [changes, setChanges] = useState<Record<string, any>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/system-settings');
      setSettings(response.data || []);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Ошибка при загружке настроек');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (Object.keys(changes).length === 0) {
      toast.info('Нет изменений для сохранения');
      return;
    }

    try {
      setSaving(true);
      await api.patch('/admin/system-settings', changes);
      toast.success('Настройки сохранены');
      setChanges({});
      await fetchSettings();
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: string, value: any, type: string) => {
    let parsedValue = value;

    if (type === 'number') {
      parsedValue = value === '' ? '' : parseFloat(value);
    } else if (type === 'boolean') {
      parsedValue = value === 'true';
    } else if (type === 'json') {
      try {
        parsedValue = JSON.parse(value);
      } catch (e) {
        // Invalid JSON, keep as string for validation
        parsedValue = value;
      }
    }

    setChanges((prev) => ({
      ...prev,
      [key]: parsedValue,
    }));
  };

  const handleReset = () => {
    if (window.confirm('Отменить все изменения?')) {
      setChanges({});
    }
  };

  const handleRestoreDefaults = async () => {
    if (window.confirm('Вы уверены? Конфигурация вернется к стандартным значениям')) {
      try {
        setSaving(true);
        await api.post('/admin/system-settings/restore-defaults');
        toast.success('Настройки востановлены');
        setChanges({});
        await fetchSettings();
      } catch (error) {
        console.error('Failed to restore defaults:', error);
        toast.error('Ошибка при восстановлении');
      } finally {
        setSaving(false);
      }
    }
  };

  const categorySettings = settings.filter((s) => s.category === selectedCategory);
  const hasChanges = Object.keys(changes).length > 0;

  const renderSettingInput = (setting: SystemSetting) => {
    const value = changes[setting.key] !== undefined ? changes[setting.key] : setting.value;

    const isPassword = setting.key.includes('password') || setting.key.includes('secret') || setting.key.includes('token');
    const shouldHidePassword = isPassword && !showPasswords[setting.key];

    switch (setting.type) {
      case 'boolean':
        return (
          <select
            value={value ? 'true' : 'false'}
            onChange={(e) => handleSettingChange(setting.key, e.target.value, setting.type)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="true">Включено</option>
            <option value="false">Отключено</option>
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value, setting.type)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'json':
        return (
          <textarea
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            onChange={(e) => handleSettingChange(setting.key, e.target.value, setting.type)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            rows={6}
          />
        );

      default:
        return (
          <div className="relative">
            <input
              type={shouldHidePassword ? 'password' : 'text'}
              value={value}
              onChange={(e) => handleSettingChange(setting.key, e.target.value, setting.type)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, [setting.key]: !prev[setting.key] }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords[setting.key] ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Настройки системы</h1>
        <p className="text-gray-600 mt-2">Управление глобальными параметрами</p>
      </div>

      {/* Category Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              selectedCategory === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className={selectedCategory === key ? 'text-white' : 'text-gray-600'}>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Settings Form */}
      {loading ? (
        <div className="p-8 text-center text-gray-500">Загрузка настроек...</div>
      ) : categorySettings.length === 0 ? (
        <div className="p-8 text-center text-gray-500">Не найдено настроек для этой категории</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          {categorySettings.map((setting) => (
            <div key={setting.key} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
              <label className="block text-sm font-semibold text-gray-900 mb-2">{setting.label}</label>
              <p className="text-sm text-gray-600 mb-3">{setting.description}</p>
              <div className="flex items-end gap-3">
                <div className="flex-1">{renderSettingInput(setting)}</div>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 whitespace-nowrap">key: {setting.key}</code>
              </div>
              {changes[setting.key] !== undefined && (
                <p className="text-xs text-blue-600 mt-2">Настройка изменена</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 sticky bottom-0 bg-white py-4 border-t border-gray-200 -mx-6 px-6">
        <button
          onClick={handleReset}
          disabled={!hasChanges}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Отменить
        </button>
        <button
          onClick={handleSaveSettings}
          disabled={!hasChanges || saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Save size={18} />
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button
          onClick={handleRestoreDefaults}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition ml-auto"
        >
          <RefreshCw size={18} />
          Встановить стандарт
        </button>
      </div>
    </div>
  );
};
