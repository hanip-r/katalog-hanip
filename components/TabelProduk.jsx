import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";
import TombolHapusProduk from "@/components/TombolHapusProduk";

export default function TabelProduk({ daftarProduk }) {
  if (daftarProduk.length === 0) {
    return <p className="rounded-xl border border-garis p-5 text-teks-lembut">Belum ada produk. Tambahkan produk pertama toko.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-garis">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-permukaan text-teks-lembut">
          <tr>
            <th className="px-4 py-3 font-semibold">Produk</th>
            <th className="px-4 py-3 font-semibold">Kategori</th>
            <th className="px-4 py-3 font-semibold">Harga</th>
            <th className="px-4 py-3 font-semibold">Stok</th>
            <th className="px-4 py-3 font-semibold"><span className="sr-only">Aksi</span></th>
          </tr>
        </thead>
        <tbody>
          {daftarProduk.map((produk) => (
            <tr key={produk.id} className="border-t border-garis">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img src={produk.foto_url} alt="" className="h-10 w-10 rounded-md object-cover" />
                  <div>
                    <p className="font-semibold">{produk.nama}</p>
                    {produk.badge && <p className="text-xs text-teks-lembut">Label: {produk.badge}</p>}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-teks-lembut">{produk.kategori || "—"}</td>
              <td className="px-4 py-3">
                {produk.harga_diskon ? <><span className="text-teks-lembut line-through">{formatRupiah(produk.harga)}</span><br />{formatRupiah(produk.harga_diskon)}</> : formatRupiah(produk.harga)}
              </td>
              <td className="px-4 py-3">{produk.tersedia ? "Tersedia" : "Habis"}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis">Ubah</Tombol>
                  <TombolHapusProduk id={produk.id} nama={produk.nama} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
