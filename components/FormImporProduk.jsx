"use client";

import { useActionState } from "react";
import { imporProdukCsv } from "@/app/admin/actions";

export default function FormImporProduk() {
  const [state, formAction, pending] = useActionState(imporProdukCsv, null);
  return <div className="flex max-w-2xl flex-col gap-4">
    <form action={formAction} className="flex flex-col gap-3 rounded-xl border border-garis p-4">
      <label className="flex flex-col gap-2 text-sm font-semibold">File CSV<input type="file" name="file" accept=".csv,text/csv" required className="rounded-lg border border-garis bg-latar p-2" /></label>
      <p className="text-xs text-teks-lembut">Header wajib: nama,harga. Opsional: kategori,deskripsi,foto_url,harga_diskon,tersedia,foto_galeri,badge,urutan. Foto galeri dipisahkan dengan tanda |.</p>
      {state?.error && <p role="alert" className="text-sm text-bahaya">{state.error}</p>}
      <button disabled={pending} className="self-start rounded-lg bg-utama px-4 py-2.5 text-sm font-semibold text-white">{pending ? "Mengimpor…" : "Impor produk"}</button>
    </form>
    {state && !state.error && <section aria-live="polite" className="rounded-xl border border-garis p-4">
      <h2 className="font-bold">Hasil impor</h2><p className="mt-1 text-sm">Berhasil disimpan: {state.berhasil || 0} baris</p><p className="text-sm">Gagal: {state.gagal?.length || 0} baris</p>
      {state.gagal?.length > 0 && <ul className="mt-3 flex flex-col gap-1 text-sm text-bahaya">{state.gagal.map((item, index) => <li key={`${item.baris}-${index}`}>Baris {item.baris}: {item.pesan}</li>)}</ul>}
    </section>}
  </div>;
}
