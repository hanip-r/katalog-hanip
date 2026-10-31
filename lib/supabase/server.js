import { createClient } from "@supabase/supabase-js";
import { createServerClient as createSsrServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Membuat koneksi Supabase untuk server memakai SUPABASE_URL dan SUPABASE_SECRET_KEY.
 * Digunakan untuk membaca data publik (katalog dan detail produk) di sisi server.
 */
export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_SECRET_KEY belum diatur di environment variable."
    );
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Membuat koneksi Supabase sesi admin memakai SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY,
 * dan cookie login (@supabase/ssr).
 * Digunakan untuk auth (login, logout, ganti password) dan aksi yang memerlukan sesi login.
 */
export async function createSessionClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_PUBLISHABLE_KEY belum diatur di environment variable."
    );
  }

  return createSsrServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Dipanggil dari Server Component saat render
        }
      },
    },
  });
}

export const createClientServer = createServerClient;
export const buatKlienServer = createServerClient;
export const createAdminClient = createSessionClient;
export const buatKlienAdmin = createSessionClient;
export const buatKlienSesi = createSessionClient;

export default createServerClient;
