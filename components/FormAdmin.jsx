"use client";

import { useActionState } from "react";
import { buatAdmin } from "@/app/admin/actions";

export default function FormAdmin() {
  const [state, formAction, pending] = useActionState(buatAdmin, null);
  return <form action={formAction} className="flex max-w-md flex-col gap-3 rounded-xl border border-garis p-4">
    <h2 className="font-bold">Tambah akun admin</h2>
    <label className="text-sm font-semibold">Email<input type="email" name="email" autoComplete="email" required className="mt-1 w-full rounded-lg border border-garis bg-latar px-3 py-2" /></label>
    <label className="text-sm font-semibold">Password sementara<input type="password" name="password" minLength={8} autoComplete="new-password" required className="mt-1 w-full rounded-lg border border-garis bg-latar px-3 py-2" /></label>
    {state?.error && <p role="alert" className="text-sm text-bahaya">{state.error}</p>}
    {state?.success && <p role="status" className="text-sm text-utama">{state.success}</p>}
    <button disabled={pending} className="self-start rounded-lg bg-utama px-4 py-2 text-sm font-semibold text-white">{pending ? "Membuat…" : "Buat admin"}</button>
  </form>;
}
