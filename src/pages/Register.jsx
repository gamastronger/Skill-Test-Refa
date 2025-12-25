import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.username || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    setError(null);
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 grid place-items-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 h-11 w-11 rounded-2xl bg-slate-900 text-white grid place-items-center shadow-sm">
            <span className="text-sm font-semibold tracking-tight">N</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Create an account
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Join us. Keep things simple and secure.
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
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition
                           placeholder:text-slate-400
                           focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
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
                autoComplete="new-password"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition
                           placeholder:text-slate-400
                           focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
              />
              <p className="mt-1 text-xs text-slate-500">
                Minimum 8 characters recommended.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Confirm password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition
                           placeholder:text-slate-400
                           focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
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
              disabled={!form.username || !form.password || !form.confirmPassword}
              className="w-full inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition
                         hover:bg-slate-800
                         focus:outline-none focus:ring-4 focus:ring-slate-900/15
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create account
            </button>

            {/* Footer */}
            <p className="pt-2 text-center text-xs text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-slate-700 hover:text-slate-900 transition"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
