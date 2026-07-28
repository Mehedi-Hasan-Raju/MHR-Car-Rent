export default function Footer() {
  return (
    <footer className="bg-ink py-14 text-white/70">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <a href="#" className="flex items-center gap-2 font-display text-lg font-semibold text-white">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 13l1.6-4.8A2 2 0 0 1 6.5 7h11a2 2 0 0 1 1.9 1.2L21 13v6a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6Z"
                stroke="#F7941D"
                strokeWidth="1.6"
              />
            </svg>
            <span>
              MHR<b>Rent</b>
            </span>
          </a>
          <p className="mt-3 max-w-[240px] text-[13.5px] text-white/60">
            A marketplace for verified, professionally maintained rental cars.
          </p>
        </div>

        <div>
          <h5 className="mb-3.5 text-sm font-semibold text-white">Company</h5>
          <a href="#" className="block py-1.5 text-[13.5px] hover:text-amber">About</a>
          <a href="#" className="block py-1.5 text-[13.5px] hover:text-amber">Careers</a>
          <a href="#" className="block py-1.5 text-[13.5px] hover:text-amber">Blog</a>
        </div>

        <div>
          <h5 className="mb-3.5 text-sm font-semibold text-white">Vehicles</h5>
          <a href="#" className="block py-1.5 text-[13.5px] hover:text-amber">All Cars</a>
          <a href="#" className="block py-1.5 text-[13.5px] hover:text-amber">SUVs</a>
          <a href="#" className="block py-1.5 text-[13.5px] hover:text-amber">Sports Cars</a>
        </div>

        <div>
          <h5 className="mb-3.5 text-sm font-semibold text-white">Contact</h5>
          <a href="tel:+18887601940" className="block py-1.5 text-[13.5px] hover:text-amber">(+888)1920550727 </a>
          <a href="mailto:support@example.com" className="block py-1.5 text-[13.5px] hover:text-amber">https://mehedi-hasan-raju.netlify.app/</a>
        </div>
      </div>

      <div className="mx-auto mt-9 max-w-6xl border-t border-white/10 px-6 pt-6 text-[12.5px] text-white/45">
        © 2026 MHR(Mehedi Hasan Raju) Rent. All rights reserved.
      </div>
    </footer>
  );
}
