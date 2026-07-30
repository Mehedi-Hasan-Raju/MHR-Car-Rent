import { useEffect, useState } from "react";
import { api } from "../../api/client";

const TYPES = ["car", "bike", "van", "SUV"];
const TRANSMISSIONS = ["Auto", "Manual"];
const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid"];
const STEERING_TYPES = ["Power", "Normal"];

const emptyForm = {
  vehicle_name: "",
  type: "car",
  category_id: "",
  brand_id: "",
  registration_number: "",
  daily_rent_price: "",
  transmission: "Auto",
  fuel_type: "Petrol",
  steering_type: "Power",
  seats: "",
  model_year: "",
  mileage_km: "",
  thumbnail_url: "",
  city: "",
  country: "",
  latitude: "",
  longitude: "",
  description: "",
  is_featured: false,
};

export default function VehicleForm({ ownerId,editingVehicle, onSaved, onCancelEdit }) {
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getCategories().then(({ data }) => setCategories(data || []));
    api.getBrands().then(({ data }) => setBrands(data || []));
  }, []);

  // Load the vehicle's current values when "Edit" is clicked from My Listings
  useEffect(() => {
    if (editingVehicle) {
      setForm({
        ...emptyForm,
        ...editingVehicle,
        category_id: editingVehicle.category_id ?? "",
        brand_id: editingVehicle.brand_id ?? "",
      });
      setSuccess("");
      setError("");
    }
  }, [editingVehicle]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    onCancelEdit?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      vehicle_name: form.vehicle_name,
      type: form.type,
      category_id: form.category_id ? Number(form.category_id) : null,
      brand_id: form.brand_id ? Number(form.brand_id) : null,
      registration_number: form.registration_number,
      daily_rent_price: Number(form.daily_rent_price),
      transmission: form.transmission || null,
      fuel_type: form.fuel_type || null,
      steering_type: form.steering_type || null,
      seats: form.seats ? Number(form.seats) : null,
      model_year: form.model_year ? Number(form.model_year) : null,
      mileage_km: form.mileage_km ? Number(form.mileage_km) : null,
      thumbnail_url: form.thumbnail_url || null,
      city: form.city || null,
      country: form.country || null,
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
      description: form.description || null,
      is_featured: !!form.is_featured,
      owner_id: editingVehicle ? editingVehicle.owner_id ?? ownerId : ownerId,
    };

    const { error: apiError } = editingVehicle
      ? await api.updateVehicle(editingVehicle.id, payload)
      : await api.createVehicle(payload);

    setSaving(false);

    if (apiError) {
      setError(apiError);
      return;
    }

    setSuccess(editingVehicle ? "Listing updated." : "Listing created.");
    if (!editingVehicle) setForm(emptyForm);
    onSaved?.();
  };

  const inputClass =
    "w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/20";
  const labelClass = "mb-1.5 block text-sm font-medium text-inksoft";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Vehicle name</label>
          <input name="vehicle_name" required value={form.vehicle_name} onChange={handleChange} placeholder="Ford Mustang 4.0 AT" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Registration number</label>
          <input name="registration_number" required value={form.registration_number} onChange={handleChange} placeholder="DHA-1234" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Type</label>
          <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Daily rent price ($)</label>
          <input name="daily_rent_price" type="number" min="1" step="0.01" required value={form.daily_rent_price} onChange={handleChange} placeholder="45" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select name="category_id" value={form.category_id} onChange={handleChange} className={inputClass}>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Brand</label>
          <select name="brand_id" value={form.brand_id} onChange={handleChange} className={inputClass}>
            <option value="">Select brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Transmission</label>
          <select name="transmission" value={form.transmission} onChange={handleChange} className={inputClass}>
            {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Fuel type</label>
          <select name="fuel_type" value={form.fuel_type} onChange={handleChange} className={inputClass}>
            {FUEL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Steering</label>
          <select name="steering_type" value={form.steering_type} onChange={handleChange} className={inputClass}>
            {STEERING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Seats</label>
          <input name="seats" type="number" min="1" value={form.seats} onChange={handleChange} placeholder="5" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Model year</label>
          <input name="model_year" type="number" min="1980" max="2100" value={form.model_year} onChange={handleChange} placeholder="2023" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Mileage (km)</label>
          <input name="mileage_km" type="number" min="0" value={form.mileage_km} onChange={handleChange} placeholder="15" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>City</label>
          <input name="city" value={form.city} onChange={handleChange} placeholder="Dhaka" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Country</label>
          <input name="country" value={form.country} onChange={handleChange} placeholder="Bangladesh" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Latitude</label>
          <input name="latitude" type="number" step="any" value={form.latitude} onChange={handleChange} placeholder="23.8103" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Longitude</label>
          <input name="longitude" type="number" step="any" value={form.longitude} onChange={handleChange} placeholder="90.4125" className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Thumbnail image URL</label>
          <input name="thumbnail_url" value={form.thumbnail_url} onChange={handleChange} placeholder="https://…" className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea name="description" rows={3} value={form.description} onChange={handleChange} placeholder="A short pitch for renters…" className={inputClass} />
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-inksoft sm:col-span-2">
          <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="h-4 w-4 rounded border-line accent-[#F7941D]" />
          Feature this listing on the homepage
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-amber px-7 py-3 text-sm font-semibold text-[#1a1200] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : editingVehicle ? "Update Listing" : "Publish Listing"}
        </button>
        {editingVehicle && (
          <button
            type="button"
            onClick={resetForm}
            className="rounded-full border border-line px-7 py-3 text-sm font-semibold text-inksoft"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}
