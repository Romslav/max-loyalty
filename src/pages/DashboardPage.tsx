import { useAuth } from '../hooks/useAuth';

export const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-600">Max Loyalty</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome, {user?.name}! 👋</h2>
          <p className="text-gray-600 mb-6">You have successfully logged in to Max Loyalty Platform.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* User Info Card */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
              <h3 className="text-lg font-semibold text-teal-900 mb-4">👤 Account Information</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium text-gray-700">Email:</span> {user?.email}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Role:</span>
                  <span className="ml-2 inline-block px-3 py-1 bg-teal-600 text-white rounded-full text-xs font-semibold uppercase">
                    {user?.role}
                  </span>
                </p>
                {user?.restaurantId && (
                  <p>
                    <span className="font-medium text-gray-700">Restaurant ID:</span> {user.restaurantId}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">🚀 Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  View Profile
                </button>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">✅ System Status</h3>
            <p className="text-green-700 text-sm">
              All systems are operational. You have full access to the platform.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
