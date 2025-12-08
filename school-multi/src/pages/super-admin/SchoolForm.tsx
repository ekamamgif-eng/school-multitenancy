import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { TenantFormData } from '../../types'
import { tenantService } from '../../services/tenantService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './SchoolForm.scss'

const AVAILABLE_MODULES = [
    { id: 'academic', label: 'Academic Management' },
    { id: 'payment', label: 'Payment Management' },
    { id: 'meeting', label: 'Meeting & Minutes' },
    { id: 'library', label: 'Library Management' },
    { id: 'transport', label: 'Transport Management' },
    { id: 'attendance', label: 'Attendance System' }
]

const SchoolForm: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()
    const isEditMode = Boolean(id)

    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<TenantFormData>({
        name: '',
        subdomain: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postal_code: '',
        website: '',
        school_type: undefined,
        accreditation: undefined,
        npsn: '',
        established_year: undefined,
        principal_name: '',
        principal_phone: '',
        principal_email: '',
        status: 'active',
        subscription_plan: 'free',
        subscription_expires_at: '',
        max_students: undefined,
        max_teachers: undefined,
        active_modules: ['academic', 'payment'],
        theme_config: {},
        notes: ''
    })

    useEffect(() => {
        if (isEditMode && id) {
            loadTenantData()
        }
    }, [id, isEditMode])

    const loadTenantData = async () => {
        if (!id) return

        try {
            setLoading(true)
            const tenant = await tenantService.getTenantById(id)

            if (tenant) {
                setFormData({
                    name: tenant.name,
                    subdomain: tenant.subdomain,
                    email: tenant.email || '',
                    phone: tenant.phone || '',
                    address: tenant.address || '',
                    city: tenant.city || '',
                    province: tenant.province || '',
                    postal_code: tenant.postal_code || '',
                    website: tenant.website || '',
                    school_type: tenant.school_type,
                    accreditation: tenant.accreditation,
                    npsn: tenant.npsn || '',
                    established_year: tenant.established_year,
                    principal_name: tenant.principal_name || '',
                    principal_phone: tenant.principal_phone || '',
                    principal_email: tenant.principal_email || '',
                    status: tenant.status,
                    subscription_plan: tenant.subscription_plan,
                    subscription_expires_at: tenant.subscription_expires_at || '',
                    max_students: tenant.max_students,
                    max_teachers: tenant.max_teachers,
                    active_modules: tenant.active_modules,
                    theme_config: tenant.theme_config,
                    notes: tenant.notes || ''
                })
            }
        } catch (err: any) {
            console.error('Failed to load tenant:', err)
            setError(err.message || 'Failed to load school data')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev: TenantFormData) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev: TenantFormData) => ({
            ...prev,
            [name]: value ? parseInt(value, 10) : undefined
        }))
    }

    const handleModuleToggle = (moduleId: string) => {
        setFormData((prev: TenantFormData) => {
            const isActive = prev.active_modules.includes(moduleId)
            return {
                ...prev,
                active_modules: isActive
                    ? prev.active_modules.filter((m: string) => m !== moduleId)
                    : [...prev.active_modules, moduleId]
            }
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            alert('You must be logged in')
            return
        }

        // Validation
        if (!formData.name.trim()) {
            alert('School name is required')
            return
        }

        if (!formData.subdomain.trim()) {
            alert('Subdomain is required')
            return
        }

        // Validate subdomain format
        const subdomainRegex = /^[a-z0-9-]+$/
        if (!subdomainRegex.test(formData.subdomain)) {
            alert('Subdomain can only contain lowercase letters, numbers, and hyphens')
            return
        }

        try {
            setSaving(true)
            setError(null)

            if (isEditMode && id) {
                await tenantService.updateTenant(id, formData, user.id)
                alert('School updated successfully')
                navigate(`/super-admin/schools/${id}`)
            } else {
                const newTenant = await tenantService.createTenant(formData, user.id)
                alert('School created successfully')
                navigate(`/super-admin/schools/${newTenant.id}`)
            }
        } catch (err: any) {
            console.error('Failed to save tenant:', err)
            setError(err.message || 'Failed to save school')
            alert('Failed to save school: ' + err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <LoadingSpinner text="Loading school data..." />
    }

    return (
        <div className="school-form">
            <div className="form-header">
                <button className="btn-back" onClick={() => navigate('/super-admin')}>
                    ← Back
                </button>
                <h1>{isEditMode ? 'Edit School' : 'Add New School'}</h1>
            </div>

            {error && (
                <div className="alert alert-error">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="form-section">
                    <h2>Basic Information</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">
                                School Name <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g., SMA Negeri 1 Jakarta"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subdomain">
                                Subdomain <span className="required">*</span>
                            </label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="subdomain"
                                    name="subdomain"
                                    value={formData.subdomain}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., sma-negeri-1"
                                    pattern="[a-z0-9-]+"
                                    disabled={isEditMode}
                                />
                                <span className="input-suffix">.sekolahku.com</span>
                            </div>
                            <small>Lowercase letters, numbers, and hyphens only</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="school_type">School Type</label>
                            <select
                                id="school_type"
                                name="school_type"
                                value={formData.school_type || ''}
                                onChange={handleChange}
                            >
                                <option value="">Select Type</option>
                                <option value="TK">TK (Kindergarten)</option>
                                <option value="SD">SD (Elementary)</option>
                                <option value="SMP">SMP (Junior High)</option>
                                <option value="SMA">SMA (Senior High)</option>
                                <option value="SMK">SMK (Vocational)</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="npsn">NPSN</label>
                            <input
                                type="text"
                                id="npsn"
                                name="npsn"
                                value={formData.npsn}
                                onChange={handleChange}
                                placeholder="Nomor Pokok Sekolah Nasional"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="accreditation">Accreditation</label>
                            <select
                                id="accreditation"
                                name="accreditation"
                                value={formData.accreditation || ''}
                                onChange={handleChange}
                            >
                                <option value="">Select Accreditation</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="Not Accredited">Not Accredited</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="established_year">Established Year</label>
                            <input
                                type="number"
                                id="established_year"
                                name="established_year"
                                value={formData.established_year || ''}
                                onChange={handleNumberChange}
                                min="1900"
                                max={new Date().getFullYear()}
                                placeholder="e.g., 1985"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="form-section">
                    <h2>Contact Information</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="school@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+62 21 1234567"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="website">Website</label>
                            <input
                                type="url"
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://www.example.com"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="address">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Street address"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="e.g., Jakarta"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="province">Province</label>
                            <input
                                type="text"
                                id="province"
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                placeholder="e.g., DKI Jakarta"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="postal_code">Postal Code</label>
                            <input
                                type="text"
                                id="postal_code"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleChange}
                                placeholder="e.g., 12345"
                            />
                        </div>
                    </div>
                </div>

                {/* Principal Information */}
                <div className="form-section">
                    <h2>Principal Information</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="principal_name">Principal Name</label>
                            <input
                                type="text"
                                id="principal_name"
                                name="principal_name"
                                value={formData.principal_name}
                                onChange={handleChange}
                                placeholder="e.g., Dr. John Doe"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="principal_email">Principal Email</label>
                            <input
                                type="email"
                                id="principal_email"
                                name="principal_email"
                                value={formData.principal_email}
                                onChange={handleChange}
                                placeholder="principal@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="principal_phone">Principal Phone</label>
                            <input
                                type="tel"
                                id="principal_phone"
                                name="principal_phone"
                                value={formData.principal_phone}
                                onChange={handleChange}
                                placeholder="+62 812 3456 7890"
                            />
                        </div>
                    </div>
                </div>

                {/* Subscription & Limits */}
                <div className="form-section">
                    <h2>Subscription & Limits</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="active">Active</option>
                                <option value="trial">Trial</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="subscription_plan">Subscription Plan</label>
                            <select
                                id="subscription_plan"
                                name="subscription_plan"
                                value={formData.subscription_plan || ''}
                                onChange={handleChange}
                            >
                                <option value="free">Free</option>
                                <option value="basic">Basic</option>
                                <option value="premium">Premium</option>
                                <option value="enterprise">Enterprise</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="subscription_expires_at">Subscription Expires</label>
                            <input
                                type="date"
                                id="subscription_expires_at"
                                name="subscription_expires_at"
                                value={formData.subscription_expires_at}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="max_students">Max Students</label>
                            <input
                                type="number"
                                id="max_students"
                                name="max_students"
                                value={formData.max_students || ''}
                                onChange={handleNumberChange}
                                min="0"
                                placeholder="e.g., 1000"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="max_teachers">Max Teachers</label>
                            <input
                                type="number"
                                id="max_teachers"
                                name="max_teachers"
                                value={formData.max_teachers || ''}
                                onChange={handleNumberChange}
                                min="0"
                                placeholder="e.g., 100"
                            />
                        </div>
                    </div>
                </div>

                {/* Active Modules */}
                <div className="form-section">
                    <h2>Active Modules</h2>
                    <div className="modules-grid">
                        {AVAILABLE_MODULES.map((module) => (
                            <label key={module.id} className="module-checkbox">
                                <input
                                    type="checkbox"
                                    checked={formData.active_modules.includes(module.id)}
                                    onChange={() => handleModuleToggle(module.id)}
                                />
                                <span>{module.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Notes */}
                <div className="form-section">
                    <h2>Notes</h2>
                    <div className="form-group">
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Additional notes or comments..."
                        />
                    </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/super-admin')}
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : isEditMode ? 'Update School' : 'Create School'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SchoolForm
