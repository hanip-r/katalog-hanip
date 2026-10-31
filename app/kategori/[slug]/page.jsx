import Link from "next/link";
import { notFound } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import { createServerClient } from "@/lib/supabase";
import { slugKategori } from "@/lib/kategori";

export const dynamic = "force-dynamic";

async function getCategoryBySlug(slug) {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("produk").select("kategori").not("kategori", "is", null);
  if (error) return null;
  return [...new Set((data || []).map((item) => item.kategori).filter(Boolean))].find((nama) => slugKategori(nama) === slug) || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const nama = await getCategoryBySlug(slug).catch(() => null);
  return nama ? { title: `Kategori ${nama}`, description: `Lihat semua produk kategori ${nama}.` } : { title: "Kategori tidak ditemukan" };
}

export default async function HalamanKategori({ params }) {
  const { slug } = await params;
  const nama = await getCategoryBySlug(slug).catch(() => null);
  if (!nama) notFound();
  const supabase = createServerClient();
  let query = supabase.from("produk").select("*").eq("kategori", nama).eq("tersedia", true).order("urutan", { ascending: true }).order("id", { ascending: true }).limit(100);
  let { data, error } = await query;
  if (error) {
    const legacy = await supabase.from("produk").select("*").eq("kategori", nama).order("id", { ascending: true }).limit(100);
    data = legacy.data;
    error = legacy.error;
  }
  return <section className="flex flex-col gap-5 py-8">
    <Link href="/" className="self-start text-sm text-teks-lembut underline">Kembali ke katalog</Link>
    <h1 className="text-2xl font-extrabold">Kategori {nama}</h1>
    {error ? <p role="alert" className="text-sm text-bahaya">Produk kategori gagal dimuat.</p> : data?.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-3">{data.map((produk) => <KartuProduk key={produk.id} produk={produk} />)}</div> : <p className="text-sm text-teks-lembut">Belum ada produk di kategori ini.</p>}
  </section>;
}
