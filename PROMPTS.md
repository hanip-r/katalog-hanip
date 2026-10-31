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

### US-21 sampai US-40

**Prompt:** Lengkapi story bonus US-21 sampai US-40 dan push implementasinya.

**Hasil:** Ditambahkan keranjang persisten dan pesan banyak produk, halaman tentang, bagikan produk, favorit, tema gelap, Open Graph, sitemap/robots, loading, upload Supabase Storage, dashboard ringkasan, CRUD kategori, toggle produk, pencarian dan paginasi admin, validasi per field, ekspor CSV, terakhir dilihat, perbandingan produk, ulasan dengan moderasi, serta pencatatan klik WhatsApp.

**Perbaikan:** Fitur membutuhkan migrasi `docs/migrasi-us-21-40.sql` untuk tabel kategori, ulasan, klik pesan dan bucket Storage. Upload memakai bucket publik `foto-produk`; tulis file hanya dilakukan Server Action setelah pemeriksaan admin.

### US-41 sampai US-50

**Prompt:** Implementasikan story bonus US-41 sampai US-50 dan push.

**Hasil:** Dashboard merangkum produk terlaris dari klik WhatsApp; admin dapat mengelola banner, pengaturan toko, akun admin, log aktivitas, impor CSV, urutan produk, dan varian harga. Pengunjung mendapat halaman kategori khusus serta asisten tanya jawab produk dengan batas panjang dan pembatasan permintaan di server.

**Perbaikan:** Jalankan `docs/migrasi-us-41-50.sql` untuk kolom urutan serta tabel banner, pengaturan, log, varian, dan pembatasan AI. Pengelolaan akun memakai Supabase Auth Admin API di server; `GEMINI_API_KEY` tetap rahasia di environment server.
