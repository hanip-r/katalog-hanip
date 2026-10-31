import { notFound, redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { ubahProduk } from "@/app/admin/actions";
import { createSessionClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;
  const supabase = await createSessionClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/admin/login");

  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !produk) notFound();
  const { data: categories } = await supabase.from("kategori_produk").select("nama").order("nama");

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormProduk produk={produk} action={ubahProduk.bind(null, id)} labelTombol="Simpan perubahan" categories={(categories || []).map((item) => item.nama)} />
    </div>
  );
}
