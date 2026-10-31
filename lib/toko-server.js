import { createServerClient } from "@/lib/supabase/server";
import { toko as identitasDefault } from "@/lib/toko";

export async function getTokoSettings() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.from("pengaturan_toko").select("nama,tagline,nomor_whatsapp,alamat,jam_buka").eq("id", 1).maybeSingle();
    if (!error && data) {
      return { nama: data.nama, tagline: data.tagline, nomorWhatsApp: data.nomor_whatsapp, alamat: data.alamat, jamBuka: data.jam_buka };
    }
  } catch {
    // Use the configured store identity when Supabase settings have not been migrated.
  }
  return identitasDefault;
}
