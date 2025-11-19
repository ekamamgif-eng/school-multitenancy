import React from 'react'
import { Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  Settings,
  Bell,
  LogOut
} from 'lucide-react'

const MainLayout: React.FC = () => {
  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <div className="sidebar__logo">S</div>
        <nav className="sidebar__nav">
          <button className="sidebar__nav-item sidebar__nav-item--active">
            <LayoutDashboard size={22} />
          </button>
          <button className="sidebar__nav-item">
            <FileText size={22} />
          </button>
          <button className="sidebar__nav-item">
            <CalendarDays size={22} />
          </button>
          <button className="sidebar__nav-item">
            <Settings size={22} />
          </button>
          <button className="sidebar__nav-item">
            <Bell size={22} />
          </button>
        </nav>
        <button className="sidebar__nav-item sidebar__nav-item--bottom">
          <LogOut size={22} />
        </button>
      </aside>

      <main className="app-shell__content">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
