import { useAuth } from "../features/auth/useAuth";

export default function HeaderBar({ onMenuToggle }) {
  const { user } = useAuth();

  return (
    <header className="h-14 flex items-center justify-between border-b border-slate-200 bg-white px-4">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
        onClick={onMenuToggle}
        aria-label="Toggle sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <div className="text-sm text-slate-600">Signed in as</div>
        <div className="font-medium text-slate-900">
          {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Guest"}
        </div>
      </div>
    </header>
  );
}
