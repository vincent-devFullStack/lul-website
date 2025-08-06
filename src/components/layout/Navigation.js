"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import "../../styles/layout/Navigation.css";

export default function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { name: "Accueil", href: "/accueil" },
    { name: "Memento", href: "/memento" },
    { name: "À propos", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href) => pathname === href;

  return (
    <nav className="relative flex flex-col top-0 left-0 right-0 header-menu shadow-lg z-[100] h-[120px] items-center justify-center">
      <div className="w-full relative max-w-[1280px] mx-auto px-4">
        <div className="flex justify-center mb-3">
          <Link href="/" className="main-title" tabIndex="0">
            L'iconodule
          </Link>
        </div>

        <div className="flex justify-center items-center space-x-10 mb-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`header-link px-3 py-2 text-lg font-medium transition-colors duration-200 ${
                isActive(item.href)
                  ? "item-active"
                  : "hover:text-[var(--active-menu-item)]"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {isAuthenticated && (
          <div className="absolute top-5 right-5 flex items-center space-x-6">
            <Link
              href="/admin/salles"
              aria-label="Administration"
              role="button"
              className="text-[var(--admin-button-text)] hover:text-[var(--admin-button-hover-text)] transition-colors duration-200"
            >
              <Settings
                title="Administration"
                className="w-5 h-5 transition-transform duration-300 ease-in-out hover:rotate-90"
              />
            </Link>

            <button
              onClick={handleLogout}
              className="text-lg hover:text-[var(--active-menu-item)]"
            >
              Se déconnecter
            </button>
          </div>
        )}

        {!isAuthenticated && (
          <Link
            href="/login"
            className="absolute top-5 right-5 text-lg hover:text-[var(--active-menu-item)]"
          >
            Se connecter
          </Link>
        )}
      </div>
    </nav>
  );
}
