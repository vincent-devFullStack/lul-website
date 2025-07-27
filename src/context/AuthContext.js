"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then((res) =>
        res.ok ? setIsAuthenticated(true) : setIsAuthenticated(false)
      )
      .catch(() => setIsAuthenticated(false));
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Erreur de déconnexion :", err);
    } finally {
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
