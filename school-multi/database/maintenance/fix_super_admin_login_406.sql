-- ============================================
-- FIX: Super Admin Login Error 406
-- ============================================
-- Error: GET /rest/v1/profiles 406 (Not Acceptable)
-- Penyebab: Profile tidak ada atau RLS policy terlalu ketat
-- ============================================

-- LANGKAH 1: Cek apakah profile user sudah ada
-- Ganti USER_ID dengan ID user yang gagal login
-- ID dari error: 02c3d99e-e83d-4d62-bbf3-4d34e54fe206

SELECT 
    id,
    email,
    name,
    role,
    avatar_url,
    created_at
FROM public.profiles 
WHERE id = '02c3d99e-e83d-4d62-bbf3-4d34e54fe206';

-- Jika TIDAK ADA HASIL, jalankan LANGKAH 2
-- Jika ADA HASIL, jalankan LANGKAH 3

-- ============================================
-- LANGKAH 2: Buat Profile untuk User Baru
-- ============================================
-- Jalankan ini jika profile belum ada

INSERT INTO public.profiles (id, email, name, role, avatar_url, created_at, updated_at)
SELECT 
    id,
    email,
    'Super Administrator',
    'super_admin',
    NULL,
    NOW(),
    NOW()
FROM auth.users
WHERE id = '02c3d99e-e83d-4d62-bbf3-4d34e54fe206'
ON CONFLICT (id) DO UPDATE
SET role = 'super_admin',
    name = 'Super Administrator',
    updated_at = NOW();

-- ============================================
-- LANGKAH 3: Verifikasi Profile Sudah Ada
-- ============================================

SELECT 
    id,
    email,
    name,
    role,
    avatar_url,
    created_at,
    updated_at
FROM public.profiles 
WHERE id = '02c3d99e-e83d-4d62-bbf3-4d34e54fe206';

-- Expected result:
-- id: 02c3d99e-e83d-4d62-bbf3-4d34e54fe206
-- email: [email user]
-- name: Super Administrator
-- role: super_admin
-- avatar_url: NULL
-- created_at: [timestamp]
-- updated_at: [timestamp]

-- ============================================
-- LANGKAH 4: Cek RLS Policies
-- ============================================
-- Pastikan RLS policies sudah benar

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- ============================================
-- LANGKAH 5 (OPTIONAL): Update RLS Policy
-- ============================================
-- Jika masih error, tambahkan policy untuk service_role

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Recreate policies dengan lebih permissive
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Grant permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.profiles TO anon;

-- ============================================
-- LANGKAH 6: Test Query Manual
-- ============================================
-- Test apakah query bisa berjalan

SELECT role, name, avatar_url 
FROM public.profiles 
WHERE id = '02c3d99e-e83d-4d62-bbf3-4d34e54fe206';

-- Jika query ini berhasil, coba login lagi

-- ============================================
-- TROUBLESHOOTING TAMBAHAN
-- ============================================

-- Problem 1: Profile tidak dibuat otomatis saat user signup
-- Solusi: Buat trigger untuk auto-create profile

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger jika sudah ada
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Problem 2: Column 'avatar_url' tidak ada
-- Solusi: Tambahkan column jika belum ada

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
    END IF;
END $$;

-- ============================================
-- QUICK FIX: Untuk Semua User Baru
-- ============================================
-- Jalankan ini untuk memastikan semua user di auth.users punya profile

INSERT INTO public.profiles (id, email, name, role, created_at, updated_at)
SELECT 
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'name', u.email),
    COALESCE(p.role, 'user'),
    NOW(),
    NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFIKASI AKHIR
-- ============================================
-- Cek semua super admin

SELECT 
    p.id,
    p.email,
    p.name,
    p.role,
    u.confirmed_at,
    u.last_sign_in_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.role = 'super_admin'
ORDER BY p.created_at DESC;

-- ============================================
-- CATATAN PENTING
-- ============================================
-- Setelah menjalankan fix ini:
-- 1. Logout dari aplikasi (jika sedang login)
-- 2. Clear browser cache/cookies
-- 3. Coba login lagi di /auth/super-admin
-- 4. Jika masih error, cek browser console untuk error baru
-- ============================================
