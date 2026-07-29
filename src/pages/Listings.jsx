import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import CarCard from "../components/CarCard.jsx";
import ListingsMap from "../components/ListingsMap.jsx";
import { SkeletonRow, EmptyNote } from "../components/Common.jsx";
import { api } from "../api/client";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const PAGE_SIZES = [6, 9, 12, 15];

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ---- filter state, seeded from the URL (so a Hero search lands here pre-filled) ----
  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    pickup_date: searchParams.get("pickup_date") || "",
    return_date: searchParams.get("return_date") || "",
    category_id: searchParams.get("category_id") || "",
    brand_id: searchParams.get("brand_id") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    sort: searchParams.get("sort") || "newest",
    limit: searchParams.get("limit") || "9",
    page: Number(searchParams.get("page") || 1),
  });

  const [view, setView] = useState("grid"); // grid | list | map
  const [showFilters, setShowFilters] = useState(false);

  const [vehicles, setVehicles] = useState({ loading: true, data: null, total: 0, error: null });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // ---- lookups for the filter dropdowns ----
  useEffect(() => {
    api.getCategories().then(({ data }) => setCategories(data || []));
    api.getBrands().then(({ data }) => setBrands(data || []));
  }, []);

  // ---- build the query string once, keep URL + fetch in sync ----
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  useEffect(() => {
    setSearchParams(filters, { replace: true });
    setVehicles((s) => ({ ...s, loading: true }));

    api.getVehicles(`?${queryString}`).then(({ data, meta, error }) => {
      setVehicles({ loading: false, data, total: meta?.total || 0, error });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const updateFilter = (patch) => setFilters((f) => ({ ...f, ...patch, page: 1 }));

  const totalPages = Math.max(1, Math.ceil(vehicles.total / Number(filters.limit)));

  return (
    <>
      <Navbar />

      {/* ---- header + search ---- */}
      <section
        className="relative py-16 text-white"
        style={{ backgroundImage: "radial-gradient(120% 140% at 15% 0%, #22232B 0%, #14151A 55%)" }}
      >
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="font-display text-3xl font-bold md:text-4xl">Car Listings</h1>
          <p className="mt-2 text-sm text-white/60">Home / Listings</p>
        </div>

        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-0 rounded-3xl bg-white p-2.5 text-ink shadow-soft sm:grid-cols-[1.3fr_1fr_1fr_auto]">
          <div className="border-b border-line px-5 py-2.5 sm:border-b-0 sm:border-r">
            <label className="mb-1 block text-xs font-semibold text-muted">Pickup Location</label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => updateFilter({ city: e.target.value })}
              placeholder="Enter city or address"
              className="w-full border-none text-sm outline-none"
            />
          </div>
          <div className="border-b border-line px-5 py-2.5 sm:border-b-0 sm:border-r">
            <label className="mb-1 block text-xs font-semibold text-muted">Pickup Date</label>
            <input
              type="date"
              value={filters.pickup_date}
              onChange={(e) => updateFilter({ pickup_date: e.target.value })}
              className="w-full border-none text-sm outline-none"
            />
          </div>
          <div className="px-5 py-2.5">
            <label className="mb-1 block text-xs font-semibold text-muted">Return Date</label>
            <input
              type="date"
              value={filters.return_date}
              onChange={(e) => updateFilter({ return_date: e.target.value })}
              className="w-full border-none text-sm outline-none"
            />
          </div>
          <button
            onClick={() => updateFilter({})}
            className="m-1.5 flex items-center justify-center gap-2 rounded-full bg-amber px-6 py-3.5 text-sm font-semibold text-[#1a1200] transition hover:-translate-y-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Search
          </button>
        </div>
      </section>

      {/* ---- toolbar ---- */}
      <div className="border-b border-line bg-white py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6">
          <span className="text-sm text-muted">
            {vehicles.loading ? "Loading…" : `Showing ${vehicles.data?.length || 0} of ${vehicles.total} Cars`}
          </span>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium"
            >
              ⏷ Filter
            </button>

            <select
              value={filters.limit}
              onChange={(e) => updateFilter({ limit: e.target.value })}
              className="rounded-full border border-line px-4 py-2 text-sm outline-none"
            >
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n}>
                  Show: {n}
                </option>
              ))}
            </select>

            <select
              value={filters.sort}
              onChange={(e) => updateFilter({ sort: e.target.value })}
              className="rounded-full border border-line px-4 py-2 text-sm outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  Sort By: {o.label}
                </option>
              ))}
            </select>

            <div className="flex overflow-hidden rounded-full border border-line">
              {["grid", "list", "map"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setView(mode)}
                  className={`px-3.5 py-2 text-sm ${
                    view === mode ? "bg-ink text-white" : "text-inksoft"
                  }`}
                  aria-label={`${mode} view`}
                >
                  {mode === "grid" ? "▦" : mode === "list" ? "☰" : "📍"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ---- expandable filter row ---- */}
        {showFilters && (
          <div className="mx-auto mt-4 grid max-w-6xl grid-cols-2 gap-3 px-6 sm:grid-cols-4">
            <select
              value={filters.category_id}
              onChange={(e) => updateFilter({ category_id: e.target.value })}
              className="rounded-xl border border-line px-3 py-2.5 text-sm outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={filters.brand_id}
              onChange={(e) => updateFilter({ brand_id: e.target.value })}
              className="rounded-xl border border-line px-3 py-2.5 text-sm outline-none"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="0"
              placeholder="Min price / day"
              value={filters.min_price}
              onChange={(e) => updateFilter({ min_price: e.target.value })}
              className="rounded-xl border border-line px-3 py-2.5 text-sm outline-none"
            />

            <input
              type="number"
              min="0"
              placeholder="Max price / day"
              value={filters.max_price}
              onChange={(e) => updateFilter({ max_price: e.target.value })}
              className="rounded-xl border border-line px-3 py-2.5 text-sm outline-none"
            />
          </div>
        )}
      </div>

      {/* ---- results ---- */}
      <section className="bg-soft py-10">
        <div className="mx-auto max-w-6xl px-6">
          {view === "map" ? (
            <ListingsMap vehicles={vehicles.data} />
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col gap-5"
              }
            >
              {vehicles.loading && (
                <SkeletonRow count={Number(filters.limit) > 6 ? 6 : Number(filters.limit)} className="h-72 rounded-2xl" />
              )}
              {vehicles.error && (
                <EmptyNote>Cars couldn't be loaded — check that the backend is running.</EmptyNote>
              )}
              {!vehicles.loading && !vehicles.error && (!vehicles.data || vehicles.data.length === 0) && (
                <EmptyNote>No cars match these filters. Try widening your search.</EmptyNote>
              )}
              {vehicles.data?.map((v) => (
                <CarCard key={v.id} v={v} layout={view} />
              ))}
            </div>
          )}

          {/* ---- pagination ---- */}
          {!vehicles.loading && vehicles.total > Number(filters.limit) && view !== "map" && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                disabled={filters.page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                className="rounded-full border border-line px-4 py-2 text-sm font-medium disabled:opacity-40"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))}
                  className={`h-9 w-9 rounded-full text-sm font-medium ${
                    filters.page === i + 1 ? "bg-ink text-white" : "border border-line text-inksoft"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={filters.page >= totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                className="rounded-full border border-line px-4 py-2 text-sm font-medium disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
