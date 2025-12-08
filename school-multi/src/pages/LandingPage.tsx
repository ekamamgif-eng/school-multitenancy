import React from 'react'
import LoginActions from '../components/auth/LoginActions'
import { ShieldCheckIcon, BoltIcon, UsersIcon, ChartBarIcon, AcademicCapIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { useTenant } from '../contexts/TenantContext'

const LandingPage: React.FC = () => {
    const { tenant, loading } = useTenant()

    // If loading tenant data, show loading state
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '1.2rem',
                color: '#666'
            }}>
                Loading...
            </div>
        )
    }

    // Determine display branding
    const schoolName = tenant?.name || 'SchoolPlatform'

    return (
        <div className="landing-page" style={tenant?.theme_config ? {
            '--primary-color': tenant.theme_config.primaryColor,
            '--secondary-color': tenant.theme_config.secondaryColor
        } as React.CSSProperties : {}}>
            <nav className="landing-page__nav">
                <div className="logo">
                    {tenant?.theme_config?.logo ? (
                        <img
                            src={tenant.theme_config.logo}
                            alt={`${schoolName} logo`}
                            style={{ height: '40px', maxWidth: '150px', objectFit: 'contain' }}
                        />
                    ) : (
                        <AcademicCapIcon className="w-8 h-8" />
                    )}
                    <span>{schoolName}</span>
                </div>
            </nav>

            <section className="landing-page__hero">
                <div className="landing-page__content">
                    <h1>
                        {tenant ? `Welcome to ${tenant.name}` : 'Modern School Management for the Digital Age'}
                    </h1>
                    <p>
                        {tenant
                            ? 'Sign in to access your student portal, check grades, and view schedules.'
                            : 'Streamline administration, enhance learning, and connect your entire school community with our all-in-one multi-tenant platform.'
                        }
                    </p>

                    <div className="landing-page__features-mini">
                        <div className="feature-pill">
                            <ShieldCheckIcon className="w-5 h-5" /> Secure
                        </div>
                        <div className="feature-pill">
                            <BoltIcon className="w-5 h-5" /> Fast
                        </div>
                        <div className="feature-pill">
                            <GlobeAltIcon className="w-5 h-5" /> Cloud-based
                        </div>
                    </div>
                </div>

                <div className="landing-page__login-card">
                    <h2>Welcome Back</h2>
                    <p>Sign in to access your dashboard</p>
                    <LoginActions />
                </div>
            </section>

            <section className="landing-page__features">
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="icon">
                            <UsersIcon className="w-6 h-6" />
                        </div>
                        <h3>Multi-Tenant Architecture</h3>
                        <p>
                            Designed for scalability. Manage multiple schools or campuses from a single, unified interface with complete data isolation.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="icon">
                            <ChartBarIcon className="w-6 h-6" />
                        </div>
                        <h3>Real-time Analytics</h3>
                        <p>
                            Get insights into student performance, attendance, and financial health with powerful, interactive dashboards.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="icon">
                            <ShieldCheckIcon className="w-6 h-6" />
                        </div>
                        <h3>Enterprise Security</h3>
                        <p>
                            Your data is protected with state-of-the-art encryption, role-based access control, and regular backups.
                        </p>
                    </div>
                </div>
            </section>

            <section className="landing-page__stats">
                <div className="stats-grid">
                    <div className="stat-item">
                        <h3>500+</h3>
                        <p>Schools Trusted</p>
                    </div>
                    <div className="stat-item">
                        <h3>50k+</h3>
                        <p>Students Managed</p>
                    </div>
                    <div className="stat-item">
                        <h3>99.9%</h3>
                        <p>Uptime Guarantee</p>
                    </div>
                </div>
            </section>

            <footer className="landing-page__footer">
                <p>&copy; {new Date().getFullYear()} SchoolPlatform. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default LandingPage
