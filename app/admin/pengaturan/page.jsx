import NavAdmin from "@/components/NavAdmin";
import FormPengaturanToko from "@/components/FormPengaturanToko";
import { getTokoSettings } from "@/lib/toko-server";
import { createSessionClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HalamanPengaturanToko({ searchParams }) {
  const params = await searchParams;
  const supabase = await createSessionClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/admin/login");
  const toko = await getTokoSettings();
  return <section className="flex flex-col gap-6 py-8">
    <NavAdmin />
    <div><h1 className="text-2xl font-extrabold">Pengaturan toko</h1><p className="mt-1 text-sm text-teks-lembut">Informasi ini tampil di katalog, header, footer, dan tautan WhatsApp.</p></div>
    {params.saved === "1" && <p role="status" className="text-sm text-utama">Pengaturan berhasil disimpan.</p>}
    <FormPengaturanToko pengaturan={toko} />
  </section>;
}
