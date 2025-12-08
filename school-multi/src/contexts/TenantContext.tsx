import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react'
import { Tenant } from '../types'
import { supabase } from '../services/supabase'
import { generateThemePalette, applyThemePalette } from '../utils/colorTheming'

interface TenantContextType {
  tenant: Tenant | null
  loading: boolean
  error: string | null
  setTenant: (tenant: Tenant) => void
  refreshTenant: () => Promise<void>
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

interface TenantProviderProps {
  children: ReactNode
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Use ref to track tenant state and avoid stale closures in useCallback
  const tenantRef = useRef<Tenant | null>(null)

  useEffect(() => {
    tenantRef.current = tenant
  }, [tenant])

  const applyTenantTheme = (tenant: Tenant): void => {
    if (tenant.theme_config) {
      const primaryColor = tenant.theme_config.primaryColor || tenant.theme_config.primary_color
      const secondaryColor = tenant.theme_config.secondaryColor || tenant.theme_config.secondary_color

      if (primaryColor && secondaryColor) {
        console.log('🎨 Generating theme palette from:', { primaryColor, secondaryColor })

        // Generate comprehensive color palette
        const palette = generateThemePalette(primaryColor, secondaryColor)

        // Apply to CSS variables (including logo)
        applyThemePalette(palette, tenant.theme_config.logo)

        console.log('✅ Theme palette applied:', palette)
      } else {
        console.warn('⚠️ Missing primary or secondary color in theme config')
      }
    }
  }


