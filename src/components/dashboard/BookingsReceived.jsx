import { useEffect, useState, useCallback } from "react";
import { api } from "../../api/client";
import { EmptyNote } from "../Common";

const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-600",
  returned: "bg-line text-inksoft",
};

export default function BookingsReceived({ ownerId }) {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [actingId, setActingId] = useState(null);

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true }));
    // Admin's GET /bookings returns every booking in the system, joined with
    // vehicle_owner_id — so we narrow it down to just this owner's cars.
    api.getBookings().then(({ data, error }) => {
      const mine = (data || []).filter((b) => String(b.vehicle_owner_id) === String(ownerId));
      setState({ loading: false, data: mine, error });
    });
  }, [ownerId]);

  useEffect(() => {
    load();
  }, [load]);

  const markReturned = async (id) => {
    setActingId(id);
    await api.updateBooking(id);
    setActingId(null);
    load();
  };

  if (state.loading) {
    return <div className="skeleton h-64 rounded-2xl" />;
  }
  if (state.error) {
    return <EmptyNote>Bookings couldn't be loaded — check that the backend is running.</EmptyNote>;
  }
  if (!state.data || state.data.length === 0) {
    return <EmptyNote>No bookings on your cars yet.</EmptyNote>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-soft text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3">Car</th>
            <th className="px-4 py-3">Renter</th>
            <th className="px-4 py-3">Dates</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {state.data.map((b) => (
            <tr key={b.id}>
              <td className="px-4 py-3 font-medium">{b.vehicle_name}</td>
              <td className="px-4 py-3">
                <div>{b.customer_name}</div>
                <div className="text-xs text-muted">{b.customer_email}</div>
              </td>
              <td className="px-4 py-3 text-xs text-muted">
                {new Date(b.rent_start_date).toLocaleDateString()} → {new Date(b.rent_end_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 font-semibold">${Number(b.total_price).toFixed(0)}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[b.status] || ""}`}>
                  {b.status}
                </span>
              </td>
              <td className="px-4 py-3">
                {b.status === "active" && (
                  <button
                    onClick={() => markReturned(b.id)}
                    disabled={actingId === b.id}
                    className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    {actingId === b.id ? "…" : "Mark Returned"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
