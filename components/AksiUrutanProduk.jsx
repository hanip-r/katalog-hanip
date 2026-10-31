"use client";

import { useActionState } from "react";
import { pindahUrutanProduk } from "@/app/admin/actions";

function MoveButton({ id, direction, disabled }) {
  const action = pindahUrutanProduk.bind(null, id, direction);
  const [state, formAction, pending] = useActionState(action, null);
  return <form action={formAction}><button disabled={disabled || pending} aria-label={direction === "atas" ? "Naikkan urutan" : "Turunkan urutan"} title={direction === "atas" ? "Naikkan" : "Turunkan"} className="rounded border border-garis px-2 py-1 text-xs disabled:opacity-40">{direction === "atas" ? "↑" : "↓"}</button>{state?.error && <span role="alert" className="sr-only">{state.error}</span>}</form>;
}

export default function AksiUrutanProduk({ id }) {
  return <div className="flex gap-1"><MoveButton id={id} direction="atas" /><MoveButton id={id} direction="bawah" /></div>;
}
