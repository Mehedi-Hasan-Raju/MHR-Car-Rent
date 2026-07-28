import { useEffect, useState } from "react";
import { api } from "../api/client";

const STEPS = [
  { num: "01", title: "Choose dates & location", desc: "Tell us when and where you need wheels." },
  { num: "02", title: "Pick your car", desc: "Filter by category, brand, or budget." },
  { num: "03", title: "Book & drive", desc: "Confirm instantly, no paperwork queue." },
];

export default function StepsStats({ brandCount }) {
  const [stats, setStats] = useState({ cars: "—", cities: "—", reviews: "—" });

  useEffect(() => {
    (async () => {
      const [{ meta }, { data: cityBatch }, { data: testimonials }] = await Promise.all([
        api.getVehicles("?limit=1"),
        api.getVehicles("?limit=100"),
        api.getTestimonials(),
      ]);

      const cities = new Set((cityBatch || []).map((v) => v.city).filter(Boolean));

      setStats({
        cars: meta ? meta.total : 0,
        cities: cities.size || 0,
        reviews: (testimonials || []).length,
      });
    })();
  }, []);

  return (
    <section className="py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 md:grid-cols-2">
        <div>
          <span className="mb-2.5 block text-[12.5px] font-semibold tracking-wide text-amber-deep">
            ✦ How it works
          </span>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Rent our cars in 3 steps</h2>

          <ol className="mt-4">
            {STEPS.map((s, i) => (
              <li
                key={s.num}
                className={`flex gap-5 py-5 ${i !== STEPS.length - 1 ? "border-b border-line" : ""}`}
              >
                <span className="flex-shrink-0 font-display text-xl font-bold text-amber">{s.num}</span>
                <div>
                  <h4 className="mb-1 text-[15.5px] font-semibold">{s.title}</h4>
                  <p className="text-[13.5px] text-muted">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid grid-cols-2 gap-6 rounded-[22px] bg-ink p-9 text-white">
          <div>
            <strong className="block font-display text-3xl font-bold text-amber">{stats.cars}</strong>
            <span className="text-[12.5px] text-white/60">Cars Listed</span>
          </div>
          <div>
            <strong className="block font-display text-3xl font-bold text-amber">{stats.cities}</strong>
            <span className="text-[12.5px] text-white/60">Pickup Locations</span>
          </div>
          <div>
            <strong className="block font-display text-3xl font-bold text-amber">{brandCount ?? "—"}</strong>
            <span className="text-[12.5px] text-white/60">Brands Available</span>
          </div>
          <div>
            <strong className="block font-display text-3xl font-bold text-amber">{stats.reviews}</strong>
            <span className="text-[12.5px] text-white/60">Verified Reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}
