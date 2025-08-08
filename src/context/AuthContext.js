"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useCookieConsent } from "@/hooks/useCookieConsent";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { canUseAuth, loading: consentLoading } = useCookieConsent();

  // utilitaire
  const checkMe = async () => {
    try {
      const res = await fetch("/api/me", { credentials: "include" });
      setIsAuthenticated(res.ok);
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (consentLoading) return;
    if (!canUseAuth()) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    (async () => {
      await checkMe();
      setLoading(false);
    })();
  }, [canUseAuth, consentLoading]);

  // On ignore tout "token" côté client : c'est le serveur qui gère
  const login = () => {
    // Le cookie httpOnly a été posé par l'API /api/login : on se contente de marquer l'état
    setIsAuthenticated(true);
    return true;
  };

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
    } finally {
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        loading: loading || consentLoading,
        canUseAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
