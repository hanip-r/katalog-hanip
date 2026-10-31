"use client";

import { useActionState } from "react";
import { simpanPengaturanToko } from "@/app/admin/actions";
import Input from "@/components/Input";

export default function FormPengaturanToko({ pengaturan }) {
  const [state, formAction, pending] = useActionState(simpanPengaturanToko, null);
  const value = (key, fallback) => state?.values?.[key] ?? fallback;
  const error = (key) => state?.errors?.[key] && <p role="alert" className="text-sm font-normal text-bahaya">{state.errors[key]}</p>;
  return <form action={formAction} className="flex max-w-xl flex-col gap-4">
    <div><Input label="Nama toko" name="nama" defaultValue={value("nama", pengaturan.nama)} required maxLength={120} />{error("nama")}</div>
    <Input label="Tagline" name="tagline" textarea defaultValue={value("tagline", pengaturan.tagline)} maxLength={300} />
    <div><Input label="Nomor WhatsApp (kode negara, hanya angka)" name="nomorWhatsApp" type="tel" inputMode="numeric" placeholder="6281234567890" defaultValue={value("nomorWhatsApp", pengaturan.nomorWhatsApp)} required />{error("nomorWhatsApp")}</div>
    <div><Input label="Alamat" name="alamat" textarea defaultValue={value("alamat", pengaturan.alamat)} required />{error("alamat")}</div>
    <div><Input label="Jam buka" name="jamBuka" defaultValue={value("jamBuka", pengaturan.jamBuka)} required />{error("jamBuka")}</div>
    {state?.error && <p role="alert" className="text-sm text-bahaya">{state.error}</p>}
    {state?.success && <p role="status" className="text-sm text-utama">{state.success}</p>}
    <button disabled={pending} className="self-start rounded-lg bg-utama px-4 py-2.5 text-sm font-semibold text-white">{pending ? "Menyimpan…" : "Simpan pengaturan"}</button>
  </form>;
}
