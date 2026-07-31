import { useEffect, useState, useCallback } from "react";
import { api } from "../../api/client";
import { EmptyNote } from "../Common";

function TaxonomyList({ title, hint, items, loading, error, onAdd, onDelete, imageField = "image_url" }) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setFormError("");
    const { error: apiError } = await onAdd({
      name: name.trim(),
      [imageField]: imageUrl.trim() || undefined,
    });
    setSaving(false);
    if (apiError) {
      setFormError(apiError);
      return;
    }
    setName("");
    setImageUrl("");
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-muted">{hint}</p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sedan"
          className="min-w-[140px] flex-1 rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
        />
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image/logo URL (optional)"
          className="min-w-[140px] flex-1 rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-[#1a1200] disabled:opacity-60"
        >
          {saving ? "Adding…" : "Add"}
        </button>
      </form>
      {formError && <p className="mt-2 text-sm text-red-600">{formError}</p>}

      <div className="mt-5 space-y-2">
        {loading && <div className="skeleton h-10 rounded-lg" />}
        {error && <EmptyNote>Couldn't load — check that the backend is running.</EmptyNote>}
        {!loading && !error && items.length === 0 && (
          <p className="text-sm text-muted">None yet — add one above so it shows up on the homepage.</p>
        )}
         {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border border-line px-4 py-2.5 text-sm">
            <span className="flex items-center gap-2 font-medium">
              {item[imageField] ? (
                <img src={item[imageField]} alt="" className="h-7 w-7 rounded-full object-cover" />
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-line text-xs">—</span>
              )}
              {item.name} <span className="text-muted">({item.vehicle_count ?? 0} cars)</span>
            </span>
            <button
              onClick={() => onDelete(item.id)}
              className="text-xs font-semibold text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TaxonomyManager() {
  const [categories, setCategories] = useState({ loading: true, data: [], error: null });
  const [brands, setBrands] = useState({ loading: true, data: [], error: null });

  const loadCategories = useCallback(() => {
    api.getCategories().then(({ data, error }) => setCategories({ loading: false, data: data || [], error }));
  }, []);
  const loadBrands = useCallback(() => {
    api.getBrands().then(({ data, error }) => setBrands({ loading: false, data: data || [], error }));
  }, []);

  useEffect(() => {
    loadCategories();
    loadBrands();
  }, [loadCategories, loadBrands]);

  const addCategory = async (payload) => {
    const res = await api.createCategory(payload);
    if (!res.error) loadCategories();
    return res;
  };
  const removeCategory = async (id) => {
    if (!confirm("Remove this category? Cars in it will keep their other details but lose this category.")) return;
    await api.deleteCategory(id);
    loadCategories();
  };

  const addBrand = async (payload) => {
    const res = await api.createBrand(payload);
    if (!res.error) loadBrands();
    return res;
  };
  const removeBrand = async (id) => {
    if (!confirm("Remove this brand?")) return;
    await api.deleteBrand(id);
    loadBrands();
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <TaxonomyList
        title="Categories"
        hint="Powers the homepage's Featured Categories row. Add e.g. Sedan, SUV, Sports Car, Pickup."
        items={categories.data}
        loading={categories.loading}
        error={categories.error}
        onAdd={addCategory}
        onDelete={removeCategory}
        imageField="image_url"
      />
      <TaxonomyList
        title="Brands"
        hint="Powers the homepage's Rent by Brands row. Add e.g. Toyota, BMW, Ford."
        items={brands.data}
        loading={brands.loading}
        error={brands.error}
        onAdd={addBrand}
        onDelete={removeBrand}
        imageField="logo_url"
      />
    </div>
  );
}
