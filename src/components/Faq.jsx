import { useEffect, useState } from "react";
import { api } from "../api/client";
import { EmptyNote } from "./Common";

function FaqItem({ q, a, isOpen, onClick }) {
  return (
    <div className="border-b border-line">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-5 text-left text-[15px] font-semibold"
      >
        {q}
        <span className={`text-xl text-amber-deep transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? "300px" : "0px" }}
      >
        <p className="pb-5 text-sm leading-relaxed text-muted">{a}</p>
      </div>
    </div>
  );
}

export default function Faq() {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    api.getFaqs().then(({ data, error }) => setState({ loading: false, data, error }));
  }, []);

  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-11">
          <span className="mb-2.5 block text-[12.5px] font-semibold tracking-wide text-amber-deep">
            ✦ Questions
          </span>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Frequently asked questions</h2>
        </div>

        {state.error && <EmptyNote>FAQs couldn't be loaded.</EmptyNote>}
        {!state.loading && !state.error && (!state.data || state.data.length === 0) && (
          <EmptyNote>No FAQs added yet.</EmptyNote>
        )}
        {state.data?.map((f, i) => (
          <FaqItem
            key={f.id}
            q={f.question}
            a={f.answer}
            isOpen={openIndex === i}
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  );
}
