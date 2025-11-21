import React from 'react'
import LoginActions from '../components/auth/LoginActions'
import { Shield, Zap, Users, BarChart3, GraduationCap, Globe } from 'lucide-react'

const LandingPage: React.FC = () => {
    return (
        <div className="landing-page">
            <nav className="landing-page__nav">
                <div className="logo">
                    <GraduationCap size={32} />
                    <span>SchoolPlatform</span>
                </div>
            </nav>

            <section className="landing-page__hero">
                <div className="landing-page__content">
                    <h1>Modern School Management for the Digital Age</h1>
                    <p>
                        Streamline administration, enhance learning, and connect your entire school community with our all-in-one multi-tenant platform.
                    </p>

                    <div className="landing-page__features-mini">
                        <div className="feature-pill">
                            <Shield size={18} /> Secure
                        </div>
                        <div className="feature-pill">
                            <Zap size={18} /> Fast
                        </div>
                        <div className="feature-pill">
                            <Globe size={18} /> Cloud-based
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
                            <Users size={24} />
                        </div>
                        <h3>Multi-Tenant Architecture</h3>
                        <p>
                            Designed for scalability. Manage multiple schools or campuses from a single, unified interface with complete data isolation.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="icon">
                            <BarChart3 size={24} />
                        </div>
                        <h3>Real-time Analytics</h3>
                        <p>
                            Get insights into student performance, attendance, and financial health with powerful, interactive dashboards.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="icon">
                            <Shield size={24} />
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
