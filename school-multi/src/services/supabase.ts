import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables not set')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database schema helper
export const tables = {
  tenants: 'tenants',
  parent_profiles: 'profiles', // Updated to match standard Supabase 'profiles' table
  students: 'students',
  parent_student_binding: 'parent_student_binding',
  payment_submissions: 'payment_submissions',
  meetings: 'meetings'
} as const