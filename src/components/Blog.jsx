import { useEffect, useState } from "react";
import { api } from "../api/client";
import { SkeletonRow, EmptyNote } from "./Common";

export default function Blog() {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    api.getBlogs().then(({ data, error }) => setState({ loading: false, data, error }));
  }, []);

  return (
    <section id="insights" className="bg-soft py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-11 max-w-xl">
          <span className="mb-2.5 block text-[12.5px] font-semibold tracking-wide text-amber-deep">
            ✦ Insights &amp; innovations
          </span>
          <h2 className="font-display text-3xl font-bold md:text-4xl">From the MHR Rent journal</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {state.loading && <SkeletonRow count={3} className="h-72 rounded-2xl" />}
          {state.error && <EmptyNote>Blog posts couldn't be loaded.</EmptyNote>}
          {!state.loading && !state.error && (!state.data || state.data.length === 0) && (
            <EmptyNote>No blog posts published yet.</EmptyNote>
          )}
          {state.data?.slice(0, 3).map((b) => (
            <a key={b.id} href="#" className="overflow-hidden rounded-2xl border border-line bg-white">
              <div className="aspect-[16/10] bg-gradient-to-br from-[#EDEEF2] to-[#F8F9FB]">
                {b.thumbnail_url && (
                  <img src={b.thumbnail_url} alt={b.title} loading="lazy" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="p-5">
                <span className="text-[11.5px] font-bold uppercase tracking-wide text-amber-deep">
                  {b.category || "General"}
                </span>
                <h4 className="my-2 text-[15px] font-semibold leading-snug">{b.title}</h4>
                <time className="text-xs text-muted">
                  {new Date(b.published_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
