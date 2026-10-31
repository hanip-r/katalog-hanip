import NavAdmin from "@/components/NavAdmin";
import { FormKategori, TombolHapusKategori } from "@/components/FormKategori";
import { tambahKategori, ubahKategori, hapusKategori } from "@/app/admin/actions";
import { createSessionClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HalamanKategori() {
  const supabase = await createSessionClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/admin/login");
  const { data: categories, error } = await supabase.from("kategori_produk").select("nama").order("nama");

  return <section className="flex flex-col gap-6 py-8">
    <NavAdmin />
    <h1 className="text-2xl font-extrabold">Kelola kategori</h1>
    <div className="max-w-xl rounded-xl border border-garis p-4"><FormKategori action={tambahKategori} /></div>
    {error ? <p role="alert" className="text-sm text-bahaya">Tabel kategori belum tersedia. Jalankan migrasi-us-21-40.sql.</p> : categories?.length ? <ul className="flex max-w-xl flex-col gap-3">{categories.map(({ nama }) => <li key={nama} className="flex flex-wrap items-end justify-between gap-3 rounded-xl border border-garis p-4">
      <FormKategori action={ubahKategori.bind(null, nama)} initialName={nama} label="Simpan nama" />
      <TombolHapusKategori action={hapusKategori.bind(null, nama)} />
    </li>)}</ul> : <p className="text-teks-lembut">Belum ada kategori.</p>}
  </section>;
}
