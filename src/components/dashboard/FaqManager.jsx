import { useEffect, useState, useCallback } from "react";
import { api } from "../../api/client";
import { EmptyNote } from "../Common";

const emptyForm = { question: "", answer: "", sort_order: "" };

export default function FaqManager() {
  const [faqs, setFaqs] = useState({ loading: true, data: [], error: null });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadFaqs = useCallback(() => {
    api.getFaqs().then(({ data, error }) => setFaqs({ loading: false, data: data || [], error }));
  }, []);

  useEffect(loadFaqs, [loadFaqs]);

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return;

    setSaving(true);
    setFormError("");

    const { error } = await api.createFaq({
      question: form.question.trim(),
      answer: form.answer.trim(),
      // lower sort_order shows first; leave blank to just push it to the end
      sort_order: form.sort_order === "" ? faqs.data.length : Number(form.sort_order),
    });

    setSaving(false);
    if (error) {
      setFormError(error);
      return;
    }
    setForm(emptyForm);
    loadFaqs();
  }

  async function handleDelete(id) {
    if (!confirm("Remove this FAQ?")) return;
    await api.deleteFaq(id);
    loadFaqs();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
      {/* --- Add FAQ form --- */}
      <div className="h-fit rounded-2xl border border-line bg-white p-6">
        <h3 className="font-display text-lg font-semibold">Add a FAQ</h3>
        <p className="mt-1 text-xs text-muted">
          Powers the homepage's "Frequently Asked Questions" section.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">Question</label>
            <input
              value={form.question}
              onChange={update("question")}
              placeholder="e.g. What documents do I need to rent a car?"
              required
              className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">Answer</label>
            <textarea
              value={form.answer}
              onChange={update("answer")}
              rows={4}
              placeholder="A valid driving licence and a government photo ID…"
              required
              className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">
              Sort order <span className="font-normal text-muted">(optional — lower shows first)</span>
            </label>
            <input
              type="number"
              value={form.sort_order}
              onChange={update("sort_order")}
              placeholder={String(faqs.data.length)}
              className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
            />
          </div>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-amber py-2.5 text-sm font-semibold text-[#1a1200] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Add FAQ"}
          </button>
        </form>
      </div>

      {/* --- Existing FAQs --- */}
      <div className="rounded-2xl border border-line bg-white p-6">
        <h3 className="font-display text-lg font-semibold">Existing FAQs</h3>

        <div className="mt-4 space-y-3">
          {faqs.loading && <div className="skeleton h-16 rounded-xl" />}
          {faqs.error && <EmptyNote>Couldn't load FAQs — check that the backend is running.</EmptyNote>}
          {!faqs.loading && !faqs.error && faqs.data.length === 0 && (
            <p className="text-sm text-muted">No FAQs yet — add one on the left.</p>
          )}

          {faqs.data.map((f) => (
            <div key={f.id} className="rounded-xl border border-line px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    {f.question}
                    <span className="rounded-full bg-line px-2 py-0.5 text-[10px] font-semibold text-muted">
                      #{f.sort_order}
                    </span>
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{f.answer}</p>
                </div>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="flex-shrink-0 text-xs font-semibold text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}