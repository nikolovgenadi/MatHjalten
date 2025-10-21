import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const url = import.meta.env.PROD ? "/api/auth/me" : "http://localhost:8080/api/auth/me";
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const url = import.meta.env.PROD
        ? "/api/auth/logout"
        : "http://localhost:8080/api/auth/logout";
      await fetch(url, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, logout, checkAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
