import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";
import UserProfile from "./pages/UserProfile";

export default function App() {
  return (
    <div className="min-h-screen p-6">
      <nav className="flex flex-wrap gap-4 mb-6">
        <Link className="underline text-blue-600" to="/">
          Home
        </Link>
        <Link className="underline text-blue-600" to="/login">
          Login
        </Link>
        <Link className="underline text-blue-600" to="/register">
          Register
        </Link>
        <Link className="underline text-blue-600" to="/users">
          Users
        </Link>
        <Link className="underline text-blue-600" to="/users/1">
          User 1
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function NotFound() {
  return (
    <div className="p-6 border rounded-lg">
      <h1 className="text-2xl font-bold">404</h1>
      <p className="mt-2">Page not found</p>
    </div>
  );
}
