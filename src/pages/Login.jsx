import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      await login(form);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not saved");

      navigate("/users");
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 grid place-items-center">
      <div className="w-full max-w-md">
        {/* Brand / Header */}
        <div className="mb-6 text-center">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/10 mx-auto">
            <img
              src="/bee.png"
              alt="Mini Project logo"
              className="h-5 w-5 object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Sign in to continue.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm overflow-hidden">
          <form className="p-6 space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="yourusername"
                autoComplete="username"
                disabled={loading}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition
                           placeholder:text-slate-400
                           focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10
                           disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition
                           placeholder:text-slate-400
                           focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10
                           disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !form.username || !form.password}
              className="w-full inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition
                         hover:bg-slate-800
                         focus:outline-none focus:ring-4 focus:ring-slate-900/15
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>

            {/* Small footer text */}
            <p className="pt-2 text-center text-xs text-slate-500">
              By continuing, you agree to our{" "}
              <span className="text-slate-700">Terms</span> and{" "}
              <span className="text-slate-700">Privacy Policy</span>.
            </p>
          </form>

          {/* subtle divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          {/* Optional bottom area */}
          <div className="p-4 text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-sm font-medium text-slate-700 hover:text-slate-900 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
