import UserCard from "./UserCard";

export default function UserList({ users, onDelete }) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold tracking-wide text-slate-900">Directory</h2>
        <p className="mt-1 text-sm text-slate-600">A simple list with quick actions.</p>
      </div>

      <ul className="divide-y divide-slate-100">
        {users.map((u) => (
          <UserCard key={u.id} user={u} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  );
}
