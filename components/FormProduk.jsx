"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { buatDeskripsiAI } from "@/app/admin/actions";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

export default function FormProduk({ produk = {}, labelTombol, action }) {
  const [state, formAction, pending] = useActionState(action, null);
  const [aiState, aiAction, aiPending] = useActionState(buatDeskripsiAI, null);
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi || "");
  const formRef = useRef(null);
  const sudahSubmit = Boolean(state?.values);

  useEffect(() => {
    if (aiState?.description) setDeskripsi(aiState.description);
  }, [aiState]);

  const value = (name) => state?.values?.[name] ?? produk[name] ?? "";

  return (
    <form ref={formRef} action={formAction} className="flex max-w-xl flex-col gap-4">
      {state?.error && <p role="alert" className="rounded-lg bg-permukaan p-3 text-sm text-bahaya">{state.error}</p>}
      <Input label="Nama produk" name="nama" defaultValue={value("nama")} required maxLength={120} />
      <Input label="Harga normal (Rp)" name="harga" type="number" min="1" step="1" defaultValue={value("harga")} required />
      <Input label="Harga promo (opsional)" name="harga_diskon" type="number" min="1" step="1" defaultValue={value("harga_diskon")} />
      <Input label="Kategori" name="kategori" defaultValue={value("kategori")} maxLength={80} />
      <Input label="Link foto utama" name="foto_url" placeholder="https://... atau /produk/nama-file.svg" defaultValue={value("foto_url")} />
      <Input label="Link foto tambahan (satu per baris)" name="foto_galeri" textarea rows={3} defaultValue={Array.isArray(value("foto_galeri")) ? value("foto_galeri").join("\n") : value("foto_galeri")} />
      <div className="flex flex-col gap-2">
        <label htmlFor="deskripsi" className="text-sm font-semibold">Deskripsi</label>
        <textarea id="deskripsi" name="deskripsi" rows={4} maxLength={1200} value={deskripsi} onChange={(event) => setDeskripsi(event.target.value)} className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none" />
        <button type="button" onClick={() => aiAction(new FormData(formRef.current))} disabled={aiPending} className="self-start rounded-lg border border-garis px-3 py-2 text-sm font-semibold hover:border-utama disabled:opacity-60">
          {aiPending ? "Membuat deskripsi…" : "Buat deskripsi dengan AI"}
        </button>
        {aiState?.error && <p role="status" className="text-sm text-bahaya">{aiState.error}</p>}
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="tersedia" defaultChecked={sudahSubmit ? state.values.tersedia === "on" : (produk.tersedia ?? true)} className="h-4 w-4 accent-[var(--color-utama)]" />
        Produk tersedia untuk dipesan
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Label produk
        <select name="badge" defaultValue={value("badge")} className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks">
          <option value="">Tanpa label</option>
          <option value="Baru">Baru</option>
          <option value="Terlaris">Terlaris</option>
          <option value="Promo">Promo</option>
        </select>
      </label>
      <div className="flex gap-3">
        <Tombol type="submit" disabled={pending}>{pending ? "Menyimpan…" : labelTombol}</Tombol>
        <Tombol href="/admin" varian="garis">Batal</Tombol>
      </div>
    </form>
  );
}
