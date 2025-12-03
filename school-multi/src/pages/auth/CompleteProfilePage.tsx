import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../services/supabase'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { User, Phone, MapPin, Save } from 'lucide-react'
import '../../styles/complete-profile.scss'

const CompleteProfilePage: React.FC = () => {
    const { user, refreshProfile } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        address: ''
    })

    useEffect(() => {
        if (user?.user_metadata) {
            setFormData(prev => ({
                ...prev,
                fullName: user.user_metadata?.full_name || '',
                phoneNumber: (user.user_metadata as any)?.phone || '',
                address: (user.user_metadata as any)?.address || ''
            }))
        }
    }, [user])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    name: formData.fullName,
                    phone: formData.phoneNumber,
                    address: formData.address,
                    is_profile_completed: true
                })
                .eq('id', user.id)

            if (error) throw error

            // Update metadata as well
            await supabase.auth.updateUser({
                data: {
                    full_name: formData.fullName,
                    phone: formData.phoneNumber,
                    address: formData.address,
                    is_profile_completed: true
                }
            })

            await refreshProfile()
            navigate('/')
        } catch (error: any) {
            console.error('Error updating profile:', error)

            // Check for specific PostgREST error for missing columns
            if (error?.code === 'PGRST204' || error?.message?.includes('Could not find the')) {
                alert('Database Error: The profile table is missing required columns (phone, address). Please run the migration script "03_add_profile_fields.sql" in your Supabase SQL Editor.')
            } else {
                alert(`Failed to update profile: ${error.message || 'Unknown error'}`)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="complete-profile-container">
            <div className="profile-card">
                <div className="card-header">
                    <h2>Complete Your Profile</h2>
                    <p>Please provide your details to continue to the dashboard.</p>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="fullName">
                                <User size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                placeholder="e.g. John Doe"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneNumber">
                                <Phone size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                                Phone Number
                            </label>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                required
                                placeholder="e.g. +62 812 3456 7890"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">
                                <MapPin size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                                Address
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                required
                                placeholder="Enter your full address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-submit"
                        >
                            {loading ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <>
                                    <Save size={18} style={{ marginRight: '8px' }} />
                                    Save and Continue
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CompleteProfilePage
