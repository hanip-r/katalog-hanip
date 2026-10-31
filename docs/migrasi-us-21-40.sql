-- Jalankan setelah migrasi-us-07-20.sql di Supabase SQL Editor.

create table if not exists public.kategori_produk (
  nama text primary key check (char_length(nama) between 1 and 80),
  created_at timestamptz not null default now()
);

insert into public.kategori_produk (nama)
select distinct kategori from public.produk where kategori is not null and btrim(kategori) <> ''
on conflict (nama) do nothing;

alter table public.kategori_produk enable row level security;
drop policy if exists "admin_kelola_kategori" on public.kategori_produk;
create policy "admin_kelola_kategori" on public.kategori_produk
  for all to authenticated using (true) with check (true);
grant select, insert, update, delete on public.kategori_produk to authenticated;

create table if not exists public.ulasan (
  id bigint generated always as identity primary key,
  produk_id bigint not null references public.produk(id) on delete cascade,
  nama text not null check (char_length(nama) between 1 and 80),
  rating smallint not null check (rating between 1 and 5),
  komentar text not null check (char_length(komentar) between 3 and 1000),
  tampil boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.ulasan enable row level security;
drop policy if exists "ulasan_publik_baca_aktif" on public.ulasan;
drop policy if exists "admin_kelola_ulasan" on public.ulasan;
create policy "ulasan_publik_baca_aktif" on public.ulasan
  for select to anon, authenticated using (tampil = true);
create policy "admin_kelola_ulasan" on public.ulasan
  for all to authenticated using (true) with check (true);
grant select on public.ulasan to anon, authenticated;
grant insert, update, delete on public.ulasan to authenticated, service_role;
grant usage, select on sequence public.ulasan_id_seq to authenticated, service_role;
create index if not exists ulasan_produk_tampil_waktu_idx on public.ulasan (produk_id, tampil, created_at desc);

create table if not exists public.klik_pesan (
  id bigint generated always as identity primary key,
  produk_id bigint not null references public.produk(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.klik_pesan enable row level security;
grant insert on public.klik_pesan to service_role;
grant usage, select on sequence public.klik_pesan_id_seq to service_role;
create index if not exists klik_pesan_produk_waktu_idx on public.klik_pesan (produk_id, created_at desc);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('foto-produk', 'foto-produk', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif'];

drop policy if exists "foto_produk_dapat_dilihat" on storage.objects;
create policy "foto_produk_dapat_dilihat" on storage.objects
  for select to anon, authenticated using (bucket_id = 'foto-produk');
