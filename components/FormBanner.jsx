"use client";

import { useActionState } from "react";
import Input from "@/components/Input";

export default function FormBanner({ action, banner = {} }) {
  const [state, formAction, pending] = useActionState(action, null);
  return <form action={formAction} className="flex max-w-xl flex-col gap-3 rounded-xl border border-garis p-4">
    <Input label="Judul banner" name="judul" defaultValue={banner.judul || ""} required maxLength={120} />
    <Input label="Teks banner" name="teks" textarea defaultValue={banner.teks || ""} maxLength={500} />
    <Input label="URL gambar" name="gambar_url" defaultValue={banner.gambar_url || ""} placeholder="https://... atau /produk/nama-file.svg" />
    <Input label="Tautan saat banner ditekan" name="tautan" defaultValue={banner.tautan || ""} placeholder="https://... atau /kategori/..." />
    <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="aktif" defaultChecked={banner.aktif ?? true} />Tampilkan di beranda</label>
    {state?.error && <p role="alert" className="text-sm text-bahaya">{state.error}</p>}
    <button disabled={pending} className="self-start rounded-lg bg-utama px-4 py-2.5 text-sm font-semibold text-white">{pending ? "Menyimpan…" : "Simpan banner"}</button>
  </form>;
}
