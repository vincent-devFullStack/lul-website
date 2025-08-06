"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { FiHome } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { MdOutlineRoomPreferences } from "react-icons/md";
import { BsQuote } from "react-icons/bs";
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
      <header className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-header-title">L'iconodule - Administration</h1>
        </div>
        <div className="admin-header-right">
          <Link href="/accueil" className="admin-header-link">
            <FiHome className="w-5 h-5 mr-2" />
            <span className="hidden md:block">Retour au site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="admin-header-link admin-header-logout"
          >
            <BiLogOut className="w-5 h-5 mr-2" />
            <span className="hidden md:block">Déconnexion</span>
          </button>
        </div>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <ul>
              <li>
                <Link href="/admin/salles" className="flex items-center gap-2">
                  <MdOutlineRoomPreferences className="w-5 h-5" />
                  Gestion des salles
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/mementos"
                  className="flex items-center gap-2"
                >
                  <BsQuote className="w-5 h-5" />
                  Gestion des mementos
                </Link>
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
