import { Link, NavLink } from "react-router-dom";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const navItem = ({ isActive }) =>
    cx(
      "inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium transition",
      "focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/10",
      isActive
        ? "bg-slate-900 text-white shadow-sm"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
    );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/75 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        {/* Brand */}
        <Link
          to="/"
          aria-label="Go to home"
          className="inline-flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-100/70"
        >
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/10">
            <img
              src="/bee.png"
              alt="Mini Project logo"
              className="h-5 w-5 object-contain"
            />
          </span>

          <span className="text-sm font-semibold tracking-tight text-slate-900">
            Mini Project Web App
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1 overflow-x-auto">
          <NavLink className={navItem} to="/" end>
            Home
          </NavLink>
          <NavLink className={navItem} to="/users">
            Users
          </NavLink>
          <NavLink className={navItem} to="/login">
            Login
          </NavLink>
          <NavLink className={navItem} to="/register">
            Register
          </NavLink>
        
          <div className="mx-2 hidden h-6 w-px bg-slate-200 sm:block" />

          <Link
            to="/users/1"
            className={cx(
              "inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium transition",
              "text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900",
              "focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/10"
            )}
          >
            User #1
          </Link>
        </div>
      </nav>
    </header>
  );
}
