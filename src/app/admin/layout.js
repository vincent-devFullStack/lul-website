"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useCallback } from "react";
import Link from "next/link";
import { FiHome } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { MdOutlineRoomPreferences } from "react-icons/md";
import { BsQuote } from "react-icons/bs";
import "@/styles/pages/admin.css";

export default function AdminLayout({ children }) {
  const { isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Redirection douce vers /login quand on connaît l'état d'auth
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const from = encodeURIComponent(pathname || "/admin");
      router.replace(`/login?from=${from}`);
    }
  }, [isAuthenticated, loading, router, pathname]);

  const handleLogout = useCallback(async () => {
    try {
      await logout(); // suppose qu'il appelle /api/logout en interne
    } finally {
      router.replace("/login");
    }
  }, [logout, router]);

  if (loading) {
    return (
      <div className="admin-loading" role="status" aria-live="polite">
        <div className="loading-spinner" />
        <p>Chargement…</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const isActive = (href) =>
    pathname === href || (pathname?.startsWith(href + "/") ?? false);

  return (
    <div className="admin-fullscreen">
      {/* Lien d’évitement */}
      <a href="#admin-main" className="sr-only focus:not-sr-only">
        Aller au contenu
      </a>

      <header className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-header-title">
            L&apos;iconodule – Administration
          </h1>
        </div>

        <div className="admin-header-right">
          <Link
            href="/accueil"
            className="admin-header-link"
            aria-label="Retour au site"
          >
            <FiHome className="w-5 h-5 mr-2" />
            <span className="hidden md:block">Retour au site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="admin-header-link admin-header-logout"
            type="button"
          >
            <BiLogOut className="w-5 h-5 mr-2" />
            <span className="hidden md:block">Déconnexion</span>
          </button>
        </div>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <nav className="admin-nav" aria-label="Navigation d’administration">
            <ul>
              <li>
                <Link
                  href="/admin/salles"
                  className="flex items-center gap-2"
                  aria-current={isActive("/admin/salles") ? "page" : undefined}
                  data-active={isActive("/admin/salles")}
                >
                  <MdOutlineRoomPreferences className="w-5 h-5" />
                  Gestion des salles
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/mementos"
                  className="flex items-center gap-2"
                  aria-current={
                    isActive("/admin/mementos") ? "page" : undefined
                  }
                  data-active={isActive("/admin/mementos")}
                >
                  <BsQuote className="w-5 h-5" />
                  Gestion des mementos
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main id="admin-main" className="admin-main" role="main" tabIndex={-1}>
          <div className="admin-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
