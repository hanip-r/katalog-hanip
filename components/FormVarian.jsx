"use client";

import { useActionState } from "react";
import { hapusVarian, tambahVarian, ubahVarian } from "@/app/admin/actions";

function ItemVarian({ produkId, varian }) {
  const update = ubahVarian.bind(null, produkId, varian.id);
  const remove = hapusVarian.bind(null, produkId, varian.id);
  const [state, formAction, pending] = useActionState(update, null);
  return <li className="flex flex-col gap-2 rounded-lg border border-garis p-3">
    <form action={formAction} className="grid gap-2 sm:grid-cols-[1fr_140px_auto]">
      <input name="nama" defaultValue={varian.nama} maxLength={80} required aria-label="Nama varian" className="rounded-lg border border-garis bg-latar px-3 py-2" />
      <input name="harga" type="number" min="1" step="1" defaultValue={varian.harga} required aria-label="Harga varian" className="rounded-lg border border-garis bg-latar px-3 py-2" />
      <button disabled={pending} className="rounded-lg border border-garis px-3 py-2 text-sm font-semibold">Simpan</button>
    </form>
    <form action={remove}><button className="self-start text-xs font-semibold text-bahaya underline">Hapus varian</button></form>
    {state?.error && <p role="alert" className="text-xs text-bahaya">{state.error}</p>}
  </li>;
}

export default function FormVarian({ produkId, variants }) {
  const add = tambahVarian.bind(null, produkId);
  const [state, formAction, pending] = useActionState(add, null);
  return <section className="flex max-w-xl flex-col gap-3 rounded-xl border border-garis p-4">
    <h2 className="font-bold">Varian dan harga</h2>
    {variants.length ? <ul className="flex flex-col gap-2">{variants.map((item) => <ItemVarian key={item.id} produkId={produkId} varian={item} />)}</ul> : <p className="text-sm text-teks-lembut">Belum ada varian.</p>}
    <form action={formAction} className="grid gap-2 sm:grid-cols-[1fr_140px_auto]">
      <input name="nama" placeholder="Contoh: 250 gram" maxLength={80} required aria-label="Nama varian baru" className="rounded-lg border border-garis bg-latar px-3 py-2" />
      <input name="harga" type="number" min="1" step="1" placeholder="Harga" required aria-label="Harga varian baru" className="rounded-lg border border-garis bg-latar px-3 py-2" />
      <button disabled={pending} className="rounded-lg bg-utama px-3 py-2 text-sm font-semibold text-white">Tambah</button>
    </form>
    {state?.error && <p role="alert" className="text-sm text-bahaya">{state.error}</p>}
  </section>;
}
