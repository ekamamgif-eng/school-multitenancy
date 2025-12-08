
import React, { useState } from 'react'
import { Layout, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import '../../styles/onboarding.scss'

interface OnboardingData {
    // Database fields simplified out
    schoolName: string
    subdomain: string
    primaryColor: string
    secondaryColor: string
    logo: File | null
    modules: string[]
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = error => reject(error)
    })
}

const TenantOnboarding: React.FC = () => {
    const { user, logout } = useAuth()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<OnboardingData>({
        schoolName: '',
        subdomain: '',
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        logo: null,
        modules: ['academic', 'students']
    })

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout? Any unsaved progress will be lost.')) {
            await logout()
        }
    }

    const handleFinish = async () => {
        setLoading(true)

        try {
            // Convert logo to base64 if it exists
            let logoUrl = null
            if (data.logo) {
                try {
                    logoUrl = await fileToBase64(data.logo)
                } catch (e) {
                    console.error('Error converting logo to base64:', e)
                }
            }

            const brandingConfig = {
                schoolName: data.schoolName,
                primaryColor: data.primaryColor,
                secondaryColor: data.secondaryColor,
                logo: logoUrl
            }

            console.log('💾 Saving branding config:', brandingConfig)
            localStorage.setItem('tenant_branding', JSON.stringify(brandingConfig))

            // Prepare tenant data for database
            // Use custom subdomain if provided, otherwise fallback to auto-generated from name
            const finalSubdomain = data.subdomain.trim()
                ? data.subdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
                : data.schoolName.toLowerCase().replace(/\s+/g, '-')

            const tenantData = {
                name: data.schoolName,
                subdomain: finalSubdomain,
                theme_config: {
                    primaryColor: data.primaryColor,
                    secondaryColor: data.secondaryColor,
                    logo: brandingConfig.logo
                },
                active_modules: data.modules
            }

            // Save to Supabase
            const { supabase, tables } = await import('../../services/supabase')

            console.log('💾 Saving tenant to Supabase:', tenantData)
            const { data: savedTenant, error } = await supabase
                .from(tables.tenants)
                .insert([tenantData])
                .select()
                .single()

            if (error) {
                throw new Error(`Supabase error: ${error.message}`)
            }

            console.log('✅ Tenant saved successfully:', savedTenant)

            // Create or update user profile and link to tenant
            if (user) {
                console.log('🔗 Creating/updating user profile:', user.id)

                // Use upsert to create profile if it doesn't exist
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        email: user.email,
                        tenant_id: savedTenant.id,
                        role: 'admin',
                        is_profile_completed: true
                    }, {
                        onConflict: 'id' // Update if exists
                    })

                if (profileError) {
                    console.error('❌ Error creating/linking profile:', profileError)
                    throw new Error(`Failed to create admin profile: ${profileError.message}`)
                } else {
                    console.log('✅ Profile created/linked successfully')
                }
            }

            // Also save to localStorage for immediate access/fallback
            const tenantConfig = {
                id: savedTenant.id, // Use the ID from the database
                ...tenantData
            }
            localStorage.setItem('tenant_config', JSON.stringify(tenantConfig))

            await new Promise(resolve => setTimeout(resolve, 1000))

            setLoading(false)
            // Force a hard redirect to ensure fresh state
            window.location.href = '/admin'
        } catch (error: any) {
            console.error('❌ Error saving configuration:', error)
            setLoading(false)
            alert(`Failed to save configuration: ${error.message || 'Unknown error'}`)
        }
    }


    const toggleModule = (mod: string) => {
        setData(prev => ({
            ...prev,
            modules: prev.modules.includes(mod)
                ? prev.modules.filter(m => m !== mod)
                : [...prev.modules, mod]
        }))
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData({ ...data, logo: e.target.files[0] })
        }
    }

    return (
        <div className="onboarding-container">
            <div className="onboarding-wizard">
                {/* Header */}
                <div className="onboarding-header" style={{ position: 'relative' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            position: 'absolute',
                            top: '1.5rem',
                            right: '1.5rem',
                            background: 'transparent',
                            border: '1px solid #e5e7eb',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            color: '#6b7280',
                            fontSize: '0.875rem',
                            fontWeight: 500
                        }}
                        className="hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                    <h1>School Setup Wizard</h1>
                    <p>Configure your school's branding and settings</p>
                </div>

                {/* Content */}
                <div className="onboarding-content">
                    <div>
                        <h2>School Configuration</h2>
                        <p>Customize your school's appearance and access URL.</p>

                        <div className="branding-grid">
                            <div>
                                <div className="form-field" style={{ marginBottom: '1rem' }}>
                                    <label>School Name</label>
                                    <input
                                        type="text"
                                        value={data.schoolName}
                                        onChange={e => {
                                            const newName = e.target.value;
                                            // Auto-fill subdomain if it hasn't been manually edited yet or is empty
                                            const autoSubdomain = newName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                                            setData(prev => ({
                                                ...prev,
                                                schoolName: newName,
                                                subdomain: prev.subdomain ? prev.subdomain : autoSubdomain
                                            }))
                                        }}
                                        placeholder="e.g. Harapan Bangsa School"
                                    />
                                </div>

                                <div className="form-field" style={{ marginBottom: '1rem' }}>
                                    <label>School URL (Subdomain)</label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{
                                            background: '#f3f4f6',
                                            border: '1px solid #d1d5db',
                                            borderRight: 'none',
                                            padding: '0.6rem 0.75rem',
                                            borderRadius: '0.375rem 0 0 0.375rem',
                                            color: '#6b7280',
                                            fontSize: '0.875rem'
                                        }}>
                                            {window.location.origin}/
                                        </span>
                                        <input
                                            type="text"
                                            value={data.subdomain}
                                            onChange={e => setData({ ...data, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                            placeholder="harapan-bangsa"
                                            style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                                        />
                                    </div>
                                    <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
                                        Your school's unique URL: <strong>{window.location.origin}/{data.subdomain || 'your-school'}</strong>
                                    </p>
                                </div>

                                <div className="color-picker-group">
                                    <div className="form-field">
                                        <label>Primary Color</label>
                                        <div className="color-picker">
                                            <input
                                                type="color"
                                                value={data.primaryColor}
                                                onChange={e => setData({ ...data, primaryColor: e.target.value })}
                                            />
                                            <span>{data.primaryColor}</span>
                                        </div>
                                    </div>
                                    <div className="form-field">
                                        <label>Secondary Color</label>
                                        <div className="color-picker">
                                            <input
                                                type="color"
                                                value={data.secondaryColor}
                                                onChange={e => setData({ ...data, secondaryColor: e.target.value })}
                                            />
                                            <span>{data.secondaryColor}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-field" style={{ marginTop: '1rem' }}>
                                    <label>School Logo</label>
                                    <input
                                        type="file"
                                        className="file-input"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                    />
                                    {data.logo && (
                                        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#10b981' }}>
                                            Selected: {data.logo.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Active Modules</label>
                                <div className="module-list">
                                    {['Academic', 'Students', 'Teachers', 'Finance', 'Library', 'Transport'].map(mod => (
                                        <label key={mod} className="module-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={data.modules.includes(mod.toLowerCase())}
                                                onChange={() => toggleModule(mod.toLowerCase())}
                                            />
                                            <span>{mod} Module</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="onboarding-footer">
                    <button
                        onClick={handleFinish}
                        disabled={loading || !data.schoolName.trim()}
                        className="footer-button finish"
                        title={!data.schoolName.trim() ? 'Please enter a school name' : ''}
                        style={{ opacity: !data.schoolName.trim() ? 0.5 : 1, cursor: !data.schoolName.trim() ? 'not-allowed' : 'pointer' }}
                    >
                        {loading ? 'Launch Dashboard' : 'Launch Dashboard'} <Layout size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TenantOnboarding
