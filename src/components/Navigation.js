"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Navigation.css";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

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
        {/* Logo fixe */}
        <div className="flex justify-center mb-3">
          <Link href="/" className="text-[56px] font-bold leading-none">
            L'iconodule
          </Link>
        </div>

        {/* Navigation desktop (visible toujours, pas responsive) */}
        <div className="flex justify-center space-x-10 mb-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`px-3 py-2 text-lg font-medium transition-colors duration-200 ${
                isActive(item.href)
                  ? "item-active"
                  : "hover:text-[var(--active-menu-item)]"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Lien administration positionné à droite */}
        <Link
          href="/back-office/login"
          className="absolute top-5 right-5 text-lg hover:text-[var(--active-menu-item)]"
        >
          Administration
        </Link>
      </div>
    </nav>
  );
}
