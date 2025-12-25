// src/features/auth/AuthContext.jsx
import { useEffect, useMemo, useReducer, useCallback } from "react";
import authService from "./authService";
import { AuthContext, authReducer, initialAuthState } from "./AuthCore";

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

  const value = useMemo(
    () => ({
      user: state.user,
      token: state.token,
      isAuthenticated: state.isAuthenticated,
      loading: state.loading,
      error: state.error,
      login,
      logout,
    }),
    [state, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
