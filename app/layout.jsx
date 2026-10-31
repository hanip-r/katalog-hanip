import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceWorker from "@/app/ServiceWorker";
import { AppState } from "@/components/AppState";
import { getTokoSettings } from "@/lib/toko-server";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const toko = await getTokoSettings();
  return {
    title: toko.nama,
    description: toko.tagline,
    manifest: "/manifest.webmanifest",
    icons: { icon: "/icons/icon-192.png", apple: "/icons/icon-192.png" },
  };
}

export const viewport = {
  themeColor: "#1f6b4f",
};

export default async function RootLayout({ children }) {
  const toko = await getTokoSettings();
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap"
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <ServiceWorker />
        <AppState toko={toko}>
          <Header />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4">{children}</main>
          <Footer toko={toko} />
        </AppState>
      </body>
    </html>
  );
}
