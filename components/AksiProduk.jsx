"use client";

import { useStore } from "@/components/AppState";

export default function AksiProduk({ produk }) {
  const { addToCart, favorites, toggleFavorite, compare, toggleCompare } = useStore();
  const isFavorite = favorites.some((item) => String(item.id) === String(produk.id));
  const isCompared = compare.some((item) => String(item.id) === String(produk.id));

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={() => addToCart(produk)} className="rounded-lg border border-garis px-3 py-2 text-sm font-semibold hover:border-utama">Tambah ke keranjang</button>
      <button type="button" onClick={() => toggleFavorite(produk)} aria-pressed={isFavorite} className="rounded-lg border border-garis px-3 py-2 text-sm font-semibold hover:border-utama">{isFavorite ? "♥ Favorit" : "♡ Favorit"}</button>
      <button type="button" onClick={() => { if (!toggleCompare(produk)) window.alert("Maksimal dua produk dapat dibandingkan."); }} aria-pressed={isCompared} className="rounded-lg border border-garis px-3 py-2 text-sm font-semibold hover:border-utama">{isCompared ? "Hapus dari bandingkan" : "Bandingkan"}</button>
    </div>
  );
}
