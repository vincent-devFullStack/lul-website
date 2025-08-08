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

  // Origin absolue pour éviter tout souci de base path/host
  const getBase = () =>
    typeof window !== "undefined" ? window.location.origin : "";

  const checkMe = useCallback(async () => {
    try {
      const res = await fetch(`${getBase()}/api/me`, {
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
    return await checkMe(); // on attend la confirmation serveur
  }, [canUseAuth, checkMe]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${getBase()}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setIsAuthenticated(false);
    }
  }, []);

  // Check initial une fois le consentement connu
  useEffect(() => {
    if (consentLoading) return;

    if (!canUseAuth()) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const ok = await checkMe();
      if (!cancelled) setLoading(false);
      return ok;
    })();

    return () => {
      cancelled = true;
    };
  }, [canUseAuth, consentLoading, checkMe]);

  // Resync quand l’onglet revient en focus (session expirée/renouvelée)
  useEffect(() => {
    if (consentLoading || !canUseAuth()) return;
    const onFocus = () => {
      checkMe();
    };
    window.addEventListener("focus", onFocus);
    window.addEventListener("visibilitychange", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("visibilitychange", onFocus);
    };
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
