# 🔐 Set Password untuk ekamamgif@gmail.com

## 📋 Informasi User

```
Email:    ekamamgif@gmail.com
User ID:  17cc6ddd-461b-4848-bd79-a79e4c1953ff
Role:     super_admin ✅
Status:   Created via Google OAuth (belum ada password)
```

---

## 🚀 CARA 1: Via Supabase SQL Editor (RECOMMENDED)

### **Langkah 1: Buka Supabase SQL Editor**

1. Buka: https://app.supabase.com
2. Pilih project: **stywborxrxfullxmyycx**
3. Klik **SQL Editor** di sidebar kiri
4. Klik **"New query"**

### **Langkah 2: Jalankan SQL Berikut**

**⚠️ PENTING:** Ganti `YourStrongPassword123!` dengan password pilihan Anda!

```sql
-- Set password untuk ekamamgif@gmail.com
UPDATE auth.users
SET 
    encrypted_password = crypt('YourStrongPassword123!', gen_salt('bf')),
    updated_at = NOW(),
    confirmation_sent_at = NOW(),
    confirmed_at = NOW(),
    email_confirmed_at = NOW()
WHERE email = 'ekamamgif@gmail.com';
```

### **Langkah 3: Verifikasi**

Jalankan query ini untuk memastikan berhasil:

```sql
SELECT 
    id,
    email,
    confirmed_at,
    email_confirmed_at,
    updated_at
FROM auth.users
WHERE email = 'ekamamgif@gmail.com';
```

**Expected Result:**
- `confirmed_at`: [timestamp baru]
- `email_confirmed_at`: [timestamp baru]
- `updated_at`: [timestamp baru]

### **Langkah 4: Test Login**

1. Buka: https://hyetal-unfiscally-voncile.ngrok-free.dev/super-admin/login
2. Masukkan:
   - **Email**: `ekamamgif@gmail.com`
   - **Password**: [password yang Anda set di Langkah 2]
3. Klik **"Login as Super Admin"**
4. Seharusnya berhasil! ✅

---

## 🔧 CARA 2: Via Supabase Dashboard (Lebih Mudah)

### **Langkah-langkah:**

1. Buka: https://app.supabase.com
2. Pilih project: **stywborxrxfullxmyycx**
3. Klik **Authentication** → **Users**
4. Cari user: **ekamamgif@gmail.com**
5. Klik pada user tersebut
6. Klik tombol **"Send password reset email"** ATAU **"Reset password"**
7. Jika ada opsi "Set password manually", gunakan itu
8. Set password baru (minimal 8 karakter)
9. **Catat password** yang Anda buat
10. Klik **"Save"** atau **"Update"**

---

## 📝 **Rekomendasi Password**

Gunakan password yang kuat dengan kriteria:
- ✅ Minimal 12 karakter
- ✅ Kombinasi huruf besar dan kecil
- ✅ Angka
- ✅ Simbol (!@#$%^&*)

**Contoh password kuat:**
```
SuperAdmin2024!@#
EkaAdmin#2024Secure
MyStr0ng!Pass2024
```

---

## 🐛 **TROUBLESHOOTING**

### **Problem 1: "Invalid login credentials" setelah set password**

**Solusi:**
```sql
-- Pastikan user ter-confirm
UPDATE auth.users
SET 
    confirmed_at = NOW(),
    email_confirmed_at = NOW(),
    confirmation_sent_at = NOW()
WHERE email = 'ekamamgif@gmail.com';
```

### **Problem 2: User banned**

**Cek status:**
```sql
SELECT 
    email,
    banned_until,
    deleted_at
FROM auth.users
WHERE email = 'ekamamgif@gmail.com';
```

**Unban jika perlu:**
```sql
UPDATE auth.users
SET banned_until = NULL
WHERE email = 'ekamamgif@gmail.com';
```

### **Problem 3: SQL Error "function crypt does not exist"**

**Solusi:** Gunakan Cara 2 (via Dashboard) karena extension `pgcrypto` mungkin belum aktif.

Atau aktifkan extension dulu:
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### **Problem 4: Masih tidak bisa login**

**Coba buat user baru:**
1. Buat user baru via Dashboard dengan email berbeda
2. Set role menjadi `super_admin`
3. Test login dengan user baru

---

## 📊 **Verifikasi Lengkap**

Setelah set password, jalankan query ini untuk cek semua:

```sql
-- Cek auth.users
SELECT 
    id,
    email,
    created_at,
    updated_at,
    confirmed_at,
    email_confirmed_at,
    last_sign_in_at,
    banned_until,
    deleted_at
FROM auth.users
WHERE email = 'ekamamgif@gmail.com';

-- Cek profiles
SELECT 
    id,
    email,
    name,
    role,
    is_profile_completed,
    tenant_id,
    created_at,
    updated_at
FROM public.profiles
WHERE email = 'ekamamgif@gmail.com';
```

**Expected Results:**

**auth.users:**
```
email: ekamamgif@gmail.com
confirmed_at: [timestamp]
email_confirmed_at: [timestamp]
banned_until: NULL
deleted_at: NULL
```

**profiles:**
```
email: ekamamgif@gmail.com
name: Super Administrator
role: super_admin
is_profile_completed: false
tenant_id: NULL
```

---

## 🎯 **Quick Reference**

### **Login URL:**
```
https://hyetal-unfiscally-voncile.ngrok-free.dev/super-admin/login
```

### **Credentials:**
```
Email:    ekamamgif@gmail.com
Password: [password yang Anda set]
```

### **SQL File:**
```
database/maintenance/set_password_ekamamgif.sql
```

---

## 🔒 **Security Checklist**

Setelah berhasil login:

- [ ] Ganti password dengan yang lebih kuat
- [ ] Jangan share password dengan siapapun
- [ ] Aktifkan 2FA jika tersedia
- [ ] Logout setelah selesai menggunakan
- [ ] Gunakan password manager untuk menyimpan password

---

## 📞 **Need Help?**

Jika masih ada masalah:
1. Cek console browser (F12) untuk error message
2. Cek Supabase Dashboard → Logs
3. Screenshot error dan share untuk debugging

---

## ✅ **Success Indicators**

Anda berhasil jika:
1. ✅ SQL query executed successfully (1 row updated)
2. ✅ Verification query menunjukkan `confirmed_at` ter-update
3. ✅ Login berhasil tanpa error
4. ✅ Redirect ke `/super-admin` dashboard

Good luck! 🚀
