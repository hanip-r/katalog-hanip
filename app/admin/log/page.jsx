import NavAdmin from "@/components/NavAdmin";
import { createSessionClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HalamanLogAktivitas() {
  const supabase = await createSessionClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/admin/login");
  const { data: logs, error } = await supabase.from("log_aktivitas").select("admin_email,aksi,nama_produk,created_at").order("created_at", { ascending: false }).limit(50);
  return <section className="flex flex-col gap-5 py-8">
    <NavAdmin />
    <h1 className="text-2xl font-extrabold">50 aktivitas terakhir</h1>
    {error ? <p role="alert" className="text-sm text-bahaya">Jalankan migrasi-us-41-50.sql untuk mengaktifkan log.</p> : logs?.length ? <ol className="flex max-w-3xl flex-col divide-y divide-garis rounded-xl border border-garis">{logs.map((log, index) => <li key={`${log.created_at}-${index}`} className="flex flex-wrap items-center justify-between gap-2 p-4"><div><p className="font-semibold">{log.admin_email || "Admin"} — {log.aksi} produk</p><p className="text-sm text-teks-lembut">{log.nama_produk}</p></div><time className="text-xs text-teks-lembut" dateTime={log.created_at}>{new Date(log.created_at).toLocaleString("id-ID")}</time></li>)}</ol> : <p className="text-sm text-teks-lembut">Belum ada aktivitas yang tercatat.</p>}
  </section>;
}
