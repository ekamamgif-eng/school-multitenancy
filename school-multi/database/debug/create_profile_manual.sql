-- MANUAL FIX: Create Profile with Manual User ID
-- Step-by-step untuk create profile

-- STEP 1: Lihat semua users yang ada di auth.users
SELECT 
    'Step 1: Available Users' as step,
    id as user_id,
    email,
    created_at,
    CASE 
        WHEN EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.users.id)
        THEN '✅ Has Profile'
        ELSE '❌ No Profile'
    END as profile_status
FROM auth.users
ORDER BY created_at DESC;

-- STEP 2: Lihat available tenants
SELECT 
    'Step 2: Available Tenants' as step,
    id as tenant_id,
    name,
    subdomain
FROM tenants
ORDER BY created_at DESC;

-- STEP 3: CREATE PROFILE
-- GANTI values berikut dengan data actual dari Step 1 & 2:
-- - 'USER_ID_FROM_STEP_1' → Copy user_id dari Step 1 yang belum punya profile
-- - 'USER_EMAIL_FROM_STEP_1' → Copy email dari Step 1
-- - 'TENANT_ID_FROM_STEP_2' → Copy tenant_id dari Step 2

INSERT INTO profiles (
    id,
    email,
    tenant_id,
    role,
    is_profile_completed
) VALUES (
    'USER_ID_FROM_STEP_1',  -- ← GANTI dengan actual user ID
    'USER_EMAIL_FROM_STEP_1', -- ← GANTI dengan actual email
    'TENANT_ID_FROM_STEP_2',  -- ← GANTI dengan actual tenant ID
    'admin',
    true
);

-- STEP 4: Verify profile created
SELECT 
    'Step 4: Verify Profile' as step,
    p.id,
    p.email,
    p.tenant_id,
    p.role,
    t.name as tenant_name
FROM profiles p
LEFT JOIN tenants t ON t.id = p.tenant_id
WHERE p.email = 'USER_EMAIL_FROM_STEP_1'  -- ← GANTI dengan email yang sama
ORDER BY p.created_at DESC
LIMIT 1;

-- SUCCESS MESSAGE
SELECT '✅ Profile created! Now logout and login again, then try adding student.' as message;
