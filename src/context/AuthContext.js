"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useCookieConsent } from "@/hooks/useCookieConsent";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { canUseAuth, loading: consentLoading } = useCookieConsent();

  const checkMe = useCallback(async () => {
    try {
      const res = await fetch("/api/me", {
        credentials: "include",
        cache: "no-store",
      });
      const ok = res.ok;
      setIsAuthenticated(ok);
      return ok;
    } catch {
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  const login = useCallback(async () => {
    if (!canUseAuth()) return false;
    // On attend que le serveur nous reconnaisse AVANT de continuer
    return await checkMe();
  }, [canUseAuth, checkMe]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
    } finally {
      setIsAuthenticated(false);
    }
  }, []);

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
  }, [canUseAuth, consentLoading, checkMe]);

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
