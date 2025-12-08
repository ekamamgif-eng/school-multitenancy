# 🔐 READY TO RUN: Set Password untuk ekamamgif@gmail.com

## ✅ Password yang Akan Di-set

```
Email:    ekamamgif@gmail.com
Password: EkaAdmin#Secure2024
```

---

## 🚀 LANGKAH-LANGKAH (Ikuti dengan Teliti)

### **STEP 1: Buka Supabase Dashboard**

1. Buka browser
2. Kunjungi: **https://app.supabase.com**
3. Login dengan akun Supabase Anda
4. Pilih project: **stywborxrxfullxmyycx**

### **STEP 2: Buka SQL Editor**

1. Di sidebar kiri, klik **"SQL Editor"**
2. Klik tombol **"New query"** (biasanya di pojok kanan atas)
3. Akan muncul editor kosong

### **STEP 3: Copy SQL Script**

1. Buka file: `database/maintenance/set_password_ekamamgif_READY.sql`
2. Copy **HANYA** bagian SQL berikut:

```sql
UPDATE auth.users
SET 
    encrypted_password = crypt('EkaAdmin#Secure2024', gen_salt('bf')),
    updated_at = NOW(),
    confirmation_sent_at = NOW(),
    confirmed_at = NOW(),
    email_confirmed_at = NOW()
WHERE email = 'ekamamgif@gmail.com';
```

### **STEP 4: Paste dan Jalankan**

1. Paste SQL yang sudah di-copy ke SQL Editor
2. Klik tombol **"Run"** atau tekan **Ctrl+Enter**
3. Tunggu beberapa detik

### **STEP 5: Cek Hasil**

Anda akan melihat salah satu dari hasil berikut:

#### ✅ **SUKSES:**
```
Success. 1 row updated
```
**→ Lanjut ke STEP 6**

#### ❌ **ERROR: "function crypt does not exist"**

Jalankan SQL ini terlebih dahulu:
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

Lalu **ulangi STEP 4** (jalankan UPDATE password lagi)

#### ❌ **ERROR lainnya**

Screenshot error dan lanjut ke **TROUBLESHOOTING** di bawah

### **STEP 6: Verifikasi (Opsional tapi Disarankan)**

Jalankan SQL ini untuk memastikan password ter-set:

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
- `confirmed_at`: timestamp hari ini
- `email_confirmed_at`: timestamp hari ini
- `updated_at`: timestamp hari ini

### **STEP 7: Test Login**

1. Buka browser baru (atau incognito/private mode)
2. Kunjungi: **https://hyetal-unfiscally-voncile.ngrok-free.dev/super-admin/login**
3. Masukkan:
   - **Email**: `ekamamgif@gmail.com`
   - **Password**: `EkaAdmin#Secure2024`
4. Klik **"Login as Super Admin"**

#### ✅ **SUKSES:**
- Redirect ke `/super-admin` dashboard
- Anda berhasil login! 🎉

#### ❌ **GAGAL:**
- Lihat **TROUBLESHOOTING** di bawah

---

## 🐛 TROUBLESHOOTING

### **Problem 1: "Invalid login credentials"**

**Solusi A:** Pastikan user ter-confirm

```sql
UPDATE auth.users
SET 
    confirmed_at = NOW(),
    email_confirmed_at = NOW(),
    confirmation_sent_at = NOW()
WHERE email = 'ekamamgif@gmail.com';
```

**Solusi B:** Cek apakah user di-ban

```sql
SELECT 
    email,
    banned_until,
    deleted_at
FROM auth.users
WHERE email = 'ekamamgif@gmail.com';
```

Jika `banned_until` ada nilai, jalankan:
```sql
UPDATE auth.users
SET banned_until = NULL
WHERE email = 'ekamamgif@gmail.com';
```

**Solusi C:** Set ulang password via Dashboard

1. Supabase Dashboard → Authentication → Users
2. Cari: ekamamgif@gmail.com
3. Klik user → "Reset password"
4. Set password: `EkaAdmin#Secure2024`

### **Problem 2: "function crypt does not exist"**

**Solusi:**
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

Lalu jalankan ulang UPDATE password

### **Problem 3: "0 rows updated"**

**Penyebab:** Email salah atau user tidak ada

**Solusi:** Cek apakah user ada
```sql
SELECT * FROM auth.users WHERE email = 'ekamamgif@gmail.com';
```

Jika tidak ada, user perlu dibuat dulu via Dashboard

### **Problem 4: Redirect loop atau error setelah login**

**Solusi:** Clear browser cache dan cookies, lalu coba lagi

---

## 📋 QUICK COPY-PASTE

### **SQL untuk Set Password:**
```sql
UPDATE auth.users
SET 
    encrypted_password = crypt('EkaAdmin#Secure2024', gen_salt('bf')),
    updated_at = NOW(),
    confirmation_sent_at = NOW(),
    confirmed_at = NOW(),
    email_confirmed_at = NOW()
WHERE email = 'ekamamgif@gmail.com';
```

### **SQL untuk Verifikasi:**
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

### **Login URL:**
```
https://hyetal-unfiscally-voncile.ngrok-free.dev/super-admin/login
```

### **Credentials:**
```
Email:    ekamamgif@gmail.com
Password: EkaAdmin#Secure2024
```

---

## ✅ SUCCESS CHECKLIST

Centang setiap langkah yang berhasil:

- [ ] SQL executed successfully (1 row updated)
- [ ] Verification query menunjukkan `confirmed_at` ter-update
- [ ] Login page terbuka tanpa error
- [ ] Credentials dimasukkan dengan benar
- [ ] Login berhasil
- [ ] Redirect ke `/super-admin` dashboard

---

## 🔒 SECURITY REMINDER

**SETELAH BERHASIL LOGIN:**

1. ⚠️ **GANTI PASSWORD** segera dari dashboard
2. ⚠️ **HAPUS** file `set_password_ekamamgif_READY.sql` (berisi password plaintext)
3. ⚠️ **JANGAN SHARE** password dengan siapapun
4. ✅ Gunakan password manager untuk menyimpan password baru

---

## 📞 NEED HELP?

Jika masih ada masalah setelah mengikuti semua langkah:

1. Screenshot error message
2. Cek browser console (F12) untuk error
3. Cek Supabase Dashboard → Logs
4. Share screenshot untuk debugging

---

## 🎯 EXPECTED TIMELINE

- STEP 1-3: 2 menit
- STEP 4-5: 30 detik
- STEP 6: 30 detik
- STEP 7: 1 menit

**Total: ~4 menit** ⏱️

Good luck! 🚀
