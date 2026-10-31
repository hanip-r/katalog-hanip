import NavAdmin from "@/components/NavAdmin";
import AksiModerasiUlasan from "@/components/AksiModerasiUlasan";
import { createSessionClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HalamanAdminUlasan() {
  const supabase = await createSessionClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/admin/login");
  const { data: ulasan, error } = await supabase.from("ulasan").select("*,produk(nama)").order("created_at", { ascending: false }).limit(100);

  return <section className="flex flex-col gap-5 py-8">
    <NavAdmin />
    <h1 className="text-2xl font-extrabold">Moderasi ulasan</h1>
    {error ? <p role="alert" className="text-sm text-bahaya">Tabel ulasan belum tersedia. Jalankan migrasi-us-21-40.sql.</p> : ulasan?.length ? <ul className="flex max-w-3xl flex-col gap-3">{ulasan.map((item) => <li key={item.id} className="flex flex-col gap-3 rounded-xl border border-garis p-4">
      <div><p className="font-bold">{item.produk?.nama || "Produk dihapus"} — {item.nama}</p><p className="text-sm text-harga">{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</p><p className="mt-2 whitespace-pre-line text-sm">{item.komentar}</p><p className="mt-2 text-xs text-teks-lembut">{item.tampil ? "Tampil untuk publik" : "Menunggu moderasi"}</p></div>
      <AksiModerasiUlasan ulasan={item} />
    </li>)}</ul> : <p className="text-teks-lembut">Belum ada ulasan.</p>}
  </section>;
}
