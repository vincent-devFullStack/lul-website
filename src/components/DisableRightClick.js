"use client";

import { useEffect } from "react";

export default function DisableRightClick({ children }) {
  useEffect(() => {
    const onContextMenu = (e) => {
      // Laisse le clic droit dans les champs de saisie
      if (e.target.closest("input, textarea")) return;
      e.preventDefault();
    };

    document.addEventListener("contextmenu", onContextMenu);
    return () => document.removeEventListener("contextmenu", onContextMenu);
  }, []);

  return <>{children}</>;
}
