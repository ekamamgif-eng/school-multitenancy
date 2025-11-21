import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../services/supabase'
import { User } from '../types'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { SUPER_ADMINS, mapSupabaseUser } from './authHelpers'

interface AuthContextType {
  user: User | null
  loading: boolean
  loginWithGoogle: () => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Define createUserProfile before it's used in useEffect
  const createUserProfile = async (user: SupabaseUser): Promise<void> => {
    try {
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      // Ignore error if it's just "not found" (PGRST116) which means we need to create it
      // But if it's a 404 (table not found), we should catch it
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.warn('Error checking profile (table might be missing):', fetchError)
        return
      }

      if (!existingProfile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || user.email,
              avatar_url: user.user_metadata?.avatar_url,
              created_at: new Date().toISOString()
            }
          ])

        if (insertError) {
          console.warn('Error creating profile:', insertError)
        }
      }
    } catch (error) {
      console.warn('Exception in createUserProfile (likely missing table):', error)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(mapSupabaseUser(session?.user ?? null))
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(mapSupabaseUser(session?.user ?? null))
      setLoading(false)

      // If signed in, create/update user profile
      if (session?.user && event === 'SIGNED_IN') {
        await createUserProfile(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          },
          redirectTo: `${window.location.origin}/auth/google-callback`
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Google auth error:', error)
      throw error
    }
  }

  const loginWithEmail = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const superAdmin = SUPER_ADMINS.find(admin => admin.email === email && admin.password === password)

      if (superAdmin) {
        const mockSuperAdmin: User = {
          id: 'super-admin-1',
          email: superAdmin.email,
          user_metadata: { full_name: superAdmin.name },
          role: 'super_admin'
        }

        setUser(mockSuperAdmin)
        return { success: true }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      setUser(mapSupabaseUser(data.user) ?? null)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }
    }
  }

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut()
  }

  const value: AuthContextType = {
    user,
    loading,
    loginWithGoogle,
    loginWithEmail,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}