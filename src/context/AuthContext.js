"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useCookieConsent } from "@/hooks/useCookieConsent";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { canUseAuth, loading: consentLoading } = useCookieConsent();
  const mountedRef = useRef(true);

  // Petite aide pour éviter de setState après unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const checkMe = useCallback(async () => {
    // Si pas de consentement pour les cookies fonctionnels, on invalide localement
    if (!canUseAuth()) {
      if (mountedRef.current) {
        setIsAuthenticated(false);
        setUser(null);
      }
      return false;
    }

    const ac = new AbortController();
    try {
      const res = await fetch("/api/me", {
        credentials: "include",
        cache: "no-store",
        signal: ac.signal,
      });

      if (!res.ok) {
        if (mountedRef.current) {
          setIsAuthenticated(false);
          setUser(null);
        }
        return false;
      }

      const data = await res.json().catch(() => null);
      if (mountedRef.current) {
        setIsAuthenticated(true);
        setUser(data?.user ?? null);
      }
      return true;
    } catch {
      if (mountedRef.current) {
        setIsAuthenticated(false);
        setUser(null);
      }
      return false;
    }
  }, [canUseAuth]);

  const login = useCallback(async () => {
    // Ici, login() NE fait qu’un refresh de session (via /api/me)
    // Le vrai POST /api/login est déclenché depuis la page Login
    return checkMe();
  }, [checkMe]);

  const logout = useCallback(async () => {
    try {
      // On tente de vider le cookie côté serveur (httpOnly)
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      if (mountedRef.current) {
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  }, []);

  // Check initial une fois le consentement connu
  useEffect(() => {
    if (consentLoading) return;

    (async () => {
      await checkMe();
      if (mountedRef.current) setLoading(false);
    })();
  }, [consentLoading, checkMe]);

  // Re-sync quand l’onglet revient en focus (session expirée/renouvelée)
  useEffect(() => {
    if (consentLoading || !canUseAuth()) return;

    const onFocus = () => {
      // Pas bloquant : pas besoin d’attendre
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
        user,
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
