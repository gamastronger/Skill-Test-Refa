const BASE_URL = "https://dummyjson.com";

function maskSensitiveData(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const masked = { ...obj };
  if (masked.password) masked.password = "********";
  return masked;
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const { auth, ...fetchOptions } = options;

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(fetchOptions.headers || {}),
  };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const hasJsonBody =
    fetchOptions.body &&
    typeof fetchOptions.body === "object" &&
    !(fetchOptions.body instanceof FormData);

  const finalOptions = {
    ...fetchOptions,
    method: (fetchOptions.method || "GET").toUpperCase(),
    headers,
    body: hasJsonBody ? JSON.stringify(fetchOptions.body) : fetchOptions.body,
  };

  if (import.meta.env.DEV) {
    console.log("[API]", finalOptions.method, path, maskSensitiveData(fetchOptions.body));
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  let res;
  try {
    res = await fetch(url, { ...finalOptions, signal: controller.signal });
  } catch (err) {
    throw new Error(`Network error: ${err.message}`);
  } finally {
    clearTimeout(timeoutId);
  }

  const contentType = res.headers.get("content-type") || "";
  let data = null;

  try {
    data = contentType.includes("application/json") ? await res.json() : await res.text();
  } catch (err) {}

  if (!res.ok) {
    const message =
      (typeof data === "object" && data?.message) ||
      (typeof data === "object" && data?.error) ||
      `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export function get(path, options = {}) {
  return request(path, { ...options, method: "GET" });
}
export function post(path, body, options = {}) {
  return request(path, { ...options, method: "POST", body });
}
export function put(path, body, options = {}) {
  return request(path, { ...options, method: "PUT", body });
}
export function patch(path, body, options = {}) {
  return request(path, { ...options, method: "PATCH", body });
}
export function del(path, options = {}) {
  return request(path, { ...options, method: "DELETE" });
}

export default { get, post, put, patch, del };
