"use client";

import { useActionState } from "react";
import { hapusProduk } from "@/app/admin/actions";
import Tombol from "@/components/Tombol";

export default function TombolHapusProduk({ id, nama }) {
  const action = hapusProduk.bind(null, id);
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} onSubmit={(event) => {
      if (!window.confirm(`Hapus produk “${nama}”? Tindakan ini tidak bisa dibatalkan.`)) event.preventDefault();
    }}>
      <Tombol type="submit" varian="bahaya" disabled={pending}>{pending ? "Menghapus…" : "Hapus"}</Tombol>
      {state?.error && <p role="alert" className="mt-1 text-xs text-bahaya">{state.error}</p>}
    </form>
  );
}
