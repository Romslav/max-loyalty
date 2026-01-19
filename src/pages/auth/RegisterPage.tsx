import React, { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone, AlertCircle, Loader, CheckCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { register, isLoading, error, clearError } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [localError, setLocalError] = useState<string | null>(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setLocalError(null)
    clearError()
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setLocalError('Full name is required')
      return false
    }

    if (formData.name.length < 2) {
      setLocalError('Full name must be at least 2 characters')
      return false
    }

    if (!formData.email.includes('@')) {
      setLocalError('Please enter a valid email')
      return false
    }

    if (formData.password.length < 8) {
      setLocalError('Password must be at least 8 characters')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match')
      return false
    }

    if (!agreedToTerms) {
      setLocalError('You must agree to the Terms of Service')
      return false
    }

    return true
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
      })
      toast.success('Registration successful!')
      navigate('/dashboard')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      setLocalError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const currentError = localError || error
  const passwordStrength = formData.password
    ? formData.password.length >= 12
      ? 'strong'
      : formData.password.length >= 8
      ? 'medium'
      : 'weak'
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-lg mb-4">
            <span className="text-white text-2xl font-bold💳</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Max Loyalty</h1>
          <p className="text-gray-600">Join our loyalty program today</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Account</h2>

          {/* Error Alert */}
          {currentError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">{currentError}</p>
              </div>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Phone (Optional) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="•••••••••"
                />
              </div>
              {passwordStrength && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    <div
                      className={`h-1 flex-1 rounded ${
                        passwordStrength === 'weak' ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    />
                    <div
                      className={`h-1 flex-1 rounded ${
                        passwordStrength === 'weak'
                          ? 'bg-gray-300'
                          : passwordStrength === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-gray-300'
                      }`}
                    />
                    <div
                      className={`h-1 flex-1 rounded ${
                        passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength === 'weak'
                        ? 'text-red-600'
                        : passwordStrength === 'medium'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {passwordStrength === 'weak' ? 'Weak' : passwordStrength === 'medium' ? 'Medium' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="•••••••••"
                />
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <div className="mt-2 flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Passwords match</span>
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <label className="flex items-start gap-3 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={isLoading}
                className="mt-1 rounded border-gray-300 cursor-pointer"
              />
              <span>
                I agree to the{' '}
                <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
