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

        <div className="flex flex-wrap justify-center gap-4">
          {state.loading && <SkeletonRow count={5} className="h-20 w-40 rounded-2xl" />}
          {state.error && <EmptyNote>Brands couldn't be loaded.</EmptyNote>}
          {!state.loading && !state.error && (!state.data || state.data.length === 0) && (
            <EmptyNote>No brands added yet.</EmptyNote>
          )}
          {state.data?.map((b) => (
            <div
              key={b.id}
              className="flex h-20 w-40 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4"
              title={b.name}
            >
              {b.logo_url ? (
                <img src={b.logo_url} alt={b.name} className="max-h-14 max-w-full object-contain" />
              ) : (
                <span className="text-sm font-semibold text-white/70">{b.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
