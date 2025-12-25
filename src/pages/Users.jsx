import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUsers, createUser, deleteUser } from "../services/dummyjson";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    address: { address: "", city: "", state: "", postalCode: "" },
    company: { name: "", title: "", department: "" },
  });

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

      {/* Create User section */}
      <div className="mt-6">
        <button
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          onClick={() => setCreating((v) => !v)}
          type="button"
        >
          {creating ? "Close Create Form" : "Create User"}
        </button>
        {creating && (
          <form
            className="mt-4 space-y-3 p-4 border rounded-md bg-gray-50"
            onSubmit={async (e) => {
              e.preventDefault();
              setCreateError(null);
              setCreateLoading(true);
              try {
                const created = await createUser(newUser);
                setUsers((list) => [created, ...list]);
                setCreating(false);
                setNewUser({
                  firstName: "",
                  lastName: "",
                  email: "",
                  phone: "",
                  username: "",
                  password: "",
                  address: { address: "", city: "", state: "", postalCode: "" },
                  company: { name: "", title: "", department: "" },
                });
              } catch (err) {
                setCreateError(err?.message || "Failed to create user");
              } finally {
                setCreateLoading(false);
              }
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Text name="firstName" label="First Name" value={newUser.firstName} onChange={setNewUser} />
              <Text name="lastName" label="Last Name" value={newUser.lastName} onChange={setNewUser} />
            </div>
            <Text name="email" label="Email" value={newUser.email} onChange={setNewUser} />
            <Text name="phone" label="Phone" value={newUser.phone} onChange={setNewUser} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Text name="username" label="Username" value={newUser.username} onChange={setNewUser} />
              <Text type="password" name="password" label="Password" value={newUser.password} onChange={setNewUser} />
            </div>

            <h3 className="text-sm font-bold text-gray-500 uppercase mt-4">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <NestedText section="address" field="address" label="Street" value={newUser.address.address} onChange={setNewUser} />
              <NestedText section="address" field="city" label="City" value={newUser.address.city} onChange={setNewUser} />
              <NestedText section="address" field="state" label="State" value={newUser.address.state} onChange={setNewUser} />
              <NestedText section="address" field="postalCode" label="Postal Code" value={newUser.address.postalCode} onChange={setNewUser} />
            </div>

            <h3 className="text-sm font-bold text-gray-500 uppercase mt-4">Company</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <NestedText section="company" field="name" label="Company Name" value={newUser.company.name} onChange={setNewUser} />
              <NestedText section="company" field="title" label="Title" value={newUser.company.title} onChange={setNewUser} />
              <NestedText section="company" field="department" label="Department" value={newUser.company.department} onChange={setNewUser} />
            </div>

            {createError && <p className="text-red-600 text-sm">{createError}</p>}

            <button
              type="submit"
              className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
              disabled={createLoading}
            >
              {createLoading ? "Creating..." : "Create"}
            </button>
          </form>
        )}
      </div>

      <ul className="mt-4 divide-y">
        {users.map((user) => (
          <li key={user.id} className="py-3 flex justify-between items-center">
            <div>
              <img
                src={user.image}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-20 h-20 rounded-full border object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "https://dummyjson.com/icon/512x512.png";
                }}
              />
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
            <button
              className="ml-4 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              onClick={async () => {
                if (!confirm(`Delete ${user.firstName} ${user.lastName}?`)) return;
                try {
                  await deleteUser(user.id);
                  setUsers((list) => list.filter((u) => u.id !== user.id));
                } catch (err) {
                  alert(err?.message || "Failed to delete user");
                }
              }}
              type="button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Text({ name, label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange((v) => ({ ...v, [name]: e.target.value }))}
        className="mt-1 w-full border px-3 py-2 rounded"
      />
    </div>
  );
}

function NestedText({ section, field, label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange((v) => ({ ...v, [section]: { ...(v[section] || {}), [field]: e.target.value } }))}
        className="mt-1 w-full border px-3 py-2 rounded"
      />
    </div>
  );
}
