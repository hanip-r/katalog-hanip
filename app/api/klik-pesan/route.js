import { createServerClient } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const productIds = [...new Set((Array.isArray(body.productIds) ? body.productIds : [body.productId])
      .map(Number).filter((id) => Number.isSafeInteger(id) && id > 0))].slice(0, 50);
    if (!productIds.length) return new Response(null, { status: 204 });

    const supabase = createServerClient();
    const { data: products, error: productError } = await supabase.from("produk").select("id").in("id", productIds);
    if (!productError && products?.length) {
      await supabase.from("klik_pesan").insert(products.map((product) => ({ produk_id: product.id })));
    }
  } catch {
    // Pencatatan tidak boleh menghalangi pembukaan WhatsApp.
  }
  return new Response(null, { status: 204 });
}
