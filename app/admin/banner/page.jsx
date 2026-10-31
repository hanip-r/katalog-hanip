import Link from "next/link";
import NavAdmin from "@/components/NavAdmin";
import FormBanner from "@/components/FormBanner";
import AksiBanner from "@/components/AksiBanner";
import { simpanBanner, ubahBanner } from "@/app/admin/actions";
import { createSessionClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HalamanBannerAdmin() {
  const supabase = await createSessionClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/admin/login");
  const { data: banners, error } = await supabase.from("banner_promo").select("*").order("created_at", { ascending: false });
  return <section className="flex flex-col gap-6 py-8">
    <NavAdmin />
    <h1 className="text-2xl font-extrabold">Banner promo</h1>
    <FormBanner action={simpanBanner} />
    {error ? <p role="alert" className="text-sm text-bahaya">Jalankan migrasi-us-41-50.sql untuk mengaktifkan banner.</p> : banners?.length ? <ul className="flex max-w-xl flex-col gap-3">{banners.map((banner) => <li key={banner.id} className="flex flex-col gap-3 rounded-xl border border-garis p-4">
      {banner.gambar_url && <img src={banner.gambar_url} alt="" className="aspect-[3/1] w-full rounded-lg object-cover" />}
      <div><p className="font-bold">{banner.judul}</p><p className="text-sm text-teks-lembut">{banner.teks}</p><p className="mt-1 text-xs text-teks-lembut">{banner.aktif ? "Aktif" : "Nonaktif"}</p></div>
      <details><summary className="cursor-pointer text-sm font-semibold underline">Ubah</summary><FormBanner banner={banner} action={ubahBanner.bind(null, banner.id)} /></details>
      <AksiBanner banner={banner} />
    </li>)}</ul> : <p className="text-sm text-teks-lembut">Belum ada banner. <Link href="/" className="underline">Lihat beranda</Link></p>}
  </section>;
}
