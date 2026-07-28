// Point this at your running backend. Change if the port/host differs.
export const API_BASE = "http://localhost:5000/api/v1";

async function apiGet(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Request failed");
    return { data: json.data, meta: json.meta, error: null };
  } catch (err) {
    console.error(`API error on ${path}:`, err.message);
    return { data: null, meta: null, error: err.message };
  }
}

export const api = {
  getCategories: () => apiGet("/categories"),
  getPopularVehicles: (limit = 6) => apiGet(`/vehicles/popular?limit=${limit}`),
  getFeaturedVehicles: (limit = 6) => apiGet(`/vehicles/featured?limit=${limit}`),
  getVehicles: (query = "") => apiGet(`/vehicles${query}`),
  getBrands: () => apiGet("/brands"),
  getTestimonials: () => apiGet("/content/testimonials"),
  getPricingPlans: () => apiGet("/content/pricing-plans"),
  getBlogs: () => apiGet("/content/blogs"),
  getFaqs: () => apiGet("/content/faqs"),
};
