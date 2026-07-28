import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { api } from "../api/client";
import { saveSession } from "../auth/session";

export default function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: apiError } = await api.loginUser(form.email, form.password);

    setLoading(false);

    if (apiError) {
      // Backend throws "User not found" / "Invalid credentials"
      setError(apiError);
      return;
    }

    saveSession(data.token, data.user);
    navigate("/");
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to book your next ride.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {justRegistered && !error && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
            Account created — sign in to continue.
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

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
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-sm font-medium text-inksoft">Password</label>
            <a href="#" className="text-xs font-medium text-amber-deep">Forgot password?</a>
          </div>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-xl border border-line px-4 py-3 pr-11 text-sm outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-amber py-3.5 text-sm font-semibold text-[#1a1200] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        New to MHR Rent?{" "}
        <Link to="/signup" className="font-semibold text-amber-deep">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
