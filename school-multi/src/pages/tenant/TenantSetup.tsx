import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../services/supabase'
import { LogOut, Home, Mail, Lock } from 'lucide-react'
import '../../styles/tenant-setup.scss'

const AddNewTenant: React.FC = () => {
    const navigate = useNavigate()
    const { logout } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        tempPassword: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleClear = () => {
        setFormData({ email: '', tempPassword: '' })
        setMessage(null)
    }

    const handleAddAndSend = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.email || !formData.tempPassword) {
            setMessage({ type: 'error', text: 'Please fill in all fields' })
            return
        }

        setIsSubmitting(true)
        setMessage(null)

        try {
            const redirectUrl = import.meta.env.VITE_APP_URL || window.location.origin

            // Create new tenant admin account
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.tempPassword,
                options: {
                    emailRedirectTo: `${redirectUrl}/auth/reset-password`,
                    data: {
                        role: 'admin'
                    }
                }
            })

            if (signUpError) throw signUpError

            // Create profile for the new tenant admin
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        email: formData.email,
                        role: 'admin',
                        name: formData.email.split('@')[0]
                    })

                if (profileError) {
                    console.warn('Profile creation warning:', profileError)
                }
            }

            setMessage({
                type: 'success',
                text: `Tenant admin account created successfully! A confirmation email has been sent to ${formData.email}`
            })

            // Clear form after success
            setTimeout(() => {
                handleClear()
            }, 3000)

        } catch (error: any) {
            console.error('Error creating tenant:', error)
            setMessage({
                type: 'error',
                text: error.message || 'Failed to create tenant admin account'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleLogout = async () => {
        await logout()
    }

    const handleBackToHome = () => {
        navigate('/super-admin')
    }

    return (
        <div className="tenant-setup-container">
            <div className="tenant-setup-header">
                <div className="header-left">
                    <h1>Add New Tenant</h1>
                    <p>Create a new tenant administrator account</p>
                </div>
                <div className="header-actions">
                    <button onClick={handleBackToHome} className="btn-secondary">
                        <Home size={18} />
                        <span>Back to Home</span>
                    </button>
                    <button onClick={handleLogout} className="btn-logout">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            <div className="tenant-setup-content">
                <div className="setup-card">
                    <div className="card-header">
                        <h2>Tenant Administrator Details</h2>
                        <p>Enter the email and temporary password for the new tenant admin</p>
                    </div>

                    <form onSubmit={handleAddAndSend} className="setup-form">
                        {message && (
                            <div className={`message message-${message.type}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">
                                <Mail size={18} />
                                <span>Email Address</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="admin@school.edu"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="tempPassword">
                                <Lock size={18} />
                                <span>Temporary Password</span>
                            </label>
                            <input
                                type="text"
                                id="tempPassword"
                                name="tempPassword"
                                value={formData.tempPassword}
                                onChange={handleInputChange}
                                placeholder="Enter temporary password"
                                required
                                disabled={isSubmitting}
                            />
                            <small className="form-hint">
                                The admin will be asked to change this password on first login
                            </small>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="btn-clear"
                                disabled={isSubmitting}
                            >
                                Clear
                            </button>
                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : 'Add and Send'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddNewTenant
