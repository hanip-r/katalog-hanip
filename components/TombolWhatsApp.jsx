"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);
  const harga = Number(produk.harga_diskon || produk.harga);
  const pesan = `Halo, saya ingin memesan ${produk.nama} sebanyak ${jumlah} buah. Harga satuan ${formatRupiah(harga)}, total ${formatRupiah(harga * jumlah)}.`;
  const url = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;
  function catatKlik() {
    fetch("/api/klik-pesan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: produk.id }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Jumlah
        <input aria-label="Jumlah produk" type="number" min="1" max="99" step="1" value={jumlah} onChange={(event) => setJumlah(Math.min(99, Math.max(1, Number(event.target.value) || 1)))} className="w-24 rounded-lg border border-garis bg-latar px-3 py-2.5 text-base" />
      </label>
      <a href={url} onClick={catatKlik} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto">
        Pesan via WhatsApp
      </a>
    </div>
  );
}
