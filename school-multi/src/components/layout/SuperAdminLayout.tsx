import React from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const SuperAdminLayout: React.FC = () => {
  const { user, logout } = useAuth()

  const handleLogout = async (): Promise<void> => {
    await logout()
    window.location.href = '/'
  }

  return (
    <div className="super-admin-layout">
      <header className="admin-header">
        <div className="header-content">
          <div className="brand">
            <h1>Platform Management</h1>
            <span>Super Administrator</span>
          </div>

          <nav className="admin-nav">
            <div className="user-info">
              <span>Welcome, {user?.user_metadata?.full_name || user?.email}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-outline">
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

export default SuperAdminLayout