import React, { useState } from 'react'
import { Edit2, LogOut, Lock, Bell, Globe } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import Input from '../common/Input'
import Tabs from '../common/Tabs'
import Badge from '../common/Badge'

const GuestProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'ivan@mail.ru',
    phone: '+7 (901) 234-56-78',
    level: 'Gold',
    balance: 3850,
    registeredAt: '12 марта 2023',
  })

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Мой профиль</h1>
        <p className="text-neutral-600">Управление учётной записью и предпочтениями</p>
      </div>

      <Tabs
        tabs={[
          {
            id: 'profile',
            label: '👤 Профиль',
            content: (
              <div className="space-y-6">
                <Card>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Личная информация</h2>
                    <Button
                      variant={isEditing ? 'secondary' : 'outline'}
                      onClick={() => setIsEditing(!isEditing)}
                      icon={<Edit2 size={20} />}
                    >
                      {isEditing ? 'Отмена' : 'Редактировать'}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Имя"
                        value={profile.firstName}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            firstName: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                      <Input
                        label="Фамилия"
                        value={profile.lastName}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            lastName: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <Input
                      label="Email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      disabled={!isEditing}
                      fullWidth
                    />
                    <Input
                      label="Телефон"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      disabled={!isEditing}
                      fullWidth
                    />
                  </div>

                  {isEditing && (
                    <div className="flex gap-2 mt-6">
                      <Button variant="primary" fullWidth>
                        Сохранить
                      </Button>
                      <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => setIsEditing(false)}
                      >
                        Отмена
                      </Button>
                    </div>
                  )}
                </Card>

                {/* Loyalty Status */}
                <Card>
                  <h2 className="text-xl font-semibold mb-4">Статус лояльности</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-neutral-50 rounded-lg">
                      <Badge color="gold" text="GOLD" />
                      <p className="text-2xl font-bold mt-2">{profile.balance}</p>
                      <p className="text-sm text-neutral-600">Баланс баллов</p>
                    </div>
                    <div className="text-center p-4 bg-neutral-50 rounded-lg">
                      <p className="text-sm text-neutral-600">Дата регистрации</p>
                      <p className="text-lg font-semibold mt-2">
                        {profile.registeredAt}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-neutral-50 rounded-lg">
                      <p className="text-sm text-neutral-600">Всего потрачено</p>
                      <p className="text-lg font-semibold mt-2">127,400₽</p>
                    </div>
                  </div>
                </Card>
              </div>
            ),
          },
          {
            id: 'security',
            label: '🔒 Безопасность',
            content: (
              <div className="space-y-4">
                <Card>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold">Пароль</h3>
                      <p className="text-sm text-neutral-600">
                        Последнее изменение 3 месяца назад
                      </p>
                    </div>
                    <Button variant="outline" icon={<Lock size={20} />}>
                      Изменить
                    </Button>
                  </div>
                </Card>

                <Card>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Двухфакторная аутентификация</h3>
                      <p className="text-sm text-neutral-600">
                        Добавьте дополнительный уровень безопасности
                      </p>
                    </div>
                    <Badge color="blue" text="Отключено" size="sm" />
                  </div>
                  <Button variant="primary" fullWidth className="mt-4">
                    Включить 2FA
                  </Button>
                </Card>
              </div>
            ),
          },
          {
            id: 'notifications',
            label: '🔔 Уведомления',
            content: (
              <Card>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Email уведомления',
                      desc: 'Получайте письма о новых бонусах',
                      enabled: true,
                    },
                    {
                      title: 'SMS напоминания',
                      desc: 'Смс о близких операциях',
                      enabled: false,
                    },
                    {
                      title: 'Push уведомления',
                      desc: 'Браузерные уведомления',
                      enabled: true,
                    },
                  ].map((notif, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center pb-4 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{notif.title}</p>
                        <p className="text-sm text-neutral-600">{notif.desc}</p>
                      </div>
                      <input type="checkbox" defaultChecked={notif.enabled} />
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

export default GuestProfile
