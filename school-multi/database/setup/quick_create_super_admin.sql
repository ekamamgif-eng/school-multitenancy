-- ============================================
-- QUICK CREATE SUPER ADMIN
-- ============================================
-- Script cepat untuk membuat Super Admin baru
-- Jalankan setelah user dibuat via Supabase Dashboard
-- ============================================

-- ============================================
-- CARA PENGGUNAAN:
-- ============================================
-- 1. Buat user di Supabase Dashboard:
--    - Buka: https://app.supabase.com → Project → Authentication → Users
--    - Klik "Add user" atau "Invite user"
--    - Isi email dan password
--    - ✅ CENTANG "Auto Confirm User"
--    - Klik "Create user"
--
-- 2. Ganti 'EMAIL_BARU@example.com' di bawah dengan email yang baru dibuat
--
-- 3. Jalankan SQL ini di SQL Editor
-- ============================================

-- Set role menjadi super_admin
UPDATE public.profiles 
SET role = 'super_admin',
    name = 'Super Administrator',
    updated_at = NOW()
WHERE email = 'EMAIL_BARU@example.com';

-- Verifikasi berhasil
SELECT 
    id,
    email,
    name,
    role,
    created_at,
    updated_at
FROM public.profiles 
WHERE email = 'EMAIL_BARU@example.com';

-- ============================================
-- JIKA PROFILE BELUM ADA (ERROR)
-- ============================================
-- Jalankan query ini untuk membuat profile manual:

INSERT INTO public.profiles (id, email, name, role, created_at, updated_at)
SELECT 
    id,
    email,
    'Super Administrator',
    'super_admin',
    NOW(),
    NOW()
FROM auth.users
WHERE email = 'EMAIL_BARU@example.com'
ON CONFLICT (id) DO UPDATE
SET role = 'super_admin',
    name = 'Super Administrator',
    updated_at = NOW();

-- ============================================
-- VERIFIKASI SEMUA SUPER ADMIN
-- ============================================
-- Lihat semua user dengan role super_admin:

SELECT 
    email, 
    name, 
    role, 
    created_at,
    updated_at
FROM public.profiles 
WHERE role = 'super_admin'
ORDER BY created_at DESC;

-- ============================================
-- CONTOH PENGGUNAAN UNTUK BEBERAPA EMAIL
-- ============================================

-- Contoh 1: Membuat superadmin@sekolah.com
-- UPDATE public.profiles 
-- SET role = 'super_admin',
--     name = 'Super Administrator',
--     updated_at = NOW()
-- WHERE email = 'superadmin@sekolah.com';

-- Contoh 2: Membuat admin@sekolah.com
-- UPDATE public.profiles 
-- SET role = 'super_admin',
--     name = 'Administrator Utama',
--     updated_at = NOW()
-- WHERE email = 'admin@sekolah.com';

-- ============================================
-- CATATAN PENTING
-- ============================================
-- ✅ User HARUS dibuat dulu via Supabase Dashboard
-- ✅ Centang "Auto Confirm User" saat membuat user
-- ✅ Super Admin hanya bisa login dengan email/password
-- ✅ Tidak bisa menggunakan Google OAuth untuk Super Admin
-- ============================================
