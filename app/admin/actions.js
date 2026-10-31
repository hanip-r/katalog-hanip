"use server";

import { createSessionClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/admin/login");
  return supabase;
}

function productValues(formData) {
  const nama = String(formData.get("nama") || "").trim();
  const hargaRaw = String(formData.get("harga") || "").trim();
  const harga = Number(hargaRaw);
  const hargaDiskonRaw = String(formData.get("harga_diskon") || "").trim();
  const harga_diskon = hargaDiskonRaw ? Number(hargaDiskonRaw) : null;
  const foto_galeri = String(formData.get("foto_galeri") || "")
    .split(/[\r\n,]+/)
    .map((url) => url.trim())
    .filter(Boolean);

  const values = {
    nama,
    harga,
    deskripsi: String(formData.get("deskripsi") || "").trim(),
    foto_url: String(formData.get("foto_url") || "").trim(),
    kategori: String(formData.get("kategori") || "").trim(),
    tersedia: formData.get("tersedia") === "on",
    foto_galeri,
    harga_diskon,
    badge: String(formData.get("badge") || "").trim() || null,
  };

  if (!nama) return { error: "Nama produk wajib diisi." };
  if (!Number.isSafeInteger(harga) || harga <= 0) {
    return { error: "Harga harus berupa angka bulat lebih dari 0." };
  }
  if (harga_diskon !== null && (!Number.isSafeInteger(harga_diskon) || harga_diskon <= 0 || harga_diskon >= harga)) {
    return { error: "Harga promo harus lebih dari 0 dan lebih rendah dari harga normal." };
  }
  return { values };
}

function formValues(formData) {
  return Object.fromEntries(formData.entries());
}

export async function login(prevState, formData) {
  const data = formData instanceof FormData ? formData : null;
  const email = data ? data.get("email") : null;
  const password = data ? data.get("password") : null;

  if (!email || !password) return { error: "Email dan password wajib diisi." };

  try {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });

    if (error) {
      if (error.message.toLowerCase().includes("invalid")) {
        return { error: "Email atau password salah." };
      }
      return { error: "Login gagal. Periksa konfigurasi Supabase lalu coba lagi." };
    }
  } catch {
    return { error: "Login gagal. Periksa koneksi dan konfigurasi Supabase." };
  }

  redirect("/admin");
}

export async function keluar() {
  try {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  } catch {
    // Tetap mengirim admin kembali ke halaman login.
  }
  redirect("/admin/login");
}

export const logout = keluar;

export async function gantiPassword(prevState, formData) {
  const passwordBaru = formData?.get("password_baru");
  const konfirmasiPassword = formData?.get("konfirmasi_password");

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password wajib diisi." };
  }
  if (String(passwordBaru).length < 8) return { error: "Password baru minimal 8 karakter." };
  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak cocok dengan password baru." };
  }

  const supabase = await requireAdmin();
  try {
    const { error } = await supabase.auth.updateUser({ password: String(passwordBaru) });
    if (error) return { error: "Password gagal diperbarui. Coba lagi." };
    return { success: "Password berhasil diperbarui." };
  } catch {
    return { error: "Sesi telah berakhir atau terjadi kesalahan saat mengganti password." };
  }
}

export async function tambahProduk(prevState, formData) {
  const supabase = await requireAdmin();
  const parsed = productValues(formData);
  if (parsed.error) return { error: parsed.error, values: formValues(formData) };

  const { error } = await supabase.from("produk").insert(parsed.values);
  if (error) return { error: "Produk gagal disimpan. Pastikan migrasi database sudah dijalankan.", values: formValues(formData) };

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function ubahProduk(id, prevState, formData) {
  const supabase = await requireAdmin();
  const parsed = productValues(formData);
  if (parsed.error) return { error: parsed.error, values: formValues(formData) };

  const { error } = await supabase.from("produk").update(parsed.values).eq("id", id);
  if (error) return { error: "Perubahan gagal disimpan. Pastikan migrasi database sudah dijalankan.", values: formValues(formData) };

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/produk/${id}`);
  redirect("/admin");
}

export async function hapusProduk(id, prevState, formData) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("produk").delete().eq("id", id);
  if (error) return { error: "Produk gagal dihapus. Coba lagi." };
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/produk/${id}`);
}

export async function buatDeskripsiAI(prevState, formData) {
  await requireAdmin();
  const nama = String(formData.get("nama") || "").trim();
  const kategori = String(formData.get("kategori") || "").trim();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return { error: "Fitur AI belum aktif. Tambahkan GEMINI_API_KEY di environment Vercel." };
  if (!nama || !kategori) return { error: "Isi nama dan kategori produk terlebih dahulu." };

  try {
    const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Tulis deskripsi katalog berbahasa Indonesia, 2 kalimat singkat dan jujur, berdasarkan nama dan kategori saja. Jangan mengarang bahan, manfaat, ukuran, atau klaim. Nama: ${nama}. Kategori: ${kategori}.`,
            }],
          }],
          generationConfig: { maxOutputTokens: 160, temperature: 0.6 },
        }),
        signal: AbortSignal.timeout(20000),
      }
    );
    const result = await response.json();
    const description = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!response.ok || !description) return { error: "AI belum dapat membuat deskripsi. Coba lagi sebentar." };
    return { description };
  } catch {
    return { error: "Koneksi ke layanan AI gagal atau terlalu lama. Coba lagi." };
  }
}
