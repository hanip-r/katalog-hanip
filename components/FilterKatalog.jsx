"use client";

export default function FilterKatalog({ kategori, query = "", filterKategori = "", urutan = "terbaru" }) {
  return (
    <form action="/" method="get" className="grid gap-3 rounded-xl border border-garis bg-permukaan p-3 sm:grid-cols-[1fr_180px_180px_auto]">
      <label className="sr-only" htmlFor="cari-produk">Cari nama produk</label>
      <input id="cari-produk" name="q" type="search" defaultValue={query} placeholder="Cari produk…" className="min-w-0 rounded-lg border border-garis bg-latar px-3 py-2 text-sm" />
      <label className="sr-only" htmlFor="filter-kategori">Kategori</label>
      <select id="filter-kategori" name="kategori" defaultValue={filterKategori} className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm">
        <option value="">Semua kategori</option>
        {kategori.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <label className="sr-only" htmlFor="urutan">Urutkan produk</label>
      <select id="urutan" name="urutan" defaultValue={urutan} className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm">
        <option value="terbaru">Terbaru</option>
        <option value="termurah">Termurah</option>
        <option value="termahal">Termahal</option>
      </select>
      <button type="submit" className="rounded-lg bg-utama px-4 py-2 text-sm font-semibold text-white hover:bg-utama-gelap">Terapkan</button>
    </form>
  );
}
