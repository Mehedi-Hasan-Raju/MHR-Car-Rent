import { useEffect, useState, useCallback } from "react";
import { api } from "../../api/client";
import { SkeletonRow, EmptyNote, Stars } from "../Common";

export default function MyListings({ ownerId, refreshKey, onEdit }) {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true }));
    api.getVehicles(`?owner_id=${ownerId}&limit=100&sort=newest`).then(({ data, error }) => {
      setState({ loading: false, data, error });
    });
  }, [ownerId]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this listing? This can't be undone.")) return;
    setDeletingId(id);
    setDeleteError("");
    const { error } = await api.deleteVehicle(id);
    setDeletingId(null);
    if (error) {
      setDeleteError(error); // e.g. "Vehicle has an active booking"
      return;
    }
    load();
  };

  return (
    <div>
      {deleteError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {deleteError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {state.loading && <SkeletonRow count={3} className="h-64 rounded-2xl" />}
        {state.error && <EmptyNote>Couldn't load your listings — check that the backend is running.</EmptyNote>}
        {!state.loading && !state.error && (!state.data || state.data.length === 0) && (
          <EmptyNote>You haven't listed any cars yet — use "Add New Car" to publish your first one.</EmptyNote>
        )}
        {state.data?.map((v) => (
          <div key={v.id} className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br from-[#EDEEF2] to-[#F8F9FB]">
              {v.thumbnail_url ? (
                <img src={v.thumbnail_url} alt={v.vehicle_name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl opacity-30">🚗</span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold">{v.vehicle_name}</h4>
                <span
                  className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    v.availability_status === "available"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber/15 text-amber-deep"
                  }`}
                >
                  {v.availability_status}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                <Stars rating={v.avg_rating} /> {Number(v.avg_rating || 0).toFixed(1)}
              </div>
              <p className="mt-1 text-sm font-bold text-amber-deep">${Number(v.daily_rent_price).toFixed(0)} / day</p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => onEdit(v)}
                  className="flex-1 rounded-full border border-line py-2 text-xs font-semibold text-inksoft"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  disabled={deletingId === v.id}
                  className="flex-1 rounded-full border border-red-200 py-2 text-xs font-semibold text-red-600 disabled:opacity-50"
                >
                  {deletingId === v.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
