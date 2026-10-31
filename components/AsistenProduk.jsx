"use client";

import { useActionState } from "react";
import { tanyaProduk } from "@/app/admin/actions";

export default function AsistenProduk({ produkId }) {
  const [state, formAction, pending] = useActionState(tanyaProduk, null);
  return <section className="flex max-w-2xl flex-col gap-3 rounded-xl border border-garis p-4" aria-labelledby="judul-asisten">
    <div><h2 id="judul-asisten" className="font-bold">Tanya tentang produk</h2><p className="text-sm text-teks-lembut">Asisten menjawab berdasarkan informasi produk ini.</p></div>
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="produk_id" value={produkId} />
      <label aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label htmlFor={`pertanyaan-${produkId}`} className="sr-only">Pertanyaan</label>
      <textarea id={`pertanyaan-${produkId}`} name="pertanyaan" required minLength={3} maxLength={500} rows={3} placeholder="Contoh: Berapa ukurannya?" className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base" />
      <p className="text-xs text-teks-lembut">Maksimal 500 karakter; maksimal 5 pertanyaan per menit untuk produk ini.</p>
      <button disabled={pending} className="self-start rounded-lg bg-utama px-4 py-2.5 text-sm font-semibold text-white">{pending ? "Menyiapkan jawaban…" : "Tanyakan"}</button>
    </form>
    {state?.jawaban && <div role="status" className="whitespace-pre-line rounded-lg bg-permukaan p-3 text-sm">{state.jawaban}</div>}
    {state?.error && <p role="alert" className="text-sm text-bahaya">{state.error}</p>}
  </section>;
}
