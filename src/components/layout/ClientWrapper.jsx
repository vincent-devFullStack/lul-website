"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();

  const p = pathname || "/";
  const isEntryPage = p === "/";
  const isAdminPage = p.startsWith("/admin");

  return (
    <>
      {!isEntryPage && !isAdminPage && <Navigation />}
      <main className="flex-1">{children}</main>
      {!isEntryPage && !isAdminPage && <Footer />}
    </>
  );
}
