"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Prefetch + respect du prefers-reduced-motion
  useEffect(() => {
    router.prefetch("/accueil");
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = (m) => setReducedMotion(m.matches);
    apply(mq);
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, [router]);

  // Toute la page est cliquable
  const handleEnter = (e) => {
    if (isTransitioning) return;
    if (reducedMotion) return router.push("/accueil");
    setIsTransitioning(true);
    setTimeout(() => router.push("/accueil"), 700);
  };

  return (
    <main
      aria-labelledby="home-title"
      className={`relative min-h-screen sm:h-dvh transition-opacity duration-700 ease-out ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleEnter}
      style={{ cursor: "pointer" }}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleEnter();
      }}
      aria-label="Entrer sur le site L'Iconodule"
    >
      {/* Image de fond décorative */}
      <Image
        src="/assets/hero.webp"
        alt=""
        aria-hidden="true"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-contain object-center"
      />

      <div className="absolute inset-0 bg-black/1" aria-hidden="true" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <h1 id="home-title" className="sr-only">
          L'Iconodule – Musée de lul
        </h1>
        <div className="mt-32 sm:mt-48" aria-hidden="true" />
        <span className="text-white text-lg font-semibold bg-transparent px-8 py-3 rounded-full pointer-events-none select-none"></span>
      </div>
    </main>
  );
}
