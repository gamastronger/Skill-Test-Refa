import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUsers } from "../services/dummyjson";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadUsers() {
      try {
        setLoading(true);
        const data = await fetchUsers({ limit: 10 });
        if (mounted) {
          setUsers(data.users || []);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to fetch users");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6 border rounded-lg">
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="mt-4">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border rounded-lg">
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="mt-4 text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg">
      <h1 className="text-2xl font-bold">Users</h1>
      <p className="mt-2 text-sm text-gray-600">
        Total: {users.length}
      </p>

      <ul className="mt-4 divide-y">
        {users.map((user) => (
          <li key={user.id} className="py-3 flex justify-between items-center">
            <div>
              <p className="font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <Link
              className="underline text-blue-600"
              to={`/users/${user.id}`}
            >
              View
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
