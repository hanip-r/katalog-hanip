"use client";

import Link from "next/link";
import { toko } from "@/lib/toko";
import { useStore } from "@/components/AppState";

export default function Header() {
  const { cartItems, favorites, compare, theme, toggleTheme } = useStore();
  const jumlahKeranjang = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="border-b border-garis bg-latar">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-utama">{toko.nama}</Link>
        <nav aria-label="Navigasi utama" className="flex flex-wrap items-center gap-3 text-sm font-semibold">
          <Link href="/tentang" className="hover:text-utama">Tentang</Link>
          <Link href="/favorit" className="hover:text-utama">Favorit ({favorites.length})</Link>
          <Link href="/bandingkan" className="hover:text-utama">Bandingkan ({compare.length})</Link>
          <Link href="/keranjang" className="hover:text-utama">Keranjang ({jumlahKeranjang})</Link>
          <button type="button" onClick={toggleTheme} aria-label="Ganti tema" className="rounded-lg border border-garis px-2.5 py-1.5 hover:border-utama">{theme === "dark" ? "☀️" : "🌙"}</button>
        </nav>
      </div>
    </header>
  );
}
