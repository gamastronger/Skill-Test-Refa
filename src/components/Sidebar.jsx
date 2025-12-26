import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Users as UsersIcon,
  UserCircle,
  LogOut,
  LayoutGrid,
} from "lucide-react";
import { useAuth } from "../features/auth/useAuth";
import Button from "./ui/Button";
import beeLogo from "/public/bee.png";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function NavItem({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cx(
          "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
          "outline-none focus-visible:ring-4 focus-visible:ring-[#AEFEFF]/70",
          isActive
            ? "bg-[#4988C4]/15 text-[#072227] ring-1 ring-[#4FBDBA]/25"
            : "text-slate-700 hover:bg-slate-100/70"
        )
      }
    >
      
      <span
        className={cx(
          "absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-full transition",
          "bg-transparent group-[.active]:bg-[#35858B]"
        )}
      />

      
      <span
        className={cx(
          "grid h-9 w-9 place-items-center rounded-2xl transition",
          "ring-1 ring-black/5",
          "bg-white group-hover:bg-white",
          "group-[.active]:bg-[#072227] group-[.active]:ring-[#072227]/20"
        )}
      >
        {icon}
      </span>

      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      
      <div
        className={cx(
          "fixed inset-0 z-40 lg:hidden transition",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      </div>

      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col",
          "shadow-[0_20px_60px_rgba(7,34,39,0.10)]",
          "transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white ring-1 ring-[#072227]/10 shadow-sm">
              <img src={beeLogo} alt="PTBITS logo" className="h-6 w-6 object-contain" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-[#072227]">
                Bee
              </div>
              <div className="text-xs text-slate-500">Mini Project Web App</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden rounded-xl px-2 py-2 text-slate-600 hover:bg-slate-100/70"
            aria-label="Close sidebar"
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
        </div>

        <div className="px-3 py-4">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Menu
          </p>

          <nav className="mt-2 space-y-1 overflow-y-auto">
            <NavItem to="/" icon={<Home className="h-5 w-5 transition text-slate-600 group-hover:text-slate-800 group-[.active]:text-white" strokeWidth={2} />} label="Home" onClick={onClose} />
            <NavItem to="/users" icon={<UsersIcon className="h-5 w-5 transition text-slate-600 group-hover:text-slate-800 group-[.active]:text-white" strokeWidth={2} />} label="Users" onClick={onClose} />
            <NavItem to="/profile" icon={<UserCircle className="h-5 w-5 transition text-slate-600 group-hover:text-slate-800 group-[.active]:text-white" strokeWidth={2} />} label="Profile" onClick={onClose} />
          </nav>
        </div>

      
        <div className="mt-auto px-3 py-4 border-t border-slate-200">
          {/* <div className="rounded-2xl bg-gradient-to-br from-[#AEFEFF]/35 to-transparent p-3 ring-1 ring-[#072227]/5">
            <p className="text-xs text-slate-600">
              Signed in as <span className="font-semibold text-[#072227]">User</span>
            </p>
          </div> */}

          <Button
            variant="ghost"
            className="mt-3 w-full justify-start gap-3 rounded-2xl px-3 py-2.5"
            onClick={handleLogout}
          >
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-red-500 ring-1 ring-black/5">
              <LogOut className="h-5 w-5 text-white" />
            </span>
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
