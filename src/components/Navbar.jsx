import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSession, clearSession } from "../auth/session";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const session = getSession();

  const links = [
    { href: "#home", label: "Home" },
    { href: "#feedback", label: "Reviews" },
    { href: "#insights", label: "Blog" },
    { href: "#faq", label: "FAQ" },
  ];

  const handleLogout = () => {
    clearSession();
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between gap-6 px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
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
        </Link>

        <nav className="hidden gap-8 text-sm font-medium text-inksoft md:flex">
          <Link to="/listings" className="transition hover:text-amber-deep">
            Listings
          </Link>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-amber-deep">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {session ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 transition hover:bg-soft">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber text-sm font-bold text-[#1a1200]">
                  {session.user?.name?.[0]?.toUpperCase() || "U"}
                </span>
                <span className="text-sm font-medium text-inksoft">{session.user?.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full px-5 py-3 text-sm font-semibold text-ink"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="rounded-full px-5 py-3 text-sm font-semibold text-ink">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-amber px-5 py-3 text-sm font-semibold text-[#1a1200] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-10px_rgba(247,148,29,0.6)]"
              >
                Sign Up
              </Link>
            </>
          )}
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
          <Link to="/listings" className="py-2 text-sm font-medium text-inksoft">
            Listings
          </Link>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="py-2 text-sm font-medium text-inksoft">
              {l.label}
            </a>
          ))}
          <div className="mt-2 flex gap-2">
            {session ? (
              <>
                <Link to="/dashboard" className="flex-1 rounded-full border border-line py-3 text-center text-sm font-semibold">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex-1 rounded-full py-3 text-center text-sm font-semibold"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="flex-1 rounded-full py-3 text-center text-sm font-semibold">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 rounded-full bg-amber py-3 text-center text-sm font-semibold text-[#1a1200]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
