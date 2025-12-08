// Script to list all tenants from the database
import { createClient } from '@supabase/supabase-js'

// Hardcode the credentials for this script (read from your .env manually)
const supabaseUrl = 'https://ydpbvfvqxcqwmxqnqfqz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcGJ2ZnZxeGNxd214cW5xZnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1NjU5NjIsImV4cCI6MjA0NzE0MTk2Mn0.Uf3kkCNiEJGCQdMZlQQMlOFqhPaOlBGpyaXfVaGFqNI'

const supabase = createClient(supabaseUrl, supabaseKey)

async function listTenants() {
    console.log('🔍 Fetching tenants from database...\n')

    try {
        const { data: tenants, error } = await supabase
            .from('tenants')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('❌ Error fetching tenants:', error.message)
            return
        }

        if (!tenants || tenants.length === 0) {
            console.log('📭 No tenants found in the database')
            return
        }

        console.log(`✅ Found ${tenants.length} tenant(s):\n`)
        console.log('='.repeat(80))

        const ngrokUrl = 'https://glairier-gwyn-rubicund.ngrok-free.dev'

        tenants.forEach((tenant, index) => {
            console.log(`\n${index + 1}. ${tenant.school_name || 'Unnamed School'}`)
            console.log('   ' + '-'.repeat(70))
            console.log(`   ID: ${tenant.id}`)
            console.log(`   Subdomain: ${tenant.subdomain}`)
            console.log(`   Status: ${tenant.status || 'N/A'}`)
            console.log(`   Created: ${new Date(tenant.created_at).toLocaleString('id-ID')}`)

            // Display URLs
            console.log(`\n   📱 Access URLs:`)
            console.log(`      Ngrok: ${ngrokUrl}?tenant=${tenant.subdomain}`)
            console.log(`      Local: http://localhost:5173?tenant=${tenant.subdomain}`)

            // Display branding if available
            if (tenant.branding) {
                console.log(`\n   🎨 Branding:`)
                if (tenant.branding.logo_url) {
                    console.log(`      Logo: ${tenant.branding.logo_url}`)
                }
                if (tenant.branding.primary_color) {
                    console.log(`      Primary Color: ${tenant.branding.primary_color}`)
                }
                if (tenant.branding.secondary_color) {
                    console.log(`      Secondary Color: ${tenant.branding.secondary_color}`)
                }
            }

            // Display contact info if available
            if (tenant.contact_email || tenant.contact_phone) {
                console.log(`\n   📞 Contact:`)
                if (tenant.contact_email) console.log(`      Email: ${tenant.contact_email}`)
                if (tenant.contact_phone) console.log(`      Phone: ${tenant.contact_phone}`)
            }
        })

        console.log('\n' + '='.repeat(80))
        console.log(`\n💡 Tip: Copy the Ngrok URL and paste it in your browser to access the tenant`)
        console.log(`   The tenant will be automatically detected from the subdomain parameter\n`)

    } catch (err) {
        console.error('❌ Unexpected error:', err)
    }
}

// Run the script
listTenants()
