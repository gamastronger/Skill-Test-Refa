import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Check } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.username || !form.password || !form.confirmPassword) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    if (!agreeToTerms) {
      setError("Anda harus menyetujui Kebijakan Privasi.");
      return;
    }

    setError(null);
    console.log("Registering with:", form);
    navigate("/login");
  }

  const isFormValid = form.username && form.password && form.confirmPassword && agreeToTerms;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 grid place-items-center font-sans text-slate-900">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 grid place-items-center">
            {/* Menggunakan path absolut ke folder public */}
            <img src="/bee.png" alt="Bee Logo" className="h-8 w-8 object-contain" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Daftar Akun Baru
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Bergabunglah dengan komunitas efisien kami.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl bg-white ring-1 ring-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          <form className="p-8 space-y-5" onSubmit={handleSubmit}>
            
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Username</label>
              <input
                name="username"
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                placeholder="cth: johndoe"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Konfirmasi Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none"
              />
            </div>

            {/* Privacy Checkbox - Custom Styled */}
            <div className="flex items-start space-x-3 pt-2">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-slate-50 transition-all checked:bg-[#1C4D8D] checked:border-[#1C4D8D]"
                />
                <Check 
                  className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-0.5" 
                  strokeWidth={4} 
                />
              </div>
              <label htmlFor="terms" className="text-[11px] sm:text-xs leading-tight text-slate-500 cursor-pointer select-none">
                Dengan mendaftar, saya menyetujui <Link to="/terms" className="text-slate-900 font-bold hover:underline">Syarat & Ketentuan</Link> serta <Link to="/privacy" className="text-slate-900 font-bold hover:underline">Kebijakan Privasi</Link>.
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-semibold text-red-600 animate-in fade-in duration-300">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full rounded-xl bg-[#1C4D8D] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-all hover:bg-[#0F2854] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
            >
              Buat Akun Sekarang
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-slate-500">
              Sudah punya akun?{" "}
              <Link to="/login" className="font-bold text-slate-900 hover:underline">
                Masuk di sini
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
