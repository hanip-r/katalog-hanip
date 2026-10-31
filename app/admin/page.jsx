import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createSessionClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  const supabase = await createSessionClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/admin/login");

  const { data: daftarProduk, error } = await supabase
    .from("produk")
    .select("*")
    .order("id", { ascending: true });

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>
      {error ? (
        <p className="rounded-lg border border-garis bg-permukaan p-4 text-sm text-bahaya">
          Gagal memuat produk. Periksa tabel dan migrasi database.
        </p>
      ) : (
        <TabelProduk daftarProduk={daftarProduk || []} />
      )}
    </div>
  );
}
