"use server";

import { createSessionClient, createServerClient } from "@/lib/supabase/server";
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

  const errors = {};
  if (!nama) errors.nama = "Nama produk wajib diisi.";
  else if (nama.length > 120) errors.nama = "Nama produk maksimal 120 karakter.";
  if (!Number.isSafeInteger(harga) || harga <= 0) errors.harga = "Harga harus berupa angka bulat lebih dari 0.";
  if (values.deskripsi.length > 1200) errors.deskripsi = "Deskripsi maksimal 1200 karakter.";
  if (harga_diskon !== null && (!Number.isSafeInteger(harga_diskon) || harga_diskon <= 0 || harga_diskon >= harga)) {
    errors.harga_diskon = "Harga promo harus lebih dari 0 dan lebih rendah dari harga normal.";
  }
  return Object.keys(errors).length ? { errors } : { values };
}

function formValues(formData) {
  return Object.fromEntries([...formData.entries()].filter(([, value]) => !(value instanceof File)));
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
  if (parsed.errors) return { errors: parsed.errors, values: formValues(formData) };

  const { error } = await supabase.from("produk").insert(parsed.values);
  if (error) return { error: "Produk gagal disimpan. Pastikan migrasi database sudah dijalankan.", values: formValues(formData) };

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function ubahProduk(id, prevState, formData) {
  const supabase = await requireAdmin();
  const parsed = productValues(formData);
  if (parsed.errors) return { errors: parsed.errors, values: formValues(formData) };

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

export async function toggleKetersediaan(id) {
  const supabase = await requireAdmin();
  const { data: produk, error: selectError } = await supabase
    .from("produk").select("tersedia").eq("id", id).maybeSingle();
  if (selectError || !produk) return { error: "Status produk tidak dapat diperbarui. Jalankan migrasi database." };
  const { error } = await supabase.from("produk").update({ tersedia: !produk.tersedia }).eq("id", id);
  if (error) return { error: "Status produk gagal diperbarui." };
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/produk/${id}`);
  return { success: produk.tersedia ? "Produk dinonaktifkan." : "Produk diaktifkan." };
}

export async function tambahKategori(prevState, formData) {
  const supabase = await requireAdmin();
  const nama = String(formData.get("nama") || "").trim();
  if (!nama || nama.length > 80) return { error: "Nama kategori wajib diisi dan maksimal 80 karakter." };
  const { error } = await supabase.from("kategori_produk").insert({ nama });
  if (error) return { error: "Kategori gagal ditambahkan. Pastikan namanya belum ada dan migrasi sudah dijalankan." };
  revalidatePath("/admin/kategori");
  revalidatePath("/admin/produk/baru");
  redirect("/admin/kategori");
}

export async function ubahKategori(namaLama, prevState, formData) {
  const supabase = await requireAdmin();
  const nama = String(formData.get("nama") || "").trim();
  if (!nama || nama.length > 80) return { error: "Nama kategori wajib diisi dan maksimal 80 karakter." };
  const { error: renameError } = await supabase.from("kategori_produk").update({ nama }).eq("nama", namaLama);
  if (renameError) return { error: "Kategori gagal diubah. Nama mungkin sudah digunakan." };
  const { error: productError } = await supabase.from("produk").update({ kategori: nama }).eq("kategori", namaLama);
  if (productError) return { error: "Nama kategori diperbarui, tetapi kategori produk lama gagal diperbarui." };
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/kategori");
  redirect("/admin/kategori");
}

export async function hapusKategori(nama) {
  const supabase = await requireAdmin();
  const { data: produk, error: productError } = await supabase.from("produk").select("id").eq("kategori", nama).limit(1);
  if (productError) return { error: "Tidak dapat memeriksa penggunaan kategori." };
  if (produk?.length) return { error: "Kategori masih dipakai produk. Ubah kategori produk terlebih dahulu." };
  const { error } = await supabase.from("kategori_produk").delete().eq("nama", nama);
  if (error) return { error: "Kategori gagal dihapus." };
  revalidatePath("/admin/kategori");
  revalidatePath("/admin/produk/baru");
  return { success: "Kategori dihapus." };
}

export async function uploadFotoProduk(prevState, formData) {
  await requireAdmin();
  const file = formData.get("foto_file");
  if (!(file instanceof File) || file.size === 0) return { error: "Pilih file gambar terlebih dahulu." };
  const formats = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
  if (!formats[file.type]) return { error: "Format gambar harus JPG, PNG, WebP, atau GIF." };
  if (file.size > 5 * 1024 * 1024) return { error: "Ukuran foto maksimal 5 MB." };

  try {
    const storageClient = createServerClient();
    const namaFile = `${crypto.randomUUID()}.${formats[file.type]}`;
    const { error } = await storageClient.storage.from("foto-produk").upload(namaFile, file, { contentType: file.type, upsert: false });
    if (error) return { error: "Foto gagal diunggah. Pastikan bucket foto-produk sudah dibuat." };
    const { data } = storageClient.storage.from("foto-produk").getPublicUrl(namaFile);
    return { url: data.publicUrl };
  } catch {
    return { error: "Foto gagal diunggah. Periksa konfigurasi Supabase." };
  }
}

export async function moderasiUlasan(id, tampil) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("ulasan").update({ tampil }).eq("id", id);
  if (error) return { error: "Status ulasan gagal diubah." };
  revalidatePath("/admin/ulasan");
  revalidatePath("/");
  return { success: "Status ulasan diperbarui." };
}

export async function hapusUlasan(id) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("ulasan").delete().eq("id", id);
  if (error) return { error: "Ulasan gagal dihapus." };
  revalidatePath("/admin/ulasan");
  revalidatePath("/");
  return { success: "Ulasan dihapus." };
}

export async function kirimUlasan(prevState, formData) {
  if (String(formData.get("website") || "").trim()) return { success: "Terima kasih. Ulasan akan diperiksa sebelum ditampilkan." };
  const produkId = Number(formData.get("produk_id"));
  const nama = String(formData.get("nama") || "").trim();
  const komentar = String(formData.get("komentar") || "").trim();
  const rating = Number(formData.get("rating"));
  if (!Number.isSafeInteger(produkId) || produkId <= 0) return { error: "Produk tidak valid." };
  if (nama.length < 1 || nama.length > 80) return { error: "Nama wajib diisi (maksimal 80 karakter)." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { error: "Pilih rating 1 sampai 5." };
  if (komentar.length < 3 || komentar.length > 1000) return { error: "Komentar harus 3 sampai 1000 karakter." };
  try {
    const supabase = createServerClient();
    const { error } = await supabase.from("ulasan").insert({ produk_id: produkId, nama, rating, komentar });
    if (error) return { error: "Ulasan gagal dikirim. Coba lagi." };
    revalidatePath(`/produk/${produkId}`);
    return { success: "Terima kasih. Ulasan akan diperiksa sebelum ditampilkan." };
  } catch {
    return { error: "Ulasan gagal dikirim. Coba lagi nanti." };
  }
}
