import React, { useState, FormEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const SuperAdminLogin: React.FC = () => {
  const { loginWithEmail } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await loginWithEmail(formData.email, formData.password)
      
      if (result.success) {
        navigate('/super-admin')
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (error) {
      console.error('Super admin login failed:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="login-container">
      <div className="login-card login-card--admin">
        <div className="login-header">
          <p className="eyebrow-text">Platform Management System</p>
          <h1>Super Administrator</h1>
          <p className="subtitle">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="superadmin@yayasan.edu"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Login as Super Admin'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            <a href="/auth/login" className="link">
              ← Back to regular login
            </a>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="demo-credentials">
          <h4>Demo Credentials:</h4>
          <p>Email: superadmin@yayasan.edu</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminLogin