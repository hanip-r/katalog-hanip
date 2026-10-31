-- Jalankan sekali di Supabase SQL Editor untuk proyek yang tabel produk-nya sudah ada.
alter table public.produk add column if not exists tersedia boolean not null default true;
alter table public.produk add column if not exists foto_galeri text[] not null default '{}';
alter table public.produk add column if not exists harga_diskon integer;
alter table public.produk add column if not exists badge text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'produk_harga_diskon_valid'
      and conrelid = 'public.produk'::regclass
  ) then
    alter table public.produk
      add constraint produk_harga_diskon_valid
      check (harga_diskon is null or (harga_diskon > 0 and harga_diskon < harga));
  end if;
end $$;
