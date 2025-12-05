# Setup Events Table - Step by Step Guide

## Prerequisites
✅ Akun Supabase aktif
✅ Project Supabase sudah dibuat
✅ File `02_events_setup.sql` sudah tersedia

## Method 1: Via Supabase Dashboard (EASIEST)

### Step 1: Login ke Supabase
1. Buka browser
2. Pergi ke https://supabase.com
3. Login dengan akun Anda
4. Pilih project yang digunakan untuk school-app

### Step 2: Buka SQL Editor
1. Di sidebar kiri, klik **SQL Editor**
2. Atau klik ikon database 🗄️
3. Klik tombol **New Query**

### Step 3: Copy SQL Script
1. Buka file: `database/setup/02_events_setup.sql`
2. Copy SEMUA isi file (Ctrl+A, Ctrl+C)
3. Paste ke SQL Editor di Supabase (Ctrl+V)

### Step 4: Jalankan Script
1. Klik tombol **Run** (atau tekan Ctrl+Enter)
2. Tunggu sampai selesai (biasanya < 5 detik)
3. Lihat hasil di bagian bawah:
   - ✅ Success: "Success. No rows returned"
   - ❌ Error: Baca pesan error dan perbaiki

### Step 5: Verifikasi Tabel Sudah Dibuat
Jalankan query ini di SQL Editor:

```sql
-- Cek apakah tabel events ada
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'events';

-- Cek struktur tabel
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'events'
ORDER BY ordinal_position;

-- Cek RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'events';
```

### Step 6: Test Insert Data (Optional)
```sql
-- Ganti YOUR_TENANT_ID dengan tenant_id yang valid
INSERT INTO public.events (
    tenant_id, 
    title, 
    description, 
    event_date, 
    event_time, 
    location, 
    attendees, 
    event_type, 
    color
) VALUES (
    'YOUR_TENANT_ID',
    'Test Event',
    'This is a test event',
    '2024-12-10',
    '09:00',
    'Room 101',
    30,
    'class',
    '#3b82f6'
);

-- Cek apakah data masuk
SELECT * FROM public.events;
```

## Method 2: Via Supabase CLI (ADVANCED)

### Prerequisites
- Node.js installed
- Supabase CLI installed

### Step 1: Install Supabase CLI
```bash
npm install -g supabase
```

### Step 2: Login
```bash
supabase login
```

### Step 3: Link Project
```bash
cd c:\Users\guest1\Documents\_PROZA\cursor\school-app-multi-tenant\school-multi
supabase link --project-ref YOUR_PROJECT_REF
```

### Step 4: Run Migration
```bash
supabase db push
```

## Troubleshooting

### Error: "relation 'public.tenants' does not exist"
**Solusi**: 
1. Buat tabel `tenants` terlebih dahulu, ATAU
2. Edit file `02_events_setup.sql`:
   - Hapus atau comment baris: `tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,`
   - Ganti dengan: `tenant_id UUID,`

### Error: "permission denied for schema public"
**Solusi**:
1. Pastikan Anda login sebagai owner project
2. Atau jalankan sebagai service_role

### Error: "function handle_updated_at() does not exist"
**Solusi**:
1. Jalankan file `01_profiles_setup.sql` terlebih dahulu
2. Atau copy function `handle_updated_at()` dari file tersebut

### Tabel sudah ada (duplicate)
**Solusi**:
```sql
-- Drop tabel jika ingin reset
DROP TABLE IF EXISTS public.events CASCADE;

-- Lalu jalankan ulang script 02_events_setup.sql
```

## Verification Checklist

Setelah setup, pastikan:
- ✅ Tabel `events` ada di database
- ✅ Semua kolom sesuai (id, tenant_id, title, dll)
- ✅ RLS policies aktif (4 policies)
- ✅ Indexes terbuat (4 indexes)
- ✅ Trigger `set_events_updated_at` aktif

## Next Steps

Setelah tabel berhasil dibuat:

1. ✅ Update environment variables (sudah ada)
2. ✅ Test CRUD operations di aplikasi
3. ⬜ Integrate CalendarPage dengan Supabase
4. ⬜ Test real-time updates (optional)

## Quick Reference

### Supabase Dashboard URLs
- Project Dashboard: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID`
- SQL Editor: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql`
- Table Editor: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor`
- Database: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/database/tables`

### Important Files
- SQL Script: `database/setup/02_events_setup.sql`
- Service Layer: `src/services/eventsService.ts`
- Full Guide: `database/setup/EVENTS_SETUP_GUIDE.md`

---

**Need Help?**
- Supabase Docs: https://supabase.com/docs
- SQL Reference: https://www.postgresql.org/docs/
- Project Issues: Check console logs and Supabase logs
