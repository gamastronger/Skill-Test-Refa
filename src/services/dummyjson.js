import api from "../lib/api";

export function fetchUsers(params = {}) {
  const { limit = 10, skip = 0 } = params;
  return api.get(`/users?limit=${limit}&skip=${skip}`);
}

export function fetchUserById(id) {
  if (!id) throw new Error("User id is required");
  return api.get(`/users/${id}`);
}

export default { fetchUsers, fetchUserById };
