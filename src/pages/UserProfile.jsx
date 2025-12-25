import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchUserById } from "../services/dummyjson";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        setLoading(true);
        const data = await fetchUserById(id);
        if (mounted) {
          setUser(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to fetch user");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 border rounded-lg">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <p className="mt-4">Loading user...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border rounded-lg">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <p className="mt-4 text-red-600">{error}</p>
        <div className="mt-4">
          <Link className="underline text-blue-600" to="/users">
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-6 border rounded-lg">
      <h1 className="text-2xl font-bold">
        {user.firstName} {user.lastName}
      </h1>

      <div className="mt-4 space-y-2">
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold">Username:</span> {user.username}
        </p>
        <p>
          <span className="font-semibold">Phone:</span> {user.phone}
        </p>
      </div>

      <div className="mt-6">
        <Link className="underline text-blue-600" to="/users">
          Back to Users
        </Link>
      </div>
    </div>
  );
}
