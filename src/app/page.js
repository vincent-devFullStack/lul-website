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

  const handleEnter = (e) => {
    e.preventDefault();
    if (reducedMotion) return router.push("/accueil");
    setIsTransitioning(true);
    setTimeout(() => router.push("/accueil"), 700); // durée Tailwind valide
  };

  return (
    <main
      aria-labelledby="home-title"
      className={`relative min-h-screen sm:h-dvh transition-opacity duration-700 ease-out ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`}
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
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/10" aria-hidden="true" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <h1 id="home-title" className="sr-only">
          L&apos;Iconodule – Galerie
        </h1>

        {/* Espace sous le haut de page (valeur Tailwind valide) */}
        <div className="mt-32 sm:mt-48" aria-hidden="true" />

        <button
          type="button"
          onClick={handleEnter}
          className="group relative overflow-hidden rounded-full border border-[#aa9980]/60 bg-[#544a39]/30 px-8 py-3 text-sm font-light tracking-widest text-[#f0e9df] backdrop-blur-md transition-all duration-300 hover:border-[#cbb99e]/70 hover:bg-[#433a2d]/50 hover:shadow-[0_0_15px_rgba(170,153,128,0.3)] focus:outline-none focus:ring-2 focus:ring-[#cbb99e]/30 mt-80 sm:mt-0 cursor-pointer"
          aria-label="Entrer dans le site"
        >
          Entrer
        </button>
      </div>
    </main>
  );
}
