import { Link } from "react-router-dom";
import Button from "./ui/Button";

export default function UserCard({ user, onDelete }) {
  return (
    <li
      className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/60 transition"
    >
      <div className="flex items-center gap-4 min-w-0">
        <img
          src={user.image}
          alt={`${user.firstName} ${user.lastName}`}
          className="h-12 w-12 rounded-2xl object-cover ring-1 ring-black/10"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = "https://dummyjson.com/icon/512x512.png";
          }}
        />

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-slate-600 truncate">{user.email}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:justify-end">
        <Button as={Link} to={`/users/${user.id}`} variant="secondary">
          View
        </Button>

        <Button type="button" variant="danger" onClick={() => onDelete(user)}>
          Delete
        </Button>
      </div>
    </li>
  );
}
