import React from 'react'

const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '10px' }}>🎉 Max Loyalty Dashboard</h1>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
        Restaurant Loyalty Platform
      </p>
      
      <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>✅ React + Vite работает!</h2>
        <p style={{ margin: 0, color: '#1b5e20' }}>Приложение успешно загружено и готово к разработке</p>
      </div>

      <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>📋 Следующие шаги:</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Добавить Header компонент</li>
          <li>Добавить Sidebar с навигацией</li>
          <li>Создать страницы: Restaurants, Guests, Analytics</li>
          <li>Интегрировать API</li>
          <li>Добавить Authentication</li>
        </ul>
      </div>
    </div>
  )
}

export default Dashboard
