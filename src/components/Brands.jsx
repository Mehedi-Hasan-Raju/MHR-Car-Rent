import { useEffect, useState } from "react";
import { api } from "../api/client";
import { SkeletonRow, EmptyNote } from "./Common";

export default function Brands({ onCountLoaded }) {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    api.getBrands().then(({ data, error }) => {
      setState({ loading: false, data, error });
      if (data) onCountLoaded?.(data.length);
    });
  }, [onCountLoaded]);

  return (
    <section className="bg-ink py-24 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-11 max-w-xl">
          <span className="mb-2.5 block text-[12.5px] font-semibold tracking-wide text-amber-deep">
            ✦ Rent by brand
          </span>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Every marque, one garage</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3.5">
          {state.loading && <SkeletonRow count={5} className="h-11 w-32 rounded-full" />}
          {state.error && <EmptyNote>Brands couldn't be loaded.</EmptyNote>}
          {!state.loading && !state.error && (!state.data || state.data.length === 0) && (
            <EmptyNote>No brands added yet.</EmptyNote>
          )}
          {state.data?.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold"
            >
              {b.name} <span className="text-[12.5px] font-normal text-white/50">{b.vehicle_count} cars</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
