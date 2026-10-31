export default function manifest() {
  return {
    id: "/",
    name: "Katalog Toko Hanif",
    short_name: "Toko Hanif",
    description: "Katalog produk Toko Hanif dan pemesanan melalui WhatsApp.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1f6b4f",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
