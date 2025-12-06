import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import '../../styles/auth-layout.scss'

const AuthLayout: React.FC = () => {
  return (
    <div className="layout-auth">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout
