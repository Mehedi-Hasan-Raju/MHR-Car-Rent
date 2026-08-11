import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Stars, initials } from "../components/Common.jsx";
import { api } from "../api/client";
import { getSession } from "../auth/session";

const EXTRA_SERVICES = [
  { icon: "📡", label: "GPS Navigation" },
  { icon: "📶", label: "Wi-Fi Hotspot" },
  { icon: "🧒", label: "Child Safety Seats" },
  { icon: "⛽", label: "Fuel Options" },
  { icon: "🛟", label: "Roadside Assistance" },
  { icon: "📻", label: "Satellite Radio" },
];

const PRICING_TABS = [
  { key: "daily", label: "Daily", days: 1 },
  { key: "weekly", label: "Weekly", days: 7, discount: 0.05 },
  { key: "monthly", label: "Monthly", days: 30, discount: 0.15 },
  { key: "yearly", label: "Yearly", days: 365, discount: 0.3 },
];

function priceForTab(dailyRate, tab) {
  const rate = Number(dailyRate) || 0;
  const total = rate * tab.days * (1 - (tab.discount || 0));
  return Math.round(total);
}

function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <span className="inline-flex gap-1 text-2xl">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className={`leading-none transition ${(hover || value) >= n ? "text-amber-deep" : "text-line"}`}
          aria-label={`${n} star`}
        >
          ★
        </button>
      ))}
    </span>
  );
}

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [activeImage, setActiveImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [pricingTab, setPricingTab] = useState("daily");

  const [dates, setDates] = useState({ pickup_date: "", return_date: "" });
  const [booking, setBooking] = useState({ saving: false, error: "", success: "" });

  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [review, setReview] = useState({ saving: false, error: "", success: "" });
  const [reviewList, setReviewList] = useState({ loading: true, data: [], error: null });

  useEffect(() => {
    setState({ loading: true, data: null, error: null });
    setActiveImage(0);
    api.getVehicle(id).then(({ data, error }) => setState({ loading: false, data, error }));
    window.scrollTo(0, 0);
  }, [id]);

  function loadReviews() {
    setReviewList((s) => ({ ...s, loading: true }));
    api.getVehicleReviews(id).then(({ data, error }) => setReviewList({ loading: false, data: data || [], error }));
  }

  useEffect(loadReviews, [id]);

  async function handleBook(e) {
    e.preventDefault();
    if (!session?.token) {
      navigate("/signin");
      return;
    }
    if (!dates.pickup_date || !dates.return_date) {
      setBooking({ saving: false, error: "Pick a pickup and return date.", success: "" });
      return;
    }
    setBooking({ saving: true, error: "", success: "" });
    const { error } = await api.createBooking({
      vehicle_id: Number(id),
      rent_start_date: dates.pickup_date,
      rent_end_date: dates.return_date,
    });
    setBooking(
      error
        ? { saving: false, error, success: "" }
        : { saving: false, error: "", success: "Booked! Find it under Dashboard → Bookings." }
    );
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!session?.token) {
      navigate("/signin");
      return;
    }
    if (!reviewForm.rating) {
      setReview({ saving: false, error: "Pick a star rating first.", success: "" });
      return;
    }
    setReview({ saving: true, error: "", success: "" });
    const { error } = await api.createReview({
      vehicle_id: Number(id),
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim() || undefined,
    });
    if (error) {
      setReview({ saving: false, error, success: "" });
      return;
    }
    setReview({ saving: false, error: "", success: "Thanks — your review has been posted." });
    setReviewForm({ rating: 0, comment: "" });
    // refresh so the rating/review count — and the list below — reflect the new review
    api.getVehicle(id).then(({ data }) => data && setState((s) => ({ ...s, data })));
    loadReviews();
  }

  if (state.loading) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="skeleton h-10 w-1/3 rounded-lg" />
          <div className="skeleton mt-6 h-96 rounded-2xl" />
        </div>
        <Footer />
      </>
    );
  }

  if (state.error || !state.data) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <p className="text-lg font-semibold">Couldn't load this listing.</p>
          <p className="mt-1 text-sm text-muted">{state.error || "It may have been removed."}</p>
          <Link to="/listings" className="mt-6 inline-block rounded-full bg-amber px-6 py-3 text-sm font-semibold text-[#1a1200]">
            Back to Listings
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const v = state.data;
  const images = [v.thumbnail_url, ...(Array.isArray(v.images) ? v.images : [])].filter(Boolean);
  const description = v.description || "No description provided for this listing yet.";
  const isLong = description.length > 320;
  const shownDescription = showFullDescription || !isLong ? description : `${description.slice(0, 320)}…`;
  const activeTab = PRICING_TABS.find((t) => t.key === pricingTab);

  return (
    <>
      <Navbar />

      {/* breadcrumb banner */}
      <section
        className="relative overflow-hidden py-14 text-center text-white"
        style={{ backgroundImage: "radial-gradient(120% 140% at 15% 0%, #22232B 0%, #14151A 55%)" }}
      >
        <h1 className="font-display text-3xl font-bold md:text-4xl">{v.vehicle_name}</h1>
        <p className="mt-2.5 text-sm text-white/50">
          <Link to="/" className="hover:text-amber-deep">Home</Link>
          {" / "}
          <Link to="/listings" className="hover:text-amber-deep">Listings</Link>
          {" / "}
          <span className="text-amber-deep">{v.vehicle_name}</span>
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* title + meta row */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              {(v.category_name || v.type) && (
                <span className="rounded-md bg-ink px-2.5 py-1 text-xs font-semibold text-white">
                  {v.category_name || v.type}
                </span>
              )}
              {v.model_year && (
                <span className="rounded-md bg-line px-2.5 py-1 text-xs font-semibold text-inksoft">
                  {v.model_year}
                </span>
              )}
              <span className="flex items-center gap-1 text-sm">
                <Stars rating={v.avg_rating} />
                <span className="text-muted">({Number(v.avg_rating || 0).toFixed(1)})</span>
              </span>
            </div>
            <h2 className="font-display mt-2 text-2xl font-bold">{v.vehicle_name}</h2>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
              <span>📍 {[v.city, v.country].filter(Boolean).join(", ") || "Location not set"}</span>
              <span>💬 {v.review_count} Review{Number(v.review_count) === 1 ? "" : "s"}</span>
              {v.created_at && (
                <span>🗓 Listed on {new Date(v.created_at).toLocaleDateString()}</span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          {/* ---------------- LEFT COLUMN ---------------- */}
          <div className="space-y-8">
            {/* gallery */}
            <div>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#EDEEF2] to-[#F8F9FB]">
                {images.length > 0 ? (
                  <img src={images[activeImage]} alt={v.vehicle_name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-6xl opacity-20">🚗</div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-soft"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-soft"
                    >
                      →
                    </button>
                  </>
                )}

                <span
                  className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-white ${
                    v.availability_status === "available" ? "bg-emerald-600" : "bg-amber-deep"
                  }`}
                >
                  {v.availability_status === "available" ? "Available" : "Booked"}
                </span>
              </div>

              {images.length > 1 && (
                <div className="mt-3 flex gap-3 overflow-x-auto">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 ${
                        i === activeImage ? "border-amber" : "border-transparent"
                      }`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* extra services */}
            <div className="rounded-2xl border border-line bg-white p-6">
              <h3 className="mb-4 border-b-2 border-amber pb-2 text-[15px] font-semibold" style={{ borderBottomWidth: 2, display: "inline-block" }}>
                Extra Service
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {EXTRA_SERVICES.map((s) => (
                  <span key={s.label} className="flex items-center gap-2 text-[13.5px] text-inksoft">
                    <span>{s.icon}</span> {s.label}
                  </span>
                ))}
              </div>
            </div>

            {/* description */}
            <div className="rounded-2xl border border-line bg-white p-6">
              <h3 className="mb-4 text-[15px] font-semibold">Description of Listing</h3>
              <p className="whitespace-pre-line text-[13.5px] leading-relaxed text-muted">{shownDescription}</p>
              {isLong && (
                <button
                  onClick={() => setShowFullDescription((s) => !s)}
                  className="mt-3 text-[13px] font-semibold text-amber-deep"
                >
                  {showFullDescription ? "Show Less" : "+ Show More"}
                </button>
              )}
            </div>

            {/* reviews list */}
            <div className="rounded-2xl border border-line bg-white p-6">
              <h3 className="mb-4 text-[15px] font-semibold">
                Reviews {reviewList.data.length > 0 && `(${reviewList.data.length})`}
              </h3>

              {reviewList.loading && <div className="skeleton h-20 rounded-xl" />}
              {reviewList.error && (
                <p className="text-sm text-muted">Couldn't load reviews right now.</p>
              )}
              {!reviewList.loading && !reviewList.error && reviewList.data.length === 0 && (
                <p className="text-sm text-muted">No reviews yet — be the first to leave one below.</p>
              )}

              <div className="space-y-5">
                {reviewList.data.map((r) => (
                  <div key={r.id} className="flex items-start gap-3 border-t border-line pt-5 first:border-t-0 first:pt-0">
                    {r.customer_avatar ? (
                      <img src={r.customer_avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber/15 text-xs font-bold text-amber-deep">
                        {initials(r.customer_name)}
                      </span>
                    )}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold">{r.customer_name}</p>
                        <span className="text-xs text-muted">
                          {new Date(r.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-0.5 text-sm"><Stars rating={r.rating} /></div>
                      {r.comment && (
                        <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{r.comment}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* leave a review */}
            <div className="rounded-2xl border border-line bg-white p-6">
              <h3 className="mb-1 text-[15px] font-semibold">Leave a Review</h3>
              <p className="mb-5 text-xs text-muted">Rented this car? Let other renters know how it went.</p>

              {!session?.token ? (
                <div className="rounded-xl border border-dashed border-line p-5 text-center text-sm text-muted">
                  <Link to="/signin" className="font-semibold text-amber-deep">Sign in</Link> to leave a review.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-muted">Your rating</label>
                    <StarInput
                      value={reviewForm.rating}
                      onChange={(rating) => setReviewForm((f) => ({ ...f, rating }))}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-muted">Comments</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                      rows={4}
                      placeholder="How was the car, the pickup, the whole experience?"
                      className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
                    />
                  </div>

                  {review.error && <p className="text-sm text-red-600">{review.error}</p>}
                  {review.success && <p className="text-sm text-emerald-600">{review.success}</p>}

                  <button
                    type="submit"
                    disabled={review.saving}
                    className="rounded-full bg-amber px-6 py-3 text-sm font-semibold text-[#1a1200] transition hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {review.saving ? "Submitting…" : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ---------------- RIGHT COLUMN ---------------- */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* pricing */}
            <div className="rounded-2xl border border-line bg-white p-6">
              <h3 className="mb-4 text-[15px] font-semibold">Pricing</h3>
              <div className="space-y-1">
                {PRICING_TABS.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setPricingTab(t.key)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${
                      pricingTab === t.key ? "bg-amber/10 font-semibold text-amber-deep" : "text-inksoft"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`h-3.5 w-3.5 rounded-full border-2 ${
                          pricingTab === t.key ? "border-amber-deep bg-amber-deep" : "border-line"
                        }`}
                      />
                      {t.label}
                    </span>
                    <span>${priceForTab(v.daily_rent_price, t)}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleBook} className="mt-5 space-y-3 border-t border-line pt-5">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted">Pickup Date</label>
                  <input
                    type="date"
                    value={dates.pickup_date}
                    onChange={(e) => setDates((d) => ({ ...d, pickup_date: e.target.value }))}
                    className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted">Return Date</label>
                  <input
                    type="date"
                    value={dates.return_date}
                    min={dates.pickup_date}
                    onChange={(e) => setDates((d) => ({ ...d, return_date: e.target.value }))}
                    className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
                  />
                </div>

                {booking.error && <p className="text-sm text-red-600">{booking.error}</p>}
                {booking.success && <p className="text-sm text-emerald-600">{booking.success}</p>}

                <button
                  type="submit"
                  disabled={booking.saving || v.availability_status !== "available"}
                  className="w-full rounded-full bg-amber py-3 text-sm font-semibold text-[#1a1200] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {v.availability_status !== "available"
                    ? "Currently Booked"
                    : booking.saving
                    ? "Booking…"
                    : "Book"}
                </button>
              </form>
            </div>

            {/* owner */}
            <div className="rounded-2xl border border-line bg-white p-6">
              <h3 className="mb-4 text-[15px] font-semibold">Listing Owner</h3>
              <div className="flex items-center gap-3">
                {v.owner_avatar ? (
                  <img src={v.owner_avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber/15 text-sm font-bold text-amber-deep">
                    {initials(v.owner_name || "Host")}
                  </span>
                )}
                <div>
                  <p className="text-sm font-semibold">{v.owner_name || "DreamsRent Host"}</p>
                  <p className="text-xs text-muted">Listing owner</p>
                </div>
              </div>
            </div>

            {/* location */}
            <div className="rounded-2xl border border-line bg-white p-6">
              <h3 className="mb-4 text-[15px] font-semibold">View Car Location</h3>
              {v.latitude && v.longitude ? (
                <div className="flex h-40 flex-col items-center justify-center gap-1 rounded-xl bg-soft text-center text-xs text-muted">
                  <span className="text-2xl">📍</span>
                  {Number(v.latitude).toFixed(4)}, {Number(v.longitude).toFixed(4)}
                  <span>Wire up a maps provider here to render this pin.</span>
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-xl bg-soft text-center text-xs text-muted">
                  Location not set for this listing.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}
