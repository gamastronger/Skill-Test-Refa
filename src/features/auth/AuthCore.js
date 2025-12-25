// src/features/auth/AuthCore.js
import { createContext } from "react";

export const AuthContext = createContext(null);

export const initialAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export function authReducer(state, action) {
  switch (action.type) {
    case "BOOTSTRAP_START":
      return { ...state, loading: true, error: null };

    case "BOOTSTRAP_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case "BOOTSTRAP_ANON":
      return { ...initialAuthState, loading: false };

    case "LOGIN_START":
      return { ...state, loading: true, error: null };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case "LOGIN_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "LOGOUT":
      return { ...initialAuthState, loading: false };

    default:
      return state;
  }
}
