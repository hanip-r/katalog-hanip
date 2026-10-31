import Link from "next/link";
import { toko } from "@/lib/toko";

export const metadata = { title: `Tentang ${toko.nama}`, description: `Profil, alamat, jam buka, dan kontak ${toko.nama}.` };

export default function HalamanTentang() {
  return <article className="flex max-w-2xl flex-col gap-5 py-10">
    <h1 className="text-3xl font-extrabold">Tentang {toko.nama}</h1>
    <p className="text-lg leading-relaxed text-teks-lembut">{toko.tagline}</p>
    <dl className="grid gap-4 rounded-2xl border border-garis bg-permukaan p-5">
      <div><dt className="font-bold">Alamat</dt><dd className="text-teks-lembut">{toko.alamat}</dd></div>
      <div><dt className="font-bold">Jam buka</dt><dd className="text-teks-lembut">{toko.jamBuka}</dd></div>
      <div><dt className="font-bold">WhatsApp</dt><dd><a href={`https://wa.me/${toko.nomorWhatsApp}`} className="text-utama underline">Hubungi toko lewat WhatsApp</a></dd></div>
    </dl>
    <Link href="/" className="self-start font-semibold text-utama underline">Kembali ke katalog</Link>
  </article>;
}
