import Link from "next/link";
import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createSessionClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 12;

export default async function HalamanAdmin({ searchParams }) {
  const params = await searchParams;
  const q = String(params.q || "").trim().slice(0, 100);
  const requestedPage = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
  const supabase = await createSessionClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/admin/login");

  let filteredCount = supabase.from("produk").select("id", { count: "exact", head: true });
  if (q) filteredCount = filteredCount.ilike("nama", `%${q}%`);
  const [countResult, totalResult, categoryResult, clickResult] = await Promise.all([
    filteredCount,
    supabase.from("produk").select("id", { count: "exact", head: true }),
    supabase.from("produk").select("kategori"),
    supabase.from("klik_pesan").select("produk_id").order("created_at", { ascending: false }).limit(1000),
  ]);
  const pages = Math.max(1, Math.ceil((countResult.count || 0) / PAGE_SIZE));
  const page = Math.min(requestedPage, pages);
  let listQuery = supabase.from("produk").select("*").order("urutan", { ascending: true }).order("id", { ascending: true });
  if (q) listQuery = listQuery.ilike("nama", `%${q}%`);
  let { data: daftarProduk, error } = await listQuery.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (error?.code === "42703" || error?.code === "PGRST204") {
    let legacyQuery = supabase.from("produk").select("*").order("id", { ascending: true });
    if (q) legacyQuery = legacyQuery.ilike("nama", `%${q}%`);
    const legacy = await legacyQuery.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
    daftarProduk = legacy.data;
    error = legacy.error;
  }

  const counts = (categoryResult.data || []).reduce((result, item) => {
    const key = item.kategori || "Tanpa kategori";
    result[key] = (result[key] || 0) + 1;
    return result;
  }, {});
  const clickCounts = (clickResult.data || []).reduce((result, click) => {
    result[click.produk_id] = (result[click.produk_id] || 0) + 1;
    return result;
  }, {});
  const topIds = Object.entries(clickCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topProductsResult = topIds.length ? await supabase.from("produk").select("id,nama").in("id", topIds.map(([id]) => id)) : { data: [] };
  const topProducts = topIds.map(([id, totalKlik]) => ({ ...(topProductsResult.data || []).find((item) => String(item.id) === id), totalKlik })).filter((item) => item.id);
  const pageUrl = (value) => `/admin?${new URLSearchParams({ ...(q ? { q } : {}), ...(value > 1 ? { page: String(value) } : {}) }).toString()}`;

  return <div className="flex flex-col gap-6 py-8">
    <NavAdmin />
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-extrabold">Dashboard produk</h1>
      <div className="flex flex-wrap gap-2"><Tombol href="/admin/export" varian="garis">Ekspor CSV</Tombol><Tombol href="/admin/impor" varian="garis">Impor CSV</Tombol><Tombol href="/admin/produk/baru">Tambah produk</Tombol></div>
    </div>

    <section aria-label="Ringkasan katalog" className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-garis bg-permukaan p-4"><p className="text-sm text-teks-lembut">Total produk</p><p className="text-2xl font-extrabold">{totalResult.count ?? 0}</p></div>
      <div className="rounded-xl border border-garis bg-permukaan p-4"><p className="text-sm font-bold">Produk per kategori</p>{Object.keys(counts).length ? <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-teks-lembut">{Object.entries(counts).map(([nama, jumlah]) => <li key={nama}>{nama}: {jumlah}</li>)}</ul> : <p className="mt-1 text-sm text-teks-lembut">Belum ada produk.</p>}</div>
    </section>

    <section aria-labelledby="produk-terlaris" className="rounded-xl border border-garis p-4">
      <h2 id="produk-terlaris" className="font-bold">5 produk terlaris</h2>
      {clickResult.error ? <p className="mt-2 text-sm text-teks-lembut">Jalankan migrasi-us-21-40.sql untuk melihat statistik.</p> : topProducts.length ? <ol className="mt-2 list-inside list-decimal space-y-1 text-sm">{topProducts.map((item) => <li key={item.id}>{item.nama} <span className="text-teks-lembut">— {item.totalKlik} klik pesan</span></li>)}</ol> : <p className="mt-2 text-sm text-teks-lembut">Belum ada data klik pesan WhatsApp.</p>}
    </section>

    <form action="/admin" method="get" className="flex max-w-lg gap-2">
      <input type="search" name="q" defaultValue={q} placeholder="Cari nama produk…" className="min-w-0 flex-1 rounded-lg border border-garis bg-latar px-3 py-2" />
      <button className="rounded-lg bg-utama px-4 py-2 font-semibold text-white">Cari</button>
    </form>
    {error ? <p role="alert" className="text-sm text-bahaya">Gagal memuat daftar produk.</p> : <TabelProduk daftarProduk={(daftarProduk || []).map((item) => ({ ...item, tersedia: item.tersedia ?? true }))} />}

    {pages > 1 && <nav aria-label="Paginasi produk admin" className="flex items-center justify-between">
      {page > 1 ? <Link href={pageUrl(page - 1)} className="rounded-lg border border-garis px-4 py-2 text-sm font-semibold">Sebelumnya</Link> : <span />}
      <span className="text-sm text-teks-lembut">Halaman {page} dari {pages}</span>
      {page < pages ? <Link href={pageUrl(page + 1)} className="rounded-lg border border-garis px-4 py-2 text-sm font-semibold">Berikutnya</Link> : <span />}
    </nav>}
  </div>;
}
