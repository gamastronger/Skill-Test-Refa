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
    <div className="p-8 max-w-4xl mx-auto border rounded-xl shadow-sm bg-white">
      {/* Header Section dengan Role Badge */}
      <div className="flex items-center gap-6 pb-6 border-b">
        <img
          src={user.image}
          alt={user.firstName}
          className="w-24 h-24 rounded-full border-4 border-blue-50 object-cover shadow-sm"
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-800">
              {user.firstName} {user.lastName}
            </h1>
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-red-100 text-red-600">
              {user.role}
            </span>
          </div>
          <p className="text-lg text-gray-500">@{user.username} • {user.gender}, {user.age} Years</p>
        </div>
      </div>

      {/* Grid Detail Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Kolom Kontak */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-4">Contact Info</h2>
          <div className="space-y-3">
            <p><span className="text-gray-400">Email:</span> {user.email}</p>
            <p><span className="text-gray-400">Phone:</span> {user.phone}</p>
            <p><span className="text-gray-400">Address:</span> {user.address.address}, {user.address.city}, {user.address.state}</p>
          </div>
        </section>

        {/* Kolom Pekerjaan */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-4">Professional</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-bold text-blue-800">{user.company.title}</p>
            <p className="text-sm text-gray-600">{user.company.name}</p>
            <p className="text-xs text-gray-400 mt-2">Dept: {user.company.department}</p>
          </div>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t flex justify-between">
        <Link className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition" to="/users">
          ← Back to List
        </Link>
        <button className="text-sm text-gray-400 hover:text-red-500">
          Report User
        </button>
      </div>
    </div>
  );
}
