import '../styles/landing-page.scss'
import React from 'react'
import LoginActions from '../components/auth/LoginActions'
import { ShieldCheckIcon, BoltIcon, UsersIcon, ChartBarIcon, AcademicCapIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { useTenant } from '../contexts/TenantContext'

const LandingPage: React.FC = () => {
    const { tenant, loading } = useTenant()

    // If loading tenant data, show loading state
    if (loading) {
        return (
            <div className="landing-loader">
                <div className="landing-loader__spinner"></div>
                <p>Establishing secure connection...</p>
            </div>
        )
    }

    // Determine display branding
    const schoolName = tenant?.name || 'SchoolPlatform'

    return (
        <div className="landing-page" style={tenant?.theme_config ? {
            '--primary-color': tenant.theme_config.primaryColor,
            '--secondary-color': tenant.theme_config.secondaryColor,
            '--font-family': tenant.theme_config.fontFamily || 'Inter, sans-serif'
        } as React.CSSProperties : {}}>
            <div className="landing-page__background"></div>

            <nav className="landing-page__nav">
                <div className="logo">
                    {tenant?.theme_config?.logo ? (
                        <img
                            src={tenant.theme_config.logo}
                            alt={`${schoolName} logo`}
                            className="logo__image"
                        />
                    ) : (
                        <div className="logo__icon-wrapper">
                            <AcademicCapIcon className="w-8 h-8" />
                        </div>
                    )}
                    <div className="logo__text">
                        <span>{schoolName}</span>
                    </div>
                </div>
            </nav>

            <section className="landing-page__hero">
                <div className="landing-page__content">
                    <div className="hero-badge">
                        <ShieldCheckIcon className="w-4 h-4" />
                        <span>Secure Student Portal</span>
                    </div>
                    <h1>
                        {tenant ? `Welcome to ${tenant.name}` : 'Modern School Management'}
                    </h1>
                    <p className="hero-description">
                        {tenant
                            ? 'Access your unified educational dashboard. Manage grades, attendance, and resources with confidence and security.'
                            : 'Streamline administration, enhance learning, and connect your entire school community with our all-in-one multi-tenant platform.'
                        }
                    </p>

                    <div className="landing-page__features-mini">
                        <div className="feature-pill">
                            <ShieldCheckIcon className="w-5 h-5" /> Enterprise Security
                        </div>
                        <div className="feature-pill">
                            <BoltIcon className="w-5 h-5" /> High Availability
                        </div>
                        <div className="feature-pill">
                            <GlobeAltIcon className="w-5 h-5" /> Cloud Platform
                        </div>
                    </div>
                </div>

                <div className="landing-page__login-card">
                    <div className="card-header">
                        <h2>Sign In</h2>
                        <p>Secure access for Students & Staff</p>
                    </div>
                    <LoginActions />
                    <div className="card-footer-note">
                        <ShieldCheckIcon className="w-3 h-3" />
                        <span>Protected by 256-bit SSL Encryption</span>
                    </div>
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
