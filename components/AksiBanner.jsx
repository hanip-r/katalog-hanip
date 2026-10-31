"use client";

import { useActionState } from "react";
import { hapusBanner, toggleBanner } from "@/app/admin/actions";

export default function AksiBanner({ banner }) {
  const toggleAction = toggleBanner.bind(null, banner.id, !banner.aktif);
  const deleteAction = hapusBanner.bind(null, banner.id);
  const [state, formAction, pending] = useActionState(toggleAction, null);
  const [deleteState, deleteFormAction, deleting] = useActionState(deleteAction, null);
  return <div className="flex flex-wrap items-center gap-2">
    <form action={formAction}><button disabled={pending} className="rounded-lg border border-garis px-3 py-2 text-xs font-semibold">{banner.aktif ? "Nonaktifkan" : "Aktifkan"}</button></form>
    <form action={deleteFormAction} onSubmit={(event) => { if (!window.confirm("Hapus banner ini?")) event.preventDefault(); }}><button disabled={deleting} className="rounded-lg border border-garis px-3 py-2 text-xs font-semibold text-bahaya">Hapus</button></form>
    {(state?.error || deleteState?.error) && <p role="alert" className="w-full text-xs text-bahaya">{state?.error || deleteState?.error}</p>}
  </div>;
}
