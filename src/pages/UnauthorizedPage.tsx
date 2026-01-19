import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Home } from 'lucide-react'

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <Lock className="w-10 h-10 text-red-600" />
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this resource. Please contact your administrator if you
          believe this is a mistake.
        </p>

        {/* Error Details */}
        <div className="bg-white rounded-lg p-4 mb-8 border border-red-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-700">Error Code:</span> 403 Forbidden
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-semibold text-gray-700">Reason:</span> Insufficient permissions
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition duration-200"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500 mt-8">
          Need help?{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            Contact support
          </a>
        </p>
      </div>
    </div>
  )
}

export default UnauthorizedPage
