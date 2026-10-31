"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { buatDeskripsiAI } from "@/app/admin/actions";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import UploadFotoProduk from "@/components/UploadFotoProduk";

export default function FormProduk({ produk = {}, labelTombol, action, categories = [] }) {
  const [state, formAction, pending] = useActionState(action, null);
  const [aiState, aiAction, aiPending] = useActionState(buatDeskripsiAI, null);
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi || "");
  const [fields, setFields] = useState({
    nama: produk.nama || "",
    harga: produk.harga ?? "",
    harga_diskon: produk.harga_diskon ?? "",
    kategori: produk.kategori || "",
    foto_url: produk.foto_url || "",
    foto_galeri: Array.isArray(produk.foto_galeri) ? produk.foto_galeri.join("\n") : "",
    badge: produk.badge || "",
  });
  const [tersedia, setTersedia] = useState(produk.tersedia ?? true);
  const formRef = useRef(null);

  useEffect(() => {
    if (aiState?.description) setDeskripsi(aiState.description);
  }, [aiState]);

  useEffect(() => {
    if (!state?.values) return;
    setFields((current) => ({ ...current, ...state.values }));
    setDeskripsi(state.values.deskripsi || "");
    setTersedia(state.values.tersedia === "on");
  }, [state]);

  const update = (name) => (event) => setFields((current) => ({ ...current, [name]: event.target.value }));
  const handleUploaded = useCallback((url) => setFields((current) => ({ ...current, foto_url: url })), []);
  const error = (name) => state?.errors?.[name] ? <p role="alert" className="text-sm font-normal text-bahaya">{state.errors[name]}</p> : null;

  return (
    <form ref={formRef} action={formAction} className="flex max-w-xl flex-col gap-4">
      {state?.error && <p role="alert" className="rounded-lg bg-permukaan p-3 text-sm text-bahaya">{state.error}</p>}
      <div><Input label="Nama produk" name="nama" value={fields.nama} onChange={update("nama")} required maxLength={120} aria-invalid={Boolean(state?.errors?.nama)} />{error("nama")}</div>
      <div><Input label="Harga normal (Rp)" name="harga" type="number" min="1" step="1" value={fields.harga} onChange={update("harga")} required aria-invalid={Boolean(state?.errors?.harga)} />{error("harga")}</div>
      <div><Input label="Harga promo (opsional)" name="harga_diskon" type="number" min="1" step="1" value={fields.harga_diskon} onChange={update("harga_diskon")} aria-invalid={Boolean(state?.errors?.harga_diskon)} />{error("harga_diskon")}</div>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">Kategori
        <select name="kategori" value={fields.kategori} onChange={update("kategori")} className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks">
          <option value="">Pilih kategori</option>
          {[...new Set([...categories, ...(fields.kategori ? [fields.kategori] : [])])].map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
      </label>
      <Input label="Link foto utama" name="foto_url" placeholder="https://... atau /produk/nama-file.svg" value={fields.foto_url} onChange={update("foto_url")} />
      <UploadFotoProduk formRef={formRef} onUploaded={handleUploaded} />
      <Input label="Link foto tambahan (satu per baris)" name="foto_galeri" textarea rows={3} value={fields.foto_galeri} onChange={update("foto_galeri")} />
      <div className="flex flex-col gap-2">
        <label htmlFor="deskripsi" className="text-sm font-semibold">Deskripsi</label>
        <textarea id="deskripsi" name="deskripsi" rows={4} maxLength={1200} value={deskripsi} onChange={(event) => setDeskripsi(event.target.value)} className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none" />
        {error("deskripsi")}
        <button type="button" onClick={() => aiAction(new FormData(formRef.current))} disabled={aiPending} className="self-start rounded-lg border border-garis px-3 py-2 text-sm font-semibold hover:border-utama disabled:opacity-60">
          {aiPending ? "Membuat deskripsi…" : "Buat deskripsi dengan AI"}
        </button>
        {aiState?.error && <p role="status" className="text-sm text-bahaya">{aiState.error}</p>}
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="tersedia" checked={tersedia} onChange={(event) => setTersedia(event.target.checked)} className="h-4 w-4 accent-[var(--color-utama)]" />
        Produk tersedia untuk dipesan
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Label produk
        <select name="badge" value={fields.badge} onChange={update("badge")} className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks">
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
