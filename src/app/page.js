"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleEnter = (e) => {
    e.preventDefault();
    setIsTransitioning(true);

    // Délai pour l'animation de fondu avant navigation
    setTimeout(() => {
      router.push("/accueil");
    }, 800);
  };

  return (
    <main
      className={`relative h-dvh transition-opacity duration-800 ease-out ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Image de fond */}
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

      {/* Voile léger */}
      <div className="absolute inset-0 bg-black/10" aria-hidden="true" />

      {/* Contenu centré */}
      <div className="relative z-10 flex flex-col h-full items-center justify-center">
        <h1 className="sr-only">L'Iconodule – Galerie</h1>

        {/* Espace pour descendre le bouton */}
        <div className="mt-30 sm:mt-48"></div>

        {/* Bouton retravaillé */}
        <button
          onClick={handleEnter}
          className="group relative overflow-hidden rounded-full border border-[#aa9980]/60 bg-[#544a39]/30 px-8 py-3 text-sm font-light tracking-widest text-[#f0e9df] backdrop-blur-md transition-all duration-300 hover:bg-[#433a2d]/50 hover:border-[#cbb99e]/70 hover:shadow-[0_0_15px_rgba(170,153,128,0.3)] focus:outline-none focus:ring-2 focus:ring-[#cbb99e]/30"
          aria-label="Entrer dans le site"
        >
          <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
            Entrer
          </span>

          {/* Effet de brillance au survol */}
          <span
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#f0e9df]/10 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
            aria-hidden="true"
          />
        </button>
      </div>
    </main>
  );
}
