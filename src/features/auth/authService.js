import api from "../../lib/api";

const TOKEN_KEY = "token";

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

  return data;
}

export function logout() {
  clearToken();
  return true;
}

export async function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  const data = await api.get("/auth/me", { auth: true });
  return data;
}

export default { login, logout, getCurrentUser, getToken, setToken, clearToken };
