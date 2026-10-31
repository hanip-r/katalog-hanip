import { createSessionClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function cell(value) {
  let text = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
  if (/^[\s]*[=+@\-\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const supabase = await createSessionClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return new Response("Tidak diizinkan", { status: 401 });

  const { data, error } = await supabase.from("produk").select("*").order("id", { ascending: true });
  if (error) return new Response("Gagal mengekspor produk", { status: 500 });
  const columns = ["id", "nama", "harga", "harga_diskon", "kategori", "deskripsi", "foto_url", "foto_galeri", "tersedia", "badge", "created_at"];
  const rows = [columns.map(cell).join(","), ...(data || []).map((product) => columns.map((key) => cell(product[key])).join(","))];
  return new Response(`\uFEFF${rows.join("\r\n")}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="produk.csv"',
      "Cache-Control": "private, no-store",
    },
  });
}
