"use client";

import { useActionState } from "react";
import { nonaktifkanAdmin } from "@/app/admin/actions";

export default function TombolNonaktifAdmin({ id, email, self }) {
  const action = nonaktifkanAdmin.bind(null, id);
  const [state, formAction, pending] = useActionState(action, null);
  return <form action={formAction} onSubmit={(event) => { if (!window.confirm(`Nonaktifkan akun ${email}?`)) event.preventDefault(); }}>
    <button disabled={self || pending} className="rounded-lg border border-garis px-3 py-2 text-xs font-semibold text-bahaya">{self ? "Akun aktif" : pending ? "Memproses…" : "Nonaktifkan"}</button>
    {state?.error && <p role="alert" className="mt-1 text-xs text-bahaya">{state.error}</p>}
  </form>;
}
