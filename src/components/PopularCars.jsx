import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { SkeletonRow, EmptyNote } from "./Common";
import CarCard from "./CarCard";

export default function PopularCars({ onPriceLoaded }) {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    api.getPopularVehicles(6).then(({ data, error }) => {
      setState({ loading: false, data, error });
      if (data?.length) {
        const cheapest = Math.min(...data.map((v) => Number(v.daily_rent_price || Infinity)));
        if (isFinite(cheapest)) onPriceLoaded?.(cheapest.toFixed(0));
      }
    });
  }, [onPriceLoaded]);

  return (
    <section id="listings" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-11 max-w-xl">
          <span className="mb-2.5 block text-[12.5px] font-semibold tracking-wide text-amber-deep">
            ✦ Fresh off the lot
          </span>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Explore Most Popular Cars</h2>
          <p className="mt-2.5 text-muted">The listings renters keep coming back for.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {state.loading && <SkeletonRow count={3} className="h-72 rounded-2xl" />}
          {state.error && <EmptyNote>Cars couldn't be loaded — check that the backend is running.</EmptyNote>}
          {!state.loading && !state.error && (!state.data || state.data.length === 0) && (
            <EmptyNote>No vehicles listed yet.</EmptyNote>
          )}
          {state.data?.map((v) => (
            <CarCard key={v.id} v={v} />
          ))}
        </div>

        <div className="mt-9 text-center">
          <Link to="/listings" className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white">
            View All Cars
          </Link>
        </div>
      </div>
    </section>
  );
}
