-- ============================================
-- SET PASSWORD UNTUK SUPER ADMIN
-- ============================================
-- Email: ekamamgif@gmail.com
-- User ID: 17cc6ddd-461b-4848-bd79-a79e4c1953ff
-- ============================================

-- CARA PENGGUNAAN:
-- 1. Ganti 'YourStrongPassword123!' dengan password pilihan Anda
-- 2. Jalankan SQL ini di Supabase SQL Editor
-- 3. Catat password yang Anda gunakan
-- 4. Login di: https://hyetal-unfiscally-voncile.ngrok-free.dev/super-admin/login

-- ============================================
-- SET PASSWORD
-- ============================================

-- Update password untuk ekamamgif@gmail.com
UPDATE auth.users
SET 
    encrypted_password = crypt('YourStrongPassword123!', gen_salt('bf')),
    updated_at = NOW(),
    confirmation_sent_at = NOW(),
    confirmed_at = NOW(),
    email_confirmed_at = NOW()
WHERE email = 'ekamamgif@gmail.com';

-- ============================================
-- VERIFIKASI
-- ============================================

-- Cek apakah user sudah ter-update
SELECT 
    id,
    email,
    created_at,
    updated_at,
    confirmed_at,
    email_confirmed_at,
    last_sign_in_at
FROM auth.users
WHERE email = 'ekamamgif@gmail.com';

-- Cek profile
SELECT 
    id,
    email,
    name,
    role,
    is_profile_completed,
    created_at,
    updated_at
FROM public.profiles
WHERE email = 'ekamamgif@gmail.com';

-- ============================================
-- EXPECTED RESULTS
-- ============================================
-- auth.users:
--   - email: ekamamgif@gmail.com
--   - confirmed_at: [timestamp baru]
--   - updated_at: [timestamp baru]
--
-- profiles:
--   - email: ekamamgif@gmail.com
--   - name: Super Administrator
--   - role: super_admin
-- ============================================

-- ============================================
-- LOGIN CREDENTIALS
-- ============================================
-- Email:    ekamamgif@gmail.com
-- Password: YourStrongPassword123!  (atau password yang Anda set)
-- URL:      https://hyetal-unfiscally-voncile.ngrok-free.dev/super-admin/login
-- ============================================

-- ============================================
-- SECURITY NOTES
-- ============================================
-- ✅ Gunakan password yang kuat (minimal 12 karakter)
-- ✅ Kombinasi huruf besar/kecil, angka, dan simbol
-- ✅ Jangan share password ini
-- ✅ Ganti password setelah first login
-- ============================================

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- Jika masih tidak bisa login, coba:

-- 1. Reset confirmation status
UPDATE auth.users
SET 
    confirmed_at = NOW(),
    email_confirmed_at = NOW(),
    confirmation_sent_at = NOW()
WHERE email = 'ekamamgif@gmail.com';

-- 2. Cek apakah ada banned atau deleted
SELECT 
    email,
    banned_until,
    deleted_at,
    is_sso_user
FROM auth.users
WHERE email = 'ekamamgif@gmail.com';

-- 3. Jika banned, unban:
UPDATE auth.users
SET banned_until = NULL
WHERE email = 'ekamamgif@gmail.com';

-- ============================================
-- ALTERNATIVE: Gunakan Supabase Dashboard
-- ============================================
-- Jika SQL tidak berhasil, gunakan Supabase Dashboard:
-- 1. Buka: https://app.supabase.com
-- 2. Pilih project: stywborxrxfullxmyycx
-- 3. Authentication → Users
-- 4. Cari: ekamamgif@gmail.com
-- 5. Klik user → "Reset password"
-- 6. Set password baru
-- ============================================
