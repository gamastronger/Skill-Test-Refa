import Input from "./ui/Input";
import { Search } from "lucide-react"; // Pastikan lucide-react sudah terinstall

export default function UserFilters({ query, onQueryChange}) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900 uppercase">
              Cari Pengguna
            </h2>
          </div>

          <div className="relative w-full sm:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Cari username..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm transition-all focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none"
            />
          </div>

        </div>
      </div>
      <div className="h-px bg-slate-100" />
    </div>
  );
}