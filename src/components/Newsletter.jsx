export default function Newsletter() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire this to a real subscribe endpoint when one exists on the backend
  };

  return (
    <section className="bg-amber py-12">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6">
        <div>
          <h3 className="text-xl font-bold text-[#1a1200]">Get the DreamsRent app</h3>
          <p className="mt-1 text-sm text-[#1a1200]/70">
            Manage bookings, track your ride, and unlock member-only rates.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2.5">
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="w-60 rounded-full border-none px-5 py-3 text-sm outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
          >
            Notify Me
          </button>
        </form>
      </div>
    </section>
  );
}
