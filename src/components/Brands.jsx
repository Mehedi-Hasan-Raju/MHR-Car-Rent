import { useEffect, useState } from "react";
import { api } from "../api/client";
import { SkeletonRow, EmptyNote } from "./Common";

function CarSilhouette() {
  return (
    <svg
      viewBox="0 0 800 380"
      className="pointer-events-none absolute bottom-[-30px] left-1/2 w-[92%] max-w-3xl -translate-x-1/2 select-none"
      aria-hidden="true"
    >
      {/* soft glow behind the car */}
      <ellipse cx="400" cy="230" rx="330" ry="170" fill="url(#glow)" />

      {/* roof + windshield */}
      <path
        d="M300 40c10-14 26-22 44-22h112c18 0 34 8 44 22l46 66H254l46-66Z"
        fill="#1D1F27"
      />
      <path
        d="M318 52c7-9 17-14 28-14h108c11 0 21 5 28 14l30 42H288l30-42Z"
        fill="#2A2D38"
      />
      {/* windshield reflection */}
      <path d="M330 56h50l-14 34h-46l10-34Z" fill="#3B3F4C" opacity="0.6" />

      {/* main body */}
      <path
        d="M120 260c0-22 16-41 38-47l70-20 40-56c9-13 24-21 40-21h184c16 0 31 8 40 21l40 56 70 20c22 6 38 25 38 47v46a20 20 0 0 1-20 20H140a20 20 0 0 1-20-20v-46Z"
        fill="url(#body)"
      />

      {/* hood crease lines */}
      <path d="M180 214h130M490 214h130" stroke="#333644" strokeWidth="3" strokeLinecap="round" />

      {/* grille */}
      <rect x="356" y="238" width="88" height="26" rx="6" fill="#14151A" />
      <path d="M366 246h68M366 254h68" stroke="#3B3F4C" strokeWidth="2" />

      {/* headlights: twin circles, like the reference */}
      {[188, 612].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="222" r="30" fill="#14151A" />
          <circle cx={cx} cy="222" r="30" fill="none" stroke="#3B3F4C" strokeWidth="2" />
          <circle cx={cx - 10} cy="222" r="12" fill="#4A4E5C" opacity="0.65" />
          <circle cx={cx + 10} cy="222" r="12" fill="#4A4E5C" opacity="0.65" />
        </g>
      ))}

      {/* wing mirrors */}
      <path d="M118 214c-14-2-24 4-27 14l24 6 3-20ZM682 214c14-2 24 4 27 14l-24 6-3-20Z" fill="#2A2D38" />

      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2A2D38" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#2A2D38" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="body" x1="120" y1="150" x2="680" y2="326" gradientUnits="userSpaceOnUse">
          <stop stopColor="#20222B" />
          <stop offset="1" stopColor="#16171D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Brands({ onCountLoaded }) {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    api.getBrands().then(({ data, error }) => {
      setState({ loading: false, data, error });
      if (data) onCountLoaded?.(data.length);
    });
  }, [onCountLoaded]);

  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white">
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Rent by Brands</h2>
        <p className="mx-auto mt-2.5 max-w-md text-[15px] text-white/50">
          Here's a list of some of the most popular cars globally
        </p>

        <div className="mt-16 flex flex-wrap justify-center gap-x-16 gap-y-10">
          {state.loading && <SkeletonRow count={6} className="h-16 w-24 bg-white/5" />}
          {state.error && <EmptyNote>Brands couldn't be loaded.</EmptyNote>}
          {!state.loading && !state.error && (!state.data || state.data.length === 0) && (
            <EmptyNote>No brands added yet.</EmptyNote>
          )}
          {state.data?.map((b) => (
            <div key={b.id} className="flex flex-col items-center gap-3" title={b.name}>
              {b.logo_url ? (
                <img
                  src={b.logo_url}
                  alt={b.name}
                  className="h-11 max-w-[96px] object-contain opacity-60 grayscale brightness-[3.5] transition hover:opacity-100 hover:grayscale-0 hover:brightness-100"
                />
              ) : (
                <span className="flex h-11 items-center text-lg font-bold text-white/40">{b.name}</span>
              )}
              <span className="text-sm font-bold text-white/85">{b.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* decorative car silhouette fading into the section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64">
        <CarSilhouette />
      </div>
    </section>
  );
}