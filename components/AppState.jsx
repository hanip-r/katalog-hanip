"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const StoreContext = createContext(null);
const KEYS = { cart: "hanip-cart", favorites: "hanip-favorites", recent: "hanip-recent", compare: "hanip-compare", theme: "hanip-theme" };
const productSnapshot = (product) => ({
  id: product.id,
  nama: product.nama,
  harga: Number(product.harga),
  harga_diskon: product.harga_diskon || null,
  foto_url: product.foto_url || "",
  foto_galeri: product.foto_galeri || [],
  kategori: product.kategori || "",
  deskripsi: product.deskripsi || "",
  badge: product.badge || null,
});

export function AppState({ children, toko }) {
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);
  const [compare, setCompare] = useState([]);
  const [theme, setTheme] = useState("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = (key, fallback) => {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
    };
    setCartItems(read(KEYS.cart, []));
    setFavorites(read(KEYS.favorites, []));
    setRecent(read(KEYS.recent, []));
    setCompare(read(KEYS.compare, []));
    setTheme(read(KEYS.theme, "light") === "dark" ? "dark" : "light");
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEYS.cart, JSON.stringify(cartItems));
    localStorage.setItem(KEYS.favorites, JSON.stringify(favorites));
    localStorage.setItem(KEYS.recent, JSON.stringify(recent));
    localStorage.setItem(KEYS.compare, JSON.stringify(compare));
    localStorage.setItem(KEYS.theme, JSON.stringify(theme));
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [cartItems, favorites, recent, compare, theme, ready]);

  const value = useMemo(() => ({
    cartItems, favorites, recent, compare, theme, ready, toko,
    addToCart(product, quantity = 1) {
      const snapshot = productSnapshot(product);
      setCartItems((items) => {
        const existing = items.find((item) => String(item.id) === String(snapshot.id));
        return existing
          ? items.map((item) => String(item.id) === String(snapshot.id) ? { ...item, quantity: Math.min(99, item.quantity + quantity) } : item)
          : [...items, { ...snapshot, quantity: Math.min(99, quantity) }];
      });
    },
    setQuantity(id, quantity) { setCartItems((items) => items.map((item) => String(item.id) === String(id) ? { ...item, quantity: Math.min(99, Math.max(1, quantity || 1)) } : item)); },
    removeFromCart(id) { setCartItems((items) => items.filter((item) => String(item.id) !== String(id))); },
    clearCart() { setCartItems([]); },
    toggleFavorite(product) {
      const snapshot = productSnapshot(product);
      setFavorites((items) => items.some((item) => String(item.id) === String(snapshot.id)) ? items.filter((item) => String(item.id) !== String(snapshot.id)) : [snapshot, ...items]);
    },
    addRecent(product) {
      const snapshot = productSnapshot(product);
      setRecent((items) => [snapshot, ...items.filter((item) => String(item.id) !== String(snapshot.id))].slice(0, 8));
    },
    toggleCompare(product) {
      const snapshot = productSnapshot(product);
      if (compare.some((item) => String(item.id) === String(snapshot.id))) {
        setCompare((items) => items.filter((item) => String(item.id) !== String(snapshot.id)));
        return true;
      }
      if (compare.length >= 2) return false;
      setCompare((items) => [...items, snapshot]);
      return true;
    },
    removeCompare(id) { setCompare((items) => items.filter((item) => String(item.id) !== String(id))); },
    toggleTheme() { setTheme((current) => current === "dark" ? "light" : "dark"); },
  }), [cartItems, favorites, recent, compare, theme, ready, toko]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore harus dipakai di dalam AppState.");
  return store;
}
