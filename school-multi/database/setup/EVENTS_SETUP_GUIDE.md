# Events/Calendar Database Setup

## Overview
Tabel `events` dirancang untuk menyimpan semua data calendar/event dalam sistem manajemen sekolah multi-tenant.

## Struktur Tabel

### Kolom-kolom:
- `id` (UUID): Primary key, auto-generated
- `tenant_id` (UUID): Foreign key ke tabel tenants
- `title` (TEXT): Judul event (required)
- `description` (TEXT): Deskripsi detail event (optional)
- `event_date` (DATE): Tanggal event (required)
- `event_time` (TIME): Waktu event (required)
- `location` (TEXT): Lokasi event (required)
- `attendees` (INTEGER): Jumlah peserta (default: 0)
- `event_type` (TEXT): Tipe event - 'class', 'exam', 'meeting', atau 'event' (required)
- `color` (TEXT): Kode warna hex untuk tampilan kalender (default: '#4f46e5')
- `created_by` (UUID): User yang membuat event
- `created_at` (TIMESTAMP): Waktu pembuatan
- `updated_at` (TIMESTAMP): Waktu update terakhir

## Cara Setup

### 1. Jalankan SQL Script
```bash
# Pastikan Anda sudah login ke Supabase
# Buka SQL Editor di Supabase Dashboard
# Copy-paste isi file 02_events_setup.sql
# Jalankan query
```

### 2. Verifikasi Tabel
```sql
-- Cek apakah tabel sudah dibuat
SELECT * FROM public.events LIMIT 1;

-- Cek RLS policies
SELECT * FROM pg_policies WHERE tablename = 'events';
```

## Row Level Security (RLS)

Tabel ini menggunakan RLS untuk memastikan:
- ✅ User hanya bisa melihat event dari tenant mereka sendiri
- ✅ User hanya bisa membuat event untuk tenant mereka
- ✅ User hanya bisa update/delete event dari tenant mereka
- ✅ Data antar tenant terisolasi dengan aman

## Integrasi dengan Frontend

### Setup Supabase Client
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Environment Variables
```env
# .env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Contoh Penggunaan di CalendarPage.tsx

#### 1. Fetch Events
```typescript
const fetchEvents = async () => {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })
    
    if (error) {
        console.error('Error fetching events:', error)
        return
    }
    
    // Transform data to match Event interface
    const transformedEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        date: event.event_date,
        time: event.event_time,
        location: event.location,
        attendees: event.attendees,
        type: event.event_type,
        color: event.color,
        description: event.description
    }))
    
    setEvents(transformedEvents)
}
```

#### 2. Create Event
```typescript
const createEvent = async (eventData) => {
    const { data, error } = await supabase
        .from('events')
        .insert([{
            title: eventData.title,
            description: eventData.description,
            event_date: eventData.date,
            event_time: eventData.time,
            location: eventData.location,
            attendees: eventData.attendees,
            event_type: eventData.type,
            color: getEventTypeColor(eventData.type)
        }])
        .select()
    
    if (error) {
        console.error('Error creating event:', error)
        return
    }
    
    // Update local state
    fetchEvents()
}
```

#### 3. Update Event
```typescript
const updateEvent = async (id, eventData) => {
    const { error } = await supabase
        .from('events')
        .update({
            title: eventData.title,
            description: eventData.description,
            event_date: eventData.date,
            event_time: eventData.time,
            location: eventData.location,
            attendees: eventData.attendees,
            event_type: eventData.type,
            color: getEventTypeColor(eventData.type)
        })
        .eq('id', id)
    
    if (error) {
        console.error('Error updating event:', error)
        return
    }
    
    fetchEvents()
}
```

#### 4. Delete Event
```typescript
const deleteEvent = async (id) => {
    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
    
    if (error) {
        console.error('Error deleting event:', error)
        return
    }
    
    fetchEvents()
}
```

#### 5. Real-time Subscription (Optional)
```typescript
useEffect(() => {
    // Subscribe to changes
    const subscription = supabase
        .channel('events_changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'events' },
            (payload) => {
                console.log('Change received!', payload)
                fetchEvents() // Refresh events
            }
        )
        .subscribe()
    
    return () => {
        subscription.unsubscribe()
    }
}, [])
```

## Query Examples

### Get Events for Specific Month
```sql
SELECT * FROM public.events
WHERE EXTRACT(MONTH FROM event_date) = 12
  AND EXTRACT(YEAR FROM event_date) = 2024
ORDER BY event_date, event_time;
```

### Get Upcoming Events
```sql
SELECT * FROM public.events
WHERE event_date >= CURRENT_DATE
ORDER BY event_date, event_time
LIMIT 10;
```

### Get Events by Type
```sql
SELECT * FROM public.events
WHERE event_type = 'exam'
  AND event_date >= CURRENT_DATE
ORDER BY event_date;
```

## Migration dari localStorage

Jika Anda sudah memiliki data di localStorage, Anda bisa migrate dengan:

```typescript
const migrateFromLocalStorage = async () => {
    const localEvents = localStorage.getItem('school_events')
    if (!localEvents) return
    
    const events = JSON.parse(localEvents)
    
    for (const event of events) {
        await supabase.from('events').insert({
            title: event.title,
            description: event.description,
            event_date: event.date,
            event_time: event.time,
            location: event.location,
            attendees: event.attendees,
            event_type: event.type,
            color: event.color
        })
    }
    
    // Clear localStorage after migration
    localStorage.removeItem('school_events')
}
```

## Troubleshooting

### Error: "new row violates row-level security policy"
- Pastikan user sudah login
- Pastikan user memiliki `tenant_id` di tabel `profiles`
- Cek apakah RLS policies sudah benar

### Error: "relation 'public.tenants' does not exist"
- Tabel `tenants` harus dibuat terlebih dahulu
- Atau hapus foreign key constraint `tenant_id` jika tidak menggunakan multi-tenant

### Events tidak muncul
- Cek apakah `tenant_id` di tabel events sesuai dengan `tenant_id` user
- Verifikasi RLS policies dengan query di atas

## Best Practices

1. **Validasi Input**: Selalu validasi data sebelum insert/update
2. **Error Handling**: Tangani error dengan baik dan tampilkan pesan yang user-friendly
3. **Loading States**: Tampilkan loading indicator saat fetch data
4. **Optimistic Updates**: Update UI dulu, baru sync ke database
5. **Pagination**: Untuk data yang banyak, gunakan pagination
6. **Caching**: Pertimbangkan caching untuk mengurangi query ke database

## Next Steps

1. ✅ Setup tabel events di Supabase
2. ⬜ Install `@supabase/supabase-js` package
3. ⬜ Setup Supabase client
4. ⬜ Refactor CalendarPage.tsx untuk menggunakan Supabase
5. ⬜ Test CRUD operations
6. ⬜ Implement real-time updates (optional)
