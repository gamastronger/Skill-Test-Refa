import { Link } from "react-router-dom";

export default function Users() {
  return (
    <div className="p-6 border rounded-lg">
      <h1 className="text-2xl font-bold">Users</h1>
      <p className="mt-2">Route: /users</p>

      <ul className="mt-4 list-disc pl-6">
        <li>
          <Link className="underline text-blue-600" to="/users/1">
            Go to User 1
          </Link>
        </li>
        <li>
          <Link className="underline text-blue-600" to="/users/2">
            Go to User 2
          </Link>
        </li>
      </ul>
    </div>
  );
}
