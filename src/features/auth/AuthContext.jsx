import { useEffect, useMemo, useReducer, useCallback } from "react";
import authService from "./authService";
import { AuthContext, authReducer, initialAuthState } from "./AuthCore";
import { updateUser as updateUserService } from "../../services/dummyjson";
import { deleteUser as deleteUserService } from "../../services/dummyjson";

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      dispatch({ type: "BOOTSTRAP_START" });

      const token = authService.getToken?.() || localStorage.getItem("token");
      if (!token) {
        if (!cancelled) dispatch({ type: "BOOTSTRAP_ANON" });
        return;
      }

      try {
        const user = await authService.getCurrentUser(token);
        if (!cancelled) dispatch({ type: "BOOTSTRAP_SUCCESS", payload: { user, token } });
      } catch {
        authService.logout();
        if (!cancelled) dispatch({ type: "BOOTSTRAP_ANON" });
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const { token, user } = await authService.login(credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: { token, user } });
      return { ok: true };
    } catch (e) {
      const message = e?.message || "Login failed";
      dispatch({ type: "LOGIN_ERROR", payload: message });
      return { ok: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    dispatch({ type: "LOGOUT" });
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const id = state?.user?.id;
    if (!id) return { ok: false, error: "No authenticated user" };
    dispatch({ type: "PROFILE_UPDATE_START" });
    try {
      const updated = await updateUserService(id, updates);
      const base = state.user || {};
      const merged = {
        ...base,
        ...updated,
        address: { ...(base.address || {}), ...(updated.address || {}) },
        company: { ...(base.company || {}), ...(updated.company || {}) },
      };
      dispatch({ type: "PROFILE_UPDATE_SUCCESS", payload: { user: merged } });
      return { ok: true, user: updated };
    } catch (e) {
      const message = e?.message || "Profile update failed";
      dispatch({ type: "PROFILE_UPDATE_ERROR", payload: message });
      return { ok: false, error: message };
    }
  }, [state?.user?.id]);

  const value = useMemo(
    () => ({
      user: state.user,
      token: state.token,
      isAuthenticated: state.isAuthenticated,
      loading: state.loading,
      error: state.error,
      login,
      logout,
      updateProfile,
      async deleteSelf() {
        const id = state?.user?.id;
        if (!id) return { ok: false, error: "No authenticated user" };
        try {
          await deleteUserService(id);
        } catch {}
        authService.logout();
        dispatch({ type: "LOGOUT" });
        return { ok: true };
      },
    }),
    [state, login, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
