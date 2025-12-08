import { supabase } from './supabase'
import { Tenant, TenantFormData } from '../types'

/**
 * Tenant Service
 * Handles all CRUD operations for tenant/school management
 */

export const tenantService = {
    /**
     * Fetch all tenants
     */
    async getAllTenants(): Promise<Tenant[]> {
        const { data, error } = await supabase
            .from('tenants')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return (data || []).map((t: any) => ({
            id: t.id,
            name: t.name,
            subdomain: t.subdomain,
            theme_config: t.theme || {},
            active_modules: t.active_modules || ['academic', 'payment'],
            email: t.email,
            phone: t.phone,
            address: t.address,
            city: t.city,
            province: t.province,
            postal_code: t.postal_code,
            website: t.website,
            school_type: t.school_type,
            accreditation: t.accreditation,
            npsn: t.npsn,
            established_year: t.established_year,
            principal_name: t.principal_name,
            principal_phone: t.principal_phone,
            principal_email: t.principal_email,
            status: t.status || 'active',
            subscription_plan: t.subscription_plan,
            subscription_expires_at: t.subscription_expires_at,
            max_students: t.max_students,
            max_teachers: t.max_teachers,
            created_at: t.created_at,
            updated_at: t.updated_at,
            created_by: t.created_by,
            updated_by: t.updated_by,
            logo_url: t.logo_url,
            notes: t.notes
        }))
    },

    /**
     * Fetch a single tenant by ID
     */
    async getTenantById(id: string): Promise<Tenant | null> {
        const { data, error } = await supabase
            .from('tenants')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        if (!data) return null

        return {
            id: data.id,
            name: data.name,
            subdomain: data.subdomain,
            theme_config: data.theme || {},
            active_modules: data.active_modules || ['academic', 'payment'],
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            province: data.province,
            postal_code: data.postal_code,
            website: data.website,
            school_type: data.school_type,
            accreditation: data.accreditation,
            npsn: data.npsn,
            established_year: data.established_year,
            principal_name: data.principal_name,
            principal_phone: data.principal_phone,
            principal_email: data.principal_email,
            status: data.status || 'active',
            subscription_plan: data.subscription_plan,
            subscription_expires_at: data.subscription_expires_at,
            max_students: data.max_students,
            max_teachers: data.max_teachers,
            created_at: data.created_at,
            updated_at: data.updated_at,
            created_by: data.created_by,
            updated_by: data.updated_by,
            logo_url: data.logo_url,
            notes: data.notes
        }
    },

    /**
     * Create a new tenant
     */
    async createTenant(formData: TenantFormData, userId: string): Promise<Tenant> {
        const { data, error } = await supabase
            .from('tenants')
            .insert({
                name: formData.name,
                subdomain: formData.subdomain,
                theme: formData.theme_config || {},
                active_modules: formData.active_modules,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                province: formData.province,
                postal_code: formData.postal_code,
                website: formData.website,
                school_type: formData.school_type,
                accreditation: formData.accreditation,
                npsn: formData.npsn,
                established_year: formData.established_year,
                principal_name: formData.principal_name,
                principal_phone: formData.principal_phone,
                principal_email: formData.principal_email,
                status: formData.status,
                subscription_plan: formData.subscription_plan,
                subscription_expires_at: formData.subscription_expires_at,
                max_students: formData.max_students,
                max_teachers: formData.max_teachers,
                logo_url: formData.theme_config?.logo,
                notes: formData.notes,
                created_by: userId,
                updated_by: userId
            })
            .select()
            .single()

        if (error) throw error

        return {
            id: data.id,
            name: data.name,
            subdomain: data.subdomain,
            theme_config: data.theme || {},
            active_modules: data.active_modules || ['academic', 'payment'],
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            province: data.province,
            postal_code: data.postal_code,
            website: data.website,
            school_type: data.school_type,
            accreditation: data.accreditation,
            npsn: data.npsn,
            established_year: data.established_year,
            principal_name: data.principal_name,
            principal_phone: data.principal_phone,
            principal_email: data.principal_email,
            status: data.status || 'active',
            subscription_plan: data.subscription_plan,
            subscription_expires_at: data.subscription_expires_at,
            max_students: data.max_students,
            max_teachers: data.max_teachers,
            created_at: data.created_at,
            updated_at: data.updated_at,
            created_by: data.created_by,
            updated_by: data.updated_by,
            logo_url: data.logo_url,
            notes: data.notes
        }
    },

    /**
     * Update an existing tenant
     */
    async updateTenant(id: string, formData: TenantFormData, userId: string): Promise<Tenant> {
        const { data, error } = await supabase
            .from('tenants')
            .update({
                name: formData.name,
                subdomain: formData.subdomain,
                theme: formData.theme_config || {},
                active_modules: formData.active_modules,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                province: formData.province,
                postal_code: formData.postal_code,
                website: formData.website,
                school_type: formData.school_type,
                accreditation: formData.accreditation,
                npsn: formData.npsn,
                established_year: formData.established_year,
                principal_name: formData.principal_name,
                principal_phone: formData.principal_phone,
                principal_email: formData.principal_email,
                status: formData.status,
                subscription_plan: formData.subscription_plan,
                subscription_expires_at: formData.subscription_expires_at,
                max_students: formData.max_students,
                max_teachers: formData.max_teachers,
                logo_url: formData.theme_config?.logo,
                notes: formData.notes,
                updated_by: userId,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return {
            id: data.id,
            name: data.name,
            subdomain: data.subdomain,
            theme_config: data.theme || {},
            active_modules: data.active_modules || ['academic', 'payment'],
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            province: data.province,
            postal_code: data.postal_code,
            website: data.website,
            school_type: data.school_type,
            accreditation: data.accreditation,
            npsn: data.npsn,
            established_year: data.established_year,
            principal_name: data.principal_name,
            principal_phone: data.principal_phone,
            principal_email: data.principal_email,
            status: data.status || 'active',
            subscription_plan: data.subscription_plan,
            subscription_expires_at: data.subscription_expires_at,
            max_students: data.max_students,
            max_teachers: data.max_teachers,
            created_at: data.created_at,
            updated_at: data.updated_at,
            created_by: data.created_by,
            updated_by: data.updated_by,
            logo_url: data.logo_url,
            notes: data.notes
        }
    },

    /**
     * Delete a tenant
     */
    async deleteTenant(id: string): Promise<void> {
        const { error } = await supabase
            .from('tenants')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    /**
     * Get tenant statistics
     */
    async getTenantStats(tenantId: string): Promise<{
        studentCount: number
        teacherCount: number
        paymentCount: number
    }> {
        const [students, teachers, payments] = await Promise.all([
            supabase
                .from('students')
                .select('*', { count: 'exact', head: true })
                .eq('tenant_id', tenantId),
            supabase
                .from('teachers')
                .select('*', { count: 'exact', head: true })
                .eq('tenant_id', tenantId),
            supabase
                .from('payment_submissions')
                .select('*', { count: 'exact', head: true })
                .eq('tenant_id', tenantId)
        ])

        return {
            studentCount: students.count || 0,
            teacherCount: teachers.count || 0,
            paymentCount: payments.count || 0
        }
    }
}
