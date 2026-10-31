-- Jalankan setelah migrasi-us-21-40.sql di Supabase SQL Editor.

alter table public.produk add column if not exists urutan integer not null default 0;

drop policy if exists "admin_baca_klik_pesan" on public.klik_pesan;
create policy "admin_baca_klik_pesan" on public.klik_pesan
  for select to authenticated using (true);
grant select on public.klik_pesan to authenticated;

create table if not exists public.banner_promo (
  id bigint generated always as identity primary key,
  judul text not null check (char_length(judul) between 1 and 120),
  teks text,
  gambar_url text,
  tautan text,
  aktif boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.banner_promo enable row level security;
drop policy if exists "banner_aktif_dapat_dibaca" on public.banner_promo;
drop policy if exists "admin_kelola_banner" on public.banner_promo;
create policy "banner_aktif_dapat_dibaca" on public.banner_promo
  for select to anon, authenticated using (aktif = true);
create policy "admin_kelola_banner" on public.banner_promo
  for all to authenticated using (true) with check (true);
grant select on public.banner_promo to anon, authenticated;
grant insert, update, delete on public.banner_promo to authenticated;
grant usage, select on sequence public.banner_promo_id_seq to authenticated;

create table if not exists public.pengaturan_toko (
  id smallint primary key default 1 check (id = 1),
  nama text not null,
  tagline text not null default '',
  nomor_whatsapp text not null check (nomor_whatsapp ~ '^[0-9]{8,15}$'),
  alamat text not null,
  jam_buka text not null,
  updated_at timestamptz not null default now()
);
insert into public.pengaturan_toko (id, nama, tagline, nomor_whatsapp, alamat, jam_buka)
values (1, 'Toko Hanif', 'Produk rumahan dari dapur dan perajin lokal, siap dipesan lewat WhatsApp.', '6281374812295', 'Jl. Daeng No. 13, Kota Batam, Kepulauan Riau Indonesia', 'Setiap hari, 08.00–20.00')
on conflict (id) do nothing;
alter table public.pengaturan_toko enable row level security;
drop policy if exists "pengaturan_toko_dibaca_publik" on public.pengaturan_toko;
drop policy if exists "admin_ubah_pengaturan_toko" on public.pengaturan_toko;
create policy "pengaturan_toko_dibaca_publik" on public.pengaturan_toko
  for select to anon, authenticated using (true);
create policy "admin_ubah_pengaturan_toko" on public.pengaturan_toko
  for update to authenticated using (true) with check (id = 1);
drop policy if exists "admin_tambah_pengaturan_toko" on public.pengaturan_toko;
create policy "admin_tambah_pengaturan_toko" on public.pengaturan_toko
  for insert to authenticated with check (id = 1);
grant select on public.pengaturan_toko to anon, authenticated;
grant insert, update on public.pengaturan_toko to authenticated;

create table if not exists public.log_aktivitas (
  id bigint generated always as identity primary key,
  admin_id uuid,
  admin_email text not null default '',
  aksi text not null check (aksi in ('tambah','ubah','hapus','impor')),
  produk_id bigint,
  nama_produk text not null default '',
  created_at timestamptz not null default now()
);
alter table public.log_aktivitas enable row level security;
drop policy if exists "admin_baca_log_aktivitas" on public.log_aktivitas;
drop policy if exists "admin_tulis_log_aktivitas" on public.log_aktivitas;
create policy "admin_baca_log_aktivitas" on public.log_aktivitas
  for select to authenticated using (true);
create policy "admin_tulis_log_aktivitas" on public.log_aktivitas
  for insert to authenticated with check (admin_id = auth.uid());
grant select, insert on public.log_aktivitas to authenticated;
grant usage, select on sequence public.log_aktivitas_id_seq to authenticated;
create index if not exists log_aktivitas_waktu_idx on public.log_aktivitas (created_at desc);

create table if not exists public.varian_produk (
  id bigint generated always as identity primary key,
  produk_id bigint not null references public.produk(id) on delete cascade,
  nama text not null check (char_length(nama) between 1 and 80),
  harga integer not null check (harga > 0),
  created_at timestamptz not null default now()
);
alter table public.varian_produk enable row level security;
drop policy if exists "varian_produk_dibaca_publik" on public.varian_produk;
drop policy if exists "admin_kelola_varian_produk" on public.varian_produk;
create policy "varian_produk_dibaca_publik" on public.varian_produk
  for select to anon, authenticated using (true);
create policy "admin_kelola_varian_produk" on public.varian_produk
  for all to authenticated using (true) with check (true);
grant select on public.varian_produk to anon, authenticated;
grant insert, update, delete on public.varian_produk to authenticated;
grant usage, select on sequence public.varian_produk_id_seq to authenticated;
create index if not exists varian_produk_parent_idx on public.varian_produk (produk_id, created_at);

create table if not exists public.ai_qna_request (
  id bigint generated always as identity primary key,
  produk_id bigint not null references public.produk(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.ai_qna_request enable row level security;
grant select, insert on public.ai_qna_request to service_role;
grant usage, select on sequence public.ai_qna_request_id_seq to service_role;
create index if not exists ai_qna_product_time_idx on public.ai_qna_request (produk_id, created_at desc);
