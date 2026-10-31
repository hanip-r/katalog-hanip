"use client";

import Link from "next/link";
import { useStore } from "@/components/AppState";
import { formatRupiah } from "@/lib/format";

export default function HalamanBandingkan() {
  const { compare, removeCompare } = useStore();
  return <section className="flex flex-col gap-5 py-8">
    <h1 className="text-2xl font-extrabold">Bandingkan produk</h1>
    {compare.length === 0 ? <p className="text-teks-lembut">Pilih produk dari katalog untuk dibandingkan. Maksimal dua produk.</p> : <div className="grid gap-4 sm:grid-cols-2">
      {compare.map((item) => <article key={item.id} className="flex flex-col gap-3 rounded-xl border border-garis p-4">
        <img src={item.foto_url || "/produk/kopi.svg"} alt={item.nama} className="aspect-square w-full rounded-lg object-cover" />
        <h2 className="text-lg font-bold">{item.nama}</h2>
        <p><span className="font-semibold">Kategori:</span> {item.kategori || "—"}</p>
        <p><span className="font-semibold">Harga:</span> {formatRupiah(Number(item.harga_diskon || item.harga))}</p>
        <p className="text-sm text-teks-lembut">{item.deskripsi}</p>
        <div className="flex gap-3"><Link href={`/produk/${item.id}`} className="text-sm font-semibold underline">Lihat produk</Link><button type="button" onClick={() => removeCompare(item.id)} className="text-sm font-semibold text-bahaya underline">Hapus</button></div>
      </article>)}
    </div>}
  </section>;
}
