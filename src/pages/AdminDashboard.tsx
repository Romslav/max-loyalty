import React from 'react'

const AdminDashboard: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>🎉 Admin Dashboard</h1>
      <p>Max Loyalty - Restaurant Loyalty Platform</p>
      
      <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>✅ Приложение РАБОТАЕТ!</h2>
        <p>React + Vite + TypeScript успешно загружены</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Следующие шаги:</h3>
        <ul>
          <li>Добавить Header компонент</li>
          <li>Добавить Sidebar компонент</li>
          <li>Создать страницы Dashboard</li>
          <li>Интегрировать API</li>
        </ul>
      </div>
    </div>
  )
}

export default AdminDashboard
