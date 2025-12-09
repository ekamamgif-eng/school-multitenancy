import React, { useState, useEffect } from 'react'
import { useTenant } from '../../contexts/TenantContext'
import { supabase } from '../../services/supabase'
import { BuildingOfficeIcon, SwatchIcon, PhoneIcon } from '@heroicons/react/24/outline'
import './SchoolProfile.scss'

const PREDEFINED_FONTS = ['Inter', 'Roboto', 'Poppins', 'Open Sans', 'Lato']
const PREDEFINED_RADIUS = ['0px', '4px', '8px', '12px', '16px', '24px', '9999px']

const SchoolProfile: React.FC = () => {
    const { tenant, setTenant, refreshTenant } = useTenant()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        school_type: 'Other',
        email: '',
        phone: '',
        address: '',
        primary_color: '#0f766e',
        secondary_color: '#115e59',
        border_radius: '8px',
        font_family: 'Inter',
        website: ''
    })

    useEffect(() => {
        if (tenant) {
            setFormData({
                name: tenant.name || '',
                school_type: tenant.school_type || 'Other',
                email: tenant.email || '',
                phone: tenant.phone || '',
                address: tenant.address || '',
                // Fallback to theme_config if top-level columns are empty (during migration phase)
                primary_color: tenant.primary_color || tenant.theme_config.primaryColor || '#0f766e',
                secondary_color: tenant.secondary_color || tenant.theme_config.secondaryColor || '#115e59',
                border_radius: tenant.border_radius || tenant.theme_config.borderRadius || '8px',
                font_family: tenant.font_family || tenant.theme_config.fontFamily || 'Inter',
                website: tenant.website || ''
            })
        }
    }, [tenant])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!tenant) return

        setLoading(true)
        setMessage(null)

        try {
            // Update Supabase
            const { error } = await supabase
                .from('tenants')
                .update({
                    name: formData.name,
                    school_type: formData.school_type,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    website: formData.website,
                    primary_color: formData.primary_color,
                    secondary_color: formData.secondary_color,
                    border_radius: formData.border_radius,
                    font_family: formData.font_family,
                    // Also update the JSONB for backward compatibility if needed, 
                    // or just rely on the columns going forward. 
                    // We'll update JSONB too to keep sync for now.
                    theme_config: {
                        ...tenant.theme_config,
                        primaryColor: formData.primary_color,
                        secondaryColor: formData.secondary_color,
                        borderRadius: formData.border_radius,
                        fontFamily: formData.font_family
                    }
                })
                .eq('id', tenant.id)

            if (error) throw error

            // Update Local Context
            const updatedTenant = {
                ...tenant,
                ...formData,
                theme_config: {
                    ...tenant.theme_config,
                    primaryColor: formData.primary_color,
                    secondaryColor: formData.secondary_color,
                    borderRadius: formData.border_radius,
                    fontFamily: formData.font_family
                }
            }

            // @ts-ignore - Ignoring partial type mismatch if any
            setTenant(updatedTenant)

            setMessage({ text: 'Profile updated successfully!', type: 'success' })

            // Force a refresh of the CSS variables by utilizing the context's effect or methods
            // setTenant logic in context calls applyTenantTheme, so it should be handled.

        } catch (error: any) {
            console.error('Error updating profile:', error)
            setMessage({ text: `Failed to update profile: ${error.message}`, type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    if (!tenant) return <div>Loading tenant data...</div>

    return (
        <div className="school-profile">
            <div className="school-profile__header">
                <h1>School Profile & Branding</h1>
                <p>Manage your school's identity, contact details, and visual theme.</p>
            </div>

            {message && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: message.type === 'success' ? '#166534' : '#991b1b',
                    border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Visual Branding Section */}
                <div className="school-profile__card">
                    <div className="school-profile__section">
                        <h3><SwatchIcon className="w-6 h-6" /> Visual Branding</h3>

                        <div className="school-profile__grid">
                            <div className="school-profile__field school-profile__field--color">
                                <label>Primary Color</label>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        name="primary_color"
                                        value={formData.primary_color}
                                        onChange={handleChange}
                                    />
                                    <input
                                        type="text"
                                        name="primary_color"
                                        value={formData.primary_color}
                                        onChange={handleChange}
                                        maxLength={7}
                                    />
                                </div>
                            </div>

                            <div className="school-profile__field school-profile__field--color">
                                <label>Secondary Color</label>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        name="secondary_color"
                                        value={formData.secondary_color}
                                        onChange={handleChange}
                                    />
                                    <input
                                        type="text"
                                        name="secondary_color"
                                        value={formData.secondary_color}
                                        onChange={handleChange}
                                        maxLength={7}
                                    />
                                </div>
                            </div>

                            <div className="school-profile__field">
                                <label>Border Radius (Buttons/Cards)</label>
                                <select
                                    name="border_radius"
                                    value={formData.border_radius}
                                    onChange={handleChange}
                                >
                                    {PREDEFINED_RADIUS.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="school-profile__field">
                                <label>Font Family</label>
                                <select
                                    name="font_family"
                                    value={formData.font_family}
                                    onChange={handleChange}
                                >
                                    {PREDEFINED_FONTS.map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Live Preview */}
                        <div className="school-profile__preview">
                            <div style={{
                                fontFamily: formData.font_family,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                alignItems: 'center'
                            }}>
                                <h4 style={{ color: formData.primary_color, margin: 0 }}>Preview Title</h4>
                                <button
                                    type="button"
                                    className="preview-button"
                                    style={{
                                        backgroundColor: formData.primary_color,
                                        color: '#ffffff',
                                        borderRadius: formData.border_radius,
                                    }}
                                >
                                    Primary Button
                                </button>
                                <button
                                    type="button"
                                    className="preview-button"
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: formData.secondary_color,
                                        border: `2px solid ${formData.secondary_color}`,
                                        borderRadius: formData.border_radius,
                                    }}
                                >
                                    Secondary Button
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* School Information */}
                <div className="school-profile__card">
                    <div className="school-profile__section">
                        <h3><BuildingOfficeIcon className="w-6 h-6" /> School Information</h3>

                        <div className="school-profile__grid">
                            <div className="school-profile__field">
                                <label>School Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="school-profile__field">
                                <label>School Type</label>
                                <select
                                    name="school_type"
                                    value={formData.school_type}
                                    onChange={handleChange}
                                >
                                    <option value="TK">TK (Kindergarten)</option>
                                    <option value="SD">SD (Elementary)</option>
                                    <option value="SMP">SMP (Junior High)</option>
                                    <option value="SMA">SMA (Senior High)</option>
                                    <option value="SMK">SMK (Vocational)</option>
                                    <option value="Other">Other / International</option>
                                </select>
                            </div>

                            <div className="school-profile__field">
                                <label>Website</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="school-profile__section">
                        <h3><PhoneIcon className="w-6 h-6" /> Contact Details</h3>

                        <div className="school-profile__grid">
                            <div className="school-profile__field">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="school-profile__field">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="school-profile__field" style={{ gridColumn: '1 / -1' }}>
                                <label>Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="school-profile__actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SchoolProfile
