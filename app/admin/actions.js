"use server";

import { createSessionClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(prevState, formData) {
  const data = formData instanceof FormData ? formData : (prevState instanceof FormData ? prevState : null);
  const email = data ? data.get("email") : null;
  const password = data ? data.get("password") : null;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  try {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });

    if (error) {
      if (
        error.message.includes("Invalid login credentials") ||
        error.message.includes("invalid_credentials") ||
        error.message.includes("invalid_grant")
      ) {
        return { error: "Email atau password salah." };
      }
      return { error: error.message };
    }
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat memproses login." };
  }

  redirect("/admin");
}

export async function keluar() {
  try {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  } catch (err) {
    // Abaikan error pada sign out agar tetap dapat diarahkan ke halaman login
  }

  redirect("/admin/login");
}

export const logout = keluar;

export async function gantiPassword(prevState, formData) {
  const data = formData instanceof FormData ? formData : (prevState instanceof FormData ? prevState : null);
  const passwordBaru = data ? data.get("password_baru") : null;
  const konfirmasiPassword = data ? data.get("konfirmasi_password") : null;

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak cocok dengan password baru." };
  }

  try {
    const supabase = await createSessionClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Sesi telah berakhir atau Anda belum login." };
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: String(passwordBaru),
    });

    if (updateError) {
      return { error: updateError.message };
    }

    return { success: "Password berhasil diperbarui." };
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat mengganti password." };
  }
}
