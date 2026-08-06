import { getSession } from "../auth/session";

// Point this at your running backend. Change if the port/host differs.
export const API_BASE = "http://localhost:5000/api/v1";

// The backend's auth middleware reads `req.headers.authorization` as the raw
// JWT (no "Bearer " prefix) — see src/middlewere/auth.ts — so we match that here.
function authHeaders() {
  const session = getSession();
  return session?.token ? { Authorization: session.token } : {};
}

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

async function apiSend(method, path, body, auth = false) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(auth ? authHeaders() : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
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
  getVehicle: (id) => apiGet(`/vehicles/${id}`),
  getBrands: () => apiGet("/brands"),
  getTestimonials: () => apiGet("/content/testimonials"),
  getPricingPlans: () => apiGet("/content/pricing-plans"),
  getBlogs: () => apiGet("/content/blogs"),
  getFaqs: () => apiGet("/content/faqs"),

 // ---- Auth ----
  // Backend: POST /api/v1/users expects { name, role, email, password, phone }
  registerUser: (payload) => apiSend("POST", "/users", payload),
  // Backend: POST /api/v1/auth/login expects { email, password } -> { token, user }
  loginUser: (email, password) => apiSend("POST", "/auth/login", { email, password }),

  // ---- Vehicle listing management (admin only, needs the JWT) ----
  createVehicle: (payload) => apiSend("POST", "/vehicles", payload, true),
  updateVehicle: (id, payload) => apiSend("PUT", `/vehicles/${id}`, payload, true),
  deleteVehicle: (id) => apiSend("DELETE", `/vehicles/${id}`, undefined, true),
  createPricingPlan: (payload) => apiSend("POST", "/content/pricing-plans", payload, true),
  updatePricingPlan: (id, payload) => apiSend("PUT", `/content/pricing-plans/${id}`, payload, true),
  deletePricingPlan: (id) => apiSend("DELETE", `/content/pricing-plans/${id}`, undefined, true),

  // ---- Bookings (needs the JWT; admin gets every booking, customer gets their own) ----
  getBookings: () => apiSend("GET", "/bookings", undefined, true),
  // Admin -> marks 'returned'; customer -> cancels their own (if not yet started)
  updateBooking: (id) => apiSend("PUT", `/bookings/${id}`, {}, true),

  // ---- Category management (admin only) ----
  createCategory: (payload) => apiSend("POST", "/categories", payload, true),
  deleteCategory: (id) => apiSend("DELETE", `/categories/${id}`, undefined, true),

  // ---- Brand management (admin only) ----
  createBrand: (payload) => apiSend("POST", "/brands", payload, true),
  deleteBrand: (id) => apiSend("DELETE", `/brands/${id}`, undefined, true),
};
