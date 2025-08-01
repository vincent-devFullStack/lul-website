"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import "../../styles/pages/admin.css";

export default function AdminLayout({ children }) {
  const { isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-fullscreen">
      {/* Header admin fixe */}
      <header className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-header-title">L'iconodule - Administration</h1>
        </div>
        <div className="admin-header-right">
          <Link href="/accueil" className="admin-header-link">
            <span className="admin-header-icon">🏠</span>
            Retour au site
          </Link>
          <button
            onClick={handleLogout}
            className="admin-header-link admin-header-logout"
          >
            <span className="admin-header-icon">🚪</span>
            Déconnexion
          </button>
        </div>
      </header>

      {/* Contenu principal avec sidebar */}
      <div className="admin-body">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <ul>
              <li>
                <Link href="/admin/salles">Gestion des salles</Link>
              </li>
              <li>
                <Link href="/admin/mementos">Gestion des mementos</Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="admin-main">
          <div className="admin-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
