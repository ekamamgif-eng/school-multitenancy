import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tenant } from '../../types'
import { tenantService } from '../../services/tenantService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './SchoolDetail.scss'

const SchoolDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [tenant, setTenant] = useState<Tenant | null>(null)
    const [stats, setStats] = useState<{
        studentCount: number
        teacherCount: number
        paymentCount: number
    } | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadTenantData()
    }, [id])

    const loadTenantData = async () => {
        if (!id) return

        try {
            setLoading(true)
            setError(null)

            const [tenantData, statsData] = await Promise.all([
                tenantService.getTenantById(id),
                tenantService.getTenantStats(id)
            ])

            setTenant(tenantData)
            setStats(statsData)
        } catch (err: any) {
            console.error('Failed to load tenant:', err)
            setError(err.message || 'Failed to load school details')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!id || !tenant) return

        const confirmed = window.confirm(
            `Are you sure you want to delete "${tenant.name}"? This action cannot be undone.`
        )

        if (!confirmed) return

        try {
            await tenantService.deleteTenant(id)
            alert('School deleted successfully')
            navigate('/super-admin')
        } catch (err: any) {
            console.error('Failed to delete tenant:', err)
            alert('Failed to delete school: ' + err.message)
        }
    }

    if (loading) {
        return <LoadingSpinner text="Loading school details..." />
    }

    if (error || !tenant) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error || 'School not found'}</p>
                <button className="btn btn-primary" onClick={() => navigate('/super-admin')}>
                    Back to Dashboard
                </button>
            </div>
        )
    }

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'active': return 'badge-success'
            case 'trial': return 'badge-info'
            case 'suspended': return 'badge-warning'
            case 'inactive': return 'badge-danger'
            default: return 'badge-secondary'
        }
    }

    return (
        <div className="school-detail">
            {/* Header */}
            <div className="detail-header">
                <div className="header-left">
                    <button className="btn-back" onClick={() => navigate('/super-admin')}>
                        ← Back
                    </button>
                    <div className="header-info">
                        {tenant.logo_url && (
                            <img src={tenant.logo_url} alt={tenant.name} className="school-logo" />
                        )}
                        <div>
                            <h1>{tenant.name}</h1>
                            <p className="subdomain">{tenant.subdomain}.sekolahku.com</p>
                        </div>
                    </div>
                </div>
                <div className="header-actions">
                    <span className={`badge ${getStatusBadgeClass(tenant.status)}`}>
                        {tenant.status.toUpperCase()}
                    </span>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/super-admin/schools/${id}/edit`)}
                    >
                        Edit School
                    </button>
                    <button className="btn btn-danger" onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">👨‍🎓</div>
                    <div className="stat-content">
                        <h3>{stats?.studentCount || 0}</h3>
                        <p>Students</p>
                        {tenant.max_students && (
                            <span className="stat-limit">/ {tenant.max_students} max</span>
                        )}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">👨‍🏫</div>
                    <div className="stat-content">
                        <h3>{stats?.teacherCount || 0}</h3>
                        <p>Teachers</p>
                        {tenant.max_teachers && (
                            <span className="stat-limit">/ {tenant.max_teachers} max</span>
                        )}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <h3>{stats?.paymentCount || 0}</h3>
                        <p>Payments</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🔧</div>
                    <div className="stat-content">
                        <h3>{tenant.active_modules.length}</h3>
                        <p>Active Modules</p>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="details-grid">
                {/* Basic Information */}
                <div className="detail-section">
                    <h2>Basic Information</h2>
                    <div className="detail-rows">
                        <div className="detail-row">
                            <span className="label">School Name:</span>
                            <span className="value">{tenant.name}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Subdomain:</span>
                            <span className="value">{tenant.subdomain}</span>
                        </div>
                        {tenant.school_type && (
                            <div className="detail-row">
                                <span className="label">School Type:</span>
                                <span className="value">{tenant.school_type}</span>
                            </div>
                        )}
                        {tenant.npsn && (
                            <div className="detail-row">
                                <span className="label">NPSN:</span>
                                <span className="value">{tenant.npsn}</span>
                            </div>
                        )}
                        {tenant.accreditation && (
                            <div className="detail-row">
                                <span className="label">Accreditation:</span>
                                <span className="value badge badge-info">{tenant.accreditation}</span>
                            </div>
                        )}
                        {tenant.established_year && (
                            <div className="detail-row">
                                <span className="label">Established:</span>
                                <span className="value">{tenant.established_year}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Information */}
                <div className="detail-section">
                    <h2>Contact Information</h2>
                    <div className="detail-rows">
                        {tenant.email && (
                            <div className="detail-row">
                                <span className="label">Email:</span>
                                <span className="value">
                                    <a href={`mailto:${tenant.email}`}>{tenant.email}</a>
                                </span>
                            </div>
                        )}
                        {tenant.phone && (
                            <div className="detail-row">
                                <span className="label">Phone:</span>
                                <span className="value">
                                    <a href={`tel:${tenant.phone}`}>{tenant.phone}</a>
                                </span>
                            </div>
                        )}
                        {tenant.website && (
                            <div className="detail-row">
                                <span className="label">Website:</span>
                                <span className="value">
                                    <a href={tenant.website} target="_blank" rel="noopener noreferrer">
                                        {tenant.website}
                                    </a>
                                </span>
                            </div>
                        )}
                        {tenant.address && (
                            <div className="detail-row">
                                <span className="label">Address:</span>
                                <span className="value">{tenant.address}</span>
                            </div>
                        )}
                        {tenant.city && (
                            <div className="detail-row">
                                <span className="label">City:</span>
                                <span className="value">{tenant.city}</span>
                            </div>
                        )}
                        {tenant.province && (
                            <div className="detail-row">
                                <span className="label">Province:</span>
                                <span className="value">{tenant.province}</span>
                            </div>
                        )}
                        {tenant.postal_code && (
                            <div className="detail-row">
                                <span className="label">Postal Code:</span>
                                <span className="value">{tenant.postal_code}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Principal Information */}
                {(tenant.principal_name || tenant.principal_email || tenant.principal_phone) && (
                    <div className="detail-section">
                        <h2>Principal Information</h2>
                        <div className="detail-rows">
                            {tenant.principal_name && (
                                <div className="detail-row">
                                    <span className="label">Name:</span>
                                    <span className="value">{tenant.principal_name}</span>
                                </div>
                            )}
                            {tenant.principal_email && (
                                <div className="detail-row">
                                    <span className="label">Email:</span>
                                    <span className="value">
                                        <a href={`mailto:${tenant.principal_email}`}>
                                            {tenant.principal_email}
                                        </a>
                                    </span>
                                </div>
                            )}
                            {tenant.principal_phone && (
                                <div className="detail-row">
                                    <span className="label">Phone:</span>
                                    <span className="value">
                                        <a href={`tel:${tenant.principal_phone}`}>
                                            {tenant.principal_phone}
                                        </a>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Subscription & Limits */}
                <div className="detail-section">
                    <h2>Subscription & Limits</h2>
                    <div className="detail-rows">
                        {tenant.subscription_plan && (
                            <div className="detail-row">
                                <span className="label">Plan:</span>
                                <span className="value badge badge-primary">
                                    {tenant.subscription_plan.toUpperCase()}
                                </span>
                            </div>
                        )}
                        {tenant.subscription_expires_at && (
                            <div className="detail-row">
                                <span className="label">Expires:</span>
                                <span className="value">
                                    {new Date(tenant.subscription_expires_at).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                        {tenant.max_students && (
                            <div className="detail-row">
                                <span className="label">Max Students:</span>
                                <span className="value">{tenant.max_students}</span>
                            </div>
                        )}
                        {tenant.max_teachers && (
                            <div className="detail-row">
                                <span className="label">Max Teachers:</span>
                                <span className="value">{tenant.max_teachers}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Modules */}
                <div className="detail-section full-width">
                    <h2>Active Modules</h2>
                    <div className="modules-list">
                        {tenant.active_modules.map((module: string) => (
                            <span key={module} className="module-badge">
                                {module}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Notes */}
                {tenant.notes && (
                    <div className="detail-section full-width">
                        <h2>Notes</h2>
                        <p className="notes-content">{tenant.notes}</p>
                    </div>
                )}

                {/* Metadata */}
                <div className="detail-section full-width">
                    <h2>System Information</h2>
                    <div className="detail-rows">
                        {tenant.created_at && (
                            <div className="detail-row">
                                <span className="label">Created:</span>
                                <span className="value">
                                    {new Date(tenant.created_at).toLocaleString()}
                                </span>
                            </div>
                        )}
                        {tenant.updated_at && (
                            <div className="detail-row">
                                <span className="label">Last Updated:</span>
                                <span className="value">
                                    {new Date(tenant.updated_at).toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SchoolDetail
