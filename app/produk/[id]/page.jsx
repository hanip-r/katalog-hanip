import Link from "next/link";
import { notFound } from "next/navigation";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import GaleriProduk from "@/components/GaleriProduk";
import KartuProduk from "@/components/KartuProduk";
import { createServerClient } from "@/lib/supabase";
import { formatRupiah } from "@/lib/format";
import AksiProduk from "@/components/AksiProduk";
import BagikanProduk from "@/components/BagikanProduk";
import CatatProdukDibuka from "@/components/CatatProdukDibuka";
import FormUlasan from "@/components/FormUlasan";
import { getBaseUrl } from "@/lib/base-url";
import { slugKategori } from "@/lib/kategori";
import AsistenProduk from "@/components/AsistenProduk";

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
  if (!produk) return { title: "Produk tidak ditemukan" };
  const base = getBaseUrl();
  const image = produk.foto_url ? new URL(produk.foto_url, base).toString() : new URL("/icons/icon-512.png", base).toString();
  const title = `${produk.nama} | Katalog ${produk.kategori || "Produk"}`;
  const description = produk.deskripsi || `Lihat ${produk.nama} dan pesan melalui WhatsApp.`;
  return { title, description, openGraph: { title, description, type: "website", images: [{ url: image, alt: produk.nama }] } };
}

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;
  let produk = null;
  let terkait = [];
  let ulasan = [];
  let variants = [];

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
      const { data: daftarVarian, error: variantError } = await supabase.from("varian_produk").select("id,nama,harga").eq("produk_id", produk.id).order("created_at");
      if (!variantError) variants = daftarVarian || [];
      const { data: daftarUlasan, error: reviewError } = await supabase
        .from("ulasan")
        .select("id,nama,rating,komentar,created_at")
        .eq("produk_id", produk.id)
        .eq("tampil", true)
        .order("created_at", { ascending: false });
      if (!reviewError) ulasan = daftarUlasan || [];
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
      <CatatProdukDibuka produk={produk} />
      <article className="grid gap-8 py-8 md:grid-cols-2 md:py-12">
        <GaleriProduk produk={produk} />
        <div className="flex flex-col items-start gap-4">
          <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">Kembali ke katalog</Link>
          {produk.kategori && <Link href={`/kategori/${slugKategori(produk.kategori)}`} className="text-sm text-teks-lembut hover:text-utama">{produk.kategori}</Link>}
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{produk.nama}</h1>
          {produk.badge && <span className="rounded-full bg-utama px-3 py-1 text-xs font-bold text-white">{produk.badge}</span>}
          <div className="rounded-md bg-harga-latar px-3 py-2 text-xl font-bold text-harga">
            {produk.harga_diskon ? <><span className="mr-2 text-sm font-medium text-teks-lembut line-through">{formatRupiah(produk.harga)}</span>{formatRupiah(produk.harga_diskon)}</> : formatRupiah(produk.harga)}
          </div>
          <p className="max-w-prose whitespace-pre-line leading-relaxed text-teks-lembut">{produk.deskripsi}</p>
          <AksiProduk produk={produk} />
          <BagikanProduk nama={produk.nama} />
          <TombolWhatsApp produk={produk} variants={variants} />
        </div>
      </article>

      <section className="flex flex-col gap-4 border-t border-garis py-8" aria-labelledby="judul-ulasan">
        <h2 id="judul-ulasan" className="text-xl font-bold">Ulasan pelanggan</h2>
        {ulasan.length > 0 ? <>
          <p className="text-sm text-teks-lembut">Rata-rata {((ulasan.reduce((sum, item) => sum + item.rating, 0) / ulasan.length)).toFixed(1)} dari 5 ({ulasan.length} ulasan)</p>
          <ul className="flex max-w-2xl flex-col gap-3">{ulasan.map((item) => <li key={item.id} className="rounded-xl border border-garis p-4"><p className="font-semibold">{item.nama} <span aria-label={`${item.rating} dari 5 bintang`} className="text-harga">{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</span></p><p className="mt-2 whitespace-pre-line text-sm text-teks-lembut">{item.komentar}</p></li>)}</ul>
        </> : <p className="text-sm text-teks-lembut">Belum ada ulasan yang ditampilkan.</p>}
        <FormUlasan produkId={produk.id} />
      </section>

      <section className="pb-8"><AsistenProduk produkId={produk.id} /></section>

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
