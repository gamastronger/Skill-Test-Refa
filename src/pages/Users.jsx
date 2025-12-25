import { useEffect, useState } from "react";
import { fetchUsers, createUser, deleteUser } from "../services/dummyjson";
import Button from "../components/ui/Button";
import useUserFilters from "../hook/useUserFilters";
import UserFilters from "../components/UserFilters";
import UserList from "../components/UserList";
import UserCreateForm from "../components/UserCreateForm";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);

  const { query, setQuery, filteredUsers } = useUserFilters(users);

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

        {/* Filters */}
        <UserFilters query={query} onQueryChange={setQuery} total={users.length} />

        {/* Create Form */}
        {creating && (
          <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">New user details</h2>
              <p className="mt-1 text-sm text-slate-600">Keep it minimal. You can always edit later.</p>
            </div>
            <UserCreateForm
              loading={createLoading}
              error={createError}
              onCancel={() => {
                setCreating(false);
                setCreateError(null);
              }}
              onSubmit={async (payload, reset) => {
                setCreateError(null);
                setCreateLoading(true);
                try {
                  const created = await createUser(payload);
                  setUsers((list) => [created, ...list]);
                  setCreating(false);
                  reset?.();
                } catch (err) {
                  setCreateError(err?.message || "Failed to create user");
                } finally {
                  setCreateLoading(false);
                }
              }}
            />
          </div>
        )}

        {/* Users List */}
        <UserList
          users={filteredUsers}
          onDelete={async (u) => {
            if (!confirm(`Delete ${u.firstName} ${u.lastName}?`)) return;
            try {
              await deleteUser(u.id);
              setUsers((list) => list.filter((x) => x.id !== u.id));
            } catch (err) {
              alert(err?.message || "Failed to delete user");
            }
          }}
        />

        <div className="h-6" />
      </div>
    </div>
  );
}
