import api from "../../lib/api";

const TOKEN_KEY = "token";
const LS_KEY = "localUsersStore";

function readStore() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : { patches: {}, created: {}, deleted: [] };
  } catch {
    return { patches: {}, created: {}, deleted: [] };
  }
}
function deepMergeUser(base, patch) {
  const next = { ...base, ...patch };
  if (base?.address || patch?.address) {
    next.address = { ...(base?.address || {}), ...(patch?.address || {}) };
  }
  if (base?.company || patch?.company) {
    next.company = { ...(base?.company || {}), ...(patch?.company || {}) };
  }
  return next;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login({ username, password }) {
  if (!username || !password) throw new Error("Username and password are required");
  const data = await api.post("/auth/login", { username, password });

  const token = data?.token || data?.accessToken;
  if (token) setToken(token);

  // Fetch full user data from /auth/me after login
  const user = await getCurrentUser();
  return { token, user };
}

export function logout() {
  clearToken();
  return true;
}

export async function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  const data = await api.get("/auth/me", { auth: true });
  // Apply local overlay patch for current user if present
  const store = readStore();
  const patch = store.patches?.[data.id];
  if (store.deleted?.includes(data.id)) {
    // If locally deleted, treat as logged out
    clearToken();
    return null;
  }
  return patch ? deepMergeUser(data, patch) : data;
}

export default { login, logout, getCurrentUser, getToken, setToken, clearToken };
