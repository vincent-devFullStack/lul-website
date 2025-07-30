"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminHomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique vers la gestion des salles
    router.replace("/admin/salles");
  }, [router]);

  return (
    <div className="admin-loading">
      <div className="loading-spinner"></div>
      <p>Redirection...</p>
    </div>
  );
}