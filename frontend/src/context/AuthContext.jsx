import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const safeParse = (value, fallback) => {
  try { return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
};

export const AuthProvider = ({ children }) => {
  // session is loaded from localStorage (set by AuthPage.jsx after API login)
  const [session, setSession] = useState(() =>
    safeParse(localStorage.getItem("user"), null)
  );

  const refreshSession = () => {
    const updated = safeParse(localStorage.getItem("user"), null);
    setSession(updated);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setSession(null);
  };

  const value = useMemo(
    () => ({ session, setSession, refreshSession, logout, isAuthenticated: Boolean(session) }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
