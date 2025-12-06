-- DEBUG: Cek tenant_id mismatch issue
-- Run query ini untuk melihat masalah sebenarnya

-- 1. CEK: Profile user yang sedang login
SELECT 
    'Current User Profile' as check_type,
    id as user_id,
    email,
    tenant_id,
    role,
    is_profile_completed
FROM profiles
WHERE id = auth.uid();

-- 2. CEK: Apakah tenant_id NULL?
SELECT 
    CASE 
        WHEN tenant_id IS NULL THEN '❌ PROBLEM: tenant_id is NULL in profile!'
        WHEN tenant_id IS NOT NULL THEN '✅ OK: tenant_id exists: ' || tenant_id::text
    END as status
FROM profiles
WHERE id = auth.uid();

-- 3. CEK: Policy check simulation
SELECT 
    'Policy Check Simulation' as check_type,
    id,
    tenant_id,
    role,
    CASE 
        WHEN role IN ('admin', 'super_admin') THEN '✅ Role check PASS'
        ELSE '❌ Role check FAIL'
    END as role_status,
    CASE 
        WHEN tenant_id IS NOT NULL THEN '✅ Has tenant_id'
        ELSE '❌ Missing tenant_id'
    END as tenant_status
FROM profiles
WHERE id = auth.uid();

-- 4. CEK: Apakah ada tenant dengan id tersebut?
SELECT 
    t.id as tenant_id,
    t.name as tenant_name,
    t.subdomain,
    p.email as admin_email
FROM tenants t
LEFT JOIN profiles p ON p.tenant_id = t.id
WHERE p.id = auth.uid();

-- 5. TEST: Coba insert manual dengan hardcoded tenant_id
-- Ganti 'TENANT_ID_DARI_STEP_4' dengan actual tenant_id dari query #4
/*
INSERT INTO students (
    tenant_id,
    nis,
    full_name,
    status
) VALUES (
    (SELECT tenant_id FROM profiles WHERE id = auth.uid()),  -- Ambil dari profile
    'TEST001',
    'Test Student',
    'active'
) RETURNING *;
*/

-- Jika query #5 berhasil, berarti masalah di frontend
-- Jika gagal, jalankan ini untuk lihat error detail:
SELECT 
    'Error Analysis' as type,
    auth.uid() as current_user_id,
    (SELECT tenant_id FROM profiles WHERE id = auth.uid()) as user_tenant_id,
    (SELECT role FROM profiles WHERE id = auth.uid()) as user_role;
