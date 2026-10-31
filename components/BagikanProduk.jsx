"use client";

import { useState } from "react";

export default function BagikanProduk({ nama }) {
  const [pesan, setPesan] = useState("");

  async function bagikan() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: nama, url });
        setPesan("Link berhasil dibagikan.");
      }
      else {
        await navigator.clipboard.writeText(url);
        setPesan("Link tersalin");
      }
    } catch (error) {
      if (error?.name !== "AbortError") setPesan("Link tidak dapat dibagikan. Salin alamat dari browser.");
    }
  }

  return <div className="flex items-center gap-3"><button type="button" onClick={bagikan} className="rounded-lg border border-garis px-3 py-2 text-sm font-semibold hover:border-utama">Bagikan produk</button>{pesan && <span role="status" className="text-sm text-teks-lembut">{pesan}</span>}</div>;
}
