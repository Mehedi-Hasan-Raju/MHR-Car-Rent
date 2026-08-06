import { useEffect, useState, useCallback } from "react";
import { api } from "../../api/client";
import { EmptyNote } from "../Common";

const BILLING_CYCLES = ["month", "year"];

const emptyForm = {
  name: "",
  price: "",
  billing_cycle: "month",
  features: "",
  is_recommended: false,
};

export default function PricingManager() {
  const [plans, setPlans] = useState({ loading: true, data: [], error: null });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadPlans = useCallback(() => {
    api.getPricingPlans().then(({ data, error }) => setPlans({ loading: false, data: data || [], error }));
  }, []);

  useEffect(loadPlans, [loadPlans]);

  function update(key) {
    return (e) => {
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;

    setSaving(true);
    setFormError("");

    const { error } = await api.createPricingPlan({
      name: form.name.trim(),
      price: Number(form.price),
      billing_cycle: form.billing_cycle,
      is_recommended: form.is_recommended,
      // one feature per line in the textarea -> array of strings
      features: form.features
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    });

    setSaving(false);
    if (error) {
      setFormError(error);
      return;
    }
    setForm(emptyForm);
    loadPlans();
  }

  async function handleDelete(id) {
    if (!confirm("Remove this pricing plan?")) return;
    await api.deletePricingPlan(id);
    loadPlans();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
      {/* --- Add plan form --- */}
      <div className="h-fit rounded-2xl border border-line bg-white p-6">
        <h3 className="font-display text-lg font-semibold">Add a Pricing Plan</h3>
        <p className="mt-1 text-xs text-muted">
          Powers the homepage's "Best Pricing in Rental" section.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">Plan name</label>
            <input
              value={form.name}
              onChange={update("name")}
              placeholder="e.g. Premium"
              required
              className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted">Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={update("price")}
                placeholder="1299"
                required
                className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted">Billing cycle</label>
              <select
                value={form.billing_cycle}
                onChange={update("billing_cycle")}
                className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
              >
                {BILLING_CYCLES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">
              Features (one per line)
            </label>
            <textarea
              value={form.features}
              onChange={update("features")}
              rows={5}
              placeholder={"30% Downpayment\nInsurance not Included\nRoadside Assistance"}
              className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
            />
            <p className="mt-1 text-[11px] text-muted">
              Lines containing words like "not included" or "excluded" render with a grey ✕
              instead of a checkmark.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm text-inksoft">
            <input type="checkbox" checked={form.is_recommended} onChange={update("is_recommended")} />
            Mark as recommended plan
          </label>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-amber py-2.5 text-sm font-semibold text-[#1a1200] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Add Plan"}
          </button>
        </form>
      </div>

      {/* --- Existing plans --- */}
      <div className="rounded-2xl border border-line bg-white p-6">
        <h3 className="font-display text-lg font-semibold">Existing Plans</h3>

        <div className="mt-4 space-y-3">
          {plans.loading && <div className="skeleton h-16 rounded-xl" />}
          {plans.error && <EmptyNote>Couldn't load pricing plans — check that the backend is running.</EmptyNote>}
          {!plans.loading && !plans.error && plans.data.length === 0 && (
            <p className="text-sm text-muted">No plans yet — add one on the left.</p>
          )}

          {plans.data.map((p) => {
            const features = Array.isArray(p.features) ? p.features : [];
            return (
              <div key={p.id} className="rounded-xl border border-line px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      {p.name}
                      {p.is_recommended && (
                        <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[10px] font-bold text-amber-deep">
                          Recommended
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted">
                      ${Number(p.price).toFixed(0)} / {p.billing_cycle} · {features.length} feature
                      {features.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex-shrink-0 text-xs font-semibold text-red-600"
                  >
                    Remove
                  </button>
                </div>
                {features.length > 0 && (
                  <ul className="mt-2 space-y-0.5 text-xs text-muted">
                    {features.map((f, i) => (
                      <li key={i}>· {f}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}