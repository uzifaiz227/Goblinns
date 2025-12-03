# Cara Deploy Website Goblinns ke Publik

Cara termudah untuk men-deploy aplikasi Next.js adalah menggunakan **Vercel** (pembuat Next.js).

## Prasyarat

1.  Akun GitHub (atau GitLab/Bitbucket).
2.  Akun Vercel (bisa login dengan GitHub).

## Langkah-langkah

### 1. Push Kode ke GitHub

Jika Anda belum memiliki repository GitHub:

1.  Buat repository baru di GitHub.
2.  Jalankan perintah berikut di terminal (ganti URL dengan URL repository Anda):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/USERNAME/REPO_NAME.git
    git push -u origin main
    ```

### 2. Deploy ke Vercel

1.  Buka [Vercel Dashboard](https://vercel.com/dashboard).
2.  Klik **"Add New..."** -> **"Project"**.
3.  Pilih repository GitHub yang baru saja Anda buat.
4.  Klik **"Import"**.

### 3. Konfigurasi Environment Variables

Di halaman konfigurasi project di Vercel:

1.  Buka bagian **Environment Variables**.
2.  Tambahkan variable berikut (agar API Key aman dan tidak hardcoded):

    - **Key**: `NEXT_PUBLIC_GEMINI_API_KEY` (atau sesuaikan dengan kode Anda jika ingin mengubahnya)
    - **Value**: Masukkan API Key Gemini Anda (contoh: `AIzaSy...`)

    > **Catatan**: Saat ini kode masih menggunakan hardcoded key di `src/lib/gemini.ts`. Sangat disarankan untuk mengubahnya agar menggunakan `process.env`.

3.  Klik **"Deploy"**.

### 4. Selesai!

Tunggu proses build selesai. Vercel akan memberikan URL publik (contoh: `goblinns.vercel.app`) yang bisa diakses siapa saja.

## Mengamankan API Key

Saat ini file `src/lib/gemini.ts` berisi API Key secara langsung. Ini **TIDAK AMAN** jika repository Anda bersifat publik.
Saya akan membantu mengubah kode tersebut agar membaca dari Environment Variable.
