# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-02 Detail produk

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-03 Pesan via WhatsApp

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-04 Login admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-05 Ganti password

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.

### US-07 sampai US-20

**Prompt:** Kerjakan fitur bonus US-07 sampai US-20 dan siapkan perubahan untuk di-push.

**Hasil:** Daftar produk admin kini membaca Supabase; tambah, ubah, dan hapus produk memakai Server Action yang memeriksa sesi admin. Katalog mendukung pencarian, filter kategori, urutan database, dan paginasi. Detail produk menampilkan foto tambahan, produk terkait, harga promo, badge, pilihan jumlah, dan menyembunyikan produk yang tidak tersedia. Manifest, ikon, dan service worker PWA ditambahkan. Form admin dapat meminta deskripsi dari Gemini melalui server.

**Perbaikan:** Ditambahkan migrasi kolom `tersedia`, `foto_galeri`, `harga_diskon`, dan `badge` untuk proyek Supabase yang tabelnya sudah ada. Tambahkan `GEMINI_API_KEY` di environment server Vercel agar fitur AI aktif. Katalog dan detail tetap kompatibel sementara dengan skema lama sampai migrasi dijalankan.
