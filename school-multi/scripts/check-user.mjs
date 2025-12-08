// Script to check user and profile in Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://stywborxrxfullxmyycx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0eXdib3J4cnhmdWxseG15eWN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNzcyNzEsImV4cCI6MjA3ODk1MzI3MX0.Nov8gmB42asjaaHDPBNuK7proUrqoL6gNVeWJuq5HPw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkUser(email) {
    console.log(`\n🔍 Checking user: ${email}\n`)
    console.log('='.repeat(80))

    try {
        // Check if user exists in profiles table
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .maybeSingle()

        if (profileError) {
            console.error('❌ Error fetching profile:', profileError.message)
            return
        }

        if (!profile) {
            console.log('❌ User not found in profiles table')
            console.log('\n💡 This user might not be registered yet.')
            console.log('   To create a super admin user, you need to:')
            console.log('   1. Register the user via Supabase Auth')
            console.log('   2. Update their profile with role="super_admin"')
            return
        }

        console.log('✅ User found in profiles table:\n')
        console.log(`   ID:       ${profile.id}`)
        console.log(`   Email:    ${profile.email}`)
        console.log(`   Name:     ${profile.name || 'N/A'}`)
        console.log(`   Role:     ${profile.role || 'N/A'}`)
        console.log(`   Tenant:   ${profile.tenant_id || 'N/A'}`)
        console.log(`   Profile:  ${profile.is_profile_completed ? 'Completed' : 'Incomplete'}`)
        console.log(`   Created:  ${new Date(profile.created_at).toLocaleString('id-ID')}`)

        // Check role
        if (profile.role === 'super_admin') {
            console.log('\n✅ User has super_admin role')
        } else {
            console.log(`\n⚠️  User role is "${profile.role}", not "super_admin"`)
            console.log('   To fix this, run the following SQL in Supabase:')
            console.log(`   UPDATE profiles SET role = 'super_admin' WHERE email = '${email}';`)
        }

    } catch (err) {
        console.error('❌ Unexpected error:', err)
    }

    console.log('\n' + '='.repeat(80))
}

// Check the user
const emailToCheck = 'ekamamgif@gmail.com'
checkUser(emailToCheck)
