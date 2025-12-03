-- ============================================
-- SCRIPT: Membuat Super Admin dengan Email/Password
-- ============================================
-- Deskripsi: Script ini adalah panduan untuk membuat akun Super Admin
--            yang bisa login dengan email/password (bukan Google OAuth)
-- 
-- PENTING: Script ini TIDAK bisa dijalankan langsung di SQL Editor
--          karena pembuatan user harus dilakukan via Supabase Dashboard
--          untuk mendapatkan password yang ter-hash dengan benar.
--
-- Ikuti langkah-langkah di bawah ini:
-- ============================================

-- ============================================
-- LANGKAH 1: Buat User di Supabase Dashboard
-- ============================================
-- 1. Buka Supabase Dashboard: https://app.supabase.com
-- 2. Pilih project Anda
-- 3. Klik "Authentication" di sidebar kiri
-- 4. Klik "Users"
-- 5. Klik tombol "Add user" atau "Invite user"
-- 6. Isi form dengan data berikut:
--    - Email: superadmin@example.com (atau email pilihan Anda)
--    - Password: [Buat password yang kuat, minimal 8 karakter]
--    - ✅ CENTANG "Auto Confirm User" (PENTING!)
-- 7. Klik "Create user"
-- 8. Tunggu hingga user berhasil dibuat
-- 9. Catat email dan password yang Anda buat

-- ============================================
-- LANGKAH 2: Set Role Super Admin di Database
-- ============================================
-- Jalankan SQL berikut di SQL Editor setelah user dibuat:

-- Ganti 'superadmin@example.com' dengan email yang Anda gunakan di Langkah 1
UPDATE public.profiles 
SET role = 'super_admin',
    name = 'Super Administrator',
    updated_at = NOW()
WHERE email = 'superadmin@example.com';

-- ============================================
-- LANGKAH 3: Verifikasi User Sudah Dibuat
-- ============================================
-- Jalankan query ini untuk memastikan user sudah ada dan role-nya benar:

SELECT 
    id,
    email,
    name,
    role,
    created_at,
    updated_at
FROM public.profiles 
WHERE email = 'superadmin@example.com';

-- Expected result:
-- id: [UUID user]
-- email: superadmin@example.com
-- name: Super Administrator
-- role: super_admin
-- created_at: [timestamp]
-- updated_at: [timestamp]

-- ============================================
-- LANGKAH 4: Test Login
-- ============================================
-- 1. Buka halaman login Super Admin:
--    https://your-domain.com/auth/super-admin
-- 
-- 2. Masukkan kredensial:
--    Email: superadmin@example.com
--    Password: [password yang Anda buat di Langkah 1]
-- 
-- 3. Klik "Login as Super Admin"
-- 
-- 4. Jika berhasil, Anda akan diarahkan ke:
--    /super-admin (Dashboard Super Admin)

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- Problem 1: "Invalid login credentials"
-- Solusi:
--   - Pastikan email dan password yang dimasukkan PERSIS sama dengan yang dibuat
--   - Cek apakah user sudah di-confirm (Auto Confirm User harus dicentang)
--   - Coba reset password di Supabase Dashboard

-- Problem 2: Profile tidak ditemukan
-- Solusi:
--   - Cek apakah profile sudah dibuat di tabel profiles
SELECT * FROM public.profiles WHERE email = 'superadmin@example.com';
--   - Jika belum ada, buat manual:
INSERT INTO public.profiles (id, email, name, role, created_at, updated_at)
SELECT 
    id,
    email,
    'Super Administrator',
    'super_admin',
    NOW(),
    NOW()
FROM auth.users
WHERE email = 'superadmin@example.com';

-- Problem 3: Role tidak ter-update
-- Solusi:
--   - Jalankan ulang UPDATE query di Langkah 2
--   - Pastikan email-nya benar (case-sensitive)

-- Problem 4: User sudah ada tapi lupa password
-- Solusi:
--   1. Buka Supabase Dashboard → Authentication → Users
--   2. Cari user berdasarkan email
--   3. Klik pada user tersebut
--   4. Klik "Send password reset email" atau "Reset password"
--   5. Set password baru
--   6. Coba login lagi

-- ============================================
-- OPTIONAL: Membuat Multiple Super Admin
-- ============================================
-- Jika Anda ingin membuat lebih dari satu Super Admin:

-- 1. Ulangi Langkah 1 dengan email berbeda (misal: admin2@example.com)
-- 2. Jalankan SQL ini:
UPDATE public.profiles 
SET role = 'super_admin',
    name = 'Super Administrator 2',
    updated_at = NOW()
WHERE email = 'admin2@example.com';

-- 3. Verifikasi:
SELECT email, name, role FROM public.profiles WHERE role = 'super_admin';

-- ============================================
-- SECURITY BEST PRACTICES
-- ============================================
-- 1. Gunakan password yang kuat (minimal 12 karakter, kombinasi huruf besar/kecil, angka, simbol)
-- 2. Jangan share password Super Admin
-- 3. Gunakan email yang berbeda untuk setiap Super Admin
-- 4. Aktifkan 2FA (Two-Factor Authentication) jika tersedia
-- 5. Regularly audit user dengan role super_admin:
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
-- CATATAN PENTING
-- ============================================
-- - User yang dibuat via Google OAuth TIDAK BISA login dengan email/password
--   kecuali password di-set manual di Supabase Dashboard
-- 
-- - Untuk Super Admin, HANYA gunakan email/password authentication
--   (Google OAuth tidak tersedia untuk Super Admin sesuai requirement)
-- 
-- - Akun Google existing (ekamamgif@gmail.com) bisa tetap memiliki role
--   super_admin, tapi untuk login administratif gunakan akun email/password
--   yang baru dibuat
-- 
-- - Jika ada error "Could not find the 'address' column", jalankan migration:
--   database/migrations/03_add_profile_fields.sql

-- ============================================
-- END OF SCRIPT
-- ============================================
