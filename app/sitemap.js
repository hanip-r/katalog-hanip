import { createServerClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/base-url";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const base = getBaseUrl();
  const pages = ["", "/tentang"].map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly", priority: path ? 0.6 : 1 }));
  try {
    const supabase = createServerClient();
    let { data, error } = await supabase.from("produk").select("id,created_at").eq("tersedia", true);
    if (error?.code === "42703" || error?.code === "PGRST204") {
      const legacy = await supabase.from("produk").select("id,created_at");
      data = legacy.data;
      error = legacy.error;
    }
    if (!error) pages.push(...(data || []).map((product) => ({ url: `${base}/produk/${product.id}`, lastModified: product.created_at, changeFrequency: "monthly", priority: 0.7 })));
  } catch {
    // Sitemap tetap berisi rute statis jika database sementara tidak tersedia.
  }
  return pages;
}
