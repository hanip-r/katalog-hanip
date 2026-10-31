"use client";

import { useActionState } from "react";
import { kirimUlasan } from "@/app/admin/actions";

export default function FormUlasan({ produkId }) {
  const [state, formAction, pending] = useActionState(kirimUlasan, null);
  return <form action={formAction} className="flex max-w-xl flex-col gap-3 rounded-xl border border-garis p-4">
    <h3 className="font-bold">Tulis ulasan</h3>
    {state?.success ? <p role="status" className="text-sm text-utama">{state.success}</p> : <>
      <input type="hidden" name="produk_id" value={produkId} />
      <label className="text-sm font-semibold">Nama<input name="nama" required maxLength={80} className="mt-1 w-full rounded-lg border border-garis bg-latar px-3 py-2" /></label>
      <label className="text-sm font-semibold">Rating<select name="rating" defaultValue="5" className="mt-1 block rounded-lg border border-garis bg-latar px-3 py-2"><option value="5">5 — Sangat puas</option><option value="4">4 — Puas</option><option value="3">3 — Cukup</option><option value="2">2 — Kurang</option><option value="1">1 — Tidak puas</option></select></label>
      <label className="text-sm font-semibold">Komentar<textarea name="komentar" required minLength={3} maxLength={1000} rows={4} className="mt-1 w-full rounded-lg border border-garis bg-latar px-3 py-2" /></label>
      <label aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      {state?.error && <p role="alert" className="text-sm text-bahaya">{state.error}</p>}
      <button disabled={pending} className="self-start rounded-lg bg-utama px-4 py-2.5 text-sm font-semibold text-white">{pending ? "Mengirim…" : "Kirim ulasan"}</button>
    </>}
  </form>;
}
