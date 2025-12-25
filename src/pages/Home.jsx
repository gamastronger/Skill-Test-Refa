import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser, logout } from "../features/auth/authService";

export default function Home() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadMe() {
      try {
        setLoading(true);
        const data = await getCurrentUser();
        if (mounted) {
          setMe(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load user");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMe();

    return () => {
      mounted = false;
    };
  }, []);

  function handleLogout() {
    logout();
    window.location.reload();
  }

  if (loading) {
    return (
      <div className="p-6 border rounded-lg">
        <h1 className="text-2xl font-bold">Home</h1>
        <p className="mt-4">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border rounded-lg">
        <h1 className="text-2xl font-bold">Home</h1>
        <p className="mt-4 text-red-600">{error}</p>
        <p className="mt-2 text-sm text-gray-600">
          If you haven't logged in, go to{" "}
          <Link className="underline text-blue-600" to="/login">
            Login
          </Link>
          .
        </p>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="p-6 border rounded-lg">
        <h1 className="text-2xl font-bold">Home</h1>
        <p className="mt-4">You are not logged in.</p>
        <div className="mt-4">
          <Link className="underline text-blue-600" to="/login">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center gap-4">
        <img
          src={me.image}
          alt={`${me.firstName} ${me.lastName}`}
          className="w-16 h-16 rounded-full border object-cover"
          referrerPolicy="no-referrer"
        />
        <div>
          <h1 className="text-2xl font-bold">
            Welcome, {me.firstName} {me.lastName}
          </h1>
          <p className="text-sm text-gray-500">@{me.username}</p>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <p>
          <span className="font-semibold">Email:</span> {me.email}
        </p>
        <p>
          <span className="font-semibold">Phone:</span> {me.phone}
        </p>
      </div>

      <div className="mt-6 flex gap-4">
        <Link className="underline text-blue-600" to="/users">
          Go to Users
        </Link>
        <button
          onClick={handleLogout}
          className="underline text-red-600"
          type="button"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
