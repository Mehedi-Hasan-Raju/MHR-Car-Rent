export function SkeletonRow({ count = 3, className = "h-64 rounded-2xl" }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${className}`} />
      ))}
    </>
  );
}

export function EmptyNote({ children }) {
  return (
    <div className="col-span-full rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">
      {children}
    </div>
  );
}

export function Stars({ rating = 0 }) {
  const r = Math.round(Number(rating) || 0);
  return (
    <span className="text-amber-deep">
      {"★".repeat(r)}
      <span className="text-line">{"★".repeat(5 - r)}</span>
    </span>
  );
}

export function initials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
