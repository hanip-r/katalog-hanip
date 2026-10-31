"use client";

import { useActionState } from "react";

export function FormKategori({ action, initialName = "", label = "Tambah kategori" }) {
  const [state, formAction, pending] = useActionState(action, null);
  return <form action={formAction} className="flex flex-col gap-2">
    <label className="text-sm font-semibold">Nama kategori<input name="nama" defaultValue={initialName} required maxLength={80} className="mt-1 w-full rounded-lg border border-garis bg-latar px-3 py-2 text-base" /></label>
    {state?.error && <p role="alert" className="text-sm text-bahaya">{state.error}</p>}
    <button disabled={pending} className="self-start rounded-lg bg-utama px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Menyimpan…" : label}</button>
  </form>;
}

export function TombolHapusKategori({ action }) {
  const [state, formAction, pending] = useActionState(action, null);
  return <form action={formAction}>
    <button disabled={pending} className="rounded-lg border border-garis px-3 py-2 text-sm font-semibold text-bahaya">Hapus</button>
    {state?.error && <p role="alert" className="mt-1 text-xs text-bahaya">{state.error}</p>}
  </form>;
}
