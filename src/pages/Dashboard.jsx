import { useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { getSession } from "../auth/session";
import MyListings from "../components/dashboard/MyListings.jsx";
import VehicleForm from "../components/dashboard/VehicleForm.jsx";
import BookingsReceived from "../components/dashboard/BookingsReceived.jsx";
import MyBookings from "../components/dashboard/MyBookings.jsx";

export default function Dashboard() {
  const session = getSession();

  // Not logged in -> bounce to sign in
  if (!session) return <Navigate to="/signin" replace />;

  const { user } = session;
  const isAdmin = user.role === "admin";

  const [tab, setTab] = useState(isAdmin ? "listings" : "bookings");
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const tabs = isAdmin
    ? [
        { key: "listings", label: "My Listings" },
        { key: "create", label: editingVehicle ? "Edit Car" : "Add New Car" },
        { key: "bookings", label: "Bookings Received" },
      ]
    : [{ key: "bookings", label: "My Bookings" }];

  const startEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setTab("create");
  };

  const afterSave = () => {
    setEditingVehicle(null);
    setRefreshKey((k) => k + 1);
    setTab("listings");
  };

  return (
    <>
      <Navbar />

      <section
        className="py-14 text-white"
        style={{ backgroundImage: "radial-gradient(120% 140% at 15% 0%, #22232B 0%, #14151A 55%)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber font-display text-xl font-bold text-[#1a1200]">
            {user.name?.[0]?.toUpperCase() || "U"}
          </span>
          <div>
            <h1 className="font-display text-xl font-bold">{user.name}</h1>
            <p className="text-sm capitalize text-white/60">{user.role} account · {user.email}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                if (t.key !== "create") setEditingVehicle(null);
              }}
              className={`whitespace-nowrap border-b-2 px-4 py-4 text-sm font-semibold transition ${
                tab === t.key ? "border-amber text-ink" : "border-transparent text-muted hover:text-inksoft"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-soft py-10">
        <div className="mx-auto max-w-6xl px-6">
          {isAdmin && tab === "listings" && (
            <MyListings ownerId={user.id} refreshKey={refreshKey} onEdit={startEdit} />
          )}

          {isAdmin && tab === "create" && (
            <VehicleForm
              editingVehicle={editingVehicle}
              onSaved={afterSave}
              onCancelEdit={() => {
                setEditingVehicle(null);
                setTab("listings");
              }}
            />
          )}

          {isAdmin && tab === "bookings" && <BookingsReceived ownerId={user.id} />}

          {!isAdmin && tab === "bookings" && (
            <>
              <div className="mb-6 rounded-2xl border border-line bg-white px-5 py-4 text-sm text-muted">
                Listing your own car requires an <strong className="text-inksoft">admin</strong> account.
                Your current role is <strong className="capitalize text-inksoft">{user.role}</strong>.
              </div>
              <MyBookings />
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
