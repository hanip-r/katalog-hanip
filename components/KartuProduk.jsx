import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import AksiProduk from "@/components/AksiProduk";
import { slugKategori } from "@/lib/kategori";

export default function KartuProduk({ produk }) {
  const gambar = produk.foto_url || produk.foto_galeri?.[0] || "/produk/kopi.svg";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar">
      <Link href={`/produk/${produk.id}`} className="relative block">
        <img src={gambar} alt={produk.nama} className="aspect-square w-full bg-permukaan object-cover" />
        {(produk.badge || produk.harga_diskon) && (
          <span className="absolute left-2 top-2 rounded-full bg-utama px-2.5 py-1 text-xs font-bold text-white">
            {produk.badge || "Promo"}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        {produk.kategori && <Link href={`/kategori/${slugKategori(produk.kategori)}`} className="text-xs text-teks-lembut hover:text-utama">{produk.kategori}</Link>}
        <Link href={`/produk/${produk.id}`} className="font-semibold leading-snug group-hover:text-utama">{produk.nama}</Link>
        <div className="mt-auto self-start rounded-md bg-harga-latar px-2 py-1 text-sm font-bold text-harga">
          {produk.harga_diskon ? <><span className="mr-2 text-xs font-medium text-teks-lembut line-through">{formatRupiah(produk.harga)}</span>{formatRupiah(produk.harga_diskon)}</> : formatRupiah(produk.harga)}
        </div>
        <AksiProduk produk={produk} />
      </div>
    </article>
  );
}
