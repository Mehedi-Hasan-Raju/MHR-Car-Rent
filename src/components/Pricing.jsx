import { useEffect, useState } from "react";
import { api } from "../api/client";
import { SkeletonRow, EmptyNote } from "./Common";

export default function Pricing() {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    api.getPricingPlans().then(({ data, error }) => setState({ loading: false, data, error }));
  }, []);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-11 max-w-xl">
          <span className="mb-2.5 block text-[12.5px] font-semibold tracking-wide text-amber-deep">
            ✦ For fleet owners
          </span>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Best pricing in rental</h2>
          <p className="mt-2.5 text-muted">List your own fleet on DreamsRent with a plan that fits.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {state.loading && <SkeletonRow count={3} className="h-80 rounded-2xl" />}
          {state.error && <EmptyNote>Pricing plans couldn't be loaded.</EmptyNote>}
          {!state.loading && !state.error && (!state.data || state.data.length === 0) && (
            <EmptyNote>No pricing plans set up yet.</EmptyNote>
          )}
          {state.data?.map((p) => {
            const features = Array.isArray(p.features) ? p.features : [];
            return (
              <div
                key={p.id}
                className={`relative rounded-2xl border bg-white p-8 ${
                  p.is_recommended ? "border-amber shadow-[0_0_0_3px_rgba(247,148,29,0.12)]" : "border-line"
                }`}
              >
                {p.is_recommended && (
                  <span className="absolute -top-3 right-6 rounded-full bg-amber px-3 py-1 text-[11px] font-bold text-[#1a1200]">
                    Recommended
                  </span>
                )}
                <h4 className="mb-1.5 text-base font-semibold">{p.name}</h4>
                <div className="mb-5 font-display text-3xl font-bold">
                  ${Number(p.price).toFixed(0)}{" "}
                  <span className="text-[13px] font-medium text-muted">/ {p.billing_cycle}</span>
                </div>
                <ul className="mb-6">
                  {features.map((f, i) => (
                    <li key={i} className="flex gap-2 py-1.5 text-[13.5px] text-inksoft before:font-bold before:text-amber-deep before:content-['✓']">
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className={`block w-full rounded-full py-3 text-center text-sm font-semibold ${
                    p.is_recommended ? "bg-amber text-[#1a1200]" : "bg-ink text-white"
                  }`}
                >
                  Choose Plan
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
