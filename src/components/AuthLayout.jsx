import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Left: brand / art panel */}
      <div
        className="relative hidden flex-col justify-between overflow-hidden p-10 text-white md:flex"
        style={{
          backgroundImage: "radial-gradient(120% 140% at 15% 0%, #22232B 0%, #14151A 55%)",
        }}
      >
        <div className="pointer-events-none absolute -right-16 -top-24 h-[420px] w-[420px] rounded-full bg-amber/25 blur-3xl" />

        <Link to="/" className="relative flex items-center gap-2 font-display text-lg font-semibold">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
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
            MHR <b>Rent</b>
          </span>
        </Link>

        <div className="relative">
          <svg viewBox="0 0 520 260" className="w-full max-w-[420px] drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]" fill="none">
            <ellipse cx="260" cy="230" rx="200" ry="16" fill="black" opacity="0.25" />
            <path
              d="M60 165c0-14 10-26 24-30l40-12 34-46c8-11 21-17 34-17h96c15 0 29 7 38 19l36 47 34 9c15 4 24 17 24 32v34a14 14 0 0 1-14 14H74a14 14 0 0 1-14-14v-46Z"
              fill="url(#carBody)"
            />
            <path d="M168 96l24-38c4-6 11-10 18-10h84c8 0 15 4 19 10l26 38H168Z" fill="#20222A" />
            <path d="M178 92l18-27c3-4 7-6 12-6h64c5 0 9 2 12 6l19 27H178Z" fill="#3B3E4A" />
            <rect x="60" y="150" width="400" height="10" fill="#0F1013" />
            <circle cx="152" cy="196" r="34" fill="#14151A" />
            <circle cx="152" cy="196" r="16" fill="#5A5D6B" />
            <circle cx="368" cy="196" r="34" fill="#14151A" />
            <circle cx="368" cy="196" r="16" fill="#5A5D6B" />
            <defs>
              <linearGradient id="carBody" x1="60" y1="106" x2="460" y2="213" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F7941D" />
                <stop offset="1" stopColor="#C9660A" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <p className="relative max-w-xs text-sm text-white/60">
          Every listing verified, every driver welcomed. Rent smarter with MHR Rent.
        </p>
      </div>

      {/* Right: form panel */}
      <div className="flex items-center justify-center bg-white px-6 py-14">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2 font-display text-lg font-semibold md:hidden">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 13l1.6-4.8A2 2 0 0 1 6.5 7h11a2 2 0 0 1 1.9 1.2L21 13v6a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6Z"
                stroke="#F7941D"
                strokeWidth="1.6"
              />
            </svg>
            <span>
              MHR <b>Rent</b>
            </span>
          </Link>

          <h1 className="font-display text-2xl font-bold">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
