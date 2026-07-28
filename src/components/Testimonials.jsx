import { useEffect, useState } from "react";
import { api } from "../api/client";
import { SkeletonRow, EmptyNote, Stars, initials } from "./Common";

export default function Testimonials() {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    api.getTestimonials().then(({ data, error }) => setState({ loading: false, data, error }));
  }, []);

  return (
    <section id="feedback" className="bg-soft py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-11 max-w-xl">
          <span className="mb-2.5 block text-[12.5px] font-semibold tracking-wide text-amber-deep">
            ✦ Word on the road
          </span>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Our clients' feedback</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {state.loading && <SkeletonRow count={3} className="h-56 rounded-2xl" />}
          {state.error && <EmptyNote>Reviews couldn't be loaded.</EmptyNote>}
          {!state.loading && !state.error && (!state.data || state.data.length === 0) && (
            <EmptyNote>No client reviews yet.</EmptyNote>
          )}
          {state.data?.slice(0, 3).map((t) => (
            <div key={t.id} className="rounded-2xl border border-line bg-white p-7">
              <div className="mb-3 text-sm">
                <Stars rating={t.rating} />
              </div>
              <p className="text-sm leading-relaxed text-inksoft">"{t.feedback}"</p>
              <div className="mt-5 flex items-center gap-2.5">
                {t.avatar_url ? (
                  <img
                    src={t.avatar_url}
                    alt={t.customer_name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber text-sm font-bold text-[#1a1200]">
                    {initials(t.customer_name)}
                  </div>
                )}
                <div>
                  <strong className="block text-sm">{t.customer_name}</strong>
                  <span className="text-xs text-muted">{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
