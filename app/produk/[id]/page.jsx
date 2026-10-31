import Link from "next/link";
import { notFound } from "next/navigation";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import GaleriProduk from "@/components/GaleriProduk";
import KartuProduk from "@/components/KartuProduk";
import { createServerClient } from "@/lib/supabase";
import { formatRupiah } from "@/lib/format";

export const dynamic = "force-dynamic";

function missingTersediaColumn(error) {
  return error?.code === "42703" || error?.code === "PGRST204";
}

async function ambilProduk(id) {
  const supabase = createServerClient();
  let { data, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .eq("tersedia", true)
    .maybeSingle();
  if (missingTersediaColumn(error)) {
    const legacyResult = await supabase.from("produk").select("*").eq("id", id).maybeSingle();
    data = legacyResult.data ? { ...legacyResult.data, tersedia: true } : null;
    error = legacyResult.error;
  }
  return error ? null : data;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const produk = await ambilProduk(id).catch(() => null);
  return produk ? { title: `${produk.nama} | Katalog ${produk.kategori || "Produk"}`, description: produk.deskripsi || `Lihat ${produk.nama} dan pesan melalui WhatsApp.` } : { title: "Produk tidak ditemukan" };
}

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;
  let produk = null;
  let terkait = [];

  try {
    const supabase = createServerClient();
    let { data, error } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .eq("tersedia", true)
      .maybeSingle();
    if (missingTersediaColumn(error)) {
      const legacyResult = await supabase.from("produk").select("*").eq("id", id).maybeSingle();
      data = legacyResult.data ? { ...legacyResult.data, tersedia: true } : null;
      error = legacyResult.error;
    }
    if (!error && data) {
      produk = data;
      if (produk.kategori) {
        let { data: rekomendasi, error: relatedError } = await supabase
          .from("produk")
          .select("*")
          .eq("kategori", produk.kategori)
          .eq("tersedia", true)
          .neq("id", produk.id)
          .order("created_at", { ascending: false })
          .limit(4);
        if (relatedError) {
          const legacyRelated = await supabase
            .from("produk")
            .select("*")
            .eq("kategori", produk.kategori)
            .neq("id", produk.id)
            .order("created_at", { ascending: false })
            .limit(4);
          rekomendasi = legacyRelated.data;
        }
        terkait = rekomendasi || [];
      }
    }
  } catch {
    // Produk tidak ditampilkan bila data tidak bisa diverifikasi dari database.
  }

  if (!produk) notFound();

  return (
    <>
      <article className="grid gap-8 py-8 md:grid-cols-2 md:py-12">
        <GaleriProduk produk={produk} />
        <div className="flex flex-col items-start gap-4">
          <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">Kembali ke katalog</Link>
          {produk.kategori && <Link href={`/?kategori=${encodeURIComponent(produk.kategori)}`} className="text-sm text-teks-lembut hover:text-utama">{produk.kategori}</Link>}
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{produk.nama}</h1>
          {produk.badge && <span className="rounded-full bg-utama px-3 py-1 text-xs font-bold text-white">{produk.badge}</span>}
          <div className="rounded-md bg-harga-latar px-3 py-2 text-xl font-bold text-harga">
            {produk.harga_diskon ? <><span className="mr-2 text-sm font-medium text-teks-lembut line-through">{formatRupiah(produk.harga)}</span>{formatRupiah(produk.harga_diskon)}</> : formatRupiah(produk.harga)}
          </div>
          <p className="max-w-prose whitespace-pre-line leading-relaxed text-teks-lembut">{produk.deskripsi}</p>
          <TombolWhatsApp produk={produk} />
        </div>
      </article>

      {terkait.length > 0 && (
        <section className="flex flex-col gap-4 pb-12" aria-labelledby="produk-terkait">
          <h2 id="produk-terkait" className="text-xl font-bold">Produk lain di kategori {produk.kategori}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {terkait.map((item) => <KartuProduk key={item.id} produk={item} />)}
          </div>
        </section>
      )}
    </>
  );
}
