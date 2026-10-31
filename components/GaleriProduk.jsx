"use client";

import { useState } from "react";

export default function GaleriProduk({ produk }) {
  const gambar = [...new Set([produk.foto_url, ...(Array.isArray(produk.foto_galeri) ? produk.foto_galeri : [])].filter(Boolean))];
  const [terpilih, setTerpilih] = useState(gambar[0] || "/produk/kopi.svg");

  return (
    <div className="flex flex-col gap-3">
      <img src={terpilih} alt={produk.nama} className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover" />
      {gambar.length > 1 && (
        <div className="flex gap-2 overflow-x-auto" aria-label="Foto produk lainnya">
          {gambar.map((url, index) => (
            <button key={url} type="button" onClick={() => setTerpilih(url)} aria-label={`Tampilkan foto ${index + 1}`} aria-pressed={terpilih === url} className={`shrink-0 overflow-hidden rounded-lg border ${terpilih === url ? "border-utama" : "border-garis"}`}>
              <img src={url} alt="" className="h-16 w-16 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
