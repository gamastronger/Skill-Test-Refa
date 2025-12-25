  import api from "../lib/api";
  
  // Lightweight local overlay store for CRUD with local token
  const LS_KEY = "localUsersStore";
  function readStore() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : { patches: {}, created: {}, deleted: [] };
    } catch {
      return { patches: {}, created: {}, deleted: [] };
    }
  }
  function writeStore(store) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(store));
    } catch {
      // b
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
  function applyOverlaysToList(users) {
    const store = readStore();
    // merge patches
    const merged = (users || []).map((u) => {
      const p = store.patches[u.id];
      return p ? deepMergeUser(u, p) : u;
    });
    // append created
    const createdList = Object.values(store.created);
    const filtered = merged.filter((u) => !store.deleted.includes(u.id));
    return [...createdList, ...filtered];
  }
  function applyOverlaysToUser(user) {
    const store = readStore();
    if (store.deleted.includes(user.id)) throw new Error("User was deleted locally");
    const patch = store.patches[user.id];
    return patch ? deepMergeUser(user, patch) : user;
  }
  function getLocalCreated(id) {
    const store = readStore();
    return store.created[id] || null;
  }
  function addLocalCreated(user) {
    const store = readStore();
    store.created[user.id] = user;
    writeStore(store);
  }
  function addLocalPatch(id, updates) {
    const store = readStore();
    const prev = store.patches[id] || {};
    store.patches[id] = deepMergeUser(prev, updates);
    writeStore(store);
  }
  function markLocalDeleted(id) {
    const store = readStore();
    // remove if created locally
    if (store.created[id]) delete store.created[id];
    if (!store.deleted.includes(id)) store.deleted.push(id);
    // also clear patches
    if (store.patches[id]) delete store.patches[id];
    writeStore(store);
  }

  export function fetchUsers(params = {}) {
    const { limit = 10, skip = 0 } = params;
    return api
      .get(`/users?limit=${limit}&skip=${skip}`)
      .then((data) => ({ ...data, users: applyOverlaysToList(data.users || []) }))
      .catch(() => ({ users: applyOverlaysToList([]), total: 0, skip, limit }));
  }

  export function fetchUserById(id) {
    if (!id) throw new Error("User id is required");
    const localCreated = getLocalCreated(id);
    if (localCreated) return Promise.resolve(localCreated);
    return api
      .get(`/users/${id}`)
      .then((user) => applyOverlaysToUser(user))
      .catch((err) => {
        // If the user is marked deleted locally, surface that
        const store = readStore();
        if (store.deleted.includes(Number(id)) || store.deleted.includes(id)) {
          throw new Error("User not found (deleted)");
        }
        throw err;
      });
  }

  // Create a new user
  export function createUser(payload) {
    // DummyJSON accepts arbitrary fields; ensure nested objects are passed through
    // e.g., { firstName, lastName, email, phone, address: {...}, company: {...} }
    if (!payload || typeof payload !== "object") throw new Error("Payload is required");
    // Best-effort remote create (with local token)
    const remote = api.post(`/users/add`, payload, { auth: true }).catch(() => null);
    // Always create locally to ensure immediate UX
    const id = Date.now();
    const created = { id, image: "https://dummyjson.com/icon/512x512.png", ...payload };
    addLocalCreated(created);
    // Prefer remote response if available
    return remote.then((res) => res || created);
  }

  // Update an existing user (supports nested address & company)
  export function updateUser(id, updates) {
    if (!id) throw new Error("User id is required");
    if (!updates || typeof updates !== "object") throw new Error("Updates object is required");
    // DummyJSON supports PUT/PATCH; use PUT for full updates
    addLocalPatch(id, updates);
    const local = getLocalCreated(id);
    const base = local ? local : {}; // will be merged by fetchUserById/use
    const merged = deepMergeUser(base, updates);
    // Best-effort remote update
    api.put(`/users/${id}`, updates, { auth: true }).catch(() => null);
    return Promise.resolve({ id, ...merged });
  }

  // Delete a user
  export function deleteUser(id) {
    if (!id) throw new Error("User id is required");
    markLocalDeleted(id);
    // Best-effort remote delete
    return api.del(`/users/${id}`, { auth: true }).catch(() => ({ id }));
  }

  export default { fetchUsers, fetchUserById, createUser, updateUser, deleteUser };
