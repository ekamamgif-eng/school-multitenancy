-- ============================================
-- Seed Data: Scalable Multi-Tenant Seeder
-- ============================================
-- This script is designed to be GENERIC and SCALABLE.
-- To add more tenants, simply add a new row to the 'tenant_data' CTE below.
-- The script will automatically insert or update all tenants defined there.
-- ============================================

WITH tenant_data (
    name, 
    subdomain, 
    school_type, 
    email, 
    phone, 
    address, 
    status, 
    subscription_plan, 
    active_modules, 
    primary_color, 
    secondary_color, 
    logo_url, 
    border_radius, 
    font_family
) AS (
    VALUES 
    -- 1. Tenants Configuration (Add your 10+ tenants here)
    -- Name, Subdomain, Type, Email, Phone, Address, Status, Plan, Modules, PrimaryColor, SecondaryColor, Logo, Radius, Font
    
    (
        'Proza Bangsa', 
        'proza-bangsa', 
        'SMA', 
        'info@prozabangsa.sch.id', 
        '+62 21 555 0123', 
        'Jl. Pendidikan No. 1, Jakarta', 
        'active', 
        'enterprise', 
        ARRAY['academic', 'students', 'teachers', 'finance', 'library', 'transport'], 
        '#0f766e', '#115e59', 'https://img.icons8.com/color/96/school.png', '8px', 'Inter'
    ),
    
    (
        'PROZA', 
        'proza', 
        'Other',  -- Changed from 'International' to match allowed values ('SD', 'SMP', 'SMA', 'SMK', 'TK', 'Other')
        'contact@proza.edu', 
        '+62 21 999 8888', 
        'Jl. Sudirman Kav 50, Jakarta', 
        'active', 
        'enterprise', 
        ARRAY['academic', 'students', 'teachers', 'finance', 'library', 'transport']::text[], 
        '#7c3aed', '#5b21b6', 'https://img.icons8.com/fluency/96/university.png', '12px', 'Poppins'
    ),
    
    (
        'Global Mandiri', 
        'global-mandiri', 
        'SMP', 
        'admin@globalmandiri.sch.id', 
        '+62 21 777 6666', 
        'Jl. Merdeka Barat, Bandung', 
        'trial', 
        'basic', 
        ARRAY['academic', 'students']::text[], 
        '#ea580c', '#c2410c', 'https://img.icons8.com/dusk/96/school.png', '4px', 'Roboto'
    )
    
    -- Add more tenants simply by adding a comma and a new (...) block here
)
INSERT INTO tenants (
    name,
    subdomain,
    school_type,
    email,
    phone,
    address,
    status,
    subscription_plan,
    active_modules,
    theme_config
) 
SELECT 
    name,
    subdomain,
    school_type::varchar(20),  -- explicit cast to match column definition
    email,
    phone,
    address,
    status::varchar(20),       -- explicit cast to match column definition
    subscription_plan::varchar(20), -- explicit cast
    active_modules,
    jsonb_build_object(
        'primaryColor', primary_color,
        'secondaryColor', secondary_color,
        'logo', logo_url,
        'borderRadius', border_radius,
        'fontFamily', font_family
    ) as theme_config
FROM tenant_data
ON CONFLICT (subdomain) DO UPDATE SET
    name = EXCLUDED.name,
    school_type = EXCLUDED.school_type,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    status = EXCLUDED.status,
    subscription_plan = EXCLUDED.subscription_plan,
    active_modules = EXCLUDED.active_modules,
    theme_config = EXCLUDED.theme_config;
