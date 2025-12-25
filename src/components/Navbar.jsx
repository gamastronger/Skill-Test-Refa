import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `underline ${isActive ? "text-black" : "text-blue-600"}`;

  return (
    <nav className="flex flex-wrap gap-4 mb-6">
      <NavLink className={linkClass} to="/">
        Home
      </NavLink>
      <NavLink className={linkClass} to="/login">
        Login
      </NavLink>
      <NavLink className={linkClass} to="/register">
        Register
      </NavLink>
      <NavLink className={linkClass} to="/users">
        Users
      </NavLink>
      <Link className="underline text-blue-600" to="/users/1">
        User 1
      </Link>
    </nav>
  );
}
