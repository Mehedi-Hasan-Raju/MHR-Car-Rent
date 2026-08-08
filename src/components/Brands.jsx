import { useEffect, useState } from "react";
import { api } from "../api/client";
import { SkeletonRow, EmptyNote } from "./Common";
import brandsCarImg from "../assets/brands-car.png";

export default function Brands({ onCountLoaded }) {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    api.getBrands().then(({ data, error }) => {
      setState({ loading: false, data, error });
      if (data) onCountLoaded?.(data.length);
    });
  }, [onCountLoaded]);

  return (
    <section className="relative overflow-hidden bg-neutral-950 py-24 text-white">
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Rent by Brands</h2>
        <p className="mx-auto mt-2.5 max-w-md text-[15px] text-white/50">
          Here's a list of some of the most popular cars globally
        </p>

        <div className="mt-16 flex flex-wrap justify-center gap-x-16 gap-y-10">
          {state.loading && <SkeletonRow count={6} className="h-16 w-24 bg-white/5" />}
          {state.error && <EmptyNote>Brands couldn't be loaded.</EmptyNote>}
          {!state.loading && !state.error && (!state.data || state.data.length === 0) && (
            <EmptyNote>No brands added yet.</EmptyNote>
          )}
          {state.data?.map((b) => (
            <div key={b.id} className="flex flex-col items-center gap-3" title={b.name}>
              {b.logo_url ? (
                <img
                  src={b.logo_url}
                  alt={b.name}
                  className="h-11 max-w-[96px] object-contain opacity-60 grayscale brightness-[3.5] transition hover:opacity-100 hover:grayscale-0 hover:brightness-100"
                />
              ) : (
                <span className="flex h-11 items-center text-lg font-bold text-white/40">{b.name}</span>
              )}
              <span className="text-sm font-bold text-white/85">{b.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* decorative car image fading into the bottom of the section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 overflow-hidden">
        <img
          src={brandsCarImg}
          alt=""
          className="absolute bottom-[-30px] left-1/2 w-[92%] max-w-3xl -translate-x-1/2 select-none object-contain opacity-90"
        />
      </div>
    </section>
  );
}