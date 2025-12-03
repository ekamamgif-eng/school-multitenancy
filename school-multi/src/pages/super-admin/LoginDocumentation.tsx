import React from 'react'
import { Shield, Key, Users, CheckCircle, XCircle, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react'
import './LoginDocumentation.scss'

const LoginDocumentation: React.FC = () => {
    return (
        <div className="login-docs">
            <div className="login-docs__header">
                <BookOpen size={32} />
                <div>
                    <h1>Login Procedures Documentation</h1>
                    <p>Panduan lengkap prosedur login untuk setiap role user</p>
                </div>
            </div>

            {/* Quick Navigation */}
            <nav className="login-docs__nav">
                <a href="#super-admin">Super Admin</a>
                <a href="#admin">Admin</a>
                <a href="#users">User Biasa</a>
                <a href="#summary">Ringkasan</a>
                <a href="#troubleshooting">Troubleshooting</a>
            </nav>

            {/* Super Admin Section */}
            <section id="super-admin" className="login-docs__section">
                <div className="section-header">
                    <Shield size={28} />
                    <h2>1. Super Administrator</h2>
                </div>

                <div className="info-card">
                    <h3>🎯 Karakteristik</h3>
                    <ul>
                        <li>Role: <code>super_admin</code></li>
                        <li>Akses penuh ke seluruh sistem</li>
                        <li>Dapat membuat dan mengelola tenant/sekolah</li>
                        <li>Dapat membuat admin baru</li>
                    </ul>
                </div>

                <div className="info-card">
                    <h3>📍 URL Login</h3>
                    <div className="url-box">
                        <code>/auth/super-admin</code>
                    </div>
                </div>

                <div className="info-card info-card--warning">
                    <h3>🔑 Metode Login</h3>
                    <p><strong>HANYA Email & Password</strong></p>
                    <p className="text-muted">Google OAuth TIDAK tersedia untuk Super Admin</p>
                </div>

                <div className="procedure-steps">
                    <h3>📝 Prosedur Login</h3>
                    <ol>
                        <li>
                            <strong>Buka halaman login Super Admin</strong>
                            <div className="code-block">
                                <code>https://your-domain.com/auth/super-admin</code>
                            </div>
                        </li>
                        <li>
                            <strong>Masukkan kredensial</strong>
                            <ul>
                                <li>Email: <code>superadmin@example.com</code></li>
                                <li>Password: <code>[password yang telah dibuat]</code></li>
                            </ul>
                        </li>
                        <li>
                            <strong>Klik "Login as Super Admin"</strong>
                        </li>
                        <li>
                            <strong>Sistem akan:</strong>
                            <ul className="check-list">
                                <li><CheckCircle size={16} /> Validasi kredensial</li>
                                <li><CheckCircle size={16} /> Cek role di database</li>
                                <li><CheckCircle size={16} /> Redirect ke <code>/super-admin</code></li>
                            </ul>
                        </li>
                    </ol>
                </div>

                <div className="info-card info-card--important">
                    <h3>⚠️ Catatan Penting</h3>
                    <ul>
                        <li>Akun Super Admin harus dibuat manual di Supabase Dashboard</li>
                        <li>Role <code>super_admin</code> harus di-set di tabel <code>profiles</code></li>
                        <li><strong>Super Admin TIDAK bisa login dengan Google OAuth</strong> - hanya Email/Password</li>
                    </ul>
                </div>

                <div className="sql-guide">
                    <h3>🔧 Cara Membuat Super Admin Baru</h3>
                    <div className="step-box">
                        <h4>1. Buat User di Authentication</h4>
                        <ul>
                            <li>Buka Supabase Dashboard → Authentication → Users</li>
                            <li>Klik "Add user" atau "Invite user"</li>
                            <li>Masukkan email dan password</li>
                            <li>✅ Centang "Auto Confirm User"</li>
                        </ul>
                    </div>
                    <div className="step-box">
                        <h4>2. Set Role di Database</h4>
                        <div className="code-block">
                            <pre>{`-- Update role menjadi super_admin
UPDATE public.profiles 
SET role = 'super_admin' 
WHERE email = 'superadmin@example.com';

-- Verify
SELECT id, email, role FROM public.profiles 
WHERE email = 'superadmin@example.com';`}</pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Admin Section */}
            <section id="admin" className="login-docs__section">
                <div className="section-header">
                    <Key size={28} />
                    <h2>2. Admin (Tenant Administrator)</h2>
                </div>

                <div className="info-card">
                    <h3>🎯 Karakteristik</h3>
                    <ul>
                        <li>Role: <code>admin</code></li>
                        <li>Mengelola satu sekolah/tenant tertentu</li>
                        <li>Dibuat oleh Super Admin</li>
                        <li>Akses ke fitur administrasi sekolah</li>
                    </ul>
                </div>

                <div className="info-card">
                    <h3>📍 URL Login</h3>
                    <div className="url-box">
                        <code>/admin/login</code>
                    </div>
                </div>

                <div className="info-card info-card--warning">
                    <h3>🔑 Metode Login</h3>
                    <p><strong>HANYA Email & Password</strong></p>
                    <p className="text-muted">Google OAuth TIDAK tersedia untuk admin</p>
                </div>

                <div className="procedure-steps">
                    <h3>📝 Prosedur Login</h3>
                    <ol>
                        <li>Buka halaman <code>/admin/login</code></li>
                        <li>Masukkan email dan password</li>
                        <li>Klik "Sign in as Admin"</li>
                        <li>
                            <strong>Sistem akan melakukan validasi ketat:</strong>
                            <div className="validation-box">
                                <div className="validation-item validation-item--success">
                                    <CheckCircle size={18} />
                                    <span>Jika role = <code>admin</code> atau <code>super_admin</code> → Login berhasil</span>
                                </div>
                                <div className="validation-item validation-item--error">
                                    <XCircle size={18} />
                                    <span>Jika role lainnya → Logout paksa + error message</span>
                                </div>
                            </div>
                        </li>
                        <li>Redirect ke <code>/tenant/onboarding</code></li>
                    </ol>
                </div>
            </section>

            {/* User Section */}
            <section id="users" className="login-docs__section">
                <div className="section-header">
                    <Users size={28} />
                    <h2>3. User Biasa (Guru/Staff/Ortu/Siswa)</h2>
                </div>

                <div className="info-card">
                    <h3>🎯 Karakteristik</h3>
                    <ul>
                        <li>Role: <code>user</code> / <code>registered_user</code></li>
                        <li>User biasa dengan akses terbatas</li>
                        <li>Harus melengkapi profil setelah login pertama kali</li>
                    </ul>
                </div>

                <div className="info-card">
                    <h3>📍 URL Login</h3>
                    <div className="url-box">
                        <code>/login</code>
                    </div>
                </div>

                <div className="info-card info-card--success">
                    <h3>🔑 Metode Login</h3>
                    <ol>
                        <li><strong>Google OAuth</strong> (Primary - Recommended)</li>
                        <li><strong>Email & Password</strong> (Alternative)</li>
                    </ol>
                </div>

                <div className="procedure-steps">
                    <h3>📝 Prosedur Login dengan Google</h3>
                    <ol>
                        <li>Buka halaman <code>/login</code></li>
                        <li>Klik tombol "Login dengan Google"</li>
                        <li>Pilih akun Google Anda</li>
                        <li>
                            <strong>Sistem akan redirect ke <code>/auth/google-callback</code></strong>
                            <div className="flow-diagram">
                                <div className="flow-step">
                                    <span>Cek Role</span>
                                    <ArrowRight size={16} />
                                </div>
                                <div className="flow-step">
                                    <span>Cek Kelengkapan Profil</span>
                                    <ArrowRight size={16} />
                                </div>
                                <div className="flow-step">
                                    <span>Redirect</span>
                                </div>
                            </div>
                        </li>
                        <li>
                            <strong>Jika profil belum lengkap:</strong>
                            <ul>
                                <li>Redirect paksa ke <code>/complete-profile</code></li>
                                <li>User HARUS mengisi: Full Name, Phone Number, Address</li>
                                <li>Klik "Save and Continue"</li>
                                <li>Redirect ke <code>/</code> (Home/Dashboard)</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Jika profil sudah lengkap:</strong>
                            <ul>
                                <li>Langsung redirect ke <code>/</code> (Home/Dashboard)</li>
                            </ul>
                        </li>
                    </ol>
                </div>
            </section>

            {/* Summary Table */}
            <section id="summary" className="login-docs__section">
                <div className="section-header">
                    <h2>📊 Ringkasan Alur Login</h2>
                </div>

                <div className="summary-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Role</th>
                                <th>URL Login</th>
                                <th>Metode</th>
                                <th>Validasi Role</th>
                                <th>Redirect</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Super Admin</strong></td>
                                <td><code>/auth/super-admin</code></td>
                                <td><span className="badge badge--warning">Email/Password ONLY</span></td>
                                <td><CheckCircle size={16} /> Cek <code>super_admin</code></td>
                                <td><code>/super-admin</code></td>
                            </tr>
                            <tr>
                                <td><strong>Admin</strong></td>
                                <td><code>/admin/login</code></td>
                                <td><span className="badge badge--warning">Email/Password ONLY</span></td>
                                <td><CheckCircle size={16} /> Cek <code>admin</code>, tolak lainnya</td>
                                <td><code>/tenant/onboarding</code></td>
                            </tr>
                            <tr>
                                <td><strong>User Biasa</strong></td>
                                <td><code>/login</code></td>
                                <td><span className="badge badge--success">Google (Primary) + Email/Password</span></td>
                                <td><XCircle size={16} /> Tidak ada validasi khusus</td>
                                <td><code>/complete-profile</code> atau <code>/</code></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Troubleshooting */}
            <section id="troubleshooting" className="login-docs__section">
                <div className="section-header">
                    <AlertTriangle size={28} />
                    <h2>🛠️ Troubleshooting</h2>
                </div>

                <div className="troubleshoot-item">
                    <h3>❌ "Invalid login credentials"</h3>
                    <div className="cause-solution">
                        <div>
                            <h4>Penyebab:</h4>
                            <ul>
                                <li>Email/password salah</li>
                                <li>User belum terdaftar</li>
                                <li>Akun dibuat via Google (tidak punya password)</li>
                            </ul>
                        </div>
                        <div>
                            <h4>Solusi:</h4>
                            <ul>
                                <li>Cek kredensial</li>
                                <li>Jika akun dibuat via Google, gunakan Google login</li>
                                <li>Reset password jika lupa</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="troubleshoot-item">
                    <h3>❌ "Access denied. This login is restricted to administrators."</h3>
                    <div className="cause-solution">
                        <div>
                            <h4>Penyebab:</h4>
                            <ul>
                                <li>Login di <code>/admin/login</code> tapi role bukan <code>admin</code></li>
                            </ul>
                        </div>
                        <div>
                            <h4>Solusi:</h4>
                            <ul>
                                <li>User biasa harus login di <code>/login</code></li>
                                <li>Cek role di database</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="troubleshoot-item">
                    <h3>❌ "Could not find the 'address' column"</h3>
                    <div className="cause-solution">
                        <div>
                            <h4>Penyebab:</h4>
                            <ul>
                                <li>Database belum diupdate dengan kolom baru</li>
                            </ul>
                        </div>
                        <div>
                            <h4>Solusi:</h4>
                            <ul>
                                <li>Jalankan migration <code>03_add_profile_fields.sql</code></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="login-docs__footer">
                <p>Terakhir diupdate: 3 Desember 2024 | Versi: 1.0.0</p>
                <p className="text-muted">Dokumentasi ini hanya dapat diakses oleh Super Administrator</p>
            </footer>
        </div>
    )
}

export default LoginDocumentation
