import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Airbnb-style price-pill marker instead of the default Leaflet pin —
// avoids the classic "broken marker icon" bundler issue entirely.
function priceIcon(price, highlighted) {
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${highlighted ? "#14151A" : "#fff"};
      color:${highlighted ? "#fff" : "#14151A"};
      border:1px solid ${highlighted ? "#14151A" : "#E7E8EC"};
      padding:5px 10px;
      border-radius:999px;
      font-family:'Poppins',sans-serif;
      font-weight:700;
      font-size:12.5px;
      box-shadow:0 6px 16px -4px rgba(20,21,26,.35);
      white-space:nowrap;
    ">$${price}</div>`,
    iconSize: [0, 0],
    iconAnchor: [20, 14],
  });
}

// Re-fits the viewport whenever the marker set changes (new filters, page, etc.)
function FitToMarkers({ points }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 12);
      return;
    }
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [points, map]);

  return null;
}

export default function ListingsMap({ vehicles = [] }) {
  const points = useMemo(
    () =>
      (vehicles || [])
        .filter((v) => v.latitude && v.longitude)
        .map((v) => ({
          id: v.id,
          lat: Number(v.latitude),
          lng: Number(v.longitude),
          v,
        })),
    [vehicles]
  );

  if (points.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
        <p className="text-sm text-muted">
          None of the cars in this result have a saved location yet — add latitude/longitude
          when creating a vehicle to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[560px] overflow-hidden rounded-2xl border border-line">
      <MapContainer
        center={[points[0].lat, points[0].lng]}
        zoom={12}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToMarkers points={points} />
        {points.map(({ id, lat, lng, v }) => (
          <Marker key={id} position={[lat, lng]} icon={priceIcon(Number(v.daily_rent_price || 0).toFixed(0))}>
            <Popup>
              <div className="w-48">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <strong className="text-sm">{v.vehicle_name}</strong>
                  <span className="text-sm font-bold text-amber-deep">
                    ${Number(v.daily_rent_price || 0).toFixed(0)}/day
                  </span>
                </div>
                <p className="text-xs text-muted">
                  {v.category_name || v.type}
                  {v.brand_name ? ` · ${v.brand_name}` : ""}
                </p>
                <p className="mt-1 text-xs text-muted">
                  📍 {[v.city, v.country].filter(Boolean).join(", ")}
                </p>
                <a href="#" className="mt-2 block rounded-full bg-ink py-1.5 text-center text-xs font-semibold text-white">
                  Rent Now
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
