"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();

  const isEntryPage = pathname === "/";
  const isAccueilPage = pathname === "/accueil";

  useEffect(() => {
    if (isAccueilPage) {
      document.body.classList.add("no-responsive");
    } else {
      document.body.classList.remove("no-responsive");
    }
  }, [isAccueilPage]);

  return (
    <>
      {!isEntryPage && <Navigation />}
      <main className="flex-1">{children}</main>
      {!isEntryPage && <Footer />}
    </>
  );
}
