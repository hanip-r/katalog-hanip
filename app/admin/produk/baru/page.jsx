import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { tambahProduk } from "@/app/admin/actions";
import { createSessionClient } from "@/lib/supabase/server";

export default async function HalamanTambahProduk() {
  const supabase = await createSessionClient();
  const { data } = await supabase.from("kategori_produk").select("nama").order("nama");
  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Tambah produk</h1>
      <FormProduk action={tambahProduk} labelTombol="Simpan produk" categories={(data || []).map((item) => item.nama)} />
    </div>
  );
}
