-- ============================================
-- SET PASSWORD - FIXED VERSION
-- ============================================
-- Email: ekamamgif@gmail.com
-- Password: EkaAdmin#Secure2024
-- ============================================
-- ISSUE FIXED: Removed generated columns (confirmed_at, email_confirmed_at)
-- These columns are auto-generated and cannot be manually updated
-- ============================================

-- ============================================
-- STEP 1: Set Password
-- ============================================

UPDATE auth.users
SET 
    encrypted_password = crypt('EkaAdmin#Secure2024', gen_salt('bf')),
    updated_at = NOW()
WHERE email = 'ekamamgif@gmail.com';

-- Expected: Success. 1 row updated

-- ============================================
-- STEP 2: Confirm User (if not already confirmed)
-- ============================================

UPDATE auth.users
SET confirmation_sent_at = NOW()
WHERE email = 'ekamamgif@gmail.com' 
  AND confirmation_sent_at IS NULL;

-- Expected: Success. 0 or 1 row updated

-- ============================================
-- STEP 3: Verify
-- ============================================

SELECT 
    id,
    email,
    confirmed_at,
    email_confirmed_at,
    updated_at,
    confirmation_sent_at,
    last_sign_in_at
FROM auth.users
WHERE email = 'ekamamgif@gmail.com';

-- Expected Results:
-- - email: ekamamgif@gmail.com
-- - updated_at: [timestamp baru - hari ini]
-- - confirmation_sent_at: [ada timestamp]
-- - confirmed_at: [ada timestamp atau NULL]

-- ============================================
-- STEP 4: Check Profile
-- ============================================

SELECT 
    id,
    email,
    name,
    role,
    is_profile_completed
FROM public.profiles
WHERE email = 'ekamamgif@gmail.com';

-- Expected Results:
-- - email: ekamamgif@gmail.com
-- - name: Super Administrator
-- - role: super_admin

-- ============================================
-- LOGIN CREDENTIALS
-- ============================================
-- URL:      https://hyetal-unfiscally-voncile.ngrok-free.dev/super-admin/login
-- Email:    ekamamgif@gmail.com
-- Password: EkaAdmin#Secure2024
-- ============================================

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- If login still fails:

-- 1. Check if pgcrypto extension exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Check if user is banned
SELECT email, banned_until, deleted_at
FROM auth.users
WHERE email = 'ekamamgif@gmail.com';

-- 3. Unban if needed
UPDATE auth.users
SET banned_until = NULL
WHERE email = 'ekamamgif@gmail.com';

-- 4. Re-send confirmation (if needed)
UPDATE auth.users
SET confirmation_sent_at = NOW()
WHERE email = 'ekamamgif@gmail.com';

-- ============================================
-- NOTES
-- ============================================
-- ✅ confirmed_at and email_confirmed_at are GENERATED columns
-- ✅ They are automatically set when confirmation_sent_at is set
-- ✅ You cannot manually UPDATE these columns
-- ✅ This is normal Supabase Auth behavior
-- ============================================
