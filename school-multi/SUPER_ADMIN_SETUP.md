# 🔐 Setup Super Admin - ekamamgif@gmail.com

## ❌ Masalah Saat Ini
User `ekamamgif@gmail.com` **BELUM TERDAFTAR** di sistem Supabase Auth.

## ✅ Solusi: 2 Cara Membuat Super Admin

---

## 🚀 **CARA 1: Via Supabase Dashboard (RECOMMENDED)**

### **Langkah 1: Buat User di Supabase**

1. Buka **Supabase Dashboard**: https://app.supabase.com
2. Pilih project: **stywborxrxfullxmyycx**
3. Klik **Authentication** di sidebar kiri
4. Klik **Users**
5. Klik tombol **"Add user"** atau **"Invite user"**
6. Isi form:
   ```
   Email: ekamamgif@gmail.com
   Password: [Buat password kuat, minimal 8 karakter]
   ✅ CENTANG "Auto Confirm User" (PENTING!)
   ```
7. Klik **"Create user"**
8. **Catat password yang Anda buat!**

### **Langkah 2: Set Role Super Admin**

1. Buka **SQL Editor** di Supabase Dashboard
2. Jalankan SQL berikut:

```sql
-- Buat/Update profile dengan role super_admin
INSERT INTO public.profiles (id, email, name, role, created_at, updated_at)
SELECT 
    id,
    email,
    'Eka Mam Gif',
    'super_admin',
    NOW(),
    NOW()
FROM auth.users
WHERE email = 'ekamamgif@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'super_admin',
    name = 'Eka Mam Gif',
    updated_at = NOW();
```

### **Langkah 3: Verifikasi**

Jalankan query ini untuk memastikan berhasil:

```sql
SELECT 
    id,
    email,
    name,
    role,
    created_at,
    updated_at
FROM public.profiles 
WHERE email = 'ekamamgif@gmail.com';
```

**Expected Result:**
```
role: super_admin
name: Eka Mam Gif
email: ekamamgif@gmail.com
```

### **Langkah 4: Test Login**

1. Buka: https://hyetal-unfiscally-voncile.ngrok-free.dev/super-admin/login
2. Masukkan:
   - Email: `ekamamgif@gmail.com`
   - Password: [password yang dibuat di Langkah 1]
3. Klik **"Login as Super Admin"**
4. Jika berhasil, akan redirect ke `/super-admin`

---

## 🔧 **CARA 2: Via Script (Alternatif)**

Jika Anda tidak bisa akses Supabase Dashboard, gunakan script ini:

### **1. Edit Password di Script**

Buka file: `scripts/create-super-admin.mjs`

Ubah baris ini:
```javascript
const password = 'SuperAdmin123!' // Ganti dengan password pilihan Anda
```

### **2. Jalankan Script**

```bash
node scripts/create-super-admin.mjs
```

### **3. Catat Kredensial**

Script akan menampilkan:
```
Email:    ekamamgif@gmail.com
Password: [password yang Anda set]
```

---

## 🐛 **TROUBLESHOOTING**

### **Problem 1: "Invalid login credentials"**

**Penyebab:**
- Password salah
- User belum di-confirm

**Solusi:**
1. Pastikan password yang dimasukkan PERSIS sama
2. Cek di Supabase Dashboard → Authentication → Users
3. Pastikan user status = **"Confirmed"**
4. Jika belum, klik user → "Confirm user"

### **Problem 2: "Profile not found"**

**Penyebab:**
- Profile belum dibuat di tabel `profiles`

**Solusi:**
Jalankan SQL ini:
```sql
INSERT INTO public.profiles (id, email, name, role, created_at, updated_at)
SELECT 
    id,
    email,
    'Eka Mam Gif',
    'super_admin',
    NOW(),
    NOW()
FROM auth.users
WHERE email = 'ekamamgif@gmail.com';
```

### **Problem 3: "User already registered"**

**Penyebab:**
- User sudah ada tapi lupa password

**Solusi:**
1. Buka Supabase Dashboard → Authentication → Users
2. Cari user: `ekamamgif@gmail.com`
3. Klik user → **"Reset password"**
4. Set password baru
5. Coba login lagi

### **Problem 4: Role tidak berubah**

**Solusi:**
```sql
UPDATE public.profiles 
SET role = 'super_admin',
    name = 'Eka Mam Gif',
    updated_at = NOW()
WHERE email = 'ekamamgif@gmail.com';
```

---

## 📊 **Cek Status User**

Untuk melihat semua super admin yang ada:

```sql
SELECT 
    email, 
    name, 
    role, 
    created_at,
    updated_at
FROM public.profiles 
WHERE role = 'super_admin'
ORDER BY created_at DESC;
```

Atau gunakan script:
```bash
node scripts/check-user.mjs
```

---

## 🔒 **SECURITY BEST PRACTICES**

1. ✅ Gunakan password kuat (minimal 12 karakter)
2. ✅ Kombinasi huruf besar/kecil, angka, simbol
3. ✅ Jangan share password
4. ✅ Ganti password setelah first login
5. ✅ Aktifkan 2FA jika tersedia

---

## 📝 **CATATAN PENTING**

- ⚠️ Super Admin **HANYA** bisa login dengan email/password
- ⚠️ **TIDAK BISA** menggunakan Google OAuth untuk Super Admin
- ⚠️ User yang dibuat via Google OAuth perlu password di-set manual
- ✅ Akun `ekamamgif@gmail.com` bisa memiliki role `super_admin`
- ✅ Tapi untuk login administratif, gunakan email/password

---

## 🎯 **Quick Commands**

```bash
# Cek user
node scripts/check-user.mjs

# Buat super admin (edit password dulu!)
node scripts/create-super-admin.mjs

# Lihat daftar tenant
node scripts/list-tenants.mjs
```

---

## 📞 **Need Help?**

Jika masih ada masalah:
1. Cek console browser untuk error message
2. Cek Supabase Dashboard → Logs
3. Jalankan diagnostic script: `node scripts/check-user.mjs`
