"use client";

import Link from "next/link";
import { useStore } from "@/components/AppState";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";

export default function HalamanKeranjang() {
  const { cartItems, setQuantity, removeFromCart, clearCart } = useStore();
  const total = cartItems.reduce((sum, item) => sum + Number(item.harga_diskon || item.harga) * item.quantity, 0);
  const pesan = ["Halo, saya ingin memesan:", ...cartItems.map((item) => `- ${item.nama} x${item.quantity} — ${formatRupiah(Number(item.harga_diskon || item.harga) * item.quantity)}`), `Total: ${formatRupiah(total)}`].join("\n");
  const whatsappUrl = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

  return (
    <section className="flex flex-col gap-5 py-8">
      <h1 className="text-2xl font-extrabold">Keranjang</h1>
      {cartItems.length === 0 ? <p className="text-teks-lembut">Keranjang masih kosong. <Link href="/" className="underline">Lihat katalog</Link></p> : <>
        <ul className="flex flex-col divide-y divide-garis rounded-xl border border-garis">
          {cartItems.map((item) => <li key={item.id} className="flex flex-wrap items-center gap-4 p-4">
            <img src={item.foto_url || "/produk/kopi.svg"} alt="" className="h-16 w-16 rounded-lg object-cover" />
            <div className="min-w-32 flex-1"><Link href={`/produk/${item.id}`} className="font-semibold hover:text-utama">{item.nama}</Link><p className="text-sm text-teks-lembut">{formatRupiah(Number(item.harga_diskon || item.harga))} / buah</p></div>
            <label className="flex items-center gap-2 text-sm">Jumlah <input aria-label={`Jumlah ${item.nama}`} type="number" min="1" max="99" value={item.quantity} onChange={(event) => setQuantity(item.id, Number(event.target.value))} className="w-20 rounded-lg border border-garis bg-latar px-2 py-1.5" /></label>
            <button type="button" onClick={() => removeFromCart(item.id)} className="text-sm font-semibold text-bahaya underline">Hapus</button>
          </li>)}
        </ul>
        <p className="self-end text-lg font-bold">Total {formatRupiah(total)}</p>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => { fetch("/api/klik-pesan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productIds: cartItems.map((item) => item.id) }), keepalive: true }).catch(() => {}); clearCart(); }} className="self-start rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap">Pesan semua via WhatsApp</a>
      </>}
    </section>
  );
}
