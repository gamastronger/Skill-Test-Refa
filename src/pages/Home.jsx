import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

export default function Home() {
  // Ambil data langsung dari Central Store (Context)
  const { user, loading, logout, isAuthenticated } = useAuth();

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
          onClick={logout}
          className="px-4 py-2 bg-gray-100 text-red-600 border rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
