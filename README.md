# Aka Portfolio Website

Website portofolio profesional untuk Aka, dengan desain mewah, fitur interaktif, dan dukungan multibahasa.

## Fitur Utama

- **Desain Mewah**: Tampilan visual berkualitas tinggi dengan animasi halus
- **Interaktif**: Fitur-fitur interaktif seperti parallax, slider, dan efek partikel
- **Statistik Real-time**: Menampilkan informasi waktu, tanggal, jumlah pengunjung, dan status baterai
- **Dukungan Multibahasa**: Support bahasa Indonesia dan Inggris
- **Responsif**: Tampilan yang optimal di semua ukuran layar
- **Background Music**: Fitur musik latar dengan visualisasi audio

## Teknologi

- React + TypeScript
- Vite
- Express
- Framer Motion
- TailwindCSS
- i18next

## Cara Deploy ke Vercel

### Persiapan

1. Pastikan Anda memiliki akun [Vercel](https://vercel.com)
2. Fork atau clone repository ini ke GitHub Anda

### Perubahan pada package.json

Sebelum men-deploy ke Vercel, Anda perlu mengedit file `package.json` sebagai berikut:

```json
{
  "name": "aka-portfolio",
  "version": "1.0.0",
  "type": "module",
  "license": "MIT",
  "engines": {
    "node": "20.x"
  },
  "scripts": {
    "dev": "tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "node dist/index.js",
    "vercel-build": "npm run build",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  },
  // ... sisanya tetap sama
}
```

### Buat vercel.json

Buat file baru bernama `vercel.json` di root project dengan isi:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/dist/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### Deploy ke Vercel

1. Login ke akun Vercel
2. Klik tombol "Import Project"
3. Pilih "Import Git Repository" dan masukkan URL repo GitHub Anda
4. Pada halaman konfigurasi, atur:
   - **Framework Preset**: Other
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Klik "Deploy" dan tunggu hingga proses deploy selesai

### Troubleshooting

Jika mengalami masalah selama deployment:

1. Periksa log build di dashboard Vercel
2. Pastikan Node.js versi 20.x digunakan (dapat dikonfigurasi di settings project di Vercel)
3. Pastikan semua environment variables yang diperlukan sudah diatur di Vercel

## Pengembangan Lokal

1. Clone repository
2. Instal dependencies: `npm install`
3. Jalankan server development: `npm run dev`
4. Buka `http://localhost:5000` di browser

## Lisensi

MIT