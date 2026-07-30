import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { api } from "../api/client";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
    adminCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (form.isAdmin && !form.adminCode) {
      setError("Enter the admin invite code, or uncheck 'Register as admin'.");
      return;
    }

    setLoading(true);

    const { error: apiError } = await api.registerUser({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role: form.isAdmin ? "admin" : "customer",
      adminCode: form.isAdmin ? form.adminCode : undefined,
    });

    setLoading(false);

    if (apiError) {
      setError(apiError);
      return;
    }

    // Registration endpoint doesn't return a token, so send them to sign in.
    navigate("/signin?registered=1");
  };

  return (
    <AuthLayout title="Create your account" subtitle="Takes less than a minute.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-inksoft">Full name</label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Jamal Uddin"
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/20"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-inksoft">Email</label>
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/20"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-inksoft">Phone</label>
          <input
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            placeholder="+880 1XXXXXXXXX"
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-inksoft">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-inksoft">Confirm</label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/20"
            />
          </div>
        </div>

        <div className="rounded-xl border border-line p-4">
          <label className="flex items-center gap-2 text-sm font-medium text-inksoft">
            <input
              type="checkbox"
              name="isAdmin"
              checked={form.isAdmin}
              onChange={handleChange}
              className="h-4 w-4 rounded border-line accent-[#F7941D]"
            />
            Register as admin (fleet owner / staff)
          </label>

          {form.isAdmin && (
            <div className="mt-3">
              <label className="mb-1.5 block text-xs font-medium text-muted">Admin invite code</label>
              <input
                name="adminCode"
                value={form.adminCode}
                onChange={handleChange}
                placeholder="Ask your admin for this code"
                className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/20"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-amber py-3.5 text-sm font-semibold text-[#1a1200] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link to="/signin" className="font-semibold text-amber-deep">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
