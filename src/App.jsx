import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";
import UserProfile from "./pages/UserProfile";
import ProtectedRoute from "./features/auth/ProtectedRoute";

export default function App() {
  return (
    <div className="min-h-screen p-6">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

         <Route element={<ProtectedRoute />}>
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserProfile />} />
        </Route>
        
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