  const fetchTenantBySubdomain = async (subdomain: string): Promise<Tenant | null> => {
    try {
      const { data: tenantData, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('subdomain', subdomain)
        .maybeSingle()

      if (error) {
        throw error
      }

      if (tenantData) {
        return {
          id: tenantData.id,
          name: tenantData.name,
          subdomain: tenantData.subdomain,
          theme_config: tenantData.theme_config || {},
          active_modules: tenantData.active_modules || [],
          status: tenantData.status || 'active'
        }
      }
    } catch (err) {
      console.error('Error fetching tenant by subdomain:', err)
      return null
    }
    return null
  }

  const getSubdomain = (): string | null => {
    const hostname = window.location.hostname
    const parts = hostname.split('.')

    // Localhost development support (e.g. tenant1.localhost)
    if (hostname.includes('localhost')) {
      if (parts.length >= 2 && parts[0] !== 'www') {
        return parts[0]
      }
      return null
    }

    // Production (e.g. tenant1.school.com)
    // Assumes 3+ parts: [subdomain, domain, tld]
    if (parts.length > 2 && parts[0] !== 'www') {
      return parts[0]
    }

    return null
  }

  const getTenantFromQuery = (): string | null => {
    const urlParams = new URLSearchParams(window.location.search)
    const tenantParam = urlParams.get('tenant')

    if (tenantParam) {
      console.log('🔍 Detected tenant from query parameter:', tenantParam)
      return tenantParam
    }

    return null
  }



  const getSlugFromPath = (): string | null => {
    const path = window.location.pathname
    // Split by '/' and get the first segment
    const segments = path.split('/').filter(Boolean)

    if (segments.length === 0) return null

    const firstSegment = segments[0].toLowerCase()

    // List of reserved system paths that cannot be tenant slugs
    const reservedPaths = [
      'login', 'auth', 'admin', 'super-admin', 'parent', 'tenant',
      'help', 'complete-profile', 'assets', 'static', 'api'
    ]

    if (reservedPaths.includes(firstSegment)) {
      return null
    }

    // Return the potential tenant slug
    return firstSegment
  }

  const fetchTenantFromSupabase = async (userId: string): Promise<Tenant | null> => {
    try {
      // 1. Get tenant_id from user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', userId)
        .single()

      if (profileError) {
        // It's possible the profile doesn't exist yet or doesn't have tenant_id
        console.warn('Could not fetch profile for tenant detection:', profileError.message)
        return null
      }

      if (!profile?.tenant_id) {
        return null
      }

      // 2. Fetch tenant details
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', profile.tenant_id)
        .single()

      if (tenantError) {
        throw tenantError
      }

      if (tenantData) {
        return {
          id: tenantData.id,
          name: tenantData.name,
          subdomain: tenantData.subdomain,
          theme_config: tenantData.theme_config || {},
          active_modules: tenantData.active_modules || [],
          status: tenantData.status || 'active'
        }
      }
    } catch (err) {
      console.error('Error fetching tenant from Supabase:', err)
      return null
    }
    return null
  }

  const detectTenant = useCallback(async (): Promise<void> => {
    // Only show loading if we don't have a tenant yet (Stale-while-revalidate)
    if (!tenantRef.current) {
      setLoading(true)
    }
    setError(null)

    try {
      let foundTenant: Tenant | null = null

      // Strategy 0: Check Query Parameter (highest priority for ngrok/testing)
      const queryTenant = getTenantFromQuery()
      if (queryTenant) {
        foundTenant = await fetchTenantBySubdomain(queryTenant)
        if (foundTenant) {
          console.log('✅ Found tenant via query parameter:', foundTenant.name)
        }
      }

      // Strategy 1: Check Subdomain
      if (!foundTenant) {
        const subdomain = getSubdomain()
        if (subdomain) {
          console.log('🔍 Detected subdomain:', subdomain)
          foundTenant = await fetchTenantBySubdomain(subdomain)
          if (foundTenant) {
            console.log('✅ Found tenant via subdomain:', foundTenant.name)
          }
        }
      }

      // Strategy 1.5: Check Path Slug (e.g. /sma-berdikari)
      if (!foundTenant) {
        const pathSlug = getSlugFromPath()
        if (pathSlug) {
          console.log('🔍 Detected path slug:', pathSlug)
          // We reuse fetchTenantBySubdomain since specific school slugs are stored in the 'subdomain' column
          foundTenant = await fetchTenantBySubdomain(pathSlug)
          if (foundTenant) {
            console.log('✅ Found tenant via path slug:', foundTenant.name)
          }
        }
      }

      // Strategy 2: Check authenticated user (fallback if no subdomain or subdomain verify failed)
      // Note: In strict mode, we might want to FORCE the subdomain tenant even if logged in user is different
      // but for now let's keep it additive.
      if (!foundTenant) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          foundTenant = await fetchTenantFromSupabase(session.user.id)
        }
      }

      // Strategy 3: Check localStorage (Onboarding/Dev Config)
      if (!foundTenant) {
        const savedTenant = localStorage.getItem('tenant_config')
        if (savedTenant) {
          try {
            foundTenant = JSON.parse(savedTenant)
          } catch (e) {
            console.error('Failed to parse (tenant_config) from localStorage', e)
          }
        }
      }

      // Strategy 3: Mock/Demo Fallback (if no other tenant found)
      // Only verify against checking a 'public' landing page or similar in future
      if (!foundTenant) {
        // Semantic fallback for specific known tenants if DB is empty
        const pathSlug = getSlugFromPath()

        if (pathSlug === 'proza-bangsa') {
          const prozaTenant: Tenant = {
            id: 'proza-bangsa-mock',
            name: 'Proza Bangsa',
            subdomain: 'proza-bangsa',
            theme_config: {
              primaryColor: '#0f766e',
              secondaryColor: '#115e59',
              // Using a placeholder logo that looks professional
              logo: "https://cdn-icons-png.flaticon.com/512/8074/8074788.png"
            },
            active_modules: ['academic', 'students', 'teachers', 'finance', 'library', 'transport'],
            status: 'active'
          }
          foundTenant = prozaTenant
        } else {
          // Default Demo School
          const mockTenant: Tenant = {
            id: 'demo',
            name: 'Sekolah Demo',
            subdomain: 'demo',
            theme_config: {
              primaryColor: '#3b82f6',
              secondaryColor: '#64748b',
            },
            active_modules: ['academic', 'payment', 'meeting'],
            status: 'trial'
          }
          foundTenant = mockTenant
        }
      }

      if (foundTenant) {
        setTenant(foundTenant)
        applyTenantTheme(foundTenant)
      }

    } catch (error: any) {
      console.error('Tenant detection check failed:', error)
      setError(error.message || 'Failed to detect tenant')

      // Fallback tenant to prevent crash
      const fallbackTenant: Tenant = {
        id: 'default',
        name: 'Default School',
        subdomain: 'default',
        theme_config: {},
        active_modules: [],
        status: 'active'
      }
      setTenant(fallbackTenant)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial detection
  useEffect(() => {
    void detectTenant()

    // Listed for auth changes to re-detect tenant
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        void detectTenant()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [detectTenant])

  const value: TenantContextType = {
    tenant,
    loading,
    error,
    setTenant: (newTenant) => {
      setTenant(newTenant)
      applyTenantTheme(newTenant)
    },
    refreshTenant: detectTenant
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