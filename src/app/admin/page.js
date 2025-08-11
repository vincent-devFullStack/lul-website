"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminHomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/salles");
  }, [router]);

  return (
    <div className="admin-loading" role="status" aria-live="polite">
      <div className="loading-spinner"></div>
      <p>Redirection…</p>
    </div>
  );
}
