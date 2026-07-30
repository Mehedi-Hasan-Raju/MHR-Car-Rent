import { useEffect, useState, useCallback } from "react";
import { api } from "../../api/client";
import { EmptyNote } from "../Common";

const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-600",
  returned: "bg-line text-inksoft",
};

export default function MyBookings() {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [actingId, setActingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true }));
    api.getBookings().then(({ data, error }) => setState({ loading: false, data, error }));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cancelBooking = async (id) => {
    setActingId(id);
    setActionError("");
    const { error } = await api.updateBooking(id);
    setActingId(null);
    if (error) {
      setActionError(error); // e.g. "Booking cannot be cancelled"
      return;
    }
    load();
  };

  if (state.loading) return <div className="skeleton h-64 rounded-2xl" />;
  if (state.error) return <EmptyNote>Bookings couldn't be loaded — check that the backend is running.</EmptyNote>;
  if (!state.data || state.data.length === 0) return <EmptyNote>You haven't booked any cars yet.</EmptyNote>;

  return (
    <div>
      {actionError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {actionError}
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-soft text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Car</th>
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
                      onClick={() => cancelBooking(b.id)}
                      disabled={actingId === b.id}
                      className="rounded-full border border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50"
                    >
                      {actingId === b.id ? "…" : "Cancel"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
