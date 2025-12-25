import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import EditProfileForm from "../components/EditProfileForm.jsx";

export default function Home() {
  const navigate = useNavigate();
  // Ambil data langsung dari Central Store (Context)
  const { user, loading, logout, isAuthenticated, updateProfile, deleteSelf } = useAuth();
  const [editing, setEditing] = useState(false);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="p-6 border rounded-lg">
        <h1 className="text-2xl font-bold">Home</h1>
        <p className="mt-4">You are not logged in.</p>
        <Link className="underline text-blue-600" to="/login">Go to Login</Link>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="p-6 border rounded-lg max-w-2xl mx-auto mt-10">
        <div className="flex items-center justify-between pb-4 border-b">
          <h1 className="text-xl font-bold">Edit My Profile</h1>
          <button className="px-3 py-2 bg-gray-100 rounded" onClick={() => setEditing(false)} type="button">Cancel</button>
        </div>
        <EditProfileForm
          user={user}
          onCancel={() => setEditing(false)}
          onSave={async (updates) => {
            const res = await updateProfile(updates);
            if (res.ok) setEditing(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg max-w-2xl mx-auto mt-10">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={user.image}
          alt={user.firstName}
          className="w-20 h-20 rounded-full border shadow-sm"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
          <p className="text-gray-500">@{user.username} | Role: {user.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 py-4 border-t">
        {/* Informasi Kontak */}
        <section>
          <h2 className="font-bold text-gray-700">Contact Details</h2>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
        </section>

        {/* Informasi Pekerjaan (Nested Object) */}
        <section className="mt-2">
          <h2 className="font-bold text-gray-700">Company Information</h2>
          <p>Title: {user.company?.title}</p>
          <p>Department: {user.company?.department}</p>
          <p>Company: {user.company?.name}</p>
        </section>

        {/* Informasi Alamat (Nested Object) */}
        <section className="mt-2">
          <h2 className="font-bold text-gray-700">Location</h2>
          <p>Address: {user.address?.address}</p>
          <p>City: {user.address?.city}, {user.address?.state}</p>
        </section>
      </div>

      <div className="mt-8 flex gap-4 pt-4 border-t">
        <Link className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm" to="/users">
          Browse Users
        </Link>
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded"
          type="button"
          onClick={() => setEditing(true)}
        >
          Edit My Profile
        </button>
        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="px-4 py-2 bg-gray-100 text-red-600 border rounded"
        >
          Logout
        </button>
        <button
          onClick={async () => {
            if (!confirm("Delete your account? This cannot be undone.")) return;
            const res = await deleteSelf();
            if (res.ok) navigate("/login");
          }}
          className="px-4 py-2 bg-red-600 text-white rounded"
          type="button"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
