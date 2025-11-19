import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { Tenant } from '../types'

interface TenantContextType {
  tenant: Tenant | null
  loading: boolean
  setTenant: (tenant: Tenant) => void
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

interface TenantProviderProps {
  children: ReactNode
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const detectTenant = useCallback(async (): Promise<void> => {
    try {
      // For now, use default tenant (mocked) - in production, detect from subdomain
      const mockTenant: Tenant = {
        id: 'demo',
        name: 'Sekolah Demo',
        subdomain: 'demo',
        theme_config: {
          primaryColor: '#3b82f6',
          secondaryColor: '#64748b',
        },
        active_modules: ['academic', 'payment', 'meeting']
      }
      
      setTenant(mockTenant)
      applyTenantTheme(mockTenant)
    } catch (error) {
      console.error('Tenant detection failed:', error)
      // Fallback tenant
      const fallbackTenant: Tenant = {
        id: 'default',
        name: 'Default School',
        subdomain: 'default',
        theme_config: {},
        active_modules: []
      }
      setTenant(fallbackTenant)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void detectTenant()
  }, [detectTenant])

  const applyTenantTheme = (tenant: Tenant): void => {
    const root = document.documentElement
    if (tenant.theme_config) {
      Object.entries(tenant.theme_config).forEach(([key, value]) => {
        if (value && (key.startsWith('color') || key.includes('Color'))) {
          root.style.setProperty(`--${key}`, value)
        }
      })
    }
  }

  const value: TenantContextType = {
    tenant,
    loading,
    setTenant
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}