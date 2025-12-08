import React from 'react'
import { useLocation } from 'react-router-dom'
import LandingPage from '../../pages/LandingPage'

/**
 * Smart 404 component that checks if the path might be a tenant slug
 * If it is, render the LandingPage. Otherwise, show 404.
 */
const NotFoundOrTenantPage: React.FC = () => {
    const location = useLocation()

    // Extract the first path segment
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const firstSegment = pathSegments[0]?.toLowerCase()

    // List of reserved paths that are definitely NOT tenant slugs
    const reservedPaths = [
        'login', 'auth', 'admin', 'super-admin', 'parent', 'tenant',
        'help', 'complete-profile', 'assets', 'static', 'api', 'documents',
        'calendar', 'settings', 'notifications', 'students', 'teachers',
        'finance', 'academic', 'transport'
    ]

    // If the path has multiple segments or starts with a reserved word, it's a 404
    const isDefinitely404 = pathSegments.length > 1 || reservedPaths.includes(firstSegment || '')

    // If it's definitely a 404, show the 404 page
    if (isDefinitely404) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
                <h1 style={{ fontSize: '4rem', margin: '0', color: '#dc2626' }}>404</h1>
                <p style={{ fontSize: '1.5rem', color: '#6b7280', margin: '1rem 0' }}>
                    Page Not Found
                </p>
                <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
                    The page you're looking for doesn't exist.
                </p>
                <a
                    href="/"
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: '#3b82f6',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontWeight: '500'
                    }}
                >
                    Go Home
                </a>
            </div>
        )
    }

    // Otherwise, it might be a tenant slug - render the landing page
    // The TenantContext will try to detect the tenant from the path
    return <LandingPage />
}

export default NotFoundOrTenantPage
