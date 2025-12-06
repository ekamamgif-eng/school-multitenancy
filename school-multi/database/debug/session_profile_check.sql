-- FINAL DEBUG: Check Session vs Profile Match
-- Run this to see the EXACT problem

-- 1. Current session user (apa yang browser kirim)
SELECT 
    'Current Session' as check_type,
    auth.uid() as session_user_id,
    auth.role() as session_role,
    (SELECT email FROM auth.users WHERE id = auth.uid()) as session_email;

-- 2. Does this user have a profile?
SELECT 
    'Profile for Current Session' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
        THEN '✅ Profile exists'
        ELSE '❌ NO PROFILE for this session user!'
    END as profile_status,
    (SELECT tenant_id FROM profiles WHERE id = auth.uid()) as tenant_id,
    (SELECT role FROM profiles WHERE id = auth.uid()) as role;

-- 3. All profiles in system (siapa saja yang punya profile?)
SELECT 
    'All Profiles in System' as check_type,
    p.id,
    p.email,
    p.tenant_id,
    p.role,
    p.created_at,
    CASE 
        WHEN p.id = auth.uid() THEN '⭐ THIS IS YOU'
        ELSE ''
    END as is_current_user
FROM profiles p
ORDER BY p.created_at DESC;

-- 4. RLS Policy Test for INSERT
SELECT 
    'RLS INSERT Test' as check_type,
    auth.uid() as your_user_id,
    (SELECT tenant_id FROM profiles WHERE id = auth.uid()) as your_tenant_id,
    (SELECT role FROM profiles WHERE id = auth.uid()) as your_role,
    CASE 
        WHEN NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
        THEN '❌ FAIL: You have NO profile!'
        WHEN (SELECT tenant_id FROM profiles WHERE id = auth.uid()) IS NULL
        THEN '❌ FAIL: Your profile has NULL tenant_id!'
        WHEN (SELECT role FROM profiles WHERE id = auth.uid()) NOT IN ('admin', 'super_admin')
        THEN '❌ FAIL: Your role is not admin/super_admin'
        ELSE '✅ PASS: You should be able to insert!'
    END as rls_check_result;

-- 5. SOLUTION: If profile exists but for different user
-- Uncomment dan run jika Step 2 return "NO PROFILE"
/*
WITH current_user_info AS (
    SELECT auth.uid() as uid, (SELECT email FROM auth.users WHERE id = auth.uid()) as email
),
first_tenant AS (
    SELECT id FROM tenants ORDER BY created_at DESC LIMIT 1
)
INSERT INTO profiles (id, email, tenant_id, role, is_profile_completed)
SELECT u.uid, u.email, t.id, 'admin', true
FROM current_user_info u
CROSS JOIN first_tenant t
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE id = u.uid)
RETURNING id, email, tenant_id, role, '✅ Profile created for YOUR session!' as message;
*/
