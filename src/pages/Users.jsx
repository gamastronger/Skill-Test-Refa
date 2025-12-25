import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUsers, createUser, deleteUser } from "../services/dummyjson";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Button({ as = "button", variant = "secondary", className, ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition " +
    "focus:outline-none focus-visible:ring-4 disabled:opacity-50 disabled:cursor-not-allowed";

  const styles = {
    primary:
      "bg-[#1C4D8D] text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-900/15",
    secondary:
      "text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:ring-slate-900/10",
    success:
      "bg-[#1C4D8D] text-white shadow-sm hover:bg-[#0F2854] focus-visible:ring-emerald-600/15",
    danger:
      "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-600/15",
    ghost:
      "text-slate-700 hover:bg-slate-100/70 focus-visible:ring-slate-900/10",
  };

  const Comp = as;
  return <Comp className={cx(base, styles[variant], className)} {...props} />;
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="mt-2">{children}</div>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

function Input({ className, ...props }) {
  return (
    <input
      className={cx(
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition",
        "placeholder:text-slate-400",
        "focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

function SectionTitle({ children }) {
  return (
    <div className="pt-2">
      <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
        {children}
      </p>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);

  const initialNewUser = useMemo(
    () => ({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      address: { address: "", city: "", state: "", postalCode: "" },
      company: { name: "", title: "", department: "" },
    }),
    []
  );

  const [newUser, setNewUser] = useState(initialNewUser);

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
        if (mounted) setError(err?.message || "Failed to fetch users");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUsers();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] grid place-items-center bg-slate-50 px-4">
        <div className="flex items-center gap-3 text-slate-600">
          <span className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin" />
          <span className="text-sm">Loading users…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto w-full max-w-4xl rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6">
          <h1 className="text-lg font-semibold text-slate-900">Users</h1>
          <p className="mt-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {error}
          </p>
          <div className="mt-6">
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Reload
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm overflow-hidden">
          <div className="px-6 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Users
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Total: <span className="font-medium text-slate-900">{users.length}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={creating ? "secondary" : "success"}
                type="button"
                onClick={() => {
                  setCreateError(null);
                  setCreating((v) => !v);
                }}
              >
                {creating ? "Close" : "Create User"}
              </Button>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>

        {/* Create Form */}
        {creating && (
          <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">
                New user details
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Keep it minimal. You can always edit later.
              </p>
            </div>

            <form
              className="p-6 space-y-5"
              onSubmit={async (e) => {
                e.preventDefault();
                setCreateError(null);
                setCreateLoading(true);
                try {
                  const created = await createUser(newUser);
                  setUsers((list) => [created, ...list]);
                  setCreating(false);
                  setNewUser(initialNewUser);
                } catch (err) {
                  setCreateError(err?.message || "Failed to create user");
                } finally {
                  setCreateLoading(false);
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="First name">
                  <Input
                    value={newUser.firstName}
                    onChange={(e) =>
                      setNewUser((v) => ({ ...v, firstName: e.target.value }))
                    }
                    placeholder="John"
                  />
                </Field>

                <Field label="Last name">
                  <Input
                    value={newUser.lastName}
                    onChange={(e) =>
                      setNewUser((v) => ({ ...v, lastName: e.target.value }))
                    }
                    placeholder="Doe"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Email">
                  <Input
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser((v) => ({ ...v, email: e.target.value }))
                    }
                    placeholder="john@company.com"
                  />
                </Field>

                <Field label="Phone">
                  <Input
                    value={newUser.phone}
                    onChange={(e) =>
                      setNewUser((v) => ({ ...v, phone: e.target.value }))
                    }
                    placeholder="+62…"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Username">
                  <Input
                    value={newUser.username}
                    onChange={(e) =>
                      setNewUser((v) => ({ ...v, username: e.target.value }))
                    }
                    placeholder="johndoe"
                    autoComplete="username"
                  />
                </Field>

                <Field label="Password">
                  <Input
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser((v) => ({ ...v, password: e.target.value }))
                    }
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </Field>
              </div>

              <SectionTitle>Address</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Street">
                  <Input
                    value={newUser.address.address}
                    onChange={(e) =>
                      setNewUser((v) => ({
                        ...v,
                        address: { ...v.address, address: e.target.value },
                      }))
                    }
                    placeholder="Jl. Sudirman…"
                  />
                </Field>

                <Field label="City">
                  <Input
                    value={newUser.address.city}
                    onChange={(e) =>
                      setNewUser((v) => ({
                        ...v,
                        address: { ...v.address, city: e.target.value },
                      }))
                    }
                    placeholder="Jakarta"
                  />
                </Field>

                <Field label="State">
                  <Input
                    value={newUser.address.state}
                    onChange={(e) =>
                      setNewUser((v) => ({
                        ...v,
                        address: { ...v.address, state: e.target.value },
                      }))
                    }
                    placeholder="DKI Jakarta"
                  />
                </Field>

                <Field label="Postal code">
                  <Input
                    value={newUser.address.postalCode}
                    onChange={(e) =>
                      setNewUser((v) => ({
                        ...v,
                        address: { ...v.address, postalCode: e.target.value },
                      }))
                    }
                    placeholder="10220"
                  />
                </Field>
              </div>

              <SectionTitle>Company</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Company name">
                  <Input
                    value={newUser.company.name}
                    onChange={(e) =>
                      setNewUser((v) => ({
                        ...v,
                        company: { ...v.company, name: e.target.value },
                      }))
                    }
                    placeholder="Acme Inc."
                  />
                </Field>

                <Field label="Title">
                  <Input
                    value={newUser.company.title}
                    onChange={(e) =>
                      setNewUser((v) => ({
                        ...v,
                        company: { ...v.company, title: e.target.value },
                      }))
                    }
                    placeholder="Designer"
                  />
                </Field>

                <Field label="Department">
                  <Input
                    value={newUser.company.department}
                    onChange={(e) =>
                      setNewUser((v) => ({
                        ...v,
                        company: { ...v.company, department: e.target.value },
                      }))
                    }
                    placeholder="Product"
                  />
                </Field>
              </div>

              {createError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {createError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setCreating(false);
                    setCreateError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="success" disabled={createLoading}>
                  {createLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      Creating…
                    </span>
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Users List */}
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold tracking-wide text-slate-900">
              Directory
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              A simple list with quick actions.
            </p>
          </div>

          <ul className="divide-y divide-slate-100">
            {users.map((u) => (
              <li
                key={u.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/60 transition"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={u.image}
                    alt={`${u.firstName} ${u.lastName}`}
                    className="h-12 w-12 rounded-2xl object-cover ring-1 ring-black/10"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = "https://dummyjson.com/icon/512x512.png";
                    }}
                  />

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-sm text-slate-600 truncate">{u.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Button as={Link} to={`/users/${u.id}`} variant="secondary">
                    View
                  </Button>

                  <Button
                    type="button"
                    variant="danger"
                    onClick={async () => {
                      if (!confirm(`Delete ${u.firstName} ${u.lastName}?`)) return;
                      try {
                        await deleteUser(u.id);
                        setUsers((list) => list.filter((x) => x.id !== u.id));
                      } catch (err) {
                        alert(err?.message || "Failed to delete user");
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
}
