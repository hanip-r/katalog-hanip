"use client";

import { useActionState, useEffect } from "react";
import { uploadFotoProduk } from "@/app/admin/actions";

export default function UploadFotoProduk({ formRef, onUploaded }) {
  const [state, formAction, pending] = useActionState(uploadFotoProduk, null);
  useEffect(() => { if (state?.url) onUploaded(state.url); }, [state, onUploaded]);
  return <div className="flex flex-col gap-2">
    <label htmlFor="foto_file" className="text-sm font-semibold">Unggah foto produk (maks. 5 MB)</label>
    <input id="foto_file" name="foto_file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="rounded-lg border border-garis bg-latar p-2 text-sm" />
    <button type="button" onClick={() => formAction(new FormData(formRef.current))} disabled={pending} className="self-start rounded-lg border border-garis px-3 py-2 text-sm font-semibold disabled:opacity-60">{pending ? "Mengunggah…" : "Unggah foto"}</button>
    {state?.error && <p role="alert" className="text-sm text-bahaya">{state.error}</p>}
    {state?.url && <p role="status" className="text-sm text-utama">Foto berhasil diunggah.</p>}
  </div>;
}
