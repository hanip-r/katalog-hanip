"use client";

import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import { useStore } from "@/components/AppState";

export function DaftarFavorit() {
  const { favorites } = useStore();
  return <Daftar items={favorites} kosong="Kamu belum menyimpan produk favorit." />;
}

export function DaftarTerakhirDilihat() {
  const { recent } = useStore();
  return recent.length > 0 ? <section className="flex flex-col gap-4 py-8"><h2 className="text-xl font-bold">Terakhir dilihat</h2><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{recent.slice(0, 4).map((item) => <KartuProduk key={item.id} produk={item} />)}</div></section> : null;
}

function Daftar({ items, kosong }) {
  return items.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{items.map((item) => <KartuProduk key={item.id} produk={item} />)}</div> : <p className="text-teks-lembut">{kosong} <Link href="/" className="underline">Jelajahi katalog</Link></p>;
}
