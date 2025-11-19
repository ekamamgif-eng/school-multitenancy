import type { User as SupabaseUser } from '@supabase/supabase-js'
import { User } from '../types'

export const SUPER_ADMINS = [
  { email: 'superadmin@yayasan.edu', password: 'admin123', name: 'Super Administrator' }
]

export const mapSupabaseUser = (user: SupabaseUser | null): User | null => {
  if (!user || !user.email) return null

  return {
    id: user.id,
    email: user.email,
    user_metadata: {
      full_name: user.user_metadata?.full_name,
      avatar_url: user.user_metadata?.avatar_url
    },
    role: (user.user_metadata as { role?: User['role'] })?.role
  }
}

