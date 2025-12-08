-- ============================================
-- Seed Data: Proza Bangsa School
-- ============================================
-- This script inserts the "Proza Bangsa" tenant into the database.
-- Run this in your Supabase SQL Editor.
-- ============================================

INSERT INTO tenants (
  name,
  subdomain,
  school_type,
  email,
  phone,
  address,
  status,
  subscription_plan,
  active_modules,
  theme_config
) VALUES (
  'Proza Bangsa',
  'proza-bangsa',
  'SMA',
  'info@prozabangsa.sch.id',
  '+62 21 555 0123',
  'Jl. Pendidikan No. 1, Jakarta Selatan',
  'active',
  'enterprise',
  ARRAY['academic', 'students', 'teachers', 'finance', 'library', 'transport'],
  '{
    "primaryColor": "#0f766e",
    "secondaryColor": "#115e59",
    "logo": "https://img.icons8.com/color/96/school.png" 
  }'::jsonb
) ON CONFLICT (subdomain) DO UPDATE SET
  name = EXCLUDED.name,
  theme_config = EXCLUDED.theme_config,
  active_modules = EXCLUDED.active_modules;
