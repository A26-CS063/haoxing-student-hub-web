# Haoxing Student Hub (Frontend)

Kerangka frontend untuk capstone Asah 2026 tim A26-CS063. Stack: Vite, React, TypeScript, Tailwind CSS v4, shadcn/ui, React Router, React Hook Form + Zod.

Cakupan saat ini: **login, penjagaan rute, dan menu sesuai peran (admin dan pemilik)**. Halaman lain masih kerangka kosong.

## Menjalankan

Butuh Node.js 20.19 atau lebih baru.

```bash
npm install
cp .env.example .env
npm run dev
```

Buka http://localhost:5173. Perintah lain: `npm run typecheck`, `npm run build`, `npm run preview`.

## Panduan desain

Warna: maroon `#54131E`, krem `#FFF9F2`, beige `#DCD4C0`, peach `#FFB992`, arang `#282828`. Huruf: Outfit (judul, Semibold dan Medium) dan Nunito Sans (isi, Bold dan Regular), dipasang lewat paket `@fontsource-variable`. Semua token ada di `src/index.css`.

## Akun demo (hanya `VITE_AUTH_MODE=mock`)

| Email | Kata sandi | Peran |
|---|---|---|
| admin@haoxing.test | Admin123! | Admin |
| pemilik@haoxing.test | Pemilik123! | Pemilik |
| nonaktif@haoxing.test | Nonaktif123! | Akun nonaktif (ditolak) |

Akun ini hanya ada di kode untuk pengembangan lokal. Jangan dipakai di staging atau produksi.

## Perilaku yang sudah ada

| Kebutuhan | Cara kerjanya |
|---|---|
| Hanya pengguna terdaftar yang bisa masuk | `ProtectedRoute` mengarahkan ke `/login` bila belum ada sesi. Email tidak terdaftar dan kata sandi salah memakai pesan yang sama agar daftar akun tidak bocor. |
| Menu sesuai peran | Sidebar dibuat dari `APP_ROUTES` di `src/routes/routeConfig.tsx`, difilter berdasarkan peran. |
| Halaman dibatasi peran | `RoleRoute` menampilkan halaman 403 bila peran tidak cocok (mis. pemilik membuka `/dokumen`). |
| Sesi kedaluwarsa otomatis (FR-01) | `AuthContext` menjadwalkan logout saat `expiresAt` tercapai dan menampilkan pesan "Sesi berakhir". |
| Kembali ke halaman tujuan | Setelah login, pengguna diarahkan ke halaman yang tadi dibuka. |
| Pemilik hanya membaca (FR-02) | Halaman Siswa dan Tindak lanjut menampilkan lencana "Hanya baca" untuk pemilik. Tombol ubah data nanti harus disembunyikan untuk peran ini. |

## Peran dan menu

| Menu | Admin | Pemilik |
|---|---|---|
| Beranda | ya | ya |
| Data siswa | ya | ya (baca saja) |
| Tindak lanjut | ya | ya (baca saja) |
| Asisten AI | ya | ya |
| Dokumen aturan | ya | tidak |
| Aturan tindak lanjut | ya | tidak |

## Struktur

```
src/
  components/
    ui/            # komponen shadcn (button, input, label, card, alert, badge)
    layout/        # AppLayout, Sidebar
    PlaceholderPage.tsx
  context/         # AuthContext: sesi, login, logout, kedaluwarsa
  lib/             # utils (cn), roles (label dan deskripsi peran)
  pages/           # satu berkas per halaman
  routes/          # routeConfig (sumber kebenaran), ProtectedRoute, RoleRoute
  services/auth/   # authService (antarmuka), mock, api, sessionStore
  types/auth.ts
```

## Tugas umum

**Menambah halaman:** buat berkas di `src/pages/`, lalu tambah satu baris di `APP_ROUTES` (path, label, ikon, peran, komponen). Menu dan penjaga rute ikut otomatis.

**Menambah peran:** ubah tipe `Role` di `src/types/auth.ts`, lalu isi `ROLE_LABEL` dan `ROLE_DESCRIPTION` di `src/lib/roles.ts`.

**Menambah komponen shadcn:** `components.json` sudah disiapkan.

```bash
npx shadcn@latest add table dialog dropdown-menu select sonner
```

## Menyambung ke backend

1. Samakan kontrak login dengan FS-1 (endpoint, bentuk respons, kode error).
2. Sesuaikan `src/services/auth/apiAuthService.ts`. Asumsi awal: `POST /auth/login` mengembalikan `access_token`, `expires_in`, dan `user { id, email, full_name, role }`.
3. Ubah `.env`: `VITE_AUTH_MODE=api` dan `VITE_API_URL=...`.
4. Untuk Supabase Auth: panggil `supabase.auth.signInWithPassword`, lalu ambil `role` dari tabel `profiles` dan petakan ke `Session`. Antarmuka `AuthService` tidak perlu berubah.
5. Kirim `Authorization: Bearer <accessToken>` di setiap request API (buat satu klien fetch bersama).

## Catatan keamanan

- **Pembatasan di frontend hanya soal tampilan.** Penegakan akses sebenarnya harus di backend (RBAC) dan RLS database, sesuai PRD bagian 13.9. Pengguna yang mengubah isi localStorage tetap tidak boleh bisa membaca atau menulis data.
- Peran harus datang dari server, bukan dari token yang dibuat klien.
- Sesi disimpan di `localStorage` agar sederhana untuk prototipe. Untuk produksi, pertimbangkan cookie `httpOnly` dari backend.
- Jangan commit berkas `.env`.

## Langkah berikutnya yang disarankan

1. Kontrak API login disepakati dengan FS-1, lalu `apiAuthService` disambungkan.
2. Tes otomatis untuk `ProtectedRoute` dan `RoleRoute` (Vitest + Testing Library): tanpa sesi ke `/login`, pemilik di `/dokumen` melihat 403, admin melihat semua menu.
3. Isi halaman Data siswa (FR-10 sampai FR-16).

## Layanan AI

Frontend hanya memanggil backend Express (`VITE_API_URL`), tidak pernah memanggil layanan AI (FastAPI) langsung.

| Fitur | Endpoint backend | Tempat di frontend |
|---|---|---|
| Tanya jawab program | `POST /ai/faq` | `src/pages/AiAssistantPage.tsx` |
| Rekomendasi level | `POST /ai/predict-level` (admin) | `src/components/ai/LevelRecommendation.tsx`, saat ini di halaman Asisten AI untuk uji coba. Pindahkan ke form pre-test siswa nanti. |

Klien ada di `src/services/ai/aiService.ts`. Dalam mode `mock`, jawabannya tiruan. Modul backend yang melayani endpoint ini ada di `haoxing-backend-ai-module`.
