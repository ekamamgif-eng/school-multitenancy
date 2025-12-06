-- DEEP DEBUG: Find the exact RLS issue
-- Run query ini step by step

-- STEP 1: Cek current user ID
SELECT 
    'Step 1: Current User' as step,
    auth.uid() as user_id,
    auth.role() as auth_role;

-- STEP 2: Cek profile user (apakah ada di table profiles?)
SELECT 
    'Step 2: User Profile' as step,
    id,
    email,
    tenant_id,
    role,
    is_profile_completed,
    created_at
FROM profiles
WHERE id = auth.uid();

-- JIKA Step 2 RETURN EMPTY, berarti user tidak punya profile!
-- JIKA Step 2 return row tapi tenant_id = NULL, itu masalahnya!

-- STEP 3: Cek semua tenants yang ada
SELECT 
    'Step 3: Available Tenants' as step,
    id,
    name,
    subdomain,
    created_at
FROM tenants
ORDER BY created_at DESC;

-- STEP 4: Cek apakah ada profile dengan tenant_id yang valid
SELECT 
    'Step 4: Profiles with Tenants' as step,
    p.id as profile_id,
    p.email,
    p.tenant_id,
    p.role,
    t.name as tenant_name
FROM profiles p
LEFT JOIN tenants t ON t.id = p.tenant_id
WHERE p.id = auth.uid();

-- STEP 5: Test manual - coba set tenant_id jika NULL
-- UNCOMMENT JIKA tenant_id NULL di Step 2
-- Ganti 'TENANT_ID_FROM_STEP_3' dengan actual tenant ID dari Step 3
/*
UPDATE profiles
SET 
    tenant_id = 'TENANT_ID_FROM_STEP_3',
    role = 'admin'
WHERE id = auth.uid();
*/

-- STEP 6: Verify policy dengan data actual
SELECT 
    'Step 6: Policy Check Simulation' as step,
    -- Cek tenant_id match
    (SELECT tenant_id FROM profiles WHERE id = auth.uid() LIMIT 1) as user_tenant_id,
    -- Cek role
    (SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1) as user_role,
    -- Cek apakah EXISTS role check pass
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
        LIMIT 1
    ) as role_check_passes;

-- STEP 7: Final verification
SELECT 
    CASE 
        WHEN NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()) 
            THEN '❌ CRITICAL: User has NO profile in profiles table!'
        WHEN (SELECT tenant_id FROM profiles WHERE id = auth.uid()) IS NULL 
            THEN '❌ PROBLEM: User profile has NULL tenant_id'
        WHEN (SELECT role FROM profiles WHERE id = auth.uid()) NOT IN ('admin', 'super_admin')
            THEN '⚠️ WARNING: User role is not admin/super_admin: ' || (SELECT role FROM profiles WHERE id = auth.uid())
        ELSE '✅ ALL CHECKS PASS - RLS should work!'
    END as diagnosis;
