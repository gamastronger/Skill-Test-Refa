import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import EditProfileForm from "../components/EditProfileForm.jsx";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function InfoRow({ label, value }) {
  const display =
    value === undefined || value === null || value === "" ? (
      <span className="text-slate-400">—</span>
    ) : (
      value
    );

  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <dt className="text-sm font-medium text-slate-600">{label}</dt>
      <dd className="text-sm text-slate-900 text-right break-words max-w-[60%]">
        {display}
      </dd>
    </div>
  );
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

function Button({ as = "button", variant = "secondary", className, ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition " +
    "focus:outline-none focus-visible:ring-4 disabled:opacity-50 disabled:cursor-not-allowed";

  const styles = {
    primary:
      "bg-slate-900 text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-900/15",
    secondary:
      "text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:ring-slate-900/10",
    danger:
      "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-600/15",
  };

  const Comp = as;
  return <Comp className={cx(base, styles[variant], className)} {...props} />;
}

// helper: file -> dataURL
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  const navigate = useNavigate();
  const { user, loading, logout, isAuthenticated, updateProfile, deleteSelf } =
    useAuth();

  const [editing, setEditing] = useState(false);

  // photo upload state
  const [photoPreview, setPhotoPreview] = useState(null); // dataURL
  const [photoError, setPhotoError] = useState(null);


  const currentAvatar = useMemo(() => {
    return photoPreview || user?.image || null;
  }, [photoPreview, user?.image]);

  // These must be defined before the main return
  let fullName = "";
  let cityState = null;
  if (user) {
    fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    cityState =
      user.address?.city || user.address?.state
        ? `${user.address?.city ?? ""}${
            user.address?.city && user.address?.state ? ", " : ""
          }${user.address?.state ?? ""}`.trim()
        : null;
  }

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

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 grid place-items-center">
        <div className="w-full max-w-md rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6">
          <h1 className="text-lg font-semibold text-slate-900">Home</h1>
          <p className="mt-2 text-sm text-slate-600">You are not logged in.</p>
          <div className="mt-6">
            <Button as={Link} to="/login" variant="primary" className="w-full">
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Edit mode + upload avatar
  if (editing) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto w-full max-w-2xl">
          <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  Edit My Profile
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Update only what matters. Keep it tidy.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setPhotoPreview(null);
                  setPhotoError(null);
                }}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Avatar uploader */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {currentAvatar ? (
                        <img
                          src={currentAvatar}
                          alt="Profile"
                          className="h-16 w-16 rounded-2xl object-cover ring-1 ring-black/10"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-2xl bg-slate-200 grid place-items-center text-slate-700 font-semibold ring-1 ring-black/10">
                          {(user.firstName?.[0] || "U").toUpperCase()}
                        </div>
                      )}
                      {photoPreview ? (
                        <span className="absolute -bottom-1 -right-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-black/10">
                          Preview
                        </span>
                      ) : null}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Profile photo
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        JPG/PNG/WebP. Max 2MB (recommended).
                      </p>
                      {photoError ? (
                        <p className="mt-2 text-xs text-red-600">{photoError}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-end">
                    <label
                      className={cx(
                        "inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition",
                        "text-slate-700 ring-1 ring-slate-200 bg-white hover:bg-slate-50",
                        "focus-within:outline-none focus-within:ring-4 focus-within:ring-slate-900/10"
                      )}
                    >
                      Choose photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          setPhotoError(null);

                          // basic validation
                          const isImage = file.type.startsWith("image/");
                          if (!isImage) {
                            setPhotoError("File must be an image.");
                            return;
                          }
                          const maxBytes = 2 * 1024 * 1024; // 2MB
                          if (file.size > maxBytes) {
                            setPhotoError("Max file size is 2MB.");
                            return;
                          }

                          try {
                            const dataUrl = await fileToDataUrl(file);
                            setPhotoPreview(dataUrl);
                          } catch (err) {
                            setPhotoError(err?.message || "Failed to load image.");
                          }
                        }}
                      />
                    </label>

                    {photoPreview ? (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setPhotoPreview(null);
                          setPhotoError(null);
                        }}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Existing profile form */}
              <EditProfileForm
                user={user}
                onCancel={() => setEditing(false)}
                onSave={async (updates) => {
                  // Gabungkan photoPreview jika ada ke dalam updates
                  const finalUpdates = photoPreview ? { ...updates, image: photoPreview } : updates;
                  const res = await updateProfile(finalUpdates);
                  if (res.ok) {
                    setEditing(false);
                    setPhotoPreview(null);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm overflow-hidden">
          <div className="px-6 py-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.firstName || "User"}
                      className="h-16 w-16 rounded-2xl object-cover ring-1 ring-black/10"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-2xl bg-slate-200 grid place-items-center text-slate-700 font-semibold ring-1 ring-black/10">
                      {(user.firstName?.[0] || "U").toUpperCase()}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>

                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                    {fullName || "Unnamed User"}
                  </h1>
                  <p className="mt-1 text-sm text-slate-600">
                    <span className="text-slate-900 font-medium">
                      @{user.username}
                    </span>
                    <span className="text-slate-300 px-2">•</span>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {user.role ?? "member"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button as={Link} to="/users" variant="secondary">
                  Browse Users
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SectionCard title="Contact Details">
            <dl>
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Phone" value={user.phone} />
            </dl>
          </SectionCard>

          <SectionCard title="Company Information">
            <dl>
              <InfoRow label="Title" value={user.company?.title} />
              <InfoRow label="Department" value={user.company?.department} />
              <InfoRow label="Company" value={user.company?.name} />
            </dl>
          </SectionCard>

          <div className="lg:col-span-2">
            <SectionCard title="Location">
              <dl>
                <InfoRow label="Address" value={user.address?.address} />
                <InfoRow label="City" value={cityState} />
              </dl>
            </SectionCard>
          </div>
        </div>

        {/* Actions */}
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Jaga keamanan akun Anda. Hapus hanya jika Anda benar-benar bermaksud demikian.
            </p>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </Button>

              <Button
                type="button"
                variant="danger"
                onClick={async () => {
                  if (!confirm("Delete your account? This cannot be undone.")) return;
                  const res = await deleteSelf();
                  if (res.ok) navigate("/login");
                }}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
}
