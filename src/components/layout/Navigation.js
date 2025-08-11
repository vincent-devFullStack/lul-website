"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Settings, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import "../../styles/layout/Navigation.css";

export default function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((v) => !v);
  const closeMobileMenu = () => setMobileMenuOpen(false);

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

  // Ferme le menu si l’URL change
  useEffect(() => {
    if (mobileMenuOpen) closeMobileMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Empêche le scroll du body lorsque le menu mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className="header-menu sticky top-0 left-0 right-0 w-full shadow-lg z-50">
        <div className="w-full flex md:justify-between lg:justify-center px-4">
          {/* Desktop */}
          <div className="hidden lg:flex flex-col items-center justify-center h-[120px]">
            <div className="flex justify-center mb-3">
              <Link href="/" className="main-title">
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
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {isAuthenticated ? (
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
                  type="button"
                  onClick={handleLogout}
                  className="text-lg hover:text-[var(--active-menu-item)]"
                >
                  Se déconnecter
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="absolute top-5 right-5 text-lg hover:text-[var(--active-menu-item)]"
              >
                Se connecter
              </Link>
            )}
          </div>

          {/* Mobile header */}
          <div className="flex lg:hidden items-center h-16 md:h-20 w-full">
            <Link
              href="/"
              className="main-title text-xl sm:text-2xl md:text-3xl flex-shrink-0"
            >
              L'iconodule
            </Link>

            <div className="flex-grow" />

            <button
              type="button"
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-[rgba(191,167,106,0.1)] hover:bg-[rgba(191,167,106,0.2)] transition-all duration-300 z-50 flex-shrink-0"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-drawer"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-[var(--foreground)]" />
              ) : (
                <Menu className="h-6 w-6 text-[var(--foreground)]" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="fixed inset-0 bg-black/50 transition-opacity duration-300"
          onClick={closeMobileMenu}
        />

        <div
          id="mobile-drawer"
          className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-[var(--header-background)] via-white to-[var(--login-background)] shadow-xl transform transition-transform duration-300 ease-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between p-6 border-b border-[rgba(191,167,106,0.2)]">
            <span className="text-lg font-semibold text-[var(--foreground)]">
              Menu
            </span>
            <button
              type="button"
              onClick={closeMobileMenu}
              className="p-2 rounded-lg hover:bg-[rgba(191,167,106,0.1)] transition-colors duration-200"
            >
              <X className="h-5 w-5 text-[var(--foreground)]" />
            </button>
          </div>

          <div className="px-6 py-4 space-y-2">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:translate-x-2 ${
                  isActive(item.href)
                    ? "bg-[rgba(191,167,106,0.2)] text-[var(--active-menu-item)] font-semibold border-l-4 border-[var(--active-menu-item)]"
                    : "text-[var(--foreground)] hover:bg-[rgba(191,167,106,0.1)] hover:text-[var(--active-menu-item)]"
                }`}
                aria-current={isActive(item.href) ? "page" : undefined}
                style={{
                  animationDelay: mobileMenuOpen ? `${index * 100}ms` : "0ms",
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="mx-6 border-t border-[rgba(191,167,106,0.2)]" />

          <div className="px-6 py-4 space-y-2">
            {isAuthenticated && (
              <>
                <Link
                  href="/admin/salles"
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 py-3 rounded-lg font-medium text-[var(--brown)] hover:bg-[rgba(191,167,106,0.1)] hover:text-[var(--active-menu-item)] transition-all duration-200"
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Administration
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-[var(--active-menu-item)] hover:bg-[rgba(191,167,106,0.1)] hover:text-[var(--brown)] transition-all duration-200"
                >
                  Se déconnecter
                </button>
              </>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[rgba(191,167,106,0.1)] to-transparent">
            <p className="text-xs text-[var(--foreground)] opacity-70 text-center">
              L'iconodule © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
