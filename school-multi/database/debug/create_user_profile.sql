-- AUTO-FIX: Create Profile for Current User
-- This script will create a profile for the logged-in user

-- Step 1: Check current user info
SELECT 
    'Current User Info' as step,
    auth.uid() as user_id,
    (SELECT email FROM auth.users WHERE id = auth.uid()) as email;

-- Step 2: Get available tenant (use first tenant or create one)
SELECT 
    'Available Tenant' as step,
    id as tenant_id,
    name as tenant_name,
    subdomain
FROM tenants
ORDER BY created_at DESC
LIMIT 1;

-- Step 3: CREATE PROFILE for current user
-- This will link user to the first available tenant
INSERT INTO profiles (
    id,
    email,
    tenant_id,
    role,
    is_profile_completed
)
SELECT 
    auth.uid(),
    (SELECT email FROM auth.users WHERE id = auth.uid()),
    (SELECT id FROM tenants ORDER BY created_at DESC LIMIT 1), -- Use first tenant
    'admin', -- Set as admin
    true
WHERE NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid()
);

-- Step 4: Verify profile created
SELECT 
    'Profile Created' as result,
    id,
    email,
    tenant_id,
    role,
    is_profile_completed,
    created_at
FROM profiles
WHERE id = auth.uid();

-- Step 5: Verify tenant link
SELECT 
    'Profile with Tenant Info' as result,
    p.id as profile_id,
    p.email,
    p.role,
    t.id as tenant_id,
    t.name as tenant_name,
    t.subdomain
FROM profiles p
JOIN tenants t ON t.id = p.tenant_id
WHERE p.id = auth.uid();

-- Step 6: Final check
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND tenant_id IS NOT NULL 
            AND role IN ('admin', 'super_admin')
        )
        THEN '✅ SUCCESS! Profile created and linked to tenant. You can now add students!'
        ELSE '❌ FAILED: Please check previous steps for errors'
    END as final_status;
