"use client";

import { useActionState } from "react";
import { toggleKetersediaan } from "@/app/admin/actions";

export default function TombolKetersediaan({ id, tersedia }) {
  const action = toggleKetersediaan.bind(null, id);
  const [state, formAction, pending] = useActionState(action, null);
  return <form action={formAction} className="flex flex-col items-start gap-1">
    <button disabled={pending} className="rounded-lg border border-garis px-3 py-2 text-xs font-semibold">{pending ? "Menyimpan…" : tersedia ? "Nonaktifkan" : "Aktifkan"}</button>
    {state?.error && <span role="alert" className="text-xs text-bahaya">{state.error}</span>}
  </form>;
}
