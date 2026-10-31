"use client";

import { useActionState } from "react";
import { moderasiUlasan, hapusUlasan } from "@/app/admin/actions";

export default function AksiModerasiUlasan({ ulasan }) {
  const moderationAction = moderasiUlasan.bind(null, ulasan.id, !ulasan.tampil);
  const deleteAction = hapusUlasan.bind(null, ulasan.id);
  const [state, formAction, pending] = useActionState(moderationAction, null);
  const [deleteState, deleteFormAction, deleting] = useActionState(deleteAction, null);
  return <div className="flex flex-wrap items-center gap-2">
    <form action={formAction}><button disabled={pending} className="rounded-lg border border-garis px-3 py-2 text-xs font-semibold">{ulasan.tampil ? "Sembunyikan" : "Tampilkan"}</button></form>
    <form action={deleteFormAction} onSubmit={(event) => { if (!window.confirm("Hapus ulasan ini?")) event.preventDefault(); }}><button disabled={deleting} className="rounded-lg border border-garis px-3 py-2 text-xs font-semibold text-bahaya">Hapus</button></form>
    {(state?.error || deleteState?.error) && <p role="alert" className="w-full text-xs text-bahaya">{state?.error || deleteState?.error}</p>}
  </div>;
}
