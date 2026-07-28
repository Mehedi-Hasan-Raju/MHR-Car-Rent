import { useEffect, useState } from "react";
import { api } from "../api/client";
import { SkeletonRow, EmptyNote } from "./Common";

const ICONS = {
  sedan: "🚗",
  suv: "🚙",
  crossover: "🚘",
  pickup: "🛻",
  "sports car": "🏎️",
  "sports coupe": "🏎️",
  mpv: "🚐",
  van: "🚐",
  hatchback: "🚗",
};

const iconFor = (name = "") => ICONS[name.toLowerCase()] || "🚗";

export default function Categories() {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    api.getCategories().then(({ data, error }) => setState({ loading: false, data, error }));
  }, []);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-11 max-w-xl">
          <span className="mb-2.5 block text-[12.5px] font-semibold tracking-wide text-amber-deep">
            ✦ Browse by type
          </span>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Featured Categories</h2>
          <p className="mt-2.5 text-muted">
            Know exactly what you're looking for? Jump straight into a body style.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {state.loading && <SkeletonRow count={6} className="h-32 rounded-2xl" />}
          {state.error && <EmptyNote>Categories couldn't be loaded — check that the backend is running.</EmptyNote>}
          {!state.loading && !state.error && (!state.data || state.data.length === 0) && (
            <EmptyNote>No categories yet. Add some from the admin panel.</EmptyNote>
          )}
          {state.data?.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-line bg-white p-6 text-center transition hover:-translate-y-1 hover:border-transparent hover:shadow-soft"
            >
              <div className="mb-2.5 text-2xl">{iconFor(c.name)}</div>
              <h4 className="text-sm font-semibold">{c.name}</h4>
              <span className="mt-0.5 block text-xs text-muted">
                {c.vehicle_count} Car{c.vehicle_count === 1 ? "" : "s"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
