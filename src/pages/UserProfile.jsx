import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchUserById, updateUser as updateUserService } from "../services/dummyjson";
import { useAuth } from "../features/auth/useAuth";
import EditProfileForm from "../components/EditProfileForm.jsx";

export default function UserProfile() {
  const { id } = useParams();
  const location = useLocation();
  const { user: sessionUser, loading: sessionLoading, updateProfile } = useAuth();

  const isProfileRoute = location.pathname === "/profile";
  const isUserDetailRoute = Boolean(id);

  const [remoteUser, setRemoteUser] = useState(null);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [remoteError, setRemoteError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!isUserDetailRoute) return;

      try {
        setRemoteLoading(true);
        setRemoteError(null);
        const data = await fetchUserById(id);
        if (mounted) setRemoteUser(data);
      } catch (e) {
        if (mounted) setRemoteError(e?.message || "Failed to fetch user");
      } finally {
        if (mounted) setRemoteLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id, isUserDetailRoute]);

  const baseUser = useMemo(() => {
    if (isUserDetailRoute) return remoteUser;
    return sessionUser;
  }, [isUserDetailRoute, remoteUser, sessionUser]);

  const displayUser = useMemo(() => {
    return localUser ?? baseUser;
  }, [localUser, baseUser]);

  const loading = isUserDetailRoute ? remoteLoading : sessionLoading;
  const error = isUserDetailRoute ? remoteError : null;

  const canEdit = useMemo(() => {
    if (!sessionUser || !displayUser) return false;
    if (isProfileRoute) return true;
    return String(sessionUser.id) === String(displayUser.id);
  }, [sessionUser, displayUser, isProfileRoute]);

  if (loading) {
    return (
      <div className="p-6 border rounded-lg">
        <h1 className="text-2xl font-bold">{isProfileRoute ? "My Profile" : "User Profile"}</h1>
        <p className="mt-4">Loading...</p>
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

  if (!displayUser) {
    return (
      <div className="p-6 border rounded-lg">
        <h1 className="text-2xl font-bold">{isProfileRoute ? "My Profile" : "User Profile"}</h1>
        <p className="mt-4 text-red-600">No user data available.</p>
        <div className="mt-4">
          <Link className="underline text-blue-600" to="/login">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (isEditing && canEdit) {
    return (
      <div className="p-8 max-w-3xl mx-auto border rounded-xl shadow-sm bg-white">
        <div className="flex items-center justify-between pb-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
          <button
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition"
            onClick={() => setIsEditing(false)}
            type="button"
          >
            Cancel
          </button>
        </div>

        <EditProfileForm
          user={displayUser}
          onCancel={() => setIsEditing(false)}
          onSave={async (updated) => {
            // If editing self (profile route or same id), sync via auth context
            if (sessionUser && String(sessionUser.id) === String(displayUser.id)) {
              const res = await updateProfile(updated);
              if (res.ok) {
                setLocalUser(null); // rely on context updated user
              }
            } else if (isUserDetailRoute) {
              try {
                const next = await updateUserService(displayUser.id, updated);
                setRemoteUser(next);
                setLocalUser(null);
              } catch {
                // keep local state fallback if needed
                setLocalUser((prev) => ({ ...(prev ?? displayUser), ...updated }));
              }
            }
            setIsEditing(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto border rounded-xl shadow-sm bg-white">
      <div className="flex items-center justify-between gap-6 pb-6 border-b">
        <div className="flex items-center gap-6">
          <img
            src={displayUser.image}
            alt={displayUser.firstName}
            className="w-24 h-24 rounded-full border-4 border-blue-50 object-cover shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-bold text-gray-800">
                {displayUser.firstName} {displayUser.lastName}
              </h1>
              {displayUser.role ? (
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-red-100 text-red-600">
                  {displayUser.role}
                </span>
              ) : null}
            </div>
            <p className="text-lg text-gray-500">
              @{displayUser.username} • {displayUser.gender}, {displayUser.age} Years
            </p>
          </div>
        </div>

        {canEdit ? (
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
            onClick={() => setIsEditing(true)}
            type="button"
          >
            Edit
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-4">Contact Info</h2>
          <div className="space-y-3">
            <p>
              <span className="text-gray-400">Email:</span> {displayUser.email}
            </p>
            <p>
              <span className="text-gray-400">Phone:</span> {displayUser.phone}
            </p>
            {displayUser.address ? (
              <p>
                <span className="text-gray-400">Address:</span> {displayUser.address.address},{" "}
                {displayUser.address.city}, {displayUser.address.state}
              </p>
            ) : null}
          </div>
        </section>

        {displayUser.company ? (
          <section>
            <h2 className="text-sm font-bold text-gray-400 uppercase mb-4">Professional</h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-bold text-blue-800">{displayUser.company.title}</p>
              <p className="text-sm text-gray-600">{displayUser.company.name}</p>
              <p className="text-xs text-gray-400 mt-2">Dept: {displayUser.company.department}</p>
            </div>
          </section>
        ) : (
          <section>
            <h2 className="text-sm font-bold text-gray-400 uppercase mb-4">Info</h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">No company info.</p>
            </div>
          </section>
        )}
      </div>

      <div className="mt-10 pt-6 border-t flex justify-between">
        <Link
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition"
          to={isUserDetailRoute ? "/users" : "/"}
        >
          ← Back
        </Link>
        {isUserDetailRoute ? (
          <Link className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition" to="/profile">
            My Profile
          </Link>
        ) : (
          <Link className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition" to="/users">
            Users
          </Link>
        )}
      </div>
    </div>
  );
}
