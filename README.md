# Mini Project Web App - Skill Test PTBITS

Aplikasi web management user yang dibangun dengan React, Vite, dan Tailwind CSS sebagai bagian dari skill test PT BITS 2025.

## Teknologi yang Digunakan

### Frontend

- **React 19.2.0** - Library JavaScript untuk membangun user interface
- **Vite 7.2.4** - Build tool modern yang cepat
- **React Router DOM 7.11.0** - Routing untuk navigasi antar halaman
- **Tailwind CSS 3.4.19** - Utility-first CSS framework untuk styling
- **Lucide React 0.562.0** - Icon library modern dan ringan

### Backend/API

- **DummyJSON API** - Mock API untuk data users (<https://dummyjson.com>)

### Development Tools

- **ESLint** - Linting untuk code quality
- **PostCSS & Autoprefixer** - Processing CSS

## 📦 Instalasi

### Prasyarat

- Node.js (versi 18 atau lebih baru)
- npm atau yarn

### Langkah Instalasi

1. Clone repository

```bash
git clone https://github.com/gamastronger/Skill-Test-Refa.git
cd Skill-Test-Refa
```

1. Install dependencies

```bash
npm install
```

1. Jalankan development server

```bash
npm run dev
```

1. Buka browser dan akses `http://localhost:5173`

### Build untuk Production

```bash
npm run build
```

### Preview build production

```bash
npm run preview
```

## Fitur-Fitur yang Diimplementasikan

### 1. Authentication

- **Login** dengan akun dummy (username: `emilys`, password: `emilyspass`)
- **Register** untuk pendaftaran akun baru
- **Protected Routes** - Halaman yang memerlukan autentikasi
- Session management dengan localStorage

### 2. User Management

- **List Users** dengan tampilan card yang rapi
- **Create User** - Tambah user baru dengan form lengkap (personal info, address, company)
- **View User Detail** - Lihat informasi lengkap user
- **Edit User** - Update data user
- **Delete User** - Hapus user dari list

### 3. Filtering & Sorting

- **Search/Filter** - Cari user berdasarkan nama
- **Sort By** - Urutkan user berdasarkan:
  - First Name
- Toggle ascending/descending order

### 4. Pagination

- Tampilan 15 user per halaman
- Navigasi antar halaman dengan button
- Total hingga 50 user dari API

### 5. Profile Management

- **View Profile** - Lihat profil user yang sedang login
- **Edit Profile** - Update informasi pribadi, kontak, dan perusahaan
- **Photo Upload** - Upload foto profil (dalam development)

### 6. UI/UX Features

- **Responsive Sidebar Navigation**
  - Desktop: Fixed sidebar di kiri
  - Mobile: Hamburger menu dengan overlay
- **Header Bar** - Menampilkan nama user yang sedang login
- **Clean Design** - Menggunakan color palette biru profesional
- **Loading States** - Indicator loading untuk operasi async
- **Error Handling** - Pesan error yang informatif

## 📁 Struktur Folder

```src/
├── components/          # Reusable components
│   ├── ui/             # UI primitives (Button, Input, Field)
│   ├── Sidebar.jsx
│   ├── HeaderBar.jsx
│   ├── UserCard.jsx
│   ├── UserList.jsx
│   ├── UserFilters.jsx
│   └── UserCreateForm.jsx
├── features/           # Feature modules
│   └── auth/          # Authentication logic
├── hook/              # Custom React hooks
├── layouts/           # Layout components
├── lib/               # Utilities & API client
├── pages/             # Page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Users.jsx
│   └── UserProfile.jsx
└── services/          # API services
```

## Color Palette

- Primary 900: `#0F2854` (Dark Blue)
- Primary 700: `#1C4D8D` (Medium Blue)
- Primary 500: `#4988C4` (Light Blue)
- Primary 200: `#BDE8F5` (Very Light Blue)

## Test Account

Untuk login, gunakan akun dummy berikut:

- **Username:** `emilys`
- **Password:** `emilyspass`

## Catatan Penting

1. Data user disimpan di localStorage untuk simulasi CRUD yang lebih realistis
2. Perubahan data (create, update, delete) akan bertahan selama session browser
3. Aplikasi menggunakan DummyJSON API sebagai backend mock
4. Semua operasi CRUD memiliki fallback ke local storage jika API gagal

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build untuk production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Developer

**Refa Setyagama Abdillah**  
Skill Test - PT BITS Indonesia 2025
