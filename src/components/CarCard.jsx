import { Stars } from "./Common";

export default function CarCard({ v, layout = "grid" }) {
  const price = Number(v.daily_rent_price || 0).toFixed(0);
  const rating = Number(v.avg_rating || 0).toFixed(1);
  const reviewCount = v.review_count || 0;
  const image = v.primary_image || v.thumbnail_url;

  const media = (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#EDEEF2] to-[#F8F9FB] ${
        layout === "list" ? "aspect-[4/3] sm:aspect-auto sm:h-full" : "aspect-[16/10]"
      }`}
    >
      {image ? (
        <img src={image} alt={v.vehicle_name} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="opacity-25">
          <path
            d="M3 13l1.6-4.8A2 2 0 0 1 6.5 7h11a2 2 0 0 1 1.9 1.2L21 13v6a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6Z"
            stroke="#14151A"
            strokeWidth="1.4"
          />
        </svg>
      )}
      {v.is_featured ? (
        <span className="absolute left-3 top-3 rounded-full bg-amber px-2.5 py-1 text-[11.5px] font-bold uppercase text-[#1a1200]">
          Featured
        </span>
      ) : v.is_top_rated ? (
        <span className="absolute left-3 top-3 rounded-full bg-amber px-2.5 py-1 text-[11.5px] font-bold uppercase text-[#1a1200]">
          Top Rated
        </span>
      ) : null}
    </div>
  );

  const body = (
    <div className="flex flex-1 flex-col p-5">
      <div className="flex items-start justify-between gap-2.5">
        <div>
          <h4 className="text-base font-semibold">{v.vehicle_name}</h4>
          <span className="text-[12.5px] text-muted">
            {v.category_name || v.type}
            {v.brand_name ? ` · ${v.brand_name}` : ""}
          </span>
        </div>
        <div className="whitespace-nowrap text-right font-display text-lg font-bold text-amber-deep">
          ${price}
          <i className="block text-[11px] font-medium not-italic text-muted">/ day</i>
        </div>
      </div>

      <div className="my-2.5 flex items-center gap-1.5 text-sm text-inksoft">
        <Stars rating={rating} /> <span className="text-muted">{rating} ({reviewCount} reviews)</span>
      </div>

      <div className="my-2 flex flex-wrap gap-x-3.5 gap-y-2 border-y border-dashed border-line py-3 text-[12.5px] text-muted">
        {v.transmission && <span>⚙ {v.transmission}</span>}
        {v.fuel_type && <span>⛽ {v.fuel_type}</span>}
        {v.seats && <span>👤 {v.seats} Seats</span>}
        {v.model_year && <span>📅 {v.model_year}</span>}
      </div>

      <div className="mt-auto flex items-center justify-between pt-1">
        <span className="flex items-center gap-1 text-[12.5px] text-muted">
          📍 {[v.city, v.country].filter(Boolean).join(", ") || "Location not set"}
        </span>
        <a
          href="#"
          className="rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-white transition hover:-translate-y-0.5"
        >
          Rent Now
        </a>
      </div>
    </div>
  );

  if (layout === "list") {
    return (
      <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-line bg-white transition hover:shadow-soft sm:grid-cols-[260px_1fr]">
        {media}
        {body}
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-soft">
      {media}
      {body}
    </div>
  );
}
