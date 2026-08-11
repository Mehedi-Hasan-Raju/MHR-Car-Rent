import { useEffect, useState, useCallback } from "react";
import { api } from "../../api/client";
import { EmptyNote, Stars, initials } from "../Common";

const emptyForm = { customer_name: "", location: "", avatar_url: "", rating: 5, feedback: "" };

export default function TestimonialManager() {
  const [items, setItems] = useState({ loading: true, data: [], error: null });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(() => {
    api.getTestimonials().then(({ data, error }) => setItems({ loading: false, data: data || [], error }));
  }, []);

  useEffect(load, [load]);

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.customer_name.trim() || !form.feedback.trim()) return;

    setSaving(true);
    setFormError("");

    const { error } = await api.createTestimonial({
      customer_name: form.customer_name.trim(),
      location: form.location.trim() || undefined,
      avatar_url: form.avatar_url.trim() || undefined,
      rating: Number(form.rating),
      feedback: form.feedback.trim(),
    });

    setSaving(false);
    if (error) {
      setFormError(error);
      return;
    }
    setForm(emptyForm);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Remove this testimonial?")) return;
    await api.deleteTestimonial(id);
    load();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
      {/* --- Add testimonial form --- */}
      <div className="h-fit rounded-2xl border border-line bg-white p-6">
        <h3 className="font-display text-lg font-semibold">Add a Testimonial</h3>
        <p className="mt-1 text-xs text-muted">
          Powers the homepage's "Our Clients Feedback" section. Only the 3 most recent show there.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted">Customer name</label>
              <input
                value={form.customer_name}
                onChange={update("customer_name")}
                placeholder="e.g. Mehedi Hasan"
                required
                className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted">Location</label>
              <input
                value={form.location}
                onChange={update("location")}
                placeholder="e.g. Dhaka, Bangladesh"
                className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">Avatar URL (optional)</label>
            <input
              value={form.avatar_url}
              onChange={update("avatar_url")}
              placeholder="https://…"
              className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
            />
            <p className="mt-1 text-[11px] text-muted">Leave blank to show initials instead.</p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">Rating</label>
            <select
              value={form.rating}
              onChange={update("rating")}
              className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} star{n === 1 ? "" : "s"}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">Feedback quote</label>
            <textarea
              value={form.feedback}
              onChange={update("feedback")}
              rows={4}
              placeholder="Renting a car from MHR made my vacation so much smoother…"
              required
              className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
            />
          </div>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-amber py-2.5 text-sm font-semibold text-[#1a1200] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Add Testimonial"}
          </button>
        </form>
      </div>

      {/* --- Existing testimonials --- */}
      <div className="rounded-2xl border border-line bg-white p-6">
        <h3 className="font-display text-lg font-semibold">Existing Testimonials</h3>

        <div className="mt-4 space-y-3">
          {items.loading && <div className="skeleton h-16 rounded-xl" />}
          {items.error && <EmptyNote>Couldn't load testimonials — check that the backend is running.</EmptyNote>}
          {!items.loading && !items.error && items.data.length === 0 && (
            <p className="text-sm text-muted">
              None yet — the homepage feedback section stays empty until you add one on the left.
            </p>
          )}

          {items.data.map((t) => (
            <div key={t.id} className="flex items-start justify-between gap-3 rounded-xl border border-line px-4 py-3">
              <div className="flex items-start gap-3">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber/15 text-xs font-bold text-amber-deep">
                    {initials(t.customer_name)}
                  </span>
                )}
                <div>
                  <p className="text-sm font-semibold">{t.customer_name}</p>
                  <p className="text-xs text-muted">{t.location}</p>
                  <div className="mt-1 text-xs"><Stars rating={t.rating} /></div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">"{t.feedback}"</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(t.id)}
                className="flex-shrink-0 text-xs font-semibold text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
