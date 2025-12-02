# Database Connection Test API

## Setup

Backend API server untuk test koneksi database PostgreSQL secara real-time.

## Cara Menjalankan

### 1. Jalankan Backend API Server (Terminal 1)
```bash
npm run server:dev
```
Server akan berjalan di `http://localhost:3001`

### 2. Jalankan Frontend Vite (Terminal 2)
```bash
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`

### 3. Jalankan Ngrok (Terminal 3) - Optional
```bash
npm run tunnel
```

## Endpoint API

### POST /api/test-db-connection

**Request Body (Simple Mode):**
```json
{
  "mode": "simple",
  "host": "localhost",
  "database": "dbschool",
  "user": "postgres",
  "password": "your_password",
  "port": 5432
}
```

**Request Body (Advanced Mode):**
```json
{
  "mode": "advanced",
  "connectionString": "postgresql://user:password@host:port/dbname"
}
```

**Response (Success):**
```json
{
  "success": true,
  "host": "localhost",
  "database": "dbschool",
  "user": "postgres"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Connection refused. Please check if PostgreSQL server is running and accessible.",
  "code": "ECONNREFUSED"
}
```

## Error Codes

- `ECONNREFUSED` - PostgreSQL server tidak berjalan atau tidak dapat diakses
- `ENOTFOUND` - Hostname tidak ditemukan
- `28P01` - Autentikasi gagal (username/password salah)
- `3D000` - Database tidak ada
- `ETIMEDOUT` - Connection timeout

## Testing

Gunakan halaman `/tenant/onboarding` untuk test koneksi database.

1. Isi form database configuration
2. Klik "Test Database Connection"
3. Sistem akan melakukan real connection test
4. Jika sukses, Anda bisa lanjut ke step berikutnya
5. Jika gagal, perbaiki konfigurasi dan test lagi

## Notes

- Backend server HARUS berjalan agar test koneksi berfungsi
- Vite proxy akan forward request `/api/*` ke `http://localhost:3001`
- Pastikan PostgreSQL server Anda sudah berjalan sebelum test
