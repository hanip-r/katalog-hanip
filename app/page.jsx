import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import FilterKatalog from "@/components/FilterKatalog";
import { DaftarTerakhirDilihat } from "@/components/KartuDaftarLocal";
import { toko } from "@/lib/toko";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
const JUMLAH_PER_HALAMAN = 12;

function halamanUrl(page, params) {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.kategori) query.set("kategori", params.kategori);
  if (params.urutan) query.set("urutan", params.urutan);
  if (page > 1) query.set("page", String(page));
  const search = query.toString();
  return search ? `/?${search}` : "/";
}

export default async function HalamanKatalog({ searchParams }) {
  const params = await searchParams;
  const query = String(params.q || "").trim().slice(0, 100);
  const kategoriTerpilih = String(params.kategori || "").slice(0, 80);
  const urutan = ["terbaru", "termurah", "termahal"].includes(params.urutan) ? params.urutan : "terbaru";
  const halaman = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
  let daftarProduk = [];
  let kategori = [];
  let jumlahHalaman = 1;
  let pesanError = false;

  try {
    const supabase = createServerClient();
    const [kategoriResult, produkResult] = await Promise.all([
      supabase.from("produk").select("kategori").not("kategori", "is", null),
      (async () => {
        const queryProduk = async (filterTersedia) => {
          let request = supabase.from("produk").select("*", { count: "exact" });
          if (filterTersedia) request = request.eq("tersedia", true);
          if (query) request = request.ilike("nama", `%${query}%`);
          if (kategoriTerpilih) request = request.eq("kategori", kategoriTerpilih);
          const column = urutan === "termurah" || urutan === "termahal" ? "harga" : "created_at";
          const ascending = urutan === "termurah";
          return request
            .order(column, { ascending })
            .order("id", { ascending: true })
            .range((halaman - 1) * JUMLAH_PER_HALAMAN, halaman * JUMLAH_PER_HALAMAN - 1);
        };

        let result = await queryProduk(true);
        if (result.error) {
          // Jaga katalog tetap berfungsi bila migrasi kolom bonus belum dijalankan.
          result = await queryProduk(false);
          if (!result.error) result.data = (result.data || []).map((item) => ({ ...item, tersedia: true }));
        }
        return result;
      })(),
    ]);

    if (produkResult.error) {
      pesanError = true;
    } else {
      daftarProduk = produkResult.data || [];
      jumlahHalaman = Math.max(1, Math.ceil((produkResult.count || 0) / JUMLAH_PER_HALAMAN));
      kategori = [...new Set((kategoriResult.data || []).map((item) => item.kategori).filter(Boolean))].sort((a, b) => a.localeCompare(b, "id"));
    }
  } catch {
    pesanError = true;
  }

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{toko.nama}</h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5 pb-8">
        <h2 id="judul-produk" className="text-xl font-bold">Produk kami</h2>
        <FilterKatalog kategori={kategori} query={query} filterKategori={kategoriTerpilih} urutan={urutan} />

        {pesanError ? (
          <p role="alert" className="rounded-lg border border-garis bg-permukaan p-4 text-sm text-bahaya">Gagal memuat produk. Coba lagi nanti.</p>
        ) : daftarProduk.length === 0 ? (
          <p className="text-teks-lembut">Belum ada produk yang cocok dengan pencarian ini.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => <KartuProduk key={produk.id} produk={produk} />)}
          </div>
        )}

        {jumlahHalaman > 1 && (
          <nav aria-label="Halaman katalog" className="flex items-center justify-between gap-4 pt-3">
            {halaman > 1 ? <Link href={halamanUrl(halaman - 1, { q: query, kategori: kategoriTerpilih, urutan })} className="rounded-lg border border-garis px-4 py-2 text-sm font-semibold hover:border-utama">Sebelumnya</Link> : <span />}
            <span className="text-sm text-teks-lembut">Halaman {Math.min(halaman, jumlahHalaman)} dari {jumlahHalaman}</span>
            {halaman < jumlahHalaman ? <Link href={halamanUrl(halaman + 1, { q: query, kategori: kategoriTerpilih, urutan })} className="rounded-lg border border-garis px-4 py-2 text-sm font-semibold hover:border-utama">Berikutnya</Link> : <span />}
          </nav>
        )}
      </section>
      <DaftarTerakhirDilihat />
    </>
  );
}
