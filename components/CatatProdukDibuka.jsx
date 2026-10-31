"use client";

import { useEffect } from "react";
import { useStore } from "@/components/AppState";

export default function CatatProdukDibuka({ produk }) {
  const { addRecent } = useStore();
  useEffect(() => { addRecent(produk); }, [produk.id]);
  return null;
}
