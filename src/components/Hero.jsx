import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroBg from "../assets/hero-bg.webp";

export default function Hero({ startingPrice }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ city: "", pickup_date: "", return_date: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(Object.entries(form).filter(([, v]) => v));
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <section id="home" className="relative min-h-[620px] overflow-hidden text-white">
      {/* full-bleed background image */}
      <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
      {/* darken the image so the overlaid text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40" />

      <div className="relative pt-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex justify-center md:justify-end">
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.2)]" />
              Available for Rent
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-xl text-center md:mx-0 md:text-left">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-amber/10 px-4 py-1.5 text-sm font-medium text-amber backdrop-blur">
              ★ Trusted by 6,000+ renters
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Explore our <span className="text-amber">Verified &amp; Professional</span> Cars
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/80 md:mx-0">
              From weekend runabouts to grand-tour cruisers — every listing on MHR Rent is
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

          {startingPrice && (
            <div className="mt-8 flex justify-center md:justify-end">
              <div className="rounded-2xl bg-white px-5 py-3 text-ink shadow-soft">
                <span className="block text-[11px] text-muted">Starting from</span>
                <strong className="font-display text-xl">
                  ${startingPrice}
                  <i className="ml-1 text-xs font-medium not-italic text-muted">/day</i>
                </strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* search bar */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-20 md:pb-24">
        <form
          onSubmit={handleSubmit}
          className="relative z-10 mt-11 grid translate-y-1/2 grid-cols-1 gap-0 rounded-3xl bg-white p-2.5 shadow-soft md:grid-cols-[1.3fr_1fr_1fr_auto]"
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
