import NavAdmin from "@/components/NavAdmin";
import FormAdmin from "@/components/FormAdmin";
import TombolNonaktifAdmin from "@/components/TombolNonaktifAdmin";
import { createSessionClient, createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HalamanAkunAdmin() {
  const sessionClient = await createSessionClient();
  const { data: { user }, error: authError } = await sessionClient.auth.getUser();
  if (authError || !user) redirect("/admin/login");
  let users = [];
  let error = null;
  try {
    const adminClient = createServerClient();
    const result = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
    users = result.data?.users || [];
    error = result.error;
  } catch {
    error = true;
  }
  return <section className="flex flex-col gap-6 py-8">
    <NavAdmin />
    <h1 className="text-2xl font-extrabold">Kelola akun admin</h1>
    <FormAdmin />
    <div className="max-w-2xl overflow-x-auto rounded-xl border border-garis">
      <table className="w-full min-w-[600px] text-left text-sm"><thead className="bg-permukaan"><tr><th className="px-4 py-3">Email</th><th className="px-4 py-3">Dibuat</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Aksi</th></tr></thead>
        <tbody>{users.map((item) => { const disabled = Boolean(item.banned_until && new Date(item.banned_until) > new Date()); return <tr key={item.id} className="border-t border-garis"><td className="px-4 py-3">{item.email}</td><td className="px-4 py-3">{item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID") : "—"}</td><td className="px-4 py-3">{disabled ? "Nonaktif" : "Aktif"}</td><td className="px-4 py-3">{!disabled && <TombolNonaktifAdmin id={item.id} email={item.email || "akun ini"} self={item.id === user.id} />}</td></tr>; })}</tbody>
      </table>
      {error && <p role="alert" className="p-4 text-sm text-bahaya">Daftar akun tidak dapat dibaca. Periksa SUPABASE_SECRET_KEY.</p>}
    </div>
  </section>;
}
