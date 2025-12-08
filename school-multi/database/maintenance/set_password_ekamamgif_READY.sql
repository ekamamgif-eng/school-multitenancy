-- ============================================
-- SET PASSWORD UNTUK SUPER ADMIN
-- ============================================
-- Email: ekamamgif@gmail.com
-- User ID: 17cc6ddd-461b-4848-bd79-a79e4c1953ff
-- Password: EkaAdmin#Secure2024
-- ============================================

-- CARA PENGGUNAAN:
-- 1. Copy seluruh SQL di bawah ini
-- 2. Buka Supabase SQL Editor: https://app.supabase.com
-- 3. Pilih project: stywborxrxfullxmyycx
-- 4. Paste dan jalankan SQL ini
-- 5. Seharusnya muncul: "Success. 1 row updated"
-- 6. Login di: https://hyetal-unfiscally-voncile.ngrok-free.dev/super-admin/login

-- ============================================
-- SET PASSWORD
-- ============================================

-- Set password untuk user
UPDATE auth.users
SET 
    encrypted_password = crypt('EkaAdmin#Secure2024', gen_salt('bf')),
    updated_at = NOW()
WHERE email = 'ekamamgif@gmail.com';

-- Jika user belum confirmed, confirm user
-- (Hanya jika confirmation_sent_at masih NULL)
UPDATE auth.users
SET confirmation_sent_at = NOW()
WHERE email = 'ekamamgif@gmail.com' 
  AND confirmation_sent_at IS NULL;

-- ============================================
-- VERIFIKASI
-- ============================================

-- Cek apakah user sudah ter-update
SELECT 
    id,
    email,
    confirmed_at,
    email_confirmed_at,
    updated_at,
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
-- Query 1 (UPDATE): Success. 1 row updated
--
-- Query 2 (SELECT auth.users):
--   email: ekamamgif@gmail.com
--   confirmed_at: [timestamp baru - hari ini]
--   email_confirmed_at: [timestamp baru - hari ini]
--   updated_at: [timestamp baru - hari ini]
--
-- Query 3 (SELECT profiles):
--   email: ekamamgif@gmail.com
--   name: Super Administrator
--   role: super_admin
-- ============================================

-- ============================================
-- LOGIN CREDENTIALS
-- ============================================
-- Email:    ekamamgif@gmail.com
-- Password: EkaAdmin#Secure2024
-- URL:      https://hyetal-unfiscally-voncile.ngrok-free.dev/super-admin/login
-- ============================================

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- Jika masih tidak bisa login setelah set password:

-- 1. Pastikan user ter-confirm (jika belum)
UPDATE auth.users
SET confirmation_sent_at = NOW()
WHERE email = 'ekamamgif@gmail.com' 
  AND confirmation_sent_at IS NULL;

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

-- 4. Jika ada error "function crypt does not exist":
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Lalu jalankan ulang UPDATE password di atas

-- ============================================
-- ALTERNATIVE METHOD
-- ============================================
-- Jika SQL tidak berhasil, gunakan Supabase Dashboard:
-- 1. Buka: https://app.supabase.com
-- 2. Pilih project: stywborxrxfullxmyycx
-- 3. Authentication → Users
-- 4. Cari: ekamamgif@gmail.com
-- 5. Klik user → "Reset password"
-- 6. Set password: EkaAdmin#Secure2024
-- ============================================

-- ============================================
-- SECURITY REMINDER
-- ============================================
-- ⚠️ Password ini sudah ter-save di file SQL ini
-- ⚠️ Setelah berhasil login, GANTI PASSWORD segera
-- ⚠️ Jangan share file ini dengan orang lain
-- ⚠️ Hapus file ini setelah selesai digunakan
-- ============================================
