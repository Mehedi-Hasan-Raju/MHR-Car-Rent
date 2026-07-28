import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#home", label: "Home" },
    { href: "#listings", label: "Listings" },
    { href: "#feedback", label: "Reviews" },
    { href: "#insights", label: "Blog" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between gap-6 px-6">
        <a href="#" className="flex items-center gap-2 font-display text-lg font-semibold">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 13l1.6-4.8A2 2 0 0 1 6.5 7h11a2 2 0 0 1 1.9 1.2L21 13v6a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6Z"
              stroke="#F7941D"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <circle cx="7.5" cy="16.5" r="1.5" fill="#F7941D" />
            <circle cx="16.5" cy="16.5" r="1.5" fill="#F7941D" />
          </svg>
          <span>
            Dreams<b className="font-extrabold">Rent</b>
          </span>
        </a>

        <nav className="hidden gap-8 text-sm font-medium text-inksoft md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-amber-deep">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a href="#" className="rounded-full px-5 py-3 text-sm font-semibold text-ink">
            Sign In
          </a>
          <a href="#" className="rounded-full bg-amber px-5 py-3 text-sm font-semibold text-[#1a1200] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-10px_rgba(247,148,29,0.6)]">
            Sign Up
          </a>
        </div>

        <button
          aria-label="Menu"
          className="flex flex-col gap-1 md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="h-0.5 w-6 bg-ink" />
          <span className="h-0.5 w-6 bg-ink" />
          <span className="h-0.5 w-6 bg-ink" />
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-line px-6 py-4 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="py-2 text-sm font-medium text-inksoft">
              {l.label}
            </a>
          ))}
          <div className="mt-2 flex gap-2">
            <a href="#" className="flex-1 rounded-full py-3 text-center text-sm font-semibold">
              Sign In
            </a>
            <a href="#" className="flex-1 rounded-full bg-amber py-3 text-center text-sm font-semibold text-[#1a1200]">
              Sign Up
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
