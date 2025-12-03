-- ============================================
-- QUICK FIX: Super Admin Login Error 406
-- ============================================
-- Jalankan script ini di Supabase SQL Editor
-- ============================================

-- 1. Buat/Update profile untuk user yang gagal login
INSERT INTO public.profiles (id, email, name, role, avatar_url, created_at, updated_at)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'name', 'Super Administrator'),
    'super_admin',
    NULL,
    NOW(),
    NOW()
FROM auth.users
WHERE id = '02c3d99e-e83d-4d62-bbf3-4d34e54fe206'
ON CONFLICT (id) DO UPDATE
SET role = 'super_admin',
    name = COALESCE(EXCLUDED.name, 'Super Administrator'),
    updated_at = NOW();

-- 2. Verifikasi profile sudah dibuat
SELECT 
    id,
    email,
    name,
    role,
    created_at
FROM public.profiles 
WHERE id = '02c3d99e-e83d-4d62-bbf3-4d34e54fe206';

-- 3. Buat trigger untuk auto-create profile (mencegah error di masa depan)
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
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 4. Fix semua user yang belum punya profile
INSERT INTO public.profiles (id, email, name, role, created_at, updated_at)
SELECT 
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'name', u.email),
    'user',
    NOW(),
    NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- SELESAI! Sekarang coba login lagi.
