// Script to create a super admin user
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://stywborxrxfullxmyycx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0eXdib3J4cnhmdWxseG15eWN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNzcyNzEsImV4cCI6MjA3ODk1MzI3MX0.Nov8gmB42asjaaHDPBNuK7proUrqoL6gNVeWJuq5HPw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createSuperAdmin() {
    const email = 'ekamamgif@gmail.com'
    const password = 'SuperAdmin123!' // Change this to your desired password
    const name = 'Super Administrator'

    console.log('\n🔧 Creating Super Admin User...\n')
    console.log('='.repeat(80))

    try {
        // Step 1: Sign up the user
        console.log('Step 1: Registering user in Supabase Auth...')
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    role: 'super_admin'
                }
            }
        })

        if (authError) {
            if (authError.message.includes('already registered')) {
                console.log('⚠️  User already exists in Auth. Proceeding to update profile...')
            } else {
                throw authError
            }
        } else {
            console.log('✅ User registered in Supabase Auth')
            console.log(`   User ID: ${authData.user?.id}`)
        }

        // Step 2: Get or create profile
        console.log('\nStep 2: Creating/updating profile...')

        // First, try to get existing profile
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .maybeSingle()

        let userId = authData.user?.id || existingProfile?.id

        if (!userId) {
            console.error('❌ Could not determine user ID')
            return
        }

        // Upsert profile
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                email: email,
                name: name,
                role: 'super_admin',
                is_profile_completed: true,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'id'
            })
            .select()
            .single()

        if (profileError) {
            throw profileError
        }

        console.log('✅ Profile created/updated successfully')
        console.log(`   ID:    ${userId}`)
        console.log(`   Email: ${email}`)
        console.log(`   Name:  ${name}`)
        console.log(`   Role:  super_admin`)

        console.log('\n' + '='.repeat(80))
        console.log('\n✅ Super Admin user created successfully!')
        console.log('\n📝 Login Credentials:')
        console.log(`   Email:    ${email}`)
        console.log(`   Password: ${password}`)
        console.log('\n💡 You can now login at:')
        console.log('   https://hyetal-unfiscally-voncile.ngrok-free.dev/super-admin/login')
        console.log('\n⚠️  IMPORTANT: Change the password after first login!')

    } catch (err) {
        console.error('\n❌ Error creating super admin:', err.message)
        console.error('\nFull error:', err)
    }

    console.log('\n' + '='.repeat(80) + '\n')
}

// Run the script
createSuperAdmin()
