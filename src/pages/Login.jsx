import { useState } from "react";
// import { login } from "../features/auth/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await login(form);
      if (!res.ok) throw new Error(res.error || "Login failed");
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md p-6 border rounded-lg">
      <h1 className="text-2xl font-bold">Login</h1>

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
