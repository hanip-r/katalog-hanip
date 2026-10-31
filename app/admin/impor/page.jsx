import NavAdmin from "@/components/NavAdmin";
import FormImporProduk from "@/components/FormImporProduk";
import { createSessionClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HalamanImporProduk() {
  const supabase = await createSessionClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/admin/login");
  return <section className="flex flex-col gap-5 py-8"><NavAdmin /><h1 className="text-2xl font-extrabold">Impor produk dari CSV</h1><FormImporProduk /></section>;
}
