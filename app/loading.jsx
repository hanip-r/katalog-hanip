export default function Loading() {
  return <div role="status" aria-live="polite" className="flex flex-col gap-4 py-10">
    <span className="sr-only">Memuat halaman…</span>
    <div className="h-8 w-48 animate-pulse rounded-lg bg-permukaan" />
    <div className="h-4 w-72 max-w-full animate-pulse rounded bg-permukaan" />
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <div key={i} className="aspect-square animate-pulse rounded-2xl bg-permukaan" />)}</div>
  </div>;
}
