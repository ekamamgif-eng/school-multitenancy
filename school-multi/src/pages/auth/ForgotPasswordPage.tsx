import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            const redirectUrl = `${window.location.origin}/auth/reset-password`
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl,
            })

            if (error) throw error

            setSuccess(true)
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Reset Password</h1>
                    <p className="subtitle">Enter your email to receive a password reset link.</p>
                </div>

                {success ? (
                    <div className="success-message" style={{ textAlign: 'center' }}>
                        <div style={{ color: 'green', marginBottom: '1rem', padding: '1rem', background: '#e6ffe6', borderRadius: '4px' }}>
                            ✅ Check your email for the password reset link.
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>
                            Click the link in the email to set a new password.
                        </p>
                        <div style={{ marginTop: '1.5rem' }}>
                            <Link to="/auth/login" className="link">Return to Login</Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="login-form">
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@school.edu"
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? <LoadingSpinner size="sm" /> : 'Send Reset Link'}
                        </button>

                        <div className="login-footer">
                            <Link to="/auth/login" className="link">← Back to Login</Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default ForgotPasswordPage
