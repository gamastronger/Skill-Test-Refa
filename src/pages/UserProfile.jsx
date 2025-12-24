import { useParams, Link } from "react-router-dom";

export default function UserProfile() {
  const { id } = useParams();

  return (
    <div className="p-6 border rounded-lg">
      <h1 className="text-2xl font-bold">User Profile</h1>
      <p className="mt-2">Route: /users/{id}</p>
      <p className="mt-2 font-semibold">User ID: {id}</p>

      <div className="mt-4">
        <Link className="underline text-blue-600" to="/users">
          Back to Users
        </Link>
      </div>
    </div>
  );
}
