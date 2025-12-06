-- AUTO-CREATE PROFILE - No Manual Input Required!
-- This script will automatically create profile for the most recent user without profile

-- Step 1: Find user yang belum punya profile
WITH missing_profile_user AS (
    SELECT 
        au.id as user_id,
        au.email,
        au.created_at
    FROM auth.users au
    WHERE NOT EXISTS (
        SELECT 1 FROM profiles p WHERE p.id = au.id
    )
    ORDER BY au.created_at DESC
    LIMIT 1
),
first_tenant AS (
    SELECT id as tenant_id, name as tenant_name
    FROM tenants
    ORDER BY created_at DESC
    LIMIT 1
)
-- Step 2: Display info (untuk konfirmasi)
SELECT 
    'User to Link' as action,
    m.user_id,
    m.email,
    t.tenant_id,
    t.tenant_name
FROM missing_profile_user m
CROSS JOIN first_tenant t;

-- Step 3: CREATE PROFILE automatically
WITH missing_profile_user AS (
    SELECT 
        au.id as user_id,
        au.email
    FROM auth.users au
    WHERE NOT EXISTS (
        SELECT 1 FROM profiles p WHERE p.id = au.id
    )
    ORDER BY au.created_at DESC
    LIMIT 1
),
first_tenant AS (
    SELECT id as tenant_id
    FROM tenants
    ORDER BY created_at DESC
    LIMIT 1
)
INSERT INTO profiles (
    id,
    email,
    tenant_id,
    role,
    is_profile_completed
)
SELECT 
    m.user_id,
    m.email,
    t.tenant_id,
    'admin',
    true
FROM missing_profile_user m
CROSS JOIN first_tenant t
WHERE m.user_id IS NOT NULL
RETURNING 
    id,
    email,
    tenant_id,
    role,
    '✅ Profile created successfully!' as status;
