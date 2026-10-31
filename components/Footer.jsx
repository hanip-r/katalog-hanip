import Link from "next/link";
export default function Footer({ toko }) {
  return (
    <footer className="mt-16 border-t border-garis bg-permukaan">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-teks-lembut sm:flex-row sm:justify-between">
        <div>
          <p className="font-bold text-teks">{toko.nama}</p>
          <p>{toko.alamat}</p>
          <p>{toko.jamBuka}</p>
        </div>
        <nav aria-label="Tautan informasi toko" className="flex flex-wrap gap-4">
          <Link href="/tentang" className="underline underline-offset-4 hover:text-utama">Tentang dan kontak</Link>
          <Link href="/admin" className="underline underline-offset-4 hover:text-utama">Masuk sebagai admin</Link>
        </nav>
      </div>
    </footer>
  );
}
