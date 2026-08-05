import { useEffect, useState } from "react";
import { api } from "../api/client";
import { SkeletonRow, EmptyNote } from "./Common";

const CUSTOM_FEATURES = [
  "Weekend / Weekly Deals",
  "Membership Discounts",
  "Personal Accident Insurance",
  "Minimal Insurance Coverage",
  "No Long-term Commitment",
  "Refundable Deposit",
  "Priority Service",
];

const NEGATIVE_HINTS = ["not included", "excluded", "no ", "without"];

function FeatureRow({ text }) {
  const isNegative = NEGATIVE_HINTS.some((hint) => text.toLowerCase().includes(hint));
  return (
    <li className="flex items-start gap-2.5 py-1.5 text-[13.5px]">
      <span
        className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
          isNegative ? "bg-line text-muted" : "bg-amber/15 text-amber-deep"
        }`}
      >
        {isNegative ? "✕" : "✓"}
      </span>
      <span className={isNegative ? "text-muted line-through decoration-muted/50" : "text-inksoft"}>
        {text}
      </span>
    </li>
  );
}

export default function Pricing() {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    api.getPricingPlans().then(({ data, error }) => setState({ loading: false, data, error }));
  }, []);

  return (
    <section className="bg-soft py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <span className="mb-2.5 flex items-center justify-center gap-2 text-[12.5px] font-semibold tracking-wide text-amber-deep">
            <span>✦</span> Best Pricing in Rental <span>✦</span>
          </span>
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Choose the Right Plan for Your Business
          </h2>
          <p className="mt-2.5 text-muted">
            Whether you're a small startup or a large enterprise, list your fleet on
            MHR-Rent with a plan built around how you rent.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {state.loading && <SkeletonRow count={4} className="h-96 rounded-2xl" />}
          {state.error && <EmptyNote>Pricing plans couldn't be loaded.</EmptyNote>}
          {!state.loading && !state.error && (!state.data || state.data.length === 0) && (
            <EmptyNote>No pricing plans set up yet.</EmptyNote>
          )}

          {state.data?.map((p) => {
            const features = Array.isArray(p.features) ? p.features : [];
            return (
              <div
                key={p.id}
                className={`relative flex h-full flex-col rounded-2xl border bg-white p-8 transition ${
                  p.is_recommended
                    ? "z-10 border-amber shadow-[0_20px_45px_-15px_rgba(247,148,29,0.35)] md:-translate-y-3"
                    : "border-line hover:-translate-y-1 hover:shadow-soft"
                }`}
              >
                {p.is_recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber px-4 py-1 text-[11px] font-bold text-[#1a1200] shadow-sm">
                    ★ Recommended
                  </span>
                )}

                <h4 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
                  {p.name}
                </h4>
                <div className="mb-6 mt-2 font-display text-4xl font-bold">
                  ${Number(p.price).toFixed(0)}
                  <span className="text-[13px] font-medium text-muted"> / {p.billing_cycle}</span>
                </div>

                <ul className="mb-8 flex-1 border-t border-line pt-5">
                  {features.map((f, i) => (
                    <FeatureRow key={i} text={f} />
                  ))}
                </ul>

                <a
                  href="#"
                  className={`block w-full rounded-full py-3 text-center text-sm font-semibold transition hover:-translate-y-0.5 ${
                    p.is_recommended ? "bg-amber text-[#1a1200]" : "bg-ink text-white"
                  }`}
                >
                  Choose Plan
                </a>
              </div>
            );
          })}

          {/* static custom / contact-us card */}
          {!state.loading && !state.error && state.data && state.data.length > 0 && (
            <div className="flex h-full flex-col rounded-2xl bg-gradient-to-b from-emerald-600 to-emerald-700 p-8 text-white">
              <h4 className="text-[13px] font-semibold uppercase tracking-wide text-emerald-100">
                Custom
              </h4>
              <div className="mb-6 mt-2 font-display text-3xl font-bold">Contact Us</div>

              <ul className="mb-8 flex-1 border-t border-white/20 pt-5">
                {CUSTOM_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 py-1.5 text-[13.5px]">
                    <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="mailto:hello@MHR.rent.example"
                className="block w-full rounded-full bg-white py-3 text-center text-sm font-semibold text-emerald-700 transition hover:-translate-y-0.5"
              >
                Contact Us
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}