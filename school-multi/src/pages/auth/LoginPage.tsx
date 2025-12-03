import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GoogleAuthButton from '../../components/auth/GoogleAuthButton'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { loginWithEmail } = useAuth()
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await loginWithEmail(formData.email, formData.password)
      if (result.success) {
        navigate('/')
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="auth-landing">
      <div className="auth-landing__card">
        <div className="auth-landing__illustration">
          <div className="machine">
            <div className="machine__body">
              <div className="machine__eye" />
              <div className="machine__window" />
              <div className="machine__belt machine__belt--in">
                <span />
                <span />
                <span />
              </div>
              <div className="machine__belt machine__belt--out">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="machine__shapes">
              <div className="shape shape--circle" />
              <div className="shape shape--triangle" />
              <div className="shape shape--square" />
            </div>
          </div>
        </div>

        <div className="auth-landing__panel">
          <div className="auth-landing__top">
            <span>Don&apos;t have an account?</span>
            <a className="link" href="#">
              Sign up
            </a>
          </div>

          <div className="auth-landing__content">
            <span className="auth-landing__badge">👋 Welcome back</span>
            <h1>Sign in</h1>
            <p>Access your school portal and manage your classes seamlessly.</p>

            {!showEmailForm ? (
              <>
                <div className="auth-landing__providers">
                  <GoogleAuthButton fullWidth />
                </div>

                <div className="auth-landing__divider">
                  <span>or continue with email address</span>
                </div>

                <div className="auth-landing__fields">
                  <button type="button" className="field" onClick={() => setShowEmailForm(true)}>
                    <span className="icon">✉️</span>
                    <div>
                      <label>Sign in with Email</label>
                      <p>Use your registered email</p>
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleEmailLogin} className="w-full">
                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="w-full mt-3 text-sm text-gray-600 hover:text-gray-900"
                >
                  ← Back to options
                </button>
              </form>
            )}

            <div className="auth-landing__super mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-2">Are you an administrator?</p>
              <Link to="/admin/login" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                Login as School Admin →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage