import React, { useState, FormEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import GoogleAuthButton from './GoogleAuthButton'
import styles from './LoginForm.module.scss'

interface LoginFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  showGoogleLogin?: boolean
  showEmailLogin?: boolean
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onError,
  showGoogleLogin = true,
  showEmailLogin = true
}) => {
  const { loginWithEmail } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!showEmailLogin) return

    setLoading(true)
    setError('')
    try {
      const result = await loginWithEmail(formData.email, formData.password)
      if (result.success) {
        onSuccess?.()
      } else {
        const message = result.error || 'Login failed'
        setError(message)
        onError?.(message)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error'
      setError(message)
      onError?.(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginFormContainer}>
      {showGoogleLogin && (
        <div className={styles.googleLoginSection}>
          <GoogleAuthButton fullWidth size="md" />

          {showEmailLogin && (
            <div className={styles.divider}>
              <span>or</span>
            </div>
          )}
        </div>
      )}

      {showEmailLogin && (
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          {error && <div className={styles.errorBanner}>{error}</div>}

          <label className={styles.formGroup}>
            <span>Email address</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="teacher@school.edu"
              required
              disabled={loading}
            />
          </label>

          <label className={styles.formGroup}>
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </label>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Signing in...' : 'Continue'}
          </button>
        </form>
      )}
    </div>
  )
}

export default LoginForm

