import { useState } from "react";

export default function Hero({ startingPrice }) {
  const [form, setForm] = useState({ city: "", pickup_date: "", return_date: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(Object.entries(form).filter(([, v]) => v));
    // Wire this to your real listings route/page when it exists
    window.location.hash = `listings?${params.toString()}`;
    document.querySelector("#listings")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-ink pt-20 text-white"
      style={{
        backgroundImage:
          "radial-gradient(120% 140% at 15% 0%, #22232B 0%, #14151A 55%)",
      }}
    >
      <div className="pointer-events-none absolute -right-10 -top-20 h-[520px] w-[520px] rounded-full bg-amber/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2">
        <div className="text-center md:text-left">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-amber/10 px-4 py-1.5 text-sm font-medium text-amber">
            ★ Trusted by 6,000+ renters
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Explore our <span className="text-amber">Verified &amp;<br />Professional</span> Cars
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/70 md:mx-0">
            From weekend runabouts to grand-tour cruisers — every listing on DreamsRent is
            inspected, insured, and ready for the road you have in mind.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <a
              href="#listings"
              className="rounded-full bg-amber px-7 py-3.5 text-sm font-semibold text-[#1a1200] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-10px_rgba(247,148,29,0.6)]"
            >
              Rent a Car
            </a>
            <a
              href="#"
              className="rounded-full border border-white/35 px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              List Your Car
            </a>
          </div>
        </div>

        <div className="relative flex min-h-[280px] items-center justify-center">
          <div className="absolute left-0 top-1.5 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.2)]" />
            Available for Rent
          </div>

          <svg
            viewBox="0 0 520 260"
            className="w-full max-w-[440px] drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]"
            fill="none"
          >
            <ellipse cx="260" cy="230" rx="200" ry="16" fill="black" opacity="0.25" />
            <path
              d="M60 165c0-14 10-26 24-30l40-12 34-46c8-11 21-17 34-17h96c15 0 29 7 38 19l36 47 34 9c15 4 24 17 24 32v34a14 14 0 0 1-14 14H74a14 14 0 0 1-14-14v-46Z"
              fill="url(#carBody)"
            />
            <path
              d="M168 96l24-38c4-6 11-10 18-10h84c8 0 15 4 19 10l26 38H168Z"
              fill="#20222A"
            />
            <path
              d="M178 92l18-27c3-4 7-6 12-6h64c5 0 9 2 12 6l19 27H178Z"
              fill="#3B3E4A"
            />
            <rect x="60" y="150" width="400" height="10" fill="#0F1013" />
            <circle cx="152" cy="196" r="34" fill="#14151A" />
            <circle cx="152" cy="196" r="16" fill="#5A5D6B" />
            <circle cx="368" cy="196" r="34" fill="#14151A" />
            <circle cx="368" cy="196" r="16" fill="#5A5D6B" />
            <rect x="404" y="118" width="26" height="12" rx="3" fill="#F7941D" />
            <rect x="78" y="122" width="20" height="10" rx="3" fill="#E5E7EB" />
            <defs>
              <linearGradient id="carBody" x1="60" y1="106" x2="460" y2="213" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F7941D" />
                <stop offset="1" stopColor="#C9660A" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute bottom-3 right-1.5 rounded-2xl bg-white px-5 py-3 text-ink shadow-soft">
            <span className="block text-[11px] text-muted">Starting from</span>
            <strong className="font-display text-xl">
              {startingPrice ? `$${startingPrice}` : "—"}
              <i className="ml-1 text-xs font-medium not-italic text-muted">/day</i>
            </strong>
          </div>
        </div>
      </div>

      {/* search bar */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-20 md:pb-24">
        <form
          onSubmit={handleSubmit}
          className="z-10 mt-11 grid translate-y-1/2 grid-cols-1 gap-0 rounded-3xl bg-white p-2.5 shadow-soft md:grid-cols-[1.3fr_1fr_1fr_auto]"
        >
          <div className="border-b border-line px-5 py-2.5 md:border-b-0 md:border-r">
            <label className="mb-1 block text-xs font-semibold text-muted">Pickup Location</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              type="text"
              placeholder="Enter city or address"
              className="w-full border-none text-sm outline-none"
            />
          </div>
          <div className="border-b border-line px-5 py-2.5 md:border-b-0 md:border-r">
            <label className="mb-1 block text-xs font-semibold text-muted">Pickup Date</label>
            <input
              name="pickup_date"
              value={form.pickup_date}
              onChange={handleChange}
              type="date"
              className="w-full border-none text-sm outline-none"
            />
          </div>
          <div className="border-b border-line px-5 py-2.5 md:border-b-0">
            <label className="mb-1 block text-xs font-semibold text-muted">Return Date</label>
            <input
              name="return_date"
              value={form.return_date}
              onChange={handleChange}
              type="date"
              className="w-full border-none text-sm outline-none"
            />
          </div>
          <button
            type="submit"
            className="m-1.5 flex items-center justify-center gap-2 rounded-full bg-amber px-6 py-3.5 text-sm font-semibold text-[#1a1200] transition hover:-translate-y-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Search Cars
          </button>
        </form>
      </div>
    </section>
  );
}
