import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchUserById, updateUser as updateUserService } from "../services/dummyjson";
import { useAuth } from "../features/auth/useAuth";
import EditProfileForm from "../components/EditProfileForm.jsx";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Button({ as = "button", variant = "secondary", className, ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition " +
    "focus:outline-none focus-visible:ring-4 disabled:opacity-50 disabled:cursor-not-allowed";

  const styles = {
    primary:
      "bg-slate-900 text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-900/15",
    secondary:
      "text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:ring-slate-900/10",
  };

  const Comp = as;
  return <Comp className={cx(base, styles[variant], className)} {...props} />;
}

function SectionCard({ title, children }) {
  return (
    <section className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold tracking-wide text-slate-900">
          {title}
        </h2>
      </div>
      <div className="px-6 py-2 divide-y divide-slate-100">{children}</div>
    </section>
  );
}

function InfoRow({ label, value }) {
  const display =
    value === undefined || value === null || value === ""
      ? <span className="text-slate-400">—</span>
      : value;

  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <dt className="text-sm font-medium text-slate-600">{label}</dt>
      <dd className="text-sm text-slate-900 text-right break-words max-w-[60%]">
        {display}
      </dd>
    </div>
  );
}

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

  const displayUser = useMemo(() => localUser ?? baseUser, [localUser, baseUser]);

  const loading = isUserDetailRoute ? remoteLoading : sessionLoading;
  const error = isUserDetailRoute ? remoteError : null;

  const canEdit = useMemo(() => {
    if (!sessionUser || !displayUser) return false;
    if (isProfileRoute) return true;
    return String(sessionUser.id) === String(displayUser.id);
  }, [sessionUser, displayUser, isProfileRoute]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-[70vh] grid place-items-center bg-slate-50 px-4">
        <div className="flex items-center gap-3 text-slate-600">
          <span className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6">
          <h1 className="text-lg font-semibold text-slate-900">User Profile</h1>
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
          <div className="mt-6">
            <Button as={Link} to="/users" variant="secondary">
              Back to Users
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No data
  if (!displayUser) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 grid place-items-center">
        <div className="w-full max-w-md rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6">
          <h1 className="text-lg font-semibold text-slate-900">
            {isProfileRoute ? "My Profile" : "User Profile"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">No user data available.</p>
          <div className="mt-6">
            <Button as={Link} to="/login" variant="primary" className="w-full">
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const fullName = `${displayUser.firstName ?? ""} ${displayUser.lastName ?? ""}`.trim();
  const role = displayUser.role;
  const meta = [
    displayUser.username ? `@${displayUser.username}` : null,
    displayUser.gender ? displayUser.gender : null,
    typeof displayUser.age === "number" ? `${displayUser.age} years` : null,
  ].filter(Boolean).join(" • ");

  const backHref = isUserDetailRoute ? "/users" : "/";
  const rightHref = isUserDetailRoute ? "/profile" : "/users";
  const rightLabel = isUserDetailRoute ? "My Profile" : "Users";

  // Editing
  if (isEditing && canEdit) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Edit Profile</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Keep it clean. Avoid unnecessary changes.
                </p>
              </div>
              <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>

            <div className="p-6">
              <EditProfileForm
                user={displayUser}
                onCancel={() => setIsEditing(false)}
                onSave={async (updated) => {
                  if (sessionUser && String(sessionUser.id) === String(displayUser.id)) {
                    const res = await updateProfile(updated);
                    if (res.ok) setLocalUser(null);
                  } else if (isUserDetailRoute) {
                    try {
                      const next = await updateUserService(displayUser.id, updated);
                      setRemoteUser(next);
                      setLocalUser(null);
                    } catch {
                      setLocalUser((prev) => ({ ...(prev ?? displayUser), ...updated }));
                    }
                  }
                  setIsEditing(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // View
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Header card */}
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm overflow-hidden">
          <div className="px-6 py-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {displayUser.image ? (
                    <img
                      src={displayUser.image}
                      alt={displayUser.firstName || "User"}
                      className="h-16 w-16 rounded-2xl object-cover ring-1 ring-black/10"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = "https://dummyjson.com/icon/512x512.png";
                      }}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-2xl bg-slate-200 grid place-items-center text-slate-700 font-semibold ring-1 ring-black/10">
                      {(displayUser.firstName?.[0] || "U").toUpperCase()}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                      {fullName || "Unnamed user"}
                    </h1>
                    {role ? (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {role}
                      </span>
                    ) : null}
                  </div>

                  {meta ? (
                    <p className="mt-1 text-sm text-slate-600">{meta}</p>
                  ) : (
                    <p className="mt-1 text-sm text-slate-500">Profile details</p>
                  )}
                </div>
              </div>

              {canEdit ? (
                <Button type="button" variant="primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : null}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SectionCard title="Contact Info">
            <dl>
              <InfoRow label="Email" value={displayUser.email} />
              <InfoRow label="Phone" value={displayUser.phone} />
              <InfoRow
                label="Address"
                value={
                  displayUser.address
                    ? `${displayUser.address.address ?? ""}${displayUser.address.address ? ", " : ""}${displayUser.address.city ?? ""}${displayUser.address.city ? ", " : ""}${displayUser.address.state ?? ""}`.trim() || null
                    : null
                }
              />
            </dl>
          </SectionCard>

          <SectionCard title="Professional">
            <dl>
              <InfoRow label="Title" value={displayUser.company?.title} />
              <InfoRow label="Company" value={displayUser.company?.name} />
              <InfoRow label="Department" value={displayUser.company?.department} />
            </dl>
          </SectionCard>
        </div>

        {/* Footer nav */}
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button as={Link} to={backHref} variant="secondary">
              Back
            </Button>

            <Button as={Link} to={rightHref} variant="secondary">
              {rightLabel}
            </Button>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
}
