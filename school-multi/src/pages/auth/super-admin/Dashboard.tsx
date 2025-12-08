import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { PlatformStats, Tenant } from '../../../types'
import LoadingSpinner from '../../../components/common/LoadingSpinner'
import { supabase } from '../../../services/supabase'

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Redirect jika bukan super admin
    if (user && user.role !== 'super_admin') {
      navigate('/')
      return
    }

    loadDashboardData()
  }, [user, navigate])

  const loadDashboardData = async (): Promise<void> => {
    try {
      setLoading(true)

      // Fetch tenants
      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false })

      if (tenantsError) throw tenantsError

      const mappedTenants: Tenant[] = (tenantsData || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        subdomain: t.subdomain,
        theme_config: t.theme || {},
        active_modules: t.active_modules || ['academic', 'payment'],
        status: t.status || 'active',
        email: t.email,
        phone: t.phone,
        address: t.address,
        city: t.city,
        province: t.province,
        postal_code: t.postal_code,
        website: t.website,
        school_type: t.school_type,
        accreditation: t.accreditation,
        npsn: t.npsn,
        established_year: t.established_year,
        principal_name: t.principal_name,
        principal_phone: t.principal_phone,
        principal_email: t.principal_email,
        subscription_plan: t.subscription_plan,
        subscription_expires_at: t.subscription_expires_at,
        max_students: t.max_students,
        max_teachers: t.max_teachers,
        created_at: t.created_at,
        updated_at: t.updated_at,
        logo_url: t.logo_url,
        notes: t.notes
      }))

      setTenants(mappedTenants)

      // Fetch stats (can be optimized later)
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })

      const { count: paymentCount } = await supabase
        .from('payment_submissions')
        .select('*', { count: 'exact', head: true })

      setStats({
        total_tenants: mappedTenants.length,
        total_students: studentCount || 0,
        total_payments: paymentCount || 0,
        active_modules: ['academic', 'payment', 'meeting', 'library']
      })

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading Super Admin Dashboard..." />
  }

  if (!stats) {
    return <div>Failed to load dashboard data</div>
  }

  return (
    <div className="super-admin-dashboard">
      <div className="dashboard-header">
        <h1>Super Administrator Dashboard</h1>
        <p>Platform Management & Monitoring</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏫</div>
          <div className="stat-content">
            <h3>{stats.total_tenants}</h3>
            <p>Total Sekolah</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👨‍🎓</div>
          <div className="stat-content">
            <h3>{stats.total_students.toLocaleString()}</h3>
            <p>Total Siswa</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{stats.total_payments}</h3>
            <p>Pembayaran Bulan Ini</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔧</div>
          <div className="stat-content">
            <h3>{stats.active_modules.length}</h3>
            <p>Active Modules</p>
          </div>
        </div>
      </div>

      {/* Tenants Management */}
      <div className="tenants-section">
        <div className="section-header">
          <h2>Managed Schools</h2>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/super-admin/schools/add')}
          >
            + Add New School
          </button>
        </div>

        <div className="tenants-grid">
          {tenants.map(tenant => (
            <div key={tenant.id} className="tenant-card">
              <div className="tenant-header">
                <h3>{tenant.name}</h3>
                <span
                  className="tenant-color"
                  style={{ backgroundColor: tenant.theme_config.primaryColor }}
                ></span>
              </div>

              <div className="tenant-details">
                <p><strong>Subdomain:</strong> {tenant.subdomain}.sekolahku.com</p>
                <p><strong>Active Modules:</strong> {tenant.active_modules.join(', ')}</p>
              </div>

              <div className="tenant-actions">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => navigate(`/super-admin/schools/${tenant.id}`)}
                >
                  View Details
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => navigate(`/super-admin/schools/${tenant.id}/edit`)}
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card">
            <div className="action-icon">📊</div>
            <span>Platform Analytics</span>
          </button>
          <button className="action-card">
            <div className="action-icon">💰</div>
            <span>Billing & Payments</span>
          </button>
          <button className="action-card">
            <div className="action-icon">🔧</div>
            <span>Module Management</span>
          </button>
          <button className="action-card">
            <div className="action-icon">👥</div>
            <span>User Management</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard