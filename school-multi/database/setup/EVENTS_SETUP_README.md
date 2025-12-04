# 📅 Calendar/Events Database - Setup Summary

## ✅ Yang Sudah Dibuat

### 1. **Database Schema** (`database/setup/02_events_setup.sql`)
   - Tabel `events` dengan struktur lengkap
   - Row Level Security (RLS) policies untuk multi-tenant
   - Indexes untuk performa optimal
   - Triggers untuk auto-update timestamps

### 2. **Service Layer** (`src/services/eventsService.ts`)
   - `fetchEvents()` - Ambil semua events
   - `fetchEventsByDateRange()` - Ambil events berdasarkan tanggal
   - `fetchUpcomingEvents()` - Ambil events yang akan datang
   - `createEvent()` - Buat event baru
   - `updateEvent()` - Update event
   - `deleteEvent()` - Hapus event
   - `subscribeToEvents()` - Real-time updates
   - `migrateFromLocalStorage()` - Migrasi dari localStorage

### 3. **Dokumentasi** (`database/setup/EVENTS_SETUP_GUIDE.md`)
   - Panduan lengkap setup database
   - Contoh penggunaan API
   - Troubleshooting guide
   - Best practices

### 4. **Supabase Client Update** (`src/services/supabase.ts`)
   - Menambahkan `events` ke daftar tabel

## 🚀 Langkah Setup

### Step 1: Setup Database di Supabase

1. Buka **Supabase Dashboard** → **SQL Editor**
2. Copy-paste isi file `database/setup/02_events_setup.sql`
3. Klik **Run** untuk execute query
4. Verifikasi tabel sudah dibuat:
   ```sql
   SELECT * FROM public.events LIMIT 1;
   ```

### Step 2: Pastikan Environment Variables

Cek file `.env` Anda memiliki:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Install Dependencies (jika belum)

```bash
npm install @supabase/supabase-js
```

### Step 4: Update CalendarPage.tsx

Ganti localStorage dengan Supabase. Contoh implementasi:

```typescript
import { useEffect, useState } from 'react'
import * as eventsService from '../services/eventsService'

// Di dalam component
const [events, setEvents] = useState<Event[]>([])
const [loading, setLoading] = useState(true)

// Fetch events saat component mount
useEffect(() => {
    loadEvents()
}, [])

const loadEvents = async () => {
    try {
        setLoading(true)
        const data = await eventsService.fetchEvents()
        setEvents(data)
    } catch (error) {
        console.error('Error loading events:', error)
    } finally {
        setLoading(false)
    }
}

// Create event
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
        if (editingEvent) {
            await eventsService.updateEvent(editingEvent.id, formData)
        } else {
            await eventsService.createEvent(formData)
        }
        await loadEvents() // Refresh
        setShowModal(false)
    } catch (error) {
        console.error('Error saving event:', error)
        alert('Failed to save event')
    }
}

// Delete event
const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure?')) return
    
    try {
        await eventsService.deleteEvent(id)
        await loadEvents() // Refresh
    } catch (error) {
        console.error('Error deleting event:', error)
        alert('Failed to delete event')
    }
}
```

## 📊 Struktur Data

### Event Interface (Frontend)
```typescript
interface Event {
    id: string
    title: string
    date: string        // YYYY-MM-DD
    time: string        // HH:MM
    location: string
    attendees: number
    type: 'class' | 'exam' | 'meeting' | 'event'
    color: string       // Hex color
    description?: string
}
```

### Database Schema
```sql
events (
    id UUID PRIMARY KEY,
    tenant_id UUID,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location TEXT NOT NULL,
    attendees INTEGER DEFAULT 0,
    event_type TEXT CHECK (event_type IN ('class', 'exam', 'meeting', 'event')),
    color TEXT DEFAULT '#4f46e5',
    created_by UUID,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

## 🔒 Security (RLS)

Tabel `events` sudah dilindungi dengan Row Level Security:
- ✅ User hanya bisa lihat events dari tenant mereka
- ✅ User hanya bisa create/update/delete events dari tenant mereka
- ✅ Data antar tenant terisolasi

## 🎯 Fitur yang Sudah Tersedia

1. ✅ **CRUD Operations** - Create, Read, Update, Delete
2. ✅ **Multi-tenant Support** - Isolasi data per sekolah
3. ✅ **Real-time Updates** - Subscribe ke perubahan (optional)
4. ✅ **Date Range Queries** - Filter berdasarkan tanggal
5. ✅ **Type Filtering** - Filter berdasarkan tipe event
6. ✅ **Auto Timestamps** - Created/Updated timestamps otomatis
7. ✅ **Migration Tool** - Migrasi dari localStorage

## 🔧 Troubleshooting

### "new row violates row-level security policy"
**Solusi**: Pastikan user sudah login dan memiliki `tenant_id` di tabel `profiles`

### "relation 'public.tenants' does not exist"
**Solusi**: 
- Buat tabel `tenants` terlebih dahulu, atau
- Hapus foreign key constraint pada `tenant_id` di file SQL

### Events tidak muncul setelah create
**Solusi**: 
- Cek console untuk error
- Pastikan `tenant_id` user sesuai dengan event yang dibuat
- Verifikasi RLS policies

## 📝 Next Steps

1. ⬜ Jalankan SQL script di Supabase
2. ⬜ Test koneksi dengan query sederhana
3. ⬜ Refactor `CalendarPage.tsx` untuk gunakan `eventsService`
4. ⬜ Test CRUD operations
5. ⬜ (Optional) Implement real-time updates
6. ⬜ (Optional) Migrate data dari localStorage

## 📚 File References

- **SQL Schema**: `database/setup/02_events_setup.sql`
- **Service Layer**: `src/services/eventsService.ts`
- **Supabase Client**: `src/services/supabase.ts`
- **Full Guide**: `database/setup/EVENTS_SETUP_GUIDE.md`
- **Calendar Page**: `src/pages/CalendarPage.tsx`

## 💡 Tips

1. **Test di Development**: Test semua operasi di development dulu
2. **Error Handling**: Selalu handle error dengan baik
3. **Loading States**: Tampilkan loading indicator
4. **Validation**: Validasi input sebelum kirim ke database
5. **Backup**: Backup localStorage data sebelum migrate

---

**Status**: ✅ Database schema siap digunakan
**Action Required**: Jalankan SQL script di Supabase Dashboard
